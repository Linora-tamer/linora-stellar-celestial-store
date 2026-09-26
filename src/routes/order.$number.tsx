import { createFileRoute, Link } from "@tanstack/react-router";

import { Star } from "@/components/site/Star";
import { useI18n } from "@/lib/i18n";
import { CONTACT } from "@/lib/store";

export const Route = createFileRoute("/order/$number")({
  head: () => ({
    meta: [
      { title: "Order confirmed — Linora Stellar" },
      { name: "description", content: "Your Linora Stellar order has been received." },
      { property: "og:title", content: "Order confirmed — Linora Stellar" },
      { property: "og:description", content: "Thank you for your Linora Stellar order." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OrderConfirmed,
});

function OrderConfirmed() {
  const { number } = Route.useParams();
  const { t } = useI18n();

  return (
    <div className="starfield sky">
      <div className="relative mx-auto max-w-2xl px-4 py-28 text-center lg:px-8">
        <Star className="mx-auto h-8 w-8 text-gold" />
        <h1 className="mt-6 font-display text-5xl">{t("order.thankYou")}</h1>
        <p className="mt-4 text-muted-foreground">{t("order.confirmed")}</p>
        <p className="mt-4 font-mono text-3xl font-semibold tracking-wider text-gold">{number}</p>
        <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{t("order.note")}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href={`${CONTACT.whatsappLink}?text=${encodeURIComponent(`Hi Nora! I just placed order ${number}.`)}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-primary px-6 py-3 text-sm uppercase tracking-[0.16em] text-primary-foreground transition-opacity hover:opacity-90"
          >
            {t("order.whatsapp")}
          </a>
          <Link
            to="/shop"
            className="rounded-full border border-gold px-6 py-3 text-sm uppercase tracking-[0.16em] text-gold hover:bg-gold/10"
          >
            {t("order.keepShopping")}
          </Link>
        </div>
      </div>
    </div>
  );
}
