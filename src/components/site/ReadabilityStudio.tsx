import { useState } from "react";
import {
  Eye,
  Type,
  SunMoon,
  Sparkles,
  Check,
  RotateCcw,
  X,
  Sliders,
  ShieldCheck,
} from "lucide-react";
import { useReadability, type FontWeight, type ContrastMode } from "@/lib/readability";
import { useI18n } from "@/lib/i18n";

export function ReadabilityBackdropLayer() {
  const { overlayActive } = useReadability();
  if (!overlayActive) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-1 bg-background/55 backdrop-blur-[2px] transition-all duration-500 ease-in-out"
    />
  );
}

export function ReadabilityStudioModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const {
    overlayActive,
    fontWeight,
    contrastMode,
    toggleOverlay,
    setFontWeight,
    setContrastMode,
    resetToDefaults,
  } = useReadability();

  const { lang } = useI18n();
  const isAr = lang === "ar";

  if (!isOpen) return null;

  const FONT_WEIGHT_OPTIONS: Array<{
    id: FontWeight;
    labelEn: string;
    labelAr: string;
    subEn: string;
    subAr: string;
  }> = [
    {
      id: "normal",
      labelEn: "Regular (400)",
      labelAr: "عادي (400)",
      subEn: "Standard celestial typography",
      subAr: "الوزن الأصلي لتصميم الموقع",
    },
    {
      id: "medium",
      labelEn: "Medium (500)",
      labelAr: "متوسط (500)",
      subEn: "Enhanced clarity & weight",
      subAr: "وضوح إضافي ومريح للقراءة",
    },
    {
      id: "bold",
      labelEn: "Bold (700)",
      labelAr: "عريض (700)",
      subEn: "Maximum bold legibility",
      subAr: "سماكة عالية للخطوط والعناوين",
    },
  ];

  const CONTRAST_OPTIONS: Array<{
    id: ContrastMode;
    labelEn: string;
    labelAr: string;
    descEn: string;
    descAr: string;
    badge: string;
  }> = [
    {
      id: "standard",
      labelEn: "Celestial Theme",
      labelAr: "الوضع الفلكي المتوازن",
      descEn: "Astronomical time palette tailored to morning, afternoon & midnight",
      descAr: "الألوان الفلكية المتوافقة مع أطوار اليوم والليل",
      badge: "Default",
    },
    {
      id: "high",
      labelEn: "High Contrast (AAA)",
      labelAr: "تباين عالي فائق (AAA)",
      descEn: "Pure luminous text, bold gold accents, enhanced text shadow",
      descAr: "نصوص ناصعة البياض مع إطارات ذهبية بارزة لسهولة القراءة",
      badge: "WCAG AAA",
    },
    {
      id: "max",
      labelEn: "Monochrome Max",
      labelAr: "أقصى تباين أحادي",
      descEn: "Pure pitch black & starlight white with underlined hyperlinks",
      descAr: "سواد ليلي خالص ونصوص بيضاء ناصعة مع تمييز الروابط",
      badge: "Max Contrast",
    },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl rounded-3xl border border-accent/50 bg-surface/95 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl card-star max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 text-accent border border-accent/40 shadow-xs">
              <Eye className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-2xl font-bold text-text-primary">
                {isAr ? "إعدادات راحة القراءة والتباين" : "Readability & Contrast Studio"}
              </h3>
              <p className="text-xs text-text-secondary">
                {isAr
                  ? "تخصيص سماكة الخطوط، طبقة التركيز، وأوضاع التباين الفائق"
                  : "Customize text weights, readability scrim, and high-contrast modes"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface text-text-secondary hover:text-text-primary hover:border-accent transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6 space-y-6">
          {/* 1. Readability Overlay Toggle */}
          <div className="rounded-2xl border border-border/80 bg-surface-elevated/70 p-4 transition-all">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-sans text-sm font-semibold text-text-primary">
                    {isAr ? "طبقة حماية القراءة والتركيز" : "Readability Backdrop Scrim"}
                  </span>
                  {overlayActive && (
                    <span className="rounded-full bg-accent/20 px-2 py-0.5 text-[9px] uppercase font-mono font-bold text-accent">
                      {isAr ? "نشط" : "ACTIVE"}
                    </span>
                  )}
                </div>
                <p className="text-xs text-text-secondary leading-relaxed max-w-sm">
                  {isAr
                    ? "تهدئة حركة النجوم الخلفية وزيادة عتامة البطاقات لمنع تشتت العين أثناء القراءة."
                    : "Softens starfield particles and elevates container opacity for distraction-free reading."}
                </p>
              </div>

              {/* Toggle switch */}
              <button
                type="button"
                role="switch"
                aria-checked={overlayActive}
                onClick={toggleOverlay}
                className={`relative inline-flex h-7 w-13 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-accent ${
                  overlayActive ? "bg-accent" : "bg-surface-elevated border-border"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-300 ease-in-out ${
                    overlayActive ? "translate-x-6 rtl:-translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* 2. Dynamic Font Weight Selector */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-text-secondary font-semibold">
                <Type className="h-4 w-4 text-accent" />
                <span>{isAr ? "سماكة الخط التفاعلية" : "Dynamic Font Weight"}</span>
              </div>
              <span className="font-mono text-[11px] text-accent font-semibold capitalize">
                {fontWeight}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {FONT_WEIGHT_OPTIONS.map((opt) => {
                const isSelected = fontWeight === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setFontWeight(opt.id)}
                    className={`flex flex-col items-start p-3 rounded-2xl border text-start transition-all ${
                      isSelected
                        ? "border-accent bg-accent/15 shadow-sm text-text-primary ring-1 ring-accent"
                        : "border-border bg-surface-elevated/50 text-text-secondary hover:text-text-primary hover:border-accent/60"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span
                        className={`text-sm ${
                          opt.id === "bold"
                            ? "font-bold"
                            : opt.id === "medium"
                              ? "font-medium"
                              : "font-normal"
                        }`}
                      >
                        {isAr ? opt.labelAr : opt.labelEn}
                      </span>
                      {isSelected && <Check className="h-3.5 w-3.5 text-accent" />}
                    </div>
                    <span className="text-[10px] text-text-secondary mt-1">
                      {isAr ? opt.subAr : opt.subEn}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. High-Contrast Text Modes */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-text-secondary font-semibold">
                <SunMoon className="h-4 w-4 text-accent" />
                <span>{isAr ? "أوضاع التباين الفائق للنصوص" : "High-Contrast Text Modes"}</span>
              </div>
              <span className="font-mono text-[11px] text-accent font-semibold uppercase">
                {contrastMode}
              </span>
            </div>

            <div className="space-y-2">
              {CONTRAST_OPTIONS.map((opt) => {
                const isSelected = contrastMode === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setContrastMode(opt.id)}
                    className={`flex items-start justify-between gap-3 w-full p-3.5 rounded-2xl border text-start transition-all ${
                      isSelected
                        ? "border-accent bg-accent/15 shadow-sm text-text-primary ring-1 ring-accent"
                        : "border-border bg-surface-elevated/40 text-text-secondary hover:text-text-primary hover:border-accent/60"
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-sans text-sm font-semibold text-text-primary">
                          {isAr ? opt.labelAr : opt.labelEn}
                        </span>
                        <span className="rounded-full bg-surface border border-border px-2 py-0.5 text-[9px] uppercase font-mono text-text-secondary">
                          {opt.badge}
                        </span>
                      </div>
                      <p className="text-xs text-text-secondary">
                        {isAr ? opt.descAr : opt.descEn}
                      </p>
                    </div>

                    <div
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border mt-0.5 transition-colors ${
                        isSelected
                          ? "border-accent bg-accent text-background"
                          : "border-border bg-surface"
                      }`}
                    >
                      {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live Preview Sample */}
          <div className="rounded-2xl border border-border bg-surface-elevated p-4 space-y-1.5 shadow-inner">
            <span className="text-[10px] uppercase font-mono tracking-wider text-accent font-bold block">
              {isAr ? "✦ معاينة حية للنص الحالي:" : "✦ Live Typography Preview:"}
            </span>
            <p className="text-xs sm:text-sm text-text-primary leading-relaxed">
              {isAr
                ? "لينورا ستيلر: حيث تلتقي الدقة الفلكية بالأناقة الفائقة في عالم المطبوعات والتصميم."
                : "Linora Stellar: Where celestial precision meets handcrafted stationery elegance."}
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4">
          <button
            type="button"
            onClick={resetToDefaults}
            className="inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-accent transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>{isAr ? "استعادة الوضع الافتراضي" : "Reset to Defaults"}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-accent px-5 py-2 text-xs uppercase tracking-wider text-background font-bold hover:brightness-110 shadow-md transition-all"
          >
            {isAr ? "حفظ وإغلاق" : "Apply & Close"}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Compact Pill Button for TimeControlBar and Header
 */
export function ReadabilityPill({ className = "" }: { className?: string }) {
  const [modalOpen, setModalOpen] = useState(false);
  const { overlayActive, fontWeight, contrastMode } = useReadability();
  const { lang } = useI18n();
  const isAr = lang === "ar";

  const isCustomized = overlayActive || fontWeight !== "normal" || contrastMode !== "standard";

  return (
    <>
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className={`group relative inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] transition-all ${
          isCustomized
            ? "border-accent/70 bg-accent/20 text-accent font-semibold shadow-xs"
            : "border-border/80 bg-surface/60 text-text-secondary hover:border-accent hover:text-text-primary"
        } ${className}`}
        title={isAr ? "إعدادات راحة القراءة والتباين" : "Readability & Contrast Settings"}
      >
        <Eye className={`h-3 w-3 ${isCustomized ? "text-accent animate-pulse" : ""}`} />
        <span>{isAr ? "راحة القراءة" : "Readability"}</span>
        {isCustomized && <span className="h-1.5 w-1.5 rounded-full bg-accent animate-ping" />}
      </button>

      <ReadabilityStudioModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
