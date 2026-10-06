-- =========================================================================
-- 0003 — Integrations: card payments, email notifications, product images
-- =========================================================================
-- Safe to run on top of EITHER base schema (drizzle/migrations/0000-0002 or
-- supabase/schema.sql). Every statement is idempotent.
-- Run it in the Supabase SQL Editor after the base schema.
-- =========================================================================

-- -------------------------------------------------------------------------
-- 1. ORDERS: payment + notification tracking
-- -------------------------------------------------------------------------
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS payment_status TEXT NOT NULL DEFAULT 'unpaid',
  ADD COLUMN IF NOT EXISTS payment_provider TEXT,
  ADD COLUMN IF NOT EXISTS payment_provider_ref TEXT,
  ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS notified_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- payment_status: unpaid | pending | paid | failed | refunded
-- 'unpaid'  = manual methods (Vodafone Cash / InstaPay / COD) awaiting owner check
-- 'pending' = card payment started, waiting for the gateway callback
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'orders_payment_status_check'
  ) THEN
    ALTER TABLE public.orders
      ADD CONSTRAINT orders_payment_status_check
      CHECK (payment_status IN ('unpaid', 'pending', 'paid', 'failed', 'refunded'));
  END IF;
END $$;

-- Order numbers must always have a default (the base schema.sql forgot it).
ALTER TABLE public.orders
  ALTER COLUMN order_number
  SET DEFAULT ('LS-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8)));

CREATE INDEX IF NOT EXISTS idx_orders_payment_provider_ref
  ON public.orders(payment_provider_ref);

-- -------------------------------------------------------------------------
-- 2. OWNER CHECK — hardened
-- -------------------------------------------------------------------------
-- The email shortcut now requires a CONFIRMED email. Without this, anyone who
-- registers norafayed06@gmail.com while "Confirm email" is off becomes owner.
CREATE OR REPLACE FUNCTION public.is_store_owner()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT
    EXISTS (
      SELECT 1 FROM auth.users u
      WHERE u.id = auth.uid()
        AND u.email_confirmed_at IS NOT NULL
        AND LOWER(u.email) = 'norafayed06@gmail.com'
    )
    OR EXISTS (
      SELECT 1 FROM public.user_roles r
      WHERE r.user_id = auth.uid()
        AND r.role::text = 'owner'
    );
$$;

-- -------------------------------------------------------------------------
-- 3. ORDERS are now created ONLY by the server (service role)
-- -------------------------------------------------------------------------
-- Reason: with a public INSERT policy anyone holding the anon key could insert
-- an order with payment_status = 'paid' or a tampered total. The server
-- function `placeOrder` re-prices every order from the products table.
-- The service role bypasses RLS, so it keeps working.
DROP POLICY IF EXISTS "Public orders insert" ON public.orders;
DROP POLICY IF EXISTS "orders insert anyone" ON public.orders;
REVOKE INSERT ON public.orders FROM anon, authenticated;

-- Customers can still read their own orders (account page) and the owner can
-- read/update everything via the existing SELECT / UPDATE policies.
-- Guests look orders up through the server function `lookupOrder`.

-- -------------------------------------------------------------------------
-- 4. STORAGE: product images bucket (public read, owner-only write)
-- -------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  5242880, -- 5 MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
)
ON CONFLICT (id) DO UPDATE
  SET public = EXCLUDED.public,
      file_size_limit = EXCLUDED.file_size_limit,
      allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Public read product images" ON storage.objects;
CREATE POLICY "Public read product images" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Owner upload product images" ON storage.objects;
CREATE POLICY "Owner upload product images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'product-images' AND public.is_store_owner());

DROP POLICY IF EXISTS "Owner update product images" ON storage.objects;
CREATE POLICY "Owner update product images" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'product-images' AND public.is_store_owner());

DROP POLICY IF EXISTS "Owner delete product images" ON storage.objects;
CREATE POLICY "Owner delete product images" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'product-images' AND public.is_store_owner());

-- -------------------------------------------------------------------------
-- 5. CARD payment method row (replaces the "being connected" placeholder)
-- -------------------------------------------------------------------------
ALTER TABLE public.payment_methods
  ADD COLUMN IF NOT EXISTS label_ar TEXT,
  ADD COLUMN IF NOT EXISTS instructions_ar TEXT;

UPDATE public.payment_methods
SET instructions = 'Pay securely by Visa / Mastercard / Meeza on the next page. Your order is confirmed automatically once the payment succeeds.',
    instructions_ar = 'ادفعي بأمان بفيزا أو ماستركارد أو ميزة في الصفحة التالية. يتأكد طلبك تلقائياً بمجرد نجاح الدفع.'
WHERE code = 'card';

-- Done.
