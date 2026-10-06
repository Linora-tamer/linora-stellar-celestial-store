import { useState } from "react";
import {
  Sparkles,
  X,
  Palette,
  Type,
  ShoppingBag,
  RotateCcw,
  Check,
  Eye,
  Layers,
} from "lucide-react";
import { toast } from "sonner";
import { useCart, formatPrice } from "@/lib/cart";
import { useI18n } from "@/lib/i18n";
import { LinoraLogo } from "@/components/site/LinoraLogo";

interface ProductCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ProductModel = "labels" | "bottle" | "notebook" | "hoodie";

export function ProductCustomizerModal({ isOpen, onClose }: ProductCustomizerModalProps) {
  const { add } = useCart();
  const { lang } = useI18n();
  const isAr = lang === "ar";

  const [model, setModel] = useState<ProductModel>("labels");
  const [customText, setCustomText] = useState("أزْهان");
  const [subText, setSubText] = useState("Grade 4 • Stargazer");
  const [themeColor, setThemeColor] = useState("#080D1A");
  const [accentColor, setAccentColor] = useState("#DFAD71");
  const [pattern, setPattern] = useState<"floral" | "space" | "celestial" | "gold">("celestial");

  if (!isOpen) return null;

  const MODELS: Array<{ id: ProductModel; titleEn: string; titleAr: string; basePrice: number }> = [
    {
      id: "labels",
      titleEn: "Waterproof Name Label Set (48 Pcs)",
      titleAr: "طقم ملصقات أسماء مدرسية مقاومة للماء (48 قطعة)",
      basePrice: 120,
    },
    {
      id: "notebook",
      titleEn: "Linen Celestial Hardcover Journal",
      titleAr: "دفتر لينورا ستيلر المجلد بقماش الكتان الفاخر",
      basePrice: 280,
    },
    {
      id: "bottle",
      titleEn: "Matte Navy Thermal Bottle (500ml)",
      titleAr: "زجاجة حرارية كحلي مطفي بغطاء ذهبي",
      basePrice: 350,
    },
    {
      id: "hoodie",
      titleEn: "Signature Constellation Embroidered Hoodie",
      titleAr: "هودي قطني مطرز بالأبراج الفلكية والاسم",
      basePrice: 650,
    },
  ];

  const currentModel = MODELS.find((m) => m.id === model)!;

  function handleAddToCart() {
    add(
      {
        productId: `custom-${model}`,
        slug: `custom-${model}`,
        name: isAr ? currentModel.titleAr : currentModel.titleEn,
        price: currentModel.basePrice,
        image: null,
        quantity: 1,
        options: {
          [isAr ? "الاسم المخصص" : "Custom Name"]: customText,
          [isAr ? "العبارة الإضافية" : "Subtext"]: subText,
          [isAr ? "الطابع المختار" : "Theme Style"]: pattern,
        },
      },
      true,
    );
    toast.success(
      isAr
        ? `تم إضافة "${customText}" إلى سلة مشترياتكِ بنجاح!`
        : `Added customized "${customText}" item to your cart!`,
    );
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Main Studio Modal */}
      <div className="relative w-full max-w-4xl rounded-2xl border border-accent/40 bg-surface shadow-2xl card-star max-h-[92vh] overflow-y-auto flex flex-col lg:flex-row">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute end-4 top-4 z-20 rounded-full p-2 text-text-secondary hover:bg-surface-elevated hover:text-text-primary transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* LEFT COLUMN: INTERACTIVE VISUAL LIVE PREVIEW MOCKUP */}
        <div className="lg:w-1/2 p-6 sm:p-8 bg-gradient-to-b from-surface-elevated to-background border-b lg:border-b-0 lg:border-e border-border/80 flex flex-col items-center justify-center min-h-[380px] relative overflow-hidden">
          {/* Subtle star background */}
          <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#DFAD71_1px,transparent_1px)] [background-size:16px_16px]" />

          <p className="absolute top-4 start-4 flex items-center gap-1.5 text-[10px] uppercase tracking-[0.25em] text-accent font-semibold">
            <Eye className="h-3.5 w-3.5" />
            <span>{isAr ? "معاينة حية فورية" : "Live Visual Preview"}</span>
          </p>

          {/* Dynamic Mockup Viewport */}
          <div className="w-full max-w-xs transition-all duration-500 py-6">
            {/* 1. School Name Label Mockup */}
            {model === "labels" && (
              <div
                className="relative rounded-2xl p-6 shadow-2xl border transition-all duration-500 flex flex-col items-center justify-center text-center overflow-hidden"
                style={{
                  backgroundColor: themeColor,
                  borderColor: accentColor,
                  color: "#FFF6ED",
                  boxShadow: `0 20px 40px -15px ${accentColor}40`,
                }}
              >
                {/* Decorative border pattern */}
                <div
                  className="absolute inset-1.5 rounded-xl border border-dashed pointer-events-none opacity-40"
                  style={{ borderColor: accentColor }}
                />

                <LinoraLogo variant="icon" size="sm" className="mb-2" />

                <span
                  className="font-display text-3xl font-bold tracking-wide transition-all"
                  style={{ color: accentColor }}
                >
                  {customText || (isAr ? "اكتبي الاسم هنا" : "Name Here")}
                </span>

                <span className="text-xs text-text-secondary mt-1 tracking-wider opacity-90">
                  {subText}
                </span>

                <div className="mt-3 flex items-center gap-1 text-[9px] uppercase tracking-[0.2em] opacity-75">
                  <span>✦ LINORA STELLAR • WATERPROOF ✦</span>
                </div>
              </div>
            )}

            {/* 2. Linen Hardcover Notebook Mockup */}
            {model === "notebook" && (
              <div
                className="relative aspect-[3/4] w-64 rounded-r-2xl rounded-l-md p-6 shadow-2xl border flex flex-col justify-between transition-all duration-500 mx-auto"
                style={{
                  backgroundColor: themeColor,
                  borderColor: accentColor,
                  color: "#FFF6ED",
                  boxShadow: `0 25px 50px -20px ${accentColor}50`,
                }}
              >
                {/* Book Spine Shadow */}
                <div className="absolute inset-y-0 start-0 w-3 bg-black/40 rounded-l-md pointer-events-none" />

                <div className="flex justify-between items-start">
                  <LinoraLogo variant="icon" size="sm" />
                  <span
                    className="text-[10px] tracking-widest font-mono"
                    style={{ color: accentColor }}
                  >
                    2026–2027
                  </span>
                </div>

                <div className="text-center my-auto">
                  <p
                    className="font-display text-2xl font-bold tracking-wider"
                    style={{ color: accentColor }}
                  >
                    {customText || "LINORA"}
                  </p>
                  <p className="text-[10px] tracking-[0.3em] uppercase opacity-80 mt-1">
                    {subText || "PLAN • CREATE • GROW"}
                  </p>
                </div>

                <div className="text-center border-t border-white/10 pt-3">
                  <span className="text-[9px] uppercase tracking-[0.25em] opacity-70">
                    Bespoke Celestial Journal
                  </span>
                </div>
              </div>
            )}

            {/* 3. Matte Thermal Water Bottle Mockup */}
            {model === "bottle" && (
              <div className="flex flex-col items-center mx-auto">
                {/* Bottle Cap */}
                <div
                  className="h-7 w-14 rounded-t-lg border-t border-x shadow-md"
                  style={{ backgroundColor: accentColor, borderColor: "#FFFFFF40" }}
                />
                <div className="h-3 w-8 bg-zinc-800" />
                {/* Bottle Body */}
                <div
                  className="h-64 w-28 rounded-3xl p-4 flex flex-col items-center justify-center text-center shadow-2xl border transition-all duration-500"
                  style={{
                    backgroundColor: themeColor,
                    borderColor: accentColor,
                    boxShadow: `0 20px 40px -15px ${accentColor}40`,
                  }}
                >
                  <LinoraLogo variant="icon" size="sm" className="mb-3" />
                  <p
                    className="font-display text-lg font-bold tracking-wide"
                    style={{ color: accentColor }}
                  >
                    {customText || "Linora"}
                  </p>
                  <span className="text-[9px] text-text-secondary mt-1 tracking-widest">
                    {subText}
                  </span>
                </div>
              </div>
            )}

            {/* 4. Constellation Hoodie Mockup */}
            {model === "hoodie" && (
              <div
                className="relative aspect-square w-64 rounded-3xl p-6 shadow-2xl border flex flex-col items-center justify-center text-center transition-all duration-500 mx-auto"
                style={{
                  backgroundColor: themeColor,
                  borderColor: accentColor,
                  boxShadow: `0 25px 50px -20px ${accentColor}40`,
                }}
              >
                <div className="h-10 w-24 rounded-b-2xl border-b-2 border-white/20 bg-black/20 mb-4" />
                <LinoraLogo variant="icon" size="md" className="mb-2" />
                <p
                  className="font-display text-xl font-bold tracking-wider"
                  style={{ color: accentColor }}
                >
                  {customText || "Your Name"}
                </p>
                <p className="text-[10px] tracking-widest text-text-secondary mt-1">
                  {subText || "Celestial Collection"}
                </p>
              </div>
            )}
          </div>

          <p className="text-[11px] text-text-secondary mt-3">
            {isAr
              ? "معاينة واقعية للتطريز والطباعة قبل الطلب"
              : "Real-time interactive embroidery & print preview"}
          </p>
        </div>

        {/* RIGHT COLUMN: CONTROLS & CUSTOMIZATION STUDIO */}
        <div className="lg:w-1/2 p-6 sm:p-8 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-accent font-semibold">
              <Sparkles className="h-4 w-4" />
              <span>{isAr ? "استوديو التخصيص التفاعلي" : "Live Product Customizer"}</span>
            </div>
            <h3 className="mt-1 font-display text-2xl sm:text-3xl text-text-primary">
              {isAr ? currentModel.titleAr : currentModel.titleEn}
            </h3>
            <p className="mt-1 text-sm font-bold text-accent">
              {formatPrice(currentModel.basePrice, lang)}
            </p>
          </div>

          {/* 1. Choose Product Model */}
          <div>
            <label className="text-xs uppercase tracking-wider text-text-secondary font-bold block mb-2">
              {isAr ? "1. اختاري المنتج للتخصيص" : "1. Select Merchandise Item"}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {MODELS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setModel(m.id)}
                  className={`rounded-xl border p-2.5 text-xs text-start transition-all ${
                    model === m.id
                      ? "border-accent bg-accent/15 text-text-primary font-bold shadow-xs"
                      : "border-border text-text-secondary hover:border-accent"
                  }`}
                >
                  <p className="truncate font-semibold">{isAr ? m.titleAr : m.titleEn}</p>
                  <p className="text-[10px] text-accent mt-0.5">{m.basePrice} EGP</p>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Personalized Text Input */}
          <div className="space-y-3">
            <label className="text-xs uppercase tracking-wider text-text-secondary font-bold block">
              {isAr ? "2. الاسم أو العبارة المراد طباعتها" : "2. Name & Custom Message"}
            </label>
            <div>
              <input
                type="text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                maxLength={30}
                placeholder={
                  isAr ? "اكتبي الاسم (مثال: أزْهان، مريم، Noah)" : "Type Name (e.g. Amelia R.)"
                }
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-text-primary outline-none focus:border-accent font-medium"
              />
            </div>
            <div>
              <input
                type="text"
                value={subText}
                onChange={(e) => setSubText(e.target.value)}
                maxLength={40}
                placeholder={
                  isAr ? "عبارة ثانوية أو الفصل (مثال: Grade 4 • Stargazer)" : "Subtitle or grade"
                }
                className="w-full rounded-xl border border-border bg-background px-4 py-2 text-xs text-text-primary outline-none focus:border-accent"
              />
            </div>
          </div>

          {/* 3. Color Palettes */}
          <div>
            <label className="text-xs uppercase tracking-wider text-text-secondary font-bold block mb-2">
              {isAr ? "3. لوحة الألوان والبريق" : "3. Palette Theme"}
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { name: isAr ? "كحلي ليلي فلكي" : "Midnight Navy", bg: "#080D1A", acc: "#DFAD71" },
                {
                  name: isAr ? "أبيض عاجي فاخر" : "Ivory Parchment",
                  bg: "#28272C",
                  acc: "#E0AD76",
                },
                { name: isAr ? "فجر خوخي ووردي" : "Dawn Blossom", bg: "#1D1624", acc: "#D9A08C" },
                { name: isAr ? "أزرق نهاري مشرق" : "Daylight Blue", bg: "#13191C", acc: "#91A9C7" },
              ].map((c, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setThemeColor(c.bg);
                    setAccentColor(c.acc);
                  }}
                  className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition-all ${
                    themeColor === c.bg
                      ? "border-accent bg-accent/20 text-accent font-bold"
                      : "border-border text-text-secondary hover:border-accent"
                  }`}
                >
                  <span
                    className="h-3 w-3 rounded-full border border-white/20"
                    style={{ backgroundColor: c.acc }}
                  />
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Add Customized Item to Cart Button */}
          <div className="pt-2 border-t border-border/70">
            <button
              type="button"
              onClick={handleAddToCart}
              className="w-full flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-background hover:opacity-90 transition-opacity shadow-lg cursor-pointer"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>
                {isAr
                  ? `إضافة هذا التصميم المخصص للسلة (${formatPrice(currentModel.basePrice, lang)})`
                  : `Add Customized Piece to Cart (${formatPrice(currentModel.basePrice, lang)})`}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
