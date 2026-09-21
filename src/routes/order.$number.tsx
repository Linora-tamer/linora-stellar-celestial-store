import { createFileRoute, Link } from "@tanstack/react-router";

import { Star } from "@/components/site/Star";
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
  return (
    <div className="starfield sky">
      <div className="relative mx-auto max-w-2xl px-4 py-28 text-center lg:px-8">
        <Star className="mx-auto h-8 w-8 text-gold" />
        <h1 className="mt-6 font-display text-5xl">Thank you</h1>
        <p className="mt-4 text-muted-foreground">
          Your order is confirmed. Keep this reference safe:
        </p>
        <p className="mt-4 font-display text-3xl text-gold">{number}</p>
        <p className="mt-6 text-sm text-muted-foreground">
          I'll message you on WhatsApp to confirm delivery and timing. Digital files arrive by email.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href={`${CONTACT.whatsappLink}?text=${encodeURIComponent(`Hi! I just placed order ${number}.`)}`}
            className="rounded-full bg-primary px-6 py-3 text-sm uppercase tracking-[0.16em] text-primary-foreground"
          >
            Message on WhatsApp
          </a>
          <Link
            to="/shop"
            className="rounded-full border border-gold px-6 py-3 text-sm uppercase tracking-[0.16em] text-gold"
          >
            Keep shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
