import { Link } from "@tanstack/react-router";
import {
  Heart,
  Star,
  ShoppingBag,
  Check,
  Zap,
  Package,
  Flame,
  Eye,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { useState } from "react";

import { formatPrice, useCart } from "@/lib/cart";
import { productImage } from "@/lib/product-images";
import type { Product } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { useWishlist } from "@/lib/wishlist";
import { getInitialReviewsForProduct, calculateAverageRating } from "@/lib/reviews";
import { PageFlipPreviewModal } from "@/components/site/PageFlipPreviewModal";

export function ProductCard({
  product,
  onOpenPodStudio,
}: {
  product: Product;
  onOpenPodStudio?: () => void;
}) {
  const { pick, lang, t } = useI18n();
  const isAr = lang === "ar";
  const { isWishlisted, toggle } = useWishlist();
  const { add, openDrawer } = useCart();
  const [added, setAdded] = useState(false);
  const [pagePreviewOpen, setPagePreviewOpen] = useState(false);

  const name = pick(product, "name");
  const inWishlist = isWishlisted(product.id) || isWishlisted(product.slug);

  const reviews = getInitialReviewsForProduct(product.slug);
  const { average, count } = calculateAverageRating(reviews);

  // Derive badge type based on slug / properties
  const isDigital =
    product.slug.includes("planner") ||
    product.slug.includes("digital") ||
    product.slug.includes("invitation") ||
    product.slug.includes("classroom");

  const isBestseller = product.is_featured || product.price > 200;
  const isPod =
    product.customizable || product.slug.includes("mug") || product.slug.includes("label");

  // Dynamic social proof viewer count
  const viewingCount = Math.floor(Math.abs(Math.sin(product.slug.length * 7)) * 12) + 5;
  const isLowStock = !isDigital && product.sort_order % 2 === 0;

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
    openDrawer();
  }

  return (
    <>
      <div className="card-star group relative flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-surface/85 backdrop-blur-sm transition-all duration-300 hover:border-accent hover:shadow-2xl hover:-translate-y-1">
        {/* Top Product Badges */}
        <div className="absolute start-3 top-3 z-10 flex flex-col gap-1.5 items-start">
          {isDigital ? (
            <span className="flex items-center gap-1 rounded-full border border-sky-400/50 bg-sky-500/15 px-2.5 py-0.5 text-[9px] font-bold text-sky-400 shadow-xs backdrop-blur-md">
              <Zap className="h-3 w-3" />
              <span>{isAr ? "تحميل فوري ⚡" : "Instant Download ⚡"}</span>
            </span>
          ) : (
            <span className="flex items-center gap-1 rounded-full border border-emerald-400/50 bg-emerald-500/15 px-2.5 py-0.5 text-[9px] font-bold text-emerald-400 shadow-xs backdrop-blur-md">
              <Package className="h-3 w-3" />
              <span>{isAr ? "شحن مطبوع 📦" : "Printed & Shipped 📦"}</span>
            </span>
          )}

          {isBestseller && (
            <span className="flex items-center gap-1 rounded-full border border-amber-400/50 bg-amber-500/20 px-2 py-0.5 text-[9px] font-bold text-amber-300 shadow-xs backdrop-blur-md">
              <Flame className="h-2.5 w-2.5 text-amber-400" />
              <span>{isAr ? "الأكثر طلباً 🔥" : "Best Seller"}</span>
            </span>
          )}
        </div>

        {/* Wishlist toggle button */}
        <button
          type="button"
          onClick={handleWishlistClick}
          aria-label={inWishlist ? t("wishlist.remove") : t("wishlist.save")}
          title={inWishlist ? t("wishlist.remove") : t("wishlist.save")}
          className={`absolute end-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition-all ${
            inWishlist
              ? "bg-rose-500/25 text-rose-400 border border-rose-500/50 shadow-sm"
              : "bg-surface/85 text-text-secondary border border-border/70 hover:text-rose-400 hover:border-rose-400/50"
          }`}
        >
          <Heart className={`h-4 w-4 ${inWishlist ? "fill-rose-400 text-rose-400" : ""}`} />
        </button>

        {/* Product Image & Link */}
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

            {/* Quick Look Inside preview trigger on image hover for planners/books */}
            {isDigital && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setPagePreviewOpen(true);
                }}
                className="absolute bottom-2.5 inset-x-3 z-10 flex items-center justify-center gap-1.5 rounded-xl bg-surface/90 py-1.5 text-[10px] font-semibold text-text-primary shadow-md backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity hover:text-accent border border-border/70"
              >
                <BookOpen className="h-3.5 w-3.5 text-accent" />
                <span>{isAr ? "تصفحي الصفحات (Look Inside)" : "Look Inside Preview"}</span>
              </button>
            )}
          </div>

          <div className="flex flex-1 flex-col gap-1.5 p-4">
            <h3 className="font-display text-base sm:text-lg font-semibold leading-tight text-text-primary transition-colors group-hover:text-accent">
              {name}
            </h3>
            <p className="text-xs text-text-secondary line-clamp-1">{pick(product, "tagline")}</p>

            {/* Urgency & Social Proof Indicators */}
            <div className="flex items-center justify-between text-[11px] text-text-secondary mt-1">
              <span className="flex items-center gap-1 font-mono text-accent">
                <Star className="h-3 w-3 fill-accent text-accent" />
                <span className="font-bold">{average.toFixed(1)}</span>
                <span className="text-text-secondary/70">({count > 0 ? count : 12})</span>
              </span>

              <span className="flex items-center gap-1 text-[10px] text-text-secondary/80 font-mono">
                <Eye className="h-3 w-3 text-accent" />
                <span>{isAr ? `${viewingCount} يشاهدون الآن` : `${viewingCount} viewing now`}</span>
              </span>
            </div>

            {/* Low stock indicator if physical item */}
            {isLowStock && (
              <p className="text-[10px] font-semibold text-amber-400 mt-0.5 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-ping" />
                <span>{isAr ? "باقي 3 قطع فقط في المخزون!" : "Only 3 left in stock!"}</span>
              </p>
            )}

            {/* Price section */}
            <div className="mt-auto pt-3 flex items-center justify-between gap-2 border-t border-border/40">
              <span className="text-base font-bold text-accent">
                {formatPrice(product.price, lang)}
              </span>

              {isPod && (
                <span className="text-[10px] font-semibold text-accent/90 border border-accent/30 rounded-full px-2 py-0.5">
                  {isAr ? "قابل للتخصيص" : "Customizable"}
                </span>
              )}
            </div>
          </div>
        </Link>

        {/* Quick Add to Cart action bar */}
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
                <span>{isAr ? "تمت الإضافة!" : "Added to Cart!"}</span>
              </>
            ) : (
              <>
                <ShoppingBag className="h-3.5 w-3.5" />
                <span>{isAr ? "أضف للسلة سريعاً" : "Quick Add to Cart"}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Page Flip Look Inside Modal */}
      <PageFlipPreviewModal
        isOpen={pagePreviewOpen}
        onClose={() => setPagePreviewOpen(false)}
        productTitle={name}
        onAddToCart={() => {
          add({
            productId: product.id,
            slug: product.slug,
            name,
            price: product.price,
            image: product.image_url,
            quantity: 1,
          });
          openDrawer();
        }}
      />
    </>
  );
}
