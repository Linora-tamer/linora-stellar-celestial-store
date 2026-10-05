import { useState, useRef } from "react";
import {
  Sparkles,
  BookOpen,
  Coffee,
  Shirt,
  Stamp,
  Palette,
  Briefcase,
  Layers,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";

export interface CategoryItem {
  id: string;
  slug: string;
  nameEn: string;
  nameAr: string;
  icon: React.ElementType;
}

export const CATEGORIES_LIST: CategoryItem[] = [
  { id: "all", slug: "all", nameEn: "All Creations", nameAr: "جميع الإبداعات", icon: Sparkles },
  {
    id: "planners",
    slug: "stationery",
    nameEn: "Printable Planners",
    nameAr: "مخططات وبلانرز",
    icon: BookOpen,
  },
  {
    id: "stickers",
    slug: "stickers",
    nameEn: "Custom Stickers",
    nameAr: "استيكرات لاصقة",
    icon: Stamp,
  },
  {
    id: "mugs",
    slug: "custom-print",
    nameEn: "POD Mugs & Glassware",
    nameAr: "مجات وأكواب مطبوعة",
    icon: Coffee,
  },
  {
    id: "apparel",
    slug: "apparel",
    nameEn: "Apparel & Totes",
    nameAr: "تيشيرتات وحقائب توت",
    icon: Shirt,
  },
  {
    id: "branding",
    slug: "graphic-design",
    nameEn: "Branding Kits & Identity",
    nameAr: "هويات بصرية ولوجو",
    icon: Palette,
  },
  {
    id: "classroom",
    slug: "classroom",
    nameEn: "Study & Classroom Prints",
    nameAr: "مطبوعات دراسية وتعليمية",
    icon: Briefcase,
  },
  {
    id: "digital",
    slug: "digital-art",
    nameEn: "Digital Art & Wall Decor",
    nameAr: "لوحات جدارية رقمية",
    icon: Layers,
  },
];

export function HorizontalCategoryScroll({
  activeCategory,
  onSelectCategory,
}: {
  activeCategory: string;
  onSelectCategory: (id: string) => void;
}) {
  const { lang } = useI18n();
  const isAr = lang === "ar";
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const step = 200;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -step : step,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative my-6 w-full">
      {/* Scroll Left Chevron */}
      <button
        type="button"
        onClick={() => scroll("left")}
        aria-label="Scroll categories left"
        className="hidden md:flex absolute -start-3 top-1/2 -translate-y-1/2 z-10 h-8 w-8 items-center justify-center rounded-full border border-border bg-surface/90 shadow-md backdrop-blur-md text-text-secondary hover:text-accent hover:border-accent transition-all"
      >
        <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
      </button>

      {/* Horizontal Touch Scroll Track */}
      <div
        ref={scrollRef}
        className="scrollbar-none flex items-center gap-2 overflow-x-auto px-1 py-1.5 scroll-smooth select-none mask-edge-fade"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {CATEGORIES_LIST.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={`group flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-accent text-background shadow-md shadow-accent/20 ring-1 ring-accent font-bold"
                  : "border border-border/80 bg-surface/70 text-text-secondary hover:border-accent/60 hover:text-text-primary hover:bg-surface-elevated"
              }`}
            >
              <Icon
                className={`h-3.5 w-3.5 transition-transform group-hover:scale-110 ${
                  isActive ? "text-background" : "text-accent"
                }`}
              />
              <span className="whitespace-nowrap">{isAr ? cat.nameAr : cat.nameEn}</span>
            </button>
          );
        })}
      </div>

      {/* Scroll Right Chevron */}
      <button
        type="button"
        onClick={() => scroll("right")}
        aria-label="Scroll categories right"
        className="hidden md:flex absolute -end-3 top-1/2 -translate-y-1/2 z-10 h-8 w-8 items-center justify-center rounded-full border border-border bg-surface/90 shadow-md backdrop-blur-md text-text-secondary hover:text-accent hover:border-accent transition-all"
      >
        <ChevronRight className="h-4 w-4 rtl:rotate-180" />
      </button>
    </div>
  );
}
