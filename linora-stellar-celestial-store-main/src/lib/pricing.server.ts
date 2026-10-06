// Server-only: authoritative order pricing. The browser's prices are never trusted for
// products that exist in the catalog.
import { findCoupon, couponDiscount } from "./coupons";
import { getGovernorate, requiresPhysicalShipping } from "./egypt-shipping";

export type ClientItem = {
  slug: string;
  name: string;
  price: number;
  quantity: number;
  options?: Record<string, string>;
};

export type PricedItem = {
  name: string;
  slug: string;
  price: number;
  quantity: number;
  options: Record<string, string>;
  /** true when the price came from the products table */
  fromCatalog: boolean;
};

export type PricedOrder = {
  items: PricedItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  allFromCatalog: boolean;
  couponApplied: string | null;
};

const clampQty = (q: number) => Math.min(50, Math.max(1, Math.trunc(Number.isFinite(q) ? q : 1)));
const clampPrice = (p: number) => (Number.isFinite(p) ? Math.min(100000, Math.max(0, p)) : 0);

export async function priceOrder(input: {
  items: ClientItem[];
  governorate: string;
  couponCode?: string | null;
}): Promise<PricedOrder> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const slugs = [...new Set(input.items.map((i) => i.slug))];
  const { data: rows, error } = await supabaseAdmin
    .from("products")
    .select("slug, name, price, is_active")
    .in("slug", slugs);
  if (error) throw new Error("Could not load product prices");

  const catalog = new Map<string, { name: string; price: number }>();
  for (const r of rows ?? []) {
    if (r.is_active !== false) catalog.set(r.slug, { name: r.name, price: Number(r.price) });
  }

  const items: PricedItem[] = input.items.map((i) => {
    const hit = catalog.get(i.slug);
    return {
      name: hit?.name ?? i.name.slice(0, 200),
      slug: i.slug,
      price: hit ? hit.price : clampPrice(i.price),
      quantity: clampQty(i.quantity),
      options: i.options ?? {},
      fromCatalog: Boolean(hit),
    };
  });

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const coupon = findCoupon(input.couponCode);
  const discount = couponDiscount(subtotal, coupon);

  const physical = requiresPhysicalShipping(items);
  const gov = getGovernorate(input.governorate);
  const shippingFee = physical ? (gov ? gov.fee : 0) : 0;

  return {
    items,
    subtotal,
    discount,
    shippingFee,
    total: Math.max(0, subtotal - discount) + shippingFee,
    allFromCatalog: items.every((i) => i.fromCatalog),
    couponApplied: coupon?.code ?? null,
  };
}
