CREATE TABLE public.custom_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  design_type text NOT NULL,
  description text NOT NULL,
  preferred_style text,
  preferred_colors text,
  deadline date,
  budget text,
  reference_url text,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.custom_orders TO authenticated;
GRANT INSERT ON public.custom_orders TO anon;
GRANT ALL ON public.custom_orders TO service_role;
ALTER TABLE public.custom_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "custom orders insert anyone" ON public.custom_orders FOR INSERT TO anon, authenticated WITH CHECK ((user_id IS NULL) OR (user_id = auth.uid()));
CREATE POLICY "custom orders read own" ON public.custom_orders FOR SELECT TO authenticated USING ((user_id = auth.uid()) OR public.has_role(auth.uid(), 'owner'));
CREATE POLICY "custom orders owner update" ON public.custom_orders FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'owner')) WITH CHECK (public.has_role(auth.uid(), 'owner'));

CREATE TABLE public.portfolio_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  name_ar text,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.portfolio_categories TO authenticated;
GRANT SELECT ON public.portfolio_categories TO anon;
GRANT ALL ON public.portfolio_categories TO service_role;
ALTER TABLE public.portfolio_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "portfolio cats public read" ON public.portfolio_categories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "portfolio cats owner write" ON public.portfolio_categories FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'owner')) WITH CHECK (public.has_role(auth.uid(), 'owner'));

CREATE TABLE public.portfolio_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  title_ar text,
  summary text,
  summary_ar text,
  description text,
  description_ar text,
  cover_url text,
  gallery jsonb NOT NULL DEFAULT '[]'::jsonb,
  category_id uuid REFERENCES public.portfolio_categories(id) ON DELETE SET NULL,
  external_url text,
  is_published boolean NOT NULL DEFAULT true,
  is_featured boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.portfolio_projects TO authenticated;
GRANT SELECT ON public.portfolio_projects TO anon;
GRANT ALL ON public.portfolio_projects TO service_role;
ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "portfolio public read" ON public.portfolio_projects FOR SELECT TO anon, authenticated USING (is_published OR public.has_role(auth.uid(), 'owner'));
CREATE POLICY "portfolio owner write" ON public.portfolio_projects FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'owner')) WITH CHECK (public.has_role(auth.uid(), 'owner'));

CREATE TABLE public.addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  label text,
  full_name text NOT NULL,
  phone text NOT NULL,
  alt_phone text,
  address text NOT NULL,
  city text NOT NULL,
  governorate text,
  postal_code text,
  is_default boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.addresses TO authenticated;
GRANT ALL ON public.addresses TO service_role;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "addresses own all" ON public.addresses FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.contact_messages TO anon;
GRANT SELECT, INSERT ON public.contact_messages TO authenticated;
GRANT ALL ON public.contact_messages TO service_role;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "contact insert anyone" ON public.contact_messages FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "contact owner read" ON public.contact_messages FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'owner'));