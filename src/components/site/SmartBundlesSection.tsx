import { useState } from "react";
import { Sparkles, ShoppingBag, Check, Gift, ArrowRight, ShieldCheck, Star } from "lucide-react";
import { useCart, formatPrice } from "@/lib/cart";
import { useI18n } from "@/lib/i18n";
import { toast } from "sonner";
import heroStellar from "@/assets/hero-stellar.jpg";
import brandingImg from "@/assets/p-branding.jpg";
import classroomImg from "@/assets/p-classroom.jpg";

export function SmartBundlesSection() {
  const { lang } = useI18n();
  const isAr = lang === "ar";
  const { add, openDrawer } = useCart();
  const [addedBundleId, setAddedBundleId] = useState<string | null>(null);

  const BUNDLES = [
    {
      id: "back-to-school-suite",
      titleEn: "Back-to-School Celestial Bundle",
      titleAr: "باقة العودة للدراسة الفلكية المتكاملة",
      badgeEn: "Save 25% • Best Value",
      badgeAr: "وفر 25% • الباقة الأكثر توفيراً",
      originalPrice: 880,
      bundlePrice: 650,
      image: classroomImg,
      itemsEn: [
        "2026/2027 Spiral Celestial Student Planner (Hardcover)",
        "Stellar Constellation Waterproof Sticker Pack (50 Pcs)",
        "Custom Monogrammed Ceramic Mug with Gold Foil Handle",
        "100% Organic Canvas Tote Bag with Astrological Print",
      ],
      itemsAr: [
        "بلانر طلابي فلكي بغلاف صلب لعام 2026/2027",
        "مجموعة استيكرات الأبراج الفلكية المقاومة للماء (50 قطعة)",
        "مج سيراميك مخصص بالاسم مع مقبض مذهب",
        "حقيبة قماشية توت باج قطنية بطبعة فلكية فريدة",
      ],
    },
    {
      id: "branding-merch-kit",
      titleEn: "Founder & Creative Brand Identity Kit",
      titleAr: "باقة الهوية البصرية والمطبوعات التجارية",
      badgeEn: "Enterprise Suite",
      badgeAr: "باقة رواد الأعمال المتكاملة",
      originalPrice: 3800,
      bundlePrice: 2950,
      image: brandingImg,
      itemsEn: [
        "Primary & Secondary Logo Suite + Brand Color Palette",
        "Typography & Astrological Brand Guidelines Guidebook",
        "100 Premium Luxury Foil Business Cards (Delivered to Doorstep)",
        "2 Branded Studio Ceramic Coffee Mugs with Your Logo",
      ],
      itemsAr: [
        "تصميم الشعار الأساسي والفرعي مع لوحة الألوان والخطوط",
        "دليل الهوية البصرية المتكامل والقواعد الإرشادية",
        "100 كارت شخصي فاخر مطبوع بالورق المذهب وشحن للمنزل",
        "عدد 2 مج سيراميك رسمي مطبوع بشعار علامتك التجارية",
      ],
    },
  ];

  const handleAddBundle = (bundle: (typeof BUNDLES)[0]) => {
    add({
      productId: bundle.id,
      slug: bundle.id,
      name: isAr ? bundle.titleAr : bundle.titleEn,
      price: bundle.bundlePrice,
      image: bundle.image,
      quantity: 1,
      options: {
        variant: isAr ? "باقة متكاملة موفرة" : "Complete Discounted Bundle",
      },
    });
    setAddedBundleId(bundle.id);
    setTimeout(() => setAddedBundleId(null), 2500);
    toast.success(isAr ? "تمت إضافة الباقة المتكاملة بنجاح!" : "Bundle added to cart!");
    openDrawer();
  };

  return (
    <section className="py-12 my-8 border-y border-border/60 bg-surface/50 backdrop-blur-sm relative overflow-hidden">
      {/* Background starlight aura */}
      <div className="pointer-events-none absolute -top-24 end-1/4 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 start-1/4 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs uppercase font-mono tracking-widest text-accent mb-2">
            <Gift className="h-3.5 w-3.5" />
            <span>{isAr ? "باقات ذكية موفرة (AOV Boosters)" : "Smart Value Bundles"}</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-text-primary">
            {isAr
              ? "احصلي على مجموعتك المتكاملة بسعر مخفض"
              : "Curated Bundles with Maximum Savings"}
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-text-secondary">
            {isAr
              ? "اجمعي بين المخططات والاستيكرات والمنتجات المطبوعة في باقة واحدة مع خصم حصري وشحن فوري."
              : "Combine planners, stationery, and custom merch in one discounted package."}
          </p>
        </div>

        {/* Bundles Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {BUNDLES.map((bundle) => {
            const isAdded = addedBundleId === bundle.id;

            return (
              <div
                key={bundle.id}
                className="card-star group relative flex flex-col sm:flex-row overflow-hidden rounded-3xl border border-accent/40 bg-surface/90 shadow-xl transition-all duration-300 hover:border-accent hover:shadow-accent/10"
              >
                {/* Bundle Image */}
                <div className="sm:w-2/5 relative aspect-square sm:aspect-auto overflow-hidden bg-surface-elevated">
                  <img
                    src={bundle.image}
                    alt={bundle.titleEn}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-3 start-3 z-10 rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-bold text-background shadow-md uppercase">
                    {isAr ? bundle.badgeAr : bundle.badgeEn}
                  </div>
                </div>

                {/* Bundle Content */}
                <div className="sm:w-3/5 p-5 sm:p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display text-lg font-bold text-text-primary group-hover:text-accent transition-colors">
                      {isAr ? bundle.titleAr : bundle.titleEn}
                    </h3>

                    {/* Price with strikethrough savings */}
                    <div className="mt-2 flex items-baseline gap-2.5">
                      <span className="font-display text-2xl font-bold text-accent">
                        {formatPrice(bundle.bundlePrice, lang)}
                      </span>
                      <span className="text-xs line-through text-text-secondary/70">
                        {formatPrice(bundle.originalPrice, lang)}
                      </span>
                    </div>

                    {/* Checklist */}
                    <ul className="mt-4 space-y-2 text-xs text-text-secondary">
                      {(isAr ? bundle.itemsAr : bundle.itemsEn).map((it, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="h-3.5 w-3.5 text-accent shrink-0 mt-0.5" />
                          <span className="leading-tight">{it}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Add Bundle Button */}
                  <div className="mt-6 pt-4 border-t border-border/50">
                    <button
                      type="button"
                      onClick={() => handleAddBundle(bundle)}
                      className={`w-full flex items-center justify-center gap-2 rounded-2xl py-3 px-4 text-xs font-bold uppercase tracking-wider transition-all ${
                        isAdded
                          ? "bg-emerald-500 text-white shadow-md"
                          : "bg-accent text-background hover:brightness-110 shadow-lg hover:shadow-accent/25"
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="h-4 w-4" />
                          <span>{isAr ? "تمت إضافة الباقة للسلة!" : "Bundle Added!"}</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="h-4 w-4" />
                          <span>
                            {isAr ? "إضافة الباقة كاملة للسلة" : "Add Complete Bundle to Cart"}
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
