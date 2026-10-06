import { useState, useEffect } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Compass,
  Sparkles,
  ShoppingBag,
  Palette,
  FolderKanban,
  Truck,
  Heart,
  Mail,
  Home,
  Moon,
  X,
  Search,
  ArrowRight,
  Star,
  Check,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";
import { getLunarPhase } from "@/lib/lunar";

interface CosmicNavigationProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenNewsletter?: () => void;
  onOpenCustomizer?: () => void;
}

export function CosmicOrbitNavigator({
  isOpen,
  onClose,
  onOpenNewsletter,
  onOpenCustomizer,
}: CosmicNavigationProps) {
  const { lang } = useI18n();
  const isAr = lang === "ar";
  const { period, config, localTime } = useTheme();
  const activeFour = isAr ? config.nameAr : config.name;
  const router = useRouterState();
  const currentPath = router.location.pathname;
  const lunar = getLunarPhase();

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const REALMS = [
    {
      to: "/",
      title: isAr ? "نواة السديم (الرئيسية)" : "The Nebula Core (Home)",
      desc: isAr
        ? "استكشفي أحدث تصاميم لينورا والمحرك الفلكي الزمني"
        : "Main sanctuary, dynamic celestial atmosphere & latest starry creations",
      icon: Home,
      badge: isAr ? "نواة البداية" : "Genesis Core",
      color: "from-amber-400/20 to-amber-600/10",
      accent: "text-amber-300",
    },
    {
      to: "/shop",
      title: isAr ? "البازار الفلكي (المتجر)" : "Celestial Bazaar (Store)",
      desc: isAr
        ? "ملصقات أسماء مقاومة للماء، دفاتر فلكية، ومخططات رقمية فورية"
        : "Waterproof name labels, starlight notebooks, and instant digital planners",
      icon: ShoppingBag,
      badge: isAr ? "تسوق فوري" : "Instant Drops",
      color: "from-sky-400/20 to-indigo-600/10",
      accent: "text-sky-300",
    },
    {
      to: "/custom-orders",
      title: isAr ? "أتيليه التصميم المخصص" : "Bespoke Design Atelier",
      desc: isAr
        ? "اطلبي هويتك البصرية، كروت مناسباتك، أو أدواتك المدرسية المخصصة بالاسم"
        : "Order tailored branding, wedding invitations, or personalized school sets",
      icon: Palette,
      badge: isAr ? "طلب خاص" : "Tailored",
      color: "from-purple-400/20 to-pink-600/10",
      accent: "text-purple-300",
    },
    {
      to: "/portfolio",
      title: isAr ? "معرض نورا تامر الفلكي" : "Nora Tamer's Starry Gallery",
      desc: isAr
        ? "سجل إبداعي لمشاريع الهوية البصرية، التغليف، والمطبوعات المتقنة"
        : "Curated showcase of brand identities, packaging, and celestial typography",
      icon: FolderKanban,
      badge: isAr ? "أعمال ملهمة" : "Exhibition",
      color: "from-emerald-400/20 to-teal-600/10",
      accent: "text-emerald-300",
    },
    {
      to: "/track",
      title: isAr ? "مسار الشحن والعبور الفلكي" : "Stellar Transit & Order Tracker",
      desc: isAr
        ? "تابعي شحنتك لحظة بلحظة عبر كافة محافظات جمهورية مصر العربية"
        : "Live status tracker for custom shipments across Egyptian governorates",
      icon: Truck,
      badge: isAr ? "تتبع مباشر" : "Live Transit",
      color: "from-amber-400/20 to-orange-600/10",
      accent: "text-amber-400",
    },
    {
      to: "/about",
      title: isAr ? "قصة وفلسفة لينورا ستيلر" : "Linora Stellar Chronicle",
      desc: isAr
        ? "تعرفي على رحلة المؤسسة نورا تامر ورمزية النجوم والإبداع الأصيل"
        : "Discover the heritage of founder Nora Tamer and the cosmic design philosophy",
      icon: Sparkles,
      badge: isAr ? "قصتنا" : "About Linora",
      color: "from-rose-400/20 to-purple-600/10",
      accent: "text-rose-300",
    },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Cosmic Navigation Orbit"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-background/85 backdrop-blur-xl animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border border-accent/40 bg-surface/95 shadow-2xl backdrop-blur-2xl p-6 sm:p-8 card-star"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative Constellation Glow */}
        <div className="pointer-events-none absolute -top-24 -end-24 h-72 w-72 rounded-full bg-accent/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -start-24 h-72 w-72 rounded-full bg-purple-500/15 blur-3xl" />

        {/* Modal Header */}
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/70 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-accent/50 bg-accent/15 text-accent shadow-[0_0_15px_rgba(227,194,128,0.3)] shrink-0">
              <Compass className="h-6 w-6 animate-[spin_12s_linear_infinite]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-2xl font-bold text-text-primary">
                  {isAr ? "البوصلة الكونية للملاحة" : "Cosmic Orbit Navigation"}
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1 rounded-full border border-accent/40 bg-accent/10 px-2.5 py-0.5 text-[10px] uppercase font-mono tracking-wider text-accent">
                  <Star className="h-2.5 w-2.5" />
                  {isAr ? "مدار ستيلر" : "Stellar Orbit"}
                </span>
              </div>
              <p className="text-xs text-text-secondary mt-0.5">
                {isAr
                  ? "انتقلي بسلاسة بين العوالم الفلكية لمتجر واستوديو لينورا"
                  : "Navigate seamlessly across Linora's cosmic domains and bespoke design realms"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* Astronomical Status Badge */}
            <div className="hidden md:flex items-center gap-2 rounded-xl border border-border/80 bg-surface-elevated/70 px-3 py-1.5 text-[11px] text-text-secondary font-mono">
              <span className="text-accent">{lunar.emoji}</span>
              <span>{isAr ? lunar.nameAr : lunar.name}</span>
              <span className="text-border">|</span>
              <span className="text-accent font-semibold uppercase">{activeFour}</span>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface hover:border-accent hover:text-accent transition-colors text-text-secondary"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Realms Grid */}
        <div className="relative mt-6 grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {REALMS.map((realm) => {
            const Icon = realm.icon;
            const isActive = currentPath === realm.to;

            return (
              <Link
                key={realm.to}
                to={realm.to}
                onClick={onClose}
                className={`group relative overflow-hidden rounded-2xl border p-4 transition-all duration-300 hover:border-accent hover:shadow-[0_0_25px_rgba(227,194,128,0.2)] ${
                  isActive
                    ? "border-accent bg-accent/10 shadow-md"
                    : "border-border/70 bg-surface-elevated/50 hover:bg-surface-elevated/90"
                }`}
              >
                {/* Subtle gradient shine */}
                <div
                  className={`pointer-events-none absolute inset-0 bg-linear-to-br ${realm.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                />

                <div className="relative flex items-start gap-3.5">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-transform duration-300 group-hover:scale-110 ${
                      isActive
                        ? "border-accent bg-accent text-background"
                        : "border-border/80 bg-surface text-accent group-hover:border-accent group-hover:bg-accent/15"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-sans text-sm font-semibold text-text-primary group-hover:text-accent transition-colors truncate">
                        {realm.title}
                      </h3>
                      <span className="shrink-0 rounded-full border border-border/80 bg-surface/80 px-2 py-0.5 text-[10px] text-text-secondary font-mono">
                        {realm.badge}
                      </span>
                    </div>

                    <p className="text-xs text-text-secondary leading-relaxed line-clamp-2 mt-1">
                      {realm.desc}
                    </p>
                  </div>

                  <div className="shrink-0 self-center text-text-secondary group-hover:text-accent group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-all">
                    <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Quick Cosmic Actions Footer */}
        <div className="relative mt-6 border-t border-border/70 pt-5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-text-secondary font-mono text-[11px]">
              {isAr ? "⚡ عمليات فلكية سريعة:" : "⚡ Fast Cosmic Portals:"}
            </span>

            {/* Newsletter VIP trigger */}
            {onOpenNewsletter && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenNewsletter();
                }}
                className="inline-flex items-center gap-1.5 rounded-full border border-accent/50 bg-accent/15 px-3 py-1 text-accent font-semibold hover:bg-accent hover:text-background transition-all"
              >
                <Sparkles className="h-3 w-3" />
                <span>{isAr ? "كوبون 10% والنشرة" : "VIP Newsletter (10% OFF)"}</span>
              </button>
            )}

            {/* Instant Customizer trigger */}
            {onOpenCustomizer && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenCustomizer();
                }}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-elevated px-3 py-1 text-text-primary hover:border-accent hover:text-accent transition-all"
              >
                <Palette className="h-3 w-3 text-accent" />
                <span>{isAr ? "استوديو التخصيص" : "Personalize Studio"}</span>
              </button>
            )}
          </div>

          <div className="text-[11px] text-text-secondary font-mono">
            <span>{isAr ? "اضغط ESC للإغلاق" : "Press ESC to close"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Cosmic Navigation Trigger Button (Floating or Embedded)
 */
export function CosmicNavigationButton({
  onClick,
  className = "",
}: {
  onClick: () => void;
  className?: string;
}) {
  const { lang } = useI18n();
  const isAr = lang === "ar";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative inline-flex items-center gap-1.5 rounded-full border border-accent/60 bg-surface/80 backdrop-blur-md px-3 py-1.5 text-xs text-text-primary hover:border-accent hover:text-accent shadow-xs transition-all ${className}`}
      title={isAr ? "فتح الملاحة الكونية (مدار ستيلر)" : "Open Cosmic Navigation Orbit"}
    >
      <Compass className="h-3.5 w-3.5 text-accent group-hover:rotate-45 transition-transform duration-300" />
      <span className="font-medium tracking-wide">{isAr ? "الملاحة الكونية" : "Cosmic Orbit"}</span>
      <span className="hidden sm:inline-block h-1.5 w-1.5 rounded-full bg-accent animate-ping" />
    </button>
  );
}

/**
 * Floating Quick Orbit Pill for direct access from anywhere on the screen
 */
export function FloatingCosmicOrbit({ onClick }: { onClick: () => void }) {
  const { lang } = useI18n();
  const isAr = lang === "ar";

  return (
    <div className="fixed bottom-20 end-5 z-40 hidden md:block pointer-events-auto">
      <button
        type="button"
        onClick={onClick}
        className="group relative flex items-center gap-2 rounded-full border border-accent/60 bg-surface/90 backdrop-blur-xl px-3.5 py-2 text-xs font-semibold text-text-primary shadow-xl hover:border-accent hover:shadow-[0_0_20px_rgba(227,194,128,0.4)] transition-all card-star"
        title={isAr ? "افتحي بوصلة الملاحة الكونية" : "Open Cosmic Orbit Navigation"}
      >
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-background shadow-xs">
          <Compass className="h-3.5 w-3.5 group-hover:rotate-90 transition-transform duration-500" />
        </div>
        <span className="text-accent tracking-wider uppercase text-[11px]">
          {isAr ? "الملاحة الكونية" : "Cosmic Nav"}
        </span>
        <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
      </button>
    </div>
  );
}
