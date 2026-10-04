import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import {
  TIME_PERIODS,
  PERIOD_CONFIGS,
  FOUR_THEMES,
  getPeriodForDate,
  applyThemeVariables,
  type TimePeriod,
  type PeriodThemeConfig,
} from "./time-theme";

export { TIME_PERIODS, PERIOD_CONFIGS, FOUR_THEMES, getPeriodForDate };
export type { TimePeriod, PeriodThemeConfig };

// Backward compatibility aliases
export type Theme = TimePeriod;
export const THEMES = ["midnight", "dawn", "daylight", "sunset"] as const;
export const THEME_LABELS: Record<string, string> = {
  midnight: "Midnight",
  dawn: "Dawn",
  daylight: "Daylight",
  sunset: "Sunset",
  night: "Midnight",
  day: "Daylight",
  morning: "Daylight",
  dusk: "Sunset",
};

const DEFAULT_PERIOD: TimePeriod = "midnight";

export interface ThemeContextValue {
  period: TimePeriod;
  theme: TimePeriod;
  config: PeriodThemeConfig;
  auto: boolean;
  localTime: string;
  mounted: boolean;
  setPeriod: (period: TimePeriod) => void;
  setTheme: (theme: TimePeriod) => void;
  resetToAuto: () => void;
  setAuto: (auto: boolean) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "linora-stellar-time-period";
const STORAGE_AUTO_KEY = "linora-stellar-auto-theme";

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Use stable default for SSR and initial client hydration
  const [period, setPeriodState] = useState<TimePeriod>(DEFAULT_PERIOD);
  const [auto, setAutoState] = useState<boolean>(true);
  const [localTime, setLocalTime] = useState<string>("");
  const [mounted, setMounted] = useState<boolean>(false);

  // Update clock string helper
  const updateLocalTimeString = useCallback(() => {
    const now = new Date();
    setLocalTime(
      now.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }),
    );
  }, []);

  // Initialize on mount
  useEffect(() => {
    setMounted(true);
    updateLocalTimeString();

    const storedAuto = localStorage.getItem(STORAGE_AUTO_KEY);
    const storedPeriod = localStorage.getItem(STORAGE_KEY) as TimePeriod | null;

    if (storedAuto === "false" && storedPeriod && TIME_PERIODS.includes(storedPeriod)) {
      setAutoState(false);
      setPeriodState(storedPeriod);
      applyThemeVariables(storedPeriod);
    } else {
      setAutoState(true);
      const current = getPeriodForDate();
      setPeriodState(current);
      applyThemeVariables(current);
    }
  }, [updateLocalTimeString]);

  // Real-time engine: monitors local clock every 10 seconds and automatically updates period
  useEffect(() => {
    const interval = window.setInterval(() => {
      updateLocalTimeString();

      if (auto) {
        const next = getPeriodForDate();
        setPeriodState((prev) => {
          if (prev !== next) {
            applyThemeVariables(next);
            return next;
          }
          return prev;
        });
      }
    }, 10_000);

    // Also update on tab visibility change / focus (e.g. computer wake from sleep)
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        updateLocalTimeString();
        if (auto) {
          const fresh = getPeriodForDate();
          setPeriodState(fresh);
          applyThemeVariables(fresh);
        }
      }
    };
    window.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("focus", onVisibilityChange);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("focus", onVisibilityChange);
    };
  }, [auto, updateLocalTimeString]);

  // Manual override (for previewing other periods)
  const setPeriod = useCallback((nextPeriod: TimePeriod) => {
    setAutoState(false);
    setPeriodState(nextPeriod);
    localStorage.setItem(STORAGE_AUTO_KEY, "false");
    localStorage.setItem(STORAGE_KEY, nextPeriod);
    applyThemeVariables(nextPeriod);
  }, []);

  // Return to automatic live local time
  const resetToAuto = useCallback(() => {
    setAutoState(true);
    localStorage.removeItem(STORAGE_AUTO_KEY);
    localStorage.removeItem(STORAGE_KEY);
    const live = getPeriodForDate();
    setPeriodState(live);
    applyThemeVariables(live);
  }, []);

  const config = PERIOD_CONFIGS[period] || PERIOD_CONFIGS.night;

  return (
    <ThemeContext.Provider
      value={{
        period,
        theme: period,
        config,
        auto,
        localTime,
        mounted,
        setPeriod,
        setTheme: setPeriod,
        resetToAuto,
        setAuto: setAutoState,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
