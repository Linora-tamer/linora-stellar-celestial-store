import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { en, type Dict } from "@/locales/en";
import { ar } from "@/locales/ar";

export type Lang = "en" | "ar";
const DICTS: Record<Lang, Dict> = { en, ar };
const STORAGE_KEY = "linora-lang";

type I18nValue = {
  lang: Lang;
  dir: "ltr" | "rtl";
  setLang: (l: Lang) => void;
  t: (key: keyof Dict) => string;
  /** Pick the localized value of a bilingual record field, falling back to English. */
  pick: <T extends Record<string, unknown>>(row: T | null | undefined, field: string) => string;
};

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "en" || saved === "ar") setLangState(saved);
    else if (navigator.language?.toLowerCase().startsWith("ar")) setLangState("ar");
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    html.lang = lang;
    html.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    localStorage.setItem(STORAGE_KEY, l);
    setLangState(l);
  }, []);

  const value = useMemo<I18nValue>(
    () => ({
      lang,
      dir: lang === "ar" ? "rtl" : "ltr",
      setLang,
      t: (key) => DICTS[lang][key] ?? en[key],
      pick: (row, field) => {
        if (!row) return "";
        const localized = lang === "ar" ? row[`${field}_ar`] : undefined;
        const v = (typeof localized === "string" && localized.trim() ? localized : row[field]) ?? "";
        return String(v);
      },
    }),
    [lang, setLang],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}
