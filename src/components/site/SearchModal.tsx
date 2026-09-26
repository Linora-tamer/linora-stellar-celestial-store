import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Search as SearchIcon, X, ArrowRight, Sparkles, Tag } from "lucide-react";
import { productsQuery, categoriesQuery, type Product } from "@/lib/store";
import { formatPrice } from "@/lib/cart";
import { productImage } from "@/lib/product-images";
import { useI18n } from "@/lib/i18n";

type SearchModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { t, pick, lang } = useI18n();
  const isAr = lang === "ar";

  const { data: products = [] } = useQuery(productsQuery);
  const { data: categories = [] } = useQuery(categoriesQuery);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent handles toggle
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const trimmed = query.trim().toLowerCase();

  const matchingProducts = trimmed
    ? products.filter((p) => {
        if (!p.is_active) return false;
        const nameEn = p.name?.toLowerCase() || "";
        const nameAr = p.name_ar?.toLowerCase() || "";
        const taglineEn = p.tagline?.toLowerCase() || "";
        const taglineAr = p.tagline_ar?.toLowerCase() || "";
        const descEn = p.description?.toLowerCase() || "";
        const descAr = p.description_ar?.toLowerCase() || "";

        const category = categories.find((c) => c.id === p.category_id);
        const catNameEn = category?.name?.toLowerCase() || "";
        const catNameAr = category?.name_ar?.toLowerCase() || "";

        return (
          nameEn.includes(trimmed) ||
          nameAr.includes(trimmed) ||
          taglineEn.includes(trimmed) ||
          taglineAr.includes(trimmed) ||
          descEn.includes(trimmed) ||
          descAr.includes(trimmed) ||
          catNameEn.includes(trimmed) ||
          catNameAr.includes(trimmed)
        );
      })
    : [];

  const quickPicks = [
    { label: isAr ? "مخططات فلكية" : "Planners", q: "planner" },
    { label: isAr ? "دعوات زفاف" : "Wedding", q: "wedding" },
    { label: isAr ? "تيشيرت النجوم" : "T-Shirt", q: "t-shirt" },
    { label: isAr ? "هوية بصرية" : "Branding", q: "branding" },
    { label: isAr ? "فصول ومدرسة" : "Classroom", q: "classroom" },
  ];

  function handleSelectProduct(slug: string) {
    onClose();
    navigate({ to: "/shop/$slug", params: { slug } });
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!trimmed) return;
    onClose();
    navigate({ to: "/shop", search: { q: trimmed } });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 md:p-20">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-gold/40 bg-card shadow-2xl transition-all">
        {/* Search input header */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex items-center gap-3 border-b border-border/80 px-4 py-3.5 sm:px-6"
        >
          <SearchIcon className="h-5 w-5 text-gold shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("search.placeholder")}
            className="flex-1 bg-transparent text-base text-foreground placeholder:text-muted-foreground outline-none"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="rounded-full p-1 text-muted-foreground hover:text-foreground"
              aria-label={t("search.clear")}
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <span className="hidden sm:inline-block rounded border border-border px-1.5 py-0.5 text-[10px] uppercase font-mono text-muted-foreground">
              ESC
            </span>
          )}
        </form>

        {/* Content Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-6 space-y-4">
          {trimmed ? (
            matchingProducts.length > 0 ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground pb-1">
                  <span>
                    {isAr
                      ? `${matchingProducts.length} قطعة متطابقة:`
                      : `${matchingProducts.length} matching pieces:`}
                  </span>
                  <button
                    type="button"
                    onClick={handleSearchSubmit}
                    className="text-gold hover:underline flex items-center gap-1 font-medium"
                  >
                    <span>{t("search.viewAll")}</span>
                    <ArrowRight className="h-3 w-3 rtl:rotate-180" />
                  </button>
                </div>

                <div className="divide-y divide-border/60">
                  {matchingProducts.map((p) => {
                    const name = pick(p, "name");
                    const tagline = pick(p, "tagline");
                    const category = categories.find((c) => c.id === p.category_id);

                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleSelectProduct(p.slug)}
                        className="group flex w-full items-center gap-4 py-3 text-start hover:bg-muted/40 rounded-xl px-2.5 transition-colors"
                      >
                        <img
                          src={productImage(p.slug, p.image_url)}
                          alt={name}
                          className="h-14 w-14 rounded-lg object-cover shrink-0 border border-border"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-display text-base font-medium text-foreground group-hover:text-gold truncate transition-colors">
                            {name}
                          </h4>
                          <p className="text-xs text-muted-foreground truncate">{tagline}</p>
                          {category && (
                            <span className="inline-flex items-center gap-1 text-[11px] text-gold/80 mt-0.5">
                              <Tag className="h-2.5 w-2.5" />
                              {pick(category, "name")}
                            </span>
                          )}
                        </div>
                        <span className="text-sm font-semibold text-gold shrink-0">
                          {formatPrice(p.price, lang)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="py-12 text-center">
                <Sparkles className="mx-auto h-8 w-8 text-gold/50" />
                <p className="mt-3 text-sm text-muted-foreground">
                  {t("search.noResults")} <span className="font-semibold text-gold">"{query}"</span>
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  {quickPicks.map((pickItem) => (
                    <button
                      key={pickItem.q}
                      type="button"
                      onClick={() => setQuery(pickItem.q)}
                      className="rounded-full border border-border px-3 py-1 text-xs hover:border-gold hover:text-gold transition-colors"
                    >
                      {pickItem.label}
                    </button>
                  ))}
                </div>
              </div>
            )
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2.5">
                  {isAr ? "اقتراحات سريعة" : "Popular Searches"}
                </p>
                <div className="flex flex-wrap gap-2">
                  {quickPicks.map((pickItem) => (
                    <button
                      key={pickItem.q}
                      type="button"
                      onClick={() => setQuery(pickItem.q)}
                      className="rounded-full border border-border bg-card px-3.5 py-1.5 text-xs text-foreground hover:border-gold hover:text-gold transition-colors"
                    >
                      {pickItem.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-border/60">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
                  {isAr ? "الأقسام المميزة" : "Browse by Category"}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {categories.slice(0, 6).map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        onClose();
                        navigate({ to: "/shop", search: { category: c.slug } });
                      }}
                      className="flex items-center justify-between rounded-lg border border-border/80 p-2.5 text-start text-xs hover:border-gold hover:text-gold transition-colors"
                    >
                      <span className="truncate">{pick(c, "name")}</span>
                      <ArrowRight className="h-3 w-3 shrink-0 text-muted-foreground rtl:rotate-180" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
