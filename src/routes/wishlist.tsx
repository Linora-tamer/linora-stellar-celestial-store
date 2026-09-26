import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { toast } from "sonner";

import { Star } from "@/components/site/Star";
import { formatPrice, useCart } from "@/lib/cart";
import { useI18n } from "@/lib/i18n";
import { productImage } from "@/lib/product-images";
import { useWishlist } from "@/lib/wishlist";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "Wishlist — Linora Stellar" },
      {
        name: "description",
        content: "Your saved celestial pieces, printables, stationery and merchandise.",
      },
      { property: "og:title", content: "Wishlist — Linora Stellar" },
      {
        property: "og:description",
        content: "Review your saved celestial favorites from Linora Stellar.",
      },
    ],
  }),
  component: WishlistPage,
});

function WishlistPage() {
  const { items, remove, clear, count } = useWishlist();
  const { add: addToCart } = useCart();
  const { t, lang } = useI18n();
  const isAr = lang === "ar";

  function handleAddToCart(item: (typeof items)[0]) {
    addToCart({
      productId: item.id,
      slug: item.slug,
      name: item.name,
      price: item.price,
      image: item.image ?? null,
      quantity: 1,
    });
    toast.success(`${item.name} ${t("product.added")}`);
  }

  return (
    <div className="pb-24">
      {/* Header Banner */}
      <section className="starfield sky border-b border-border/60 py-16">
        <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-gold">
                <Star className="h-3 w-3" /> {t("wishlist.badge")}
              </p>
              <h1 className="mt-4 font-display text-4xl sm:text-5xl">{t("wishlist.title")}</h1>
              <p className="mt-3 max-w-xl text-sm text-muted-foreground leading-relaxed">
                {t("wishlist.lead")}
              </p>
            </div>

            {count > 0 && (
              <button
                type="button"
                onClick={clear}
                className="text-xs uppercase tracking-[0.16em] text-muted-foreground hover:text-rose-400 transition-colors"
              >
                {t("wishlist.clear")}
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        {count === 0 ? (
          <div className="card-star rounded-2xl border border-border p-12 text-center max-w-xl mx-auto">
            <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-gold">
              <Heart className="h-8 w-8 text-gold/80" />
            </div>
            <h2 className="mt-5 font-display text-2xl">{t("wishlist.empty")}</h2>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              {t("wishlist.emptyDesc")}
            </p>
            <Link
              to="/shop"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-xs uppercase tracking-[0.16em] text-primary-foreground hover:opacity-90 transition-opacity font-medium"
            >
              <span>{t("wishlist.browse")}</span>
              <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="card-star group relative flex flex-col overflow-hidden rounded-xl border border-border"
              >
                <Link
                  to="/shop/$slug"
                  params={{ slug: item.slug }}
                  className="relative aspect-square overflow-hidden bg-secondary block"
                >
                  <img
                    src={productImage(item.slug, item.image)}
                    alt={item.name}
                    loading="lazy"
                    width={800}
                    height={800}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </Link>

                <div className="flex flex-1 flex-col p-4">
                  <Link
                    to="/shop/$slug"
                    params={{ slug: item.slug }}
                    className="font-display text-lg leading-tight transition-colors hover:text-gold"
                  >
                    {item.name}
                  </Link>
                  {item.tagline && (
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
                      {item.tagline}
                    </p>
                  )}
                  <p className="mt-2 text-sm font-semibold text-gold">
                    {formatPrice(item.price, lang)}
                  </p>

                  <div className="mt-4 flex items-center gap-2 pt-3 border-t border-border/60">
                    <button
                      type="button"
                      onClick={() => handleAddToCart(item)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-primary px-3 py-2 text-xs uppercase tracking-[0.12em] text-primary-foreground hover:opacity-90 transition-opacity font-medium"
                    >
                      <ShoppingBag className="h-3.5 w-3.5" />
                      <span>{t("wishlist.moveToCart")}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(item.id)}
                      className="rounded-full border border-border p-2 text-muted-foreground hover:border-rose-400 hover:text-rose-400 transition-colors"
                      aria-label={t("wishlist.remove")}
                      title={t("wishlist.remove")}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
