export type ProductReview = {
  id: string;
  product_id?: string;
  product_slug: string;
  author_name: string;
  city?: string | null;
  rating: number; // 1 to 5
  title: string;
  comment: string;
  is_verified: boolean;
  created_at: string;
};

const STORAGE_KEY = "linora_product_reviews";

export const INITIAL_REVIEWS: ProductReview[] = [
  {
    id: "rev-1",
    product_slug: "starlight-product-labels",
    author_name: "Dina Khaled",
    city: "Cairo / القاهرة",
    rating: 5,
    title: "The gold foil is pure magic",
    comment:
      "Ordered these for my handmade candle business. The gold foil and matte navy paper gave my packaging an elite, bespoke feel. Delivered right to my door in Maadi in 2 days.",
    is_verified: true,
    created_at: "2026-09-15T14:32:00Z",
  },
  {
    id: "rev-2",
    product_slug: "starlight-product-labels",
    author_name: "Farida Hany",
    city: "Alexandria / الإسكندرية",
    rating: 5,
    title: "Exceptional print quality",
    comment:
      "Crisp details and durable finish. Nora was so helpful on WhatsApp confirming my logo file before printing. Will definitely order again!",
    is_verified: true,
    created_at: "2026-09-20T10:15:00Z",
  },
  {
    id: "rev-3",
    product_slug: "constellation-digital-planner",
    author_name: "Yasmine Tarek",
    city: "Giza / الجيزة",
    rating: 5,
    title: "Best digital planner I have ever used",
    comment:
      "Imported smoothly into GoodNotes on my iPad. The hyperlinked constellation tabs make navigating daily, weekly, and monthly goals a serene, magical ritual.",
    is_verified: true,
    created_at: "2026-09-18T18:45:00Z",
  },
  {
    id: "rev-4",
    product_slug: "constellation-digital-planner",
    author_name: "Mariam Soliman",
    city: "Mansoura / المنصورة",
    rating: 5,
    title: "Instant delivery and gorgeous layout",
    comment:
      "Received the download link and PDF file within seconds on my email and WhatsApp. Beautiful font choices and plenty of space for reflections.",
    is_verified: true,
    created_at: "2026-09-22T09:20:00Z",
  },
  {
    id: "rev-5",
    product_slug: "celestial-wedding-suite",
    author_name: "Salma & Omar",
    city: "New Cairo / التجمع",
    rating: 5,
    title: "All our guests were in awe",
    comment:
      "The wax seals, gold celestial typography, and thick textured cotton paper were breathtaking. Nora captured our story under the stars flawlessly.",
    is_verified: true,
    created_at: "2026-09-10T16:00:00Z",
  },
  {
    id: "rev-6",
    product_slug: "stargazer-tshirt",
    author_name: "Karim Mostafa",
    city: "Cairo / المعادي",
    rating: 5,
    title: "Pure Egyptian cotton and elite embroidery",
    comment:
      "The heavy Egyptian cotton feels soft and breathable. The gold thread embroidery holds up perfectly after multiple washes. True to size.",
    is_verified: true,
    created_at: "2026-09-21T12:00:00Z",
  },
  {
    id: "rev-7",
    product_slug: "astronomy-classroom-pack",
    author_name: "Nouran Adel",
    city: "Sheikh Zayed / زايد",
    rating: 5,
    title: "My elementary students loved it!",
    comment:
      "Inspiring posters, planet flashcards, and constellation charts. Brightened up our science room and engaged the kids immediately.",
    is_verified: true,
    created_at: "2026-09-14T11:10:00Z",
  },
  {
    id: "rev-8",
    product_slug: "brand-identity-package",
    author_name: "Aya Radwan",
    city: "Cairo / القاهرة",
    rating: 5,
    title: "Transformed my brand identity",
    comment:
      "Nora designed a stellar brand system that perfectly conveys timeless elegance. The brand book, color guide, and social templates are ready to use.",
    is_verified: true,
    created_at: "2026-09-08T15:20:00Z",
  },
];

export function getStoredReviews(): ProductReview[] {
  if (typeof window === "undefined") return INITIAL_REVIEWS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_REVIEWS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // fallback
  }
  return INITIAL_REVIEWS;
}

export function saveStoredReviews(reviews: ProductReview[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
  } catch {
    // ignore
  }
}

export function getInitialReviewsForProduct(productSlug: string): ProductReview[] {
  return INITIAL_REVIEWS.filter((r) => r.product_slug === productSlug);
}

export function getReviewsForProduct(productSlug: string): ProductReview[] {
  const all = getStoredReviews();
  return all.filter((r) => r.product_slug === productSlug);
}

export function addReview(review: Omit<ProductReview, "id" | "created_at">): ProductReview {
  const all = getStoredReviews();
  const newReview: ProductReview = {
    ...review,
    id: `rev-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    created_at: new Date().toISOString(),
  };
  const updated = [newReview, ...all];
  saveStoredReviews(updated);
  return newReview;
}

export function calculateAverageRating(reviews: ProductReview[]): {
  average: number;
  count: number;
  breakdown: Record<number, number>;
} {
  const count = reviews.length;
  if (count === 0) {
    return {
      average: 5,
      count: 0,
      breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    };
  }

  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  const average = Number((sum / count).toFixed(1));

  const breakdown: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => {
    const rounded = Math.min(5, Math.max(1, Math.round(r.rating)));
    breakdown[rounded] = (breakdown[rounded] || 0) + 1;
  });

  return { average, count, breakdown };
}
