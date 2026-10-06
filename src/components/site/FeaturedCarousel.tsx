import { useState, useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Sparkles, Heart, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

import { Star } from "@/components/site/Star";
import { formatPrice, useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import { useI18n } from "@/lib/i18n";
import { productImage } from "@/lib/product-images";
import type { Product } from "@/lib/store";

interface FeaturedCarouselProps {
  products: Product[];
}

export function FeaturedCarousel({ products }: FeaturedCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { t, pick, lang } = useI18n();
  const isAr = lang === "ar";
  const cart = useCart();
  const { isWishlisted, toggle: toggleWishlist } = useWishlist();

  // Number of items per view based on typical viewport
  const items = products.filter((p) => p.is_active);
  const maxIndex = Math.max(0, items.length - 1);

  // Auto-advance every 5 seconds if not paused
  useEffect(() => {
    if (isPaused || items.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, items.length, maxIndex]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  if (items.length === 0) return null;

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Navigation Controls */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-accent">
            <Star className="h-3.5 w-3.5 text-accent" />
            <span>{isAr ? "مختارات فلكية مميزة" : "Featured Star Collection"}</span>
          </p>
          <h2 className="mt-1 font-display text-3xl sm:text-4xl">
            {isAr ? "أحدث التصميمات الأكثر طلباً" : "Featured Celestial Designs"}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous slide"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-text-primary transition-all hover:border-accent hover:bg-surface-elevated hover:text-accent shadow-xs"
          >
            <ChevronLeft className="h-5 w-5 rtl:rotate-180" />
          </button>
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next slide"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-text-primary transition-all hover:border-accent hover:bg-surface-elevated hover:text-accent shadow-xs"
          >
            <ChevronRight className="h-5 w-5 rtl:rotate-180" />
          </button>
        </div>
      </div>

      {/* Carousel Viewport */}
      <div className="overflow-hidden rounded-2xl" ref={containerRef}>
        <div
          className="flex transition-transform duration-700 ease-out"
          style={{
            transform: `translateX(${isAr ? currentIndex * 100 : -currentIndex * 100}%)`,
          }}
        >
          {items.map((product) => {
            const displayName = pick(product, "name");
            const displayTagline = pick(product, "tagline");
            const inWishlist = isWishlisted(product.id);

            return (
              <div key={product.id} className="w-full shrink-0 px-1" style={{ flexBasis: "100%" }}>
                <div className="card-star grid gap-6 rounded-2xl border border-border bg-surface p-6 sm:p-8 md:grid-cols-2 items-center">
                  {/* Left: Product Image & Badges */}
                  <div className="relative aspect-4/3 sm:aspect-square overflow-hidden rounded-xl border border-border/60 bg-surface-elevated group">
                    <img
                      src={productImage(product.slug, product.image_url)}
                      alt={displayName}
                      width={600}
                      height={600}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Quick Wishlist Toggle */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleWishlist(product);
                      }}
                      className="absolute end-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-background/80 text-text-primary backdrop-blur-md transition-colors hover:text-rose-500"
                      aria-label="Toggle wishlist"
                    >
                      <Heart
                        className={`h-4 w-4 ${inWishlist ? "fill-rose-500 text-rose-500" : ""}`}
                      />
                    </button>

                    {product.is_featured && (
                      <span className="absolute start-3 top-3 inline-flex items-center gap-1 rounded-full bg-accent/90 px-3 py-1 text-[11px] font-semibold text-background shadow-xs">
                        <Sparkles className="h-3 w-3" />
                        <span>{isAr ? "قطعة مميزة" : "Featured Star"}</span>
                      </span>
                    )}
                  </div>

                  {/* Right: Product Narrative, Specs & Actions */}
                  <div className="flex flex-col justify-between h-full space-y-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.25em] text-accent">
                        {displayTagline}
                      </p>
                      <h3 className="mt-2 font-display text-3xl sm:text-4xl text-text-primary">
                        {displayName}
                      </h3>
                      <p className="mt-2 text-2xl font-semibold text-accent">
                        {formatPrice(Number(product.price), lang)}
                      </p>
                      <p className="mt-4 text-sm leading-relaxed text-text-secondary line-clamp-3">
                        {pick(product, "description")}
                      </p>

                      {/* Product details pills */}
                      {Array.isArray(product.details) && product.details.length > 0 && (
                        <div className="mt-5 flex flex-wrap gap-2">
                          {(product.details as string[]).slice(0, 3).map((detail, idx) => (
                            <span
                              key={idx}
                              className="rounded-full border border-border/80 bg-surface-elevated px-3 py-1 text-xs text-text-secondary"
                            >
                              ✦ {detail}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-border/60 flex flex-wrap gap-3">
                      <Link
                        to="/shop/$slug"
                        params={{ slug: product.slug }}
                        className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-background hover:opacity-90 shadow-xs transition-opacity"
                      >
                        {isAr ? "معاينة التفاصيل والطلب" : "View Full Details"}
                      </Link>

                      <button
                        type="button"
                        onClick={() => {
                          cart.add({
                            productId: product.id,
                            slug: product.slug,
                            name: displayName,
                            price: Number(product.price),
                            image: product.image_url,
                            quantity: 1,
                          });
                          toast.success(`${displayName} ${t("product.added")}`);
                        }}
                        className="inline-flex items-center gap-2 rounded-full border border-accent/80 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-accent hover:bg-accent/10 transition-colors"
                      >
                        <ShoppingBag className="h-3.5 w-3.5" />
                        <span>{isAr ? "إضافة للسلة" : "Add to Cart"}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="mt-5 flex items-center justify-center gap-2">
        {items.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setCurrentIndex(idx)}
            className={`h-2 rounded-full transition-all ${
              currentIndex === idx ? "w-8 bg-accent" : "w-2 bg-border/80 hover:bg-accent/50"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
