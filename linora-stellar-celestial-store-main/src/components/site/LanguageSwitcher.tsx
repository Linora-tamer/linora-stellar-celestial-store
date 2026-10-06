import { useI18n } from "@/lib/i18n";

export function LanguageSwitcher() {
  const { lang, setLang } = useI18n();
  const base = "px-1.5 text-xs transition-colors";
  return (
    <div
      className="flex items-center rounded-full border border-border px-2 py-1"
      role="group"
      aria-label="Language"
    >
      <button
        type="button"
        lang="ar"
        onClick={() => setLang("ar")}
        aria-pressed={lang === "ar"}
        className={`${base} ${lang === "ar" ? "text-gold" : "text-muted-foreground hover:text-foreground"}`}
      >
        العربية
      </button>
      <span className="text-muted-foreground" aria-hidden>
        |
      </span>
      <button
        type="button"
        lang="en"
        onClick={() => setLang("en")}
        aria-pressed={lang === "en"}
        className={`${base} ${lang === "en" ? "text-gold" : "text-muted-foreground hover:text-foreground"}`}
      >
        English
      </button>
    </div>
  );
}
