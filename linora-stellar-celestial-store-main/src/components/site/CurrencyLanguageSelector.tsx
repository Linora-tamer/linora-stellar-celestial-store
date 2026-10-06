import { useState, useEffect } from "react";
import { Globe, ChevronDown, Check } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export const CURRENCIES = [
  { code: "EGP", labelAr: "ج.م (EGP)", labelEn: "EGP (ج.م)", symbol: "EGP" },
  { code: "USD", labelAr: "دولار ($)", labelEn: "USD ($)", symbol: "$" },
  { code: "SAR", labelAr: "ريال (SAR)", labelEn: "SAR (ر.س)", symbol: "SAR" },
  { code: "AED", labelAr: "درهم (AED)", labelEn: "AED (د.إ)", symbol: "AED" },
];

export function CurrencyLanguageSelector({ compact = false }: { compact?: boolean }) {
  const { lang, setLang } = useI18n();
  const isAr = lang === "ar";
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<string>("EGP");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("linora_currency");
      if (saved) {
        setSelectedCurrency(saved);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleCurrencyChange = (code: string) => {
    setSelectedCurrency(code);
    try {
      localStorage.setItem("linora_currency", code);
    } catch {
      // ignore
    }
    setDropdownOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setDropdownOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-full border border-border/80 bg-surface/60 px-2.5 py-1 text-xs text-text-primary hover:border-accent hover:text-accent transition-colors"
        title={isAr ? "تغيير اللغة والعملة" : "Currency & Language"}
        aria-expanded={dropdownOpen}
      >
        <Globe className="h-3.5 w-3.5 text-accent" />
        <span className="font-semibold">{lang === "ar" ? "العربية" : "EN"}</span>
        <span className="text-border/80">•</span>
        <span className="font-mono text-[11px] text-text-secondary">{selectedCurrency}</span>
        <ChevronDown
          className={`h-3 w-3 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
        />
      </button>

      {dropdownOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
          <div className="absolute end-0 top-full mt-1.5 z-50 w-52 rounded-2xl border border-accent/40 bg-surface p-2 shadow-2xl backdrop-blur-xl card-star animate-in fade-in zoom-in-95 duration-150">
            {/* Language Section */}
            <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-text-secondary border-b border-border/50 mb-1.5">
              {isAr ? "اللغة / Language" : "Language"}
            </div>
            <div className="flex gap-1 mb-2">
              <button
                type="button"
                onClick={() => {
                  setLang("ar");
                }}
                className={`flex-1 rounded-xl py-1 px-2 text-xs font-semibold text-center transition-all ${
                  lang === "ar"
                    ? "bg-accent text-background shadow-xs font-bold"
                    : "bg-surface-elevated text-text-secondary hover:text-text-primary"
                }`}
              >
                العربية
              </button>
              <button
                type="button"
                onClick={() => {
                  setLang("en");
                }}
                className={`flex-1 rounded-xl py-1 px-2 text-xs font-semibold text-center transition-all ${
                  lang === "en"
                    ? "bg-accent text-background shadow-xs font-bold"
                    : "bg-surface-elevated text-text-secondary hover:text-text-primary"
                }`}
              >
                English
              </button>
            </div>

            {/* Currency Section */}
            <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-text-secondary border-b border-border/50 mb-1.5">
              {isAr ? "العملة / Currency" : "Currency"}
            </div>
            <div className="space-y-1">
              {CURRENCIES.map((c) => {
                const isSelected = selectedCurrency === c.code;
                return (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => handleCurrencyChange(c.code)}
                    className={`w-full flex items-center justify-between rounded-xl px-2.5 py-1.5 text-xs text-start transition-all ${
                      isSelected
                        ? "bg-accent/15 text-accent font-bold border border-accent/30"
                        : "text-text-primary hover:bg-surface-elevated hover:text-accent"
                    }`}
                  >
                    <span>{isAr ? c.labelAr : c.labelEn}</span>
                    {isSelected && <Check className="h-3.5 w-3.5 text-accent" />}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
