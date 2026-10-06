export const TIME_PERIODS = [
  "midnight",
  "dawn",
  "daylight",
  "sunset",
  "sunrise",
  "morning",
  "forenoon",
  "noon",
  "afternoon",
  "dusk",
  "twilight",
  "evening",
  "night",
] as const;

export type TimePeriod = (typeof TIME_PERIODS)[number];

export const FOUR_THEMES = [
  {
    id: "midnight" as const,
    name: "Midnight",
    nameAr: "منتصف الليل",
    timeRange: "10:00 PM – 4:00 AM",
    timeRangeAr: "10:00 م – 4:00 ص",
  },
  {
    id: "dawn" as const,
    name: "Dawn",
    nameAr: "الفجر والصباح الباكر",
    timeRange: "4:00 AM – 8:00 AM",
    timeRangeAr: "4:00 ص – 8:00 ص",
  },
  {
    id: "daylight" as const,
    name: "Daylight",
    nameAr: "وضح النهار",
    timeRange: "8:00 AM – 5:00 PM",
    timeRangeAr: "8:00 ص – 5:00 م",
  },
  {
    id: "sunset" as const,
    name: "Sunset",
    nameAr: "الغروب والشفق",
    timeRange: "5:00 PM – 10:00 PM",
    timeRangeAr: "5:00 م – 10:00 م",
  },
] as const;

export interface PeriodThemeConfig {
  id: TimePeriod;
  name: string;
  nameAr: string;
  timeRange: string;
  timeRangeAr: string;
  background: string;
  surface: string;
  surfaceElevated: string;
  primary: string;
  accent: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
  glow: string;
  heroOverlay: string;
  atmosphereDesc: string;
  atmosphereDescAr: string;
  starsOpacity: number;
  skyGradient: string;
}

