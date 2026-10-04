import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Sparkles,
  ExternalLink,
  X,
  ArrowRight,
  Filter,
  CheckCircle2,
  Calendar,
  Layers,
  Palette,
  Eye,
} from "lucide-react";

import { Star } from "@/components/site/Star";
import { BeforeAfterSlider } from "@/components/site/BeforeAfterSlider";
import { useI18n } from "@/lib/i18n";
import { CONTACT } from "@/lib/store";
import brandingImg from "@/assets/p-branding.jpg";
import classroomImg from "@/assets/p-classroom.jpg";
import invitationImg from "@/assets/p-invitation.jpg";
import heroStellar from "@/assets/hero-stellar.jpg";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio — Linora Stellar Celestial Projects" },
      {
        name: "description",
        content:
          "Explore selected branding suites, invitations, kids educational materials, and stationery crafted by Nora Tamer at Linora Stellar.",
      },
      { property: "og:title", content: "Portfolio — Linora Stellar" },
      {
        property: "og:description",
        content: "Selected design portfolio projects by Nora Tamer.",
      },
    ],
  }),
  component: PortfolioPage,
});

interface ProjectItem {
  id: string;
  slug: string;
  titleEn: string;
  titleAr: string;
  category: "branding" | "stationery" | "school" | "merch";
  categoryLabelEn: string;
  categoryLabelAr: string;
  summaryEn: string;
  summaryAr: string;
  descriptionEn: string;
  descriptionAr: string;
  client: string;
  year: string;
  coverUrl: string;
  palette: string[];
  deliverables: string[];
}

const PORTFOLIO_PROJECTS: ProjectItem[] = [
  {
    id: "proj-1",
    slug: "celestial-identity-studio",
    titleEn: "Celestial Identity Studio",
    titleAr: "هوية بصرية فلكية متكاملة",
    category: "branding",
    categoryLabelEn: "Brand Identity",
    categoryLabelAr: "هوية بصرية",
    summaryEn: "Complete brand suite for an artisanal astronomy boutique.",
    summaryAr: "حزمة هوية بصرية متكاملة لمشروع فلكي وحرفي راقٍ.",
    descriptionEn:
      "A complete bespoke identity featuring a custom geometric starlight logo, deep navy color system, stationery layouts, and gold foil packaging boxes.",
    descriptionAr:
      "تصميم حزمة هوية بصرية راقية تشمل شعاراً فلكياً هندسياً، نظام ألوان كحلي وذهبي، أوراق رسمية، وتغليفاً بالذهب البراق.",
    client: "Starlight Artisans Cairo",
    year: "2026",
    coverUrl: brandingImg,
    palette: ["#05070E", "#101C34", "#E0AD76", "#FFF6ED"],
    deliverables: [
      "Primary & Secondary Logo",
      "Brand Style Guide",
      "Packaging Artwork",
      "30 Canva Templates",
    ],
  },
  {
    id: "proj-2",
    slug: "little-stargazer-classroom",
    titleEn: "Little Stargazer Classroom Suite",
    titleAr: "باقة مراقب النجوم للفصول الدراسية",
    category: "school",
    categoryLabelEn: "School & Kids",
    categoryLabelAr: "أطفال وفصول",
    summaryEn: "Educational star charts, reward cards, and activity workbooks.",
    summaryAr: "لوحات فلكية تعليمية وبطاقات تحفيز وكراسات أنشطة للأطفال.",
    descriptionEn:
      "A 30-page printable classroom activity set designed to encourage curiosity through astronomy, dot-to-dot constellation mazes, and positive star charts.",
    descriptionAr:
      "مجموعة مطبوعات تعليمية من 30 صفحة تشمل متاهات الأبراج، بطاقات النجوم السلوكية، وبوسترات فلكية ملهمة للفصول.",
    client: "Bright Horizons Academy Egypt",
    year: "2025",
    coverUrl: classroomImg,
    palette: ["#121A22", "#475A77", "#91A9C7", "#F4F7FA"],
    deliverables: [
      "Printable A4 / US Letter Workbooks",
      "Reward Star Stickers",
      "Classroom Wall Posters",
    ],
  },
  {
    id: "proj-3",
    slug: "nocturne-wedding-suite",
    titleEn: "Nocturne Wedding & Event Suite",
    titleAr: "باقة دعوات زفاف فلكية فاخرة",
    category: "stationery",
    categoryLabelEn: "Stationery & Invitations",
    categoryLabelAr: "دعوات ومطبوعات",
    summaryEn: "Luxury celestial invitations with wax-seal gold elements.",
    summaryAr: "دعوات زفاف فلكية راقية بتطريز ذهبي وختم شمعي مميز.",
    descriptionEn:
      "Hand-lettered wedding suite featuring midnight cards, constellation maps matching the couple's special night, place cards, and embossed thank-you notes.",
    descriptionAr:
      "باقة زفاف تضم خريطة السماء والنجوم لليلة الزفاف، كروت الطاولات، وبطاقات شكر مطبوعة بأعلى دقة.",
    client: "Private Wedding Collection",
    year: "2026",
    coverUrl: invitationImg,
    palette: ["#0F101A", "#292437", "#D9A08C", "#F5EDF0"],
    deliverables: ["Wax-Seal Card Design", "Digital WhatsApp Invitations", "Place Cards & Menu"],
  },
];

