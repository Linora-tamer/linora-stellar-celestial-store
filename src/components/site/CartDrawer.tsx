import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { X, Trash2, ShoppingBag, ArrowRight, Sparkles, Check, Tag } from "lucide-react";
import { formatPrice, useCart } from "@/lib/cart";
import { productImage } from "@/lib/product-images";
import { useI18n } from "@/lib/i18n";
import { Star } from "@/components/site/Star";

const FREE_SHIPPING_THRESHOLD = 500; // 500 EGP for free standard courier

export function CartDrawer() {
  const {
    items,
    isDrawerOpen,
    closeDrawer,
    setQuantity,
    remove,
    subtotal,
    discountAmount,
    finalTotal,
    coupon,
    applyCoupon,
    removeCoupon,
  } = useCart();
  const { t, lang } = useI18n();
  const isAr = lang === "ar";
  const navigate = useNavigate();

  const [couponInput, setCouponInput] = useState("");
  const [couponFeedback, setCouponFeedback] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isDrawerOpen) {
        closeDrawer();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDrawerOpen, closeDrawer]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen]);

  if (!isDrawerOpen) return null;

  const freeShippingLeft = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShippingProgress = Math.min(
    100,
    Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100),
  );

  function handleApplyCoupon(e: React.FormEvent) {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput.trim());
    setCouponFeedback(res);
    if (res.success) {
      setCouponInput("");
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink/70 backdrop-blur-sm transition-opacity"
        onClick={closeDrawer}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 end-0 flex max-w-full">
        <div className="relative w-screen max-w-md bg-background border-s border-border/80 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/70 px-5 py-4 bg-card/60">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-gold" />
              <h2 className="font-display text-xl uppercase tracking-wider">{t("cart.title")}</h2>
              <span className="ms-1 rounded-full bg-gold/15 px-2 py-0.5 text-xs font-semibold text-gold">
                {items.reduce((s, i) => s + i.quantity, 0)}
              </span>
            </div>
            <button
              type="button"
              onClick={closeDrawer}
              className="rounded-full border border-border p-1.5 text-muted-foreground transition-colors hover:border-gold hover:text-foreground"
              aria-label="Close cart drawer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="border-b border-border/60 bg-gold/5 px-5 py-3 text-xs">
            {freeShippingLeft === 0 ? (
              <p className="flex items-center gap-1.5 font-medium text-emerald-400">
                <Sparkles className="h-3.5 w-3.5 text-gold" />
                {isAr
                  ? "مبروك! تأهلت شحنتك للشحن المجاني لمحافظات القاهرة والجيزة."
                  : "Congratulations! You've unlocked Free Cairo & Giza Delivery."}
              </p>
            ) : (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>
                    {isAr
                      ? `أضيفي ${formatPrice(freeShippingLeft, lang)} للحصول على توصيل مجاني`
                      : `Add ${formatPrice(freeShippingLeft, lang)} more for Free Cairo Delivery`}
                  </span>
                  <span className="font-semibold text-gold">{freeShippingProgress}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-border/60">
                  <div
                    className="h-full bg-gold transition-all duration-300 rounded-full"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-border/60">
            {items.length === 0 ? (
              <div className="py-16 text-center">
                <Star className="mx-auto h-8 w-8 text-gold/50 mb-3" />
                <p className="font-display text-xl">{t("cart.empty")}</p>
                <p className="mt-1 text-xs text-muted-foreground max-w-xs mx-auto">
                  {isAr
                    ? "استكشفي تشكيلة المطبوعات والهدايا السماوية وأضيفي قطعك المفضلة."
                    : "Explore our celestial printables and stationery collection to find your favourites."}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    closeDrawer();
                    navigate({ to: "/shop" });
                  }}
                  className="mt-6 inline-flex rounded-full bg-primary px-6 py-2.5 text-xs uppercase tracking-[0.16em] text-primary-foreground hover:opacity-90"
                >
                  {t("cart.browse")}
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="py-4 flex gap-3.5 items-start">
                  <img
                    src={productImage(item.slug, item.image)}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="h-18 w-18 rounded-lg object-cover bg-secondary shrink-0 border border-border/50"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium leading-snug line-clamp-1">{item.name}</h3>
                    {item.options &&
                      Object.entries(item.options).map(([k, v]) => (
                        <p key={k} className="text-[11px] text-muted-foreground mt-0.5 truncate">
                          <span className="font-medium text-foreground/80">{k}:</span> {v}
                        </p>
                      ))}
                    <div className="mt-2.5 flex items-center justify-between">
                      <div className="flex items-center rounded-full border border-border text-xs">
                        <button
                          type="button"
                          className="px-2.5 py-0.5 text-muted-foreground hover:text-gold"
                          onClick={() => setQuantity(item.id, item.quantity - 1)}
                        >
                          −
                        </button>
                        <span className="w-5 text-center font-medium">{item.quantity}</span>
                        <button
                          type="button"
                          className="px-2.5 py-0.5 text-muted-foreground hover:text-gold"
                          onClick={() => setQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-gold">
                          {formatPrice(item.price * item.quantity, lang)}
                        </span>
                        <button
                          type="button"
                          onClick={() => remove(item.id)}
                          className="text-muted-foreground/70 hover:text-destructive p-1"
                          aria-label={t("cart.remove")}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Controls & Summary */}
          {items.length > 0 && (
            <div className="border-t border-border/80 bg-card/70 p-5 space-y-4">
              {/* Promo Code Form */}
              <div>
                {coupon ? (
                  <div className="flex items-center justify-between rounded-lg border border-gold/40 bg-gold/10 px-3 py-1.5 text-xs">
                    <div className="flex items-center gap-1.5 text-gold font-medium">
                      <Tag className="h-3.5 w-3.5" />
                      <span>{coupon.code}</span>
                      <span className="text-[10px] text-muted-foreground">({coupon.label})</span>
                    </div>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-xs text-rose-400 hover:underline"
                    >
                      {isAr ? "إزالة" : "Remove"}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => {
                        setCouponInput(e.target.value);
                        setCouponFeedback(null);
                      }}
                      placeholder={
                        isAr ? "كود الخصم (مثال STELLAR10)" : "Promo code (e.g. STELLAR10)"
                      }
                      className="flex-1 rounded-md border border-input bg-background px-3 py-1.5 text-xs outline-none focus:border-gold uppercase"
                    />
                    <button
                      type="submit"
                      className="rounded-md border border-gold/60 px-3 py-1.5 text-xs uppercase tracking-wider text-gold hover:bg-gold/10 transition-colors"
                    >
                      {isAr ? "تطبيق" : "Apply"}
                    </button>
                  </form>
                )}
                {couponFeedback && !coupon && (
                  <p className="mt-1 text-[11px] text-rose-400">{couponFeedback.message}</p>
                )}
              </div>

              {/* Price Calculation */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>{t("cart.subtotal")}</span>
                  <span>{formatPrice(subtotal, lang)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-medium">
                    <span>{isAr ? "الخصم" : "Discount"}</span>
                    <span>-{formatPrice(discountAmount, lang)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-semibold text-foreground pt-1 border-t border-border/50">
                  <span>{isAr ? "الإجمالي المقدر" : "Estimated Total"}</span>
                  <span className="text-base text-gold">{formatPrice(finalTotal, lang)}</span>
                </div>
                <p className="text-[10px] text-muted-foreground text-center pt-0.5">
                  {isAr
                    ? "مصاريف الشحن تُحسب حسب محافظتك عند إتمام الطلب."
                    : "Shipping fee is calculated at checkout based on your governorate."}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    closeDrawer();
                    navigate({ to: "/checkout" });
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-full bg-primary py-3 text-xs uppercase tracking-[0.16em] text-primary-foreground font-medium hover:opacity-90 transition-opacity"
                >
                  <span>{t("cart.checkout")}</span>
                  <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    closeDrawer();
                    navigate({ to: "/cart" });
                  }}
                  className="w-full rounded-full border border-border py-2 text-xs uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground hover:border-gold transition-colors text-center"
                >
                  {isAr ? "عرض سلة المشتريات ومناطق الشحن" : "View Full Cart & Shipping Zones"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
