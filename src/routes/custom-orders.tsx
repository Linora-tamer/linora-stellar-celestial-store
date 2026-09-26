import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { Star } from "@/components/site/Star";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { CONTACT } from "@/lib/store";

export const Route = createFileRoute("/custom-orders")({
  head: () => ({
    meta: [
      { title: "Custom design requests — Linora Stellar" },
      {
        name: "description",
        content:
          "Request a custom design from Linora Stellar: branding, printables, invitations, apparel and personalised pieces.",
      },
      { property: "og:title", content: "Custom design requests — Linora Stellar" },
      {
        property: "og:description",
        content: "Tell Nora what you need and get a made-to-order design.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CustomOrders,
});

const field =
  "mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-gold";
const labelCls = "text-xs uppercase tracking-[0.16em] text-muted-foreground";

const DESIGN_TYPES = [
  { en: "Logo & visual identity", ar: "شعار وهوية بصرية متكاملة" },
  { en: "Social media designs", ar: "تصاميم سوشيال ميديا وقوالب" },
  { en: "Printables & planners", ar: "مخططات ومطبوعات ورقية" },
  { en: "Invitations & stationery", ar: "دعوات أفراح ومناسبات وأدوات مكتبية" },
  { en: "School & classroom materials", ar: "باقات فصول ومواد تعليمية للأطفال" },
  { en: "Apparel or mug design", ar: "تصميم تيشيرتات أو مجات أو منتجات" },
  { en: "Illustration / digital art", ar: "رسم بورتريه أو فن رقمي" },
  { en: "Something else", ar: "فكرة تصميم أخرى خاصة" },
];

function CustomOrders() {
  const { user } = useAuth();
  const { t, lang } = useI18n();
  const isAr = lang === "ar";
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setBusy(true);
    const { error } = await supabase.from("custom_orders").insert({
      user_id: user?.id ?? null,
      name: String(form.get("name") ?? "")
        .trim()
        .slice(0, 100),
      email: String(form.get("email") ?? "")
        .trim()
        .slice(0, 255),
      phone: String(form.get("phone") ?? "")
        .trim()
        .slice(0, 30),
      design_type: String(form.get("design_type") ?? ""),
      description: String(form.get("description") ?? "")
        .trim()
        .slice(0, 3000),
      preferred_style: String(form.get("preferred_style") ?? "").slice(0, 200) || null,
      preferred_colors: String(form.get("preferred_colors") ?? "").slice(0, 200) || null,
      deadline: String(form.get("deadline") ?? "") || null,
      budget: String(form.get("budget") ?? "").slice(0, 60) || null,
      reference_url: String(form.get("reference_url") ?? "").slice(0, 500) || null,
    });
    setBusy(false);
    if (error) {
      toast.error(
        isAr
          ? "تعذر إرسال الطلب، يرجى التواصل عبر واتساب مباشرة."
          : "Your request didn't send. Please try WhatsApp instead.",
      );
      return;
    }
    setDone(true);
  }

  return (
    <div>
      <section className="starfield sky border-b border-border/60 py-16">
        <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
          <p className="flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-gold">
            <Star className="h-3 w-3" /> {t("custom.badge")}
          </p>
          <h1 className="mt-5 font-display text-4xl sm:text-5xl">{t("custom.title")}</h1>
          <p className="mt-4 max-w-xl text-muted-foreground">{t("custom.lead")}</p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-14 lg:px-8">
        {done ? (
          <div className="card-star rounded-2xl p-8 text-center">
            <Star className="mx-auto h-8 w-8 text-gold" />
            <h2 className="mt-4 font-display text-3xl">{t("custom.successTitle")}</h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
              {t("custom.successLead")}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href={`${CONTACT.whatsappLink}?text=${encodeURIComponent(`Hi Nora! I just submitted a custom order inquiry on Linora Stellar.`)}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-primary px-6 py-2.5 text-sm uppercase tracking-[0.16em] text-primary-foreground"
              >
                {t("order.whatsapp")}
              </a>
              <button
                type="button"
                onClick={() => setDone(false)}
                className="rounded-full border border-border px-6 py-2.5 text-sm uppercase tracking-[0.16em] hover:border-gold"
              >
                {t("custom.sendAnother")}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} className="card-star space-y-6 rounded-2xl p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={labelCls} htmlFor="name">
                  {t("checkout.name")} *
                </label>
                <input id="name" name="name" required className={field} />
              </div>
              <div>
                <label className={labelCls} htmlFor="email">
                  {t("checkout.email")} *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  defaultValue={user?.email ?? ""}
                  className={field}
                />
              </div>
              <div>
                <label className={labelCls} htmlFor="phone">
                  {t("checkout.phone")} *
                </label>
                <input
                  id="phone"
                  name="phone"
                  required
                  placeholder="010xxxxxxxx"
                  className={field}
                />
              </div>
            </div>

            <div>
              <label className={labelCls} htmlFor="design_type">
                {t("custom.type")} *
              </label>
              <select id="design_type" name="design_type" required className={field}>
                {DESIGN_TYPES.map((dt) => (
                  <option key={dt.en} value={dt.en}>
                    {isAr ? dt.ar : dt.en}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelCls} htmlFor="description">
                {t("custom.desc")} *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                placeholder={t("custom.descPlaceholder")}
                className={field}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls} htmlFor="preferred_style">
                  {t("custom.style")}
                </label>
                <input
                  id="preferred_style"
                  name="preferred_style"
                  placeholder="e.g. Minimal celestial, gold foil luxury"
                  className={field}
                />
              </div>
              <div>
                <label className={labelCls} htmlFor="preferred_colors">
                  {t("custom.colors")}
                </label>
                <input
                  id="preferred_colors"
                  name="preferred_colors"
                  placeholder="e.g. Navy, gold & soft cream"
                  className={field}
                />
              </div>
              <div>
                <label className={labelCls} htmlFor="deadline">
                  {t("custom.deadline")}
                </label>
                <input id="deadline" name="deadline" type="date" className={field} />
              </div>
              <div>
                <label className={labelCls} htmlFor="budget">
                  {t("custom.budget")}
                </label>
                <input id="budget" name="budget" placeholder="e.g. 1500 EGP" className={field} />
              </div>
            </div>

            <div>
              <label className={labelCls} htmlFor="reference_url">
                {t("custom.reference")}
              </label>
              <input
                id="reference_url"
                name="reference_url"
                type="url"
                placeholder="https://"
                className={field}
              />
            </div>

            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-full bg-primary px-6 py-3.5 text-sm uppercase tracking-[0.16em] text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60 font-medium"
            >
              {busy ? t("custom.submitting") : t("custom.submit")}
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
