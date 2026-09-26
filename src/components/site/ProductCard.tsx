import { Link } from "@tanstack/react-router";
import { Heart, Star } from "lucide-react";

import { formatPrice } from "@/lib/cart";
import { productImage } from "@/lib/product-images";
import type { Product } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { useWishlist } from "@/lib/wishlist";
import { getReviewsForProduct, calculateAverageRating } from "@/lib/reviews";

export function ProductCard({ product }: { product: Product }) {
  const { pick, lang, t } = useI18n();
  const { isWishlisted, toggle } = useWishlist();
  const name = pick(product, "name");
  const inWishlist = isWishlisted(product.id) || isWishlisted(product.slug);

  const reviews = getReviewsForProduct(product.slug);
  const { average, count } = calculateAverageRating(reviews);

  function handleWishlistClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggle(product);
  }

  return (
    <div className="card-star group relative flex flex-col overflow-hidden rounded-xl">
      <Link
        to="/shop/$slug"
        params={{ slug: product.slug }}
        className="flex flex-1 flex-col overflow-hidden"
      >
        <div className="relative aspect-square overflow-hidden bg-secondary">
          <img
            src={productImage(product.slug, product.image_url)}
            alt={name}
            loading="lazy"
            width={1024}
            height={1024}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
        <div className="flex flex-1 flex-col gap-1 p-4">
          <h3 className="font-display text-lg leading-tight transition-colors group-hover:text-gold">
            {name}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-1">{pick(product, "tagline")}</p>

          <div className="mt-auto pt-3 flex items-center justify-between">
            <span className="text-sm font-semibold text-gold">
              {formatPrice(product.price, lang)}
            </span>

            {count > 0 && (
              <span className="flex items-center gap-1 text-[11px] text-muted-foreground font-mono">
                <Star className="h-3 w-3 text-gold fill-gold" />
                <span>{average.toFixed(1)}</span>
                <span className="text-muted-foreground/60">({count})</span>
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Wishlist toggle button */}
      <button
        type="button"
        onClick={handleWishlistClick}
        aria-label={inWishlist ? t("wishlist.remove") : t("wishlist.save")}
        title={inWishlist ? t("wishlist.remove") : t("wishlist.save")}
        className={`absolute end-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition-all ${
          inWishlist
            ? "bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-sm"
            : "bg-ink/50 text-muted-foreground border border-border/60 hover:text-rose-400 hover:border-rose-400/50"
        }`}
      >
        <Heart
          className={`h-4 w-4 transition-transform active:scale-125 ${
            inWishlist ? "fill-rose-400 text-rose-400" : ""
          }`}
        />
      </button>
    </div>
  );
}
