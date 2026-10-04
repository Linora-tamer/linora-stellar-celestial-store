-- =========================================================================
-- LINORA STELLAR — PRODUCTION SUPABASE DATABASE SCHEMA & RLS POLICIES
-- =========================================================================
-- This script provisions all tables, constraints, indexes, Row Level Security
-- (RLS) policies, and seed data required for Linora Stellar.
-- Run this in the Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)
-- =========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -------------------------------------------------------------------------
-- 1. CATEGORIES TABLE
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY DEFAULT ('cat-' || uuid_generate_v4()::text),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    name_ar TEXT,
    description TEXT,
    description_ar TEXT,
    sort_order INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -------------------------------------------------------------------------
-- 2. PRODUCTS TABLE
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY DEFAULT ('prod-' || uuid_generate_v4()::text),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    name_ar TEXT,
    tagline TEXT,
    tagline_ar TEXT,
    description TEXT,
    description_ar TEXT,
    price NUMERIC(10, 2) NOT NULL DEFAULT 0,
    image_url TEXT,
    category_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    customizable BOOLEAN DEFAULT false,
    details JSONB DEFAULT '[]'::jsonb,
    sort_order INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -------------------------------------------------------------------------
-- 3. PAYMENT METHODS TABLE
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.payment_methods (
    id TEXT PRIMARY KEY DEFAULT ('pm-' || uuid_generate_v4()::text),
    code TEXT UNIQUE NOT NULL,
    label TEXT NOT NULL,
    label_ar TEXT,
    instructions TEXT,
    instructions_ar TEXT,
    account_number TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -------------------------------------------------------------------------
-- 4. SITE SETTINGS TABLE
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.site_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -------------------------------------------------------------------------
-- 5. ORDERS TABLE
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    alt_phone TEXT,
    national_id TEXT,
    address TEXT,
    city TEXT,
    governorate TEXT,
    postal_code TEXT,
    notes TEXT,
    payment_method TEXT NOT NULL DEFAULT 'vodafone_cash',
    payment_reference TEXT,
    total NUMERIC(10, 2) NOT NULL DEFAULT 0,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    status TEXT NOT NULL DEFAULT 'pending', -- pending, confirmed, shipped, delivered, cancelled
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -------------------------------------------------------------------------
-- 6. CUSTOM DESIGN REQUESTS (COMMISSIONS)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.custom_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    design_type TEXT NOT NULL,
    description TEXT NOT NULL,
    preferred_style TEXT,
    preferred_colors TEXT,
    budget TEXT,
    deadline TEXT,
    reference_url TEXT,
    status TEXT NOT NULL DEFAULT 'pending', -- pending, contacted, in_progress, completed, rejected
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -------------------------------------------------------------------------
-- 7. CONTACT MESSAGES TABLE
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -------------------------------------------------------------------------
-- 8. PRODUCT REVIEWS TABLE
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_slug TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    user_name TEXT NOT NULL,
    user_city TEXT,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    comment TEXT NOT NULL,
    verified BOOLEAN DEFAULT true,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -------------------------------------------------------------------------
-- 9. USER ROLES & PROFILES
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'customer', -- 'owner', 'admin', 'customer'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, role)
);

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    phone TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    alt_phone TEXT,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    governorate TEXT,
    postal_code TEXT,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================================
-- INDEXES FOR FAST FILTERING & SEARCH
-- =========================================================================
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_email ON public.orders(email);
CREATE INDEX IF NOT EXISTS idx_orders_phone ON public.orders(phone);
CREATE INDEX IF NOT EXISTS idx_reviews_product_slug ON public.reviews(product_slug);

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;

-- Helper function to check if caller is store owner
CREATE OR REPLACE FUNCTION public.is_store_owner()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND LOWER(auth.users.email) = 'norafayed06@gmail.com'
    )
    OR
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'owner'
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Categories & Products: Public Read, Owner Write
CREATE POLICY "Public categories read" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Owner categories write" ON public.categories FOR ALL USING (public.is_store_owner());

CREATE POLICY "Public products read" ON public.products FOR SELECT USING (is_active = true OR public.is_store_owner());
CREATE POLICY "Owner products write" ON public.products FOR ALL USING (public.is_store_owner());

-- Payment Methods & Settings: Public Read, Owner Write
CREATE POLICY "Public payment methods read" ON public.payment_methods FOR SELECT USING (is_active = true OR public.is_store_owner());
CREATE POLICY "Owner payment methods write" ON public.payment_methods FOR ALL USING (public.is_store_owner());

CREATE POLICY "Public settings read" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Owner settings write" ON public.site_settings FOR ALL USING (public.is_store_owner());

-- Orders: Public/Guest Insert, Customers read own orders, Owner reads/modifies all
CREATE POLICY "Public orders insert" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Owner orders select" ON public.orders FOR SELECT USING (
  public.is_store_owner() OR (auth.uid() IS NOT NULL AND user_id = auth.uid())
);
CREATE POLICY "Owner orders update" ON public.orders FOR UPDATE USING (public.is_store_owner());

