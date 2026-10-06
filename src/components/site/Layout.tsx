import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, type ReactNode } from "react";
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
  Palette,
  Download,
  Phone,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

import { Star } from "@/components/site/Star";
import { LinoraLogo } from "@/components/site/LinoraLogo";
import { ThemeSwitcher } from "@/components/site/ThemeSwitcher";
import { LanguageSwitcher } from "@/components/site/LanguageSwitcher";
import { SearchModal } from "@/components/site/SearchModal";
import { CartDrawer } from "@/components/site/CartDrawer";
import { CelestialAtmosphere } from "@/components/site/CelestialAtmosphere";
import { TimePhaseIndicator } from "@/components/site/TimePhaseIndicator";
import { AnnouncementTicker } from "@/components/site/AnnouncementTicker";
import { CurrencyLanguageSelector } from "@/components/site/CurrencyLanguageSelector";
import { UserAccountDropdown } from "@/components/site/UserAccountDropdown";
import { SideNavigation, HamburgerMenuButton } from "@/components/site/SideNavigation";
import { FloatingWhatsApp } from "@/components/site/FloatingWhatsApp";
import { LivePodStudioModal } from "@/components/site/LivePodStudioModal";
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
  {
    to: "/shop",
    labelKey: "nav.shop",
    labelEn: "Store",
    labelAr: "المتجر",
    mega: "shop",
    isPod: false,
  },
  {
    to: "/custom-orders",
    labelKey: "nav.custom",
    labelEn: "Design Services",
    labelAr: "خدمات التصميم",
    mega: "services",
    isPod: false,
  },
  {
    to: "#pod",
    labelKey: "nav.pod",
    labelEn: "Custom Merch",
    labelAr: "استوديو الطباعة",
    isPod: true,
  },
  {
    to: "/portfolio",
    labelKey: "nav.portfolio",
    labelEn: "Portfolio",
    labelAr: "الأعمال",
    isPod: false,
  },
  { to: "/about", labelKey: "nav.about", labelEn: "About", labelAr: "عن الاستوديو", isPod: false },
] as const;

