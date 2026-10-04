import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import {
  Menu,
  X,
  UserRound,
  Heart,
  Search,
  Truck,
  Instagram,
  Linkedin,
  Mail,
  MessageCircle,
  ShoppingBag,
  Bot,
  Sliders,
  ShieldAlert,
  Sparkles,
  Gift,
  Compass,
  Eye,
} from "lucide-react";

import { Star } from "@/components/site/Star";
import { LinoraLogo } from "@/components/site/LinoraLogo";
import { ThemeSwitcher } from "@/components/site/ThemeSwitcher";
import { LanguageSwitcher } from "@/components/site/LanguageSwitcher";
import { SearchModal } from "@/components/site/SearchModal";
import { CartDrawer } from "@/components/site/CartDrawer";
import { CelestialAtmosphere } from "@/components/site/CelestialAtmosphere";
import { TimePhaseIndicator } from "@/components/site/TimePhaseIndicator";
import {
  TimeControlBar,
  CelestialControlsHubModal,
  FloatingTopBarPill,
} from "@/components/site/TimeControlBar";
import { CinemaIntro } from "@/components/site/CinemaIntro";
import {
  NewsletterSignup,
  CelestialNewsletterModal,
  VIPNewsletterButton,
} from "@/components/site/NewsletterSignup";
import { MegaMenu } from "@/components/site/MegaMenu";
import { MobileBottomBar } from "@/components/site/MobileBottomBar";
import { ShoppableInstagramFeed } from "@/components/site/ShoppableInstagramFeed";
import { ConversationalOrderAssistant } from "@/components/site/ConversationalOrderAssistant";
import { ProductCustomizerModal } from "@/components/site/ProductCustomizerModal";
import { StarfieldCursor } from "@/components/site/StarfieldCursor";
import {
  CosmicOrbitNavigator,
  CosmicNavigationButton,
  FloatingCosmicOrbit,
} from "@/components/site/CosmicNavigation";
import {
  ReadabilityBackdropLayer,
  ReadabilityStudioModal,
} from "@/components/site/ReadabilityStudio";
import { useAuth } from "@/lib/auth";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import { CONTACT } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";

const NAV = [
  { to: "/", label: "nav.home" },
  { to: "/shop", label: "nav.shop", mega: "shop" },
  { to: "/custom-orders", label: "nav.custom", mega: "services" },
  { to: "/about", label: "nav.about" },
  { to: "/portfolio", label: "nav.portfolio" },
  { to: "/contact", label: "nav.contact" },
] as const;

