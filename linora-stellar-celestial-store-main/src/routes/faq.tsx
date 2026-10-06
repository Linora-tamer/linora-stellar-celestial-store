import { createFileRoute } from "@tanstack/react-router";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CONTACT } from "@/lib/store";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Linora Stellar" },
      {
        name: "description",
        content:
          "Answers about delivery, personalisation, payment methods, digital files and custom design work at Linora Stellar.",
      },
      { property: "og:title", content: "FAQ — Linora Stellar" },
      {
        property: "og:description",
        content: "Delivery, payment, personalisation and custom work, answered.",
      },
    ],
  }),
  component: FaqPage,
});

const FAQS = [
  {
    q: "How do digital products reach me?",
    a: "Digital files are sent to the email address on your order, usually within a few hours and always within one working day. Nothing is shipped, and nothing expires.",
  },
  {
    q: "How long does printing and delivery take inside Egypt?",
    a: "Printed pieces and merch are produced in 2–4 working days, then delivered in 2–5 days depending on your governorate. I confirm the exact timing with you on WhatsApp after the order.",
  },
  {
    q: "Which payment methods do you accept?",
    a: "Vodafone Cash, InstaPay and cash on delivery. Card payments are being activated. For Vodafone Cash and InstaPay, send the total to +201040277935 and paste the transfer reference at checkout.",
  },
  {
    q: "Can I add a name or change the colours?",
    a: "Yes. Products marked as customisable let you choose colour and size where relevant and add a name or short message, with a live preview on the product page. Larger changes are welcome as a custom order.",
  },
  {
    q: "Do you design brand identities and social media content?",
    a: "Yes. The Brand Identity Package covers logo, palette, typography and a brand guide, and there are separate packs for social templates and business cards. Bespoke scopes are quoted after a short chat.",
  },
  {
    q: "Can I return or exchange an order?",
    a: "Digital files and personalised items can't be returned once produced, since they're made for you. If anything arrives damaged or incorrect, message me within 48 hours and I'll remake or refund it.",
  },
  {
    q: "Do you ship outside Egypt?",
    a: "Digital products are available worldwide. For printed items and merch outside Egypt, message me on WhatsApp for a shipping quote before ordering.",
  },
  {
    q: "How do I reach you?",
    a: `WhatsApp ${CONTACT.whatsapp} or email ${CONTACT.email}. I usually reply the same day.`,
  },
];

function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 lg:px-8">
      <p className="text-xs uppercase tracking-[0.3em] text-gold">Good to know</p>
      <h1 className="mt-2 font-display text-5xl">Frequently asked questions</h1>

      <Accordion type="single" collapsible className="mt-10">
        {FAQS.map((f) => (
          <AccordionItem key={f.q} value={f.q}>
            <AccordionTrigger className="text-left font-display text-lg">{f.q}</AccordionTrigger>
            <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
              {f.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <p className="mt-10 text-sm text-muted-foreground">
        Still unsure?{" "}
        <a href={CONTACT.whatsappLink} className="text-gold underline">
          Message me on WhatsApp
        </a>
        .
      </p>
    </div>
  );
}
