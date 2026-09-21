import { createFileRoute, Link } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";

import { formatPrice, useCart } from "@/lib/cart";
import { productImage } from "@/lib/product-images";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your cart — Linora Stellar" },
      { name: "description", content: "Review the celestial pieces in your Linora Stellar cart." },
      { property: "og:title", content: "Your cart — Linora Stellar" },
      { property: "og:description", content: "Review your Linora Stellar order before checkout." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, setQuantity, remove, total } = useCart();

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 lg:px-8">
      <h1 className="font-display text-5xl">Your cart</h1>

      {items.length === 0 ? (
        <div className="mt-10 rounded-xl border border-border p-10 text-center">
          <p className="text-muted-foreground">Your cart is still empty.</p>
          <Link
            to="/shop"
            className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm uppercase tracking-[0.16em] text-primary-foreground"
          >
            Browse the shop
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 rounded-xl border border-border p-4">
                <img
                  src={productImage(item.slug, item.image)}
                  alt={item.name}
                  loading="lazy"
                  width={1024}
                  height={1024}
                  className="h-24 w-24 rounded-md object-cover"
                />
                <div className="flex-1">
                  <h2 className="font-display text-xl">{item.name}</h2>
                  {item.options &&
                    Object.entries(item.options).map(([k, v]) => (
                      <p key={k} className="text-xs text-muted-foreground">
                        {k}: {v}
                      </p>
                    ))}
                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex items-center rounded-full border border-border text-sm">
                      <button type="button" className="px-3 py-1" onClick={() => setQuantity(item.id, item.quantity - 1)}>
                        −
                      </button>
                      <span className="w-6 text-center">{item.quantity}</span>
                      <button type="button" className="px-3 py-1" onClick={() => setQuantity(item.id, item.quantity + 1)}>
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(item.id)}
                      className="text-muted-foreground transition-colors hover:text-destructive"
                      aria-label="Remove"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gold">{formatPrice(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>

          <aside className="h-fit rounded-xl border border-border p-6">
            <h2 className="font-display text-2xl">Summary</h2>
            <div className="mt-4 flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatPrice(total)}</span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Shipping is confirmed on WhatsApp after you place the order. Digital items are free to
              deliver.
            </p>
            <Link
              to="/checkout"
              className="mt-6 block rounded-full bg-primary px-6 py-3 text-center text-sm uppercase tracking-[0.16em] text-primary-foreground"
            >
              Checkout
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
