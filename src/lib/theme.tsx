import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export const THEMES = ["dawn", "morning", "day", "dusk", "night"] as const;
export type Theme = (typeof THEMES)[number];

export const THEME_LABELS: Record<Theme, string> = {
  dawn: "Dawn",
  morning: "Morning",
  day: "Day",
  dusk: "Dusk",
  night: "Night",
};

export function themeForHour(hour: number): Theme {
  if (hour >= 5 && hour < 8) return "dawn";
  if (hour >= 8 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "day";
  if (hour >= 17 && hour < 20) return "dusk";
  return "night";
}

type ThemeContextValue = {
  theme: Theme;
  auto: boolean;
  setTheme: (theme: Theme) => void;
  setAuto: (auto: boolean) => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  theme: "night",
  auto: true,
  setTheme: () => {},
  setAuto: () => {},
});

const STORAGE_KEY = "linora-theme";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("night");
  const [auto, setAutoState] = useState(true);

  // Apply the visitor's local time-of-day theme after hydration.
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && stored !== "auto" && (THEMES as readonly string[]).includes(stored)) {
      setAutoState(false);
      setThemeState(stored as Theme);
      return;
    }
    setAutoState(true);
    setThemeState(themeForHour(new Date().getHours()));
  }, []);

  // Keep the automatic theme in step with the clock / timezone changes.
  useEffect(() => {
    if (!auto) return;
    const tick = () => setThemeState(themeForHour(new Date().getHours()));
    tick();
    const id = window.setInterval(tick, 60_000);
    const onFocus = () => tick();
    window.addEventListener("focus", onFocus);
    return () => {
      window.clearInterval(id);
      window.removeEventListener("focus", onFocus);
    };
  }, [auto]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const setTheme = useCallback((next: Theme) => {
    setAutoState(false);
    setThemeState(next);
    localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const setAuto = useCallback((next: boolean) => {
    setAutoState(next);
    if (next) {
      localStorage.setItem(STORAGE_KEY, "auto");
      setThemeState(themeForHour(new Date().getHours()));
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, auto, setTheme, setAuto }}>{children}</ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
