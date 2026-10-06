import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  ArrowRight,
  Sparkles,
  Palette,
  Truck,
  Layers,
  BookOpen,
  Shirt,
  Stamp,
  Heart,
  Compass,
  CheckCircle2,
  Paintbrush,
  PenTool,
  Package,
  Moon,
} from "lucide-react";

import hero from "@/assets/hero-stellar.jpg";
import { ProductCard } from "@/components/site/ProductCard";
import { FeaturedCarousel } from "@/components/site/FeaturedCarousel";
import { NewsletterSignup } from "@/components/site/NewsletterSignup";
import { TiltCard } from "@/components/site/TiltCard";
import { Star } from "@/components/site/Star";
import { categoriesQuery, productsQuery } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";
import { CosmicReveal, useAutoCosmicScrollReveal } from "@/components/site/CosmicReveal";
import {
  getLunarPhase,
  MoonPhaseSvg,
  LunarPhaseTrackerModal,
} from "@/components/site/LunarPhaseTracker";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Linora Stellar — Where Creativity Meets the Stars" },
      {
        name: "description",
        content:
          "Shop Linora Stellar: celestial navy-and-gold printables, stationery, school packs, bespoke branding and custom merchandise designed in Egypt.",
      },
      { property: "og:title", content: "Linora Stellar — Celestial Design Store" },
      {
        property: "og:description",
        content:
          "Where creativity meets the stars. High-touch printables, branding, and custom stationery.",
      },
    ],
  }),
  component: Home,
});

const WHAT_WE_DO_SERVICES = [
  {
    id: "branding",
    categorySlug: "branding",
    icon: Palette,
    titleEn: "Branding & Identity",
    titleAr: "الهوية البصرية والعلامات التجارية",
    descEn:
      "Bespoke logo suites, typography guidelines, celestial patterns and social media templates built for distinction.",
    descAr:
      "تصميم باقات لوجو متكاملة، أنماط فلكية راقية، خطوط وقوالب سوشيال ميديا تمنح مشروعك حضوراً لا يُنسى.",
    deliverables: ["Full Logo Suite", "Color & Typography Guide", "Social Templates"],
  },
  {
    id: "graphic",
    categorySlug: "print",
    icon: Layers,
    titleEn: "Graphic Design",
    titleAr: "التصميم الجرافيكي المطبوع",
    descEn:
      "Editorial layouts, brochures, marketing collaterals, and high-impact packaging artwork.",
    descAr: "مطبوعات دعائية، بروشورات فاخرة، وتغليف منتجات يعكس الفخامة والأناقة في أدق التفاصيل.",
    deliverables: ["Packaging Design", "Marketing Collateral", "Editorial Layouts"],
  },
  {
    id: "digital",
    categorySlug: "digital",
    icon: Sparkles,
    titleEn: "Digital Products",
    titleAr: "المنتجات الرقمية والتنزيلات",
    descEn:
      "Instant-download digital planners, undated journals, budget trackers, and editable Canva kits.",
    descAr:
      "مخططات تنظيمية فورية التحميل، دفاتر متابعة ميزانية، وقوالب كانفا قابلة للتعديل بضغطة زر.",
    deliverables: ["300 DPI PDF Files", "GoodNotes / iPad Ready", "Canva Links"],
  },
  {
    id: "school",
    categorySlug: "kids",
    icon: BookOpen,
    titleEn: "School Products",
    titleAr: "مطبوعات الفصول والأطفال",
    descEn:
      "Engaging activity workbooks, classroom charts, constellation dot-to-dot games, and star stickers.",
    descAr:
      "كتب أنشطة تفاعلية للأطفال، لوحات تحفيز للفصول المدرسية، وألعاب فلكية تشعل فضول النجوم الصغار.",
    deliverables: ["Classroom Packs", "Kids Activity Books", "Reward Star Charts"],
  },
  {
    id: "stationery",
    categorySlug: "print",
    icon: Stamp,
    titleEn: "Custom Stationery",
    titleAr: "أدوات مكتبية ودعوات مخصصة",
    descEn:
      "Bespoke wedding and celebration invitations, thank-you cards, luxury product labels, and notebooks.",
    descAr: "دعوات زفاف ومناسبات راقية، كروت شكر، ملصقات منتجات فاخرة، ودفاتر مخصصة بالاسم.",
    deliverables: ["Wax-Seal Ready Cards", "Personalized Names", "Foil Stamping"],
  },
  {
    id: "merch",
    categorySlug: "merch",
    icon: Shirt,
    titleEn: "Custom Merch & More",
    titleAr: "منتجات وتيشيرتات حصرية",
    descEn:
      "Signature constellation t-shirts, ceramic mugs, tote bags and hoodies with custom name embroidery.",
    descAr:
      "تيشيرتات فلكية قطنية، مجات سيراميك، وحقائب قماشية قابلة للتخصيص باسمك أو عبارتك المفضلة.",
    deliverables: ["Heavyweight Cotton", "Durable Prints", "Custom Embroidery"],
  },
];

