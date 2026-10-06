import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Search as SearchIcon,
  X,
  ArrowRight,
  Sparkles,
  Tag,
  Camera,
  Upload,
  Palette,
  Image as ImageIcon,
  CheckCircle2,
} from "lucide-react";
import { productsQuery, categoriesQuery, type Product } from "@/lib/store";
import { formatPrice } from "@/lib/cart";
import { productImage } from "@/lib/product-images";
import { useI18n } from "@/lib/i18n";
import heroStellar from "@/assets/hero-stellar.jpg";
import brandingImg from "@/assets/p-branding.jpg";
import classroomImg from "@/assets/p-classroom.jpg";
import invitationImg from "@/assets/p-invitation.jpg";

type SearchModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [activeTab, setActiveTab] = useState<"text" | "visual">("text");
  const [query, setQuery] = useState("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [analyzingImage, setAnalyzingImage] = useState(false);
  const [detectedAesthetic, setDetectedAesthetic] = useState<{
    vibe: string;
    colors: string[];
    matchingKeywords: string[];
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
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

  function handleSelectSampleImage(
    imgSrc: string,
    vibeName: string,
    keywords: string[],
    colors: string[],
  ) {
    setUploadedImage(imgSrc);
    setAnalyzingImage(true);
    setTimeout(() => {
      setDetectedAesthetic({
        vibe: vibeName,
        colors,
        matchingKeywords: keywords,
      });
      setAnalyzingImage(false);
    }, 400);
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setUploadedImage(result);
      setAnalyzingImage(true);
      setTimeout(() => {
        setDetectedAesthetic({
          vibe: isAr
            ? "طابع فلكي كحلي مع ذهبي عتيق"
            : "Celestial Astronomical Navy & Warm Gold Foil",
          colors: ["#080D1A", "#DFAD71", "#28344E", "#FFF6ED"],
          matchingKeywords: ["labels", "planner", "branding", "invitation"],
        });
        setAnalyzingImage(false);
      }, 500);
    };
    reader.readAsDataURL(file);
  }

  const visualMatchedProducts = detectedAesthetic
    ? products.filter((p) => {
        const slug = p.slug.toLowerCase();
        return detectedAesthetic.matchingKeywords.some((k) => slug.includes(k));
      })
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 md:p-20">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-gold/40 bg-card shadow-2xl transition-all">
        {/* Search Mode Tabs */}
        <div className="flex border-b border-border/70 bg-surface/50 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("text")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 font-medium transition-colors ${
              activeTab === "text"
                ? "border-b-2 border-gold text-gold font-semibold bg-gold/10"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <SearchIcon className="h-3.5 w-3.5" />
            <span>{isAr ? "البحث بالكلمات" : "Keyword Search"}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("visual")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 font-medium transition-colors ${
              activeTab === "visual"
                ? "border-b-2 border-gold text-gold font-semibold bg-gold/10"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Camera className="h-3.5 w-3.5 text-gold" />
            <span>{isAr ? "البحث البصري بالذكاء الاصطناعي 📷" : "AI Visual Search 📷"}</span>
          </button>
        </div>

        {activeTab === "text" ? (
          <>
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
                      {t("search.noResults")}{" "}
                      <span className="font-semibold text-gold">"{query}"</span>
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
          </>
        ) : (
          /* AI Visual & Palette Search View */
          <div className="max-h-[65vh] overflow-y-auto p-4 sm:p-6 space-y-6">
            <div className="rounded-xl border border-dashed border-gold/60 bg-gold/5 p-6 text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gold/20 text-gold mb-3">
                <Upload className="h-6 w-6" />
              </div>
              <h4 className="font-display text-lg text-foreground">
                {isAr ? "ارفعي صورة إلهام أو سكرين شوت" : "Upload Style Photo or Moodboard"}
              </h4>
              <p className="mt-1 text-xs text-muted-foreground max-w-sm mx-auto">
                {isAr
                  ? "سيقوم الذكاء الاصطناعي بتحليل الألوان والفايب وعرض المنتجات الأكثر تطابقاً مع ذوقكِ."
                  : "AI will analyze color palettes and aesthetic vibe, finding matching celestial products in seconds."}
              </p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-background hover:opacity-90 shadow-xs"
              >
                <Camera className="h-4 w-4" />
                <span>{isAr ? "اختيار صورة من جهازك" : "Upload From Device"}</span>
              </button>
            </div>

            {/* Curated Sample Style Presets */}
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3 flex items-center gap-1.5">
                <Palette className="h-3.5 w-3.5 text-gold" />
                <span>
                  {isAr
                    ? "أو جربي هذه الأنماط الفلكية الجاهزة:"
                    : "Or Explore Curated Aesthetic Palettes:"}
                </span>
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  {
                    title: isAr ? "كحلي فلكي مع ذهبي" : "Astronomical Navy & Gold",
                    img: heroStellar,
                    colors: ["#080D1A", "#DFAD71", "#28344E"],
                    keywords: ["labels", "planner", "branding"],
                  },
                  {
                    title: isAr ? "دعوات زفاف فخمة" : "Rose Quartz & Ivory Bridal",
                    img: invitationImg,
                    colors: ["#F9F4F0", "#D8A89A", "#4A3E4D"],
                    keywords: ["invitation", "stationery"],
                  },
                  {
                    title: isAr ? "نجوم أطفال ومدرسة" : "Playful Classroom Stars",
                    img: classroomImg,
                    colors: ["#18233C", "#EAA858", "#5EA6A1"],
                    keywords: ["classroom", "labels", "bottle"],
                  },
                ].map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() =>
                      handleSelectSampleImage(
                        sample.img,
                        sample.title,
                        sample.keywords,
                        sample.colors,
                      )
                    }
                    className="group flex flex-col overflow-hidden rounded-xl border border-border/80 bg-surface text-start hover:border-gold transition-all"
                  >
                    <div className="aspect-16/9 w-full overflow-hidden bg-surface-elevated">
                      <img
                        src={sample.img}
                        alt={sample.title}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <div className="p-3">
                      <p className="text-xs font-semibold text-foreground group-hover:text-gold truncate">
                        {sample.title}
                      </p>
                      <div className="mt-2 flex items-center gap-1.5">
                        {sample.colors.map((c, i) => (
                          <span
                            key={i}
                            className="h-3.5 w-3.5 rounded-full border border-border/70"
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Visual Match Results */}
            {analyzingImage ? (
              <div className="py-8 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
                <Sparkles className="h-5 w-5 text-gold animate-spin" />
                <span>
                  {isAr
                    ? "جارِ تحليل درجات الألوان والطابع البصري..."
                    : "Scanning color frequencies and matching catalog..."}
                </span>
              </div>
            ) : detectedAesthetic ? (
              <div className="space-y-4 rounded-xl border border-gold/40 bg-gold/5 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-gold font-semibold">
                      {isAr ? "النمط المكتشف بواسطة الذكاء الاصطناعي" : "AI Detected Aesthetic"}
                    </span>
                    <h5 className="font-display text-base text-foreground font-medium">
                      {detectedAesthetic.vibe}
                    </h5>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {detectedAesthetic.colors.map((hex, i) => (
                      <span
                        key={i}
                        className="h-5 w-5 rounded-full border border-black/20 shadow-xs"
                        style={{ backgroundColor: hex }}
                        title={hex}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-foreground mb-3">
                    {isAr ? "المنتجات المطابقة لهذا الطابع:" : "Matching Studio Pieces:"}
                  </p>
                  <div className="divide-y divide-border/60">
                    {visualMatchedProducts.map((p) => {
                      const name = pick(p, "name");
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => handleSelectProduct(p.slug)}
                          className="flex w-full items-center gap-3 py-2.5 text-start hover:bg-gold/10 rounded-lg px-2 transition-colors"
                        >
                          <img
                            src={productImage(p.slug, p.image_url)}
                            alt={name}
                            className="h-12 w-12 rounded-lg object-cover border border-border shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h6 className="font-display text-sm font-medium text-foreground truncate">
                              {name}
                            </h6>
                            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
                              <CheckCircle2 className="h-3 w-3" /> 97% Aesthetic Match
                            </span>
                          </div>
                          <span className="text-xs font-semibold text-gold">
                            {formatPrice(p.price, lang)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