export function SiteLayout({ children }: { children: ReactNode }) {
  const { count: cartCount, openDrawer } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { user, isOwner } = useAuth();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeMega, setActiveMega] = useState<"shop" | "services" | null>(null);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [customizerOpen, setCustomizerOpen] = useState(false);
  const [cosmicNavOpen, setCosmicNavOpen] = useState(false);
  const [newsletterModalOpen, setNewsletterModalOpen] = useState(false);
  const [readabilityModalOpen, setReadabilityModalOpen] = useState(false);
  const [isTopBarPinned, setIsTopBarPinned] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    try {
      return localStorage.getItem("linora_topbar_pinned") !== "false";
    } catch {
      return true;
    }
  });
  const [topBarHubOpen, setTopBarHubOpen] = useState(false);

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t, lang } = useI18n();
  const isAr = lang === "ar";
  const router = useRouterState();
  const isHome = router.location.pathname === "/";

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden pb-16 lg:pb-0">
      {/* Cinematic Intro Curtain */}
      <CinemaIntro />

      {/* Dynamic 11-Period Celestial Atmosphere Layer */}
      <CelestialAtmosphere />

      {/* Readability & Focus Scrim Overlay Layer */}
      <ReadabilityBackdropLayer />

      {/* Sticky Top Bar & Header Master Shell (Solves immovable top bar!) */}
      <div
        id="linora-top-navigation-shell"
        className={`z-40 transition-all duration-300 ${
          isTopBarPinned ? "sticky top-0" : "relative"
        }`}
      >
        {/* Top Time Control & Live Preview Bar (4 Interactive Time Switches) */}
        <TimeControlBar
          isPinned={isTopBarPinned}
          onTogglePin={() => {
            setIsTopBarPinned((prev) => {
              const next = !prev;
              try {
                localStorage.setItem("linora_topbar_pinned", String(next));
              } catch {
                // ignore
              }
              return next;
            });
          }}
          onOpenHub={() => setTopBarHubOpen(true)}
        />

        {/* Main Header */}
        <header
          className={`${
            isTopBarPinned ? "" : "sticky top-0"
          } border-b border-border/70 bg-surface/85 backdrop-blur-md transition-colors duration-1000`}
        >
          <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 lg:px-8">
            {/* Official Linora Stellar Brand Logo */}
            <Link to="/" className="shrink-0 flex items-center">
              <LinoraLogo variant="combo" size="md" />
            </Link>

            {/* Desktop Nav Links with Mega Menu hover */}
            <nav className="ms-auto hidden items-center gap-6 lg:flex">
              {NAV.map((item) => (
                <div
                  key={item.to}
                  onMouseEnter={() => {
                    if ("mega" in item && item.mega) {
                      setActiveMega(item.mega as "shop" | "services");
                    } else {
                      setActiveMega(null);
                    }
                  }}
                  className="relative py-2"
                >
                  <Link
                    to={item.to}
                    className="cosmic-nav-link whitespace-nowrap text-xs uppercase tracking-[0.18em] text-text-secondary transition-colors hover:text-accent font-medium py-1"
                    activeProps={{ className: "text-accent font-semibold is-active" }}
                  >
                    {t(item.label)}
                  </Link>
                </div>
              ))}
            </nav>

            {/* Desktop Mega Menu */}
            {activeMega && (
              <MegaMenu
                type={activeMega}
                isOpen={Boolean(activeMega)}
                onClose={() => setActiveMega(null)}
              />
            )}

            {/* Header Action Tools */}
            <div className="ms-auto flex items-center gap-2 lg:ms-3">
              {/* Real-Time Celestial Indicator */}
              <TimePhaseIndicator />

              {/* Quick Top Bar Controls Hub Shortcut */}
              <button
                type="button"
                onClick={() => setTopBarHubOpen(true)}
                className="hidden xl:inline-flex items-center gap-1 rounded-full border border-accent/40 bg-accent/10 px-2.5 py-1 text-xs text-accent hover:bg-accent hover:text-background transition-colors font-semibold shadow-xs"
                title={isAr ? "خيارات الشريط العلوي والسمات الفلكية" : "Top Bar Controls Hub"}
              >
                <Sparkles className="h-3 w-3 text-accent" />
                <span>{isAr ? "الخيارات ⚡" : "Controls ⚡"}</span>
              </button>

              {/* Cosmic Navigation Orbit Button */}
              <CosmicNavigationButton onClick={() => setCosmicNavOpen(true)} />

              {/* VIP Stargazer 10% Newsletter Trigger */}
              <VIPNewsletterButton
                onClick={() => setNewsletterModalOpen(true)}
                className="hidden sm:inline-flex"
              />

              {/* AI Design Assistant Trigger Button */}
              <button
                type="button"
                onClick={() => setAiAssistantOpen(true)}
                className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-accent/60 bg-accent/15 px-3 py-1.5 text-xs text-accent hover:bg-accent hover:text-background transition-all font-semibold shadow-xs"
                title={isAr ? "مساعد التصميم الذكي" : "AI Design Assistant"}
              >
                <Bot className="h-3.5 w-3.5" />
                <span>{isAr ? "المساعد الذكي" : "AI Assistant"}</span>
              </button>

              {/* Live Product Customizer Trigger Button */}
              <button
                type="button"
                onClick={() => setCustomizerOpen(true)}
                className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-border bg-surface/60 px-3 py-1.5 text-xs text-text-primary hover:border-accent hover:text-accent transition-colors font-medium"
                title={isAr ? "استوديو التخصيص بالاسم" : "Product Customizer"}
              >
                <Sliders className="h-3.5 w-3.5 text-accent" />
                <span>{isAr ? "تخصيص بالاسم" : "Customizer"}</span>
              </button>

              {/* Quick Search Button */}
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-1.5 rounded-full border border-border bg-surface/60 p-2 sm:px-3 text-xs text-text-secondary hover:border-accent hover:text-accent transition-colors"
                aria-label={t("nav.search")}
                title={t("search.shortcut")}
              >
                <Search className="h-4 w-4" />
                <span className="hidden sm:inline">{t("nav.search")}</span>
              </button>

              <LanguageSwitcher />

              {/* Wishlist Icon */}
              <Link
                to="/wishlist"
                className="relative rounded-full border border-border bg-surface/60 p-2 text-text-secondary transition-colors hover:border-accent hover:text-accent"
                aria-label={t("nav.wishlist")}
                title={t("nav.wishlist")}
              >
                <Heart className="h-4 w-4" />
                {wishlistCount > 0 && (
                  <span className="absolute -end-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold text-white">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Shopping Cart Button */}
              <button
                type="button"
                onClick={openDrawer}
                className="relative rounded-full border border-border bg-surface/60 p-2 text-text-secondary transition-colors hover:border-accent hover:text-accent"
                aria-label={t("nav.cart")}
                title={t("nav.cart")}
              >
                <ShoppingBag className="h-4 w-4" />
                {cartCount > 0 && (
                  <span className="absolute -end-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-background">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Nora Tamer Admin Dashboard Shortcut */}
              {isOwner && (
                <Link
                  to="/admin"
                  className="hidden xl:inline-flex items-center gap-1.5 rounded-full border border-amber-500/60 bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-400 hover:bg-amber-500 hover:text-background transition-colors"
                  title="Admin Dashboard (Nora Tamer)"
                >
                  <ShieldAlert className="h-3.5 w-3.5" />
                  <span>Admin</span>
                </Link>
              )}

              {/* Account Icon */}
              <Link
                to="/account"
                className="rounded-full border border-border bg-surface/60 p-2 text-text-secondary transition-colors hover:border-accent hover:text-accent"
                aria-label={t("nav.account")}
                title={t("nav.account")}
              >
                <UserRound className="h-4 w-4" />
              </Link>

              {!user && (
                <Link
                  to="/auth"
                  className="whitespace-nowrap rounded-full border border-accent/80 px-3 py-1.5 text-xs uppercase tracking-[0.16em] text-accent transition-colors hover:bg-accent hover:text-background hidden sm:inline-block font-semibold"
                >
                  {t("nav.signin")}
                </Link>
              )}

              {/* Mobile Hamburger Toggle */}
              <button
                type="button"
                className="rounded-full border border-border bg-surface/60 p-2 text-text-primary lg:hidden"
                onClick={() => setOpen((v) => !v)}
                aria-label={t("nav.menu")}
              >
                {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Drawer */}
          {open && (
            <div className="border-t border-border/80 px-4 py-4 lg:hidden bg-surface backdrop-blur-lg">
              <div className="flex flex-col gap-3">
                {NAV.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="text-sm uppercase tracking-[0.18em] text-text-secondary hover:text-accent py-1"
                  >
                    {t(item.label)}
                  </Link>
                ))}

                <div className="border-t border-border/70 pt-3 flex flex-col gap-2.5">
                  <Link
                    to="/wishlist"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 text-sm uppercase tracking-[0.18em] text-text-secondary hover:text-accent"
                  >
                    <Heart className="h-4 w-4 text-rose-400" />
                    <span>
                      {t("nav.wishlist")} {wishlistCount > 0 && `(${wishlistCount})`}
                    </span>
                  </Link>

                  <Link
                    to="/track"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 text-sm uppercase tracking-[0.18em] text-text-secondary hover:text-accent"
                  >
                    <Truck className="h-4 w-4 text-accent" />
                    <span>{t("nav.track")}</span>
                  </Link>

                  <Link
                    to="/account"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 text-sm uppercase tracking-[0.18em] text-accent font-medium"
                  >
                    <UserRound className="h-4 w-4" />
                    <span>{t("nav.account")}</span>
                  </Link>

                  {/* Mobile Cosmic Navigation Trigger */}
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      setCosmicNavOpen(true);
                    }}
                    className="flex items-center gap-2 text-sm uppercase tracking-[0.18em] text-accent font-semibold text-start py-1"
                  >
                    <Compass className="h-4 w-4 text-accent" />
                    <span>{isAr ? "الملاحة الكونية (مدار ستيلر)" : "Cosmic Orbit Navigator"}</span>
                  </button>

                  {/* Mobile VIP Newsletter Trigger */}
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      setNewsletterModalOpen(true);
                    }}
                    className="flex items-center gap-2 text-sm uppercase tracking-[0.18em] text-amber-300 font-semibold text-start py-1"
                  >
                    <Gift className="h-4 w-4 text-amber-400" />
                    <span>{isAr ? "نشرة دائرة النجوم (خصم 10%)" : "VIP Newsletter (10% OFF)"}</span>
                  </button>

                  {/* Mobile Readability & Contrast Trigger */}
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      setReadabilityModalOpen(true);
                    }}
                    className="flex items-center gap-2 text-sm uppercase tracking-[0.18em] text-text-primary hover:text-accent font-semibold text-start py-1"
                  >
                    <Eye className="h-4 w-4 text-accent" />
                    <span>{isAr ? "إعدادات راحة القراءة والتباين" : "Readability & Contrast"}</span>
                  </button>

                  {/* Mobile Top Bar Options Hub Trigger */}
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      setTopBarHubOpen(true);
                    }}
                    className="flex items-center gap-2 text-sm uppercase tracking-[0.18em] text-accent hover:text-accent-gold font-semibold text-start py-1"
                  >
                    <Sparkles className="h-4 w-4 text-accent animate-pulse" />
                    <span>
                      {isAr ? "خيارات الشريط العلوي والسمات الفلكية ⚡" : "Top Bar Controls Hub ⚡"}
                    </span>
                  </button>
                </div>

                {user && (
                  <button
                    type="button"
                    onClick={signOut}
                    className="text-start text-sm uppercase tracking-[0.18em] text-rose-400 pt-1"
                  >
                    {t("nav.signout")}
                  </button>
                )}
              </div>
            </div>
          )}
        </header>
      </div>

      {/* Global Instant Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Global Quick Cart Slide-Over Drawer */}
      <CartDrawer />

      {/* AI Conversational Ordering Assistant */}
      <ConversationalOrderAssistant
        isOpen={aiAssistantOpen}
        onClose={() => setAiAssistantOpen(false)}
      />

      {/* Live Product Customizer Modal */}
      <ProductCustomizerModal isOpen={customizerOpen} onClose={() => setCustomizerOpen(false)} />

      {/* Sticky Mobile Floating Thumb Bar */}
      <MobileBottomBar />

      <main className="relative z-10 flex-1">{children}</main>

      {/* Shoppable Instagram Studio Feed */}
      <ShoppableInstagramFeed />

      {/* Global Celestial Newsletter Strip (rendered on sub-pages; home has dedicated majestic banner) */}
      {!isHome && (
        <section className="relative z-10 mx-auto max-w-7xl px-4 pt-12 pb-4 lg:px-8">
          <NewsletterSignup variant="footer-strip" />
        </section>
      )}

      <footer className="relative z-10 starfield mt-12 border-t border-border/60 sky">
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-5 lg:px-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-accent" />
              <span className="font-display text-lg uppercase tracking-[0.2em] text-text-primary">
                Linora Stellar
              </span>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-text-secondary">
              {t("footer.tagline")}
            </p>
            <p className="mt-3 text-xs text-text-secondary">
              {CONTACT.whatsapp} &bull; {CONTACT.email}
            </p>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-accent">
              {t("footer.explore")}
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-text-secondary">
              <li>
                <Link to="/shop" className="hover:text-text-primary">
                  {t("nav.shop")}
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-text-primary">
                  {t("nav.about")}
                </Link>
              </li>
              <li>
                <Link to="/portfolio" className="hover:text-text-primary">
                  {t("nav.portfolio")}
                </Link>
              </li>
              <li>
                <Link to="/custom-orders" className="hover:text-text-primary">
                  {t("nav.custom")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-accent">
              {lang === "ar" ? "خدمة العملاء" : "Customer Care"}
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-text-secondary">
              <li>
                <Link to="/track" className="hover:text-text-primary">
                  {t("nav.track")}
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-text-primary">
                  {t("nav.faq")}
                </Link>
              </li>
              <li>
                <Link to="/account" className="hover:text-text-primary">
                  {t("nav.account")}
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-text-primary">
                  {t("nav.wishlist")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-accent">
              {lang === "ar" ? "السياسات والضمان" : "Policies & Trust"}
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-text-secondary">
              <li>
                <Link to="/refund-policy" className="hover:text-text-primary">
                  {lang === "ar" ? "سياسة الاسترجاع والاستبدال" : "Refund & Exchange"}
                </Link>
              </li>
              <li>
                <Link to="/shipping-policy" className="hover:text-text-primary">
                  {lang === "ar" ? "سياسة الشحن ومناطق مصر" : "Shipping & Governorates"}
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-text-primary">
                  {lang === "ar" ? "سياسة الخصوصية وأمان البيانات" : "Privacy Policy"}
                </Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="hover:text-text-primary">
                  {lang === "ar" ? "شروط الخدمة والملكية" : "Terms of Service"}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-accent">
              {t("footer.contact")}
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-text-secondary">
              <li>
                <a
                  href={CONTACT.whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 hover:text-text-primary"
                >
                  <MessageCircle className="h-4 w-4 text-emerald-400" />
                  <span>WhatsApp</span>
                </a>
              </li>
              <li>
                <a
                  href={CONTACT.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 hover:text-text-primary"
                >
                  <Instagram className="h-4 w-4" />
                  <span>Instagram</span>
                </a>
              </li>
              <li>
                <a
                  href={CONTACT.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 hover:text-text-primary"
                >
                  <Linkedin className="h-4 w-4" />
                  <span>LinkedIn</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="flex items-center gap-2 hover:text-text-primary"
                >
                  <Mail className="h-4 w-4" />
                  <span>Email</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/40 py-6 text-center text-xs text-text-secondary">
          <p>{t("footer.rights")}</p>
        </div>
      </footer>

      {/* Global Interactive Starfield Cursor */}
      <StarfieldCursor />

      {/* Floating Cosmic Orbit Teleport Pill */}
      <FloatingCosmicOrbit onClick={() => setCosmicNavOpen(true)} />

      {/* Cosmic Orbit Navigator Modal */}
      <CosmicOrbitNavigator
        isOpen={cosmicNavOpen}
        onClose={() => setCosmicNavOpen(false)}
        onOpenNewsletter={() => setNewsletterModalOpen(true)}
        onOpenCustomizer={() => setCustomizerOpen(true)}
      />

      {/* Interactive Celestial Newsletter Modal */}
      <CelestialNewsletterModal
        isOpen={newsletterModalOpen}
        onClose={() => setNewsletterModalOpen(false)}
      />

      {/* Readability & Contrast Studio Modal */}
      <ReadabilityStudioModal
        isOpen={readabilityModalOpen}
        onClose={() => setReadabilityModalOpen(false)}
      />

      {/* Floating Top Bar Quick Controls Pill (appears when scrolled down if unpinned) */}
      <FloatingTopBarPill onOpenHub={() => setTopBarHubOpen(true)} isPinned={isTopBarPinned} />

      {/* All-In-One Celestial Controls Hub Modal */}
      <CelestialControlsHubModal
        isOpen={topBarHubOpen}
        onClose={() => setTopBarHubOpen(false)}
        isPinned={isTopBarPinned}
        onTogglePin={() => {
          setIsTopBarPinned((prev) => {
            const next = !prev;
            try {
              localStorage.setItem("linora_topbar_pinned", String(next));
            } catch {
              // ignore
            }
            return next;
          });
        }}
      />
    </div>
  );
}
