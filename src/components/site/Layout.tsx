import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Heart, Menu, Search, ShoppingBag, Truck, UserRound, X } from "lucide-react";
import { useState, type ReactNode } from "react";

import { Star } from "@/components/site/Star";
import { ThemeSwitcher } from "@/components/site/ThemeSwitcher";
import { LanguageSwitcher } from "@/components/site/LanguageSwitcher";
import { SearchModal } from "@/components/site/SearchModal";
import { NewsletterSignup } from "@/components/site/NewsletterSignup";
import { useAuth } from "@/lib/auth";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import { CONTACT } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";

const NAV = [
  { to: "/shop", label: "nav.shop" },
  { to: "/story", label: "nav.story" },
  { to: "/portfolio", label: "nav.portfolio" },
  { to: "/custom-orders", label: "nav.custom" },
  { to: "/faq", label: "nav.faq" },
  { to: "/contact", label: "nav.contact" },
] as const;

export function SiteLayout({ children }: { children: ReactNode }) {
  const { count: cartCount } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { user, isOwner } = useAuth();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useI18n();

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 lg:px-8">
          <Link to="/" className="flex items-center gap-2">
            <Star className="h-5 w-5 text-gold" />
            <span className="font-display text-xl tracking-[0.2em] uppercase">Linora Stellar</span>
          </Link>

          <nav className="ms-auto hidden items-center gap-6 lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="whitespace-nowrap text-xs uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
                activeProps={{ className: "text-foreground" }}
              >
                {t(item.label)}
              </Link>
            ))}
          </nav>

          <div className="ms-auto flex items-center gap-2 lg:ms-4">
            {/* Quick Search Button */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-1.5 rounded-full border border-border p-2 sm:px-3 text-xs text-muted-foreground hover:border-gold hover:text-gold transition-colors"
              aria-label={t("nav.search")}
              title={t("search.shortcut")}
            >
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">{t("nav.search")}</span>
            </button>

            <LanguageSwitcher />

            <div className="hidden md:block">
              <ThemeSwitcher />
            </div>

            {/* Wishlist Icon */}
            <Link
              to="/wishlist"
              className="relative rounded-full border border-border p-2 transition-colors hover:border-gold hover:text-gold"
              aria-label={t("nav.wishlist")}
              title={t("nav.wishlist")}
            >
              <Heart className="h-4 w-4" />
              {wishlistCount > 0 && (
                <span className="absolute -end-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Shopping Cart Icon */}
            <Link
              to="/cart"
              className="relative rounded-full border border-border p-2 transition-colors hover:border-gold hover:text-gold"
              aria-label={t("nav.cart")}
              title={t("nav.cart")}
            >
              <ShoppingBag className="h-4 w-4" />
              {cartCount > 0 && (
                <span className="absolute -end-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Account Icon */}
            <Link
              to="/account"
              className="rounded-full border border-border p-2 transition-colors hover:border-gold"
              aria-label={t("nav.account")}
              title={t("nav.account")}
            >
              <UserRound className="h-4 w-4" />
            </Link>

            {!user && (
              <Link
                to="/auth"
                className="whitespace-nowrap rounded-full border border-gold px-3 py-1.5 text-xs uppercase tracking-[0.16em] text-gold transition-colors hover:bg-primary hover:text-primary-foreground hidden sm:inline-block"
              >
                {t("nav.signin")}
              </Link>
            )}

            <button
              type="button"
              className="rounded-full border border-border p-2 lg:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label={t("nav.menu")}
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {open && (
          <div className="border-t border-border/60 px-4 py-4 lg:hidden bg-background">
            <div className="flex flex-col gap-3">
              {NAV.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="text-sm uppercase tracking-[0.18em] text-muted-foreground"
                >
                  {t(item.label)}
                </Link>
              ))}

              <div className="border-t border-border/60 pt-3 flex flex-col gap-2.5">
                <Link
                  to="/wishlist"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 text-sm uppercase tracking-[0.18em] text-muted-foreground hover:text-gold"
                >
                  <Heart className="h-4 w-4 text-rose-400" />
                  <span>
                    {t("nav.wishlist")} {wishlistCount > 0 && `(${wishlistCount})`}
                  </span>
                </Link>

                <Link
                  to="/track"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 text-sm uppercase tracking-[0.18em] text-muted-foreground hover:text-gold"
                >
                  <Truck className="h-4 w-4 text-gold" />
                  <span>{t("nav.track")}</span>
                </Link>

                <Link
                  to="/account"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 text-sm uppercase tracking-[0.18em] text-gold font-medium"
                >
                  <UserRound className="h-4 w-4" />
                  <span>{t("nav.account")}</span>
                </Link>
              </div>

              {user && (
                <button
                  type="button"
                  onClick={signOut}
                  className="text-start text-sm uppercase tracking-[0.18em] text-rose-400 pt-1"
                >
                  {t("nav.signout")}
                </button>
              )}

              <div className="pt-2 flex items-center justify-between border-t border-border/60">
                <span className="text-xs text-muted-foreground">Theme</span>
                <ThemeSwitcher />
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Global Instant Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      <main className="flex-1">{children}</main>

      <footer className="starfield mt-20 border-t border-border/60 sky">
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 lg:grid-cols-4 lg:px-8">
          <div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-gold" />
              <span className="font-display text-lg uppercase tracking-[0.2em]">
                Linora Stellar
              </span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">{t("footer.tagline")}</p>
            <div className="mt-6">
              <NewsletterSignup variant="compact" />
            </div>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-gold">{t("footer.explore")}</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {NAV.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="hover:text-foreground">
                    {t(item.label)}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/wishlist" className="hover:text-foreground flex items-center gap-1.5">
                  <Heart className="h-3 w-3 text-rose-400" />
                  <span>{t("nav.wishlist")}</span>
                </Link>
              </li>
              <li>
                <Link to="/track" className="hover:text-foreground flex items-center gap-1.5">
                  <Truck className="h-3 w-3 text-gold" />
                  <span>{t("nav.track")}</span>
                </Link>
              </li>
              <li>
                <Link to="/account" className="hover:text-foreground">
                  {t("nav.account")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-gold">{t("footer.contact")}</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <a href={CONTACT.whatsappLink} className="hover:text-foreground">
                  WhatsApp {CONTACT.whatsapp}
                </a>
              </li>
              <li>
                <a href={`mailto:${CONTACT.email}`} className="hover:text-foreground">
                  {CONTACT.email}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-gold">{t("footer.follow")}</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <a href={CONTACT.instagram} className="hover:text-foreground">
                  Instagram
                </a>
              </li>
              <li>
                <a href={CONTACT.behance} className="hover:text-foreground">
                  Behance
                </a>
              </li>
              <li>
                <a href={CONTACT.linkedin} className="hover:text-foreground">
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/60 px-4 py-5 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Linora Stellar. {t("footer.rights")}
        </div>
      </footer>
    </div>
  );
}