export const PERIOD_CONFIGS: Record<TimePeriod, PeriodThemeConfig> = {
  // 1. MIDNIGHT THEME (10:00 PM – 4:00 AM) [BASE PRIMARY THEME]
  midnight: {
    id: "midnight",
    name: "Midnight",
    nameAr: "منتصف الليل",
    timeRange: "10:00 PM – 4:00 AM",
    timeRangeAr: "10:00 م – 4:00 ص",
    background: "#090E1A",
    surface: "#10192A",
    surfaceElevated: "#16233B",
    primary: "#1E293B",
    accent: "#E3C280",
    textPrimary: "#FFFFFF",
    textSecondary: "#94A3B8",
    border: "rgba(227, 194, 128, 0.25)",
    glow: "rgba(227, 194, 128, 0.45)",
    heroOverlay: "linear-gradient(180deg, rgba(9, 14, 26, 0.6) 0%, rgba(16, 25, 42, 0.75) 100%)",
    atmosphereDesc: "Deep midnight dark navy with glowing starlight gold & celestial nebulae",
    atmosphereDescAr: "كحلي ليلي فلكي عميق مع تذهيب لامع وسدم كونية براقة",
    starsOpacity: 0.95,
    skyGradient: "linear-gradient(180deg, #090E1A 0%, #10192A 70%, rgba(227, 194, 128, 0.08) 100%)",
  },

  // 2. DAWN THEME (4:00 AM – 8:00 AM)
  dawn: {
    id: "dawn",
    name: "Dawn",
    nameAr: "الفجر",
    timeRange: "4:00 AM – 8:00 AM",
    timeRangeAr: "4:00 ص – 8:00 ص",
    background: "#EBE5F2",
    surface: "#F5EAEC",
    surfaceElevated: "#FAF2F5",
    primary: "#E2D7E8",
    accent: "#D4A373",
    textPrimary: "#1A233A",
    textSecondary: "#555E75",
    border: "rgba(227, 194, 128, 0.45)",
    glow: "rgba(227, 194, 128, 0.38)",
    heroOverlay:
      "linear-gradient(180deg, rgba(235, 229, 242, 0.5) 0%, rgba(245, 234, 236, 0.75) 100%)",
    atmosphereDesc: "Soft lavender and blush pink gradient with warm gold borders",
    atmosphereDescAr: "تدرج هادئ من اللافندر والوردي الناعم مع إطارات ذهبية دافئة",
    starsOpacity: 0.2,
    skyGradient: "linear-gradient(180deg, #EBE5F2 0%, #F5EAEC 100%)",
  },

  // 3. DAYLIGHT THEME (8:00 AM – 5:00 PM)
  daylight: {
    id: "daylight",
    name: "Daylight",
    nameAr: "وضح النهار",
    timeRange: "8:00 AM – 5:00 PM",
    timeRangeAr: "8:00 ص – 5:00 م",
    background: "#EAF2F8",
    surface: "#FAF6F0",
    surfaceElevated: "#FFFFFF",
    primary: "#DCE7F2",
    accent: "#C5A059",
    textPrimary: "#141D30",
    textSecondary: "#475569",
    border: "rgba(197, 160, 89, 0.35)",
    glow: "rgba(197, 160, 89, 0.35)",
    heroOverlay:
      "linear-gradient(180deg, rgba(234, 242, 248, 0.45) 0%, rgba(250, 246, 240, 0.65) 100%)",
    atmosphereDesc: "Soft sky blue & champagne ivory with dark navy and gold accents",
    atmosphereDescAr: "سماء زرقاء ناعمة مع عاجي الشامبانيا وتفاصيل كحلية وذهبية فاخرة",
    starsOpacity: 0.03,
    skyGradient: "linear-gradient(180deg, #EAF2F8 0%, #FAF6F0 100%)",
  },

  // 4. SUNSET THEME (5:00 PM – 10:00 PM)
  sunset: {
    id: "sunset",
    name: "Sunset",
    nameAr: "الغروب والشفق",
    timeRange: "5:00 PM – 10:00 PM",
    timeRangeAr: "5:00 م – 10:00 م",
    background: "#2A1A30",
    surface: "#3D2244",
    surfaceElevated: "#4A2840",
    primary: "#4A2840",
    accent: "#E3C280",
    textPrimary: "#FFF7ED",
    textSecondary: "#D4C5D9",
    border: "rgba(227, 194, 128, 0.35)",
    glow: "rgba(227, 194, 128, 0.48)",
    heroOverlay: "linear-gradient(180deg, rgba(42, 26, 48, 0.55) 0%, rgba(74, 40, 64, 0.7) 100%)",
    atmosphereDesc: "Twilight purple and warm amber gold celestial gradient",
    atmosphereDescAr: "بنفسجي الشفق وأرجوان دافئ مع تدرج ذهبي كهرماني مشرق",
    starsOpacity: 0.45,
    skyGradient: "linear-gradient(180deg, #2A1A30 0%, #4A2840 100%)",
  },

  // Backward compatibility aliases mapped to the 4 core palettes
  night: {
    id: "night",
    name: "Night",
    nameAr: "الليل",
    timeRange: "10:00 PM – 12:00 AM",
    timeRangeAr: "10:00 م – 12:00 ص",
    background: "#090E1A",
    surface: "#10192A",
    surfaceElevated: "#16233B",
    primary: "#1E293B",
    accent: "#E3C280",
    textPrimary: "#FFFFFF",
    textSecondary: "#94A3B8",
    border: "rgba(227, 194, 128, 0.25)",
    glow: "rgba(227, 194, 128, 0.45)",
    heroOverlay: "linear-gradient(180deg, rgba(9, 14, 26, 0.6) 0%, rgba(16, 25, 42, 0.75) 100%)",
    atmosphereDesc: "Deep midnight dark navy with glowing starlight gold & celestial nebulae",
    atmosphereDescAr: "كحلي ليلي فلكي عميق مع تذهيب لامع وسدم كونية براقة",
    starsOpacity: 0.95,
    skyGradient: "linear-gradient(180deg, #090E1A 0%, #10192A 70%, rgba(227, 194, 128, 0.08) 100%)",
  },
  sunrise: {
    id: "sunrise",
    name: "Sunrise",
    nameAr: "الشروق",
    timeRange: "6:30 – 8:00 AM",
    timeRangeAr: "6:30 – 8:00 ص",
    background: "#EBE5F2",
    surface: "#F5EAEC",
    surfaceElevated: "#FAF2F5",
    primary: "#E2D7E8",
    accent: "#D4A373",
    textPrimary: "#1A233A",
    textSecondary: "#555E75",
    border: "rgba(227, 194, 128, 0.45)",
    glow: "rgba(227, 194, 128, 0.38)",
    heroOverlay:
      "linear-gradient(180deg, rgba(235, 229, 242, 0.5) 0%, rgba(245, 234, 236, 0.75) 100%)",
    atmosphereDesc: "Soft lavender and blush pink gradient with warm gold borders",
    atmosphereDescAr: "تدرج هادئ من اللافندر والوردي الناعم مع إطارات ذهبية دافئة",
    starsOpacity: 0.15,
    skyGradient: "linear-gradient(180deg, #EBE5F2 0%, #F5EAEC 100%)",
  },
  morning: {
    id: "morning",
    name: "Morning",
    nameAr: "الصباح",
    timeRange: "8:00 – 10:00 AM",
    timeRangeAr: "8:00 – 10:00 ص",
    background: "#FAF6F0",
    surface: "#FFFFFF",
    surfaceElevated: "#F8FAFC",
    primary: "#EAE3D9",
    accent: "#C5A059",
    textPrimary: "#141D30",
    textSecondary: "#475569",
    border: "rgba(197, 160, 89, 0.35)",
    glow: "rgba(197, 160, 89, 0.35)",
    heroOverlay:
      "linear-gradient(180deg, rgba(250, 246, 240, 0.5) 0%, rgba(234, 242, 248, 0.6) 100%)",
    atmosphereDesc: "Champagne ivory & soft blue daylight with dark navy and gold accents",
    atmosphereDescAr: "ضوء صباح عاجي نقي مع زرقة هادئة وكحلي وذهبي مميز",
    starsOpacity: 0.04,
    skyGradient: "linear-gradient(180deg, #FAF6F0 0%, #EAF2F8 100%)",
  },
  forenoon: {
    id: "forenoon",
    name: "Forenoon",
    nameAr: "الضحى",
    timeRange: "10:00 AM – 12:00 PM",
    timeRangeAr: "10:00 ص – 12:00 م",
    background: "#EAF2F8",
    surface: "#FFFFFF",
    surfaceElevated: "#F4F8FC",
    primary: "#DCE7F2",
    accent: "#C5A059",
    textPrimary: "#141D30",
    textSecondary: "#475569",
    border: "rgba(197, 160, 89, 0.32)",
    glow: "rgba(197, 160, 89, 0.35)",
    heroOverlay:
      "linear-gradient(180deg, rgba(234, 242, 248, 0.45) 0%, rgba(250, 246, 240, 0.6) 100%)",
    atmosphereDesc: "Soft sky blue & champagne ivory with dark navy and gold accents",
    atmosphereDescAr: "سماء زرقاء ناعمة مع عاجي وتفاصيل كحلية وذهبية فاخرة",
    starsOpacity: 0.02,
    skyGradient: "linear-gradient(180deg, #EAF2F8 0%, #FAF6F0 100%)",
  },
  noon: {
    id: "noon",
    name: "Noon",
    nameAr: "الظهيرة",
    timeRange: "12:00 – 1:00 PM",
    timeRangeAr: "12:00 – 1:00 م",
    background: "#EAF2F8",
    surface: "#FFFFFF",
    surfaceElevated: "#FAF6F0",
    primary: "#D5E4F1",
    accent: "#C5A059",
    textPrimary: "#141D30",
    textSecondary: "#475569",
    border: "rgba(197, 160, 89, 0.35)",
    glow: "rgba(197, 160, 89, 0.35)",
    heroOverlay:
      "linear-gradient(180deg, rgba(234, 242, 248, 0.4) 0%, rgba(255, 255, 255, 0.6) 100%)",
    atmosphereDesc: "Clean daylight layout with soft sky blue and warm gold accents",
    atmosphereDescAr: "أعلى درجات ضوء النهار الصافي والمنعش مع ذهبي أنيق",
    starsOpacity: 0.0,
    skyGradient: "linear-gradient(180deg, #EAF2F8 0%, #FAF6F0 100%)",
  },
  afternoon: {
    id: "afternoon",
    name: "Afternoon",
    nameAr: "بعد الظهر",
    timeRange: "1:00 – 5:00 PM",
    timeRangeAr: "1:00 – 5:00 م",
    background: "#FAF6F0",
    surface: "#FFFFFF",
    surfaceElevated: "#F8FAFC",
    primary: "#EAE3D9",
    accent: "#C5A059",
    textPrimary: "#141D30",
    textSecondary: "#475569",
    border: "rgba(197, 160, 89, 0.35)",
    glow: "rgba(197, 160, 89, 0.35)",
    heroOverlay:
      "linear-gradient(180deg, rgba(250, 246, 240, 0.45) 0%, rgba(234, 242, 248, 0.6) 100%)",
    atmosphereDesc: "Warm champagne ivory background with dark navy text and gold accents",
    atmosphereDescAr: "عاجي شامبانيا دافئ مع خط كحلي داكن وتذهيب مشرق",
    starsOpacity: 0.02,
    skyGradient: "linear-gradient(180deg, #FAF6F0 0%, #EAF2F8 100%)",
  },
  dusk: {
    id: "dusk",
    name: "Dusk",
    nameAr: "الغروب",
    timeRange: "5:00 – 6:30 PM",
    timeRangeAr: "5:00 – 6:30 م",
    background: "#2A1A30",
    surface: "#3D2244",
    surfaceElevated: "#4A2840",
    primary: "#4A2840",
    accent: "#E3C280",
    textPrimary: "#FFF7ED",
    textSecondary: "#D4C5D9",
    border: "rgba(227, 194, 128, 0.35)",
    glow: "rgba(227, 194, 128, 0.48)",
    heroOverlay: "linear-gradient(180deg, rgba(42, 26, 48, 0.55) 0%, rgba(74, 40, 64, 0.7) 100%)",
    atmosphereDesc: "Twilight purple and warm amber gold celestial gradient",
    atmosphereDescAr: "غروب بنفسجي عسلي دافئ مع أفق ذهبي أنيق",
    starsOpacity: 0.35,
    skyGradient: "linear-gradient(180deg, #2A1A30 0%, #4A2840 100%)",
  },
  twilight: {
    id: "twilight",
    name: "Twilight",
    nameAr: "الشفق",
    timeRange: "6:30 – 8:00 PM",
    timeRangeAr: "6:30 – 8:00 م",
    background: "#2A1A30",
    surface: "#3D2244",
    surfaceElevated: "#4A2840",
    primary: "#4A2840",
    accent: "#E3C280",
    textPrimary: "#FFF7ED",
    textSecondary: "#D4C5D9",
    border: "rgba(227, 194, 128, 0.35)",
    glow: "rgba(227, 194, 128, 0.48)",
    heroOverlay: "linear-gradient(180deg, rgba(42, 26, 48, 0.55) 0%, rgba(74, 40, 64, 0.7) 100%)",
    atmosphereDesc: "Twilight purple and warm amber gold celestial gradient",
    atmosphereDescAr: "شفق بنفسجي زهري وظهور أولى نجوم المساء الذهبية",
    starsOpacity: 0.45,
    skyGradient: "linear-gradient(180deg, #2A1A30 0%, #4A2840 100%)",
  },
  evening: {
    id: "evening",
    name: "Evening",
    nameAr: "المساء",
    timeRange: "8:00 – 10:00 PM",
    timeRangeAr: "8:00 – 10:00 م",
    background: "#2A1A30",
    surface: "#3D2244",
    surfaceElevated: "#4A2840",
    primary: "#4A2840",
    accent: "#E3C280",
    textPrimary: "#FFF7ED",
    textSecondary: "#D4C5D9",
    border: "rgba(227, 194, 128, 0.35)",
    glow: "rgba(227, 194, 128, 0.48)",
    heroOverlay: "linear-gradient(180deg, rgba(42, 26, 48, 0.55) 0%, rgba(74, 40, 64, 0.7) 100%)",
    atmosphereDesc: "Twilight purple and warm amber gold celestial gradient",
    atmosphereDescAr: "مساء بنفسجي فلكي هادئ مع نجوم واضحة في السماء وتذهيب دافئ",
    starsOpacity: 0.6,
    skyGradient: "linear-gradient(180deg, #2A1A30 0%, #4A2840 100%)",
  },
};

