import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Search, X, Sparkles } from "lucide-react";

import { ProductCard } from "@/components/site/ProductCard";
import { categoriesQuery, productsQuery } from "@/lib/store";
import { useI18n } from "@/lib/i18n";

type ShopSearch = {
  category?: string | undefined;
  q?: string | undefined;
};

export const Route = createFileRoute("/shop/")({
  validateSearch: (search: Record<string, unknown>): ShopSearch => ({
    category: typeof search["category"] === "string" ? search["category"] : undefined,
    q: typeof search["q"] === "string" ? search["q"] : undefined,
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
  const { category, q } = Route.useSearch();
  const navigate = useNavigate();
  const { data: products = [], isLoading } = useQuery(productsQuery);
  const { data: categories = [] } = useQuery(categoriesQuery);
  const { t, pick, lang } = useI18n();
  const isAr = lang === "ar";

  const [searchTerm, setSearchTerm] = useState(q || "");

  useEffect(() => {
    setSearchTerm(q || "");
  }, [q]);

  const activeCategory = categories.find((c) => c.slug === category);

  const trimmedSearch = (q || searchTerm).trim().toLowerCase();

  const list = products.filter((p) => {
    if (!p.is_active) return false;

    // Filter by category if selected
    if (activeCategory && p.category_id !== activeCategory.id) {
      return false;
    }

    // Filter by search query if typed
    if (trimmedSearch) {
      const nameEn = p.name?.toLowerCase() || "";
      const nameAr = p.name_ar?.toLowerCase() || "";
      const taglineEn = p.tagline?.toLowerCase() || "";
      const taglineAr = p.tagline_ar?.toLowerCase() || "";
      const descEn = p.description?.toLowerCase() || "";
      const descAr = p.description_ar?.toLowerCase() || "";

      const match =
        nameEn.includes(trimmedSearch) ||
        nameAr.includes(trimmedSearch) ||
        taglineEn.includes(trimmedSearch) ||
        taglineAr.includes(trimmedSearch) ||
        descEn.includes(trimmedSearch) ||
        descAr.includes(trimmedSearch);

      if (!match) return false;
    }

    return true;
  });

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    navigate({
      to: "/shop",
      search: {
        category,
        q: searchTerm.trim() || undefined,
      },
    });
  }

  function handleClearSearch() {
    setSearchTerm("");
    navigate({
      to: "/shop",
      search: {
        category,
        q: undefined,
      },
    });
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gold">{t("shop.eyebrow")}</p>
          <h1 className="mt-2 font-display text-5xl">
            {activeCategory ? pick(activeCategory, "name") : t("shop.title")}
          </h1>
          <p className="mt-3 max-w-xl text-sm text-muted-foreground">
            {activeCategory ? pick(activeCategory, "description") : t("shop.lead")}
          </p>
        </div>

        {/* Live Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-72">
          <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              // live search as user types
              navigate({
                to: "/shop",
                search: {
                  category,
                  q: e.target.value.trim() || undefined,
                },
              });
            }}
            placeholder={t("search.placeholder")}
            className="w-full rounded-full border border-border bg-card/80 ps-10 pe-9 py-2.5 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-gold transition-colors"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={t("search.clear")}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </form>
      </div>

      {/* Category Pills */}
      <div className="mt-8 flex flex-wrap items-center gap-2">
        <Link
          to="/shop"
          search={{ q }}
          className={`rounded-full border px-4 py-1.5 text-xs uppercase tracking-[0.16em] transition-colors ${
            !category
              ? "border-gold bg-primary text-primary-foreground font-medium"
              : "border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          {t("shop.all")}
        </Link>
        {categories.map((c) => (
          <Link
            key={c.id}
            to="/shop"
            search={{ category: c.slug, q }}
            className={`rounded-full border px-4 py-1.5 text-xs uppercase tracking-[0.16em] transition-colors ${
              category === c.slug
                ? "border-gold bg-primary text-primary-foreground font-medium"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {pick(c, "name")}
          </Link>
        ))}
      </div>

      {/* Active Search / Filter Indicator */}
      {trimmedSearch && (
        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          <span>
            {isAr
              ? `عرض نتائج البحث عن: "${trimmedSearch}" (${list.length} قطعة)`
              : `Showing results for: "${trimmedSearch}" (${list.length} pieces)`}
          </span>
          <button
            type="button"
            onClick={handleClearSearch}
            className="text-gold underline hover:text-foreground font-medium"
          >
            {isAr ? "إلغاء البحث" : "Clear search"}
          </button>
        </div>
      )}

      {/* Catalog Grid */}
      {isLoading ? (
        <p className="mt-12 text-sm text-muted-foreground">{t("shop.loading")}</p>
      ) : list.length === 0 ? (
        <div className="card-star rounded-2xl border border-border p-12 text-center mt-10 max-w-lg mx-auto">
          <Sparkles className="mx-auto h-8 w-8 text-gold/60 mb-2" />
          <p className="font-display text-xl">{t("shop.empty")}</p>
          <p className="text-xs text-muted-foreground mt-2">
            {isAr
              ? "جربي البحث بكلمات أخرى أو تصفح جميع الأقسام."
              : "Try searching with different keywords or browse all categories."}
          </p>
          <button
            type="button"
            onClick={handleClearSearch}
            className="mt-5 rounded-full border border-gold px-5 py-2 text-xs uppercase tracking-[0.14em] text-gold hover:bg-gold/10"
          >
            {t("shop.all")}
          </button>
        </div>
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
