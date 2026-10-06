import { useState, useEffect } from "react";
import {
  Star,
  Mail,
  Sparkles,
  CheckCircle2,
  Copy,
  Check,
  Gift,
  ArrowRight,
  X,
  Compass,
} from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";

type NewsletterProps = {
  variant?: "banner" | "compact" | "footer-strip";
  className?: string;
};

const STORAGE_KEY = "linora_newsletter_subscribers";
const WELCOME_CODE = "STELLAR10";

export function NewsletterSignup({ variant = "banner", className = "" }: NewsletterProps) {
  const [email, setEmail] = useState("");
  const [selectedInterest, setSelectedInterest] = useState<string>("all");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("linora_newsletter_subscribed");
      if (stored) setIsSubscribed(true);
    } catch {
      // ignore
    }
  }, []);

  const { lang } = useI18n();
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
        const existing: Array<{ email: string; interest: string; date: string }> = existingRaw
          ? JSON.parse(existingRaw)
          : [];
        if (!existing.some((item) => item.email === cleanEmail)) {
          existing.push({
            email: cleanEmail,
            interest: selectedInterest,
            date: new Date().toISOString(),
          });
          localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
        }
        localStorage.setItem("linora_newsletter_subscribed", "true");
      } catch {
        // ignore
      }

      setIsSubmitting(false);
      setIsSubscribed(true);
      toast.success(
        isAr
          ? "✨ مرحباً بكِ في دائرة النجوم! تم تفعيل كود الخصم الفلكي الخاص بكِ."
          : "✨ Welcome to the Stargazers' Circle! Your celestial voucher is unlocked.",
      );
    }, 450);
  }

  function handleCopyCode() {
    navigator.clipboard.writeText(WELCOME_CODE);
    setCopiedCode(true);
    toast.success(isAr ? "تم نسخ كود الخصم STELLAR10!" : "Copied code STELLAR10 to clipboard!");
    setTimeout(() => setCopiedCode(false), 2200);
  }

  // 1. Compact Widget Variant
  if (variant === "compact") {
    return (
      <div className={`space-y-3 ${className}`}>
        <div className="flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] text-accent font-semibold">
          <Sparkles className="h-3.5 w-3.5 text-accent animate-pulse" />
          <span>{isAr ? "نشرة لينورا الفلكية" : "Celestial Newsletter"}</span>
        </div>
        <p className="text-xs text-text-secondary leading-relaxed">
          {isAr
            ? "انضمي لمجتمع لينورا واحصلي على كود خصم 10% فورياً ومطبوعات فلكية شهرية مجانية."
            : "Join our celestial circle for an instant 10% welcome voucher and free monthly printables."}
        </p>

        {isSubscribed ? (
          <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-xs">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-1">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{isAr ? "أنتِ مسجلة في دائرة النجوم" : "You are a Stargazer VIP"}</span>
            </div>
            <div className="mt-2 flex items-center justify-between rounded-xl border border-accent/40 bg-surface/80 p-2 font-mono text-[11px]">
              <span className="text-accent font-bold">{WELCOME_CODE} (10% OFF)</span>
              <button
                type="button"
                onClick={handleCopyCode}
                className="inline-flex items-center gap-1 text-[10px] text-text-secondary hover:text-accent font-sans"
              >
                {copiedCode ? (
                  <Check className="h-3 w-3 text-emerald-400" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
                <span>{copiedCode ? (isAr ? "تم النسخ" : "Copied") : isAr ? "نسخ" : "Copy"}</span>
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Mail className="absolute start-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-secondary" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={isAr ? "بريدك الإلكتروني..." : "Enter your email..."}
                className="w-full rounded-full border border-border bg-surface/70 ps-8 pe-3 py-2 text-xs text-text-primary placeholder:text-text-secondary outline-none focus:border-accent transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-full bg-accent px-4 py-2 text-xs uppercase tracking-wider text-background font-bold hover:brightness-110 disabled:opacity-50 transition-all shrink-0 shadow-xs"
            >
              {isSubmitting ? (isAr ? "جاري..." : "...") : isAr ? "انضمي" : "Join"}
            </button>
          </form>
        )}
      </div>
    );
  }

  // 2. Footer-Strip Wide Celestial Banner Variant
  if (variant === "footer-strip") {
    return (
      <div
        className={`relative overflow-hidden rounded-3xl border border-accent/40 bg-linear-to-r from-surface/95 via-surface/85 to-surface-elevated/95 p-6 sm:p-8 card-star shadow-xl ${className}`}
      >
        <div className="pointer-events-none absolute -top-12 -end-12 h-44 w-44 rounded-full bg-accent/15 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-12 -start-12 h-44 w-44 rounded-full bg-purple-500/10 blur-2xl" />

        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-xl space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/15 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-accent font-semibold">
              <Sparkles className="h-3 w-3 text-accent animate-pulse" />
              <span>{isAr ? "النشرة الفلكية الحصرية" : "Celestial Stargazer Newsletter"}</span>
            </div>

            <h3 className="font-display text-2xl sm:text-3xl font-bold text-text-primary">
              {isAr
                ? "انضمي إلى دائرة النجوم واستلمي كود خصم 10% فورياً"
                : "Join The Stargazers' Circle & Unlock 10% OFF"}
            </h3>

            <p className="text-xs text-text-secondary leading-relaxed">
              {isAr
                ? "مطبوعات ومنظمات فلكية شهرية مجانية، إشعارات بأحدث التشكيلات الحصرية، وكود ترحيبي خاص بطلبك الأول."
                : "Receive monthly printable planners, priority access to bespoke stationery drops, and an instant welcome discount."}
            </p>
          </div>

          <div className="lg:w-96 shrink-0">
            {isSubscribed ? (
              <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/15 p-4 shadow-sm">
                <div className="flex items-center gap-2 text-emerald-300 font-semibold text-xs">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>
                    {isAr
                      ? "أهلاً بكِ في دائرة النجوم! كود هديتكِ جاهز:"
                      : "VIP Stargazer Activated! Your Welcome Gift:"}
                  </span>
                </div>
                <div className="mt-2.5 flex items-center justify-between gap-2 rounded-xl border border-accent/40 bg-surface/90 px-3 py-2">
                  <span className="font-mono text-sm font-bold text-accent">
                    {WELCOME_CODE} (10% OFF)
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="inline-flex items-center gap-1 rounded-lg bg-accent px-2.5 py-1 text-[11px] font-semibold text-background hover:brightness-110 transition-all"
                  >
                    {copiedCode ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedCode ? (isAr ? "تم" : "Copied") : isAr ? "نسخ" : "Copy"}</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={isAr ? "أدخلي بريدكِ الإلكتروني..." : "Enter your email..."}
                    className="w-full rounded-full border border-border bg-surface ps-10 pe-4 py-2.5 text-xs text-text-primary placeholder:text-text-secondary outline-none focus:border-accent transition-colors shadow-inner"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-full bg-accent px-5 py-2.5 text-xs uppercase tracking-wider text-background font-bold hover:brightness-110 disabled:opacity-50 transition-all shrink-0 shadow-md flex items-center justify-center gap-1.5"
                >
                  <span>
                    {isSubmitting
                      ? isAr
                        ? "جاري..."
                        : "..."
                      : isAr
                        ? "استلمي الكود"
                        : "Claim 10%"}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 3. Full Majestic Banner Variant
  return (
    <div
      className={`card-star relative overflow-hidden rounded-3xl border border-accent/40 bg-linear-to-br from-surface/95 via-surface/80 to-surface-elevated/90 p-8 sm:p-12 shadow-2xl backdrop-blur-xl ${className}`}
    >
      {/* Decorative Star Constellation Aura */}
      <div className="pointer-events-none absolute -top-16 -end-16 h-56 w-56 rounded-full bg-accent/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -start-16 h-56 w-56 rounded-full bg-accent/10 blur-3xl" />

      {/* Floating Constellation Stars */}
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <Star className="absolute top-6 left-10 h-3 w-3 text-accent animate-pulse" />
        <Star className="absolute top-12 right-20 h-4 w-4 text-accent animate-pulse" />
        <Star className="absolute bottom-8 left-1/4 h-3 w-3 text-accent animate-pulse" />
      </div>

      <div className="relative mx-auto max-w-2xl text-center space-y-4">
        {/* Celestial Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/15 px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-accent backdrop-blur-md shadow-xs">
          <Sparkles className="h-3.5 w-3.5 text-accent animate-pulse" />
          <span>
            {isAr
              ? "دائرة النجوم الفلكية — النشرة الإبداعية"
              : "The Stargazers' Circle — Celestial Newsletter"}
          </span>
        </div>

        <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl text-text-primary font-bold">
          {isAr ? "انضمي إلى دائرة النجوم الفلكية" : "Awaken Your Cosmic Creativity"}
        </h3>

        <p className="text-sm sm:text-base text-text-secondary leading-relaxed max-w-lg mx-auto">
          {isAr
            ? "اشتركي الآن لتستلمي كود خصم 10% فورياً، مطبوعات ومنظمات فلكية شهرية مجانية، وإشعارات حصرية عند إطلاق تشكيلاتنا المحدودة."
            : "Receive an instant 10% welcome starlight voucher, exclusive monthly printable planners, and priority notice on new limited-edition stationery drops."}
        </p>

        {/* 3 VIP Perks */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 pb-2 text-start text-xs text-text-secondary max-w-xl mx-auto">
          <div className="flex items-center gap-2 rounded-xl border border-border/70 bg-surface/60 p-2.5">
            <Gift className="h-4 w-4 text-accent shrink-0" />
            <span>{isAr ? "خصم 10% على طلبك الأول" : "Instant 10% Welcome Gift"}</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-border/70 bg-surface/60 p-2.5">
            <Sparkles className="h-4 w-4 text-accent shrink-0" />
            <span>{isAr ? "منظمات رقمية شهرية مجانية" : "Free Monthly Printables"}</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-border/70 bg-surface/60 p-2.5">
            <Star className="h-4 w-4 text-accent shrink-0" />
            <span>{isAr ? "أسبقية حجز التصاميم الخاصة" : "VIP Early Drop Access"}</span>
          </div>
        </div>

        {isSubscribed ? (
          <div className="mx-auto mt-6 max-w-md rounded-2xl border border-emerald-500/40 bg-emerald-500/15 p-5 shadow-lg">
            <div className="flex items-center justify-center gap-2 text-emerald-300 font-semibold text-sm">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              <span>
                {isAr
                  ? "أهلاً بكِ في دائرة النجوم! تم تفعيل هديتك الفلكية:"
                  : "You are a VIP Stargazer! Your Welcome Gift:"}
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-accent/40 bg-surface/90 px-4 py-3 shadow-inner">
              <div className="text-start">
                <span className="text-[10px] uppercase font-mono tracking-wider text-text-secondary block">
                  {isAr ? "كود الخصم (10% خصم على أي طلب)" : "Your Promo Code (10% OFF)"}
                </span>
                <span className="font-mono text-base font-bold text-accent tracking-wider">
                  {WELCOME_CODE}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyCode}
                className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-background hover:brightness-110 transition-all shadow-xs"
              >
                {copiedCode ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                <span>
                  {copiedCode ? (isAr ? "تم النسخ!" : "Copied!") : isAr ? "نسخ الكود" : "Copy Code"}
                </span>
              </button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-6 flex flex-col sm:flex-row items-center gap-3 max-w-md"
          >
            <div className="relative w-full">
              <Mail className="absolute start-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={isAr ? "أدخلي بريدكِ الإلكتروني..." : "Enter your email address..."}
                className="w-full rounded-full border border-border bg-surface/90 ps-11 pe-4 py-3 text-xs text-text-primary placeholder:text-text-secondary outline-none focus:border-accent transition-colors shadow-inner"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto rounded-full bg-accent px-7 py-3 text-xs uppercase tracking-wider text-background font-bold hover:brightness-110 disabled:opacity-50 transition-all shrink-0 shadow-md hover:shadow-accent/25 flex items-center justify-center gap-1.5"
            >
              <span>
                {isSubmitting
                  ? isAr
                    ? "جاري الاشتراك..."
                    : "Subscribing..."
                  : isAr
                    ? "انضمي واستلمي الهدية"
                    : "Unlock 10% Gift"}
              </span>
              <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

/**
 * Interactive Celestial Newsletter Popup Modal
 */
export function CelestialNewsletterModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div className="relative w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-3 -end-3 z-20 rounded-full bg-surface border border-accent/40 p-2 text-text-secondary hover:text-text-primary shadow-xl transition-colors"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <NewsletterSignup variant="banner" />
      </div>
    </div>
  );
}

/**
 * Trigger Pill for Header / Navigation
 */
export function VIPNewsletterButton({
  onClick,
  className = "",
}: {
  onClick: () => void;
  className?: string;
}) {
  const { lang } = useI18n();
  const isAr = lang === "ar";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative inline-flex items-center gap-1.5 rounded-full border border-amber-400/50 bg-amber-400/10 px-2.5 py-1 text-xs text-amber-300 hover:bg-amber-400 hover:text-background transition-all font-semibold shadow-xs ${className}`}
      title={
        isAr ? "انضمي للنشرة الفلكية واحصلي على خصم 10%" : "Join Celestial Newsletter for 10% OFF"
      }
    >
      <Gift className="h-3.5 w-3.5 text-accent group-hover:rotate-12 transition-transform" />
      <span>{isAr ? "هدية 10%" : "10% Gift"}</span>
    </button>
  );
}
