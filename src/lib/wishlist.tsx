import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import type { Product } from "@/lib/store";
import { useI18n } from "@/lib/i18n";

export type WishlistItem = {
  id: string;
  slug: string;
  name: string;
  price: number;
  image?: string | null;
  tagline?: string | null;
  addedAt: string;
};

type WishlistContextType = {
  items: WishlistItem[];
  count: number;
  isWishlisted: (slugOrId: string) => boolean;
  toggle: (product: Product) => void;
  remove: (slugOrId: string) => void;
  clear: () => void;
};

const WishlistContext = createContext<WishlistContextType | null>(null);
const STORAGE_KEY = "linora_wishlist";

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return [];
  });

  const { t, pick } = useI18n();

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  const isWishlisted = useCallback(
    (slugOrId: string) => {
      return items.some((i) => i.id === slugOrId || i.slug === slugOrId);
    },
    [items],
  );

  const remove = useCallback(
    (slugOrId: string) => {
      setItems((prev) => prev.filter((i) => i.id !== slugOrId && i.slug !== slugOrId));
      toast.success(t("wishlist.removedToast"));
    },
    [t],
  );

  const toggle = useCallback(
    (product: Product) => {
      const exists = items.some((i) => i.id === product.id || i.slug === product.slug);
      if (exists) {
        setItems((prev) => prev.filter((i) => i.id !== product.id && i.slug !== product.slug));
        toast.info(t("wishlist.removedToast"));
      } else {
        const newItem: WishlistItem = {
          id: product.id,
          slug: product.slug,
          name: pick(product, "name"),
          price: Number(product.price),
          image: product.image_url,
          tagline: pick(product, "tagline"),
          addedAt: new Date().toISOString(),
        };
        setItems((prev) => [newItem, ...prev]);
        toast.success(t("wishlist.addedToast"));
      }
    },
    [items, pick, t],
  );

  const clear = useCallback(() => {
    setItems([]);
  }, []);

  const value = useMemo(
    () => ({
      items,
      count: items.length,
      isWishlisted,
      toggle,
      remove,
      clear,
    }),
    [items, isWishlisted, toggle, remove, clear],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return ctx;
}
