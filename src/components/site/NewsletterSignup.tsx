import { useState } from "react";
import { Star, Mail, Sparkles, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";

type NewsletterProps = {
  variant?: "banner" | "compact";
  className?: string;
};

const STORAGE_KEY = "linora_newsletter_subscribers";

export function NewsletterSignup({ variant = "banner", className = "" }: NewsletterProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        return !!localStorage.getItem("linora_newsletter_subscribed");
      } catch {
        // ignore
      }
    }
    return false;
  });

  const { t, lang } = useI18n();
  const isAr = lang === "ar";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      toast.error(isAr ? "يرجى إدخال بريد إلكتروني صحيح." : "Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      try {
        const existingRaw = localStorage.getItem(STORAGE_KEY);
        const existing: string[] = existingRaw ? JSON.parse(existingRaw) : [];
        if (!existing.includes(cleanEmail)) {
          existing.push(cleanEmail);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
        }
        localStorage.setItem("linora_newsletter_subscribed", "true");
      } catch {
        // ignore
      }

      setIsSubmitting(false);
      setIsSubscribed(true);
      toast.success(t("newsletter.success"));
    }, 400);
  }

  if (variant === "compact") {
    return (
      <div className={`space-y-3 ${className}`}>
        <h4 className="text-xs uppercase tracking-[0.2em] text-gold font-medium">
          {t("newsletter.title")}
        </h4>
        <p className="text-xs text-muted-foreground">{t("newsletter.lead")}</p>

        {isSubscribed ? (
          <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-2.5 text-xs text-emerald-300">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>{t("newsletter.success")}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("newsletter.placeholder")}
              className="flex-1 rounded-full border border-border bg-card/60 px-3.5 py-2 text-xs outline-none focus:border-gold placeholder:text-muted-foreground transition-colors"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-full bg-primary px-4 py-2 text-xs uppercase tracking-[0.14em] text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-opacity font-medium shrink-0"
            >
              {isSubmitting ? t("newsletter.subscribing") : t("newsletter.subscribe")}
            </button>
          </form>
        )}
      </div>
    );
  }

  // Full banner variant
  return (
    <div
      className={`card-star relative overflow-hidden rounded-3xl border border-gold/40 bg-gradient-to-br from-card/90 via-card/50 to-primary/5 p-8 sm:p-12 ${className}`}
    >
      {/* Decorative Star Accents */}
      <div className="pointer-events-none absolute -top-12 -end-12 h-44 w-44 rounded-full bg-gold/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 -start-12 h-44 w-44 rounded-full bg-primary/15 blur-3xl" />

      <div className="relative mx-auto max-w-2xl text-center space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-gold">
          <Sparkles className="h-3.5 w-3.5" />
          <span>{t("newsletter.badge")}</span>
        </div>

        <h3 className="font-display text-3xl sm:text-4xl text-foreground font-medium">
          {t("newsletter.title")}
        </h3>

        <p className="text-sm text-muted-foreground leading-relaxed max-w-lg mx-auto">
          {t("newsletter.lead")}
        </p>

        {isSubscribed ? (
          <div className="mx-auto mt-6 inline-flex items-center gap-3 rounded-2xl border border-emerald-500/40 bg-emerald-500/15 px-6 py-4 text-sm text-emerald-200">
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            <span className="font-medium">{t("newsletter.success")}</span>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-6 flex flex-col sm:flex-row items-center gap-3 max-w-md"
          >
            <div className="relative w-full">
              <Mail className="absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("newsletter.placeholder")}
                className="w-full rounded-full border border-border bg-background/80 ps-10 pe-4 py-3 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-gold transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto rounded-full bg-primary px-7 py-3 text-xs uppercase tracking-[0.16em] text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-opacity font-medium shrink-0 flex items-center justify-center gap-1.5"
            >
              <Star className="h-3.5 w-3.5 text-primary-foreground" />
              <span>{isSubmitting ? t("newsletter.subscribing") : t("newsletter.subscribe")}</span>
            </button>
          </form>
        )}

        <p className="text-[11px] text-muted-foreground pt-1">{t("newsletter.privacy")}</p>
      </div>
    </div>
  );
}
