import { Link } from "@tanstack/react-router";
import {
  Sparkles,
  Palette,
  Layers,
  BookOpen,
  Stamp,
  Shirt,
  ArrowRight,
  Bot,
  Calculator,
  Compass,
  Star,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import brandingImg from "@/assets/p-branding.jpg";
import classroomImg from "@/assets/p-classroom.jpg";
import invitationImg from "@/assets/p-invitation.jpg";
import heroImg from "@/assets/hero-stellar.jpg";

interface MegaMenuProps {
  type: "shop" | "services";
  isOpen: boolean;
  onClose: () => void;
}

export function MegaMenu({ type, isOpen, onClose }: MegaMenuProps) {
  const { t, lang } = useI18n();
  const isAr = lang === "ar";

  if (!isOpen) return null;

  if (type === "shop") {
    return (
      <div
        onMouseLeave={onClose}
        className="absolute top-full inset-x-0 mx-auto max-w-7xl px-4 lg:px-8 pt-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
      >
        <div className="rounded-2xl border border-border/80 bg-surface/95 backdrop-blur-2xl p-6 shadow-2xl card-star grid grid-cols-12 gap-6">
          {/* Column 1: Featured Categories */}
          <div className="col-span-4 border-e border-border/60 pe-6 space-y-3">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-accent font-semibold">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{isAr ? "أقسام المتجر الرئيسية" : "Store Collections"}</span>
            </div>

            <div className="space-y-1 pt-1">
              {[
                {
                  to: "/shop",
                  search: { category: "digital" },
                  title: isAr ? "المنتجات الرقمية والمخططات" : "Digital Planners & Kits",
                  sub: isAr ? "تنزيل فوري لملفات PDF وكانفا" : "Instant 300 DPI iPad templates",
                  icon: Sparkles,
                },
                {
                  to: "/shop",
                  search: { category: "print" },
                  title: isAr ? "الملصقات والأدوات المكتبية" : "Custom Name Labels & Stationery",
                  sub: isAr ? "ملصقات مدرسية، دفاتر، كروت" : "Waterproof school sets & books",
                  icon: Stamp,
                },
                {
                  to: "/shop",
                  search: { category: "kids" },
                  title: isAr ? "مطبوعات الفصول والأطفال" : "School & Classroom Packs",
                  sub: isAr ? "لوحات سلوك وكراسات تلوين فلكية" : "Constellation mazes & charts",
                  icon: BookOpen,
                },
                {
                  to: "/shop",
                  search: { category: "merch" },
                  title: isAr ? "المنتجات الحصرية والمجات" : "Custom Mugs, Bottles & Merch",
                  sub: isAr ? "زجاجات ستيلر وتيشيرتات قطنية" : "Matte bottles & apparel",
                  icon: Shirt,
                },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={idx}
                    to={item.to}
                    search={item.search}
                    onClick={onClose}
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-surface-elevated transition-colors group"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/15 text-accent group-hover:bg-accent group-hover:text-background transition-colors shrink-0 mt-0.5">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-text-primary group-hover:text-accent transition-colors">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-text-secondary mt-0.5">{item.sub}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Column 2: Visual Product Cards */}
          <div className="col-span-5 space-y-3">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.25em] text-accent font-semibold">
              <span>{isAr ? "الأكثر طلباً هذا الأسبوع" : "Trending Celestial Pieces"}</span>
              <Link
                to="/shop"
                onClick={onClose}
                className="text-[10px] text-text-secondary hover:text-accent font-sans lowercase"
              >
                {isAr ? "عرض الكل ←" : "view catalog →"}
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <Link
                to="/shop/$slug"
                params={{ slug: "pink-floral-label" }}
                onClick={onClose}
                className="group relative overflow-hidden rounded-xl border border-border bg-surface-elevated p-3 transition-transform hover:-translate-y-1"
              >
                <div className="aspect-[4/3] rounded-lg overflow-hidden bg-background mb-2">
                  <img
                    src={classroomImg}
                    alt="Pink Floral Label"
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <p className="text-xs font-semibold text-text-primary truncate">
                  {isAr ? "ملصق أزْهان الزهري المخصص" : "Pink Floral Name Label"}
                </p>
                <p className="text-[11px] font-bold text-accent mt-0.5">120 EGP</p>
              </Link>

              <Link
                to="/shop/$slug"
                params={{ slug: "stellar-digital-planner" }}
                onClick={onClose}
                className="group relative overflow-hidden rounded-xl border border-border bg-surface-elevated p-3 transition-transform hover:-translate-y-1"
              >
                <div className="aspect-[4/3] rounded-lg overflow-hidden bg-background mb-2">
                  <img
                    src={heroImg}
                    alt="Digital Life Planner"
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <p className="text-xs font-semibold text-text-primary truncate">
                  {isAr ? "مخطط ستيلر السنوي المتكامل" : "Stellar Digital Life Planner"}
                </p>
                <p className="text-[11px] font-bold text-accent mt-0.5">250 EGP</p>
              </Link>
            </div>
          </div>

          {/* Column 3: Direct Highlight Banner */}
          <div className="col-span-3 rounded-xl border border-accent/40 bg-gradient-to-br from-accent/15 via-surface to-surface p-4 flex flex-col justify-between">
            <div>
              <span className="inline-block rounded-full bg-accent/20 px-2 py-0.5 text-[9px] uppercase tracking-wider text-accent font-semibold mb-2">
                ✦ {isAr ? "شحن مجاني" : "Free Shipping"}
              </span>
              <h4 className="font-display text-base text-text-primary font-semibold leading-snug">
                {isAr ? "طلبات القاهرة والجيزة فوق 500 جنيه" : "Cairo & Giza orders over 500 EGP"}
              </h4>
              <p className="text-[11px] text-text-secondary mt-1.5 leading-relaxed">
                {isAr
                  ? "توصيل سريع خلال 24-48 ساعة ومعاينة الشحنة عند الاستلام."
                  : "Nationwide express delivery with doorstep package inspection."}
              </p>
            </div>

            <Link
              to="/shop"
              onClick={onClose}
              className="mt-4 inline-flex items-center justify-between rounded-lg bg-accent px-3 py-2 text-xs font-semibold uppercase tracking-wider text-background hover:opacity-90 transition-opacity"
            >
              <span>{isAr ? "تسوقي الآن" : "Shop Collection"}</span>
              <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Services / Custom Orders Mega Menu
  return (
    <div
      onMouseLeave={onClose}
      className="absolute top-full inset-x-0 mx-auto max-w-7xl px-4 lg:px-8 pt-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
    >
      <div className="rounded-2xl border border-border/80 bg-surface/95 backdrop-blur-2xl p-6 shadow-2xl card-star grid grid-cols-12 gap-6">
        {/* Column 1: Design Disciplines */}
        <div className="col-span-4 border-e border-border/60 pe-6 space-y-3">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-accent font-semibold">
            <Palette className="h-3.5 w-3.5" />
            <span>{isAr ? "خدمات التصميم الحصرية" : "Design Services"}</span>
          </div>

          <div className="space-y-1 pt-1">
            {[
              {
                title: isAr ? "الهويات البصرية والشعارات" : "Branding & Identity Suites",
                desc: isAr
                  ? "باقة لوجو كاملة مع أدلة الألوان والخطوط"
                  : "Full logo suites & visual guidelines",
                icon: Palette,
              },
              {
                title: isAr ? "دعوات الزفاف والمناسبات" : "Bespoke Stationery & Invitations",
                desc: isAr ? "دعوات فلكية فاخرة بختم شمعي" : "Luxury celestial cards & wax seals",
                icon: Stamp,
              },
              {
                title: isAr ? "تصميم المطبوعات والتغليف" : "Editorial & Packaging Design",
                desc: isAr
                  ? "تغليف منتجات وبوسترات فنية فاخرة"
                  : "Box packaging & vector illustrations",
                icon: Layers,
              },
            ].map((srv, idx) => {
              const Icon = srv.icon;
              return (
                <Link
                  key={idx}
                  to="/custom-orders"
                  onClick={onClose}
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-surface-elevated transition-colors group"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/15 text-accent group-hover:bg-accent group-hover:text-background transition-colors shrink-0 mt-0.5">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-text-primary group-hover:text-accent transition-colors">
                      {srv.title}
                    </p>
                    <p className="text-[11px] text-text-secondary mt-0.5">{srv.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Column 2: AI Tools & Fast Ordering */}
        <div className="col-span-5 space-y-3">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-accent font-semibold">
            <Bot className="h-3.5 w-3.5" />
            <span>{isAr ? "أدوات ذكية لتسريع طلبك" : "Smart AI & Interactive Tools"}</span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <Link
              to="/custom-orders"
              onClick={onClose}
              className="p-3.5 rounded-xl border border-border bg-surface-elevated hover:border-accent transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/20 text-accent mb-2">
                  <Bot className="h-4 w-4" />
                </div>
                <p className="text-xs font-semibold text-text-primary group-hover:text-accent transition-colors">
                  {isAr ? "مساعد الطلب الذكي" : "AI Conversational Assistant"}
                </p>
                <p className="text-[11px] text-text-secondary mt-1">
                  {isAr
                    ? "تحدثي مع الذكاء الاصطناعي لتحديد فكرتك وتلخيص طلبك"
                    : "Chat naturally to scope your project effortlessly"}
                </p>
              </div>
              <span className="text-[10px] text-accent font-semibold mt-3 flex items-center gap-1">
                {isAr ? "ابدئي المحادثة ←" : "Start chat →"}
              </span>
            </Link>

            <Link
              to="/custom-orders"
              onClick={onClose}
              className="p-3.5 rounded-xl border border-border bg-surface-elevated hover:border-accent transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/20 text-accent mb-2">
                  <Calculator className="h-4 w-4" />
                </div>
                <p className="text-xs font-semibold text-text-primary group-hover:text-accent transition-colors">
                  {isAr ? "حاسبة تكلفة التصميم" : "Dynamic Cost Estimator"}
                </p>
                <p className="text-[11px] text-text-secondary mt-1">
                  {isAr
                    ? "احسبي التكلفة وموعد التسليم فورياً حسب متطلباتك"
                    : "Instant budget & turnaround time calculation"}
                </p>
              </div>
              <span className="text-[10px] text-accent font-semibold mt-3 flex items-center gap-1">
                {isAr ? "حساب التكلفة ←" : "Calculate →"}
              </span>
            </Link>
          </div>
        </div>

        {/* Column 3: Portfolio Feature */}
        <div className="col-span-3 rounded-xl border border-border bg-surface-elevated p-4 flex flex-col justify-between">
          <div>
            <div className="aspect-[16/10] rounded-lg overflow-hidden mb-3">
              <img
                src={brandingImg}
                alt="Portfolio showcase"
                className="h-full w-full object-cover"
              />
            </div>
            <p className="text-xs font-semibold text-text-primary">
              {isAr ? "أعمال نورا تامر المختارة" : "Selected Client Work"}
            </p>
            <p className="text-[11px] text-text-secondary mt-0.5">
              {isAr ? "استكشفي مشاريع الهوية والمطبوعات" : "Explore branding case studies"}
            </p>
          </div>

          <Link
            to="/portfolio"
            onClick={onClose}
            className="mt-3 inline-flex items-center justify-between text-xs font-semibold text-accent hover:underline"
          >
            <span>{isAr ? "معرض الأعمال" : "View Portfolio"}</span>
            <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
          </Link>
        </div>
      </div>
    </div>
  );
}
