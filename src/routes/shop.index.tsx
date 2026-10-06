import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useMemo } from "react";
import {
  Search,
  X,
  Sparkles,
  ArrowUpDown,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { ProductCard } from "@/components/site/ProductCard";
import { categoriesQuery, productsQuery } from "@/lib/store";
import { useI18n } from "@/lib/i18n";

type ShopSearch = {
  category?: string | undefined;
  q?: string | undefined;
  sort?: string | undefined;
  page?: number | undefined;
};

export const Route = createFileRoute("/shop/")({
  validateSearch: (search: Record<string, unknown>): ShopSearch => ({
    category: typeof search["category"] === "string" ? search["category"] : undefined,
    q: typeof search["q"] === "string" ? search["q"] : undefined,
    sort: typeof search["sort"] === "string" ? search["sort"] : undefined,
    page: typeof search["page"] === "number" ? search["page"] : Number(search["page"]) || undefined,
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
  const { category, q, sort, page } = Route.useSearch();
  const navigate = useNavigate();
  const { data: products = [], isLoading } = useQuery(productsQuery);
  const { data: categories = [] } = useQuery(categoriesQuery);
  const { t, pick, lang } = useI18n();
  const isAr = lang === "ar";

  const [searchTerm, setSearchTerm] = useState(q || "");
  const [sortBy, setSortBy] = useState<string>(sort || "featured");
  const currentPage = Math.max(1, Number(page) || 1);
  const ITEMS_PER_PAGE = 6;

  useEffect(() => {
    setSearchTerm(q || "");
  }, [q]);

  useEffect(() => {
    if (sort) setSortBy(sort);
  }, [sort]);

  const activeCategory = categories.find((c) => c.slug === category);
  const trimmedSearch = (q || searchTerm).trim().toLowerCase();

  // Category product counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: 0 };
    products.forEach((p) => {
      if (!p.is_active) return;
      counts["all"] = (counts["all"] ?? 0) + 1;
      if (p.category_id) {
        counts[p.category_id] = (counts[p.category_id] ?? 0) + 1;
      }
    });
    return counts;
  }, [products]);

  // Filtered & Sorted list
  const list = useMemo(() => {
    let result = products.filter((p) => {
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

    // Sorting
    if (sortBy === "price-asc") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sortBy === "name") {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // featured / sort_order
      result = [...result].sort(
        (a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0) || a.sort_order - b.sort_order,
      );
    }

    return result;
  }, [products, activeCategory, trimmedSearch, sortBy]);

  const totalPages = Math.max(1, Math.ceil(list.length / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const paginatedList = list.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  function goToPage(nextPage: number) {
    navigate({
      to: "/shop",
      search: {
        category,
        q: searchTerm.trim() || undefined,
        sort: sortBy !== "featured" ? sortBy : undefined,
        page: nextPage > 1 ? nextPage : undefined,
      },
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    navigate({
      to: "/shop",
      search: {
        category,
        q: searchTerm.trim() || undefined,
        sort: sortBy !== "featured" ? sortBy : undefined,
        page: undefined,
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
        sort: sortBy !== "featured" ? sortBy : undefined,
        page: undefined,
      },
    });
  }

  function handleSortChange(newSort: string) {
    setSortBy(newSort);
    navigate({
      to: "/shop",
      search: {
        category,
        q: searchTerm.trim() || undefined,
        sort: newSort !== "featured" ? newSort : undefined,
        page: undefined,
      },
    });
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
      {/* Header & Search */}
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

        {/* Live Search & Sort Toolbar */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Live Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-72">
            <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                navigate({
                  to: "/shop",
                  search: {
                    category,
                    q: e.target.value.trim() || undefined,
                    sort: sortBy !== "featured" ? sortBy : undefined,
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

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="rounded-full border border-border bg-card/80 px-4 py-2.5 text-xs text-foreground outline-none focus:border-gold cursor-pointer"
            >
              <option value="featured">{isAr ? "المميز أولاً" : "Featured"}</option>
              <option value="price-asc">
                {isAr ? "السعر: من الأقل للأعلى" : "Price: Low to High"}
              </option>
              <option value="price-desc">
                {isAr ? "السعر: من الأعلى للأقل" : "Price: High to Low"}
              </option>
              <option value="name">{isAr ? "أبجدياً (A-Z)" : "Alphabetical"}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Categories Pills with Counts */}
      <div className="mt-8 flex flex-wrap items-center gap-2">
        <Link
          to="/shop"
          search={{ q, sort: sortBy !== "featured" ? sortBy : undefined }}
          className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-xs uppercase tracking-[0.16em] transition-all ${
            !category
              ? "border-gold bg-primary text-primary-foreground font-semibold shadow-xs"
              : "border-border text-muted-foreground hover:text-foreground hover:border-gold/50"
          }`}
        >
          <span>{t("shop.all")}</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full ${!category ? "bg-gold/25 text-gold" : "bg-muted text-muted-foreground"}`}
          >
            {categoryCounts["all"] ?? products.length}
          </span>
        </Link>

        {categories.map((c) => {
          const isSelected = category === c.slug;
          const count = categoryCounts[c.id] ?? 0;

          return (
            <Link
              key={c.id}
              to="/shop"
              search={{ category: c.slug, q, sort: sortBy !== "featured" ? sortBy : undefined }}
              className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-xs uppercase tracking-[0.16em] transition-all ${
                isSelected
                  ? "border-gold bg-primary text-primary-foreground font-semibold shadow-xs"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-gold/50"
              }`}
            >
              <span>{pick(c, "name")}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? "bg-gold/25 text-gold" : "bg-muted text-muted-foreground"}`}
              >
                {count}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Active Search & Filter Indicator Bar */}
      {(trimmedSearch || category) && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/60 bg-card/40 px-4 py-2.5 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-gold" />
            <span>
              {isAr
                ? `عرض ${list.length} من أصل ${products.length} قطعة`
                : `Showing ${list.length} of ${products.length} celestial pieces`}
              {trimmedSearch && ` ${isAr ? "لكلمة:" : "for"} "${trimmedSearch}"`}
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              setSearchTerm("");
              navigate({ to: "/shop" });
            }}
            className="text-gold underline hover:text-foreground font-medium"
          >
            {isAr ? "إعادة تعيين الفلاتر" : "Reset all filters"}
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
        <>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedList.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border/70 pt-6">
              <p className="text-xs text-muted-foreground">
                {isAr
                  ? `عرض ${startIndex + 1} إلى ${Math.min(startIndex + ITEMS_PER_PAGE, list.length)} من أصل ${list.length} قطعة`
                  : `Showing ${startIndex + 1}–${Math.min(startIndex + ITEMS_PER_PAGE, list.length)} of ${list.length} pieces`}
              </p>

              <div className="flex items-center gap-1.5">
                {/* Previous Page Button */}
                <button
                  type="button"
                  onClick={() => goToPage(safeCurrentPage - 1)}
                  disabled={safeCurrentPage <= 1}
                  className="flex h-9 items-center gap-1 rounded-full border border-border px-3 text-xs uppercase tracking-wider text-muted-foreground transition-all hover:border-gold hover:text-foreground disabled:opacity-40 disabled:pointer-events-none"
                  aria-label="Previous Page"
                >
                  <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
                  <span className="hidden sm:inline">{isAr ? "السابق" : "Prev"}</span>
                </button>

                {/* Page Number Pills */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => goToPage(pageNum)}
                    className={`h-9 w-9 rounded-full text-xs font-semibold transition-all ${
                      safeCurrentPage === pageNum
                        ? "bg-gold text-background shadow-xs font-bold"
                        : "border border-border text-muted-foreground hover:border-gold hover:text-foreground"
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

                {/* Next Page Button */}
                <button
                  type="button"
                  onClick={() => goToPage(safeCurrentPage + 1)}
                  disabled={safeCurrentPage >= totalPages}
                  className="flex h-9 items-center gap-1 rounded-full border border-border px-3 text-xs uppercase tracking-wider text-muted-foreground transition-all hover:border-gold hover:text-foreground disabled:opacity-40 disabled:pointer-events-none"
                  aria-label="Next Page"
                >
                  <span className="hidden sm:inline">{isAr ? "التالي" : "Next"}</span>
                  <ChevronRight className="h-4 w-4 rtl:rotate-180" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