function getCelestialGreeting(period: string, isAr: boolean) {
  if (period === "dawn" || period === "sunrise") {
    return {
      greeting: isAr ? "إشراقة فجر فلكي مبارك 🌅" : "Good Dawn, Stargazer 🌅",
      tagline: isAr
        ? "حيث يلتقي الإبداع بنجوم السماء — أولى خيوط النور توقظ الأفكار والإلهام."
        : "Where creativity meets the stars — Gentle lavender skies awaken fresh inspiration.",
      timeNote: isAr ? "الفجر: 4:00 ص – 8:00 ص" : "Dawn: 4:00 AM – 8:00 AM",
      badge: isAr ? "طور الفجر الفلكي" : "Dawn Phase",
    };
  }
  if (
    period === "daylight" ||
    period === "morning" ||
    period === "forenoon" ||
    period === "noon" ||
    period === "afternoon"
  ) {
    return {
      greeting: isAr ? "نهار فلكي مشرق ووضّاء ☀️" : "Radiant Daylight Hours ☀️",
      tagline: isAr
        ? "حيث يلتقي الإبداع بنجوم السماء — وضوح ذهبي وإنتاجية متألقة في كل عمل."
        : "Where creativity meets the stars — Solar clarity bringing brilliance to every design.",
      timeNote: isAr ? "وضح النهار: 8:00 ص – 5:00 م" : "Daylight: 8:00 AM – 5:00 PM",
      badge: isAr ? "طور النهار النشط" : "Daylight Phase",
    };
  }
  if (period === "sunset" || period === "dusk" || period === "twilight" || period === "evening") {
    return {
      greeting: isAr ? "أمسية شفق عنبري ساحر 🌙" : "Golden Twilight Sunset 🌙",
      tagline: isAr
        ? "حيث يلتقي الإبداع بنجوم السماء — هدوء المساء وسحر الحكايات الفلكية."
        : "Where creativity meets the stars — Twilight purple and warm amber reflections.",
      timeNote: isAr ? "الغروب: 5:00 م – 10:00 م" : "Sunset: 5:00 PM – 10:00 PM",
      badge: isAr ? "طور الغروب الشفقي" : "Sunset Phase",
    };
  }
  return {
    greeting: isAr ? "سحر منتصف الليل الفلكي 🌌" : "Midnight Starry Glow 🌌",
    tagline: isAr
      ? "حيث يلتقي الإبداع بنجوم السماء — ضوء في منتصف الليل يضيء إبداعك."
      : "Where creativity meets the stars — Light in the midnight.",
    timeNote: isAr ? "منتصف الليل: 10:00 م – 4:00 ص" : "Midnight: 10:00 PM – 4:00 AM",
    badge: isAr ? "طور منتصف الليل الأساسي" : "Midnight Primary",
  };
}

const PRODUCT_TABS = [
  { id: "all", labelEn: "All Stellar Pieces", labelAr: "كل المنتجات الفلكية" },
  { id: "labels", labelEn: "Custom Labels", labelAr: "ملصقات وستيكرات" },
  { id: "notebooks", labelEn: "Notebook Designs", labelAr: "دفاتر ومخططات" },
  { id: "digital", labelEn: "Digital Products", labelAr: "منتجات رقمية" },
  { id: "school", labelEn: "School Products", labelAr: "أدوات مدرسية" },
] as const;