/**
 * Determine exact period according to user's specified local time boundaries:
 * 1. MIDNIGHT (BASE PRIMARY): 10:00 PM - 4:00 AM (22:00 to 04:00)
 * 2. DAWN:                    4:00 AM - 8:00 AM  (04:00 to 08:00)
 * 3. DAYLIGHT:                8:00 AM - 5:00 PM  (08:00 to 17:00)
 * 4. SUNSET:                  5:00 PM - 10:00 PM (17:00 to 22:00)
 */
export function getPeriodForDate(date: Date = new Date()): TimePeriod {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const totalMinutes = hours * 60 + minutes;

  // 12:00 AM - 4:00 AM (0 to 239 mins) -> MIDNIGHT
  if (totalMinutes >= 0 && totalMinutes < 240) {
    return "midnight";
  }
  // 4:00 AM - 8:00 AM (240 to 479 mins) -> DAWN
  if (totalMinutes >= 240 && totalMinutes < 480) {
    return "dawn";
  }
  // 8:00 AM - 5:00 PM (480 to 1019 mins) -> DAYLIGHT
  if (totalMinutes >= 480 && totalMinutes < 1020) {
    return "daylight";
  }
  // 5:00 PM - 10:00 PM (1020 to 1319 mins) -> SUNSET
  if (totalMinutes >= 1020 && totalMinutes < 1320) {
    return "sunset";
  }
  // 10:00 PM - 11:59 PM (1320 to 1439 mins) -> MIDNIGHT
  return "midnight";
}

