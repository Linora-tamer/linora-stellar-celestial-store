import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Sparkles,
  Palette,
  Heart,
  Award,
  ArrowRight,
  Compass,
  CheckCircle2,
  Mail,
  MessageCircle,
} from "lucide-react";

import { Star } from "@/components/site/Star";
import { CONTACT } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import hero from "@/assets/hero-stellar.jpg";
import brandingImg from "@/assets/p-branding.jpg";
import classroomImg from "@/assets/p-classroom.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Linora Stellar — Where Creativity Meets the Stars" },
      {
        name: "description",
        content:
          "Discover Linora Stellar: an independent design studio founded by Nora Tamer in Egypt, crafting celestial printables, bespoke branding, and custom stationery.",
      },
      { property: "og:title", content: "About Linora Stellar" },
      {
        property: "og:description",
        content: "Where creativity meets the stars — luxury celestial design studio in Egypt.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { lang } = useI18n();
  const isAr = lang === "ar";

  const VALUES = [
    {
      icon: Sparkles,
      title: isAr ? "تصميمات إبداعية ملهمة" : "Creative Designs",
      desc: isAr
        ? "كل عنصر وزخرفة فلكية مرسومة يدوياً بحس فني يجمع بين عمق سماء الليل وبريق النجوم الذهبي."
        : "Every constellation, planner grid, and typography suite is sketched with refined celestial inspiration.",
    },
    {
      icon: Palette,
      title: isAr ? "صُنع خصيصاً لكِ" : "Custom Made",
      desc: isAr
        ? "إمكانية تخصيص وتطريز الأسماء، التواريخ، وهوية علامتك التجارية على جميع المطبوعات والمنتجات."
        : "Personalized with your name, milestone dates, and unique brand vision for bespoke individuality.",
    },
    {
      icon: Award,
      title: isAr ? "جودة استثنائية فائقة" : "High Quality",
      desc: isAr
        ? "ورق قطني فاخر، أحبار طباعة نقية، وملفات رقمية بدقة متناهية (300 DPI) لطباعة مبهرة."
        : "Heavyweight archival paper, rich pigment printing, and flawless vector assets ready for press.",
    },
    {
      icon: Heart,
      title: isAr ? "شغف وحب في كل تفصيلة" : "With Love",
      desc: isAr
        ? "نعتني بكل طلب كأنه قطعة فريدة، مع تغليف فلكي أنيق وتواصل شخصي مباشر عبر واتساب."
        : "Crafted with heartfelt attention, packaged in signature starry parceling, and personally cared for.",
    },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 sm:py-32 border-b border-border/60">
        <div
          className="absolute inset-0 z-0 opacity-40 bg-cover bg-center"
          style={{ backgroundImage: `url(${hero})` }}
        />
        <div className="absolute inset-0 bg-linear-to-b from-background/90 via-background/80 to-background" />

        <div className="relative z-10 mx-auto max-w-5xl px-4 text-center lg:px-8">
          <p className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-accent">
            <Star className="h-3.5 w-3.5 text-accent" />
            <span>{isAr ? "عن لينورا ستيلر" : "About Linora Stellar"}</span>
          </p>

          <h1 className="mt-6 font-display text-5xl sm:text-6xl lg:text-7xl text-text-primary leading-[1.08]">
            {isAr ? "حيث يلتقي الإبداع بنجوم السماء" : "Where creativity meets the stars."}
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-text-secondary">
            {isAr
              ? "استوديو تصميم فلكي مستقل أسسته المصممة نورا تامر في مصر، متخصص في ابتكار المطبوعات الراقية، الهويات البصرية، والهدايا المخصصة التي تحول التفاصيل الصغيرة إلى أحلام كبيرة."
              : "An independent celestial design boutique founded by Nora Tamer in Egypt, dedicated to crafting elevated printables, branding suites, and personalized creations that bring celestial wonder into daily life."}
          </p>
        </div>
      </section>

      {/* Brand Story & Studio Narrative */}
      <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div className="space-y-6">
            <p className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-accent">
              <Compass className="h-4 w-4" />
              <span>{isAr ? "قصة الاستوديو" : "Our Story"}</span>
            </p>

            <h2 className="font-display text-4xl sm:text-5xl text-text-primary leading-tight">
              {isAr
                ? "بدأت القصة من دفتر رسم ونجمة رباعية الأطراف"
                : "It began with quiet sketches under open skies."}
            </h2>

            <div className="space-y-4 text-sm sm:text-base leading-relaxed text-text-secondary">
              <p>
                {isAr
                  ? "بدأت لينورا ستيلر كشغف بسيط: رسم النجوم في هوامش الكراسات أثناء الليالي الهادئة. سرعان ما تحولت تلك النجمة الرباعية البسيطة إلى بصمة وهوية متكاملة تزين اليوم أرقى الملصقات، المخططات، ودعوات المناسبات."
                  : "Linora Stellar was born from a quiet habit: sketching four-pointed stars in the margins of art journals during still midnight hours. What began as an intimate doodle evolved into our signature emblem—now woven into every planner, wedding suite, and custom branding kit."}
              </p>
              <p>
                {isAr
                  ? "اخترنا درجات الكحلي الليلي والذهب الهادئ لنمنحك إحساساً بالفخامة والسكينة؛ ألوان تضفي رونقاً فريداً سواء على مطبوعات الفصول الدراسية للأطفال أو على هوية بصرية لمشروع طموح."
                  : "Our signature palette marries the calming depth of deep astronomical navy with the warm, radiant glow of celestial gold. It offers quiet luxury—equally at home in an inspiring classroom chart as it is in a bespoke corporate identity."}
              </p>
              <p className="font-medium text-text-primary">
                {isAr
                  ? "«تفاصيل صغيرة، أحلام كبيرة» — هذا هو العهد الذي نقطعه في كل تصميم نبتكره."
                  : "“Small details, big dreams” is the guiding philosophy behind every brushstroke, vector node, and printed paper weight."}
              </p>
            </div>

            <div className="pt-4 flex flex-wrap gap-4">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-xs font-semibold uppercase tracking-wider text-background hover:opacity-90 transition-opacity shadow-xs"
              >
                <span>{isAr ? "استكشاف التشكيلة" : "Explore Our Collection"}</span>
                <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
              </Link>
              <Link
                to="/custom-orders"
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-xs font-semibold uppercase tracking-wider text-text-primary hover:border-accent hover:text-accent transition-colors"
              >
                <span>{isAr ? "طلب تصميم خاص" : "Commission Custom Design"}</span>
              </Link>
            </div>
          </div>

          {/* Studio Image & Visual Composition */}
          <div className="relative">
            <div className="aspect-4/3 sm:aspect-square overflow-hidden rounded-2xl border border-border bg-surface-elevated card-star">
              <img
                src={brandingImg}
                alt="Linora Stellar design studio workspace"
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
            <div className="absolute -bottom-6 -start-6 hidden sm:block w-56 rounded-xl border border-accent/40 bg-surface/90 p-4 backdrop-blur-md shadow-xl">
              <p className="text-xs uppercase tracking-wider text-accent font-semibold">
                Nora Tamer
              </p>
              <p className="text-[11px] text-text-secondary mt-0.5">
                Founder & Lead Celestial Designer
              </p>
              <p className="text-[10px] text-accent/80 font-mono mt-1">Cairo, Egypt</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Pillars Section: Creative Designs, Custom Made, High Quality, With Love */}
      <section className="border-t border-border/60 bg-surface/40 py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-xs uppercase tracking-[0.3em] text-accent font-semibold">
              {isAr ? "ركائز لينورا ستيلر" : "Our Guiding Values"}
            </p>
            <h2 className="mt-2 font-display text-4xl sm:text-5xl text-text-primary">
              {isAr ? "قيمنا في كل تصميم" : "Craftsmanship With Intention"}
            </h2>
            <p className="mt-3 text-sm text-text-secondary">
              {isAr
                ? "نؤمن أن الجمال الحقيقي يكمن في دقة الصنع والمشاعر التي ينقلها التصميم."
                : "Four enduring principles that define every printable, identity, and gift we create."}
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((val, idx) => (
              <div
                key={idx}
                className="card-star rounded-2xl border border-border bg-surface p-6 sm:p-7 flex flex-col justify-between"
              >
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/15 text-accent mb-5">
                    <val.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-2xl text-text-primary">{val.title}</h3>
                  <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-text-secondary">
                    {val.desc}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-border/50 flex items-center gap-1.5 text-xs text-accent">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>{isAr ? "معايير معتمدة" : "Studio Guarantee"}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="mx-auto max-w-5xl px-4 py-20 text-center lg:px-8">
        <div className="rounded-3xl border border-accent/40 bg-linear-to-b from-accent/10 via-surface to-surface p-8 sm:p-12 card-star">
          <Star className="mx-auto h-7 w-7 text-accent" />
          <h2 className="mt-4 font-display text-4xl sm:text-5xl text-text-primary">
            {isAr
              ? "جاهزة لبدء رحلتك الفلكية معنا؟"
              : "Ready to bring celestial magic to your brand?"}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-text-secondary">
            {isAr
              ? "تصفحي متجرنا لاختيار مطبوعاتك الفورية، أو تواصلي مع نورا تامر مباشرة لتصميم هويتك الخاصة."
              : "Browse our instant digital printables, order personalized merchandise, or connect with Nora Tamer for bespoke commissions."}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/shop"
              className="rounded-full bg-accent px-8 py-3 text-xs font-semibold uppercase tracking-wider text-background hover:opacity-90 shadow-xs"
            >
              {isAr ? "تصفح المتجر" : "Explore Shop"}
            </Link>
            <a
              href={`${CONTACT.whatsappLink}?text=${encodeURIComponent("Hi Nora! I love the Linora Stellar story and would like to collaborate.")}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-accent px-6 py-3 text-xs font-semibold uppercase tracking-wider text-accent hover:bg-accent/10"
            >
              <MessageCircle className="h-4 w-4" />
              <span>{isAr ? "محادثة عبر واتساب" : "Message on WhatsApp"}</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
