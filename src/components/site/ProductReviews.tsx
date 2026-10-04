import { useState, useEffect } from "react";
import { Star, CheckCircle, MessageSquarePlus, User, MapPin } from "lucide-react";
import { toast } from "sonner";
import {
  ProductReview,
  getInitialReviewsForProduct,
  getReviewsForProduct,
  addReview,
  calculateAverageRating,
} from "@/lib/reviews";
import { useI18n } from "@/lib/i18n";

type ProductReviewsProps = {
  productSlug: string;
  productName: string;
};

export function ProductReviews({ productSlug, productName }: ProductReviewsProps) {
  const { t, lang } = useI18n();
  const isAr = lang === "ar";

  const [reviews, setReviews] = useState<ProductReview[]>(() =>
    getInitialReviewsForProduct(productSlug),
  );

  useEffect(() => {
    setReviews(getReviewsForProduct(productSlug));
  }, [productSlug]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const stats = calculateAverageRating(reviews);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !comment.trim() || !title.trim()) {
      toast.error(isAr ? "يرجى ملء جميع الحقول المطلوبة." : "Please fill out all required fields.");
      return;
    }

    setIsSubmitting(true);

    const created = addReview({
      product_slug: productSlug,
      author_name: name.trim(),
      city: city.trim() || null,
      rating,
      title: title.trim(),
      comment: comment.trim(),
      is_verified: true,
    });

    setReviews((prev) => [created, ...prev]);
    setIsSubmitting(false);
    setIsFormOpen(false);
    setName("");
    setCity("");
    setTitle("");
    setComment("");
    setRating(5);

    toast.success(t("reviews.successToast"));
  }

  return (
    <div className="border-t border-border/80 pt-16 mt-16 space-y-10">
      {/* Header & Stats Overview */}
      <div className="card-star rounded-2xl border border-border/80 p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-6 pb-6 border-b border-border/60">
          <div>
            <h2 className="font-display text-3xl flex items-center gap-2.5">
              <Star className="h-6 w-6 text-gold fill-gold" />
              <span>{t("reviews.title")}</span>
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {isAr
                ? `آراء وتقييمات العملاء لمنتج ${productName}`
                : `Verified customer experiences for ${productName}`}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsFormOpen((v) => !v)}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-xs uppercase tracking-[0.16em] text-primary-foreground hover:opacity-90 transition-opacity font-medium"
          >
            <MessageSquarePlus className="h-4 w-4" />
            <span>{isFormOpen ? t("reviews.cancel") : t("reviews.writeReview")}</span>
          </button>
        </div>

        {/* Rating Breakdown Bar & Average Score */}
        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 items-center">
          {/* Average Score Box */}
          <div className="flex flex-col items-center justify-center text-center sm:border-e sm:border-border/60 p-4">
            <span className="font-display text-6xl font-bold text-gold tracking-tight">
              {stats.count > 0 ? stats.average.toFixed(1) : "5.0"}
            </span>
            <div className="flex items-center gap-1 my-2">
              {[1, 2, 3, 4, 5].map((starIdx) => (
                <Star
                  key={starIdx}
                  className={`h-4 w-4 ${
                    starIdx <= Math.round(stats.average)
                      ? "text-gold fill-gold"
                      : "text-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("reviews.basedOn")}{" "}
              <span className="font-semibold text-foreground">{stats.count}</span>{" "}
              {t("reviews.reviewsWord")}
            </p>
          </div>

          {/* Rating Bars */}
          <div className="space-y-2 lg:col-span-2">
            {[5, 4, 3, 2, 1].map((starNum) => {
              const countForStar = stats.breakdown[starNum] || 0;
              const percentage = stats.count > 0 ? (countForStar / stats.count) * 100 : 0;

              return (
                <div
                  key={starNum}
                  className="flex items-center gap-3 text-xs text-muted-foreground"
                >
                  <span className="w-12 text-end flex items-center justify-end gap-1 font-mono">
                    <span>{starNum}</span>
                    <Star className="h-3 w-3 text-gold fill-gold inline" />
                  </span>
                  <div className="h-2 flex-1 rounded-full bg-muted/60 overflow-hidden">
                    <div
                      className="h-full bg-gold transition-all duration-500 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="w-8 font-mono text-[11px] text-muted-foreground">
                    {countForStar}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Review Form (Collapsible) */}
      {isFormOpen && (
        <form
          onSubmit={handleSubmit}
          className="card-star rounded-2xl border border-gold/40 bg-card p-6 sm:p-8 space-y-5 animate-in fade-in slide-in-from-top-4 duration-300"
        >
          <div className="border-b border-border/60 pb-3">
            <h3 className="font-display text-2xl">{t("reviews.writeReview")}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isAr
                ? "شاركينا رأيك حول الخامة، التغليف، وتجربتك الشاملة."
                : "Share your honest feedback on quality, packaging, and your overall experience."}
            </p>
          </div>

          {/* Rating Stars Input */}
          <div>
            <label className="text-xs uppercase tracking-[0.16em] text-muted-foreground block mb-2">
              {t("reviews.rating")} *
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((starIdx) => {
                const active = (hoverRating ?? rating) >= starIdx;
                return (
                  <button
                    key={starIdx}
                    type="button"
                    onClick={() => setRating(starIdx)}
                    onMouseEnter={() => setHoverRating(starIdx)}
                    onMouseLeave={() => setHoverRating(null)}
                    className="p-1 transition-transform hover:scale-125 focus:outline-none"
                    aria-label={`${starIdx} stars`}
                  >
                    <Star
                      className={`h-6 w-6 transition-colors ${
                        active ? "text-gold fill-gold" : "text-muted-foreground/40"
                      }`}
                    />
                  </button>
                );
              })}
              <span className="ms-2 font-mono text-xs font-semibold text-gold">{rating} / 5</span>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                className="text-xs uppercase tracking-[0.16em] text-muted-foreground"
                htmlFor="rev_name"
              >
                {t("reviews.name")} *
              </label>
              <input
                id="rev_name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={isAr ? "نورا تامر" : "Nora Tamer"}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-gold"
              />
            </div>

            <div>
              <label
                className="text-xs uppercase tracking-[0.16em] text-muted-foreground"
                htmlFor="rev_city"
              >
                {t("reviews.city")}
              </label>
              <input
                id="rev_city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder={isAr ? "القاهرة / الإسكندرية / المنصورة" : "Cairo, Alexandria, Giza…"}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-gold"
              />
            </div>
          </div>

          <div>
            <label
              className="text-xs uppercase tracking-[0.16em] text-muted-foreground"
              htmlFor="rev_title"
            >
              {t("reviews.reviewTitle")} *
            </label>
            <input
              id="rev_title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("reviews.reviewTitlePlaceholder")}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-gold"
            />
          </div>

          <div>
            <label
              className="text-xs uppercase tracking-[0.16em] text-muted-foreground"
              htmlFor="rev_comment"
            >
              {t("reviews.comment")} *
            </label>
            <textarea
              id="rev_comment"
              required
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={t("reviews.commentPlaceholder")}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-gold"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="rounded-full border border-border px-5 py-2 text-xs uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground"
            >
              {t("reviews.cancel")}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-full bg-primary px-7 py-2 text-xs uppercase tracking-[0.16em] text-primary-foreground hover:opacity-90 disabled:opacity-50 font-medium"
            >
              {isSubmitting ? t("reviews.submitting") : t("reviews.submit")}
            </button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="card-star rounded-xl border border-border p-10 text-center">
            <p className="text-sm text-muted-foreground">{t("reviews.noReviews")}</p>
          </div>
        ) : (
          reviews.map((rev) => (
            <div
              key={rev.id}
              className="card-star rounded-xl border border-border/70 bg-card/60 p-5 sm:p-6 space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`h-3.5 w-3.5 ${
                          s <= rev.rating ? "text-gold fill-gold" : "text-muted-foreground/30"
                        }`}
                      />
                    ))}
                  </div>
                  <h4 className="font-semibold text-sm text-foreground">{rev.title}</h4>
                </div>

                <span className="text-[11px] text-muted-foreground">
                  {new Date(rev.created_at).toLocaleDateString(isAr ? "ar-EG" : "en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">{rev.comment}</p>

              <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-muted-foreground border-t border-border/50">
                <span className="flex items-center gap-1 font-medium text-foreground">
                  <User className="h-3 w-3 text-gold/80" />
                  {rev.author_name}
                </span>

                {rev.city && (
                  <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <MapPin className="h-2.5 w-2.5 text-gold/60" />
                    {rev.city}
                  </span>
                )}

                {rev.is_verified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20 ms-auto">
                    <CheckCircle className="h-2.5 w-2.5" />
                    <span>{t("reviews.verified")}</span>
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
