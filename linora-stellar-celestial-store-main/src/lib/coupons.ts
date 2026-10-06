// Shared by the cart (display) and the server (authoritative pricing).
export type PromoCoupon = {
  code: string;
  discountPercent?: number;
  discountFixed?: number;
  label: string;
};

export const VALID_COUPONS: Record<string, PromoCoupon> = {
  STELLAR10: { code: "STELLAR10", discountPercent: 10, label: "10% off Celestial Drop" },
  WELCOME50: { code: "WELCOME50", discountFixed: 50, label: "50 EGP Welcome Gift" },
  NORA20: { code: "NORA20", discountPercent: 20, label: "20% VIP Star Discount" },
};

export function findCoupon(code: string | null | undefined): PromoCoupon | null {
  if (!code) return null;
  return VALID_COUPONS[code.trim().toUpperCase()] ?? null;
}

export function couponDiscount(subtotal: number, coupon: PromoCoupon | null): number {
  if (!coupon) return 0;
  if (coupon.discountPercent) return Math.round((subtotal * coupon.discountPercent) / 100);
  if (coupon.discountFixed) return Math.min(subtotal, coupon.discountFixed);
  return 0;
}
