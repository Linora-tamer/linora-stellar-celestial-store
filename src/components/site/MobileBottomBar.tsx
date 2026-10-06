import { Link, useRouterState } from "@tanstack/react-router";
import { Home, ShoppingBag, Palette, CircleUserRound, Menu } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";

export function MobileBottomBar({
  onOpenPodStudio,
  onOpenMenu,
}: {
  onOpenPodStudio?: () => void;
  onOpenMenu?: () => void;
}) {
  const { count: cartCount, openDrawer } = useCart();
  const { user } = useAuth();
  const { t, lang } = useI18n();
  const isAr = lang === "ar";
  const router = useRouterState();
  const currentPath = router.location.pathname;

  return (
    <div className="fixed bottom-2.5 inset-x-2.5 z-40 lg:hidden pointer-events-auto">
      <nav
        aria-label="Mobile Navigation"
        className="mx-auto max-w-md rounded-2xl border border-border/80 bg-surface/90 backdrop-blur-xl px-2 py-1.5 shadow-2xl transition-all duration-300 card-star flex items-center justify-around"
      >
        {/* 1. Home */}
        <Link
          to="/"
          className={`flex flex-col items-center justify-center gap-0.5 py-1 px-2 rounded-xl transition-all ${
            currentPath === "/"
              ? "text-accent font-bold"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          <Home className="h-4.5 w-4.5" />
          <span className="text-[10px] tracking-wider leading-none mt-0.5">
            {isAr ? "الرئيسية" : "Home"}
          </span>
        </Link>

        {/* 2. Direct Store */}
        <Link
          to="/shop"
          className={`flex flex-col items-center justify-center gap-0.5 py-1 px-2 rounded-xl transition-all ${
            currentPath.startsWith("/shop")
              ? "text-accent font-bold"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          <ShoppingBag className="h-4.5 w-4.5" />
          <span className="text-[10px] tracking-wider leading-none mt-0.5">
            {isAr ? "المتجر" : "Store"}
          </span>
        </Link>

        {/* 3. Highlighted Custom POD Studio (Center Pill) */}
        <button
          type="button"
          onClick={onOpenPodStudio}
          className="relative -mt-5 flex flex-col items-center justify-center focus:outline-hidden group"
          title={isAr ? "استوديو الطباعة عند الطلب" : "Custom POD Studio"}
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-background shadow-lg shadow-accent/30 transition-transform group-active:scale-95 group-hover:scale-105 border-2 border-surface">
            <Palette className="h-5 w-5" />
            <span className="absolute -top-0.5 -end-0.5 h-2.5 w-2.5 rounded-full bg-amber-400 animate-ping" />
          </div>
          <span className="text-[9px] font-bold text-accent tracking-wider leading-none mt-1">
            {isAr ? "استوديو POD" : "POD Studio"}
          </span>
        </button>

        {/* 4. My Account (Replaces Wishlist as requested) */}
        <Link
          to={user ? "/account" : "/auth"}
          className={`relative flex flex-col items-center justify-center gap-0.5 py-1 px-2 rounded-xl transition-all ${
            currentPath.startsWith("/account") || currentPath.startsWith("/auth")
              ? "text-accent font-bold"
              : "text-text-secondary hover:text-text-primary"
          }`}
          title={
            isAr
              ? "حسابي: تسجيل الدخول والتحميلات وتتبع الطلبات"
              : "My Account: Login, Downloads & Tracking"
          }
        >
          <div className="relative">
            <CircleUserRound className="h-4.5 w-4.5" />
            {user && (
              <span className="absolute -top-0.5 -end-0.5 h-2 w-2 rounded-full bg-emerald-400 ring-1 ring-surface" />
            )}
          </div>
          <span className="text-[10px] tracking-wider leading-none mt-0.5 font-medium">
            {isAr ? "حسابي" : "Account"}
          </span>
        </Link>

        {/* 5. Essential Hamburger Menu (≡ Side Navigation) */}
        <button
          type="button"
          onClick={onOpenMenu}
          className="relative flex flex-col items-center justify-center gap-0.5 py-1 px-2 rounded-xl text-text-primary hover:text-accent transition-all"
          title={isAr ? "القائمة الجانبية ≡" : "Side Navigation ≡"}
          aria-label={isAr ? "فتح القائمة الجانبية" : "Open Side Navigation"}
        >
          <div className="relative flex flex-col items-center justify-center gap-0.5">
            <span className="block h-0.5 w-4 rounded-full bg-accent" />
            <span className="block h-0.5 w-3 rounded-full bg-accent" />
            <span className="block h-0.5 w-4 rounded-full bg-accent" />
          </div>
          <span className="text-[10px] tracking-wider leading-none mt-0.5 font-bold text-accent">
            {isAr ? "القائمة ≡" : "Menu ≡"}
          </span>
        </button>
      </nav>
    </div>
  );
}
