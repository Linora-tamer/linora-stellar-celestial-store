import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type FontWeight = "normal" | "medium" | "bold";
export type ContrastMode = "standard" | "high" | "max";

export interface ReadabilitySettings {
  overlayActive: boolean;
  fontWeight: FontWeight;
  contrastMode: ContrastMode;
}

interface ReadabilityContextValue extends ReadabilitySettings {
  setOverlayActive: (active: boolean) => void;
  setFontWeight: (weight: FontWeight) => void;
  setContrastMode: (mode: ContrastMode) => void;
  toggleOverlay: () => void;
  cycleFontWeight: () => void;
  cycleContrastMode: () => void;
  resetToDefaults: () => void;
}

const STORAGE_KEYS = {
  overlay: "linora_readability_overlay",
  weight: "linora_font_weight",
  contrast: "linora_contrast_mode",
};

const DEFAULT_SETTINGS: ReadabilitySettings = {
  overlayActive: false,
  fontWeight: "normal",
  contrastMode: "standard",
};

const ReadabilityContext = createContext<ReadabilityContextValue | null>(null);

export function ReadabilityProvider({ children }: { children: ReactNode }) {
  const [overlayActive, setOverlayActiveState] = useState<boolean>(false);
  const [fontWeight, setFontWeightState] = useState<FontWeight>("normal");
  const [contrastMode, setContrastModeState] = useState<ContrastMode>("standard");

  // Read stored preferences on mount to avoid SSR hydration mismatch
  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEYS.overlay) === "true") {
        setOverlayActiveState(true);
      }
      const storedWeight = localStorage.getItem(STORAGE_KEYS.weight) as FontWeight | null;
      if (storedWeight === "normal" || storedWeight === "medium" || storedWeight === "bold") {
        setFontWeightState(storedWeight);
      }
      const storedContrast = localStorage.getItem(STORAGE_KEYS.contrast) as ContrastMode | null;
      if (storedContrast === "standard" || storedContrast === "high" || storedContrast === "max") {
        setContrastModeState(storedContrast);
      }
    } catch {
      // ignore
    }
  }, []);

  // Apply attributes to <html> root
  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;

    root.setAttribute("data-readability-overlay", overlayActive ? "true" : "false");
    root.setAttribute("data-font-weight", fontWeight);
    root.setAttribute("data-contrast-mode", contrastMode);

    try {
      localStorage.setItem(STORAGE_KEYS.overlay, String(overlayActive));
      localStorage.setItem(STORAGE_KEYS.weight, fontWeight);
      localStorage.setItem(STORAGE_KEYS.contrast, contrastMode);
    } catch {
      // ignore
    }
  }, [overlayActive, fontWeight, contrastMode]);

  const setOverlayActive = (active: boolean) => setOverlayActiveState(active);
  const setFontWeight = (weight: FontWeight) => setFontWeightState(weight);
  const setContrastMode = (mode: ContrastMode) => setContrastModeState(mode);

  const toggleOverlay = () => setOverlayActiveState((prev) => !prev);

  const cycleFontWeight = () => {
    setFontWeightState((prev) => {
      if (prev === "normal") return "medium";
      if (prev === "medium") return "bold";
      return "normal";
    });
  };

  const cycleContrastMode = () => {
    setContrastModeState((prev) => {
      if (prev === "standard") return "high";
      if (prev === "high") return "max";
      return "standard";
    });
  };

  const resetToDefaults = () => {
    setOverlayActiveState(DEFAULT_SETTINGS.overlayActive);
    setFontWeightState(DEFAULT_SETTINGS.fontWeight);
    setContrastModeState(DEFAULT_SETTINGS.contrastMode);
  };

  return (
    <ReadabilityContext.Provider
      value={{
        overlayActive,
        fontWeight,
        contrastMode,
        setOverlayActive,
        setFontWeight,
        setContrastMode,
        toggleOverlay,
        cycleFontWeight,
        cycleContrastMode,
        resetToDefaults,
      }}
    >
      {children}
    </ReadabilityContext.Provider>
  );
}

export function useReadability() {
  const ctx = useContext(ReadabilityContext);
  if (!ctx) {
    return {
      overlayActive: false,
      fontWeight: "normal" as FontWeight,
      contrastMode: "standard" as ContrastMode,
      setOverlayActive: () => {},
      setFontWeight: () => {},
      setContrastMode: () => {},
      toggleOverlay: () => {},
      cycleFontWeight: () => {},
      cycleContrastMode: () => {},
      resetToDefaults: () => {},
    };
  }
  return ctx;
}
