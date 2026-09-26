import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Palette, Sparkles, Truck } from "lucide-react";

import hero from "@/assets/hero-stellar.jpg";
import { ProductCard } from "@/components/site/ProductCard";
import { Star } from "@/components/site/Star";
import { categoriesQuery, productsQuery } from "@/lib/store";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Linora Stellar — Celestial printables, stationery & branding" },
      {
        name: "description",
        content:
          "Shop Linora Stellar: navy-and-gold printables, planners, invitations, classroom packs, branding and customisable merch.",
      },
      { property: "og:title", content: "Linora Stellar — Celestial design store" },
      {
        property: "og:description",
        content: "Printables, stationery, branding and merch under a starry navy-and-gold sky.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const { data: products = [] } = useQuery(productsQuery);
  const { data: categories = [] } = useQuery(categoriesQuery);
  const { t, pick } = useI18n();
  const featured = products.filter((p) => p.is_featured && p.is_active).slice(0, 6);

  return (
    <div>
      <section className="relative overflow-hidden">
        <img
          src={hero}
          alt={t("home.heroAlt")}
          width={1600}
          height={912}
          className="absolute inset-0 h-full w-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-r rtl:bg-gradient-to-l from-background via-background/80 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-28 lg:px-8 lg:py-40">
          <div className="max-w-2xl">
            <p className="flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-gold">
              <Star className="h-3 w-3" /> {t("home.eyebrow")}
            </p>
            <h1 className="mt-6 font-display text-5xl leading-[1.05] sm:text-6xl lg:text-7xl">
              {t("home.title1")}
              <span className="block text-gradient-gold">{t("home.title2")}</span>
            </h1>
            <p className="mt-6 max-w-lg text-base text-muted-foreground sm:text-lg">
              {t("home.lead")}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm uppercase tracking-[0.16em] text-primary-foreground transition-opacity hover:opacity-90"
              >
                {t("home.shop")} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </Link>
              <Link
                to="/custom-orders"
                className="inline-flex items-center gap-2 rounded-full border border-gold px-7 py-3 text-sm uppercase tracking-[0.16em] text-gold transition-colors hover:bg-accent"
              >
                {t("home.custom")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: Sparkles, title: t("home.f1.t"), text: t("home.f1.d") },
            { icon: Palette, title: t("home.f2.t"), text: t("home.f2.d") },
            { icon: Truck, title: t("home.f3.t"), text: t("home.f3.d") },
          ].map((f) => (
            <div key={f.title} className="card-star rounded-xl p-6">
              <f.icon className="h-5 w-5 text-gold" />
              <h3 className="mt-4 font-display text-xl">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gold">{t("home.featured")}</p>
            <h2 className="mt-2 font-display text-4xl">{t("home.bestsellers")}</h2>
          </div>
          <Link to="/shop" className="text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground">
            {t("home.viewAll")}
          </Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
        <p className="text-xs uppercase tracking-[0.3em] text-gold">{t("home.categories")}</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((c) => (
            <Link
              key={c.id}
              to="/shop"
              search={{ category: c.slug }}
              className="card-star rounded-xl p-5"
            >
              <Star className="h-4 w-4 text-gold" />
              <h3 className="mt-3 font-display text-lg">{pick(c, "name")}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{pick(c, "description")}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="starfield sky border-y border-border/60">
        <div className="relative mx-auto max-w-3xl px-4 py-20 text-center lg:px-8">
          <Star className="mx-auto h-6 w-6 text-gold" />
          <h2 className="mt-6 font-display text-4xl">{t("home.cta.t")}</h2>
          <p className="mt-4 text-muted-foreground">
            {t("home.cta.d")}
          </p>
          <Link
            to="/custom-orders"
            className="mt-8 inline-flex rounded-full bg-primary px-7 py-3 text-sm uppercase tracking-[0.16em] text-primary-foreground"
          >
            {t("home.cta.b")}
          </Link>
        </div>
      </section>
    </div>
  );
}
