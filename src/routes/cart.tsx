import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Trash2, ArrowRight, Tag, Sparkles, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

import { Star } from "@/components/site/Star";
import { ShippingZonesCard } from "@/components/site/ShippingZonesCard";
import { formatPrice, useCart } from "@/lib/cart";
import { useI18n } from "@/lib/i18n";
import { productImage } from "@/lib/product-images";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Celestial Cart — Linora Stellar" },
      {
        name: "description",
        content: "Review the celestial pieces and stationery in your Linora Stellar shopping cart.",
      },
      { property: "og:title", content: "Your Cart — Linora Stellar" },
      { property: "og:description", content: "Review your Linora Stellar order before checkout." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const {
    items,
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

  const [couponCode, setCouponCode] = useState("");

  function handleApplyCoupon(e: React.FormEvent) {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const res = applyCoupon(couponCode.trim());
    if (res.success) {
      toast.success(res.message);
      setCouponCode("");
    } else {
      toast.error(res.message);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 lg:px-8">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-accent font-semibold">
        <Star className="h-3.5 w-3.5 text-accent" />
        <span>{isAr ? "سلة التسوق الفلكية" : "Celestial Cart"}</span>
      </div>

      <h1 className="mt-2 font-display text-4xl sm:text-5xl text-text-primary">
        {t("cart.title")}
      </h1>

      {items.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-border bg-surface p-12 text-center card-star max-w-lg mx-auto">
          <ShoppingBag className="mx-auto h-10 w-10 text-accent/50 mb-3" />
          <h2 className="font-display text-2xl text-text-primary">{t("cart.empty")}</h2>
          <p className="mt-2 text-xs text-text-secondary">
            {isAr
              ? "استكشفي المطبوعات، الدفاتر، والأدوات المكتبية المتاحة وأضيفي ما تحبين."
              : "Discover our celestial printables, stationery, and branding pieces to begin your order."}
          </p>
          <Link
            to="/shop"
            className="mt-6 inline-flex rounded-full bg-accent px-8 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-background hover:opacity-90 transition-opacity shadow-xs"
          >
            {t("cart.browse")}
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px] items-start">
          {/* Cart Items List */}
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="card-star flex gap-4 rounded-2xl border border-border bg-surface p-4 sm:p-5 items-center"
              >
                <img
                  src={productImage(item.slug, item.image)}
                  alt={item.name}
                  width={100}
                  height={100}
                  className="h-20 w-20 sm:h-24 sm:w-24 rounded-xl object-cover shrink-0 border border-border/60 bg-surface-elevated"
                />

                <div className="flex-1 min-w-0">
                  <h2 className="font-display text-lg sm:text-xl text-text-primary truncate">
                    {item.name}
                  </h2>
                  {item.options &&
                    Object.entries(item.options).map(([k, v]) => (
                      <p key={k} className="text-xs text-text-secondary mt-0.5 truncate">
                        <span className="font-medium text-text-primary">{k}:</span> {v}
                      </p>
                    ))}

                  <div className="mt-3 flex items-center justify-between">
                    {/* Stepper */}
                    <div className="flex items-center rounded-full border border-border bg-background px-1 text-xs">
                      <button
                        type="button"
                        className="px-3 py-1 text-text-secondary hover:text-accent font-bold"
                        onClick={() => setQuantity(item.id, item.quantity - 1)}
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="w-6 text-center font-medium text-text-primary">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        className="px-3 py-1 text-text-secondary hover:text-accent font-bold"
                        onClick={() => setQuantity(item.id, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-accent">
                        {formatPrice(item.price * item.quantity, lang)}
                      </span>
                      <button
                        type="button"
                        onClick={() => remove(item.id)}
                        className="text-text-secondary transition-colors hover:text-rose-400 p-1"
                        aria-label={t("cart.remove")}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Egypt Shipping Zones Breakdown Guide */}
            <div className="pt-4">
              <ShippingZonesCard />
            </div>
          </div>

          {/* Cart Summary Card */}
          <aside className="h-fit rounded-2xl border border-border bg-surface p-6 sticky top-24 card-star space-y-4">
            <h2 className="font-display text-2xl text-text-primary border-b border-border/60 pb-3">
              {t("cart.summary")}
            </h2>

            {/* Promo Code Input */}
            <div className="pt-1">
              {coupon ? (
                <div className="flex items-center justify-between rounded-lg border border-accent/40 bg-accent/10 px-3 py-2 text-xs">
                  <div className="flex items-center gap-1.5 text-accent font-medium">
                    <Tag className="h-3.5 w-3.5" />
                    <span>{coupon.code}</span>
                    <span className="text-[10px] text-text-secondary">({coupon.label})</span>
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
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder={isAr ? "كود الخصم (STELLAR10)" : "Promo code (STELLAR10)"}
                    className="flex-1 rounded-md border border-border bg-background px-3 py-1.5 text-xs outline-none focus:border-accent uppercase"
                  />
                  <button
                    type="submit"
                    className="rounded-md border border-accent/60 px-3 py-1.5 text-xs uppercase tracking-wider text-accent hover:bg-accent/10 transition-colors"
                  >
                    {isAr ? "تطبيق" : "Apply"}
                  </button>
                </form>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 text-xs pt-2">
              <div className="flex justify-between text-text-secondary">
                <span>{t("cart.subtotal")}</span>
                <span className="font-semibold text-text-primary">
                  {formatPrice(subtotal, lang)}
                </span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400 font-medium">
                  <span>{isAr ? "الخصم المطبق" : "Discount"}</span>
                  <span>-{formatPrice(discountAmount, lang)}</span>
                </div>
              )}

              <div className="flex justify-between text-text-secondary">
                <span>{isAr ? "الشحن التقديري" : "Estimated Courier Delivery"}</span>
                <span className="text-[11px] text-accent">
                  {subtotal >= 500
                    ? isAr
                      ? "مجاني للقاهرة والجيزة ✦"
                      : "Free Cairo & Giza ✦"
                    : isAr
                      ? "يُحسب عند الدفع"
                      : "Calculated at checkout"}
                </span>
              </div>

              <div className="border-t border-border/60 pt-3 flex justify-between text-sm font-semibold text-text-primary">
                <span>{isAr ? "الإجمالي النهائي" : "Final Total"}</span>
                <span className="text-xl text-accent font-bold">
                  {formatPrice(finalTotal, lang)}
                </span>
              </div>
            </div>

            <p className="text-[11px] leading-relaxed text-text-secondary pt-1">{t("cart.note")}</p>

            <Link
              to="/checkout"
              className="mt-4 flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-center text-xs uppercase tracking-[0.16em] text-background hover:opacity-90 transition-opacity font-semibold shadow-md"
            >
              <span>{t("cart.checkout")}</span>
              <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
