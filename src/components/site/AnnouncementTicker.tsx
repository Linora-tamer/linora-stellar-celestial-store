import { useState, useEffect } from "react";
import {
  Sparkles,
  Truck,
  Gift,
  Download,
  Moon,
  Sun,
  Sunrise,
  Sunset,
  ChevronDown,
  Check,
  Palette,
  RotateCcw,
} from "lucide-react";
import { useTheme } from "@/lib/theme";
import { useI18n } from "@/lib/i18n";

export function AnnouncementTicker() {
  const { period, setPeriod, auto, resetToAuto } = useTheme();
  const { lang } = useI18n();
  const isAr = lang === "ar";

  const [currentIndex, setCurrentIndex] = useState(0);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);

  const ANNOUNCEMENTS = [
    {
      icon: Truck,
      en: "Free Shipping on Cairo & Giza orders over 500 EGP",
      ar: "شحن مجاني لطلبات القاهرة والجيزة فوق 500 ج.م",
      highlight: "500 EGP",
    },
    {
      icon: Gift,
      en: "Use code STELLAR10 for 10% OFF your first order",
      ar: "استخدم كود STELLAR10 للحصول على خصم 10% على طلبك الأول",
      highlight: "STELLAR10",
    },
    {
      icon: Sparkles,
      en: "Back-to-School Bundles & Custom POD Merch now live!",
      ar: "باقات العودة للمدرسة واستوديو الطباعة عند الطلب متوفر الآن!",
      highlight: "POD Merch",
    },
    {
      icon: Download,
      en: "Instant Digital Downloads delivered immediately upon checkout",
      ar: "تحميل رقمي فوري ومباشر لجميع المخططات والمطبوعات بعد الدفع",
      highlight: "Instant",
    },
  ];

  // Rotate announcement ticker every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [ANNOUNCEMENTS.length]);

  const activeAnnouncement = ANNOUNCEMENTS[currentIndex];
  const Icon = activeAnnouncement.icon;

  const THEMES = [
    { id: "daylight" as const, labelEn: "Daylight", labelAr: "وضح النهار", icon: Sun, emoji: "☀️" },
    { id: "sunset" as const, labelEn: "Sunset", labelAr: "الغروب", icon: Sunset, emoji: "🌙" },
    {
      id: "midnight" as const,
      labelEn: "Midnight",
      labelAr: "منتصف الليل",
      icon: Moon,
      emoji: "🌌",
    },
    { id: "dawn" as const, labelEn: "Dawn", labelAr: "الفجر", icon: Sunrise, emoji: "🌅" },
  ];

  const currentThemeObj = THEMES.find((t) => t.id === period) || THEMES[0];
  const CurrentIcon = currentThemeObj.icon;

  return (
    <div className="relative z-50 border-b border-[var(--glass-border)] bg-[var(--nav-bg)]/95 backdrop-blur-md text-xs py-1.5 px-3 transition-colors duration-500">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
        {/* Left / Center: Rotating Announcement Ticker */}
        <div className="flex-1 flex items-center justify-center sm:justify-start gap-2 overflow-hidden text-center sm:text-start">
          <div className="flex items-center gap-1.5 text-accent font-semibold shrink-0">
            <Icon className="h-3.5 w-3.5 animate-pulse" />
          </div>
          <p
            key={currentIndex}
            className="text-[11px] sm:text-xs text-text-primary animate-in fade-in slide-in-from-bottom-1 duration-300 truncate"
          >
            {isAr ? activeAnnouncement.ar : activeAnnouncement.en}
          </p>
        </div>

        {/* Right: Explicit, Super Easy "Theme / ثيم" Switcher Button */}
        <div className="relative shrink-0 flex items-center gap-1.5">
          <div className="relative">
            <button
              type="button"
              onClick={() => setThemeDropdownOpen((v) => !v)}
              className="flex items-center gap-1.5 rounded-full border border-accent/60 bg-accent/15 px-2.5 py-1 text-[11px] font-bold text-accent hover:bg-accent hover:text-background transition-all shadow-xs"
              title={isAr ? "تغيير المظهر الفلكي (ثيم)" : "Change Celestial Theme"}
              aria-expanded={themeDropdownOpen}
              aria-label="Theme Switcher"
            >
              <Palette className="h-3 w-3 text-accent" />
              <span>{isAr ? "ثيم:" : "Theme:"}</span>
              <span className="font-semibold flex items-center gap-1">
                <span>{isAr ? currentThemeObj.labelAr : currentThemeObj.labelEn}</span>
                <span className="text-xs">{currentThemeObj.emoji}</span>
              </span>
              <ChevronDown
                className={`h-3 w-3 transition-transform duration-200 ${
                  themeDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Theme Dropdown Menu */}
            {themeDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setThemeDropdownOpen(false)} />
                <div className="absolute end-0 top-full mt-1.5 z-50 w-44 rounded-2xl border border-accent/40 bg-surface p-1.5 shadow-2xl backdrop-blur-xl card-star animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-text-secondary border-b border-border/50 mb-1">
                    {isAr ? "اختر مظهر السماء الفلكي" : "Select Sky Theme"}
                  </div>
                  {THEMES.map((th) => {
                    const ThIcon = th.icon;
                    const isActive = period === th.id;
                    return (
                      <button
                        key={th.id}
                        type="button"
                        onClick={() => {
                          setPeriod(th.id);
                          setThemeDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between rounded-xl px-2.5 py-1.5 text-xs text-start transition-all ${
                          isActive
                            ? "bg-accent text-background font-bold shadow-xs"
                            : "text-text-primary hover:bg-surface-elevated hover:text-accent"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <ThIcon className="h-3.5 w-3.5" />
                          <span>{isAr ? th.labelAr : th.labelEn}</span>
                          <span>{th.emoji}</span>
                        </div>
                        {isActive && <Check className="h-3 w-3" />}
                      </button>
                    );
                  })}

                  {/* Return to Cairo live real-time auto sync */}
                  <div className="pt-1 mt-1 border-t border-border/50">
                    <button
                      type="button"
                      onClick={() => {
                        resetToAuto();
                        setThemeDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between rounded-xl px-2.5 py-1.5 text-[11px] text-start transition-all ${
                        auto
                          ? "bg-accent/20 text-accent font-bold"
                          : "text-text-secondary hover:bg-surface-elevated hover:text-accent"
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <RotateCcw className="h-3 w-3 text-accent" />
                        <span>{isAr ? "المزامنة الحية لتوقيت مصر" : "Auto Cairo Sync"}</span>
                      </div>
                      {auto && <Check className="h-3 w-3" />}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
