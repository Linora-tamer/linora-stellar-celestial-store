-- Roles
CREATE TYPE public.app_role AS ENUM ('owner', 'customer');

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  email text,
  phone text,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile select" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "own profile insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "own profile update" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- Auto profile + owner grant
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, avatar_url)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.email, NEW.raw_user_meta_data->>'avatar_url')
  ON CONFLICT (id) DO NOTHING;

  IF lower(coalesce(NEW.email, '')) = 'norafayed06@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'owner') ON CONFLICT DO NOTHING;
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'customer') ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Catalog
CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.categories TO authenticated;
GRANT ALL ON public.categories TO service_role;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "categories public read" ON public.categories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "categories owner write" ON public.categories FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'owner')) WITH CHECK (public.has_role(auth.uid(), 'owner'));

CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  tagline text,
  description text,
  price numeric(10,2) NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'EGP',
  image_url text,
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  is_active boolean NOT NULL DEFAULT true,
  is_featured boolean NOT NULL DEFAULT false,
  customizable boolean NOT NULL DEFAULT false,
  details jsonb NOT NULL DEFAULT '[]'::jsonb,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "products public read" ON public.products FOR SELECT TO anon, authenticated USING (is_active OR public.has_role(auth.uid(), 'owner'));
CREATE POLICY "products owner write" ON public.products FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'owner')) WITH CHECK (public.has_role(auth.uid(), 'owner'));

-- Payment methods & settings
CREATE TABLE public.payment_methods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  label text NOT NULL,
  instructions text,
  account_number text,
  is_active boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0
);
GRANT SELECT ON public.payment_methods TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.payment_methods TO authenticated;
GRANT ALL ON public.payment_methods TO service_role;
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
CREATE POLICY "payment public read" ON public.payment_methods FOR SELECT TO anon, authenticated USING (is_active OR public.has_role(auth.uid(), 'owner'));
CREATE POLICY "payment owner write" ON public.payment_methods FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'owner')) WITH CHECK (public.has_role(auth.uid(), 'owner'));

CREATE TABLE public.site_settings (
  key text PRIMARY KEY,
  value text
);
GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "settings public read" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "settings owner write" ON public.site_settings FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'owner')) WITH CHECK (public.has_role(auth.uid(), 'owner'));

-- Orders
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text NOT NULL UNIQUE DEFAULT ('LS-' || upper(substr(replace(gen_random_uuid()::text,'-',''), 1, 8))),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  alt_phone text,
  national_id text,
  address text NOT NULL,
  city text NOT NULL,
  governorate text,
  postal_code text,
  notes text,
  payment_method text NOT NULL,
  payment_reference text,
  status text NOT NULL DEFAULT 'pending',
  total numeric(10,2) NOT NULL DEFAULT 0,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.orders TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "orders insert anyone" ON public.orders FOR INSERT TO anon, authenticated WITH CHECK (user_id IS NULL OR user_id = auth.uid());
CREATE POLICY "orders read own" ON public.orders FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'owner'));
CREATE POLICY "orders owner update" ON public.orders FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'owner')) WITH CHECK (public.has_role(auth.uid(), 'owner'));

-- Seed
INSERT INTO public.categories (slug, name, description, sort_order) VALUES
  ('digital', 'Digital Downloads', 'Instant-download planners, templates and printables.', 1),
  ('print', 'Print & Paper', 'Labels, stationery, invitations and wall art.', 2),
  ('kids', 'Kids & Classroom', 'Activity books and classroom packs for little stars.', 3),
  ('branding', 'Branding Services', 'Brand identity and social media design.', 4),
  ('merch', 'Merch', 'Customisable t-shirts, mugs and hoodies.', 5);

INSERT INTO public.site_settings (key, value) VALUES
  ('brand_name', 'Linora Stellar'),
  ('whatsapp', '+201040277935'),
  ('email', 'norafayed06@gmail.com'),
  ('instagram', 'https://instagram.com/linora.stellar'),
  ('behance', 'https://behance.net/norafayed1'),
  ('linkedin', 'https://linkedin.com/in/nora-tamer-b80704391'),
  ('tagline', 'Celestial design for everyday brands');

INSERT INTO public.payment_methods (code, label, instructions, account_number, sort_order) VALUES
  ('vodafone_cash', 'Vodafone Cash', 'Send the total to this Vodafone Cash number, then paste the transfer reference below.', '+201040277935', 1),
  ('instapay', 'InstaPay', 'Transfer the total via InstaPay to this number, then paste the transfer reference below.', '+201040277935', 2),
  ('cod', 'Cash on Delivery', 'Pay in cash when your order arrives. Available inside Egypt only.', NULL, 3),
  ('card', 'Credit / Debit Card', 'Card payments are being activated. Choose another method for now or contact us on WhatsApp.', NULL, 4);

