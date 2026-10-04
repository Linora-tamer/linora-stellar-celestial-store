import { useState, useId } from "react";
import { Moon, Sparkles, Compass, X, Calendar, ArrowRight, Info, Check } from "lucide-react";
import { getLunarPhase, getAllLunarPhases, type LunarPhaseInfo } from "@/lib/lunar";
import { useI18n } from "@/lib/i18n";
import { Star } from "@/components/site/Star";

export { getLunarPhase, getAllLunarPhases, type LunarPhaseInfo };

export function MoonPhaseSvg({
  phaseIndex,
  illumination,
  size = 56,
}: {
  phaseIndex: number;
  illumination: number;
  size?: number;
}) {
  const maskId = useId();
  // SVG drawing of a realistic illuminated moon sphere
  // Base moon is dark sphere, illuminated part is rendered via curved path or overlapping circle
  const r = size / 2 - 2;
  const cx = size / 2;
  const cy = size / 2;

  // Compute horizontal distortion for the terminator line
  // phaseIndex 0 = New Moon, 2 = First Quarter, 4 = Full Moon, 6 = Last Quarter
  const isWaxing = phaseIndex >= 0 && phaseIndex <= 4;
  const fraction = illumination / 100;
  // Offset of the dark crescent or light crescent
  const dX = (1 - fraction * 2) * r;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="shrink-0 drop-shadow-[0_0_12px_rgba(227,194,128,0.45)]"
      aria-label={`Moon Phase: ${illumination}% illuminated`}
    >
      <defs>
        {/* Glow filter */}
        <radialGradient id={`moonGlow-${maskId}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFF7ED" stopOpacity="1" />
          <stop offset="70%" stopColor="#E3C280" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#C5A059" stopOpacity="0.6" />
        </radialGradient>
        <radialGradient id={`moonDark-${maskId}`} cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#141D30" />
          <stop offset="100%" stopColor="#070B14" />
        </radialGradient>
        <mask id={`illuminationMask-${maskId}`}>
          {/* Base white circle */}
          <circle cx={cx} cy={cy} r={r} fill="#fff" />
          {/* Subtract or add based on waxing/waning */}
          {fraction < 0.99 && fraction > 0.01 && (
            <path
              d={
                isWaxing
                  ? `M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx} ${cy + r} A ${Math.abs(
                      dX,
                    )} ${r} 0 0 ${dX > 0 ? 0 : 1} ${cx} ${cy - r}`
                  : `M ${cx} ${cy - r} A ${r} ${r} 0 0 0 ${cx} ${cy + r} A ${Math.abs(
                      dX,
                    )} ${r} 0 0 ${dX > 0 ? 1 : 0} ${cx} ${cy - r}`
              }
              fill="#000"
            />
          )}
        </mask>
      </defs>

      {/* Dark Lunar Body */}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill={`url(#moonDark-${maskId})`}
        stroke="rgba(227,194,128,0.3)"
        strokeWidth="1"
      />

      {/* Surface Crater accents (dark) */}
      <circle cx={cx - r * 0.3} cy={cy - r * 0.25} r={r * 0.16} fill="rgba(0,0,0,0.25)" />
      <circle cx={cx + r * 0.25} cy={cy + r * 0.2} r={r * 0.22} fill="rgba(0,0,0,0.2)" />
      <circle cx={cx - r * 0.1} cy={cy + r * 0.35} r={r * 0.12} fill="rgba(0,0,0,0.25)" />

      {/* Illuminated side */}
      {fraction > 0.02 && (
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill={`url(#moonGlow-${maskId})`}
          mask={fraction < 0.98 ? `url(#illuminationMask-${maskId})` : undefined}
        />
      )}

      {/* Subtle outer atmospheric halo ring */}
      <circle
        cx={cx}
        cy={cy}
        r={r + 1}
        fill="none"
        stroke="rgba(227,194,128,0.4)"
        strokeWidth="1"
        opacity="0.6"
      />
    </svg>
  );
}

