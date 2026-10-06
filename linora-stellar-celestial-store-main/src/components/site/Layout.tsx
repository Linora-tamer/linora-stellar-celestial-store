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
              <button
                type="button"
                className="flex items-center gap-1.5 rounded-full border border-border/80 bg-surface/60 p-2 sm:px-3 text-xs text-text-primary hover:border-accent hover:text-accent transition-all shadow-xs"
                onClick={() => setOpen(true)}
                aria-label="Side Navigation"
                title={
                  isAr
                    ? "القائمة الجانبية ≡ الخدمات، سياسة الشحن والدعم"
                    : "Side Navigation ≡ Services, Shipping Policies & Support"
                }
              >
                <Menu className="h-4.5 w-4.5 text-accent" />
                <span className="hidden sm:inline font-semibold text-xs">
                  {isAr ? "القائمة" : "Menu"}
                </span>
              </button>
            </div>
          </div>
        </header>
      </div>

      {/* Clearly Categorized Slide-Over Side Navigation Drawer (≡ Side Navigation) */}
      {open && (
        <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-md transition-opacity"
            onClick={() => setOpen(false)}
          />

          <aside className="fixed inset-y-0 end-0 z-50 w-full max-w-md bg-surface/95 backdrop-blur-2xl border-s border-border shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border/80 bg-surface-elevated/40">
              <div className="flex items-center gap-2.5">
                <LinoraLogo variant="combo" size="sm" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-accent bg-accent/15 px-2 py-0.5 rounded-full">
                  {isAr ? "دليل المتجر والخدمات" : "Directory & Guides"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full p-2 text-text-secondary hover:text-accent hover:bg-surface-elevated transition-colors border border-border/60"
                aria-label="Close Side Navigation"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Scrollable Categorized Content */}
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
              {/* Category 1: 🎨 Services & Products (خدمات الاستوديو والتصميم والطباعة) */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-accent flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>{isAr ? "خدمات الاستوديو والمنتجات" : "Services & Products"}</span>
                  </p>
                  <span className="text-[10px] font-mono text-text-secondary">01</span>
                </div>

                <div className="space-y-2">
                  {/* 1.1 Direct Store */}
                  <Link
                    to="/shop"
                    onClick={() => setOpen(false)}
                    className="group block p-3 rounded-2xl border border-border bg-surface-elevated/30 hover:border-accent hover:bg-surface-elevated transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <ShoppingBag className="h-4 w-4 text-accent" />
                        <span className="text-xs font-bold text-text-primary group-hover:text-accent transition-colors">
                          {isAr ? "المتجر المباشر والمطبوعات" : "Direct Store & Stationery"}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-accent bg-accent/15 px-1.5 py-0.5 rounded">
                        {isAr ? "شحن فوري" : "Ready"}
                      </span>
                    </div>
                    <p className="text-[11px] text-text-secondary mt-1 ps-6 leading-relaxed">
                      {isAr
                        ? "بلانرز ومخططات ورقية فاخرة، دفاتر يومية فلكية، وبطاقات جاهزة للشحن الفوري."
                        : "Luxury paper planners, cosmic stationery, celestial art prints ready to ship."}
                    </p>
                  </Link>

                  {/* 1.2 Live Custom Merch POD Studio */}
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      setPodStudioOpen(true);
                    }}
                    className="w-full text-start group block p-3 rounded-2xl border border-accent/60 bg-accent/10 hover:bg-accent/20 transition-all shadow-xs"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Palette className="h-4 w-4 text-accent animate-pulse" />
                        <span className="text-xs font-bold text-accent">
                          {isAr
                            ? "استوديو الطباعة الحية عند الطلب (POD)"
                            : "Live Custom Merch POD Studio"}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono uppercase bg-accent text-background px-2 py-0.5 rounded-full font-bold">
                        {isAr ? "معاينة 3D" : "Interactive"}
                      </span>
                    </div>
                    <p className="text-[11px] text-text-secondary mt-1 ps-6 leading-relaxed">
                      {isAr
                        ? "خصّصي مجات السيراميك، التيشيرتات الأوفرسايز، وحقائب التوت باج مع معاينة فورية قبل الطلب."
                        : "Customize ceramic mugs, oversized hoodies & canvas tote bags with real-time preview."}
                    </p>
                  </button>

                  {/* 1.3 Bespoke Graphic Design Brief */}
                  <Link
                    to="/custom-orders"
                    onClick={() => setOpen(false)}
                    className="group block p-3 rounded-2xl border border-border bg-surface-elevated/30 hover:border-accent hover:bg-surface-elevated transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Compass className="h-4 w-4 text-accent" />
                        <span className="text-xs font-bold text-text-primary group-hover:text-accent transition-colors">
                          {isAr
                            ? "خدمات التصميم الجرافيكي المخصص"
                            : "Bespoke Graphic Design Services"}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                        {isAr ? "تصميم + طباعة" : "Design + Print"}
                      </span>
                    </div>
                    <p className="text-[11px] text-text-secondary mt-1 ps-6 leading-relaxed">
                      {isAr
                        ? "تصميم هويات تجارية، كروت مناسبات، وباقات فلكية مخصصة خطوة بخطوة مع خيار الطباعة والشحن."
                        : "Bespoke branding, event cards & custom orders with direct print & ship options."}
                    </p>
                  </Link>

                  {/* 1.4 Creative Portfolio */}
                  <Link
                    to="/portfolio"
                    onClick={() => setOpen(false)}
                    className="group block p-2.5 rounded-xl border border-border/70 hover:border-accent transition-colors text-xs text-text-secondary hover:text-accent flex items-center justify-between"
                  >
                    <span className="ps-2 font-medium">
                      ✦ {isAr ? "معرض الأعمال الفلكي (Portfolio)" : "Creative Celestial Portfolio"}
                    </span>
                    <span className="text-[11px] text-accent">→</span>
                  </Link>
                </div>
              </div>

              {/* Category 2: 🚚 Shipping Policies (سياسة ومحافظات الشحن والتوصيل) */}
              <div className="border-t border-border/80 pt-5">
                <div className="flex items-center justify-between mb-2.5">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-accent flex items-center gap-1.5">
                    <Truck className="h-3.5 w-3.5" />
                    <span>
                      {isAr ? "سياسات ومواعيد الشحن والتوصيل" : "Shipping Policies & Delivery"}
                    </span>
                  </p>
                  <span className="text-[10px] font-mono text-text-secondary">02</span>
                </div>

                {/* Governorates Breakdown Card */}
                <div className="rounded-2xl border border-border bg-surface-elevated/40 p-3.5 space-y-2.5 text-xs">
                  <div className="flex items-start justify-between border-b border-border/50 pb-2">
                    <div>
                      <p className="font-semibold text-text-primary">
                        📍 {isAr ? "القاهرة والجيزة" : "Cairo & Giza"}
                      </p>
                      <p className="text-[10px] text-text-secondary">
                        {isAr ? "توصيل سريع حتى باب المنزل" : "Express door-to-door"}
                      </p>
                    </div>
                    <span className="font-mono text-accent font-bold">
                      {isAr ? "24 - 48 ساعة" : "24-48 Hours"}
                    </span>
                  </div>

                  <div className="flex items-start justify-between border-b border-border/50 pb-2">
                    <div>
                      <p className="font-semibold text-text-primary">
                        📍 {isAr ? "الإسكندرية، الدلتا ومدن القناة" : "Alexandria, Delta & Canal"}
                      </p>
                      <p className="text-[10px] text-text-secondary">
                        {isAr ? "شحن آمن لكافة المراكز" : "Safe regional shipping"}
                      </p>
                    </div>
                    <span className="font-mono text-accent font-bold">
                      {isAr ? "2 - 3 أيام عمل" : "2-3 Days"}
                    </span>
                  </div>

                  <div className="flex items-start justify-between pb-1">
                    <div>
                      <p className="font-semibold text-text-primary">
                        📍 {isAr ? "محافظات الصعيد والبحر الأحمر" : "Upper Egypt & Red Sea"}
                      </p>
                      <p className="text-[10px] text-text-secondary">
                        {isAr ? "تغطية كاملة مع كبرى شركات الشحن" : "Full nationwide coverage"}
                      </p>
                    </div>
                    <span className="font-mono text-accent font-bold">
                      {isAr ? "3 - 5 أيام عمل" : "3-5 Days"}
                    </span>
                  </div>

                  <div className="rounded-xl bg-accent/10 border border-accent/30 p-2 text-[11px] text-accent flex items-center justify-between">
                    <span>
                      ✨{" "}
                      {isAr
                        ? "شحن مجاني لكافة الطلبات فوق 750 ج.م"
                        : "Free shipping on orders over 750 EGP"}
                    </span>
                    <span className="font-mono font-bold uppercase">FREE750</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2.5 text-xs">
                  <Link
                    to="/track"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center gap-1.5 p-2 rounded-xl border border-accent/50 bg-accent/15 text-accent font-bold hover:bg-accent hover:text-background transition-all"
                  >
                    <Truck className="h-3.5 w-3.5" />
                    <span>{isAr ? "تتبع طردك بالرقم" : "Track Order"}</span>
                  </Link>

                  <Link
                    to="/shipping-policy"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center gap-1.5 p-2 rounded-xl border border-border bg-surface-elevated/40 text-text-primary hover:border-accent hover:text-accent transition-colors font-medium"
                  >
                    <ShieldCheck className="h-3.5 w-3.5 text-accent" />
                    <span>{isAr ? "السياسة الكاملة" : "Shipping Policy"}</span>
                  </Link>
                </div>
              </div>

              {/* Category 3: 🎧 Customer Support (خدمة العملاء والدعم المباشر) */}
              <div className="border-t border-border/80 pt-5">
                <div className="flex items-center justify-between mb-2.5">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-accent flex items-center gap-1.5">
                    <MessageCircle className="h-3.5 w-3.5" />
                    <span>{isAr ? "خدمة العملاء والدعم الفني" : "Customer Support & Help"}</span>
                  </p>
                  <span className="text-[10px] font-mono text-text-secondary">03</span>
                </div>

                <div className="space-y-2 text-xs">
                  {/* WhatsApp Support Direct Button */}
                  <a
                    href={CONTACT.whatsappLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-3 rounded-2xl border border-emerald-500/50 bg-emerald-500/10 text-emerald-400 font-bold hover:bg-emerald-500/20 transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <MessageCircle className="h-4 w-4" />
                      <div>
                        <span>{isAr ? "محادثة واتساب فورية مباشرة" : "Live WhatsApp Support"}</span>
                        <p className="text-[10px] text-emerald-300 font-normal">
                          {isAr
                            ? "تواصل مباشر مع نورا تامر وفريق العمل لحل أي استفسار"
                            : "Direct chat with Nora Tamer & support team"}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs">💬</span>
                  </a>

                  {/* Phone & Email contacts */}
                  <div className="p-3 rounded-2xl border border-border bg-surface-elevated/30 space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-text-secondary flex items-center gap-1.5">
                        <Phone className="h-3 w-3 text-accent" />
                        {isAr ? "الهاتف المباشر:" : "Phone:"}
                      </span>
                      <a
                        href={`tel:${CONTACT.phone}`}
                        className="font-mono text-text-primary hover:text-accent"
                      >
                        {CONTACT.phone}
                      </a>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-text-secondary flex items-center gap-1.5">
                        <Mail className="h-3 w-3 text-accent" />
                        {isAr ? "البريد الإلكتروني:" : "Email:"}
                      </span>
                      <a
                        href={`mailto:${CONTACT.email}`}
                        className="font-mono text-text-primary hover:text-accent"
                      >
                        {CONTACT.email}
                      </a>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to="/faq"
                      onClick={() => setOpen(false)}
                      className="p-2.5 rounded-xl border border-border bg-surface-elevated/40 text-text-primary hover:border-accent hover:text-accent font-semibold text-center"
                    >
                      {isAr ? "الأسئلة الشائعة" : "FAQ"}
                    </Link>
                    <Link
                      to="/refund-policy"
                      onClick={() => setOpen(false)}
                      className="p-2.5 rounded-xl border border-border bg-surface-elevated/40 text-text-primary hover:border-accent hover:text-accent font-semibold text-center"
                    >
                      {isAr ? "سياسة الاستبدال" : "Refund Policy"}
                    </Link>
                  </div>
                </div>
              </div>

              {/* Category 4: ⊚ My Account & Digital Access (حسابي، التحميلات وتتبع الطلبات) */}
              <div className="border-t border-border/80 pt-5">
                <div className="flex items-center justify-between mb-2.5">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-accent flex items-center gap-1.5">
                    <UserRound className="h-3.5 w-3.5" />
                    <span>{isAr ? "حسابي والتحميلات الرقمية" : "My Account & Downloads"}</span>
                  </p>
                  <span className="text-[10px] font-mono text-text-secondary">04</span>
                </div>

                {!user ? (
                  <div className="flex gap-2 mb-3 p-2 rounded-xl bg-surface-elevated/70 border border-accent/30">
                    <Link
                      to="/auth"
                      onClick={() => setOpen(false)}
                      className="flex-1 rounded-lg bg-accent py-2 px-3 text-xs font-bold text-background text-center hover:brightness-110 shadow-xs"
                    >
                      {isAr ? "تسجيل الدخول" : "Sign In"}
                    </Link>
                    <Link
                      to="/auth"
                      onClick={() => setOpen(false)}
                      className="flex-1 rounded-lg border border-accent/60 bg-accent/10 py-2 px-3 text-xs font-bold text-accent text-center hover:bg-accent/20"
                    >
                      {isAr ? "إنشاء حساب" : "Sign Up"}
                    </Link>
                  </div>
                ) : (
                  <div className="p-2.5 rounded-xl bg-surface-elevated/70 border border-border mb-3 flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 text-accent font-bold text-xs uppercase border border-accent/40">
                      {user.email?.charAt(0) || "U"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-text-primary truncate">
                        {user.user_metadata?.full_name || user.email?.split("@")[0]}
                      </p>
                      <p className="text-[10px] text-text-secondary truncate">{user.email}</p>
                    </div>
                  </div>
                )}

                <div className="space-y-1.5 text-xs">
                  <Link
                    to="/account"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 p-2 rounded-xl text-text-primary hover:bg-surface-elevated hover:text-accent"
                  >
                    <UserRound className="h-4 w-4 text-accent" />
                    <span>{isAr ? "لوحة التحكم والملف الشخصي" : "My Account Dashboard"}</span>
                  </Link>

                  <Link
                    to="/account"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 p-2 rounded-xl text-text-primary hover:bg-surface-elevated hover:text-accent"
                  >
                    <Download className="h-4 w-4 text-accent" />
                    <span>
                      {isAr ? "مكتبة التحميلات الرقمية (PDF / Canva)" : "Digital Downloads Library"}
                    </span>
                  </Link>

                  <Link
                    to="/track"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 p-2 rounded-xl text-text-primary hover:bg-surface-elevated hover:text-accent"
                  >
                    <Truck className="h-4 w-4 text-accent" />
                    <span>{isAr ? "تتبع الشحنات والطرود" : "Track Shipments"}</span>
                  </Link>

                  <Link
                    to="/wishlist"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between p-2 rounded-xl text-text-primary hover:bg-surface-elevated hover:text-accent"
                  >
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-rose-400" />
                      <span>{isAr ? "قائمة الأمنيات المحفوظة" : "Saved Wishlist"}</span>
                    </div>
                    {wishlistCount > 0 && (
                      <span className="rounded-full bg-rose-500/20 px-2 py-0.5 text-[10px] font-bold text-rose-400">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>
                </div>
              </div>

              {/* Category 5: 🌗 Celestial Sky Theme & Readability (المظهر الفلكي وراحة القراءة) */}
              <div className="border-t border-border/80 pt-5">
                <div className="flex items-center justify-between mb-2.5">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-accent flex items-center gap-1.5">
                    <Palette className="h-3.5 w-3.5" />
                    <span>
                      {isAr ? "المظهر الفلكي وراحة القراءة" : "Celestial Sky & Readability"}
                    </span>
                  </p>
                  <span className="text-[10px] font-mono text-text-secondary">05</span>
                </div>

                <div className="flex flex-wrap gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      setTopBarHubOpen(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-accent/40 bg-accent/10 px-3 py-2 text-accent font-semibold hover:bg-accent hover:text-background transition-all"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>{isAr ? "لوحة السمات الفلكية (11 ثيم)" : "All Themes Hub"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      setReadabilityModalOpen(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-border bg-surface-elevated px-3 py-2 text-text-primary font-semibold hover:border-accent hover:text-accent transition-colors"
                  >
                    <Eye className="h-3.5 w-3.5 text-accent" />
                    <span>{isAr ? "راحة القراءة والتباين" : "Readability Mode"}</span>
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}

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
      <MobileBottomBar onOpenPodStudio={() => setPodStudioOpen(true)} />

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
