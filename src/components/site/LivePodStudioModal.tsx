import { useState, useRef } from "react";
import {
  Sparkles,
  Upload,
  X,
  Check,
  ShoppingBag,
  Sliders,
  Image as ImageIcon,
  ZoomIn,
  Move,
  RotateCcw,
  Palette,
  Coffee,
  Shirt,
  BookOpen,
  ShoppingBag as BagIcon,
} from "lucide-react";
import { useCart, formatPrice } from "@/lib/cart";
import { useI18n } from "@/lib/i18n";
import { toast } from "sonner";
import heroStellar from "@/assets/hero-stellar.jpg";
import brandingImg from "@/assets/p-branding.jpg";
import invitationImg from "@/assets/p-invitation.jpg";

interface LivePodStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProduct?: string;
}

export const POD_PRODUCTS = [
  {
    id: "mug",
    nameEn: "Ceramic Celestial Mug",
    nameAr: "مج سيراميك فلكي فاخر",
    basePrice: 195,
    sizes: ["11 oz (Standard)", "15 oz (Large)"],
    colors: [
      { nameEn: "Midnight Navy", nameAr: "كحلي ليلي", hex: "#0F1626" },
      { nameEn: "Pearl White", nameAr: "أبيض لؤلؤي", hex: "#F8FAFC" },
      { nameEn: "Pitch Black", nameAr: "أسود داكن", hex: "#111827" },
      { nameEn: "Rose Gold", nameAr: "وردي ذهبي", hex: "#FBCFE8" },
    ],
    icon: Coffee,
  },
  {
    id: "apparel",
    nameEn: "Organic Cotton Tee",
    nameAr: "تيشيرت قطن عضوي مطبوع",
    basePrice: 380,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { nameEn: "Pitch Black", nameAr: "أسود داكن", hex: "#111827" },
      { nameEn: "Cosmic Navy", nameAr: "أزرق فلكي", hex: "#1E293B" },
      { nameEn: "Cream White", nameAr: "أبيض كريمي", hex: "#F8FAFC" },
      { nameEn: "Desert Sage", nameAr: "أخضر صحراوي", hex: "#64748B" },
    ],
    icon: Shirt,
  },
  {
    id: "planner",
    nameEn: "Hardcover Spiral Planner",
    nameAr: "بلانر بغلاف صلب مطبوع",
    basePrice: 280,
    sizes: ["A5 Hardcover (Compact)", "B5 Executive", "A4 Deluxe"],
    colors: [
      { nameEn: "Midnight Navy", nameAr: "كحلي ليلي", hex: "#0F1626" },
      { nameEn: "Pearl White", nameAr: "أبيض لؤلؤي", hex: "#F8FAFC" },
      { nameEn: "Lavender Dust", nameAr: "لافندر غباري", hex: "#DDD6FE" },
    ],
    icon: BookOpen,
  },
  {
    id: "tote",
    nameEn: "Canvas Eco Tote Bag",
    nameAr: "حقيبة توت باج قماشية",
    basePrice: 220,
    sizes: ["Standard 38x42 cm", "Gusseted Large"],
    colors: [
      { nameEn: "Natural Canvas", nameAr: "قماش طبيعي", hex: "#FDFBF7" },
      { nameEn: "Midnight Black", nameAr: "أسود ليلي", hex: "#18181B" },
    ],
    icon: BagIcon,
  },
];

