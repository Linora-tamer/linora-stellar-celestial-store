import { Link, useRouterState } from "@tanstack/react-router";
import { Home, ShoppingBag, Sparkles, FolderKanban, Heart, Palette } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import { useI18n } from "@/lib/i18n";

export function MobileBottomBar() {
  const { count: cartCount, openDrawer } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { t, lang } = useI18n();
  const isAr = lang === "ar";
  const router = useRouterState();
  const currentPath = router.location.pathname;

  const ITEMS = [
    {
      to: "/",
      label: isAr ? "الرئيسية" : "Home",
      icon: Home,
      isActive: currentPath === "/",
    },
    {
      to: "/shop",
      label: isAr ? "المتجر" : "Store",
      icon: ShoppingBag,
      isActive: currentPath.startsWith("/shop"),
    },
    {
      to: "/custom-orders",
      label: isAr ? "تصميمك" : "Custom",
      icon: Palette,
      highlight: true,
      isActive: currentPath.startsWith("/custom-orders"),
    },
    {
      to: "/portfolio",
      label: isAr ? "الأعمال" : "Portfolio",
      icon: FolderKanban,
      isActive: currentPath.startsWith("/portfolio"),
    },
  ];

  return (
    <div className="fixed bottom-3 inset-x-3 z-40 lg:hidden pointer-events-auto">
      <nav
        aria-label="Mobile Navigation"
        className="mx-auto max-w-md rounded-2xl border border-border/80 bg-surface/85 backdrop-blur-xl px-3 py-2 shadow-2xl transition-all duration-300 card-star flex items-center justify-around"
      >
        {ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center justify-center gap-1 py-1 px-2.5 rounded-xl transition-all relative ${
                item.isActive
                  ? "text-accent font-semibold"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {item.highlight ? (
                <div className="relative -mt-4 flex h-10 w-10 items-center justify-center rounded-full bg-accent text-background shadow-lg transition-transform active:scale-95">
                  <Icon className="h-5 w-5" />
                  <span className="absolute -top-1 -end-1 h-2.5 w-2.5 rounded-full bg-amber-400 animate-ping" />
                </div>
              ) : (
                <Icon className={`h-5 w-5 ${item.isActive ? "scale-110" : ""}`} />
              )}
              <span className="text-[10px] tracking-wider leading-none mt-0.5">{item.label}</span>
              {item.isActive && (
                <span className="absolute -bottom-1 h-0.5 w-4 rounded-full bg-accent" />
              )}
            </Link>
          );
        })}

        {/* Quick Cart Trigger with real count badge */}
        <button
          type="button"
          onClick={openDrawer}
          className="flex flex-col items-center justify-center gap-1 py-1 px-2.5 rounded-xl text-text-secondary hover:text-accent transition-colors relative"
          aria-label={t("nav.cart")}
        >
          <div className="relative">
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -end-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[9px] font-bold text-background shadow-xs">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-wider leading-none mt-0.5">
            {isAr ? "السلة" : "Cart"}
          </span>
        </button>
      </nav>
    </div>
  );
}
