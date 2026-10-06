import React, { useEffect } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Menu,
  X,
  ShoppingBag,
  Sparkles,
  Palette,
  Truck,
  HelpCircle,
  CircleUserRound,
  Download,
  Phone,
  MessageCircle,
  Mail,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  FileText,
  RefreshCw,
  Eye,
  Sliders,
  ExternalLink,
  Heart,
  Star,
} from "lucide-react";
import { LinoraLogo } from "@/components/site/LinoraLogo";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { useWishlist } from "@/lib/wishlist";
import { CONTACT } from "@/lib/store";

export interface SideNavigationProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPodStudio?: () => void;
  onOpenThemeHub?: () => void;
  onOpenReadability?: () => void;
}

export function SideNavigation({
  isOpen,
  onClose,
  onOpenPodStudio,
  onOpenThemeHub,
  onOpenReadability,
}: SideNavigationProps) {
  const { user } = useAuth();
  const { lang } = useI18n();
  const { count: wishlistCount } = useWishlist();
  const isAr = lang === "ar";
  const router = useRouterState();
  const currentPath = router.location.pathname;

  // Close on ESC key and prevent body scroll when open
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const ArrowIcon = isAr ? ChevronLeft : ChevronRight;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={isAr ? "القائمة الجانبية الرئيسية" : "Main Side Navigation"}
      className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200"
    >
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-md transition-opacity cursor-pointer"
        onClick={onClose}
        aria-hidden="true"
      />

      <aside className="fixed inset-y-0 end-0 z-50 w-full max-w-md bg-surface/95 backdrop-blur-2xl border-s border-border shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/80 bg-surface-elevated/40">
          <div className="flex items-center gap-2.5">
            <LinoraLogo variant="combo" size="sm" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-accent bg-accent/15 px-2 py-0.5 rounded-full font-bold">
              {isAr ? "دليل المتجر والخدمات" : "Directory & Guides"}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-text-secondary hover:text-accent hover:bg-surface-elevated transition-colors border border-border/60"
            aria-label={isAr ? "إغلاق القائمة" : "Close navigation"}
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Scrollable Categorized Navigation Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
          {/* Quick Notice Banner */}
          <div className="p-3 rounded-2xl bg-accent/10 border border-accent/25 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Sparkles className="h-4 w-4 text-accent shrink-0" />
              <div>
                <p className="text-xs font-semibold text-text-primary">
                  {isAr ? "عالم لينورا ستيلار الفلكي" : "Linora Stellar Universe"}
                </p>
                <p className="text-[10px] text-text-secondary">
                  {isAr
                    ? "تصاميم فلكية مخصصة، منتجات فاخرة وشحن موثوق"
                    : "Bespoke celestial art, premium POD & fast shipping"}
                </p>
              </div>
            </div>
          </div>

          {/* 1. STORE (المتجر) */}
          <section className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-accent">
                <ShoppingBag className="h-4 w-4" />
                <h3 className="text-xs font-bold uppercase tracking-widest">
                  {isAr ? "1. المتجر والمنتجات" : "1. Store & Catalog"}
                </h3>
              </div>
              <Link
                to="/shop"
                onClick={onClose}
                className="text-[11px] font-semibold text-accent hover:underline flex items-center gap-1"
              >
                <span>{isAr ? "عرض الكل" : "View All"}</span>
                <ArrowIcon className="h-3 w-3" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <Link
                to="/shop"
                search={{ category: "digital" }}
                onClick={onClose}
                className="p-2.5 rounded-xl border border-border/70 bg-surface-elevated/40 hover:border-accent hover:bg-surface-elevated transition-all flex items-center gap-2"
              >
                <Download className="h-3.5 w-3.5 text-accent" />
                <div className="truncate">
                  <span className="font-semibold block truncate">
                    {isAr ? "التحميلات الرقمية" : "Digital Downloads"}
                  </span>
                  <span className="text-[10px] text-text-secondary block">
                    {isAr ? "تحميل فوري" : "Instant files"}
                  </span>
                </div>
              </Link>

              <Link
                to="/shop"
                search={{ category: "merch" }}
                onClick={onClose}
                className="p-2.5 rounded-xl border border-border/70 bg-surface-elevated/40 hover:border-accent hover:bg-surface-elevated transition-all flex items-center gap-2"
              >
                <Star className="h-3.5 w-3.5 text-accent" />
                <div className="truncate">
                  <span className="font-semibold block truncate">
                    {isAr ? "أزياء وملابس فلكية" : "Apparel & Merch"}
                  </span>
                  <span className="text-[10px] text-text-secondary block">
                    {isAr ? "هوديز وتيشيرتات" : "Hoodies & tees"}
                  </span>
                </div>
              </Link>

              <Link
                to="/shop"
                search={{ category: "school" }}
                onClick={onClose}
                className="p-2.5 rounded-xl border border-border/70 bg-surface-elevated/40 hover:border-accent hover:bg-surface-elevated transition-all flex items-center gap-2"
              >
                <FileText className="h-3.5 w-3.5 text-accent" />
                <div className="truncate">
                  <span className="font-semibold block truncate">
                    {isAr ? "قرطاسية ودفاتر" : "Stationery"}
                  </span>
                  <span className="text-[10px] text-text-secondary block">
                    {isAr ? "دفاتر وبلانرز" : "Notebooks"}
                  </span>
                </div>
              </Link>

              <Link
                to="/shop"
                search={{ category: "print" }}
                onClick={onClose}
                className="p-2.5 rounded-xl border border-border/70 bg-surface-elevated/40 hover:border-accent hover:bg-surface-elevated transition-all flex items-center gap-2"
              >
                <Palette className="h-3.5 w-3.5 text-accent" />
                <div className="truncate">
                  <span className="font-semibold block truncate">
                    {isAr ? "لوحات فلكية ومطبوعات" : "Wall Art & Prints"}
                  </span>
                  <span className="text-[10px] text-text-secondary block">
                    {isAr ? "ديكور منزلي" : "Celestial decor"}
                  </span>
                </div>
              </Link>

              <Link
                to="/shop"
                search={{ category: "kids" }}
                onClick={onClose}
                className="p-2.5 rounded-xl border border-border/70 bg-surface-elevated/40 hover:border-accent hover:bg-surface-elevated transition-all flex items-center gap-2"
              >
                <Sparkles className="h-3.5 w-3.5 text-accent" />
                <div className="truncate">
                  <span className="font-semibold block truncate">
                    {isAr ? "مجموعة الأطفال" : "Kids Cosmic"}
                  </span>
                  <span className="text-[10px] text-text-secondary block">
                    {isAr ? "أدوات مبهجة" : "Cosmic kids"}
                  </span>
                </div>
              </Link>

              <Link
                to="/shop"
                search={{ category: "branding" }}
                onClick={onClose}
                className="p-2.5 rounded-xl border border-border/70 bg-surface-elevated/40 hover:border-accent hover:bg-surface-elevated transition-all flex items-center gap-2"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-accent" />
                <div className="truncate">
                  <span className="font-semibold block truncate">
                    {isAr ? "هويات بصرية فلكية" : "Brand Identity"}
                  </span>
                  <span className="text-[10px] text-text-secondary block">
                    {isAr ? "شعار وهوية" : "Logos & branding"}
                  </span>
                </div>
              </Link>
            </div>
          </section>

          {/* 2. CUSTOM STUDIO (استوديو التصميم المخصص) */}
          <section className="space-y-2">
            <div className="flex items-center gap-2 text-accent">
              <Palette className="h-4 w-4" />
              <h3 className="text-xs font-bold uppercase tracking-widest">
                {isAr ? "2. الاستوديو المخصص" : "2. Custom Studio"}
              </h3>
            </div>
            <div className="space-y-2 text-xs">
              {onOpenPodStudio && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenPodStudio();
                  }}
                  className="w-full p-3 rounded-xl border border-accent/40 bg-accent/10 hover:bg-accent/20 transition-all flex items-center justify-between text-start"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-lg bg-accent text-background flex items-center justify-center font-bold">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="font-bold text-accent block">
                        {isAr
                          ? "استوديو الطباعة المباشر (POD Studio)"
                          : "Live Interactive POD Studio"}
                      </span>
                      <span className="text-[10px] text-text-secondary block">
                        {isAr
                          ? "جرّب تصميمك واكتب اسمك على منتجات حية"
                          : "Upload design, preview mockups & customize live"}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-accent/20 text-accent px-2 py-0.5 rounded-md">
                    Live
                  </span>
                </button>
              )}

              <Link
                to="/custom-orders"
                onClick={onClose}
                className="w-full p-3 rounded-xl border border-border/80 bg-surface-elevated/40 hover:border-accent hover:bg-surface-elevated transition-all flex items-center justify-between text-start"
              >
                <div>
                  <span className="font-semibold text-text-primary block">
                    {isAr ? "طلب تصميم فلكي مخصص بالكامل" : "Bespoke Celestial Commission"}
                  </span>
                  <span className="text-[10px] text-text-secondary block">
                    {isAr
                      ? "خرائط نجوم حسب تاريخ الميلاد ومناسبات خاصة"
                      : "Birth charts, star alignments & luxury foil print"}
                  </span>
                </div>
                <ArrowIcon className="h-4 w-4 text-text-secondary" />
              </Link>
            </div>
          </section>

          {/* 3. SERVICES (الخدمات واستشارات التصميم) */}
          <section className="space-y-2">
            <div className="flex items-center gap-2 text-accent">
              <Sparkles className="h-4 w-4" />
              <h3 className="text-xs font-bold uppercase tracking-widest">
                {isAr ? "3. الخدمات والاستشارات" : "3. Services & Portfolio"}
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <Link
                to="/portfolio"
                onClick={onClose}
                className="p-2.5 rounded-xl border border-border/70 bg-surface-elevated/40 hover:border-accent hover:bg-surface-elevated transition-all flex items-center justify-between"
              >
                <div>
                  <span className="font-semibold block">
                    {isAr ? "معرض أعمال نورا تامر" : "Nora Tamer Portfolio"}
                  </span>
                  <span className="text-[10px] text-text-secondary block">
                    {isAr ? "أعمال فنية وهويات" : "Selected artwork"}
                  </span>
                </div>
                <ArrowIcon className="h-3.5 w-3.5 text-text-secondary" />
              </Link>

              <Link
                to="/about"
                onClick={onClose}
                className="p-2.5 rounded-xl border border-border/70 bg-surface-elevated/40 hover:border-accent hover:bg-surface-elevated transition-all flex items-center justify-between"
              >
                <div>
                  <span className="font-semibold block">
                    {isAr ? "عن لينورا ستيلار" : "About the Studio"}
                  </span>
                  <span className="text-[10px] text-text-secondary block">
                    {isAr ? "الرؤية والقصة الفلكية" : "Story & philosophy"}
                  </span>
                </div>
                <ArrowIcon className="h-3.5 w-3.5 text-text-secondary" />
              </Link>
            </div>
          </section>

          {/* 4. SHIPPING POLICIES (سياسات الشحن والتوصيل) */}
          <section className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-accent">
                <Truck className="h-4 w-4" />
                <h3 className="text-xs font-bold uppercase tracking-widest">
                  {isAr ? "4. سياسات الشحن والتوصيل" : "4. Shipping & Delivery"}
                </h3>
              </div>
              <Link
                to="/shipping-policy"
                onClick={onClose}
                className="text-[11px] font-semibold text-accent hover:underline flex items-center gap-1"
              >
                <span>{isAr ? "تفاصيل الشحن" : "Shipping Policy"}</span>
                <ArrowIcon className="h-3 w-3" />
              </Link>
            </div>
            <div className="p-3 rounded-2xl border border-border/80 bg-surface-elevated/40 space-y-2.5 text-xs">
              <div className="flex items-start gap-2.5">
                <Truck className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-text-primary">
                    {isAr ? "شحن محلي لجميع محافظات مصر" : "Egypt Nationwide Courier"}
                  </p>
                  <p className="text-[11px] text-text-secondary">
                    {isAr
                      ? "القاهرة والجيزة: 24-48 ساعة (65 ج.م) • الإسكندرية والدلتا: 2-3 أيام (75 ج.م) • الصعيد ومدن القناة: 3-4 أيام (95 ج.م)"
                      : "Cairo & Giza 24-48h (65 EGP) • Alex & Delta 2-3 days (75 EGP) • Upper Egypt (95 EGP)"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 pt-2 border-t border-border/60">
                <Sparkles className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-text-primary">
                    {isAr ? "شحن دولي لكافة أنحاء العالم" : "Worldwide Express Delivery"}
                  </p>
                  <p className="text-[11px] text-text-secondary">
                    {isAr
                      ? "شحن سريع ومؤمّن عبر DHL Express و Aramex (3 إلى 7 أيام عمل)"
                      : "Tracked express shipping to GCC, US, Europe & Worldwide via DHL/Aramex"}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs">
                <Link
                  to="/track"
                  onClick={onClose}
                  className="font-semibold text-accent hover:underline flex items-center gap-1"
                >
                  <RefreshCw className="h-3 w-3" />
                  <span>{isAr ? "تتبع شحنتك المباشرة" : "Live Shipment Tracker"}</span>
                </Link>
                <Link
                  to="/refund-policy"
                  onClick={onClose}
                  className="text-text-secondary hover:text-text-primary hover:underline"
                >
                  {isAr ? "سياسة الاستبدال والاسترجاع" : "Refund Policy"}
                </Link>
              </div>
            </div>
          </section>

          {/* 5. CUSTOMER SUPPORT (الدعم وخدمة العملاء) */}
          <section className="space-y-2">
            <div className="flex items-center gap-2 text-accent">
              <HelpCircle className="h-4 w-4" />
              <h3 className="text-xs font-bold uppercase tracking-widest">
                {isAr ? "5. الدعم وخدمة العملاء" : "5. Customer Support"}
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <a
                href={CONTACT.whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-semibold transition-all flex items-center gap-2"
              >
                <MessageCircle className="h-4 w-4 shrink-0" />
                <div className="truncate">
                  <span className="block truncate">
                    {isAr ? "واتساب مباشر" : "Direct WhatsApp"}
                  </span>
                  <span className="text-[10px] text-emerald-300/80 block">
                    {isAr ? "رد فوري" : "Live Chat"}
                  </span>
                </div>
              </a>

              <Link
                to="/faq"
                onClick={onClose}
                className="p-2.5 rounded-xl border border-border/70 bg-surface-elevated/40 hover:border-accent hover:bg-surface-elevated transition-all flex items-center gap-2"
              >
                <HelpCircle className="h-4 w-4 text-accent shrink-0" />
                <div className="truncate">
                  <span className="font-semibold text-text-primary block truncate">
                    {isAr ? "الأسئلة الشائعة" : "FAQ Knowledgebase"}
                  </span>
                  <span className="text-[10px] text-text-secondary block">
                    {isAr ? "إجابات سريعة" : "Quick Answers"}
                  </span>
                </div>
              </Link>

              <Link
                to="/contact"
                onClick={onClose}
                className="p-2.5 rounded-xl border border-border/70 bg-surface-elevated/40 hover:border-accent hover:bg-surface-elevated transition-all flex items-center gap-2"
              >
                <Mail className="h-4 w-4 text-accent shrink-0" />
                <div className="truncate">
                  <span className="font-semibold text-text-primary block truncate">
                    {isAr ? "تواصل معنا" : "Contact Form"}
                  </span>
                  <span className="text-[10px] text-text-secondary block">{CONTACT.email}</span>
                </div>
              </Link>

              <Link
                to="/track"
                onClick={onClose}
                className="p-2.5 rounded-xl border border-border/70 bg-surface-elevated/40 hover:border-accent hover:bg-surface-elevated transition-all flex items-center gap-2"
              >
                <Truck className="h-4 w-4 text-accent shrink-0" />
                <div className="truncate">
                  <span className="font-semibold text-text-primary block truncate">
                    {isAr ? "تتبع الطلبات" : "Track Order"}
                  </span>
                  <span className="text-[10px] text-text-secondary block">
                    {isAr ? "برقم الطلب" : "By Order #"}
                  </span>
                </div>
              </Link>
            </div>
          </section>

          {/* 6. ESSENTIAL MY ACCOUNT & DIGITAL DOWNLOADS */}
          <section className="space-y-2 pt-2 border-t border-border/60">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-accent">
                <CircleUserRound className="h-4 w-4" />
                <h3 className="text-xs font-bold uppercase tracking-widest">
                  {isAr ? "حسابي والتحميلات الرقمية" : "My Account & Downloads"}
                </h3>
              </div>
              <span className="text-[10px] text-text-secondary">
                {user ? user.email?.split("@")[0] : isAr ? "زائر" : "Guest"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <Link
                to={user ? "/account" : "/auth"}
                onClick={onClose}
                className="p-2.5 rounded-xl border border-border/70 bg-surface-elevated/40 hover:border-accent hover:bg-surface-elevated transition-all flex items-center gap-2"
              >
                <CircleUserRound className="h-4 w-4 text-accent shrink-0" />
                <div>
                  <span className="font-semibold block truncate">
                    {user
                      ? isAr
                        ? "لوحة حسابي"
                        : "Account Dashboard"
                      : isAr
                        ? "تسجيل الدخول"
                        : "Sign In / Register"}
                  </span>
                  <span className="text-[10px] text-text-secondary block">
                    {user
                      ? isAr
                        ? "البيانات والطلبات"
                        : "Manage profile"
                      : isAr
                        ? "دخول سريع"
                        : "Fast access"}
                  </span>
                </div>
              </Link>

              <Link
                to={user ? "/account" : "/auth"}
                onClick={onClose}
                className="p-2.5 rounded-xl border border-border/70 bg-surface-elevated/40 hover:border-accent hover:bg-surface-elevated transition-all flex items-center gap-2"
              >
                <Download className="h-4 w-4 text-accent shrink-0" />
                <div>
                  <span className="font-semibold block truncate">
                    {isAr ? "الملفات والتحميلات" : "Digital Downloads"}
                  </span>
                  <span className="text-[10px] text-text-secondary block">
                    {isAr ? "تحميل فوري آمن" : "Secure vault"}
                  </span>
                </div>
              </Link>

              <Link
                to="/wishlist"
                onClick={onClose}
                className="col-span-2 p-2.5 rounded-xl border border-border/70 bg-surface-elevated/40 hover:border-accent hover:bg-surface-elevated transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-accent shrink-0" />
                  <span className="font-semibold">
                    {isAr ? "قائمة الرغبات والمحفوظات" : "Saved Wishlist"}
                  </span>
                </div>
                {wishlistCount > 0 && (
                  <span className="bg-accent/20 text-accent text-[11px] font-bold px-2 py-0.5 rounded-full">
                    {wishlistCount}
                  </span>
                )}
              </Link>
            </div>
          </section>

          {/* 7. CELESTIAL ATMOSPHERE & CONTROLS */}
          <section className="space-y-2 pt-2 border-t border-border/60">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">
              {isAr ? "المظهر الفلكي وراحة القراءة" : "Celestial Atmosphere & Accessibility"}
            </h4>
            <div className="flex flex-wrap gap-2 text-xs">
              {onOpenThemeHub && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenThemeHub();
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-accent/40 bg-accent/10 px-3 py-2 text-accent font-semibold hover:bg-accent hover:text-background transition-all"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>{isAr ? "لوحة السمات الفلكية (11 ثيم)" : "All Themes Hub"}</span>
                </button>
              )}

              {onOpenReadability && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenReadability();
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-border bg-surface-elevated px-3 py-2 text-text-primary font-semibold hover:border-accent hover:text-accent transition-colors"
                >
                  <Eye className="h-3.5 w-3.5 text-accent" />
                  <span>{isAr ? "راحة القراءة والتباين" : "Readability Mode"}</span>
                </button>
              )}
            </div>
          </section>
        </div>
      </aside>
    </div>
  );
}

