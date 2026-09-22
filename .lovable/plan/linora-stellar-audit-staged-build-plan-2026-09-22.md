# Linora Stellar — Audit + Staged Build Plan

## What the audit found

**Already working (keep, do not rebuild)**
- Celestial navy-and-gold look, star mark, starfield, Cormorant + Jost type
- Pages: Home, Shop, Product page with personalisation, Cart, Checkout, Order confirmation, Our Story, FAQ
- Backend: products, categories, payment methods, site settings, orders, customer profiles, owner role (your email becomes owner automatically), email + Google/Apple/Microsoft sign-in switched on
- 18 products with prices, descriptions and generated photos; your real contact details
- Cart saved in the browser; five time-of-day looks (Dawn/Morning/Day/Dusk/Night) with an Auto switch

**Broken or missing right now**
- The menu links to Portfolio, Custom Orders and Contact, but those pages do not exist yet — the site errors on those links
- No sign-in / sign-up / account pages, no owner dashboard
- Time of day jumps between five fixed looks instead of flowing continuously
- English only; no Arabic, no right-to-left
- No services, collections, wishlist, shipping, reviews, order statuses or custom-order records
- No card gateway (Vodafone Cash / InstaPay / Cash on Delivery exist as manual methods)

**Content rule respected:** no invented products, reviews or portfolio projects. Where real work is missing (portfolio pieces, services copy), the page shows an empty state you fill in from the dashboard.

## Honest scoping note

The full brief is roughly ten separate products' worth of work. Building it in one pass would break the parts that already work. I will ship it in stages, each one testable in the preview, in this order:

## Stage 1 — Stop the errors, finish the shopfront
- Portfolio, Custom Orders and Contact pages (real content where you have it, admin-managed empty state where you don't)
- Sign in / sign up / forgot password / reset password, with Google, Apple, Microsoft and email
- Customer account: profile, saved addresses, order history, order detail
- Custom order requests saved to the database instead of disappearing

## Stage 2 — Bilingual Arabic + English
- Arabic and English across every page, with a "العربية | English" switcher that remembers your visitors' choice
- True right-to-left layout in Arabic (navigation, forms, cart, checkout, dashboard), not just translated words
- Arabic and English titles/descriptions on products, categories, services and collections, entered by you
- Language switching never resets cart, sign-in, the page you're on, or the sky

## Stage 3 — One living Linora universe (Time Reality)
- Replaces the five fixed looks with one continuously shifting environment driven by each visitor's own clock
- Nine phases: Dawn, Morning, Midday, Golden Hour, Dusk, Twilight, Night, Pre-Midnight, Midnight — blended smoothly, never snapping
- Sky, light, clouds, shadows, stars, constellations, moon and gold highlights all drift with the hour, updating while the visitor stays on the page
- Pre-Midnight stays deep dusty blue, violet, ivory and antique gold — never a black-purple dark mode
- Lighter on phones, calm for visitors who prefer reduced motion, and never over a button, price or form

## Stage 4 — Owner dashboard
- Products, categories and subcategories, collections, services, orders, customers, custom orders, portfolio, reviews, settings
- Add, edit, hide, reorder, upload images, set prices, stock, sizes, colours and featured status — all without me touching code
- New categories, services and collections appear automatically in the shop, menus, filters and homepage
- Order management: verify Vodafone Cash / InstaPay references, change status, add tracking, with a record of who changed what
- A Time Reality panel to tune phase times, star density, moon, clouds and motion

## Stage 5 — Commerce depth
- Wishlist, recently viewed, related products, search, filters, sorting, pagination
- Shipping fees by Egyptian governorate, subtotal + shipping + total at checkout
- Order statuses (Pending → Confirmed → Processing → Shipped → Delivered → Cancelled), customer cancellation while eligible
- Card payments through a secure gateway; card details never touch the site
- Reviews limited to real buyers, moderated by you

## Stage 6 — Polish
Search-engine text in both languages, order and custom-order email notifications, simple sales and product analytics, accessibility pass, image and speed optimisation, clear Arabic and English error messages, and a full test run across phone, tablet and desktop.

## Technical notes

- Extends the existing backend: new tables for addresses, product images and variants, collections, services, wishlists, cart items, order items, order events, custom orders, portfolio projects and categories, reviews, shipping zones, translations and time-reality settings. No duplicate auth, cart or product systems.
- Translations live in per-entity translation columns/tables plus an i18n resource layer; no strings hard-coded in components.
- Time Reality is one interpolation engine writing CSS custom properties on an animation frame budget, with canvas/CSS layers for stars and clouds, gated by `prefers-reduced-motion` and device capability. The current five-theme file becomes the phase keyframe data rather than being deleted.
- Every new table gets row-level rules plus grants; owner-only writes enforced in the database, not just hidden links. Payment gateway keys live in secrets.

## What I need from you

Portfolio pieces and service descriptions must come from you (files or links) — I will not invent them. Everything else I can build; pages wait on your real content with an empty state until you upload it.

## Starting point

If you approve, I begin with Stage 1 so the site stops erroring and customers can sign in and order end to end, then continue stage by stage.
