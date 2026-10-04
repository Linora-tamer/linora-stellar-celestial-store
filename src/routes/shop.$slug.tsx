import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  Heart,
  Truck,
  Download,
  ShieldCheck,
  Sparkles,
  ChevronDown,
  ShoppingBag,
  ArrowRight,
  Check,
  Share2,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

import { Star } from "@/components/site/Star";
import { ProductCard } from "@/components/site/ProductCard";
import { ProductReviews } from "@/components/site/ProductReviews";
import { ExpressCheckoutModal } from "@/components/site/ExpressCheckoutModal";
import { formatPrice, useCart } from "@/lib/cart";
import { useI18n } from "@/lib/i18n";
import { useWishlist } from "@/lib/wishlist";
import { productImage } from "@/lib/product-images";
import { CONTACT, productDetails, productsQuery } from "@/lib/store";
import heroStellar from "@/assets/hero-stellar.jpg";
import brandingImg from "@/assets/p-branding.jpg";
import classroomImg from "@/assets/p-classroom.jpg";
import invitationImg from "@/assets/p-invitation.jpg";

const COLORS = [
  { en: "Midnight Navy", ar: "كحلي ليلي", hex: "#0F1626" },
  { en: "Cream", ar: "كريمي", hex: "#F7F3E9" },
  { en: "Gold", ar: "ذهبي", hex: "#D4AF37" },
  { en: "Black", ar: "أسود", hex: "#111111" },
];
const SIZES = ["S", "M", "L", "XL", "XXL"];