/**
 * Apply the exact theme CSS variables directly to the root document
 */
export function applyThemeVariables(period: TimePeriod) {
  if (typeof document === "undefined") return;
  const config = PERIOD_CONFIGS[period] || PERIOD_CONFIGS.midnight;
  if (!config) return;

  const root = document.documentElement;
  root.setAttribute("data-theme-period", period);
  root.setAttribute("data-theme", period);

  // Centralized exact CSS variables required by spec
  root.style.setProperty("--background", config.background);
  root.style.setProperty("--surface", config.surface);
  root.style.setProperty("--surface-elevated", config.surfaceElevated);
  root.style.setProperty("--primary", config.primary);
  root.style.setProperty("--accent", config.accent);
  root.style.setProperty("--text-primary", config.textPrimary);
  root.style.setProperty("--text-secondary", config.textSecondary);
  root.style.setProperty("--border", config.border);
  root.style.setProperty("--glow", config.glow);
  root.style.setProperty("--hero-overlay", config.heroOverlay);

  // Mapped Tailwind variables for seamless system-wide styling
  root.style.setProperty("--card", config.surface);
  root.style.setProperty("--card-foreground", config.textPrimary);
  root.style.setProperty("--popover", config.surfaceElevated);
  root.style.setProperty("--popover-foreground", config.textPrimary);
  root.style.setProperty("--foreground", config.textPrimary);
  root.style.setProperty("--muted", config.surface);
  root.style.setProperty("--muted-foreground", config.textSecondary);
  root.style.setProperty("--gold", config.accent);
  root.style.setProperty("--gold-soft", config.accent);
  root.style.setProperty("--sky-top", config.background);
  root.style.setProperty("--sky-bottom", config.surface);
}