/**
 * Standard, easily identifiable Hamburger Menu Button component (≡ Menu)
 * Designed to provide clear visual affordance anywhere on the site.
 */
export function HamburgerMenuButton({
  onClick,
  isOpen = false,
  className = "",
}: {
  onClick: () => void;
  isOpen?: boolean;
  className?: string;
}) {
  const { lang } = useI18n();
  const isAr = lang === "ar";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={isOpen}
      aria-label={
        isAr
          ? "فتح القائمة الجانبية: المتجر، الاستوديو، الخدمات، الشحن والدعم"
          : "Open Side Navigation: Store, Custom Studio, Services, Shipping Policies & Support"
      }
      title={
        isAr
          ? "القائمة الجانبية ≡ المتجر، الاستوديو، الخدمات، الشحن والدعم"
          : "Side Navigation ≡ Store, Custom Studio, Services, Shipping Policies & Support"
      }
      className={`group relative inline-flex items-center gap-2 rounded-full border border-accent/40 bg-surface/80 px-3 py-1.5 text-xs font-semibold text-text-primary hover:border-accent hover:bg-accent/15 hover:text-accent transition-all shadow-sm focus:outline-hidden focus:ring-2 focus:ring-accent/40 active:scale-95 ${className}`}
    >
      <div className="flex flex-col justify-center items-center gap-0.5">
        <span className="block h-0.5 w-4 rounded-full bg-accent transition-all group-hover:w-4.5" />
        <span className="block h-0.5 w-3.5 rounded-full bg-accent transition-all group-hover:w-4.5" />
        <span className="block h-0.5 w-4 rounded-full bg-accent transition-all group-hover:w-4.5" />
      </div>
      <span className="font-bold text-xs tracking-wide">{isAr ? "القائمة ≡" : "Menu ≡"}</span>
    </button>
  );
}
