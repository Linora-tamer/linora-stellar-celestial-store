import { useState } from "react";
import { Star, Heart, CheckCircle2, ShieldCheck, Instagram, Sparkles } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import heroStellar from "@/assets/hero-stellar.jpg";
import brandingImg from "@/assets/p-branding.jpg";
import classroomImg from "@/assets/p-classroom.jpg";
import invitationImg from "@/assets/p-invitation.jpg";

export function UgcCustomerGallery() {
  const { lang } = useI18n();
  const isAr = lang === "ar";

  const UGC_POSTS = [
    {
      id: "ugc-1",
      customerName: "Salma M.",
      city: "Cairo / المعادي",
      reviewEn:
        "The foil print on the spiral planner is out of this world! The paper quality doesn't bleed even with my fountain pens.",
      reviewAr:
        "الطباعة المذهبة على البلانر خيالية وجودة الورق سميكة ومريحة جداً مع الأقلام السائلة!",
      rating: 5,
      image: heroStellar,
      tag: "#LinoraPlanner",
    },
    {
      id: "ugc-2",
      customerName: "Dina K.",
      city: "Alexandria / سموحة",
      reviewEn:
        "Ordered 100 custom logo mugs for our design agency. The colors matched our Pantone code perfectly and arrived safely packed.",
      reviewAr:
        "طلبنا مجات سيراميك بشعار الاستوديو، الألوان طلعت طبق الأصل عن الأكواد والتغليف كان ممتاز.",
      rating: 5,
      image: brandingImg,
      tag: "#StudioMerch",
    },
    {
      id: "ugc-3",
      customerName: "Mariam T.",
      city: "Giza / الشيخ زايد",
      reviewEn:
        "Digital study prints printed on heavy textured cardstock. My desk aesthetic is completely transformed.",
      reviewAr: "المطبوعات الدراسية الرقمية فخمة جداً وطباعتها على ورق ثقيل غيرت شكل مكتبي تماماً.",
      rating: 5,
      image: classroomImg,
      tag: "#DeskAesthetic",
    },
    {
      id: "ugc-4",
      customerName: "Yara H.",
      city: "New Cairo / التجمع",
      reviewEn:
        "Wedding invitations were bespoke celestial magic! Nora assisted with every single revision patiently.",
      reviewAr:
        "دعوات الفرح كانت تحفة فلكية فريدة ونورا ساعدتنا في كل التفاصيل بمنتهى الذوق والاحترافية.",
      rating: 5,
      image: invitationImg,
      tag: "#BespokeDesign",
    },
  ];

  return (
    <section className="py-12 my-6">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs uppercase font-mono tracking-widest text-accent mb-2">
              <Instagram className="h-3.5 w-3.5" />
              <span>
                {isAr ? "معرض تجارب العملاء الحقيقية (UGC)" : "Client Showcase & Real Reviews"}
              </span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-text-primary">
              {isAr
                ? "من استوديو لينورا إلى مكاتبكم ومنازلكم"
                : "From Our Studio to Your Creative Spaces"}
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-text-secondary">
              {isAr
                ? "صور وتقييمات حقيقية من عملائنا لمنتجات المخططات والمطبوعات المخصصة."
                : "Real customer photos and genuine reviews of received stationery, prints & custom merchandise."}
            </p>
          </div>

          <a
            href="https://instagram.com/linora.stellar"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-xs font-semibold text-text-primary hover:border-accent hover:text-accent transition-all shrink-0"
          >
            <Instagram className="h-4 w-4 text-accent" />
            <span>{isAr ? "تابعينا على إنستغرام @linora.stellar" : "Follow @linora.stellar"}</span>
          </a>
        </div>

        {/* UGC Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {UGC_POSTS.map((post) => (
            <div
              key={post.id}
              className="card-star group flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-surface/85 shadow-lg transition-all hover:border-accent hover:shadow-xl"
            >
              <div className="relative aspect-square overflow-hidden bg-surface-elevated">
                <img
                  src={post.image}
                  alt={post.customerName}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute bottom-2.5 start-2.5 rounded-full bg-black/60 px-2.5 py-0.5 text-[10px] font-mono text-white backdrop-blur-md">
                  {post.tag}
                </span>
              </div>

              <div className="p-4 flex flex-1 flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-text-primary flex items-center gap-1">
                      <span>{post.customerName}</span>
                      <CheckCircle2 className="h-3 w-3 text-accent" />
                    </span>
                    <span className="text-[10px] text-text-secondary font-mono">{post.city}</span>
                  </div>

                  <div className="flex gap-0.5 mb-2">
                    {[...Array(post.rating)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-accent text-accent" />
                    ))}
                  </div>

                  <p className="text-xs text-text-secondary leading-relaxed">
                    "{isAr ? post.reviewAr : post.reviewEn}"
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Local Payment Badges Banner */}
        <div className="mt-10 rounded-2xl border border-border/80 bg-surface-elevated/40 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 text-accent border border-accent/30">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-text-primary">
                {isAr
                  ? "دفع آمن ومحلي 100% في مصر والشرق الأوسط"
                  : "100% Secure Local & Regional Payments"}
              </p>
              <p className="text-[11px] text-text-secondary">
                {isAr
                  ? "ندعم فودافون كاش، إنستاباي، فوري، وجميع البطاقات البنكية الائتمانية."
                  : "We accept Vodafone Cash, InstaPay, Fawry, Visa, MasterCard & Apple Pay."}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[
              { name: "InstaPay", color: "bg-purple-950/60 border-purple-500/40 text-purple-200" },
              { name: "Vodafone Cash", color: "bg-red-950/60 border-red-500/40 text-red-200" },
              { name: "Fawry", color: "bg-amber-950/60 border-amber-500/40 text-amber-200" },
              {
                name: "Credit / Debit Cards",
                color: "bg-blue-950/60 border-blue-500/40 text-blue-200",
              },
            ].map((p, idx) => (
              <span
                key={idx}
                className={`rounded-lg border px-2.5 py-1 text-[11px] font-semibold ${p.color}`}
              >
                {p.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
