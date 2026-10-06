/**
 * Accurate Lunar Phase Tracker & Celestial Moon Engine
 * Synodic month: 29.53058867 days
 */

export interface LunarPhaseInfo {
  phaseIndex: number; // 0 to 7
  phaseKey:
    | "new_moon"
    | "waxing_crescent"
    | "first_quarter"
    | "waxing_gibbous"
    | "full_moon"
    | "waning_gibbous"
    | "last_quarter"
    | "waning_crescent";
  name: string;
  nameAr: string;
  emoji: string;
  ageDays: number;
  illumination: number; // 0 to 100 %
  daysToFullMoon: number;
  daysToNewMoon: number;
  creativeRitualEn: string;
  creativeRitualAr: string;
  recommendedProductsEn: string;
  recommendedProductsAr: string;
}

const LUNAR_PHASES_DATA = [
  {
    key: "new_moon" as const,
    name: "New Moon",
    nameAr: "محاق جديد",
    emoji: "🌑",
    ritualEn:
      "Intention Setting & Clean Slate. Plant seeds for upcoming brand identities & blank stationery pages.",
    ritualAr:
      "تحديد النوايا وبدايات جديدة. أنسب وقت لرسم خطط المشروعات وفتح صفحات الدفاتر البيضاء.",
    productsEn: "Undated Planners, Blank Journals, Custom Logo Concepts",
    productsAr: "المخططات غير المؤرخة، الدفاتر الفارغة، واستكشاف أفكار الشعارات",
  },
  {
    key: "waxing_crescent" as const,
    name: "Waxing Crescent",
    nameAr: "هلال متزايد",
    emoji: "🌒",
    ritualEn:
      "Spark of Momentum. Early sketching, drafting color palettes, and exploring typographic styles.",
    ritualAr: "شعلة الانطلاق. مسودات التصميم الأولية، اختيار لوحات الألوان، وتجربة الخطوط الفلكية.",
    productsEn: "Custom Labels, Notebook Trios, Digital Sticker Kits",
    productsAr: "ملصقات المنتجات المخصصة، باقات الدفاتر، ومجموعات الستيكرز الرقمية",
  },
  {
    key: "first_quarter" as const,
    name: "First Quarter",
    nameAr: "تربيع أول",
    emoji: "🌓",
    ritualEn:
      "Decisive Action & Overcoming Resistance. Solidify proofs, select print finishes, and refine details.",
    ritualAr:
      "اتخاذ القرار والشجاعة الإبداعية. اعتماد بروفات الطباعة النهائية واختيار نوعية الورق الفاخر.",
    productsEn: "Packaging Design, School Activity Packs, Luxury Name Tags",
    productsAr: "تصميم التغليف والعبوات، باقات الفصول المدرسية، وبطاقات الأسماء الفاخرة",
  },
  {
    key: "waxing_gibbous" as const,
    name: "Waxing Gibbous",
    nameAr: "أحدب متزايد",
    emoji: "🌔",
    ritualEn:
      "Refinement & Deep Focus. Fine-tuning typography, vector alignments, and preparing for the grand launch.",
    ritualAr: "التهذيب والتركيز العميق. تدقيق المحاذاة ومراجعة درجات الذهب قبل اللحظة الكبرى.",
    productsEn: "Bespoke Invitation Cards, Ceramic Mugs, Printables",
    productsAr: "كروت الدعوات المخصصة، المجات السيراميكية، والمطبوعات الفلكية",
  },
  {
    key: "full_moon" as const,
    name: "Full Moon",
    nameAr: "بدر مكتمل",
    emoji: "🌕",
    ritualEn:
      "Peak Illumination & Celebration. Reveal finished identities, ship stationery, and celebrate creative breakthroughs.",
    ritualAr:
      "ذروة الضياء والاحتفال. إطلاق الهويات البصرية المكتملة وتدشين المنتجات في أوج بريقها.",
    productsEn: "Stellar Collection, Constellation Hoodies, Complete Brand Suite",
    productsAr: "المجموعة الفلكية المتكاملة، هوديز الأبراج، وباقات الهوية الشاملة",
  },
  {
    key: "waning_gibbous" as const,
    name: "Waning Gibbous",
    nameAr: "أحدب متناقص",
    emoji: "🌖",
    ritualEn:
      "Gratitude & Sharing Wisdom. Share portfolio case studies, write thoughtful customer notes, and reflect.",
    ritualAr:
      "الامتنان ومشاركة الخبرات. نشر دراسات الجدوى الفنية، كتابة كروت الشكر للعملاء والتأمل.",
    productsEn: "Thank-You Cards, Portfolio Prints, Educational Kits",
    productsAr: "كروت الشكر والتقدير، مطبوعات الأعمال، والمجموعات التعليمية",
  },
  {
    key: "last_quarter" as const,
    name: "Last Quarter",
    nameAr: "تربيع أخير",
    emoji: "🌗",
    ritualEn:
      "Release & Decluttering. Clear unfinished drafts, organize digital asset libraries, and simplify workflows.",
    ritualAr: "التخلي والترتيب. تنظيف ملفات التصميم القديمة، ترتيب مجلدات العمل، وتبسيط الإجراءات.",
    productsEn: "Digital File Organizers, Minimalist Sticky Notes, Budget Planners",
    productsAr: "منظمات الملفات الرقمية، أوراق الملاحظات المبسطة، ودفاتر الميزانية",
  },
  {
    key: "waning_crescent" as const,
    name: "Waning Crescent",
    nameAr: "هلال متناقص",
    emoji: "🌘",
    ritualEn:
      "Quiet Rest & Celestial Surrender. Recharge imagination, read design books, and allow ideas to incubate.",
    ritualAr:
      "الهدوء والسكينة الفلكية. إعادة شحن طاقة الخيال، القراءة في الفنون، وترك الأفكار تنضج في هدوء.",
    productsEn: "Evening Reflection Journals, Celestial Bookmarks, Star Art Prints",
    productsAr: "دفاتر التأمل المسائي، فواصل الكتب الفلكية، واللوحات الجدارية",
  },
];