function Home() {
  useAutoCosmicScrollReveal();
  const { data: products = [] } = useQuery(productsQuery);
  const { data: categories = [] } = useQuery(categoriesQuery);
  const { t, pick, lang } = useI18n();
  const { config, period, localTime } = useTheme();
  const isAr = lang === "ar";

  const [activeTab, setActiveTab] = useState<string>("all");
  const [lunarModalOpen, setLunarModalOpen] = useState(false);

  const featured = products.filter((p) => p.is_featured && p.is_active);
  const celestialGreeting = getCelestialGreeting(period, isAr);
  const lunar = getLunarPhase();

  // Filter products by activeTab
  const filteredProducts = products.filter((p) => {
    if (!p.is_active) return false;
    if (activeTab === "all") return true;
    const s = `${p.slug} ${p.category_id || ""} ${p.name}`.toLowerCase();
    if (activeTab === "labels") {
      return s.includes("label") || s.includes("sticker") || s.includes("print");
    }
    if (activeTab === "notebooks") {
      return (
        s.includes("notebook") ||
        s.includes("journal") ||
        s.includes("planner") ||
        s.includes("trio")
      );
    }
    if (activeTab === "digital") {
      return s.includes("digital") || p.category_id === "cat-1";
    }
    if (activeTab === "school") {
      return (
        s.includes("school") ||
        s.includes("classroom") ||
        s.includes("kids") ||
        p.category_id === "cat-3"
      );
    }
    return true;
  });

  return (
    <div className="relative z-10">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/50">
        <img
          src={hero}
          alt="Celestial midnight starry sky"
          width={1600}
          height={912}
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
        {/* Dynamic theme hero gradient overlay */}
        <div
          className="absolute inset-0 transition-all duration-1000 ease-out"
          style={{ background: config.heroOverlay }}
          suppressHydrationWarning
        />
        <div className="absolute inset-0 bg-linear-to-r rtl:bg-linear-to-l from-background via-background/85 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:py-20 lg:px-8 lg:py-24">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">
            {/* Left Content Column */}
            <div className="max-w-2xl text-start">
              {/* Dynamic Time-Based Greeting Banner */}
              <div
                className="welcome-slug inline-flex items-center flex-wrap gap-2 rounded-full border border-accent/40 bg-surface/85 px-4 py-1.5 text-xs text-accent backdrop-blur-md shadow-xs transition-all duration-700"
                suppressHydrationWarning
              >
                <span className="flex h-2 w-2 rounded-full bg-accent animate-ping" />
                <Star className="h-3.5 w-3.5 text-accent animate-pulse" />
                <span className="font-semibold">{celestialGreeting.greeting}</span>
                <span className="opacity-40">•</span>
                <span
                  className="font-mono text-[11px] text-text-secondary"
                  suppressHydrationWarning
                >
                  {localTime ? `${localTime}` : "Local Clock"} ({celestialGreeting.timeNote})
                </span>
                <span className="opacity-40 hidden sm:inline">•</span>
                <span
                  className="font-mono text-[10px] uppercase text-accent border border-accent/30 rounded-full px-2 py-0.2 bg-accent/10 hidden sm:inline"
                  suppressHydrationWarning
                >
                  {isAr ? config.nameAr : config.name}
                </span>
                <span className="opacity-40 hidden md:inline">•</span>
                <button
                  type="button"
                  onClick={() => setLunarModalOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/15 px-2.5 py-0.5 text-[11px] text-accent hover:bg-accent hover:text-background transition-all shadow-xs cursor-pointer"
                  title={isAr ? "افتح راصد أطوار القمر الفلكي" : "Open Lunar Phase Tracker"}
                >
                  <span className="text-xs">{lunar.emoji}</span>
                  <span className="font-medium">{isAr ? lunar.nameAr : lunar.name}</span>
                  <span className="font-mono text-[10px] opacity-80">({lunar.illumination}%)</span>
                </button>
              </div>

              {/* Main Heading & Subtitle */}
              <div className="mt-6">
                <p className="text-xs uppercase tracking-[0.35em] text-accent font-semibold flex items-center gap-2">
                  <span>LINORA STELLAR</span>
                  <span className="opacity-40">•</span>
                  <span>
                    {isAr ? "حيث يلتقي الإبداع بنجوم السماء" : "Where Creativity Meets The Stars"}
                  </span>
                </p>
                <h1 className="mt-2 font-display text-5xl sm:text-6xl lg:text-7xl leading-[1.08] text-text-primary tracking-tight font-bold">
                  LINORA STELLAR
                  <span className="block text-gradient-gold text-2xl sm:text-3xl lg:text-4xl mt-3 font-medium">
                    {isAr
                      ? "حيث يلتقي الإبداع بنجوم السماء — ضوء في منتصف الليل"
                      : "Where creativity meets the stars — Light in the midnight"}
                  </span>
                </h1>
              </div>

              <p className="mt-5 max-w-lg text-base sm:text-lg leading-relaxed text-text-secondary">
                {isAr
                  ? "منتجات رقمية مخصصة، هويات بصرية، وأدوات مكتبية ومدرسية مصممة لتضيء عالمك كل يوم."
                  : "Custom digital products, branding identities, and stationery designed to bring light to your everyday universe."}
              </p>

              {/* Glowing CTA Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="#featured-products"
                  className="cta-btn group inline-flex items-center gap-2"
                >
                  <span>{isAr ? "استكشفي التشكيلة الفلكية" : "Explore Collection"}</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                </a>
                <Link
                  to="/custom-orders"
                  className="inline-flex items-center gap-2 rounded-full border border-accent/60 bg-surface/80 px-6 py-3.5 text-xs sm:text-sm font-semibold text-text-primary backdrop-blur-md transition-all hover:bg-accent hover:text-background hover:border-accent hover:shadow-lg hover:shadow-accent/20"
                >
                  <Sparkles className="h-4 w-4 text-accent" />
                  <span>{isAr ? "طلب تصميم مخصص" : "Order Custom Design"}</span>
                </Link>
              </div>

              {/* Dual Persona Paths */}
              <div className="mt-9 grid sm:grid-cols-2 gap-4 max-w-xl">
                {/* Path 1: E-commerce Store */}
                <Link
                  to="/shop"
                  className="group relative flex flex-col justify-between p-5 rounded-2xl border border-accent/40 bg-surface/85 backdrop-blur-md shadow-lg transition-all hover:border-accent hover:shadow-accent/20 hover:-translate-y-0.5"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">🛍️</span>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-accent border border-accent/30 rounded-full px-2 py-0.5 bg-accent/10">
                        {isAr ? "متجر المنتجات" : "Brand Store"}
                      </span>
                    </div>
                    <h2 className="mt-3 font-display text-xl text-text-primary group-hover:text-accent transition-colors font-semibold">
                      {isAr ? "تسوقي منتجاتنا 🛍️" : "Shop Our Products 🛍️"}
                    </h2>
                    <p className="mt-1 text-xs text-text-secondary leading-relaxed">
                      {isAr
                        ? "ملصقات مقاومة للماء، دفاتر، هوديز، ومجات جاهزة للشحن."
                        : "Stationery, planners, labels, hoodies, and starry printables."}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-accent group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform">
                    <span>{isAr ? "دخول المتجر فوراً" : "Browse All Items"}</span>
                    <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
                  </div>
                </Link>

                {/* Path 2: Custom Design Services */}
                <Link
                  to="/custom-orders"
                  className="group relative flex flex-col justify-between p-5 rounded-2xl border border-border/80 bg-surface/85 backdrop-blur-md shadow-lg transition-all hover:border-accent hover:shadow-accent/20 hover:-translate-y-0.5"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">🎨</span>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-accent border border-accent/30 rounded-full px-2 py-0.5 bg-accent/10">
                        {isAr ? "استوديو التصميم" : "Design Studio"}
                      </span>
                    </div>
                    <h2 className="mt-3 font-display text-xl text-text-primary group-hover:text-accent transition-colors font-semibold">
                      {isAr ? "اطلبي تصميمك الخاص 🎨" : "Order Your Custom Design 🎨"}
                    </h2>
                    <p className="mt-1 text-xs text-text-secondary leading-relaxed">
                      {isAr
                        ? "هويات بصرية، لوجوهات، مطبوعات حفلات، ومساعد ذكي للطلب."
                        : "Bespoke logos, brand identities, event graphics, & AI wizard."}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-accent group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform">
                    <span>{isAr ? "بدء طلب مخصص" : "Start Custom Project"}</span>
                    <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
                  </div>
                </Link>
              </div>
            </div>

            {/* Right Showcase Column with Rotating Halo Ring & 3D Tilt Floating Card */}
            <div className="hero-showcase relative flex items-center justify-center py-10 lg:py-0 animate-float-slow">
              {/* Rotating Starry Halo Ring */}
              <div className="halo-ring" />

              {/* Floating Celestial Badge 1 (Top Left) */}
              <div className="absolute -top-3 -left-4 sm:-left-8 z-20 rounded-full border border-accent/60 bg-surface/90 px-3.5 py-1.5 text-xs text-accent shadow-xl backdrop-blur-md animate-float flex items-center gap-1.5 font-medium">
                <Sparkles className="h-3.5 w-3.5 text-accent animate-pulse" />
                <span>{isAr ? "ضوء في منتصف الليل" : "Light in the Midnight"}</span>
              </div>

              {/* Floating Celestial Badge 2 (Bottom Right) */}
              <div className="absolute -bottom-4 -right-4 sm:-right-8 z-20 rounded-full border border-accent/60 bg-surface/90 px-3.5 py-1.5 text-xs text-text-primary shadow-xl backdrop-blur-md animate-float-delayed flex items-center gap-1.5 font-medium">
                <Star className="h-3.5 w-3.5 text-accent animate-pulse" />
                <span className="text-accent font-semibold">
                  {isAr ? "إبداع فلكي نقي" : "Pure Cosmic Craft"}
                </span>
              </div>

              {/* 3D Tilt Glare Showcase Card */}
              <TiltCard className="w-[300px] sm:w-[340px] p-8 text-center shadow-2xl border-accent/40 bg-surface/90">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/15 border border-accent/40 text-accent mb-5 shadow-xs">
                  <Star className="h-8 w-8 text-accent animate-pulse" />
                </div>
                <div className="inline-block rounded-full bg-accent/10 px-3 py-1 text-[11px] font-mono uppercase tracking-widest text-accent mb-2">
                  {isAr ? "المجموعة المتميزة" : "Featured Spotlight"}
                </div>
                <h3 className="font-display text-2xl text-text-primary mb-2 font-bold">
                  {isAr ? "المجموعة الفلكية" : "Stellar Collection"}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed mb-5">
                  {isAr
                    ? "دفاتر فاخرة وملصقات مخصصة باسمك وتصاميم فلكية."
                    : "Notebooks & Labels crafted to elevate your daily creativity."}
                </p>
                <a
                  href="#featured-products"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-accent hover:underline"
                >
                  <span>{isAr ? "تصفحي التشكيلة" : "View Collection"}</span>
                  <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
                </a>
              </TiltCard>
            </div>
          </div>
        </div>
      </section>

      {/* 🛍️ CUSTOM DESIGNS CATEGORIES SECTION */}
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8" id="shop">
        <CosmicReveal direction="up">
          <div className="text-center mb-10">
            <p className="flex items-center justify-center gap-2 text-xs uppercase tracking-[0.3em] text-accent mb-2">
              <Sparkles className="h-4 w-4" />
              <span>{isAr ? "مجالات الإبداع" : "Creative Specialties"}</span>
            </p>
            <h2 className="section-title font-display text-3xl sm:text-4xl lg:text-5xl text-accent font-bold">
              {isAr ? "التصاميم والمنتجات المخصصة" : "Custom Designs"}
            </h2>
            <p className="mt-2 text-sm text-text-secondary max-w-md mx-auto">
              {isAr
                ? "استكشفي فئاتنا الأربع الرائدة من تصاميم الهوية إلى الأدوات المدرسية والرقمية."
                : "Explore our four signature design disciplines, crafted with celestial precision."}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Card 1: Branding & Identity */}
            <Link to="/custom-orders" className="block group">
              <TiltCard className="h-full flex flex-col justify-between text-center p-6 border-border/80 hover:border-accent hover:shadow-xl transition-all">
                <div>
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/15 text-accent mb-4 group-hover:scale-110 transition-transform animate-float">
                    <Paintbrush className="h-7 w-7 text-accent" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-text-primary mb-2 group-hover:text-accent transition-colors">
                    {isAr ? "الهوية البصرية والعلامات" : "Branding & Identity"}
                  </h3>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {isAr
                      ? "هويات بصرية استثنائية ولوجوهات متكاملة للعلامات التجارية."
                      : "Unique visual identities for brands and creators."}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-border/50 text-[11px] font-semibold text-accent flex items-center justify-center gap-1">
                  <span>{isAr ? "طلب هوية" : "Start Identity"}</span>
                  <ArrowRight className="h-3 w-3 rtl:rotate-180" />
                </div>
              </TiltCard>
            </Link>

            {/* Card 2: Graphic Design */}
            <Link to="/custom-orders" className="block group">
              <TiltCard className="h-full flex flex-col justify-between text-center p-6 border-border/80 hover:border-accent hover:shadow-xl transition-all">
                <div>
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/15 text-accent mb-4 group-hover:scale-110 transition-transform animate-float-delayed">
                    <PenTool className="h-7 w-7 text-accent" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-text-primary mb-2 group-hover:text-accent transition-colors">
                    {isAr ? "التصميم الجرافيكي" : "Graphic Design"}
                  </h3>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {isAr
                      ? "أعمال فنية رقمية وأصول جاهزة للطباعة والتسويق."
                      : "Digital artwork & print ready assets for all occasions."}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-border/50 text-[11px] font-semibold text-accent flex items-center justify-center gap-1">
                  <span>{isAr ? "طلب تصميم" : "Order Artwork"}</span>
                  <ArrowRight className="h-3 w-3 rtl:rotate-180" />
                </div>
              </TiltCard>
            </Link>

            {/* Card 3: Digital Products */}
            <Link to="/shop" search={{ category: "digital" }} className="block group">
              <TiltCard className="h-full flex flex-col justify-between text-center p-6 border-border/80 hover:border-accent hover:shadow-xl transition-all">
                <div>
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/15 text-accent mb-4 group-hover:scale-110 transition-transform animate-float">
                    <Package className="h-7 w-7 text-accent" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-text-primary mb-2 group-hover:text-accent transition-colors">
                    {isAr ? "المنتجات الرقمية" : "Digital Products"}
                  </h3>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {isAr
                      ? "كتب إلكترونية، منظمات، ستيكرات وخطوط فلكية جاهزة للتحميل."
                      : "E-books, digital planners & printable stickers."}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-border/50 text-[11px] font-semibold text-accent flex items-center justify-center gap-1">
                  <span>{isAr ? "تصفح المنتجات" : "Browse Digital"}</span>
                  <ArrowRight className="h-3 w-3 rtl:rotate-180" />
                </div>
              </TiltCard>
            </Link>

            {/* Card 4: School Products */}
            <Link to="/shop" search={{ category: "school" }} className="block group">
              <TiltCard className="h-full flex flex-col justify-between text-center p-6 border-border/80 hover:border-accent hover:shadow-xl transition-all">
                <div>
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/15 text-accent mb-4 group-hover:scale-110 transition-transform animate-float-delayed">
                    <BookOpen className="h-7 w-7 text-accent" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-text-primary mb-2 group-hover:text-accent transition-colors">
                    {isAr ? "الأدوات المدرسية والستيكرز" : "School Products"}
                  </h3>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {isAr
                      ? "أدوات مكتبية مخصصة وملصقات أسماء مقاومة للماء للطلاب."
                      : "Custom stationery, water-resistant name labels & gear."}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-border/50 text-[11px] font-semibold text-accent flex items-center justify-center gap-1">
                  <span>{isAr ? "عرض الأدوات" : "Shop Stationery"}</span>
                  <ArrowRight className="h-3 w-3 rtl:rotate-180" />
                </div>
              </TiltCard>
            </Link>
          </div>
        </CosmicReveal>
      </section>

      {/* 🌟 INTERACTIVE FEATURED PRODUCTS GRID */}
      <section
        className="mx-auto max-w-7xl px-4 py-16 lg:px-8 border-t border-border/50"
        id="featured-products"
      >
        <CosmicReveal direction="up">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <p className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-accent font-semibold mb-2">
                <Star className="h-4 w-4 fill-accent/30 text-accent animate-pulse" />
                <span>{isAr ? "مختارات فلكية جاهزة للشحن" : "Interactive Store Grid"}</span>
              </p>
              <h2 className="section-title font-display text-3xl sm:text-4xl lg:text-5xl text-text-primary font-bold">
                {isAr ? "المنتجات الفلكية الأكثر طلباً" : "Featured Products Grid"}
              </h2>
              <p className="mt-2 text-sm text-text-secondary max-w-xl">
                {isAr
                  ? "ملصقات منتجات فاخرة، دفاتر مخصصة، وتنزيلات رقمية جاهزة للإضافة المباشرة إلى سلتك."
                  : "Bespoke custom labels, notebook designs, planners, and digital products ready to add directly to your cart."}
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl border border-border/80 bg-surface/80 backdrop-blur-md">
              {PRODUCT_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-medium transition-all ${
                    activeTab === tab.id
                      ? "bg-accent text-background font-semibold shadow-xs"
                      : "text-text-secondary hover:text-text-primary hover:bg-surface-elevated/70"
                  }`}
                >
                  {isAr ? tab.labelAr : tab.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Product Cards Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {filteredProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 rounded-2xl border border-dashed border-border/70 bg-surface/40">
              <Star className="mx-auto h-8 w-8 text-accent/50 animate-pulse mb-3" />
              <p className="text-sm text-text-secondary">
                {isAr
                  ? "لا توجد منتجات في هذا القسم حالياً."
                  : "No products found in this category."}
              </p>
            </div>
          )}

          <div className="mt-12 text-center">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 rounded-full border border-accent/60 bg-surface/80 px-8 py-3 text-xs uppercase tracking-[0.2em] font-semibold text-accent backdrop-blur-md hover:bg-accent hover:text-background transition-all shadow-md hover:shadow-accent/20"
            >
              <span>{isAr ? "عرض جميع منتجات المتجر" : "Explore Entire Shop Catalog"}</span>
              <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </Link>
          </div>
        </CosmicReveal>
      </section>

      {/* 🌙 LUNAR PHASE TRACKER & COSMIC RHYTHM SECTION */}
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8 border-t border-border/50">
        <CosmicReveal direction="up">
          <div className="relative overflow-hidden rounded-3xl border border-accent/40 bg-surface/90 p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
            {/* Ambient Background glow */}
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/15 blur-3xl pointer-events-none" />
            <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-accent/10 blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
              {/* Left: Moon Graphic & Live Metrics */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-start">
                <div className="relative p-2.5 rounded-2xl bg-surface-elevated/80 border border-accent/30 shadow-inner group shrink-0">
                  <MoonPhaseSvg
                    phaseIndex={lunar.phaseIndex}
                    illumination={lunar.illumination}
                    size={88}
                  />
                  <span className="absolute -top-1.5 -end-1.5 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-accent" />
                  </span>
                </div>

                <div>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-3 py-1 text-[11px] font-mono uppercase tracking-widest text-accent border border-accent/30">
                    <Moon className="h-3 w-3 text-accent animate-pulse" />
                    <span>{isAr ? "راصد أطوار القمر المباشر" : "Live Lunar Tracker"}</span>
                    <span className="opacity-40">•</span>
                    <span>
                      {lunar.illumination}% {isAr ? "إضاءة" : "Illuminated"}
                    </span>
                  </div>

                  <h3 className="mt-2 font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-text-primary">
                    {isAr ? `طور ${lunar.nameAr}` : `Current Phase: ${lunar.name}`} {lunar.emoji}
                  </h3>

                  <p className="mt-1 text-xs sm:text-sm text-text-secondary max-w-md leading-relaxed">
                    {isAr
                      ? `عمر القمر: ${lunar.ageDays} يوماً في الدورة الاقترانية • متبقي ${lunar.daysToFullMoon} أيام حتى اكتمال البدر القادم.`
                      : `Moon Age: ${lunar.ageDays} days in synodic cycle • ${lunar.daysToFullMoon} days until next Full Moon.`}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-3 text-xs justify-center sm:justify-start">
                    <div className="rounded-xl border border-border/70 bg-surface/60 px-3.5 py-1.5">
                      <span className="text-text-secondary text-[10px] block uppercase tracking-wider">
                        {isAr ? "البدر القادم" : "Next Full Moon"}
                      </span>
                      <span className="font-mono font-bold text-accent">
                        {lunar.daysToFullMoon} {isAr ? "أيام" : "days"}
                      </span>
                    </div>
                    <div className="rounded-xl border border-border/70 bg-surface/60 px-3.5 py-1.5">
                      <span className="text-text-secondary text-[10px] block uppercase tracking-wider">
                        {isAr ? "المحاق القادم" : "Next New Moon"}
                      </span>
                      <span className="font-mono font-bold text-text-primary">
                        {lunar.daysToNewMoon} {isAr ? "أيام" : "days"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Creative Ritual & Interactive Trigger */}
              <div className="lg:max-w-md w-full rounded-2xl border border-border/80 bg-surface-elevated/70 p-5 shadow-xs">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-accent font-semibold mb-2">
                  <Sparkles className="h-3.5 w-3.5 text-accent" />
                  <span>{isAr ? "طقس الإبداع الفلكي اليوم:" : "Today's Creative Alignment:"}</span>
                </div>

                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                  {isAr ? lunar.creativeRitualAr : lunar.creativeRitualEn}
                </p>

                <div className="mt-4 pt-3 border-t border-border/50 flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setLunarModalOpen(true)}
                    className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-xs font-bold text-background hover:brightness-110 transition-all shadow-xs cursor-pointer"
                  >
                    <Compass className="h-3.5 w-3.5" />
                    <span>{isAr ? "استكشاف أطوار القمر الـ 8" : "Explore All 8 Phases"}</span>
                  </button>

                  <a
                    href="#featured-products"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline ms-auto sm:ms-0"
                  >
                    <span>{isAr ? "المنتجات المتناغمة" : "Harmonized Pieces"}</span>
                    <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </CosmicReveal>
      </section>

      {/* Featured Designs Carousel */}
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <FeaturedCarousel products={featured.length > 0 ? featured : products} />
      </section>

      {/* What We Do Section */}
      <section className="border-t border-border/60 bg-surface/30 py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border/60 pb-6">
            <div>
              <p className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-accent">
                <Compass className="h-3.5 w-3.5" />
                <span>{isAr ? "ماذا نقدم لكِ" : "What We Do"}</span>
              </p>
              <h2 className="mt-2 font-display text-4xl sm:text-5xl text-text-primary">
                {isAr ? "خدمات ومنتجات لينورا ستيلر" : "Design Services & Studio Creations"}
              </h2>
            </div>
            <Link
              to="/custom-orders"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.18em] text-accent hover:underline font-semibold"
            >
              <span>{isAr ? "ابدئي مشروعك معنا" : "Start a Custom Project"}</span>
              <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
            </Link>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {WHAT_WE_DO_SERVICES.map((srv) => (
              <div
                key={srv.id}
                className="card-star rounded-2xl border border-border bg-surface p-7 flex flex-col justify-between"
              >
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/15 text-accent mb-5">
                    <srv.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-2xl text-text-primary">
                    {isAr ? srv.titleAr : srv.titleEn}
                  </h3>
                  <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-text-secondary">
                    {isAr ? srv.descAr : srv.descEn}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {srv.deliverables.map((item, idx) => (
                      <span
                        key={idx}
                        className="rounded-full bg-surface-elevated border border-border/60 px-2.5 py-0.5 text-[10px] text-text-secondary"
                      >
                        ✦ {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border/50">
                  <Link
                    to="/shop"
                    search={{ category: srv.categorySlug }}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:underline"
                  >
                    <span>{isAr ? "عرض المنتجات المتاحة" : "Browse Available Pieces"}</span>
                    <ArrowRight className="h-3 w-3 rtl:rotate-180" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promotional Section: "Small details, big dreams" */}
      <section className="relative overflow-hidden py-24 border-y border-border/60 bg-linear-to-r from-surface via-surface-elevated to-surface">
        <div className="mx-auto max-w-5xl px-4 text-center lg:px-8">
          <Star className="mx-auto h-8 w-8 text-accent fill-accent/20 animate-pulse" />
          <p className="mt-4 text-xs uppercase tracking-[0.35em] text-accent font-semibold">
            {isAr ? "فلسفة لينورا ستيلر" : "The Studio Philosophy"}
          </p>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl lg:text-6xl text-text-primary leading-tight">
            {isAr ? "«تفاصيل صغيرة، أحلام كبيرة»" : "“Small details, big dreams”"}
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-sm sm:text-base leading-relaxed text-text-secondary">
            {isAr
              ? "نؤمن أن كل عمل عظيم يبدأ من عناية متناهية بالتفاصيل الدقيقة: جودة الورق، تناسق الخطوط، ورسم النجوم المتلألئة. صممنا لينورا ستيلر لتكون مساحتك التي تتنفس فيها أحلامك وتنمو."
              : "We believe meaningful design lives in quiet precision: the tactile weight of archival paper, the balance of letterforms, and the subtle sparkle of hand-drawn constellations. Designed to make your everyday moments feel ceremonial."}
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-6 text-xs text-text-secondary">
            <span className="flex items-center gap-1.5 font-medium text-text-primary">
              <CheckCircle2 className="h-4 w-4 text-accent" />
              {isAr ? "صُنع في مصر بكل حب" : "Designed in Egypt with Love"}
            </span>
            <span className="flex items-center gap-1.5 font-medium text-text-primary">
              <CheckCircle2 className="h-4 w-4 text-accent" />
              {isAr ? "توصيل لجميع المحافظات" : "Nationwide Egypt Delivery"}
            </span>
            <span className="flex items-center gap-1.5 font-medium text-text-primary">
              <CheckCircle2 className="h-4 w-4 text-accent" />
              {isAr ? "تنزيل فوري للملفات الرقمية" : "Instant Digital File Access"}
            </span>
          </div>
        </div>
      </section>

      {/* Categories Grid Showcase */}
      <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-accent">{t("home.categories")}</p>
            <h2 className="mt-2 font-display text-4xl sm:text-5xl text-text-primary">
              {isAr ? "أقسام ومجموعات المتجر" : "Shop by Category"}
            </h2>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.18em] text-accent hover:underline font-semibold"
          >
            <span>{t("home.viewAll")}</span>
            <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((c) => {
            const count = products.filter((p) => p.is_active && p.category_id === c.id).length;

            return (
              <Link
                key={c.id}
                to="/shop"
                search={{ category: c.slug }}
                className="card-star group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-surface p-6 transition-all duration-300 hover:border-accent hover:shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 text-accent group-hover:bg-accent/25 transition-colors">
                      <Star className="h-4 w-4 text-accent fill-accent/20" />
                    </div>
                    {count > 0 && (
                      <span className="rounded-full bg-surface-elevated px-2 py-0.5 text-[10px] font-mono text-text-secondary border border-border/60">
                        {count} {isAr ? "قطع" : "items"}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-4 font-display text-xl text-text-primary group-hover:text-accent transition-colors">
                    {pick(c, "name")}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-text-secondary line-clamp-2">
                    {pick(c, "description")}
                  </p>
                </div>

                <div className="mt-5 flex items-center gap-1 text-[11px] font-medium text-accent">
                  <span>{isAr ? "تصفح القسم" : "Explore collection"}</span>
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Celestial Circle Newsletter Banner */}
      <section className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <NewsletterSignup variant="banner" />
      </section>

      {/* Interactive Lunar Phase Modal */}
      <LunarPhaseTrackerModal isOpen={lunarModalOpen} onClose={() => setLunarModalOpen(false)} />
    </div>
  );
}
