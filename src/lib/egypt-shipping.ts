export type EgyptianGovernorate = {
  id: string;
  nameEn: string;
  nameAr: string;
  fee: number;
  zone: "cairo_giza" | "alexandria" | "delta_canal" | "upper_frontier";
  estimatedDays: string;
  estimatedDaysAr: string;
};

export type ShippingZone = {
  id: string;
  titleEn: string;
  titleAr: string;
  fee: number;
  timeEn: string;
  timeAr: string;
  governorates: string[];
};

export const SHIPPING_ZONES: ShippingZone[] = [
  {
    id: "cairo_giza",
    titleEn: "Greater Cairo & Giza",
    titleAr: "القاهرة الكبرى والجيزة",
    fee: 50,
    timeEn: "1–2 business days",
    timeAr: "خلال 1–2 يوم عمل",
    governorates: ["Cairo", "Giza"],
  },
  {
    id: "alexandria",
    titleEn: "Alexandria",
    titleAr: "الإسكندرية",
    fee: 65,
    timeEn: "2–3 business days",
    timeAr: "خلال 2–3 أيام عمل",
    governorates: ["Alexandria"],
  },
  {
    id: "delta_canal",
    titleEn: "Delta & Canal Cities",
    titleAr: "الدلتا ومدن القناة",
    fee: 70,
    timeEn: "2–3 business days",
    timeAr: "خلال 2–3 أيام عمل",
    governorates: [
      "Qalyubia",
      "Sharqia",
      "Dakahlia",
      "Gharbia",
      "Monufia",
      "Beheira",
      "Kafr El Sheikh",
      "Damietta",
      "Port Said",
      "Ismailia",
      "Suez",
    ],
  },
  {
    id: "upper_frontier",
    titleEn: "Upper Egypt & Frontier Regions",
    titleAr: "محافظات الصعيد والمناطق الساحلية",
    fee: 85,
    timeEn: "3–5 business days",
    timeAr: "خلال 3–5 أيام عمل",
    governorates: [
      "Fayoum",
      "Beni Suef",
      "Minya",
      "Asyut",
      "Sohag",
      "Qena",
      "Luxor",
      "Aswan",
      "Red Sea",
      "Matrouh",
      "South Sinai",
      "North Sinai",
      "New Valley",
    ],
  },
];

