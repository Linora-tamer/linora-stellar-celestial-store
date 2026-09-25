import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { Star } from "@/components/site/Star";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
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
      { property: "og:description", content: "Tell Nora what you need and get a made-to-order design." },
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
  "Logo & visual identity",
  "Social media designs",
  "Printables & planners",
  "Invitations & stationery",
  "School & classroom materials",
  "Apparel or mug design",
  "Illustration / digital art",
  "Something else",
];

function CustomOrders() {
  const { user } = useAuth();
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setBusy(true);
    const { error } = await supabase.from("custom_orders").insert({
      user_id: user?.id ?? null,
      name: String(form.get("name") ?? "").trim().slice(0, 100),
      email: String(form.get("email") ?? "").trim().slice(0, 255),
      phone: String(form.get("phone") ?? "").trim().slice(0, 30),
      design_type: String(form.get("design_type") ?? ""),
      description: String(form.get("description") ?? "").trim().slice(0, 3000),
      preferred_style: String(form.get("preferred_style") ?? "").slice(0, 200) || null,
      preferred_colors: String(form.get("preferred_colors") ?? "").slice(0, 200) || null,
      deadline: String(form.get("deadline") ?? "") || null,
      budget: String(form.get("budget") ?? "").slice(0, 60) || null,
      reference_url: String(form.get("reference_url") ?? "").slice(0, 500) || null,
    });
    setBusy(false);
    if (error) {
      toast.error("Your request didn't send. Please try WhatsApp instead.");
      return;
    }
    setDone(true);
  }

  return (
    <div>
      <section className="starfield sky border-b border-border/60 py-16">
        <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
          <p className="flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-gold">
            <Star className="h-3 w-3" /> Made just for you
          </p>
          <h1 className="mt-5 font-display text-4xl sm:text-5xl">Custom design requests</h1>
          <p className="mt-4 max-w-xl text-muted-foreground">
            Tell Nora what you have in mind — style, colours, deadline and budget — and you'll get a
            plan and a price before anything is designed.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-14 lg:px-8">
        {done ? (
          <div className="card-star rounded-2xl p-8 text-center">
            <Star className="mx-auto h-6 w-6 text-gold" />
            <h2 className="mt-4 font-display text-2xl">Your request is in</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Nora reviews every request personally and replies with a plan and price. For anything
              urgent, message{" "}
              <a className="text-gold hover:underline" href={CONTACT.whatsappLink}>
                WhatsApp {CONTACT.whatsapp}
              </a>
              .
            </p>
          </div>
        ) : (
          <form onSubmit={submit} className="card-star space-y-4 rounded-2xl p-7">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls} htmlFor="name">
                  Name
                </label>
                <input id="name" name="name" required maxLength={100} className={field} />
              </div>
              <div>
                <label className={labelCls} htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  maxLength={255}
                  defaultValue={user?.email ?? ""}
                  className={field}
                />
              </div>
              <div>
                <label className={labelCls} htmlFor="phone">
                  Phone / WhatsApp
                </label>
                <input id="phone" name="phone" required maxLength={30} className={field} />
              </div>
              <div>
                <label className={labelCls} htmlFor="design_type">
                  Design type
                </label>
                <select id="design_type" name="design_type" required className={field} defaultValue="">
                  <option value="" disabled>
                    Choose one
                  </option>
                  {DESIGN_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className={labelCls} htmlFor="description">
                What do you need?
              </label>
              <textarea id="description" name="description" required rows={6} maxLength={3000} className={field} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls} htmlFor="preferred_style">
                  Preferred style
                </label>
                <input id="preferred_style" name="preferred_style" maxLength={200} className={field} />
              </div>
              <div>
                <label className={labelCls} htmlFor="preferred_colors">
                  Preferred colours
                </label>
                <input id="preferred_colors" name="preferred_colors" maxLength={200} className={field} />
              </div>
              <div>
                <label className={labelCls} htmlFor="deadline">
                  Deadline
                </label>
                <input id="deadline" name="deadline" type="date" className={field} />
              </div>
              <div>
                <label className={labelCls} htmlFor="budget">
                  Budget (EGP)
                </label>
                <input id="budget" name="budget" maxLength={60} className={field} />
              </div>
            </div>

            <div>
              <label className={labelCls} htmlFor="reference_url">
                Reference link (Drive, Pinterest, Instagram…)
              </label>
              <input id="reference_url" name="reference_url" type="url" maxLength={500} className={field} />
            </div>

            <button
              type="submit"
              disabled={busy}
              className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60"
            >
              {busy ? "Sending…" : "Send request"}
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