export function LivePodStudioModal({
  isOpen,
  onClose,
  defaultProduct = "mug",
}: LivePodStudioModalProps) {
  const { lang } = useI18n();
  const isAr = lang === "ar";
  const { add, openDrawer } = useCart();

  const [selectedProductId, setSelectedProductId] = useState(defaultProduct);
  const activeProduct = POD_PRODUCTS.find((p) => p.id === selectedProductId) || POD_PRODUCTS[0];

  const [selectedColor, setSelectedColor] = useState(activeProduct.colors[0]);
  const [selectedSize, setSelectedSize] = useState(activeProduct.sizes[0]);
  const [uploadedArtwork, setUploadedArtwork] = useState<string | null>(null);
  const [designScale, setDesignScale] = useState(85);
  const [designOffsetY, setDesignOffsetY] = useState(0);
  const [customText, setCustomText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error(
        isAr ? "حجم الصورة كبير جداً (الحد الأقصى 10 ميجابايت)" : "File is too large (max 10MB)",
      );
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadedArtwork(event.target?.result as string);
      toast.success(isAr ? "تم رفع التصميم بنجاح للمعاينة!" : "Artwork uploaded successfully!");
    };
    reader.readAsDataURL(file);
  };

  const handleAddToCart = () => {
    add({
      productId: `pod-${activeProduct.id}-${Date.now()}`,
      slug: `custom-pod-${activeProduct.id}`,
      name: `${isAr ? activeProduct.nameAr : activeProduct.nameEn} (Custom POD)`,
      price: activeProduct.basePrice,
      image: uploadedArtwork || heroStellar,
      quantity: 1,
      variant: `${selectedColor.nameEn} / ${selectedSize}${customText ? ` • "${customText}"` : ""}`,
    });
    toast.success(
      isAr ? "تمت إضافة القطعة المخصصة لسلة التسوق!" : "Custom merchandise added to cart!",
    );
    onClose();
    openDrawer();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div
        className="fixed inset-0 bg-background/85 backdrop-blur-md"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-4xl rounded-3xl border border-accent/40 bg-surface p-5 sm:p-7 shadow-2xl card-star max-h-[92vh] overflow-y-auto z-10 text-text-primary">
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-border/70 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-accent font-bold">
              <Sparkles className="h-4 w-4 animate-pulse" />
              <span>{isAr ? "استوديو الطباعة عند الطلب الفلكي" : "Live Celestial POD Studio"}</span>
            </div>
            <h2 className="mt-1 font-display text-2xl font-bold text-text-primary">
              {isAr ? "صممي وعايني منتجك الخاص مباشرة" : "Customize & Preview Print-On-Demand"}
            </h2>
            <p className="mt-1 text-xs text-text-secondary">
              {isAr
                ? "ارفعي شعارك أو رسمتك الفلكية، واختاري المقاس واللون وشاهدي النتيجة الحقيقية قبل الشراء."
                : "Upload your artwork, pick colors & sizes, and preview realistic printing before checkout."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-border p-2 text-text-secondary hover:border-accent hover:text-text-primary transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Studio Workspace Grid */}
        <div className="mt-6 grid gap-6 lg:grid-cols-12">
          {/* LEFT: Live Interactive 2D Mockup Canvas (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center rounded-3xl border border-border/80 bg-surface-elevated/80 p-6 relative overflow-hidden min-h-[380px]">
            {/* Color preview background glow */}
            <div
              className="absolute -inset-10 opacity-20 blur-3xl transition-colors duration-500 rounded-full"
              style={{ backgroundColor: selectedColor.hex }}
            />

            {/* Realistic Product Mockup Base */}
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center">
              {/* Product Frame Shape */}
              <div
                className="relative w-64 h-64 rounded-3xl shadow-2xl flex items-center justify-center transition-colors duration-500 border border-black/20"
                style={{
                  backgroundColor: selectedColor.hex,
                  boxShadow: `0 25px 50px -12px ${selectedColor.hex}40`,
                }}
              >
                {/* Surface Highlights & Texture overlay */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-black/20 via-transparent to-white/20 pointer-events-none" />

                {/* Merchandise visual cues based on type */}
                {activeProduct.id === "mug" && (
                  <div
                    className="absolute -end-7 top-14 w-10 h-32 rounded-e-3xl border-4 border-s-0 border-current opacity-80"
                    style={{ color: selectedColor.hex }}
                  />
                )}
                {activeProduct.id === "tote" && (
                  <div
                    className="absolute -top-12 inset-x-14 h-16 rounded-t-full border-4 border-b-0 border-current opacity-70"
                    style={{ color: selectedColor.hex }}
                  />
                )}
                {activeProduct.id === "planner" && (
                  <div className="absolute -start-3 inset-y-4 w-4 flex flex-col justify-between py-2 border-r-2 border-accent/60">
                    {[...Array(8)].map((_, i) => (
                      <span key={i} className="h-2 w-2 rounded-full bg-accent/80" />
                    ))}
                  </div>
                )}

                {/* Print Area Preview Box */}
                <div className="relative z-10 w-40 h-40 flex items-center justify-center p-2 border border-dashed border-accent/40 rounded-2xl bg-black/10 backdrop-blur-[1px]">
                  {uploadedArtwork ? (
                    <img
                      src={uploadedArtwork}
                      alt="Custom Print Preview"
                      className="max-h-full max-w-full object-contain drop-shadow-md transition-all duration-200"
                      style={{
                        transform: `scale(${designScale / 100}) translateY(${designOffsetY}px)`,
                      }}
                    />
                  ) : (
                    <div className="text-center p-3">
                      <Sparkles className="mx-auto h-7 w-7 text-accent/80 animate-pulse mb-1" />
                      <p className="text-[11px] font-semibold text-text-primary">
                        {isAr ? "منطقة الطباعة المخصصة" : "Print Area"}
                      </p>
                      <p className="text-[9px] text-text-secondary mt-0.5">
                        {isAr ? "ارفعي تصميمك للمعاينة الحية" : "Upload design to preview"}
                      </p>
                    </div>
                  )}

                  {/* Optional Custom Name / Foil Text */}
                  {customText && (
                    <div className="absolute bottom-1 font-display text-xs font-bold text-accent drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] tracking-wider uppercase">
                      {customText}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Scale & Adjust Sliders */}
            {uploadedArtwork && (
              <div className="w-full max-w-xs mt-4 flex items-center gap-3 bg-surface/90 px-3 py-1.5 rounded-full border border-border/80 text-xs">
                <ZoomIn className="h-3.5 w-3.5 text-accent shrink-0" />
                <span className="text-[10px] text-text-secondary">
                  {isAr ? "الحجم:" : "Scale:"}
                </span>
                <input
                  type="range"
                  min="40"
                  max="140"
                  value={designScale}
                  onChange={(e) => setDesignScale(Number(e.target.value))}
                  className="flex-1 accent-accent"
                />
                <span className="font-mono text-[10px] text-accent font-semibold">
                  {designScale}%
                </span>
              </div>
            )}
          </div>

          {/* RIGHT: Product Customization Controls (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* 1. Product Type Selector */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-accent mb-2 block">
                {isAr ? "1. نوع المنتج الفلكي" : "1. Select Merchandise"}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {POD_PRODUCTS.map((p) => {
                  const IconComp = p.icon;
                  const isSel = p.id === activeProduct.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setSelectedProductId(p.id);
                        setSelectedColor(p.colors[0]);
                        setSelectedSize(p.sizes[0]);
                      }}
                      className={`flex items-center gap-2 p-2.5 rounded-2xl border text-start transition-all ${
                        isSel
                          ? "border-accent bg-accent/15 text-accent font-bold shadow-xs"
                          : "border-border/70 bg-surface-elevated/40 hover:border-accent/50 text-text-primary"
                      }`}
                    >
                      <IconComp className="h-4 w-4 shrink-0 text-accent" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs truncate">{isAr ? p.nameAr : p.nameEn}</p>
                        <p className="text-[10px] font-mono text-accent">{p.basePrice} EGP</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Upload Artwork or Logo */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-accent mb-1.5 block">
                {isAr ? "2. ارفعي شعارك أو تصميمك" : "2. Upload Design / Artwork"}
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 flex items-center justify-center gap-2 rounded-2xl border border-dashed border-accent/60 bg-accent/10 py-3 px-4 text-xs font-semibold text-accent hover:bg-accent/20 transition-colors"
                >
                  <Upload className="h-4 w-4" />
                  <span>
                    {uploadedArtwork
                      ? isAr
                        ? "تغيير الصورة المرفوعة"
                        : "Replace Image"
                      : isAr
                        ? "رفع صورة (PNG/JPG)"
                        : "Upload File (PNG/JPG)"}
                  </span>
                </button>
                {uploadedArtwork && (
                  <button
                    type="button"
                    onClick={() => setUploadedArtwork(null)}
                    className="rounded-2xl border border-border p-3 text-text-secondary hover:text-rose-400 hover:border-rose-400"
                    title={isAr ? "إزالة الصورة" : "Remove"}
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* 3. Base Color Selection */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-accent mb-1.5 block">
                {isAr ? "3. لون القطعة" : "3. Base Color"}:{" "}
                <span className="text-text-primary font-normal">
                  {isAr ? selectedColor.nameAr : selectedColor.nameEn}
                </span>
              </label>
              <div className="flex items-center gap-2">
                {activeProduct.colors.map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => setSelectedColor(c)}
                    className={`h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 flex items-center justify-center ${
                      selectedColor.hex === c.hex
                        ? "border-accent scale-110 shadow-md ring-2 ring-accent/40"
                        : "border-black/30"
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.nameEn}
                  >
                    {selectedColor.hex === c.hex && (
                      <Check
                        className={`h-4 w-4 ${c.hex === "#F8FAFC" || c.hex === "#FDFBF7" ? "text-black" : "text-white"}`}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Size Selection */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-accent mb-1.5 block">
                {isAr ? "4. المقاس أو السعة" : "4. Size / Capacity"}
              </label>
              <div className="flex flex-wrap gap-1.5">
                {activeProduct.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSelectedSize(s)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                      selectedSize === s
                        ? "bg-accent text-background shadow-xs font-bold"
                        : "bg-surface-elevated border border-border text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* 5. Custom Name / Monogram (Optional) */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-accent mb-1.5 block">
                {isAr ? "5. إضافة اسم مخصص (اختياري)" : "5. Add Name / Monogram (Optional)"}
              </label>
              <input
                type="text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder={isAr ? "مثال: Nora Tamer" : "e.g. Nora Tamer"}
                maxLength={25}
                className="w-full rounded-xl border border-border bg-surface-elevated px-3 py-2 text-xs text-text-primary focus:border-accent focus:outline-hidden"
              />
            </div>

            {/* Price & Add to Cart button */}
            <div className="mt-auto pt-4 border-t border-border/70 flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] text-text-secondary">
                  {isAr ? "السعر الإجمالي:" : "Total Price:"}
                </p>
                <p className="font-display text-xl font-bold text-accent">
                  {formatPrice(activeProduct.basePrice, lang)}
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-accent py-3 px-5 text-xs font-bold text-background uppercase tracking-wider hover:brightness-110 shadow-lg hover:shadow-accent/25 transition-all"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>{isAr ? "إضافة المنتج المخصص للسلة" : "Add Custom POD to Cart"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
