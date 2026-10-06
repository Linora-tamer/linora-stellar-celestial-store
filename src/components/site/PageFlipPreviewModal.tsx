import { useState } from "react";
import { X, ChevronLeft, ChevronRight, BookOpen, Sparkles, ShoppingBag } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import heroStellar from "@/assets/hero-stellar.jpg";
import brandingImg from "@/assets/p-branding.jpg";
import classroomImg from "@/assets/p-classroom.jpg";
import invitationImg from "@/assets/p-invitation.jpg";

interface PageFlipPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  productTitle?: string;
  onAddToCart?: () => void;
}

const SAMPLE_PAGES = [
  {
    titleEn: "Celestial Cover Foil Edition",
    titleAr: "الغلاف الفلكي المذهب الفاخر",
    descEn: "Hardcover with gold-foil celestial constellations and midnight velvet finish.",
    descAr: "غلاف صلب مذهب بأبراج فلكية وملمس مخملي فاخر.",
    image: heroStellar,
  },
  {
    titleEn: "Annual Goal Setting & Astrological Orbit",
    titleAr: "مخطط الأهداف السنوية والمدار الفلكي",
    descEn: "Designed with 12 lunar phases, celestial focus areas, and milestone trackers.",
    descAr: "مصمم مع دورات القمر الـ12 ومساحات تحديد النوايا والأهداف الشهرية.",
    image: brandingImg,
  },
  {
    titleEn: "Weekly Focus & Daily Time-Blocking",
    titleAr: "التخطيط الأسبوعي وإدارة الوقت اليومية",
    descEn:
      "Minimalist grid layout for appointments, top 3 priorities, and stardust habit tracking.",
    descAr: "شبكة تنظيمية نظيفة للمواعيد، الأولويات الثلاث، ومتتبع العادات اليومية.",
    image: classroomImg,
  },
  {
    titleEn: "Creative Dot-Grid & Reflection Notes",
    titleAr: "صفحات التنقيط الحرة والملاحظات الإبداعية",
    descEn:
      "High-grade 120gsm ink-proof bleed-resistant paper suitable for fountain pens & markers.",
    descAr: "ورق عالي الكثافة 120 جرام لا ينفذ الحبر ومثالي للأقلام السائلة وأقلام التحديد.",
    image: invitationImg,
  },
];

export function PageFlipPreviewModal({
  isOpen,
  onClose,
  productTitle = "Linora Stellar Celestial Planner",
  onAddToCart,
}: PageFlipPreviewModalProps) {
  const { lang } = useI18n();
  const isAr = lang === "ar";
  const [pageIndex, setPageIndex] = useState(0);

  if (!isOpen) return null;

  const current = SAMPLE_PAGES[pageIndex] ?? SAMPLE_PAGES[0]!;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div
        className="fixed inset-0 bg-background/85 backdrop-blur-md"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-2xl rounded-3xl border border-accent/40 bg-surface p-5 sm:p-7 shadow-2xl card-star z-10 text-text-primary">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border/70 pb-3">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-accent font-bold">
              <BookOpen className="h-4 w-4" />
              <span>
                {isAr ? "معاينة الصفحات الداخلية (Look Inside)" : "Look Inside Page Preview"}
              </span>
            </div>
            <h3 className="mt-1 font-display text-xl font-bold text-text-primary">
              {productTitle}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-border p-2 text-text-secondary hover:border-accent hover:text-text-primary transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Page Viewer with Book Style */}
        <div className="my-5 relative flex flex-col items-center">
          <div className="relative w-full aspect-[4/3] max-h-[380px] rounded-2xl overflow-hidden border border-border shadow-2xl bg-surface-elevated">
            <img
              src={current.image}
              alt={current.titleEn}
              className="h-full w-full object-cover animate-in fade-in duration-300"
            />
            {/* Book spine shadow */}
            <div className="absolute inset-y-0 start-0 w-8 bg-gradient-to-r from-black/40 to-transparent pointer-events-none" />
          </div>

          {/* Navigation Controls */}
          <div className="w-full mt-4 flex items-center justify-between">
            <button
              type="button"
              disabled={pageIndex === 0}
              onClick={() => setPageIndex((i) => Math.max(0, i - 1))}
              className="flex items-center gap-1.5 rounded-full border border-border/80 px-3 py-1.5 text-xs text-text-secondary hover:border-accent hover:text-accent disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
              <span>{isAr ? "الصفحة السابقة" : "Previous"}</span>
            </button>

            {/* Dots indicator */}
            <div className="flex items-center gap-1.5">
              {SAMPLE_PAGES.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPageIndex(idx)}
                  className={`h-2 rounded-full transition-all ${
                    pageIndex === idx ? "w-6 bg-accent" : "w-2 bg-border hover:bg-accent/50"
                  }`}
                  aria-label={`Page ${idx + 1}`}
                />
              ))}
            </div>

            <button
              type="button"
              disabled={pageIndex === SAMPLE_PAGES.length - 1}
              onClick={() => setPageIndex((i) => Math.min(SAMPLE_PAGES.length - 1, i + 1))}
              className="flex items-center gap-1.5 rounded-full border border-border/80 px-3 py-1.5 text-xs text-text-secondary hover:border-accent hover:text-accent disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <span>{isAr ? "الصفحة التالية" : "Next"}</span>
              <ChevronRight className="h-4 w-4 rtl:rotate-180" />
            </button>
          </div>

          {/* Page Details */}
          <div className="mt-3 text-center px-4">
            <h4 className="font-semibold text-sm text-text-primary">
              {isAr ? current.titleAr : current.titleEn}
            </h4>
            <p className="text-xs text-text-secondary mt-1">
              {isAr ? current.descAr : current.descEn}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border/70 pt-3 flex items-center justify-between">
          <span className="text-xs font-mono text-text-secondary">
            {isAr
              ? `صفحة ${pageIndex + 1} من ${SAMPLE_PAGES.length}`
              : `Page ${pageIndex + 1} of ${SAMPLE_PAGES.length}`}
          </span>

          <div className="flex items-center gap-2">
            {onAddToCart && (
              <button
                type="button"
                onClick={() => {
                  onAddToCart();
                  onClose();
                }}
                className="flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-xs font-bold text-background uppercase tracking-wider hover:brightness-110 shadow-md transition-all"
              >
                <ShoppingBag className="h-3.5 w-3.5" />
                <span>{isAr ? "شراء هذه النسخة" : "Order This Piece"}</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-border px-4 py-2 text-xs font-semibold text-text-secondary hover:text-text-primary"
            >
              {isAr ? "إغلاق" : "Close"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