-- Custom Orders: Public Insert, Owner Read/Write
CREATE POLICY "Public custom_orders insert" ON public.custom_orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Owner custom_orders select" ON public.custom_orders FOR SELECT USING (public.is_store_owner());
CREATE POLICY "Owner custom_orders update" ON public.custom_orders FOR UPDATE USING (public.is_store_owner());

-- Contact Messages: Public Insert, Owner Read
CREATE POLICY "Public contact insert" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Owner contact select" ON public.contact_messages FOR SELECT USING (public.is_store_owner());

-- Reviews: Public Read published, Public Insert, Owner Moderate
CREATE POLICY "Public reviews select" ON public.reviews FOR SELECT USING (is_published = true OR public.is_store_owner());
CREATE POLICY "Public reviews insert" ON public.reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Owner reviews moderate" ON public.reviews FOR ALL USING (public.is_store_owner());

-- Profiles & Addresses: User reads/writes own, Owner reads all
CREATE POLICY "Users profiles select" ON public.profiles FOR SELECT USING (auth.uid() = id OR public.is_store_owner());
CREATE POLICY "Users profiles write" ON public.profiles FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users addresses select" ON public.addresses FOR SELECT USING (auth.uid() = user_id OR public.is_store_owner());
CREATE POLICY "Users addresses write" ON public.addresses FOR ALL USING (auth.uid() = user_id);

-- User Roles: Read own role, Owner manages
CREATE POLICY "User roles select" ON public.user_roles FOR SELECT USING (auth.uid() = user_id OR public.is_store_owner());
CREATE POLICY "Owner user roles write" ON public.user_roles FOR ALL USING (public.is_store_owner());

-- =========================================================================
-- INITIAL SEED DATA
-- =========================================================================
INSERT INTO public.categories (id, slug, name, name_ar, description, description_ar, sort_order)
VALUES
  ('cat-1', 'digital', 'Digital Downloads', 'تنزيلات رقمية', 'Instant-download planners, templates and printables.', 'مخططات وقوالب وتصميمات قابلة للتنزيل الفوري.', 1),
  ('cat-2', 'print', 'Print & Paper', 'مطبوعات وورقيات', 'Labels, stationery, invitations and wall art.', 'ملصقات وأدوات مكتبية ودعوات ولوحات جدارية.', 2),
  ('cat-3', 'kids', 'Kids & Classroom', 'أطفال وفصول دراسية', 'Activity books and classroom packs for little stars.', 'كتب أنشطة وباقات مدرسية للنجوم الصغار.', 3),
  ('cat-4', 'branding', 'Branding Services', 'خدمات الهوية البصرية', 'Brand identity and social media design.', 'هوية بصرية وتصميم شبكات التواصل الاجتماعي.', 4),
  ('cat-5', 'merch', 'Merch', 'منتجات حصرية', 'Customisable t-shirts, mugs and hoodies.', 'تيشيرتات ومجات وهوديز قابلة للتخصيص.', 5)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.payment_methods (id, code, label, label_ar, instructions, instructions_ar, account_number, is_active, sort_order)
VALUES
  ('pm-1', 'vodafone_cash', 'Vodafone Cash', 'فودافون كاش', 'Send the total to our Vodafone Cash wallet (01040277935), then paste your sender number or transaction ID below.', 'حوّلي إجمالي الطلب إلى محفظة فودافون كاش (01040277935)، ثم اكتبي رقم المحفظة المحوّل منها أو رقم العملية بالأسفل.', '01040277935', true, 1),
  ('pm-2', 'instapay', 'InstaPay', 'إنستاباي (InstaPay)', 'Transfer the total via InstaPay to 01040277935 or username norafayed06@instapay, then paste your reference below.', 'حوّلي إجمالي الطلب عبر إنستاباي إلى الرقم 01040277935 أو المعرف norafayed06@instapay، ثم اكتبي اسم المستخدم أو رقم الحوالة بالأسفل.', '01040277935 (norafayed06@instapay)', true, 2),
  ('pm-3', 'cod', 'Cash on Delivery', 'الدفع عند الاستلام', 'Pay in cash when your order arrives at your doorstep. Available across all governorates in Egypt.', 'ادفعي نقداً للمندوب عند استلام الشحنة أمام باب منزلك. متاح لجميع محافظات جمهورية مصر العربية.', null, true, 3),
  ('pm-4', 'card', 'Credit / Debit Card', 'بطاقة بنكية / فيزا وماستركارد', 'Card payments are being connected. Choose Vodafone Cash, InstaPay or Cash on Delivery for instant processing.', 'بوابة الدفع الإلكتروني قيد الربط المصرفي. يرجى اختيار فودافون كاش أو إنستاباي أو الدفع عند الاستلام لتنفيذ طلبك فوراً.', null, true, 4)
ON CONFLICT (code) DO NOTHING;

INSERT INTO public.site_settings (key, value)
VALUES
  ('brand_name', 'Linora Stellar'),
  ('whatsapp', '+201040277935'),
  ('email', 'norafayed06@gmail.com'),
  ('instagram', 'https://instagram.com/linora.stellar'),
  ('behance', 'https://behance.net/norafayed1'),
  ('linkedin', 'https://linkedin.com/in/nora-tamer-b80704391'),
  ('tagline', 'Celestial design for everyday brands')
ON CONFLICT (key) DO NOTHING;

-- Done! Your database is ready for production.
