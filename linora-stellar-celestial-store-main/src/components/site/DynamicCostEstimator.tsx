import { useState } from "react";
import {
  Calculator,
  Check,
  Clock,
  Sparkles,
  ArrowRight,
  MessageCircle,
  HelpCircle,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { CONTACT } from "@/lib/store";

interface ScopeOption {
  id: string;
  nameEn: string;
  nameAr: string;
  price: number;
  days: number;
  category: "core" | "collateral" | "digital" | "speed";
}

const SCOPE_OPTIONS: ScopeOption[] = [
  // Core Identity
  {
    id: "primary_logo",
    nameEn: "Primary & Secondary Logo Suite",
    nameAr: "تصميم الشعار الأساسي والفرعي والأيقونة",
    price: 1800,
    days: 4,
    category: "core",
  },
  {
    id: "brand_guidelines",
    nameEn: "Brand Style Guide & Color System",
    nameAr: "دليل الهوية ونظام الألوان والخطوط",
    price: 1200,
    days: 2,
    category: "core",
  },
  {
    id: "vector_source",
    nameEn: "Vector Master Files (AI, SVG, PDF 300DPI)",
    nameAr: "ملفات فيكتور الأصلية مفتوحة المصدر",
    price: 600,
    days: 1,
    category: "core",
  },

  // Collateral & Stationery
  {
    id: "business_cards",
    nameEn: "Bespoke Business Cards (Print-Ready)",
    nameAr: "كروت شخصية فاخرة جاهزة للمطبعة",
    price: 650,
    days: 2,
    category: "collateral",
  },
  {
    id: "stationery_suite",
    nameEn: "Letterhead, Envelopes & Note Cards",
    nameAr: "أوراق رسمية، أظرف وكروت شكر",
    price: 1100,
    days: 3,
    category: "collateral",
  },
  {
    id: "packaging_box",
    nameEn: "Product Box & Packaging Label Artwork",
    nameAr: "تغليف منتجات وبوكسات كرتونية فاخرة",
    price: 1600,
    days: 4,
    category: "collateral",
  },

  // Digital & Social
  {
    id: "social_templates",
    nameEn: "12 Editable Canva Social Media Templates",
    nameAr: "12 قالب كانفا قابل للتعديل لمنشورات إنستجرام",
    price: 950,
    days: 2,
    category: "digital",
  },
  {
    id: "digital_planner",
    nameEn: "Custom Branded Digital Planner for iPad",
    nameAr: "مخطط رقمي مخصص بهوية مشروعك",
    price: 1400,
    days: 3,
    category: "digital",
  },
  {
    id: "school_label_pack",
    nameEn: "Custom School Label Sheet Artwork",
    nameAr: "شيت ملصقات أسماء مدرسية مخصص",
    price: 500,
    days: 1,
    category: "digital",
  },
];

export function DynamicCostEstimator({
  onSelectScope,
}: {
  onSelectScope?: (summary: string) => void;
}) {
  const { lang } = useI18n();
  const isAr = lang === "ar";

  const [selectedIds, setSelectedIds] = useState<string[]>([
    "primary_logo",
    "brand_guidelines",
    "business_cards",
  ]);
  const [revisions, setRevisions] = useState<number>(2);
  const [isRush, setIsRush] = useState<boolean>(false);

  function toggleOption(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  }

  // Calculate totals
  const basePrice = selectedIds.reduce((sum, id) => {
    const opt = SCOPE_OPTIONS.find((o) => o.id === id);
    return sum + (opt ? opt.price : 0);
  }, 0);

  const baseDays = selectedIds.reduce((sum, id) => {
    const opt = SCOPE_OPTIONS.find((o) => o.id === id);
    return sum + (opt ? opt.days : 0);
  }, 0);

  // Revisions cost: 2 included free, additional 250 EGP each
  const extraRevisionsCost = Math.max(0, revisions - 2) * 250;

  // Rush turnaround: +30% fee, cuts timeline in half
  const rushMultiplier = isRush ? 1.3 : 1.0;
  const finalPrice = Math.round((basePrice + extraRevisionsCost) * rushMultiplier);
  const estimatedDays = isRush ? Math.max(2, Math.round(baseDays * 0.5)) : Math.max(3, baseDays);

  const selectedItemsSummary = selectedIds
    .map((id) => {
      const opt = SCOPE_OPTIONS.find((o) => o.id === id);
      return opt ? (isAr ? opt.nameAr : opt.nameEn) : "";
    })
    .filter(Boolean)
    .join(", ");

  const quoteWhatsAppText = encodeURIComponent(
    `Hi Nora! I used the Linora Stellar Cost Estimator for my project:\n• Selected Deliverables: ${selectedItemsSummary}\n• Revisions: ${revisions}\n• Rush Delivery: ${isRush ? "Yes" : "Standard"}\n• Estimated Total: ${finalPrice} EGP (~${estimatedDays} days)`,
  );

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 card-star">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/70 pb-5">
        <div>
          <p className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-accent font-semibold">
            <Calculator className="h-4 w-4" />
            <span>{isAr ? "حاسبة تكلفة التصميم التفاعلية" : "Dynamic Design Cost Estimator"}</span>
          </p>
          <h3 className="mt-1 font-display text-2xl sm:text-3xl text-text-primary">
            {isAr
              ? "حددي متطلباتكِ واعرفي التكلفة فوراً"
              : "Scope Your Project & Get Instant Pricing"}
          </h3>
        </div>

        <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-accent">
          {selectedIds.length} {isAr ? "خدمات مختارة" : "Deliverables Selected"}
        </span>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-12 items-start">
        {/* Left: Scope Checkboxes */}
        <div className="lg:col-span-7 space-y-6">
          {/* Core */}
          <div>
            <h4 className="text-xs uppercase tracking-wider text-text-secondary font-bold mb-3">
              1. {isAr ? "الهوية البصرية الأساسية" : "Core Visual Identity"}
            </h4>
            <div className="grid gap-2.5">
              {SCOPE_OPTIONS.filter((o) => o.category === "core").map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => toggleOption(opt.id)}
                  className={`flex items-center justify-between rounded-xl border p-3.5 text-xs text-start transition-all ${
                    selectedIds.includes(opt.id)
                      ? "border-accent bg-accent/10 text-text-primary shadow-xs"
                      : "border-border bg-surface-elevated text-text-secondary hover:border-accent/60"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-md border ${
                        selectedIds.includes(opt.id)
                          ? "border-accent bg-accent text-background"
                          : "border-border bg-background"
                      }`}
                    >
                      {selectedIds.includes(opt.id) && <Check className="h-3.5 w-3.5" />}
                    </div>
                    <span className="font-semibold">{isAr ? opt.nameAr : opt.nameEn}</span>
                  </div>
                  <span className="font-bold text-accent">+{opt.price} EGP</span>
                </button>
              ))}
            </div>
          </div>

          {/* Collateral */}
          <div>
            <h4 className="text-xs uppercase tracking-wider text-text-secondary font-bold mb-3">
              2. {isAr ? "المطبوعات والأوراق الرسمية" : "Print & Stationery Collaterals"}
            </h4>
            <div className="grid gap-2.5">
              {SCOPE_OPTIONS.filter((o) => o.category === "collateral").map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => toggleOption(opt.id)}
                  className={`flex items-center justify-between rounded-xl border p-3.5 text-xs text-start transition-all ${
                    selectedIds.includes(opt.id)
                      ? "border-accent bg-accent/10 text-text-primary shadow-xs"
                      : "border-border bg-surface-elevated text-text-secondary hover:border-accent/60"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-md border ${
                        selectedIds.includes(opt.id)
                          ? "border-accent bg-accent text-background"
                          : "border-border bg-background"
                      }`}
                    >
                      {selectedIds.includes(opt.id) && <Check className="h-3.5 w-3.5" />}
                    </div>
                    <span className="font-semibold">{isAr ? opt.nameAr : opt.nameEn}</span>
                  </div>
                  <span className="font-bold text-accent">+{opt.price} EGP</span>
                </button>
              ))}
            </div>
          </div>

          {/* Digital */}
          <div>
            <h4 className="text-xs uppercase tracking-wider text-text-secondary font-bold mb-3">
              3. {isAr ? "الأصول الرقمية وقوالب السوشيال" : "Digital & Social Assets"}
            </h4>
            <div className="grid gap-2.5">
              {SCOPE_OPTIONS.filter((o) => o.category === "digital").map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => toggleOption(opt.id)}
                  className={`flex items-center justify-between rounded-xl border p-3.5 text-xs text-start transition-all ${
                    selectedIds.includes(opt.id)
                      ? "border-accent bg-accent/10 text-text-primary shadow-xs"
                      : "border-border bg-surface-elevated text-text-secondary hover:border-accent/60"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-md border ${
                        selectedIds.includes(opt.id)
                          ? "border-accent bg-accent text-background"
                          : "border-border bg-background"
                      }`}
                    >
                      {selectedIds.includes(opt.id) && <Check className="h-3.5 w-3.5" />}
                    </div>
                    <span className="font-semibold">{isAr ? opt.nameAr : opt.nameEn}</span>
                  </div>
                  <span className="font-bold text-accent">+{opt.price} EGP</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Calculations & Summary Box */}
        <div className="lg:col-span-5 rounded-2xl border border-accent/40 bg-surface-elevated p-6 space-y-5 sticky top-24">
          <h4 className="font-display text-xl text-text-primary font-semibold border-b border-border/70 pb-3">
            {isAr ? "تقدير التكلفة والموعد" : "Instant Investment Quote"}
          </h4>

          {/* Revisions Control */}
          <div>
            <div className="flex justify-between text-xs mb-1.5 font-medium">
              <span className="text-text-secondary">
                {isAr ? "جولات التعديل المطلوبة:" : "Revision Rounds:"}
              </span>
              <span className="text-text-primary font-bold">
                {revisions} {isAr ? "جولات" : "Rounds"}{" "}
                {revisions <= 2 && (isAr ? "(مجاناً)" : "(Included)")}
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={5}
              value={revisions}
              onChange={(e) => setRevisions(Number(e.target.value))}
              className="w-full accent-accent cursor-pointer"
            />
          </div>

          {/* Rush Delivery Switch */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-surface">
            <div>
              <p className="text-xs font-semibold text-text-primary">
                {isAr ? "تسليم سريع عاجل (VIP Rush)" : "VIP Express Turnaround"}
              </p>
              <p className="text-[11px] text-text-secondary">
                {isAr ? "تقليص مدة التنفيذ للنصف (+30%)" : "Cuts turnaround time in half"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsRush(!isRush)}
              className={`h-6 w-11 rounded-full transition-colors relative ${
                isRush ? "bg-accent" : "bg-border"
              }`}
            >
              <span
                className={`absolute top-1 h-4 w-4 rounded-full bg-background transition-transform ${
                  isRush ? "start-6" : "start-1"
                }`}
              />
            </button>
          </div>

          {/* Output Price & Timeline */}
          <div className="border-t border-border/70 pt-4 space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-text-secondary">
                {isAr ? "التكلفة التقديرية:" : "Estimated Total:"}
              </span>
              <span className="font-display text-3xl font-bold text-accent">
                {finalPrice.toLocaleString()} EGP
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-text-secondary">
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-accent" />
                {isAr ? "مدة التسليم المتوقعة:" : "Estimated Delivery:"}
              </span>
              <span className="font-semibold text-text-primary">
                {estimatedDays} {isAr ? "أيام عمل" : "Business Days"}
              </span>
            </div>
          </div>

          {/* Direct WhatsApp Quote Button */}
          <a
            href={`${CONTACT.whatsappLink}?text=${quoteWhatsAppText}`}
            target="_blank"
            rel="noreferrer"
            className="w-full flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-emerald-500 transition-colors shadow-md"
          >
            <MessageCircle className="h-4 w-4" />
            <span>{isAr ? "اعتماد هذا العرض عبر واتساب" : "Confirm Scope via WhatsApp"}</span>
          </a>

          <p className="text-[10px] text-center text-text-secondary leading-relaxed">
            {isAr
              ? "الأسعار تقديرية وتخضع للتأكيد بعد مراجعة كافة متطلبات الملفات مع المصممة نورا تامر."
              : "Quotes are transparent estimates finalized after direct briefing review with Nora Tamer."}
          </p>
        </div>
      </div>
    </div>
  );
}
