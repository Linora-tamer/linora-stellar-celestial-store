import { Link } from "@tanstack/react-router";
import { Heart, Star, ShoppingBag, Check } from "lucide-react";
import { useState } from "react";

import { formatPrice, useCart } from "@/lib/cart";
import { productImage } from "@/lib/product-images";
import type { Product } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { useWishlist } from "@/lib/wishlist";
import { getInitialReviewsForProduct, calculateAverageRating } from "@/lib/reviews";

export function ProductCard({ product }: { product: Product }) {
  const { pick, lang, t } = useI18n();
  const { isWishlisted, toggle } = useWishlist();
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  const name = pick(product, "name");
  const inWishlist = isWishlisted(product.id) || isWishlisted(product.slug);

  const reviews = getInitialReviewsForProduct(product.slug);
  const { average, count } = calculateAverageRating(reviews);

  function handleWishlistClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggle(product);
  }

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    add({
      productId: product.id,
      slug: product.slug,
      name,
      price: product.price,
      image: product.image_url,
      quantity: 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="card-star group relative flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-surface/80 backdrop-blur-sm transition-all duration-300 hover:border-accent hover:shadow-xl hover:-translate-y-1">
      {/* Top Star Badge */}
      <div className="absolute start-3 top-3 z-10 flex items-center gap-1 rounded-full border border-accent/40 bg-surface/90 px-2.5 py-0.5 text-[10px] font-semibold text-accent shadow-xs backdrop-blur-md">
        <Star className="h-3 w-3 fill-accent/40 text-accent animate-pulse" />
        <span>
          {product.is_featured
            ? lang === "ar"
              ? "مميز"
              : "Star Pick"
            : lang === "ar"
              ? "أصلي"
              : "Stellar"}
        </span>
      </div>

      <Link
        to="/shop/$slug"
        params={{ slug: product.slug }}
        className="flex flex-1 flex-col overflow-hidden"
      >
        <div className="relative aspect-square overflow-hidden bg-surface-elevated">
          <img
            src={productImage(product.slug, product.image_url)}
            alt={name}
            loading="lazy"
            width={1024}
            height={1024}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
        <div className="flex flex-1 flex-col gap-1.5 p-4">
          <h3 className="font-display text-base sm:text-lg font-semibold leading-tight text-text-primary transition-colors group-hover:text-accent">
            {name}
          </h3>
          <p className="text-xs text-text-secondary line-clamp-1">{pick(product, "tagline")}</p>

          <div className="mt-auto pt-3 flex items-center justify-between gap-2 border-t border-border/40">
            <span className="text-base font-bold text-accent">
              {formatPrice(product.price, lang)}
            </span>

            {count > 0 ? (
              <span className="flex items-center gap-1 text-[11px] text-text-secondary font-mono">
                <Star className="h-3.5 w-3.5 text-accent fill-accent" />
                <span>{average.toFixed(1)}</span>
                <span className="text-text-secondary/60">({count})</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[11px] text-accent/80 font-mono">
                <Star className="h-3.5 w-3.5 text-accent fill-accent/30" />
                <span>5.0</span>
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Quick Add to Cart action button */}
      <div className="px-4 pb-4">
        <button
          type="button"
          onClick={handleAddToCart}
          className={`w-full flex items-center justify-center gap-2 rounded-xl py-2 px-3 text-xs font-semibold tracking-wide transition-all ${
            added
              ? "bg-emerald-500 text-white shadow-md"
              : "bg-accent text-background hover:brightness-110 shadow-xs hover:shadow-accent/20"
          }`}
        >
          {added ? (
            <>
              <Check className="h-3.5 w-3.5" />
              <span>{lang === "ar" ? "تمت الإضافة!" : "Added to Cart!"}</span>
            </>
          ) : (
            <>
              <ShoppingBag className="h-3.5 w-3.5" />
              <span>{lang === "ar" ? "أضف للسلة" : "Add to Cart"}</span>
            </>
          )}
        </button>
      </div>

      {/* Wishlist toggle button */}
      <button
        type="button"
        onClick={handleWishlistClick}
        aria-label={inWishlist ? t("wishlist.remove") : t("wishlist.save")}
        title={inWishlist ? t("wishlist.remove") : t("wishlist.save")}
        className={`absolute end-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition-all ${
          inWishlist
            ? "bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-sm"
            : "bg-surface/80 text-text-secondary border border-border/60 hover:text-rose-400 hover:border-rose-400/50"
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
