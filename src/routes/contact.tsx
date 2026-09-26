import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Mail, MessageCircle, Instagram, Linkedin } from "lucide-react";

import { Star } from "@/components/site/Star";
import { supabase } from "@/integrations/supabase/client";
import { CONTACT } from "@/lib/store";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Linora Stellar" },
      {
        name: "description",
        content:
          "Talk to Linora Stellar on WhatsApp, email or Instagram about orders and design work.",
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
  "mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-gold";
const labelCls = "text-xs uppercase tracking-[0.16em] text-muted-foreground";

function Contact() {
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
      toast.error("Your message didn't send. Please try WhatsApp instead.");
      return;
    }
    setDone(true);
    toast.success("Message sent — Nora will reply soon.");
  }

  return (
    <div>
      <section className="starfield sky border-b border-border/60 py-16">
        <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
          <p className="flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-gold">
            <Star className="h-3 w-3" /> Say hello
          </p>
          <h1 className="mt-5 font-display text-4xl sm:text-5xl">Let's make something together</h1>
          <p className="mt-4 max-w-xl text-muted-foreground">
            Questions about an order, a custom design or a collaboration — the fastest reply is on
            WhatsApp.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-14 lg:grid-cols-[1fr_1.2fr] lg:px-8">
        <div className="space-y-4">
          {[
            {
              icon: MessageCircle,
              label: `WhatsApp ${CONTACT.whatsapp}`,
              href: CONTACT.whatsappLink,
            },
            { icon: Mail, label: CONTACT.email, href: `mailto:${CONTACT.email}` },
            { icon: Instagram, label: "@linora.stellar", href: CONTACT.instagram },
            { icon: Linkedin, label: "Nora Tamer on LinkedIn", href: CONTACT.linkedin },
          ].map(({ icon: Icon, label, href }) => (
            <a
              key={label}
              href={href}
              className="card-star flex items-center gap-3 rounded-xl px-4 py-3 text-sm"
            >
              <Icon className="h-4 w-4 text-gold" />
              {label}
            </a>
          ))}
        </div>

        {done ? (
          <div className="card-star rounded-2xl p-7">
            <h2 className="font-display text-2xl">Thank you</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Your message is with Nora. Expect a reply by email or WhatsApp.
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
                  className={field}
                />
              </div>
            </div>
            <div>
              <label className={labelCls} htmlFor="subject">
                Subject
              </label>
              <input id="subject" name="subject" maxLength={150} className={field} />
            </div>
            <div>
              <label className={labelCls} htmlFor="message">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={6}
                maxLength={2000}
                className={field}
              />
            </div>
            <button
              type="submit"
              disabled={busy}
              className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60"
            >
              {busy ? "Sending…" : "Send message"}
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
