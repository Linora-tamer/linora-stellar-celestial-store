import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Mail, MessageCircle, Instagram, Linkedin, CheckCircle2, ArrowRight } from "lucide-react";

import { Star } from "@/components/site/Star";
import { supabase } from "@/integrations/supabase/client";
import { CONTACT } from "@/lib/store";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Linora Stellar — Nora Tamer Studio" },
      {
        name: "description",
        content:
          "Talk to Linora Stellar on WhatsApp, email or Instagram about custom orders and design work.",
      },
      { property: "og:title", content: "Contact Linora Stellar" },
      {
        property: "og:description",
        content: "WhatsApp, email and social — reach Nora Tamer directly.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Contact,
});

const field =
  "mt-1.5 w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text-primary outline-none focus:border-accent transition-colors";
const labelCls = "text-xs uppercase tracking-[0.16em] text-text-secondary font-medium";

function Contact() {
  const { lang } = useI18n();
  const isAr = lang === "ar";
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setBusy(true);
    const { error } = await supabase.from("contact_messages").insert({
      name: String(form.get("name") ?? "")
        .trim()
        .slice(0, 100),
      email: String(form.get("email") ?? "")
        .trim()
        .slice(0, 255),
      subject: String(form.get("subject") ?? "").slice(0, 150) || null,
      message: String(form.get("message") ?? "")
        .trim()
        .slice(0, 2000),
    });
    setBusy(false);
    if (error) {
      toast.error(
        isAr
          ? "تعذر إرسال الرسالة، يمكنك التواصل معنا مباشرة عبر واتساب."
          : "Your message didn't send. Please try WhatsApp instead.",
      );
      return;
    }
    setDone(true);
    toast.success(
      isAr
        ? "تم إرسال رسالتك بنجاح — ستتواصل معكِ نورا تامر قريباً."
        : "Message sent — Nora will reply soon.",
    );
  }

  return (
    <div>
      <section className="starfield sky border-b border-border/60 py-20">
        <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
          <p className="flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-accent">
            <Star className="h-3.5 w-3.5 text-accent" />
            <span>{isAr ? "تواصل شخصي ومباشر" : "Say Hello"}</span>
          </p>
          <h1 className="mt-4 font-display text-4xl sm:text-6xl text-text-primary">
            {isAr ? "لنبتكر معاً شيئاً استثنائياً" : "Let's make something together"}
          </h1>
          <p className="mt-4 max-w-xl text-sm sm:text-base leading-relaxed text-text-secondary">
            {isAr
              ? "لأي استفسار عن طلب، أو فكرة تصميم مخصص، أو تعاون فني — أسرع وسيلة للتواصل المباشر هي عبر واتساب."
              : "Questions about an order, a custom design commission or a collaboration — the fastest reply is on WhatsApp."}
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 lg:grid-cols-[1fr_1.3fr] lg:px-8">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.25em] text-accent font-semibold mb-2">
            {isAr ? "قنوات التواصل المباشرة" : "Direct Channels"}
          </p>
          {[
            {
              icon: MessageCircle,
              label: `WhatsApp ${CONTACT.whatsapp}`,
              sub: isAr ? "رد سريع خلال دقائق" : "Instant reply for orders",
              href: CONTACT.whatsappLink,
            },
            {
              icon: Mail,
              label: CONTACT.email,
              sub: isAr ? "للاستفسارات والملفات الكبيرة" : "For design briefs & press",
              href: `mailto:${CONTACT.email}`,
            },
            {
              icon: Instagram,
              label: "@linora.stellar",
              sub: isAr ? "متابعة أحدث التصميمات والقصص" : "Daily studio sketchbook",
              href: CONTACT.instagram,
            },
            {
              icon: Linkedin,
              label: "Nora Tamer on LinkedIn",
              sub: isAr ? "الملف المهني للمصممة" : "Founder & Art Director",
              href: CONTACT.linkedin,
            },
          ].map(({ icon: Icon, label, sub, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="card-star flex items-center justify-between rounded-2xl border border-border bg-surface p-4 sm:p-5 transition-transform hover:-translate-y-1"
            >
              <div className="flex items-center gap-3.5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/15 text-accent shrink-0">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">{label}</p>
                  <p className="text-xs text-text-secondary mt-0.5">{sub}</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-text-secondary rtl:rotate-180" />
            </a>
          ))}
        </div>

        {done ? (
          <div className="card-star rounded-2xl border border-border bg-surface p-8 text-center sm:text-start flex flex-col justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400 mb-4 mx-auto sm:mx-0">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h2 className="font-display text-3xl text-text-primary">
              {isAr ? "شكراً لتواصلكِ معنا ✦" : "Thank you for reaching out ✦"}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-text-secondary leading-relaxed">
              {isAr
                ? "وصلت رسالتكِ إلى المصممة نورا تامر مباشرة. توقعي رداً سريعاً عبر البريد الإلكتروني أو واتساب."
                : "Your message is with Nora. Expect a reply by email or WhatsApp within a few hours."}
            </p>
            <button
              type="button"
              onClick={() => setDone(false)}
              className="mt-6 inline-flex self-start rounded-full border border-accent/60 px-6 py-2.5 text-xs uppercase tracking-wider text-accent hover:bg-accent/10 transition-colors"
            >
              {isAr ? "إرسال رسالة أخرى" : "Send another message"}
            </button>
          </div>
        ) : (
          <form
            onSubmit={submit}
            className="card-star space-y-5 rounded-2xl border border-border bg-surface p-6 sm:p-8"
          >
            <h2 className="font-display text-2xl text-text-primary">
              {isAr ? "نموذج المراسلة المباشر" : "Send a Direct Message"}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls} htmlFor="name">
                  {isAr ? "الاسم الكريم" : "Name"}
                </label>
                <input
                  id="name"
                  name="name"
                  required
                  maxLength={100}
                  placeholder={isAr ? "مثال: مريم أحمد" : "Your full name"}
                  className={field}
                />
              </div>
              <div>
                <label className={labelCls} htmlFor="email">
                  {isAr ? "البريد الإلكتروني" : "Email"}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  maxLength={255}
                  placeholder="name@example.com"
                  className={field}
                />
              </div>
            </div>
            <div>
              <label className={labelCls} htmlFor="subject">
                {isAr ? "موضوع الرسالة" : "Subject"}
              </label>
              <input
                id="subject"
                name="subject"
                maxLength={150}
                placeholder={
                  isAr ? "استفسار عن طلب / تصميم خاص / تعاون" : "Order inquiry / Custom project"
                }
                className={field}
              />
            </div>
            <div>
              <label className={labelCls} htmlFor="message">
                {isAr ? "نص الرسالة" : "Message"}
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                maxLength={2000}
                placeholder={
                  isAr
                    ? "اكتبي تفاصيل استفساركِ أو فكرتكِ هنا..."
                    : "Tell us about your project or inquiry..."
                }
                className={field}
              />
            </div>
            <button
              type="submit"
              disabled={busy}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-accent px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-background hover:opacity-90 disabled:opacity-60 transition-opacity shadow-md cursor-pointer"
            >
              <span>
                {busy
                  ? isAr
                    ? "جارٍ الإرسال..."
                    : "Sending…"
                  : isAr
                    ? "إرسال الرسالة"
                    : "Send Message"}
              </span>
              <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
