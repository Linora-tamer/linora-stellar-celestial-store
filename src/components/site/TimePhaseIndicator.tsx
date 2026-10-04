import { useState } from "react";
import {
  Sparkles,
  Clock,
  Sun,
  Moon,
  Sunset,
  Sunrise,
  CloudSun,
  Check,
  X,
  Compass,
  RotateCcw,
} from "lucide-react";
import { TIME_PERIODS, PERIOD_CONFIGS, useTheme, type TimePeriod } from "@/lib/theme";
import { useI18n } from "@/lib/i18n";

function getPeriodIcon(period: TimePeriod) {
  switch (period) {
    case "dawn":
    case "sunrise":
      return Sunrise;
    case "daylight":
    case "noon":
    case "afternoon":
      return Sun;
    case "morning":
    case "forenoon":
      return CloudSun;
    case "sunset":
    case "dusk":
    case "twilight":
      return Sunset;
    case "evening":
    case "night":
    case "midnight":
    default:
      return Moon;
  }
}

export function TimePhaseIndicator() {
  const { period, config, auto, localTime, setPeriod, resetToAuto } = useTheme();
  const { lang } = useI18n();
  const isAr = lang === "ar";
  const [modalOpen, setModalOpen] = useState(false);

  const IconComponent = getPeriodIcon(period);

  return (
    <>
      {/* Header Pill Button */}
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className="group relative flex items-center gap-2 rounded-full border border-border/80 bg-surface/70 px-3 py-1.5 text-xs text-text-primary backdrop-blur-md transition-all hover:border-accent hover:shadow-xs"
        title={
          isAr
            ? `طور الوقت الحالي: ${config.nameAr} (${config.timeRangeAr})`
            : `Current Celestial Phase: ${config.name} (${config.timeRange})`
        }
        suppressHydrationWarning
      >
        <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse" />
        <IconComponent className="h-3.5 w-3.5 text-accent" />
        <span className="font-medium tracking-wide" suppressHydrationWarning>
          {isAr ? config.nameAr : config.name}
        </span>
        {localTime && (
          <span
            className="hidden sm:inline font-mono text-[11px] text-text-secondary border-s border-border/60 ps-2 ms-0.5"
            suppressHydrationWarning
          >
            {localTime}
          </span>
        )}
        {auto && (
          <span
            className="hidden md:inline rounded-full bg-accent/15 px-1.5 py-0.2 text-[9px] uppercase tracking-wider text-accent font-semibold"
            suppressHydrationWarning
          >
            {isAr ? "مباشر" : "LIVE"}
          </span>
        )}
      </button>

      {/* Modal / Drawer for Viewing all 11 Time Periods & Previews */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-md transition-opacity"
            onClick={() => setModalOpen(false)}
            aria-hidden="true"
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-2xl rounded-2xl border border-border bg-surface p-6 shadow-2xl card-star max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-border/70 pb-4">
              <div>
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-accent">
                  <Compass className="h-4 w-4" />
                  <span>
                    {isAr ? "محرك الوقت الفلكي الحي" : "Real-Time Dynamic Celestial Engine"}
                  </span>
                </div>
                <h3 className="mt-1 font-display text-2xl text-text-primary">
                  {isAr ? "أطوار اليوم الأحد عشر" : "The 11 Celestial Time Phases"}
                </h3>
                <p className="mt-1 text-xs text-text-secondary">
                  {isAr
                    ? "الموقع يقرأ توقيت جهازك المحلي تلقائياً ويغير ألوان السماء والتصميم بسلاسة تامة."
                    : "The website reads your local clock and naturally shifts colors, atmosphere, and star density as the sun moves."}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-full border border-border p-1.5 text-text-secondary hover:border-accent hover:text-text-primary"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Current Active Status Banner */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-accent/40 bg-accent/10 p-3.5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20 text-accent">
                  <IconComponent className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">
                    {isAr ? config.nameAr : config.name} —{" "}
                    <span className="font-normal text-xs text-accent">
                      {isAr ? config.timeRangeAr : config.timeRange}
                    </span>
                  </p>
                  <p className="text-[11px] text-text-secondary">
                    {isAr ? config.atmosphereDescAr : config.atmosphereDesc}
                  </p>
                </div>
              </div>

              {!auto ? (
                <button
                  type="button"
                  onClick={resetToAuto}
                  className="flex items-center gap-1.5 rounded-full bg-accent px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-background shadow-xs hover:opacity-90 transition-opacity"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>{isAr ? "العودة للوقت التلقائي" : "Reset to Live Time"}</span>
                </button>
              ) : (
                <div className="flex items-center gap-1.5 rounded-full border border-accent/60 bg-accent/20 px-3 py-1 text-xs font-medium text-accent">
                  <Clock className="h-3 w-3" />
                  <span>{isAr ? "متزامن مع توقيتك" : `Synced: ${localTime}`}</span>
                </div>
              )}
            </div>

            {/* 11 Time Periods Grid */}
            <div className="mt-5 space-y-2">
              <p className="text-xs font-medium uppercase tracking-wider text-text-secondary">
                {isAr ? "استعراض الأطوار الفلكية:" : "Preview Any Astronomical Period:"}
              </p>

              <div className="grid gap-2.5 sm:grid-cols-2">
                {TIME_PERIODS.map((periodKey) => {
                  const pConfig = PERIOD_CONFIGS[periodKey];
                  const isCurrent = period === periodKey;
                  const Icon = getPeriodIcon(periodKey);

                  return (
                    <button
                      key={periodKey}
                      type="button"
                      onClick={() => setPeriod(periodKey)}
                      className={`flex items-center justify-between rounded-xl border p-3 text-start transition-all ${
                        isCurrent
                          ? "border-accent bg-accent/15 shadow-xs"
                          : "border-border/70 hover:border-accent/60 hover:bg-surface-elevated"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="h-8 w-8 rounded-lg flex items-center justify-center border border-border shrink-0"
                          style={{ backgroundColor: pConfig.surface }}
                        >
                          <Icon className="h-4 w-4" style={{ color: pConfig.accent }} />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-semibold text-text-primary">
                              {isAr ? pConfig.nameAr : pConfig.name}
                            </span>
                            {isCurrent && (
                              <span className="text-[10px] text-accent font-medium">(Active)</span>
                            )}
                          </div>
                          <span className="text-[10px] text-text-secondary font-mono">
                            {isAr ? pConfig.timeRangeAr : pConfig.timeRange}
                          </span>
                        </div>
                      </div>

                      {/* Color dots preview */}
                      <div className="flex items-center gap-1 shrink-0">
                        <span
                          className="h-3 w-3 rounded-full border border-black/20"
                          style={{ backgroundColor: pConfig.background }}
                          title="Background"
                        />
                        <span
                          className="h-3 w-3 rounded-full border border-black/20"
                          style={{ backgroundColor: pConfig.surface }}
                          title="Surface"
                        />
                        <span
                          className="h-3 w-3 rounded-full border border-black/20"
                          style={{ backgroundColor: pConfig.accent }}
                          title="Accent"
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-full bg-accent px-6 py-2 text-xs font-semibold uppercase tracking-wider text-background hover:opacity-90"
              >
                {isAr ? "إغلاق" : "Done"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