export const EGYPTIAN_GOVERNORATES: EgyptianGovernorate[] = [
  {
    id: "cairo",
    nameEn: "Cairo",
    nameAr: "القاهرة",
    fee: 50,
    zone: "cairo_giza",
    estimatedDays: "1–2 business days",
    estimatedDaysAr: "خلال 1–2 يوم عمل",
  },
  {
    id: "giza",
    nameEn: "Giza",
    nameAr: "الجيزة",
    fee: 50,
    zone: "cairo_giza",
    estimatedDays: "1–2 business days",
    estimatedDaysAr: "خلال 1–2 يوم عمل",
  },
  {
    id: "alexandria",
    nameEn: "Alexandria",
    nameAr: "الإسكندرية",
    fee: 65,
    zone: "alexandria",
    estimatedDays: "2–3 business days",
    estimatedDaysAr: "خلال 2–3 أيام عمل",
  },
  {
    id: "qalyubia",
    nameEn: "Qalyubia",
    nameAr: "القليوبية",
    fee: 70,
    zone: "delta_canal",
    estimatedDays: "2–3 business days",
    estimatedDaysAr: "خلال 2–3 أيام عمل",
  },
  {
    id: "sharqia",
    nameEn: "Sharqia",
    nameAr: "الشرقية",
    fee: 70,
    zone: "delta_canal",
    estimatedDays: "2–3 business days",
    estimatedDaysAr: "خلال 2–3 أيام عمل",
  },
  {
    id: "dakahlia",
    nameEn: "Dakahlia (Mansoura)",
    nameAr: "الدقهلية (المنصورة)",
    fee: 70,
    zone: "delta_canal",
    estimatedDays: "2–3 business days",
    estimatedDaysAr: "خلال 2–3 أيام عمل",
  },
  {
    id: "gharbia",
    nameEn: "Gharbia (Tanta)",
    nameAr: "الغربية (طنطا)",
    fee: 70,
    zone: "delta_canal",
    estimatedDays: "2–3 business days",
    estimatedDaysAr: "خلال 2–3 أيام عمل",
  },
  {
    id: "monufia",
    nameEn: "Monufia",
    nameAr: "المنوفية",
    fee: 70,
    zone: "delta_canal",
    estimatedDays: "2–3 business days",
    estimatedDaysAr: "خلال 2–3 أيام عمل",
  },
  {
    id: "beheira",
    nameEn: "Beheira",
    nameAr: "البحيرة",
    fee: 70,
    zone: "delta_canal",
    estimatedDays: "2–3 business days",
    estimatedDaysAr: "خلال 2–3 أيام عمل",
  },
  {
    id: "kafr_el_sheikh",
    nameEn: "Kafr El Sheikh",
    nameAr: "كفر الشيخ",
    fee: 70,
    zone: "delta_canal",
    estimatedDays: "2–3 business days",
    estimatedDaysAr: "خلال 2–3 أيام عمل",
  },
  {
    id: "damietta",
    nameEn: "Damietta",
    nameAr: "دمياط",
    fee: 70,
    zone: "delta_canal",
    estimatedDays: "2–3 business days",
    estimatedDaysAr: "خلال 2–3 أيام عمل",
  },
  {
    id: "port_said",
    nameEn: "Port Said",
    nameAr: "بورسعيد",
    fee: 70,
    zone: "delta_canal",
    estimatedDays: "2–3 business days",
    estimatedDaysAr: "خلال 2–3 أيام عمل",
  },
  {
    id: "ismailia",
    nameEn: "Ismailia",
    nameAr: "الإسماعيلية",
    fee: 70,
    zone: "delta_canal",
    estimatedDays: "2–3 business days",
    estimatedDaysAr: "خلال 2–3 أيام عمل",
  },
  {
    id: "suez",
    nameEn: "Suez",
    nameAr: "السويس",
    fee: 70,
    zone: "delta_canal",
    estimatedDays: "2–3 business days",
    estimatedDaysAr: "خلال 2–3 أيام عمل",
  },
  {
    id: "fayoum",
    nameEn: "Fayoum",
    nameAr: "الفيوم",
    fee: 85,
    zone: "upper_frontier",
    estimatedDays: "3–4 business days",
    estimatedDaysAr: "خلال 3–4 أيام عمل",
  },
  {
    id: "beni_suef",
    nameEn: "Beni Suef",
    nameAr: "بني سويف",
    fee: 85,
    zone: "upper_frontier",
    estimatedDays: "3–4 business days",
    estimatedDaysAr: "خلال 3–4 أيام عمل",
  },
  {
    id: "minya",
    nameEn: "Minya",
    nameAr: "المنيا",
    fee: 85,
    zone: "upper_frontier",
    estimatedDays: "3–4 business days",
    estimatedDaysAr: "خلال 3–4 أيام عمل",
  },
  {
    id: "asyut",
    nameEn: "Asyut",
    nameAr: "أسيوط",
    fee: 85,
    zone: "upper_frontier",
    estimatedDays: "3–5 business days",
    estimatedDaysAr: "خلال 3–5 أيام عمل",
  },
  {
    id: "sohag",
    nameEn: "Sohag",
    nameAr: "سوهاج",
    fee: 85,
    zone: "upper_frontier",
    estimatedDays: "3–5 business days",
    estimatedDaysAr: "خلال 3–5 أيام عمل",
  },
  {
    id: "qena",
    nameEn: "Qena",
    nameAr: "قنا",
    fee: 85,
    zone: "upper_frontier",
    estimatedDays: "3–5 business days",
    estimatedDaysAr: "خلال 3–5 أيام عمل",
  },
  {
    id: "luxor",
    nameEn: "Luxor",
    nameAr: "الأقصر",
    fee: 85,
    zone: "upper_frontier",
    estimatedDays: "3–5 business days",
    estimatedDaysAr: "خلال 3–5 أيام عمل",
  },
  {
    id: "aswan",
    nameEn: "Aswan",
    nameAr: "أسوان",
    fee: 85,
    zone: "upper_frontier",
    estimatedDays: "3–5 business days",
    estimatedDaysAr: "خلال 3–5 أيام عمل",
  },
  {
    id: "red_sea",
    nameEn: "Red Sea (Hurghada / Gouna)",
    nameAr: "البحر الأحمر (الغردقة / الجونة)",
    fee: 85,
    zone: "upper_frontier",
    estimatedDays: "3–5 business days",
    estimatedDaysAr: "خلال 3–5 أيام عمل",
  },
  {
    id: "matrouh",
    nameEn: "Matrouh / North Coast",
    nameAr: "مطروح / الساحل الشمالي",
    fee: 85,
    zone: "upper_frontier",
    estimatedDays: "3–5 business days",
    estimatedDaysAr: "خلال 3–5 أيام عمل",
  },
  {
    id: "south_sinai",
    nameEn: "South Sinai (Sharm El Sheikh / Dahab)",
    nameAr: "جنوب سيناء (شرم الشيخ / دهب)",
    fee: 85,
    zone: "upper_frontier",
    estimatedDays: "3–5 business days",
    estimatedDaysAr: "خلال 3–5 أيام عمل",
  },
  {
    id: "north_sinai",
    nameEn: "North Sinai",
    nameAr: "شمال سيناء",
    fee: 85,
    zone: "upper_frontier",
    estimatedDays: "3–5 business days",
    estimatedDaysAr: "خلال 3–5 أيام عمل",
  },
  {
    id: "new_valley",
    nameEn: "New Valley",
    nameAr: "الوادي الجديد",
    fee: 85,
    zone: "upper_frontier",
    estimatedDays: "3–5 business days",
    estimatedDaysAr: "خلال 3–5 أيام عمل",
  },
];

const DIGITAL_SLUGS = new Set([
  "constellation-digital-planner",
  "weekly-meal-planner",
  "budget-tracker-printables",
  "brand-identity-package",
  "social-media-template-pack",
  "custom-portrait-illustration",
]);

export function requiresPhysicalShipping(items: Array<{ slug?: string; name?: string }>): boolean {
  if (items.length === 0) return false;
  return items.some((item) => !DIGITAL_SLUGS.has(item.slug ?? ""));
}

export function getGovernorate(idOrName: string): EgyptianGovernorate | undefined {
  if (!idOrName) return undefined;
  const norm = idOrName.trim().toLowerCase();
  return EGYPTIAN_GOVERNORATES.find(
    (g) =>
      g.id.toLowerCase() === norm ||
      g.nameEn.toLowerCase() === norm ||
      g.nameAr.toLowerCase() === norm ||
      norm.includes(g.id.toLowerCase()) ||
      norm.includes(g.nameEn.toLowerCase()),
  );
}