export function LunarPhaseTrackerModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { lang } = useI18n();
  const isAr = lang === "ar";
  const current = getLunarPhase();
  const [selectedPhaseIndex, setSelectedPhaseIndex] = useState<number>(current.phaseIndex);
  const allPhases = getAllLunarPhases();
  const activePhase = allPhases[selectedPhaseIndex];

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="lunar-tracker-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-3xl border border-accent/40 bg-surface/95 p-6 sm:p-8 shadow-2xl backdrop-blur-xl transition-all max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute end-4 top-4 rounded-full p-2 text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-colors"
          aria-label={isAr ? "إغلاق" : "Close"}
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-border/60 pb-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/15 border border-accent/30 text-accent">
            <Moon className="h-6 w-6 text-accent animate-pulse" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-widest text-accent">
              <Sparkles className="h-3 w-3 text-accent" />
              <span>{isAr ? "مرصد أطوار القمر الفلكي" : "Astronomical Lunar Observatory"}</span>
            </div>
            <h2
              id="lunar-tracker-title"
              className="font-display text-2xl sm:text-3xl font-bold text-text-primary"
            >
              {isAr ? "راصد أطوار القمر والإبداع" : "Lunar Phase Tracker"}
            </h2>
          </div>
        </div>

        {/* Live Current Lunar Phase Banner */}
        <div className="mt-6 rounded-2xl border border-accent/50 bg-linear-to-r from-accent/10 via-surface to-accent/5 p-5 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-inner">
          <div className="flex items-center gap-4 text-center sm:text-start">
            <MoonPhaseSvg
              phaseIndex={current.phaseIndex}
              illumination={current.illumination}
              size={70}
            />
            <div>
              <div className="inline-flex items-center gap-1 rounded-full bg-accent/20 px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider text-accent border border-accent/40">
                <span className="h-1.5 w-1.5 rounded-full bg-accent animate-ping" />
                <span>{isAr ? "الطور القمري الحالي" : "Live Moon Today"}</span>
              </div>
              <h3 className="mt-1 font-display text-xl sm:text-2xl font-bold text-text-primary">
                {isAr ? current.nameAr : current.name} {current.emoji}
              </h3>
              <p className="text-xs text-text-secondary mt-0.5">
                {isAr
                  ? `نسبة الإضاءة: ${current.illumination}% • عمر القمر: ${current.ageDays} يوم من الدورة الشهرية`
                  : `${current.illumination}% Illuminated • Lunar Age: ${current.ageDays} days in synodic cycle`}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 shrink-0 text-center sm:text-end">
            <div className="rounded-xl border border-border/80 bg-surface/80 px-3.5 py-2">
              <span className="block text-[10px] uppercase tracking-wider text-text-secondary">
                {isAr ? "حتى البدر المكتمل القادم" : "Next Full Moon"}
              </span>
              <span className="font-mono text-sm font-bold text-accent">
                {current.daysToFullMoon} {isAr ? "أيام" : "days"}
              </span>
            </div>
            <div className="rounded-xl border border-border/80 bg-surface/80 px-3.5 py-2">
              <span className="block text-[10px] uppercase tracking-wider text-text-secondary">
                {isAr ? "حتى المحاق القادم" : "Next New Moon"}
              </span>
              <span className="font-mono text-sm font-bold text-text-primary">
                {current.daysToNewMoon} {isAr ? "أيام" : "days"}
              </span>
            </div>
          </div>
        </div>

        {/* 8-Phase Interactive Explorer */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase tracking-wider font-semibold text-text-secondary flex items-center gap-1.5">
              <Compass className="h-3.5 w-3.5 text-accent" />
              <span>
                {isAr ? "استكشاف دورة القمر الـ 8 أطوار:" : "Explore All 8 Synodic Phases:"}
              </span>
            </span>
            <span className="text-[11px] font-mono text-accent">
              {isAr ? "انقري لمعاينة الطور" : "Click any phase to preview"}
            </span>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {allPhases.map((phase, idx) => {
              const isSelected = selectedPhaseIndex === idx;
              const isCurrent = current.phaseIndex === idx;

              return (
                <button
                  key={phase.key}
                  type="button"
                  onClick={() => setSelectedPhaseIndex(idx)}
                  className={`group relative flex flex-col items-center justify-center p-2.5 rounded-2xl border transition-all ${
                    isSelected
                      ? "border-accent bg-accent/20 shadow-md ring-2 ring-accent/50 scale-105"
                      : "border-border/70 bg-surface/60 hover:border-accent/60 hover:bg-surface-elevated"
                  }`}
                >
                  {isCurrent && (
                    <span className="absolute -top-1.5 -end-1 flex h-2 w-2 rounded-full bg-accent animate-ping" />
                  )}
                  <span className="text-2xl transition-transform group-hover:scale-110">
                    {phase.emoji}
                  </span>
                  <span className="mt-1 text-[10px] font-medium leading-tight text-center text-text-primary line-clamp-1">
                    {isAr ? phase.nameAr : phase.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Phase Detail & Creative Ritual Guidance */}
        <div className="mt-6 rounded-2xl border border-border/80 bg-surface-elevated/70 p-5 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{activePhase.emoji}</span>
              <div>
                <h4 className="font-display text-lg font-bold text-text-primary">
                  {isAr ? activePhase.nameAr : activePhase.name}
                </h4>
                <p className="text-[11px] font-mono text-accent">
                  {selectedPhaseIndex === current.phaseIndex
                    ? isAr
                      ? "✦ طور القمر اليوم"
                      : "✦ Current Lunar Phase"
                    : isAr
                      ? `الطور رقم ${selectedPhaseIndex + 1} من 8`
                      : `Phase ${selectedPhaseIndex + 1} of 8`}
                </p>
              </div>
            </div>
            <div className="text-end">
              <span className="text-[10px] uppercase tracking-wider text-text-secondary block">
                {isAr ? "طاقة الإبداع" : "Creative Focus"}
              </span>
              <span className="text-xs font-semibold text-accent">
                {isAr ? "إلهام وتناغم فلكي" : "Cosmic Alignment"}
              </span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-border/60">
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              <strong className="text-text-primary font-semibold block mb-1">
                {isAr ? "طقس الإبداع وتناغم الأفكار:" : "Creative Ritual & Energy:"}
              </strong>
              {isAr ? activePhase.ritualAr : activePhase.ritualEn}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between flex-wrap gap-2 text-xs">
            <span className="text-text-secondary">
              <span className="text-accent font-semibold">
                {isAr ? "المنتجات الملهمة لهذا الطور: " : "Harmonizing Pieces: "}
              </span>
              {isAr ? activePhase.productsAr : activePhase.productsEn}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="ms-auto inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
            >
              <span>{isAr ? "تسوقي هذا الطور" : "Explore Harmonized Pieces"}</span>
              <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <p className="mt-5 text-center text-[11px] text-text-secondary/80 flex items-center justify-center gap-1.5">
          <Info className="h-3 w-3 text-accent" />
          <span>
            {isAr
              ? "يتم حساب أطوار القمر بدقة فلكية وفق الدورة الاقترانية القمرية (29.53 يوماً)."
              : "Calculated with astronomical precision based on the 29.53-day synodic lunar cycle."}
          </span>
        </p>
      </div>
    </div>
  );
}

/**
 * Compact Top Bar Trigger Button for Lunar Phase
 */
export function LunarPhasePill() {
  const [modalOpen, setModalOpen] = useState(false);
  const { lang } = useI18n();
  const isAr = lang === "ar";
  const current = getLunarPhase();

  return (
    <>
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className="group inline-flex items-center gap-1.5 rounded-full border border-[var(--glass-border)] bg-surface/70 px-2.5 py-1 text-[11px] text-text-secondary hover:text-accent hover:border-accent transition-all shadow-xs"
        title={isAr ? "فتح راصد أطوار القمر الفلكي" : "Open Lunar Phase Tracker"}
        aria-label={isAr ? "راصد أطوار القمر" : "Lunar Phase Tracker"}
      >
        <span className="text-sm transition-transform group-hover:scale-125">{current.emoji}</span>
        <span className="hidden sm:inline font-medium text-text-primary">
          {isAr ? current.nameAr : current.name}
        </span>
        <span className="font-mono text-[10px] text-accent font-semibold">
          {current.illumination}%
        </span>
      </button>

      <LunarPhaseTrackerModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
