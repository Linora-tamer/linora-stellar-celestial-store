import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { VALID_COUPONS, couponDiscount, type PromoCoupon } from "./coupons";

export type { PromoCoupon };

export type CartItem = {
  id: string;
  productId: string;
  slug: string;
  name: string;
  price: number;
  image?: string | null;
  quantity: number;
  options?: Record<string, string>;
};

type CartContextValue = {
  items: CartItem[];
  add: (item: Omit<CartItem, "id">, openDrawer?: boolean) => void;
  remove: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
  total: number;
  finalTotal: number;
  discountAmount: number;
  coupon: PromoCoupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "linora-cart";
const COUPON_STORAGE_KEY = "linora-cart-coupon";

function keyFor(item: Omit<CartItem, "id">) {
  return [item.slug, JSON.stringify(item.options ?? {})].join("|");
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [coupon, setCoupon] = useState<PromoCoupon | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw) as CartItem[]);
      const savedCoupon = localStorage.getItem(COUPON_STORAGE_KEY);
      if (savedCoupon && VALID_COUPONS[savedCoupon.toUpperCase()]) {
        setCoupon(VALID_COUPONS[savedCoupon.toUpperCase()]!);
      }
    } catch {
      /* ignore malformed cart */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    if (coupon) {
      localStorage.setItem(COUPON_STORAGE_KEY, coupon.code);
    } else {
      localStorage.removeItem(COUPON_STORAGE_KEY);
    }
  }, [items, coupon, loaded]);

  const value = useMemo<CartContextValue>(() => {
    const subtotal = items.reduce((sum, c) => sum + c.quantity * c.price, 0);

    const discountAmount = couponDiscount(subtotal, coupon);
    const finalTotal = Math.max(0, subtotal - discountAmount);

    return {
      items,
      add: (item, openDrawer = true) => {
        setItems((current) => {
          const id = keyFor(item);
          const existing = current.find((c) => c.id === id);
          if (existing) {
            return current.map((c) =>
              c.id === id ? { ...c, quantity: c.quantity + item.quantity } : c,
            );
          }
          return [...current, { ...item, id }];
        });
        if (openDrawer) {
          setIsDrawerOpen(true);
        }
      },
      remove: (id) => setItems((current) => current.filter((c) => c.id !== id)),
      setQuantity: (id, quantity) =>
        setItems((current) =>
          quantity <= 0
            ? current.filter((c) => c.id !== id)
            : current.map((c) => (c.id === id ? { ...c, quantity } : c)),
        ),
      clear: () => {
        setItems([]);
        setCoupon(null);
      },
      count: items.reduce((sum, c) => sum + c.quantity, 0),
      subtotal,
      total: subtotal,
      finalTotal,
      discountAmount,
      coupon,
      applyCoupon: (code: string) => {
        const clean = code.trim().toUpperCase();
        const found = VALID_COUPONS[clean];
        if (found) {
          setCoupon(found);
          return { success: true, message: `Promo code ${found.code} applied! (${found.label})` };
        }
        return { success: false, message: "Invalid promo code. Try STELLAR10 or WELCOME50." };
      },
      removeCoupon: () => setCoupon(null),
      isDrawerOpen,
      openDrawer: () => setIsDrawerOpen(true),
      closeDrawer: () => setIsDrawerOpen(false),
      toggleDrawer: () => setIsDrawerOpen((v) => !v),
    };
  }, [items, coupon, isDrawerOpen]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}

export const formatPrice = (value: number, lang: "en" | "ar" = "en") =>
  lang === "ar"
    ? `${new Intl.NumberFormat("ar-EG", { maximumFractionDigits: 0 }).format(value)} ج.م`
    : `${new Intl.NumberFormat("en-EG", { maximumFractionDigits: 0 }).format(value)} EGP`;
