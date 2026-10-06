import { useState, useRef, useEffect, useCallback } from "react";
import {
  Moon,
  Sunrise,
  Sun,
  Sunset,
  Clock,
  RotateCcw,
  Sparkles,
  Film,
  Info,
  X,
  ChevronLeft,
  ChevronRight,
  Pin,
  PinOff,
  ChevronUp,
  ChevronDown,
  Eye,
  Sliders,
  Check,
  Compass,
} from "lucide-react";
import { useTheme, FOUR_THEMES, PERIOD_CONFIGS, TIME_PERIODS, type TimePeriod } from "@/lib/theme";
import { useI18n } from "@/lib/i18n";
import { replayCinemaIntro } from "@/components/site/CinemaIntro";
import { LunarPhasePill, getLunarPhase } from "@/components/site/LunarPhaseTracker";
import { StarCursorToggle } from "@/components/site/StarfieldCursor";
import { ReadabilityPill, ReadabilityStudioModal } from "@/components/site/ReadabilityStudio";
import { useReadability } from "@/lib/readability";

interface TimeControlBarProps {
  isPinned?: boolean;
  onTogglePin?: () => void;
  onOpenHub?: () => void;
}

export function TimeControlBar({ isPinned = true, onTogglePin, onOpenHub }: TimeControlBarProps) {
  const { period, config, auto, localTime, setPeriod, resetToAuto } = useTheme();
  const { lang } = useI18n();
  const isAr = lang === "ar";

  // Collapsed state: user can collapse to a super thin bar to maximize screen real estate
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  useEffect(() => {
    try {
      if (localStorage.getItem("linora_topbar_collapsed") === "true") {
        setIsCollapsed(true);
      }
    } catch {
      // ignore
    }
  }, []);

  const toggleCollapsed = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("linora_topbar_collapsed", String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Celestial Controls Hub modal state
  const [hubModalOpen, setHubModalOpen] = useState(false);

  // Deep Astronomical Details modal state
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  // Horizontal scroll tracking for the options container
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Mouse drag-to-scroll states
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftPos, setScrollLeftPos] = useState(0);

  const checkScrollBounds = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    // In RTL or LTR browsers, calculate thresholds
    const isScrollable = scrollWidth > clientWidth + 4;
    setCanScrollLeft(isScrollable && Math.abs(scrollLeft) > 8);
    setCanScrollRight(isScrollable && Math.abs(scrollLeft) < scrollWidth - clientWidth - 8);
  }, []);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    checkScrollBounds();
    el.addEventListener("scroll", checkScrollBounds, { passive: true });
    window.addEventListener("resize", checkScrollBounds);
    return () => {
      el.removeEventListener("scroll", checkScrollBounds);
      window.removeEventListener("resize", checkScrollBounds);
    };
  }, [checkScrollBounds, isCollapsed]);

  const handleScrollChevron = (direction: "left" | "right") => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const step = 220;
    // Account for RTL if needed
    const multiplier = isAr ? (direction === "left" ? 1 : -1) : direction === "left" ? -1 : 1;
    el.scrollBy({ left: step * multiplier, behavior: "smooth" });
  };

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setIsDragging(true);
    setStartX(e.pageX - el.offsetLeft);
    setScrollLeftPos(el.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const el = scrollContainerRef.current;
    if (!el) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX) * 1.5;
    el.scrollLeft = scrollLeftPos - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  // Map any sub-period to one of the 4 primary active themes for button highlight
  const getActiveFourTheme = (): "midnight" | "dawn" | "daylight" | "sunset" => {
    if (period === "dawn" || period === "sunrise") return "dawn";
    if (
      period === "daylight" ||
      period === "morning" ||
      period === "forenoon" ||
      period === "noon" ||
      period === "afternoon"
    )
      return "daylight";
    if (period === "sunset" || period === "dusk" || period === "twilight" || period === "evening")
      return "sunset";
    return "midnight";
  };

  const activeFour = getActiveFourTheme();

  const THEME_BUTTONS = [
    {
      id: "midnight" as const,
      domId: "btn-midnight",
      label: "Midnight",
      labelAr: "منتصف الليل",
      emoji: "🌌",
      time: "10 PM – 4 AM",
      timeAr: "10 م – 4 ص",
      icon: Moon,
    },
    {
      id: "dawn" as const,
      domId: "btn-dawn",
      label: "Dawn",
      labelAr: "الفجر",
      emoji: "🌅",
      time: "4 AM – 8 AM",
      timeAr: "4 ص – 8 ص",
      icon: Sunrise,
    },
    {
      id: "daylight" as const,
      domId: "btn-daylight",
      label: "Daylight",
      labelAr: "وضح النهار",
      emoji: "☀️",
      time: "8 AM – 5 PM",
      timeAr: "8 ص – 5 م",
      icon: Sun,
    },
    {
      id: "sunset" as const,
      domId: "btn-sunset",
      label: "Sunset",
      labelAr: "الغروب",
      emoji: "🌙",
      time: "5 PM – 10 PM",
      timeAr: "5 م – 10 م",
      icon: Sunset,
    },
  ];

  return (
    <>
      {/* Top Bar with Smart Mobility (Pinned Sticky vs Smooth Scroll), Horizontal Drag Track & Controls Hub */}
      <aside
        id="linora-top-time-bar"
        aria-label="Time theme switcher and accessibility bar"
        className={`time-bar relative z-40 border-b border-[var(--glass-border)] bg-[var(--nav-bg)] backdrop-blur-md transition-all duration-300 ${
          isCollapsed ? "py-1" : "py-1.5"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 text-xs">
          {/* ======================================================== */}
          {/* LEFT: Detected Local Time & Active Astronomical Theme     */}
          {/* ======================================================== */}
          <div className="flex shrink-0 items-center gap-2 text-text-secondary" id="time-display">
            {/* Live Clock with pulsing star */}
            <div className="flex items-center gap-1.5 font-mono text-[11px] text-text-primary">
              <Clock className="h-3.5 w-3.5 text-accent animate-pulse" />
              <span suppressHydrationWarning className="font-semibold">
                {localTime ? `${localTime}` : "Local Clock"}
              </span>
              <span className="hidden sm:inline text-text-secondary font-sans text-[10px]">
                ({isAr ? "التوقيت الفعلي" : "Detected Clock"})
              </span>
            </div>

            <span className="hidden sm:inline text-border">•</span>

            {/* Active Theme Badge */}
            <div className="flex items-center gap-1 text-[11px]">
              <span className="hidden md:inline text-text-secondary">
                {isAr ? "الطور:" : "Theme:"}
              </span>
              <button
                type="button"
                onClick={() => setHubModalOpen(true)}
                className="font-bold text-accent uppercase tracking-wider hover:underline flex items-center gap-1 text-[10px] sm:text-[11px]"
                suppressHydrationWarning
                title={isAr ? "فتح لوحة التحكم الفلكية الشاملة" : "Open Controls Hub"}
              >
                <span>{activeFour}</span>
                <span className="text-[11px]">
                  {activeFour === "midnight"
                    ? "🌌"
                    : activeFour === "dawn"
                      ? "🌅"
                      : activeFour === "daylight"
                        ? "☀️"
                        : "🌙"}
                </span>
              </button>
            </div>

            {/* Live Auto Mode Badge */}
            {auto ? (
              <span
                className="hidden lg:inline-flex items-center gap-1 rounded-full bg-accent/15 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-accent border border-accent/30"
                suppressHydrationWarning
              >
                <span className="h-1.5 w-1.5 rounded-full bg-accent animate-ping" />
                {isAr ? "مباشر تلقائي" : "LIVE AUTO"}
              </span>
            ) : (
              <button
                type="button"
                onClick={resetToAuto}
                className="inline-flex items-center gap-1 rounded-full bg-accent/15 border border-accent/40 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-accent hover:bg-accent hover:text-background transition-colors"
                title={isAr ? "العودة للتزامن الفلكي التلقائي" : "Reset to Real-Time Clock"}
              >
                <RotateCcw className="h-2.5 w-2.5" />
                <span>{isAr ? "إعادة للتلقائي" : "Auto Sync"}</span>
              </button>
            )}
          </div>

          {/* ======================================================== */}
          {/* CENTER / RIGHT: Horizontal Smooth Scrollable Track       */}
          {/* ======================================================== */}
          {!isCollapsed && (
            <div className="relative flex min-w-0 flex-1 items-center justify-end overflow-hidden ms-2">
              {/* Left Scroll Navigation Chevron (visible on overflow) */}
              {canScrollLeft && (
                <button
                  type="button"
                  onClick={() => handleScrollChevron("left")}
                  aria-label="Scroll options left"
                  className="absolute start-0 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-surface/90 border border-accent/40 text-accent shadow-md backdrop-blur-sm transition-transform hover:scale-110"
                >
                  <ChevronLeft className="h-3.5 w-3.5 rtl:rotate-180" />
                </button>
              )}

              {/* Scrollable Container with Drag Support & Edge Fade */}
              <div
                ref={scrollContainerRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUpOrLeave}
                onMouseLeave={handleMouseUpOrLeave}
                className={`scrollbar-none flex items-center gap-1.5 overflow-x-auto py-0.5 px-1 scroll-smooth select-none ${
                  isDragging ? "cursor-grabbing" : "cursor-grab"
                }`}
                style={{
                  WebkitOverflowScrolling: "touch",
                }}
              >
                {/* 1. All-In-One Controls Hub Trigger (Always easy to access!) */}
                <button
                  type="button"
                  onClick={() => (onOpenHub ? onOpenHub() : setHubModalOpen(true))}
                  className="group inline-flex shrink-0 items-center gap-1 rounded-full border border-accent/70 bg-accent/20 px-2.5 py-1 text-[11px] font-bold text-accent shadow-xs hover:bg-accent hover:text-background transition-all"
                  title={
                    isAr ? "فتح لوحة خيارات الشريط العلوي الشاملة" : "Open Top Bar Options Hub"
                  }
                >
                  <Sparkles className="h-3 w-3 animate-pulse text-accent group-hover:text-background" />
                  <span className="whitespace-nowrap">
                    {isAr ? "لوحة الخيارات ⚡" : "Options Hub ⚡"}
                  </span>
                </button>

                {/* 2. Lunar Phase Tracker Pill */}
                <div className="shrink-0">
                  <LunarPhasePill />
                </div>

                {/* 3. Readability & Contrast Studio Pill */}
                <div className="shrink-0">
                  <ReadabilityPill />
                </div>

                {/* 4. Starfield Cursor Toggle (Compact on mobile, full on desktop) */}
                <div className="shrink-0">
                  <StarCursorToggle />
                </div>

                {/* 5. Replay Cinema Intro Button */}
                <button
                  type="button"
                  onClick={replayCinemaIntro}
                  className="inline-flex shrink-0 items-center gap-1 rounded-full border border-[var(--glass-border)] bg-surface/60 px-2.5 py-1 text-[11px] text-text-secondary hover:text-accent hover:border-accent transition-colors"
                  title={isAr ? "إعادة تشغيل المقدمة السينمائية" : "Replay Cinema Curtain Intro"}
                >
                  <Film className="h-3 w-3 text-accent" />
                  <span className="whitespace-nowrap">{isAr ? "المقدمة" : "Intro"}</span>
                </button>

                {/* 6. Theme Switcher 4 Buttons */}
                <div className="theme-buttons flex shrink-0 items-center gap-1 rounded-full border border-[var(--glass-border)] bg-background/50 p-0.5 shadow-xs">
                  {THEME_BUTTONS.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeFour === item.id;

                    return (
                      <button
                        key={item.id}
                        id={item.domId}
                        type="button"
                        onClick={() => setPeriod(item.id)}
                        className={`group relative flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium transition-all duration-300 ${
                          isActive
                            ? "active bg-accent text-background font-semibold shadow-xs ring-1 ring-accent/60"
                            : "text-text-secondary hover:text-text-primary hover:bg-surface-elevated/70"
                        }`}
                        title={`${item.label} (${item.time})`}
                      >
                        <Icon
                          className={`h-3 w-3 transition-transform group-hover:scale-110 ${
                            isActive ? "text-background" : "text-accent"
                          }`}
                        />
                        <span className="whitespace-nowrap">
                          {isAr ? item.labelAr : item.label} {item.emoji}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* 7. Astronomical Info Details Button */}
                <button
                  type="button"
                  onClick={() => setDetailsModalOpen(true)}
                  className="shrink-0 rounded-full border border-border/70 p-1.5 text-text-secondary hover:border-accent hover:text-accent transition-colors"
                  title={isAr ? "تفاصيل الأطوار الفلكية" : "Celestial Details"}
                  aria-label={isAr ? "تفاصيل الأطوار الفلكية" : "Celestial Details"}
                >
                  <Info className="h-3 w-3" />
                </button>
              </div>

              {/* Right Scroll Navigation Chevron (visible on overflow) */}
              {canScrollRight && (
                <button
                  type="button"
                  onClick={() => handleScrollChevron("right")}
                  aria-label="Scroll options right"
                  className="absolute end-0 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-surface/90 border border-accent/40 text-accent shadow-md backdrop-blur-sm transition-transform hover:scale-110"
                >
                  <ChevronRight className="h-3.5 w-3.5 rtl:rotate-180" />
                </button>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* FAR RIGHT: Pin/Sticky Toggle & Collapse/Expand Controls  */}
          {/* ======================================================== */}
          <div className="flex shrink-0 items-center gap-1 ms-1">
            {/* If Collapsed, show Quick Hub button */}
            {isCollapsed && (
              <button
                type="button"
                onClick={() => setHubModalOpen(true)}
                className="inline-flex items-center gap-1 rounded-full border border-accent/70 bg-accent/20 px-2 py-0.5 text-[10px] font-bold text-accent hover:bg-accent hover:text-background transition-all"
                title={isAr ? "فتح خيارات الشريط العلوي" : "Open Controls Hub"}
              >
                <Sparkles className="h-3 w-3" />
                <span>{isAr ? "خيارات ⚡" : "Controls ⚡"}</span>
              </button>
            )}

            {/* Pin / Sticky Toggle Button (Makes the top bar stay with user or scroll naturally) */}
            <button
              type="button"
              onClick={onTogglePin}
              className={`rounded-full border p-1 text-[11px] transition-all ${
                isPinned
                  ? "border-accent/80 bg-accent/15 text-accent shadow-xs"
                  : "border-border/60 text-text-secondary hover:border-accent hover:text-text-primary"
              }`}
              title={
                isPinned
                  ? isAr
                    ? "الشريط العلوي مثبت أثناء التمرير (انقر للتحرير)"
                    : "Top Bar is Pinned (Sticks on scroll). Click to unpin."
                  : isAr
                    ? "الشريط العلوي حر (انقر لتثبيته أثناء التمرير)"
                    : "Top Bar scrolls away. Click to pin to top."
              }
              aria-label={isPinned ? "Unpin top bar" : "Pin top bar to screen"}
            >
              {isPinned ? <Pin className="h-3 w-3 rotate-45" /> : <PinOff className="h-3 w-3" />}
            </button>

            {/* Collapse / Expand Toggle Button */}
            <button
              type="button"
              onClick={toggleCollapsed}
              className="rounded-full border border-border/70 p-1 text-text-secondary hover:border-accent hover:text-accent transition-colors"
              title={
                isCollapsed
                  ? isAr
                    ? "توسيع الشريط العلوي وإظهار كافة الخيارات"
                    : "Expand Top Bar to show all options"
                  : isAr
                    ? "طي الشريط العلوي لتوفير مساحة الرؤية"
                    : "Collapse Top Bar to save space"
              }
              aria-label={isCollapsed ? "Expand top bar" : "Collapse top bar"}
            >
              {isCollapsed ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronUp className="h-3 w-3" />
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* ======================================================== */}
      {/* 1. All-In-One Celestial Controls Hub Modal               */}
      {/* ======================================================== */}
      <CelestialControlsHubModal
        isOpen={hubModalOpen}
        onClose={() => setHubModalOpen(false)}
        isPinned={isPinned}
        onTogglePin={onTogglePin}
        isCollapsed={isCollapsed}
        onToggleCollapse={toggleCollapsed}
      />

      {/* ======================================================== */}
      {/* 2. Deep Astronomical Phases Modal (Original Details)     */}
      {/* ======================================================== */}
      {detailsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-md transition-opacity"
            onClick={() => setDetailsModalOpen(false)}
            aria-hidden="true"
          />

          <div className="relative w-full max-w-2xl rounded-2xl border border-border bg-surface p-6 shadow-2xl card-star max-h-[90vh] overflow-y-auto z-10">
            <div className="flex items-start justify-between border-b border-border/70 pb-4">
              <div>
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-accent">
                  <Sparkles className="h-4 w-4" />
                  <span>
                    {isAr ? "محرك الوقت الفلكي الحي" : "Real-Time Dynamic Celestial Engine"}
                  </span>
                </div>
                <h3 className="mt-1 font-display text-2xl text-text-primary">
                  {isAr ? "أطوار سماء لينورا ستيلار" : "Linora Stellar Time Themes"}
                </h3>
                <p className="mt-1 text-xs text-text-secondary">
                  {isAr
                    ? "يتكيف الموقع تلقائياً مع توقيتك المحلي، ويمكنك التنقل واختبار الأطوار يدوياً."
                    : "The site automatically adapts to your local clock with smooth 1.5s cinematic transitions."}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setDetailsModalOpen(false)}
                className="rounded-full border border-border p-1.5 text-text-secondary hover:border-accent hover:text-text-primary"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* 4 Core Themes Showcase */}
            <div className="mt-5 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                {isAr ? "السمات الأربع الأساسية:" : "The 4 Core Themes:"}
              </p>

              <div className="grid gap-3 sm:grid-cols-2">
                {FOUR_THEMES.map((themeItem) => {
                  const pConfig = PERIOD_CONFIGS[themeItem.id];
                  const isActive = activeFour === themeItem.id;

                  return (
                    <button
                      key={themeItem.id}
                      type="button"
                      onClick={() => {
                        setPeriod(themeItem.id);
                        setDetailsModalOpen(false);
                      }}
                      className={`flex flex-col gap-2 rounded-xl border p-4 text-start transition-all ${
                        isActive
                          ? "border-accent bg-accent/15 shadow-md ring-1 ring-accent"
                          : "border-border/70 hover:border-accent/60 hover:bg-surface-elevated"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm text-text-primary">
                          {isAr ? themeItem.nameAr : themeItem.name}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span
                            className="h-3.5 w-3.5 rounded-full border border-black/30"
                            style={{ backgroundColor: pConfig.background }}
                            title="Background"
                          />
                          <span
                            className="h-3.5 w-3.5 rounded-full border border-black/30"
                            style={{ backgroundColor: pConfig.surface }}
                            title="Surface"
                          />
                          <span
                            className="h-3.5 w-3.5 rounded-full border border-black/30"
                            style={{ backgroundColor: pConfig.accent }}
                            title="Accent Gold"
                          />
                        </div>
                      </div>

                      <span className="font-mono text-xs text-accent">
                        {isAr ? themeItem.timeRangeAr : themeItem.timeRange}
                      </span>

                      <p className="text-xs text-text-secondary">
                        {isAr ? pConfig.atmosphereDescAr : pConfig.atmosphereDesc}
                      </p>

                      {isActive && (
                        <span className="text-[10px] text-accent font-semibold uppercase tracking-wider mt-1">
                          ● {isAr ? "السمة الحالية النشطة" : "Currently Active"}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 flex justify-between items-center border-t border-border/70 pt-4">
              {!auto && (
                <button
                  type="button"
                  onClick={() => {
                    resetToAuto();
                    setDetailsModalOpen(false);
                  }}
                  className="flex items-center gap-1.5 text-xs text-accent hover:underline"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>{isAr ? "استعادة التزامن التلقائي" : "Reset to Live Auto Clock"}</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setDetailsModalOpen(false)}
                className="ms-auto rounded-full bg-accent px-6 py-2 text-xs font-semibold uppercase tracking-wider text-background hover:opacity-90"
              >
                {isAr ? "إغلاق" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/**
 * =========================================================================
 * ALL-IN-ONE CELESTIAL CONTROLS HUB MODAL
 * A comprehensive, ultra-accessible command center that brings every single
 * top bar option into an organized, easy-to-tap interface on mobile & desktop.
 * =========================================================================
 */
export function CelestialControlsHubModal({
  isOpen,
  onClose,
  isPinned,
  onTogglePin,
  isCollapsed,
  onToggleCollapse,
}: {
  isOpen: boolean;
  onClose: () => void;
  isPinned?: boolean;
  onTogglePin?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}) {
  const { period, config, auto, localTime, setPeriod, resetToAuto } = useTheme();
  const { lang } = useI18n();
  const isAr = lang === "ar";
  const lunar = getLunarPhase();

  const {
    overlayActive,
    toggleOverlay,
    fontWeight,
    setFontWeight,
    contrastMode,
    setContrastMode,
    resetToDefaults: resetReadability,
  } = useReadability();

  // Modal open states for sub-modals
  const [readabilityModalOpen, setReadabilityModalOpen] = useState(false);

  if (!isOpen) return null;

  const THEMES = [
    {
      id: "midnight" as const,
      name: "Midnight",
      nameAr: "منتصف الليل",
      emoji: "🌌",
      time: "10 PM – 4 AM",
      timeAr: "10 م – 4 ص",
      desc: "Deep cosmic blues and starlight sparkles",
      descAr: "سماء ليلية فلكية عميقة مع بريق النجوم",
      icon: Moon,
      colors: ["#070B14", "#0D1527", "#E3C280"],
    },
    {
      id: "dawn" as const,
      name: "Dawn",
      nameAr: "الفجر والصباح الباكر",
      emoji: "🌅",
      time: "4 AM – 8 AM",
      timeAr: "4 ص – 8 ص",
      desc: "Delicate lavender, soft rose & gold aurora",
      descAr: "درجات اللافندر الناعمة والشفق الوردي الذهبي",
      icon: Sunrise,
      colors: ["#EBE5F2", "#F5EAEC", "#D4A373"],
    },
    {
      id: "daylight" as const,
      name: "Daylight",
      nameAr: "وضح النهار الساطع",
      emoji: "☀️",
      time: "8 AM – 5 PM",
      timeAr: "8 ص – 5 م",
      desc: "Warm radiant sunlight & crisp studio clarity",
      descAr: "أشعة شمسية ساطعة ووضوح فائق ومريح",
      icon: Sun,
      colors: ["#EAF2F8", "#FAF6F0", "#C5A059"],
    },
    {
      id: "sunset" as const,
      name: "Sunset",
      nameAr: "الغروب والشفق المسائي",
      emoji: "🌙",
      time: "5 PM – 10 PM",
      timeAr: "5 م – 10 م",
      desc: "Rich violet velvet, plum & glowing amber",
      descAr: "مخمل بنفسجي ساحر مع أطياف عنبرية متوهجة",
      icon: Sunset,
      colors: ["#2A1A30", "#3D2244", "#E3C280"],
    },
  ];

  const getActiveFour = (): "midnight" | "dawn" | "daylight" | "sunset" => {
    if (period === "dawn" || period === "sunrise") return "dawn";
    if (
      period === "daylight" ||
      period === "morning" ||
      period === "forenoon" ||
      period === "noon" ||
      period === "afternoon"
    )
      return "daylight";
    if (period === "sunset" || period === "dusk" || period === "twilight" || period === "evening")
      return "sunset";
    return "midnight";
  };

  const activeFour = getActiveFour();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl rounded-3xl border border-accent/40 bg-surface p-5 sm:p-7 shadow-2xl card-star max-h-[92vh] overflow-y-auto z-10 text-text-primary">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border/70 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-accent">
              <Sparkles className="h-4 w-4 animate-pulse" />
              <span>{isAr ? "مركز تحكم الشريط العلوي" : "Top Bar Controls Hub"}</span>
            </div>
            <h3 className="mt-1 font-display text-2xl text-text-primary">
              {isAr ? "خيارات التخصيص والمظهر الفلكي" : "Celestial & Top Bar Command Studio"}
            </h3>
            <p className="mt-1 text-xs text-text-secondary">
              {isAr
                ? "يمكنك الوصول بسهولة لجميع خيارات الشريط العلوي: السمات الفلكية، وراحة القراءة، والتثبيت، ومؤشر النجوم."
                : "Every option from the top bar gathered in one place: themes, readability, cursor, pinning & moon phase."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-border p-2 text-text-secondary hover:border-accent hover:text-text-primary transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6 space-y-6">
          {/* SECTION 1: Time & Auto Engine Status */}
          <div className="rounded-2xl border border-border/80 bg-surface-elevated/60 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/20 border border-accent/40 text-accent">
                  <Clock className="h-5 w-5 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-bold text-text-primary">
                      {localTime || "12:00 PM"}
                    </span>
                    {auto && (
                      <span className="rounded-full bg-accent/20 px-2 py-0.5 text-[9px] font-bold text-accent border border-accent/30 uppercase">
                        {isAr ? "مباشر تلقائي" : "Live Auto"}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-text-secondary">
                    {isAr
                      ? `الطور الحالي: ${config.nameAr} (${config.timeRangeAr})`
                      : `Current Phase: ${config.name} (${config.timeRange})`}
                  </p>
                </div>
              </div>

              {!auto && (
                <button
                  type="button"
                  onClick={resetToAuto}
                  className="inline-flex items-center gap-1.5 rounded-full border border-accent bg-accent/15 px-3 py-1.5 text-xs font-semibold text-accent hover:bg-accent hover:text-background transition-colors"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>{isAr ? "استعادة التزامن التلقائي" : "Reset to Real-Time Clock"}</span>
                </button>
              )}
            </div>
          </div>

          {/* SECTION 2: 4 Atmosphere Themes (1-Tap Selection) */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-accent flex items-center gap-1.5">
                <span>{isAr ? "السمات الفلكية الأربع" : "The 4 Celestial Themes"}</span>
              </h4>
              <span className="text-[11px] text-text-secondary">
                {isAr ? "انقر لاختبار السمة فوراً" : "Click to preview instantly"}
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {THEMES.map((theme) => {
                const Icon = theme.icon;
                const isActive = activeFour === theme.id;

                return (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => setPeriod(theme.id)}
                    className={`group relative flex flex-col gap-2 rounded-2xl border p-4 text-start transition-all duration-300 ${
                      isActive
                        ? "border-accent bg-accent/15 shadow-md ring-2 ring-accent/60"
                        : "border-border/80 bg-surface/50 hover:border-accent/60 hover:bg-surface-elevated/70"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon
                          className={`h-4 w-4 ${isActive ? "text-accent" : "text-text-secondary"}`}
                        />
                        <span className="font-semibold text-sm text-text-primary">
                          {isAr ? theme.nameAr : theme.name} {theme.emoji}
                        </span>
                      </div>

                      {/* Color swatches */}
                      <div className="flex items-center gap-1">
                        {theme.colors.map((c, i) => (
                          <span
                            key={i}
                            className="h-3 w-3 rounded-full border border-black/30"
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-accent font-semibold">
                        {isAr ? theme.timeAr : theme.time}
                      </span>
                      {isActive && (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-accent">
                          <Check className="h-3.5 w-3.5" />
                          <span>{isAr ? "النشط الآن" : "Active"}</span>
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-text-secondary">
                      {isAr ? theme.descAr : theme.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION 3: Visual Comfort & Readability */}
          <div className="rounded-2xl border border-border/80 bg-surface-elevated/40 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-accent" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary">
                  {isAr ? "راحة القراءة ووضوح النصوص" : "Readability & Visual Clarity"}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setReadabilityModalOpen(true)}
                className="text-xs text-accent hover:underline font-medium"
              >
                {isAr ? "فتح استوديو القراءة الكامل ←" : "Open Full Studio →"}
              </button>
            </div>

            <div className="grid gap-2.5 sm:grid-cols-3">
              {/* Scrim Overlay Toggle */}
              <button
                type="button"
                onClick={toggleOverlay}
                className={`flex items-center justify-between rounded-xl border p-3 text-start transition-all ${
                  overlayActive
                    ? "border-accent bg-accent/15 text-accent font-semibold"
                    : "border-border/70 hover:border-accent/60"
                }`}
              >
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-text-primary">
                    {isAr ? "طبقة التعتيم للقراءة" : "Readability Overlay"}
                  </span>
                  <span className="text-[10px] text-text-secondary">
                    {overlayActive ? (isAr ? "مفعّل" : "Active") : isAr ? "معطّل" : "Disabled"}
                  </span>
                </div>
                {overlayActive && <Check className="h-4 w-4 text-accent" />}
              </button>

              {/* Font Weight Cycle */}
              <div className="flex flex-col justify-between rounded-xl border border-border/70 p-3">
                <span className="text-xs font-medium text-text-primary mb-1">
                  {isAr ? "سُمك الخط" : "Font Weight"}
                </span>
                <div className="flex items-center gap-1">
                  {(["normal", "medium", "bold"] as const).map((w) => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => setFontWeight(w)}
                      className={`flex-1 rounded-md py-1 text-[10px] font-semibold transition-all ${
                        fontWeight === w
                          ? "bg-accent text-background"
                          : "bg-surface text-text-secondary hover:text-text-primary"
                      }`}
                    >
                      {w === "normal" ? "400" : w === "medium" ? "500" : "700"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Contrast Mode Selector */}
              <div className="flex flex-col justify-between rounded-xl border border-border/70 p-3">
                <span className="text-xs font-medium text-text-primary mb-1">
                  {isAr ? "وضع التباين" : "Contrast Mode"}
                </span>
                <div className="flex items-center gap-1">
                  {(["standard", "high", "max"] as const).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setContrastMode(c)}
                      className={`flex-1 rounded-md py-1 text-[10px] font-semibold transition-all ${
                        contrastMode === c
                          ? "bg-accent text-background"
                          : "bg-surface text-text-secondary hover:text-text-primary"
                      }`}
                    >
                      {c === "standard"
                        ? isAr
                          ? "عادي"
                          : "Normal"
                        : c === "high"
                          ? "High"
                          : "Max"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 4: Cosmic FX, Cursor, Moon & Intro */}
          <div className="grid gap-3 sm:grid-cols-3">
            {/* Lunar Phase card */}
            <div className="flex flex-col justify-between rounded-2xl border border-border/80 bg-surface-elevated/40 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-accent">
                  {isAr ? "طور القمر" : "Lunar Phase"}
                </span>
                <span className="text-xl">{lunar.emoji}</span>
              </div>
              <div className="my-2">
                <p className="font-semibold text-sm text-text-primary">
                  {isAr ? lunar.nameAr : lunar.name}
                </p>
                <p className="text-xs text-text-secondary">
                  {lunar.illumination}% {isAr ? "إضاءة" : "Illumination"}
                </p>
              </div>
              <LunarPhasePill />
            </div>

            {/* Starfield Cursor Card */}
            <div className="flex flex-col justify-between rounded-2xl border border-border/80 bg-surface-elevated/40 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-accent">
                  {isAr ? "مؤشر النجوم" : "Star Cursor"}
                </span>
                <Sparkles className="h-4 w-4 text-accent animate-pulse" />
              </div>
              <div className="my-2">
                <p className="font-semibold text-sm text-text-primary">
                  {isAr ? "تتبع غبار النجوم" : "Cosmic Stardust"}
                </p>
                <p className="text-xs text-text-secondary">
                  {isAr
                    ? "تفاعل ذهبي فلكي مع حركة الفأرة"
                    : "Gold particle physics upon interaction"}
                </p>
              </div>
              <StarCursorToggle />
            </div>

            {/* Cinema Curtain Intro */}
            <div className="flex flex-col justify-between rounded-2xl border border-border/80 bg-surface-elevated/40 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-accent">
                  {isAr ? "المقدمة السينمائية" : "Cinema Curtain"}
                </span>
                <Film className="h-4 w-4 text-accent" />
              </div>
              <div className="my-2">
                <p className="font-semibold text-sm text-text-primary">
                  {isAr ? "ستار البداية الفلكي" : "Intro Animation"}
                </p>
                <p className="text-xs text-text-secondary">
                  {isAr ? "شاهد عرض الدخول الملكي للعلامة" : "Re-trigger theatrical welcome"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  replayCinemaIntro();
                }}
                className="inline-flex items-center justify-center gap-1.5 rounded-full border border-accent/60 bg-accent/15 py-1 text-[11px] font-semibold text-accent hover:bg-accent hover:text-background transition-colors"
              >
                <Film className="h-3 w-3" />
                <span>{isAr ? "تشغيل المقدمة الآن" : "Play Intro Curtain"}</span>
              </button>
            </div>
          </div>

          {/* SECTION 5: Top Bar Behavior (Pinning & Mobility) */}
          <div className="rounded-2xl border border-accent/30 bg-accent/5 p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-accent mb-2">
              {isAr ? "سلوك وتثبيت الشريط العلوي" : "Top Bar Mobility & Pinning"}
            </h4>
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Pin className="h-4 w-4 text-accent" />
                <div>
                  <p className="font-semibold text-text-primary">
                    {isAr ? "تثبيت الشريط مع التمرير" : "Pin Top Bar on Scroll"}
                  </p>
                  <p className="text-[11px] text-text-secondary">
                    {isPinned
                      ? isAr
                        ? "الشريط يتحرك معك أينما تصفحت الصفحة لسهولة الوصول"
                        : "The top bar travels with you as you scroll for instant access"
                      : isAr
                        ? "الشريط يختفي مع التمرير لأسفل لتركيز أكبر على المحتوى"
                        : "The top bar scrolls away with the page to give full space to content"}
                  </p>
                </div>
              </div>

              {onTogglePin && (
                <button
                  type="button"
                  onClick={onTogglePin}
                  className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                    isPinned
                      ? "bg-accent text-background shadow-md"
                      : "border border-border bg-surface text-text-primary hover:border-accent"
                  }`}
                >
                  {isPinned ? (isAr ? "مثبّت ✔" : "Pinned ✔") : isAr ? "غير مثبّت" : "Unpinned"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-between items-center border-t border-border/70 pt-4">
          <p className="text-[11px] text-text-secondary">
            {isAr ? "✨ لينورا ستيلار • ستوديو التصميم الفلكي" : "✨ Linora Stellar Atelier Studio"}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-accent px-6 py-2 text-xs font-bold uppercase tracking-wider text-background hover:brightness-110 shadow-md transition-all"
          >
            {isAr ? "تم وإغلاق" : "Done & Close"}
          </button>
        </div>
      </div>

      <ReadabilityStudioModal
        isOpen={readabilityModalOpen}
        onClose={() => setReadabilityModalOpen(false)}
      />
    </div>
  );
}

/**
 * =========================================================================
 * FLOATING TOP BAR QUICK PILL
 * Appears when user scrolls down and top bar is unpinned or collapsed,
 * guaranteeing 1-tap effortless access to all options anywhere on the page!
 * =========================================================================
 */
export function FloatingTopBarPill({
  onOpenHub,
  isPinned,
}: {
  onOpenHub: () => void;
  isPinned?: boolean;
}) {
  const [scrolled, setScrolled] = useState(false);
  const { period, localTime } = useTheme();
  const lunar = getLunarPhase();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 150);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // If pinned and not collapsed, the top bar is already visible at the top!
  // But if unpinned or on mobile, show this floating pill when scrolled down!
  if (!scrolled || isPinned) return null;

  return (
    <button
      type="button"
      onClick={onOpenHub}
      className="fixed top-20 end-4 z-40 flex items-center gap-2 rounded-full border border-accent/60 bg-surface/90 px-3 py-1.5 text-xs text-text-primary shadow-xl backdrop-blur-md transition-all hover:scale-105 hover:border-accent hover:shadow-accent/20"
      title="Open Top Bar Options Hub"
    >
      <span className="flex h-2 w-2 rounded-full bg-accent animate-ping" />
      <Sparkles className="h-3.5 w-3.5 text-accent" />
      <span className="font-semibold text-accent uppercase tracking-wider text-[10px]">
        {period}
      </span>
      <span className="text-xs">{lunar.emoji}</span>
      <span className="hidden sm:inline font-mono text-[10px] text-text-secondary">
        {localTime}
      </span>
    </button>
  );
}