export const Route = createFileRoute("/shop/$slug")({
  head: ({ params }) => {
    const title = params.slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    return {
      meta: [
        { title: `${title} — Linora Stellar Celestial Collection` },
        { name: "description", content: `${title} from the Linora Stellar celestial collection.` },
        { property: "og:title", content: `${title} — Linora Stellar` },
        {
          property: "og:description",
          content: `${title} from the Linora Stellar celestial collection.`,
        },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const { data: products = [], isLoading } = useQuery(productsQuery);
  const { t, pick, lang } = useI18n();
  const isAr = lang === "ar";
  const product = products.find((p) => p.slug === slug);
  const cart = useCart();
  const { isWishlisted, toggle: toggleWishlist } = useWishlist();

  const [color, setColor] = useState(COLORS[0]!.en);
  const [size, setSize] = useState(SIZES[1]!);
  const [personalName, setPersonalName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [expressOpen, setExpressOpen] = useState(false);

  // Accordion open states
  const [openAccordion, setOpenAccordion] = useState<string>("details");

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center text-sm text-text-secondary">
        <Sparkles className="mx-auto h-6 w-6 text-accent animate-spin mb-3" />
        <p>{t("product.loading")}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <Star className="mx-auto h-8 w-8 text-accent/60 mb-3" />
        <h1 className="font-display text-4xl text-text-primary">{t("product.notFound")}</h1>
        <p className="mt-2 text-xs text-text-secondary">
          {isAr
            ? "القطعة المطلوبة غير متوفرة حالياً أو تم نقلها."
            : "The celestial piece you are looking for is currently unavailable."}
        </p>
        <Link
          to="/shop"
          className="mt-6 inline-flex rounded-full bg-accent px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-background hover:opacity-90"
        >
          {t("product.back")}
        </Link>
      </div>
    );
  }

  const isApparel = ["stellar-tshirt", "stellar-hoodie", "constellation-tote-bag"].includes(
    product.slug,
  );
  const isDigital =
    product.slug.includes("planner") ||
    product.slug.includes("digital") ||
    product.slug.includes("template") ||
    product.slug.includes("budget") ||
    product.category_id === "cat-1";

  const details = productDetails(product.details);
  const displayName = pick(product, "name");
  const displayTagline = pick(product, "tagline");
  const displayDescription = pick(product, "description");
  const mainImage = productImage(product.slug, product.image_url);

  // High-fidelity gallery images for each product
  const galleryImages = [
    mainImage,
    product.slug.includes("brand") ? brandingImg : heroStellar,
    product.slug.includes("class") || product.slug.includes("kid") ? classroomImg : invitationImg,
  ];

  function addToCart() {
    if (!product) return;
    const options: Record<string, string> = {};
    if (product.customizable) {
      if (isApparel) {
        options[t("product.color")] =
          lang === "ar" ? (COLORS.find((c) => c.en === color)?.ar ?? color) : color;
        options[t("product.size")] = size;
      }
      if (personalName.trim()) {
        options[t("product.nameOrMsg")] = personalName.trim();
      }
    }
    cart.add(
      {
        productId: product.id,
        slug: product.slug,
        name: displayName,
        price: Number(product.price),
        image: product.image_url,
        quantity,
        options,
      },
      true, // Open quick cart slide-over drawer
    );
    toast.success(`${displayName} ${t("product.added")}`);
  }

  // Related products from the same category or catalog
  const relatedProducts = products
    .filter(
      (p) =>
        p.id !== product.id &&
        p.is_active &&
        (p.category_id === product.category_id || p.is_featured),
    )
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-text-secondary">
        <Link to="/" className="hover:text-accent transition-colors">
          {t("nav.home")}
        </Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-accent transition-colors">
          {t("nav.shop")}
        </Link>
        <span>/</span>
        <span className="text-text-primary font-medium truncate max-w-[200px]">{displayName}</span>
      </div>

      <div className="mt-8 grid gap-12 lg:grid-cols-2 items-start">
        {/* ================= LEFT COLUMN: INTERACTIVE GALLERY ================= */}
        <div className="space-y-4">
          {/* Main Selected Image */}
          <div className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-surface-elevated card-star">
            <img
              src={galleryImages[selectedImageIdx] || mainImage}
              alt={displayName}
              width={1024}
              height={1024}
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
            />

            {/* In-image live customization preview */}
            {product.customizable && personalName.trim() && (
              <div className="absolute inset-x-0 bottom-0 bg-background/85 p-4 text-center backdrop-blur-md border-t border-border">
                <p className="font-display text-2xl text-accent font-semibold">{personalName}</p>
                <p className="text-[10px] uppercase tracking-[0.3em] text-text-secondary mt-0.5">
                  {t("product.preview")}
                </p>
              </div>
            )}

            {product.is_featured && (
              <span className="absolute start-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-accent/90 px-3 py-1 text-xs font-semibold text-background shadow-xs">
                <Sparkles className="h-3.5 w-3.5" />
                <span>{isAr ? "مختارات فلكية" : "Celestial Star Pick"}</span>
              </span>
            )}
          </div>

          {/* Gallery Thumbnails */}
          <div className="flex items-center gap-3">
            {galleryImages.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedImageIdx(idx)}
                className={`relative aspect-square h-20 w-20 overflow-hidden rounded-xl border transition-all ${
                  selectedImageIdx === idx
                    ? "border-accent ring-2 ring-accent/30 shadow-xs"
                    : "border-border/70 opacity-70 hover:opacity-100"
                }`}
              >
                <img src={img} alt={`Angle ${idx + 1}`} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* ================= RIGHT COLUMN: PRODUCT INFO & CONTROLS ================= */}
        <div className="space-y-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-accent font-semibold">
              {displayTagline}
            </p>
            <h1 className="mt-2 font-display text-4xl sm:text-5xl text-text-primary leading-tight">
              {displayName}
            </h1>
            <p className="mt-3 text-3xl font-semibold text-accent">
              {formatPrice(Number(product.price), lang)}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-text-secondary">{displayDescription}</p>
          </div>

          {/* Customization Panel (if applicable) */}
          {product.customizable && (
            <div className="space-y-4 rounded-2xl border border-accent/40 bg-surface p-5 card-star">
              <p className="text-xs uppercase tracking-[0.2em] text-accent font-semibold flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                <span>{t("product.makeYours")}</span>
              </p>

              {isApparel && (
                <>
                  <div>
                    <label className="text-xs uppercase tracking-wider text-text-secondary block mb-1.5 font-medium">
                      {t("product.color")}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {COLORS.map((c) => (
                        <button
                          key={c.en}
                          type="button"
                          onClick={() => setColor(c.en)}
                          className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs transition-colors ${
                            color === c.en
                              ? "border-accent bg-accent/15 text-accent font-semibold"
                              : "border-border text-text-secondary hover:border-accent"
                          }`}
                        >
                          <span
                            className="h-3 w-3 rounded-full border border-black/20"
                            style={{ backgroundColor: c.hex }}
                          />
                          <span>{lang === "ar" ? c.ar : c.en}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-wider text-text-secondary block mb-1.5 font-medium">
                      {t("product.size")}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {SIZES.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setSize(s)}
                          className={`h-9 w-10 rounded-lg border text-xs font-semibold transition-colors ${
                            size === s
                              ? "border-accent bg-accent text-background shadow-xs"
                              : "border-border text-text-secondary hover:border-accent"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <div>
                <label
                  htmlFor="personal"
                  className="text-xs uppercase tracking-wider text-text-secondary block mb-1 font-medium"
                >
                  {t("product.nameOrMsg")}
                </label>
                <input
                  id="personal"
                  value={personalName}
                  onChange={(e) => setPersonalName(e.target.value)}
                  maxLength={40}
                  placeholder={t("product.namePlaceholder")}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
                />
              </div>
            </div>
          )}

          {/* Quantity Controls & Add to Cart */}
          <div className="space-y-4 pt-2">
            <div className="flex flex-wrap items-center gap-3">
              {/* Stepper */}
              <div className="flex items-center rounded-full border border-border bg-surface px-1 text-sm">
                <button
                  type="button"
                  className="px-3.5 py-2 text-text-secondary hover:text-accent font-bold"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="w-8 text-center font-semibold text-text-primary">{quantity}</span>
                <button
                  type="button"
                  className="px-3.5 py-2 text-text-secondary hover:text-accent font-bold"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                type="button"
                onClick={addToCart}
                className="flex-1 flex items-center justify-center gap-2 rounded-full bg-accent px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-background hover:opacity-90 shadow-md transition-opacity"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>{t("product.addToCart")}</span>
              </button>

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={() => {
                  toggleWishlist(product);
                  const wishlisted = isWishlisted(product.id) || isWishlisted(product.slug);
                  toast.success(
                    wishlisted
                      ? `${displayName} removed from wishlist`
                      : `${displayName} saved to wishlist!`,
                  );
                }}
                className={`flex h-11 w-11 items-center justify-center rounded-full border transition-all ${
                  isWishlisted(product.id) || isWishlisted(product.slug)
                    ? "border-rose-500/50 bg-rose-500/15 text-rose-500"
                    : "border-border text-text-secondary hover:border-accent hover:text-accent"
                }`}
                aria-label="Toggle wishlist"
              >
                <Heart
                  className={`h-4 w-4 ${
                    isWishlisted(product.id) || isWishlisted(product.slug)
                      ? "fill-rose-500 text-rose-500"
                      : ""
                  }`}
                />
              </button>
            </div>

            {/* Express Buy Now Button (5-Second One-Page Checkout) */}
            <button
              type="button"
              onClick={() => setExpressOpen(true)}
              className="w-full flex items-center justify-center gap-2 rounded-full border border-accent bg-accent/15 px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-accent hover:bg-accent hover:text-background shadow-sm transition-all"
            >
              <Zap className="h-4 w-4 text-amber-400 fill-amber-400 animate-pulse" />
              <span>
                {isAr ? "شراء فوري في 5 ثوانٍ ⚡" : "Express Buy Now ⚡ (5s One-Page Checkout)"}
              </span>
            </button>

            {/* Direct WhatsApp Consultation */}
            <a
              href={`${CONTACT.whatsappLink}?text=${encodeURIComponent(`Hi Nora! I would love to ask about ${displayName} from Linora Stellar.`)}`}
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-2 rounded-full border border-border bg-surface py-2.5 text-xs uppercase tracking-wider text-text-secondary hover:border-accent hover:text-accent transition-colors"
            >
              <span>{t("product.askWhatsApp")}</span>
            </a>
          </div>

          {/* ================= ACCORDION SECTION (Details, Shipping, Care) ================= */}
          <div className="space-y-3 pt-6 border-t border-border/70">
            {/* Accordion 1: Specifications & Details */}
            <div className="rounded-xl border border-border bg-surface overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenAccordion(openAccordion === "details" ? "" : "details")}
                className="w-full flex items-center justify-between p-4 text-start font-semibold text-xs uppercase tracking-wider text-text-primary hover:text-accent transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-accent" />
                  <span>{isAr ? "مواصفات وتفاصيل القطعة" : "Product Specifications"}</span>
                </span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-300 ${
                    openAccordion === "details" ? "rotate-180 text-accent" : ""
                  }`}
                />
              </button>
              {openAccordion === "details" && (
                <div className="p-4 pt-0 text-xs sm:text-sm text-text-secondary space-y-2 border-t border-border/50">
                  {details.length > 0 ? (
                    <ul className="space-y-1.5 pt-2">
                      {details.map((d, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <Star className="h-3 w-3 text-accent shrink-0" />
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="pt-2">
                      {isAr
                        ? "تصميم فلكي أصلي عالي الجودة مطبوع أو مجهز للتنزيل الفوري بأعلى معايير الدقة."
                        : "Original Linora Stellar artwork crafted with archival-grade materials and vector clarity."}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Accordion 2: Shipping & Delivery Times */}
            <div className="rounded-xl border border-border bg-surface overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenAccordion(openAccordion === "shipping" ? "" : "shipping")}
                className="w-full flex items-center justify-between p-4 text-start font-semibold text-xs uppercase tracking-wider text-text-primary hover:text-accent transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-accent" />
                  <span>{isAr ? "الشحن والتوصيل بمحافظات مصر" : "Egypt Delivery & Dispatch"}</span>
                </span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-300 ${
                    openAccordion === "shipping" ? "rotate-180 text-accent" : ""
                  }`}
                />
              </button>
              {openAccordion === "shipping" && (
                <div className="p-4 pt-0 text-xs text-text-secondary space-y-2 border-t border-border/50">
                  {isDigital ? (
                    <p className="pt-2 text-emerald-400 font-medium">
                      ✦{" "}
                      {isAr
                        ? "هذا منتج رقمي يُسلّم فورياً بعد الدفع بدون أي مصاريف شحن."
                        : "Instant digital file: Zero shipping fee. Delivered immediately after checkout."}
                    </p>
                  ) : (
                    <div className="pt-2 space-y-2 leading-relaxed">
                      <p>
                        <strong className="text-text-primary">القاهرة والجيزة:</strong> 24–48 ساعة
                        عمل (توصيل للمنزل).
                      </p>
                      <p>
                        <strong className="text-text-primary">الإسكندرية والبحيرة:</strong> 2–3 أيام
                        عمل.
                      </p>
                      <p>
                        <strong className="text-text-primary">
                          محافظات الدلتا والقناة والصعيد:
                        </strong>{" "}
                        3–5 أيام عمل مع معاينة الشحنة.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Accordion 3: Digital Download & Care */}
            <div className="rounded-xl border border-border bg-surface overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenAccordion(openAccordion === "care" ? "" : "care")}
                className="w-full flex items-center justify-between p-4 text-start font-semibold text-xs uppercase tracking-wider text-text-primary hover:text-accent transition-colors"
              >
                <span className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-accent" />
                  <span>{isAr ? "إرشادات الطباعة والاستخدام" : "Printing & File Guidelines"}</span>
                </span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-300 ${
                    openAccordion === "care" ? "rotate-180 text-accent" : ""
                  }`}
                />
              </button>
              {openAccordion === "care" && (
                <div className="p-4 pt-0 text-xs text-text-secondary space-y-2 border-t border-border/50 pt-2">
                  <p>
                    {isAr
                      ? "ننصح بطباعة الملفات الرقمية على ورق بوزن 200 إلى 250 جم مات أو حريري للحصول على بريق ذهبي فلكي متألق."
                      : "For best results, print on 200–250 gsm matte or heavy satin paper with CMYK rich color settings."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Verified Customer Reviews Section */}
      <div className="mt-16">
        <ProductReviews productSlug={product.slug} productName={displayName} />
      </div>

      {/* ================= RELATED PRODUCTS SECTION ================= */}
      {relatedProducts.length > 0 && (
        <section className="mt-20 border-t border-border/60 pt-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-accent">
                {isAr ? "مختارات إضافية" : "Complementary Designs"}
              </p>
              <h2 className="mt-1 font-display text-3xl sm:text-4xl text-text-primary">
                {isAr ? "قد يعجبكِ أيضاً" : "Related Celestial Pieces"}
              </h2>
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-accent hover:underline font-semibold"
            >
              <span>{isAr ? "تصفح الكل" : "View Catalog"}</span>
              <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* 5-Second One-Page Express Checkout Modal */}
      <ExpressCheckoutModal
        product={product}
        isOpen={expressOpen}
        onClose={() => setExpressOpen(false)}
        selectedColor={color}
        selectedSize={size}
        personalName={personalName}
      />
    </div>
  );
}