function PortfolioPage() {
  const { lang } = useI18n();
  const isAr = lang === "ar";

  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  const filtered =
    activeCategory === "all"
      ? PORTFOLIO_PROJECTS
      : PORTFOLIO_PROJECTS.filter((p) => p.category === activeCategory);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <p className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-accent">
          <Star className="h-3.5 w-3.5 text-accent" />
          <span>{isAr ? "معرض أعمال نورا تامر" : "Portfolio & Creative Works"}</span>
        </p>

        <h1 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl text-text-primary">
          {isAr ? "مشاريع ساطعة كنجوم السماء" : "Crafted Under Starry Skies"}
        </h1>

        <p className="mt-3 text-sm sm:text-base leading-relaxed text-text-secondary">
          {isAr
            ? "استكشفي أحدث تصميمات الهويات البصرية، المطبوعات، ودعوات المناسبات المنفذة لعملاء لينورا ستيلر."
            : "Explore selected brand identity suites, stationery collections, and classroom packages crafted with celestial elegance."}
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
        {[
          { id: "all", en: "All Projects", ar: "جميع المشاريع" },
          { id: "branding", en: "Brand Identity", ar: "الهوية البصرية" },
          { id: "stationery", en: "Stationery & Invitations", ar: "الدعوات والمطبوعات" },
          { id: "school", en: "School & Kids", ar: "أطفال وفصول" },
        ].map((cat) => {
          const isSelected = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-all ${
                isSelected
                  ? "bg-accent text-background shadow-xs"
                  : "border border-border/80 bg-surface text-text-secondary hover:border-accent hover:text-text-primary"
              }`}
            >
              {isAr ? cat.ar : cat.en}
            </button>
          );
        })}
      </div>

      {/* Projects Grid */}
      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((proj) => (
          <div
            key={proj.id}
            onClick={() => setSelectedProject(proj)}
            className="card-star group cursor-pointer overflow-hidden rounded-2xl border border-border bg-surface flex flex-col justify-between transition-all hover:border-accent"
          >
            <div>
              {/* Project Image */}
              <div className="relative aspect-4/3 overflow-hidden bg-surface-elevated">
                <img
                  src={proj.coverUrl}
                  alt={isAr ? proj.titleAr : proj.titleEn}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute start-3 top-3 rounded-full bg-background/80 backdrop-blur-md px-3 py-1 text-[10px] font-semibold text-accent border border-border/60">
                  {isAr ? proj.categoryLabelAr : proj.categoryLabelEn}
                </span>

                <div className="absolute inset-0 bg-background/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-xs">
                  <span className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-xs font-semibold uppercase tracking-wider text-background shadow-md">
                    <Eye className="h-3.5 w-3.5" />
                    <span>{isAr ? "معاينة المشروع" : "View Project"}</span>
                  </span>
                </div>
              </div>

              {/* Project Info */}
              <div className="p-6">
                <h3 className="font-display text-2xl text-text-primary group-hover:text-accent transition-colors">
                  {isAr ? proj.titleAr : proj.titleEn}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-text-secondary leading-relaxed line-clamp-2">
                  {isAr ? proj.summaryAr : proj.summaryEn}
                </p>
              </div>
            </div>

            <div className="p-6 pt-0 border-t border-border/50 mt-4 flex items-center justify-between text-xs text-text-secondary">
              <span className="font-medium text-text-primary">{proj.client}</span>
              <span className="font-mono text-[11px] text-accent">{proj.year}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Before & After Transformation Showcase */}
      <section className="mt-20">
        <BeforeAfterSlider
          beforeImage={heroStellar}
          afterImage={brandingImg}
          titleEn="Interactive Before & After Transformation"
          titleAr="مقارنة تفاعلية: من مسودة العميل إلى التصميم النهائي"
          subtitleEn="Drag the slider to see how initial rough concepts transform into radiant, polished brand assets under Nora Tamer's creative direction."
          subtitleAr="اسحبي المؤشر لمشاهدة كيف تتحول الأفكار الأولية والاسكتشات البسيطة إلى هوية متكاملة تنبض بالفخامة والاحترافية."
        />
      </section>

      {/* Project Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-md transition-opacity"
            onClick={() => setSelectedProject(null)}
            aria-hidden="true"
          />

          <div className="relative w-full max-w-3xl rounded-3xl border border-accent/40 bg-surface p-6 sm:p-8 shadow-2xl card-star max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setSelectedProject(null)}
              className="absolute end-4 top-4 rounded-full border border-border p-2 text-text-secondary hover:border-accent hover:text-text-primary"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="aspect-square rounded-2xl overflow-hidden border border-border bg-surface-elevated">
                <img
                  src={selectedProject.coverUrl}
                  alt={isAr ? selectedProject.titleAr : selectedProject.titleEn}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex flex-col justify-between space-y-4">
                <div>
                  <span className="rounded-full bg-accent/15 px-3 py-1 text-xs text-accent font-semibold">
                    {isAr ? selectedProject.categoryLabelAr : selectedProject.categoryLabelEn}
                  </span>
                  <h2 className="mt-3 font-display text-3xl sm:text-4xl text-text-primary">
                    {isAr ? selectedProject.titleAr : selectedProject.titleEn}
                  </h2>
                  <p className="mt-3 text-xs sm:text-sm text-text-secondary leading-relaxed">
                    {isAr ? selectedProject.descriptionAr : selectedProject.descriptionEn}
                  </p>

                  {/* Project Palette */}
                  <div className="mt-5">
                    <p className="text-[11px] uppercase tracking-wider text-text-secondary font-semibold mb-2">
                      Color Palette:
                    </p>
                    <div className="flex items-center gap-2">
                      {selectedProject.palette.map((color, idx) => (
                        <span
                          key={idx}
                          className="h-6 w-6 rounded-full border border-border/80 shadow-xs"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Deliverables */}
                  <div className="mt-5">
                    <p className="text-[11px] uppercase tracking-wider text-text-secondary font-semibold mb-2">
                      Deliverables Included:
                    </p>
                    <ul className="space-y-1 text-xs text-text-secondary">
                      {selectedProject.deliverables.map((deliv, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
                          <span>{deliv}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-border/60 flex flex-wrap gap-3">
                  <Link
                    to="/custom-orders"
                    className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-background hover:opacity-90 shadow-xs"
                  >
                    <span>{isAr ? "طلب تصميم مشابه" : "Inquire Similar Design"}</span>
                    <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
                  </Link>

                  <a
                    href={`${CONTACT.behance}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-border px-5 py-2.5 text-xs uppercase tracking-wider text-text-secondary hover:text-text-primary hover:border-accent"
                  >
                    <span>Behance</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