INSERT INTO public.products (slug, name, tagline, description, price, category_id, is_featured, customizable, details, sort_order) VALUES
  ('starlight-product-labels', 'Starlight Product Labels', 'Elegant labels for small businesses', 'A set of celestial product labels with the four-pointed star motif in navy and gold. Print-ready and easy to personalise with your product name, weight and ingredients.', 250, (SELECT id FROM public.categories WHERE slug='print'), true, true, '["Print-ready PDF + editable file","Circle, square and rectangle shapes","Navy, gold and cream colourways"]', 1),
  ('constellation-digital-planner', 'Constellation Digital Planner', 'A full year, beautifully organised', 'A hyperlinked digital planner for tablets with monthly, weekly and daily spreads, habit trackers and goal pages, wrapped in a starry navy cover.', 400, (SELECT id FROM public.categories WHERE slug='digital'), true, false, '["Undated, use any year","Hyperlinked tabs","Works with GoodNotes and Notability"]', 2),
  ('celestial-wall-art-set', 'Celestial Wall Art Set', 'Three prints, one night sky', 'A trio of printable wall art pieces: a star map, a crescent study and a minimal quote print, all in the Linora Stellar navy-and-gold palette.', 300, (SELECT id FROM public.categories WHERE slug='print'), true, false, '["3 high-resolution files","A4, A3 and 50x70 sizes","Print at home or at any print shop"]', 3),
  ('stellar-stationery-set', 'Stellar Stationery Set', 'Notebook, notecards and tags', 'A coordinated stationery set with a starry notebook cover, folded notecards and gift tags, designed to make every note feel like a small ceremony.', 350, (SELECT id FROM public.categories WHERE slug='print'), false, true, '["Editable names and messages","Includes envelope liner","Ready to print"]', 4),
  ('midnight-invitation-suite', 'Midnight Invitation Suite', 'For weddings and celebrations', 'An invitation suite with main invite, details card and RSVP, finished with gold foil-look stars on a deep navy ground.', 500, (SELECT id FROM public.categories WHERE slug='print'), true, true, '["Names, date and venue personalised","3 coordinated cards","Digital or print delivery"]', 5),
  ('little-stars-classroom-pack', 'Little Stars Classroom Pack', 'Everything a teacher needs', 'A printable classroom pack with name tags, reward charts, schedule cards and door signs in a friendly celestial theme.', 450, (SELECT id FROM public.categories WHERE slug='kids'), false, true, '["Student names added for you","Arabic and English versions","40+ printable pages"]', 6),
  ('stargazer-activity-book', 'Stargazer Activity Book', 'Puzzles under the night sky', 'A 30-page activity book for children with mazes, colouring pages, star facts and dot-to-dot constellations.', 200, (SELECT id FROM public.categories WHERE slug='kids'), false, false, '["Ages 4-10","30 printable pages","Black-and-white, printer friendly"]', 7),
  ('brand-identity-package', 'Brand Identity Package', 'A complete look for your brand', 'A bespoke identity service: logo suite, colour palette, typography, patterns and a simple brand guide so your brand stays consistent everywhere.', 4500, (SELECT id FROM public.categories WHERE slug='branding'), true, false, '["3 initial concepts","2 revision rounds","Full file pack + brand guide"]', 8),
  ('social-media-template-pack', 'Social Media Template Pack', '30 posts, one cohesive feed', 'Thirty editable social templates for posts, stories and highlight covers, built on the Linora Stellar grid so your feed looks designed, not assembled.', 600, (SELECT id FROM public.categories WHERE slug='branding'), false, false, '["Canva editable links","Posts, stories and covers","Colour swap in one click"]', 9),
  ('stellar-tshirt', 'Stellar T-Shirt', 'Wear the night sky', 'A soft cotton t-shirt printed with the four-pointed star. Choose your colour, size and add your name in gold script.', 450, (SELECT id FROM public.categories WHERE slug='merch'), true, true, '["100% cotton","S to XXL","Name printing available"]', 10),
  ('stellar-mug', 'Stellar Mug', 'Mornings, elevated', 'A ceramic mug with the celestial crest wrapped around it. Add a name or a short line to make it a gift.', 250, (SELECT id FROM public.categories WHERE slug='merch'), true, true, '["330ml ceramic","Dishwasher safe print","Name or message added"]', 11),
  ('stellar-hoodie', 'Stellar Hoodie', 'Cosy, with a constellation', 'A heavyweight hoodie with an embroidered-look star on the chest and a subtle constellation on the sleeve.', 850, (SELECT id FROM public.categories WHERE slug='merch'), false, true, '["Fleece lined","S to XXL","Navy, black or cream"]', 12),
  ('luxe-gift-tags', 'Luxe Gift Tags', 'Small details, big impression', 'A sheet of twelve gift tags in four celestial designs, perfect for shops wrapping orders or for personal gifting.', 150, (SELECT id FROM public.categories WHERE slug='print'), false, true, '["12 tags per sheet","4 designs","Add your shop name"]', 13),
  ('business-card-design', 'Business Card Design', 'The first thing they keep', 'A double-sided business card designed around your brand, with a starry back and clean, readable front.', 700, (SELECT id FROM public.categories WHERE slug='branding'), false, false, '["Print-ready CMYK PDF","2 concepts","Includes bleed and crop marks"]', 14),
  ('weekly-meal-planner', 'Weekly Meal Planner', 'Plan the week in one page', 'A printable weekly meal planner with a shopping list column and a notes panel, in soft dawn colours.', 120, (SELECT id FROM public.categories WHERE slug='digital'), false, false, '["A4 and US Letter","Print or fill digitally","Undated"]', 15),
  ('budget-tracker-printables', 'Budget Tracker Printables', 'Money, clearly mapped', 'A set of budget printables: monthly overview, bill tracker, savings goals and a debt snowball page.', 180, (SELECT id FROM public.categories WHERE slug='digital'), false, false, '["8 printable pages","Monthly and yearly views","Simple, no formulas"]', 16),
  ('birthday-party-kit', 'Birthday Party Kit', 'A celestial celebration', 'A printable party kit with invitations, banner letters, cupcake toppers, water bottle labels and thank-you cards.', 380, (SELECT id FROM public.categories WHERE slug='kids'), false, true, '["Name and age personalised","6 printable items","Boy, girl and neutral palettes"]', 17),
  ('custom-portrait-illustration', 'Custom Portrait Illustration', 'You, drawn among the stars', 'A hand-drawn digital portrait in the Linora Stellar style, delivered as a high-resolution file ready to print or share.', 900, (SELECT id FROM public.categories WHERE slug='branding'), false, true, '["1-3 people per portrait","High-resolution PNG + print file","5-7 day turnaround"]', 18);