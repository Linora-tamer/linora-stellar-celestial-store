import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

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
  add: (item: Omit<CartItem, "id">) => void;
  remove: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  clear: () => void;
  count: number;
  total: number;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "linora-cart";

function keyFor(item: Omit<CartItem, "id">) {
  return [item.slug, JSON.stringify(item.options ?? {})].join("|");
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw) as CartItem[]);
    } catch {
      /* ignore malformed cart */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, loaded]);

  const value = useMemo<CartContextValue>(() => {
    return {
      items,
      add: (item) =>
        setItems((current) => {
          const id = keyFor(item);
          const existing = current.find((c) => c.id === id);
          if (existing) {
            return current.map((c) =>
              c.id === id ? { ...c, quantity: c.quantity + item.quantity } : c,
            );
          }
          return [...current, { ...item, id }];
        }),
      remove: (id) => setItems((current) => current.filter((c) => c.id !== id)),
      setQuantity: (id, quantity) =>
        setItems((current) =>
          quantity <= 0
            ? current.filter((c) => c.id !== id)
            : current.map((c) => (c.id === id ? { ...c, quantity } : c)),
        ),
      clear: () => setItems([]),
      count: items.reduce((sum, c) => sum + c.quantity, 0),
      total: items.reduce((sum, c) => sum + c.quantity * c.price, 0),
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}

export const formatPrice = (value: number) =>
  `${new Intl.NumberFormat("en-EG", { maximumFractionDigits: 0 }).format(value)} EGP`;
