import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Truck, Clock, ShieldCheck, MapPin, Sparkles } from "lucide-react";
import { Star } from "@/components/site/Star";
import { ShippingZonesCard } from "@/components/site/ShippingZonesCard";
import { EGYPTIAN_GOVERNORATES } from "@/lib/egypt-shipping";
import { useI18n } from "@/lib/i18n";
import { CONTACT } from "@/lib/store";

export const Route = createFileRoute("/shipping-policy")({
  head: () => ({
    meta: [
      { title: "Shipping & Delivery Policy — Linora Stellar" },
      {
        name: "description",
        content:
          "Egypt nationwide shipping guidelines, delivery timelines by governorate, courier door-to-door delivery and digital instant download delivery.",
      },
      { property: "og:title", content: "Shipping & Delivery Policy — Linora Stellar" },
      {
        property: "og:description",
        content:
          "Governorate timelines, doorstep delivery fees and packaging details across Egypt.",
      },
    ],
  }),
  component: ShippingPolicy,
});

function ShippingPolicy() {
  const { lang } = useI18n();
  const isAr = lang === "ar";

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 lg:px-8">
      <Link
        to="/shop"
        className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-gold transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5 rtl:rotate-180" />
        {isAr ? "العودة إلى المتجر" : "Back to shop"}
      </Link>

      <div className="mt-6 flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-gold">
        <Star className="h-3.5 w-3.5" />
        <span>{isAr ? "سياسات لينورا ستيلر" : "Egypt Nationwide Delivery"}</span>
      </div>

      <h1 className="mt-3 font-display text-4xl sm:text-5xl">
        {isAr ? "سياسة الشحن والتوصيل" : "Shipping & Delivery Policy"}
      </h1>

      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        {isAr
          ? "نقوم بتوصيل قطع لينورا ستيلر الفلكية إلى جميع محافظات جمهورية مصر العربية من الإسكندرية إلى أسوان، بتغليف فاخر يحمي منتجاتك حتى باب منزلك."
          : "We deliver Linora Stellar celestial creations door-to-door across all Egyptian governorates, packaged in protective signature starry packaging."}
      </p>

      {/* Egyptian Shipping Zones Card Preview */}
      <div className="mt-10">
        <ShippingZonesCard />
      </div>

      <div className="mt-10 space-y-8">
        {/* Timelines by Region */}
        <div className="rounded-xl border border-border p-6 card-star">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-gold" />
            <h2 className="font-display text-2xl">
              {isAr ? "مواعيد وجداول التوصيل بالمحافظات" : "Delivery Timelines by Region"}
            </h2>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-border/70 p-4 bg-card/40">
              <span className="font-semibold text-foreground text-sm block">
                {isAr ? "القاهرة والجيزة" : "Cairo & Giza"}
              </span>
              <p className="text-xs text-gold mt-1 font-mono">
                24 – 48 {isAr ? "ساعة عمل" : "hours"}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                {isAr
                  ? "توصيل سريع مع مندوب متخصص حتى باب البيت أو مقر العمل."
                  : "Express door-to-door courier directly to your home or office."}
              </p>
            </div>

            <div className="rounded-lg border border-border/70 p-4 bg-card/40">
              <span className="font-semibold text-foreground text-sm block">
                {isAr ? "الإسكندرية والبحيرة" : "Alexandria & Beheira"}
              </span>
              <p className="text-xs text-gold mt-1 font-mono">
                2 – 3 {isAr ? "أيام عمل" : "business days"}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                {isAr
                  ? "شحن دوري منتظم إلى عروس البحر المتوسط والمدن الساحلية."
                  : "Regular scheduled deliveries across Alexandria and coastal districts."}
              </p>
            </div>

            <div className="rounded-lg border border-border/70 p-4 bg-card/40">
              <span className="font-semibold text-foreground text-sm block">
                {isAr ? "محافظات الدلتا والقناة" : "Delta & Canal Governorates"}
              </span>
              <p className="text-xs text-gold mt-1 font-mono">
                2 – 4 {isAr ? "أيام عمل" : "business days"}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                {isAr
                  ? "المنصورة، طنطا، الزقازيق، الإسماعيلية، بورسعيد، السويس."
                  : "Mansoura, Tanta, Zagazig, Ismailia, Port Said, and Suez."}
              </p>
            </div>

            <div className="rounded-lg border border-border/70 p-4 bg-card/40">
              <span className="font-semibold text-foreground text-sm block">
                {isAr ? "محافظات الصعيد والبحر الأحمر" : "Upper Egypt & Red Sea"}
              </span>
              <p className="text-xs text-gold mt-1 font-mono">
                3 – 6 {isAr ? "أيام عمل" : "business days"}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                {isAr
                  ? "بني سويف، المنيا، أسيوط، سوهاج، قنا، الأقصر، أسوان، والغردقة."
                  : "Beni Suef, Minya, Asyut, Sohag, Qena, Luxor, Aswan, and Hurghada."}
              </p>
            </div>
          </div>
        </div>

        {/* Digital vs Physical Delivery */}
        <div className="rounded-xl border border-border p-6 card-star">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-gold" />
            <h2 className="font-display text-2xl">
              {isAr ? "تسليم التنزيلات الرقمية والمطبوعات" : "Digital Delivery vs Physical Parcels"}
            </h2>
          </div>
          <div className="mt-4 space-y-3 text-sm text-muted-foreground">
            <p>
              <strong className="text-foreground">
                {isAr ? "الملفات الرقمية: " : "Digital Items: "}
              </strong>
              {isAr
                ? "يتم تسليمها فورياً وبدون أي مصاريف شحن مباشرة بعد تأكيد الدفع عبر صفحة الطلب وبريدك الإلكتروني ورسائل الواتساب."
                : "Zero delivery fees. Access links and high-res files are provisioned immediately upon payment verification on your order page, email, and WhatsApp."}
            </p>
            <p>
              <strong className="text-foreground">
                {isAr ? "معاينة الشحنة: " : "Parcel Inspection: "}
              </strong>
              {isAr
                ? "يمكنك فتح الشحنة بحضور مندوب شركة الشحن للتأكد من سلامة المنتجات ومطابقتها لطلبك."
                : "You may inspect your parcel upon handover by our courier to verify all items match your invoice."}
            </p>
          </div>
        </div>

        {/* Courier & Contact */}
        <div className="rounded-xl border border-gold/40 bg-gold/5 p-6">
          <h2 className="font-display text-xl text-gold flex items-center gap-2">
            <ShieldCheck className="h-5 w-5" />
            {isAr ? "متابعة شحنتك لحظة بلحظة" : "Real-time Order & Delivery Tracking"}
          </h2>
          <p className="mt-2 text-sm text-foreground/90 leading-relaxed">
            {isAr
              ? "يمكنك في أي وقت إدخال رقم الطلب في صفحة تتبع الطلبات أو مراسلتنا على واتساب لمعرفة موقع شحنتك ورقم بوليصة المندوب."
              : "Track your package anytime via our Live Order Tracker using your reference number, or message our WhatsApp helpline."}
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              to="/track"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs uppercase tracking-wider text-primary-foreground font-medium hover:opacity-90"
            >
              <Truck className="h-4 w-4" />
              <span>{isAr ? "تتبع طلبي الآن" : "Track My Order"}</span>
            </Link>
            <a
              href={`${CONTACT.whatsappLink}?text=${encodeURIComponent("Hi Nora! I would like to check on my delivery.")}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-gold px-5 py-2.5 text-xs uppercase tracking-wider text-gold hover:bg-gold/10"
            >
              <span>WhatsApp: {CONTACT.whatsapp}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
