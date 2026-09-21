import { THEMES, THEME_LABELS, useTheme } from "@/lib/theme";

export function ThemeSwitcher() {
  const { theme, auto, setTheme, setAuto } = useTheme();

  return (
    <div className="flex items-center gap-1 rounded-full border border-border bg-card/60 p-1 text-[11px] uppercase tracking-[0.18em]">
      <button
        type="button"
        onClick={() => setAuto(true)}
        className={`rounded-full px-2.5 py-1 transition-colors ${
          auto ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
        }`}
        title="Follow the time of day in your timezone"
      >
        Auto
      </button>
      {THEMES.map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => setTheme(t)}
          className={`hidden rounded-full px-2.5 py-1 transition-colors sm:block ${
            !auto && theme === t
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {THEME_LABELS[t]}
        </button>
      ))}
    </div>
  );
}
