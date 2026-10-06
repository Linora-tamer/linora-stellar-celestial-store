import { useState } from "react";
import { Instagram, ShoppingBag, Heart, Sparkles, X, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { CONTACT } from "@/lib/store";
import classroomImg from "@/assets/p-classroom.jpg";
import brandingImg from "@/assets/p-branding.jpg";
import invitationImg from "@/assets/p-invitation.jpg";
import heroImg from "@/assets/hero-stellar.jpg";

interface InstaPost {
  id: string;
  image: string;
  captionEn: string;
  captionAr: string;
  likes: number;
  featuredSlug?: string;
  featuredTitleEn?: string;
  featuredTitleAr?: string;
  price?: string;
}

const INSTA_POSTS: InstaPost[] = [
  {
    id: "post-1",
    image: classroomImg,
    captionEn: "Waterproof Name Label Sets — keeping little dreamers organized for school! ✦",
    captionAr: "طقم ملصقات الأسماء المقاومة للماء — تنظيم وأناقة لأدوات أطفالك المدرسية! ✦",
    likes: 312,
    featuredSlug: "pink-floral-label",
    featuredTitleEn: "Pink Floral Name Label",
    featuredTitleAr: "ملصق أزهار الزهري المخصص",
    price: "120 EGP",
  },
  {
    id: "post-2",
    image: heroImg,
    captionEn: "Make Your Everyday More Magical. Beautiful celestial stationery & planners.",
    captionAr: "اجعلي أيامك أكثر سحراً وإلهاماً مع أدوات ومخططات لينورا ستيلر.",
    likes: 486,
    featuredSlug: "stellar-digital-planner",
    featuredTitleEn: "Stellar Digital Life Planner",
    featuredTitleAr: "مخطط ستيلر السنوي المتكامل",
    price: "250 EGP",
  },
  {
    id: "post-3",
    image: brandingImg,
    captionEn: "Behind the design: crafting bespoke celestial branding for ambitious founders.",
    captionAr: "كواليس التصميم: ابتكار هويات بصرية فلكية راقية لأصحاب المشاريع الطموحة.",
    likes: 245,
    featuredSlug: "custom-orders",
    featuredTitleEn: "Brand Identity Suite",
    featuredTitleAr: "باقة الهوية البصرية الكاملة",
    price: "Custom",
  },
  {
    id: "post-4",
    image: invitationImg,
    captionEn: "Gold wax seal and midnight cards: A love story written in the stars.",
    captionAr: "ختم شمعي ذهبي وكروت كحلية فلكية: قصة حب مكتوبة في نجوم السماء.",
    likes: 520,
    featuredSlug: "custom-orders",
    featuredTitleEn: "Nocturne Wedding Suite",
    featuredTitleAr: "باقة دعوات الزفاف الفاخرة",
    price: "From 1,500 EGP",
  },
];

export function ShoppableInstagramFeed() {
  const { lang } = useI18n();
  const isAr = lang === "ar";
  const [activePost, setActivePost] = useState<InstaPost | null>(null);

  return (
    <section className="relative z-10 border-t border-border/80 bg-surface/95 backdrop-blur-xl py-16 sm:py-20 transition-colors duration-700 shadow-xl">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Section Header with Ultra-Clear Contrast */}
        <div className="flex flex-wrap items-end justify-between gap-6 mb-10 pb-4 border-b border-border/40">
          <div className="space-y-2">
            {/* Instagram Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/15 px-3.5 py-1 text-xs uppercase tracking-[0.25em] text-accent font-semibold shadow-xs">
              <Instagram className="h-3.5 w-3.5 text-accent animate-pulse" />
              <span>@linora.stellar</span>
            </div>

            {/* High-Contrast Bold Heading */}
            <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-text-primary">
              {isAr ? "معرض إنستجرام التفاعلي للتسوق" : "Shoppable Instagram Studio Feed"}
            </h3>

            {/* High-Contrast Crisp Subtitle */}
            <p className="text-sm sm:text-base text-text-secondary leading-relaxed max-w-xl">
              {isAr
                ? "شاهدي أحدث التصميمات والملصقات واضغطي على أي صورة لطلب القطعة فورياً."
                : "Explore our daily studio creations — click any post to view and shop the piece directly."}
            </p>
          </div>

          {/* Solid Luminous Follow Button (Never transparent or low contrast) */}
          <a
            href={CONTACT.instagram}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-xs uppercase tracking-wider text-background font-bold hover:brightness-110 shadow-lg hover:shadow-accent/30 active:scale-95 transition-all shrink-0"
          >
            <Instagram className="h-4 w-4" />
            <span>{isAr ? "تابعينا على إنستجرام" : "Follow @linora.stellar"}</span>
            <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
          </a>
        </div>

        {/* 4-Column Instagram Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {INSTA_POSTS.map((post) => (
            <div
              key={post.id}
              onClick={() => setActivePost(post)}
              className="group relative aspect-square overflow-hidden rounded-2xl border border-border/80 bg-surface-elevated card-star cursor-pointer shadow-md"
            >
              <img
                src={post.image}
                alt="Instagram studio creation"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Instagram Floating Icon Corner Indicator */}
              <div className="absolute top-3 end-3 rounded-full bg-background/80 backdrop-blur-md p-1.5 text-accent border border-accent/40 shadow-xs pointer-events-none group-hover:opacity-0 transition-opacity">
                <Instagram className="h-3.5 w-3.5" />
              </div>

              {/* Hover Overlay with Crystal Clear Legibility */}
              <div className="absolute inset-0 bg-background/85 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-xs p-5 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs text-text-primary">
                  <span className="flex items-center gap-1.5 font-bold">
                    <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" />
                    <span>{post.likes}</span>
                  </span>
                  <span className="rounded-full bg-accent px-2.5 py-0.5 text-[9px] uppercase tracking-wider text-background font-bold shadow-xs">
                    SHOP IT ✦
                  </span>
                </div>

                <div className="space-y-2">
                  <p className="text-xs line-clamp-2 text-text-primary font-medium leading-relaxed">
                    {isAr ? post.captionAr : post.captionEn}
                  </p>
                  {post.featuredTitleEn && (
                    <div className="flex items-center justify-between pt-2 border-t border-border/60">
                      <span className="text-xs font-bold text-accent">{post.price}</span>
                      <span className="inline-flex items-center gap-1 text-[11px] text-text-primary font-semibold hover:underline">
                        <span>{isAr ? "عرض القطعة" : "View"}</span>
                        <ShoppingBag className="h-3 w-3 text-accent" />
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shoppable Post Quick View Modal */}
      {activePost && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setActivePost(null)}
        >
          <div
            className="relative w-full max-w-lg rounded-3xl border border-accent/50 bg-surface p-6 sm:p-7 shadow-2xl card-star"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActivePost(null)}
              className="absolute -top-3 -end-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-surface border border-accent/40 text-text-secondary hover:text-text-primary shadow-xl transition-colors"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="aspect-square rounded-2xl overflow-hidden mb-4 border border-border shadow-inner">
              <img
                src={activePost.image}
                alt="Post preview"
                className="h-full w-full object-cover"
              />
            </div>

            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed mb-4">
              {isAr ? activePost.captionAr : activePost.captionEn}
            </p>

            <div className="flex items-center justify-between border-t border-border/60 pt-4">
              <div>
                <p className="text-sm font-semibold text-text-primary">
                  {isAr ? activePost.featuredTitleAr : activePost.featuredTitleEn}
                </p>
                <p className="text-xs font-bold text-accent mt-0.5">{activePost.price}</p>
              </div>

              <div className="flex gap-2">
                {activePost.featuredSlug === "custom-orders" ? (
                  <Link
                    to="/custom-orders"
                    onClick={() => setActivePost(null)}
                    className="rounded-full bg-accent px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-background hover:brightness-110 shadow-md transition-all flex items-center gap-1.5"
                  >
                    <ShoppingBag className="h-3.5 w-3.5" />
                    <span>{isAr ? "اطلبي الآن" : "Shop This Piece"}</span>
                  </Link>
                ) : (
                  <Link
                    to="/shop/$slug"
                    params={{ slug: activePost.featuredSlug || "custom-orders" }}
                    onClick={() => setActivePost(null)}
                    className="rounded-full bg-accent px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-background hover:brightness-110 shadow-md transition-all flex items-center gap-1.5"
                  >
                    <ShoppingBag className="h-3.5 w-3.5" />
                    <span>{isAr ? "اطلبي الآن" : "Shop This Piece"}</span>
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => setActivePost(null)}
                  className="rounded-full border border-border px-4 py-2.5 text-xs font-medium text-text-secondary hover:text-text-primary hover:border-accent transition-colors"
                >
                  {isAr ? "إغلاق" : "Close"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