export function SiteLayout({ children }: { children: ReactNode }) {
  const { count: cartCount, openDrawer } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { user, isOwner } = useAuth();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeMega, setActiveMega] = useState<"shop" | "services" | null>(null);
  const [podStudioOpen, setPodStudioOpen] = useState(false);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [customizerOpen, setCustomizerOpen] = useState(false);
  const [cosmicNavOpen, setCosmicNavOpen] = useState(false);
  const [newsletterModalOpen, setNewsletterModalOpen] = useState(false);
  const [readabilityModalOpen, setReadabilityModalOpen] = useState(false);
  const [isTopBarPinned, setIsTopBarPinned] = useState<boolean>(true);
  const [topBarHubOpen, setTopBarHubOpen] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem("linora_topbar_pinned") === "false") {
        setIsTopBarPinned(false);
      }
    } catch {
      // ignore
    }
  }, []);

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

      {/* Sticky Top Bar & Header Master Shell */}
      <div id="linora-top-navigation-shell" className="z-40 relative">
        {/* Announcement Ticker with discounts, promo codes, free shipping & quick Theme Switcher */}
        <AnnouncementTicker />

        {/* Compact, Clean Sticky Header */}
        <header className="sticky top-0 z-40 border-b border-border/70 bg-surface/90 backdrop-blur-md transition-colors duration-1000">
          <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 lg:px-8">
            {/* Official Linora Stellar Brand Logo */}
            <Link to="/" className="shrink-0 flex items-center">
              <LinoraLogo variant="combo" size="md" />
            </Link>

            {/* Quick Celestial Theme & Controls Shortcut beside Linora Stellar Logo */}
            <div className="flex items-center gap-1.5 ms-1 sm:ms-2">
              <button
                type="button"
                onClick={() => setTopBarHubOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-full border border-accent/60 bg-accent/15 px-2.5 py-1 text-xs font-bold text-accent hover:bg-accent hover:text-background transition-all shadow-xs"
                title={isAr ? "تغيير المظهر الفلكي (ثيم)" : "Change Celestial Theme"}
                aria-label="Theme Switcher"
              >
                <Palette className="h-3.5 w-3.5 text-accent" />
                <span className="font-bold">{isAr ? "ثيم" : "Theme"}</span>
              </button>

              <button
                type="button"
                onClick={() => setTopBarHubOpen(true)}
                className="hidden sm:inline-flex items-center gap-1 rounded-full border border-border/80 bg-surface/70 px-2.5 py-1 text-xs font-semibold text-text-secondary hover:border-accent hover:text-accent transition-all"
                title={isAr ? "خيارات وإعدادات الشريط العلوي" : "Top Bar Options & Controls"}
                aria-label="Top Bar Options"
              >
                <Sliders className="h-3.5 w-3.5 text-accent" />
                <span className="hidden md:inline">{isAr ? "خيارات" : "Options"}</span>
              </button>
            </div>

            {/* Desktop Nav Links with 3 Core Tabs (Store, Custom POD, Design Services) */}
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
                  {item.isPod ? (
                    <button
                      type="button"
                      onClick={() => setPodStudioOpen(true)}
                      className="cosmic-nav-link whitespace-nowrap text-xs uppercase tracking-[0.18em] text-accent hover:brightness-125 font-bold py-1 flex items-center gap-1.5"
                    >
                      <Sparkles className="h-3 w-3 text-accent animate-pulse" />
                      <span>{isAr ? item.labelAr : item.labelEn}</span>
                    </button>
                  ) : (
                    <Link
                      to={item.to}
                      className="cosmic-nav-link whitespace-nowrap text-xs uppercase tracking-[0.18em] text-text-secondary transition-colors hover:text-accent font-medium py-1"
                      activeProps={{ className: "text-accent font-semibold is-active" }}
                    >
                      {isAr ? item.labelAr : item.labelEn}
                    </Link>
                  )}
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

            {/* Header Action Tools - Clean, Essential Icons Only */}
            <div className="ms-auto flex items-center gap-1.5 sm:gap-2 lg:ms-3">
              {/* Quick Search Button with Thumbnails Auto-Suggestions */}
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-1.5 rounded-full border border-border/80 bg-surface/60 p-2 sm:px-3 text-xs text-text-secondary hover:border-accent hover:text-accent transition-colors"
                aria-label={t("nav.search")}
                title={t("search.shortcut")}
              >
                <Search className="h-4 w-4" />
                <span className="hidden xl:inline">{t("nav.search")}</span>
              </button>

              {/* Essential My Account Icon (⊚ My Account): Replaced Wishlist!
                  For user login, accessing digital downloads, and tracking orders */}
              <UserAccountDropdown />

              {/* Shopping Cart Button */}
              <button
                type="button"
                onClick={openDrawer}
                className="relative rounded-full border border-border/80 bg-surface/60 p-2 text-text-secondary transition-colors hover:border-accent hover:text-accent"
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

              {/* Currency & Language Selector */}
              <CurrencyLanguageSelector />

              {/* Nora Tamer Admin Dashboard Shortcut */}
              {isOwner && (
                <Link
                  to="/admin"
                  className="hidden 2xl:inline-flex items-center gap-1.5 rounded-full border border-amber-500/60 bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-400 hover:bg-amber-500 hover:text-background transition-colors"
                  title="Admin Dashboard (Nora Tamer)"
                >
                  <ShieldAlert className="h-3.5 w-3.5" />
                  <span>Admin</span>
                </Link>
              )}

              {/* Essential Hamburger Menu (≡ Side Navigation): Clearly categorized to explain services, shipping policies, and customer support */}
              <HamburgerMenuButton onClick={() => setOpen(true)} isOpen={open} />
            </div>
          </div>
        </header>
      </div>

      {/* Slide-Out Side Navigation Component */}
      <SideNavigation
        isOpen={open}
        onClose={() => setOpen(false)}
        onOpenPodStudio={() => setPodStudioOpen(true)}
        onOpenThemeHub={() => setTopBarHubOpen(true)}
        onOpenReadability={() => setReadabilityModalOpen(true)}
      />

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

      {/* Sticky Mobile Floating Thumb Bar with Menu Trigger */}
      <MobileBottomBar
        onOpenPodStudio={() => setPodStudioOpen(true)}
        onOpenMenu={() => setOpen(true)}
      />

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

      {/* Live POD Studio (Print Preview Tool) */}
      <LivePodStudioModal isOpen={podStudioOpen} onClose={() => setPodStudioOpen(false)} />

      {/* Floating WhatsApp Quick Support Button */}
      <FloatingWhatsApp />
    </div>
  );
}
