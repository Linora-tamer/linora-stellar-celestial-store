import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Menu, ShoppingBag, UserRound, X } from "lucide-react";
import { useState, type ReactNode } from "react";

import { Star } from "@/components/site/Star";
import { ThemeSwitcher } from "@/components/site/ThemeSwitcher";
import { useAuth } from "@/lib/auth";
import { useCart } from "@/lib/cart";
import { CONTACT } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/site/LanguageSwitcher";
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
  const { count } = useCart();
  const { user, isOwner } = useAuth();
  const [open, setOpen] = useState(false);
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
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-md">
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
            <LanguageSwitcher />
            <div className="hidden md:block">
              <ThemeSwitcher />
            </div>
            <Link
              to="/cart"
              className="relative rounded-full border border-border p-2 transition-colors hover:border-gold"
              aria-label={t("nav.cart")}
            >
              <ShoppingBag className="h-4 w-4" />
              {count > 0 && (
                <span className="absolute -end-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                  {count}
                </span>
              )}
            </Link>
            {user ? (
              <Link
                to={isOwner ? "/admin" : "/account"}
                className="rounded-full border border-border p-2 transition-colors hover:border-gold"
                aria-label={t("nav.account")}
              >
                <UserRound className="h-4 w-4" />
              </Link>
            ) : (
              <Link
                to="/auth"
                className="whitespace-nowrap rounded-full border border-gold px-3 py-1.5 text-xs uppercase tracking-[0.16em] text-gold transition-colors hover:bg-primary hover:text-primary-foreground"
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

        {open && (
          <div className="border-t border-border/60 px-4 py-4 lg:hidden">
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
              {user && (
                <button
                  type="button"
                  onClick={signOut}
                  className="text-start text-sm uppercase tracking-[0.18em] text-muted-foreground"
                >
                  {t("nav.signout")}
                </button>
              )}
              <div className="pt-2">
                <ThemeSwitcher />
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="starfield mt-20 border-t border-border/60 sky">
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 lg:grid-cols-4 lg:px-8">
          <div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-gold" />
              <span className="font-display text-lg uppercase tracking-[0.2em]">Linora Stellar</span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              {t("footer.tagline")}
            </p>
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
