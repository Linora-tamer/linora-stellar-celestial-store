import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { ProductCard } from "@/components/site/ProductCard";
import { categoriesQuery, productsQuery } from "@/lib/store";
import { useI18n } from "@/lib/i18n";

type ShopSearch = { category?: string | undefined };

export const Route = createFileRoute("/shop/")({
  validateSearch: (search: Record<string, unknown>): ShopSearch => ({
    category: typeof search['category'] === "string" ? search['category'] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Shop — Linora Stellar" },
      {
        name: "description",
        content:
          "Browse the full Linora Stellar catalog: digital downloads, print and paper, kids and classroom, branding services and customisable merch.",
      },
      { property: "og:title", content: "Shop — Linora Stellar" },
      { property: "og:description", content: "The full celestial catalog, in navy and gold." },
    ],
  }),
  component: Shop,
});

function Shop() {
  const { category } = Route.useSearch();
  const { data: products = [], isLoading } = useQuery(productsQuery);
  const { data: categories = [] } = useQuery(categoriesQuery);
  const { t, pick } = useI18n();

  const active = categories.find((c) => c.slug === category);
  const list = products
    .filter((p) => p.is_active)
    .filter((p) => (active ? p.category_id === active.id : true));

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
      <p className="text-xs uppercase tracking-[0.3em] text-gold">{t("shop.eyebrow")}</p>
      <h1 className="mt-2 font-display text-5xl">{active ? pick(active, "name") : t("shop.title")}</h1>
      <p className="mt-3 max-w-xl text-sm text-muted-foreground">
        {active ? pick(active, "description") : t("shop.lead")}
      </p>

      <div className="mt-8 flex flex-wrap gap-2">
        <Link
          to="/shop"
          search={{}}
          className={`rounded-full border px-4 py-1.5 text-xs uppercase tracking-[0.16em] transition-colors ${
            !category ? "border-gold bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          {t("shop.all")}
        </Link>
        {categories.map((c) => (
          <Link
            key={c.id}
            to="/shop"
            search={{ category: c.slug }}
            className={`rounded-full border px-4 py-1.5 text-xs uppercase tracking-[0.16em] transition-colors ${
              category === c.slug
                ? "border-gold bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {pick(c, "name")}
          </Link>
        ))}
      </div>

      {isLoading ? (
        <p className="mt-12 text-sm text-muted-foreground">{t("shop.loading")}</p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
