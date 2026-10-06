import { useState, useRef, useEffect } from "react";
import { Moon, Sun, Sunrise, Sunset, Clock, Palette } from "lucide-react";
import { THEMES, THEME_LABELS, useTheme, type Theme } from "@/lib/theme";
import { useI18n } from "@/lib/i18n";

const THEME_ICONS: Record<Theme, typeof Moon> = {
  night: Moon,
  dawn: Sunrise,
  morning: Sun,
  day: Sun,
  dusk: Sunset,
};

const THEME_DESCRIPTIONS: Record<Theme, { en: string; ar: string }> = {
  night: { en: "Midnight Navy & Gold", ar: "سماء الليل الكحلية والتذهيب" },
  dawn: { en: "Violet Twilight & Rose", ar: "شفق الفجر البنفسجي الوردي" },
  morning: { en: "Golden Hour & Azure", ar: "الصباح الفاتح والشمس المشرقة" },
  day: { en: "Ivory Paper & Ink", ar: "ورق عاجي نقي وحبر كحلي" },
  dusk: { en: "Amber Sunset & Indigo", ar: "غروب عسلي دافئ ونغمات نيلية" },
};

export function ThemeSwitcher() {
  const { theme, auto, setTheme, setAuto } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { t, lang } = useI18n();
  const isAr = lang === "ar";

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const CurrentIcon = auto ? Clock : THEME_ICONS[theme] || Moon;

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Theme Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-full border border-border p-2 transition-colors hover:border-gold hover:text-gold"
        aria-label={t("theme.toggle")}
        title={auto ? t("theme.auto") : THEME_LABELS[theme]}
      >
        <CurrentIcon className="h-4 w-4 text-gold transition-transform hover:rotate-12" />
        <span className="hidden xl:inline text-[11px] uppercase tracking-wider font-medium text-muted-foreground">
          {auto ? "Auto" : THEME_LABELS[theme]}
        </span>
      </button>

      {/* Celestial Sky Menu Dropdown */}
      {isOpen && (
        <div className="absolute end-0 top-full mt-2 z-50 w-64 overflow-hidden rounded-2xl border border-gold/40 bg-card p-2 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-3 py-2 border-b border-border/60 flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-[0.16em] text-gold font-semibold flex items-center gap-1.5">
              <Palette className="h-3 w-3" />
              <span>{t("theme.toggle")}</span>
            </span>
          </div>

          <div className="mt-1 space-y-1">
            {/* Auto Mode Button */}
            <button
              type="button"
              onClick={() => {
                setAuto(true);
                setIsOpen(false);
              }}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs transition-colors ${
                auto
                  ? "bg-primary/20 text-gold font-semibold border border-gold/30"
                  : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Clock className="h-4 w-4 text-gold shrink-0" />
                <div className="text-start">
                  <p className="leading-snug">{t("theme.auto")}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {isAr ? "يتغير تلقائياً مع شروق وغروب الشمس" : "Follows solar sun cycle"}
                  </p>
                </div>
              </div>
              {auto && <div className="h-2 w-2 rounded-full bg-gold" />}
            </button>

            {/* Individual Celestial Themes */}
            {THEMES.map((tKey) => {
              const Icon = THEME_ICONS[tKey];
              const isSelected = !auto && theme === tKey;
              const desc = THEME_DESCRIPTIONS[tKey];

              return (
                <button
                  key={tKey}
                  type="button"
                  onClick={() => {
                    setTheme(tKey);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs transition-colors ${
                    isSelected
                      ? "bg-primary/20 text-gold font-semibold border border-gold/30"
                      : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4 text-gold shrink-0" />
                    <div className="text-start">
                      <p className="leading-snug">{THEME_LABELS[tKey]}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {isAr ? desc.ar : desc.en}
                      </p>
                    </div>
                  </div>
                  {isSelected && <div className="h-2 w-2 rounded-full bg-gold" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