const SYNODIC_MONTH = 29.53058867;
// Reference New Moon: January 6, 2000, 18:14 UTC
const KNOWN_NEW_MOON_MS = Date.UTC(2000, 0, 6, 18, 14, 0);

export function getLunarPhase(date: Date = new Date()): LunarPhaseInfo {
  const diffMs = date.getTime() - KNOWN_NEW_MOON_MS;
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  const cycleFraction = ((diffDays % SYNODIC_MONTH) + SYNODIC_MONTH) % SYNODIC_MONTH;
  const ageDays = Math.round(cycleFraction * 10) / 10;

  // Illumination calculation based on phase angle
  const phaseAngle = (cycleFraction / SYNODIC_MONTH) * 2 * Math.PI;
  const illumination = Math.round(((1 - Math.cos(phaseAngle)) / 2) * 100);

  // Determine 8-phase index
  // 8 segments each ~3.69 days wide, centered around 0, 1/8, 2/8...
  const segment = SYNODIC_MONTH / 8;
  const normalizedAge = (cycleFraction + segment / 2) % SYNODIC_MONTH;
  const phaseIndex = Math.min(7, Math.floor(normalizedAge / segment));

  const data = LUNAR_PHASES_DATA[phaseIndex] ?? LUNAR_PHASES_DATA[0]!;

  // Days until next full moon (age approx 14.765 days)
  const fullMoonAge = SYNODIC_MONTH / 2;
  const daysToFullMoon =
    cycleFraction <= fullMoonAge
      ? Math.round((fullMoonAge - cycleFraction) * 10) / 10
      : Math.round((SYNODIC_MONTH - cycleFraction + fullMoonAge) * 10) / 10;

  // Days until next new moon
  const daysToNewMoon = Math.round((SYNODIC_MONTH - cycleFraction) * 10) / 10;

  return {
    phaseIndex,
    phaseKey: data.key,
    name: data.name,
    nameAr: data.nameAr,
    emoji: data.emoji,
    ageDays,
    illumination,
    daysToFullMoon,
    daysToNewMoon,
    creativeRitualEn: data.ritualEn,
    creativeRitualAr: data.ritualAr,
    recommendedProductsEn: data.productsEn,
    recommendedProductsAr: data.productsAr,
  };
}

export function getAllLunarPhases() {
  return LUNAR_PHASES_DATA;
}
