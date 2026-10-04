import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, BookOpen, Scale, Award, Sparkles } from "lucide-react";
import { Star } from "@/components/site/Star";
import { CONTACT } from "@/lib/store";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/terms-of-service")({
  head: () => ({
    meta: [
      { title: "Terms of Service — Linora Stellar" },
      {
        name: "description",
        content:
          "Terms and conditions for using Linora Stellar, intellectual property licensing for celestial printables, and custom order terms.",
      },
      { property: "og:title", content: "Terms of Service — Linora Stellar" },
      {
        property: "og:description",
        content: "Intellectual property, licensing, and purchasing terms.",
      },
    ],
  }),
  component: TermsOfService,
});

function TermsOfService() {
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
        <span>{isAr ? "الشروط والأحكام" : "Legal Terms"}</span>
      </div>

      <h1 className="mt-3 font-display text-4xl sm:text-5xl">
        {isAr ? "شروط الاستخدام والخدمة" : "Terms of Service"}
      </h1>

      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        {isAr
          ? "مرحباً بك في لينورا ستيلر. باستخدامك لموقعنا وشراء تصميماتنا الفلكية أو طلب خدمات الهوية البصرية، فإنك توافق على الشروط والأحكام الموضحة أدناه."
          : "Welcome to Linora Stellar. By accessing our platform, purchasing celestial designs, or commissioning bespoke branding, you agree to the following terms and guidelines."}
      </p>

      <div className="mt-10 space-y-6">
        <div className="rounded-xl border border-border p-6 card-star">
          <div className="flex items-center gap-3">
            <Award className="h-5 w-5 text-gold" />
            <h2 className="font-display text-2xl">
              {isAr
                ? "1. حقوق الملكية الفكرية والتصميم"
                : "1. Intellectual Property & Design Rights"}
            </h2>
          </div>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
            {isAr
              ? "جميع الرسوم التوضيحية الفلكية والشعارات والأنماط والمخططات المعروضة على لينورا ستيلر هي حقوق ملكية فكرية أصلية محفوظة للمصممة نورا تامر. المنتجات الرقمية مرخصة للاستخدام الشخصي فقط، ويُحظر إعادة بيع الملفات الرقمية الأصلية أو توزيعها تجارياً دون ترخيص تجاري كتابي مسبق."
              : "All celestial illustrations, patterns, typography grids, and printable blueprints published under Linora Stellar are the intellectual property of Nora Tamer. Digital downloads are licensed for personal use only and may not be redistributed, resold, or sublicensed without explicit written authorization."}
          </p>
        </div>

        <div className="rounded-xl border border-border p-6 card-star">
          <div className="flex items-center gap-3">
            <Scale className="h-5 w-5 text-gold" />
            <h2 className="font-display text-2xl">
              {isAr ? "2. إتمام الطلبات والدفع في مصر" : "2. Pricing & Orders in Egypt"}
            </h2>
          </div>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
            {isAr
              ? "جميع الأسعار المعروضة بالجنيه المصري (EGP). نحتفظ بالحق في تأكيد الطلب بعد التحقق من صحة بيانات التحويل الخاصة بمحافظ فودافون كاش أو إنستاباي. في حال عدم توفر منتج أو تعذر الوصول إلى عنوان العميل، يتم التواصل فوراً والتنسيق مع العميل أو استرداد كامل المبلغ."
              : "All catalog prices are listed in Egyptian Pounds (EGP). Orders paid via Vodafone Cash or InstaPay are verified before dispatch. If a requested product variant is unavailable, customer care will notify you immediately for a full refund or suitable alternative."}
          </p>
        </div>

        <div className="rounded-xl border border-border p-6 card-star">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-gold" />
            <h2 className="font-display text-2xl">
              {isAr
                ? "3. شروط التصميم المخصص والهويات البصرية"
                : "3. Custom Design & Branding Commissions"}
            </h2>
          </div>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
            {isAr
              ? "تشمل باقات الهوية البصرية والطلبات الخاصة جولات مراجعة محددة موضحة في تفاصيل الباقة. يتم تسليم الملفات النهائية بالصيغ المعتمدة (Vector/PDF/PNG) بعد سداد كامل المستحقات."
              : "Custom branding suites and commissioned illustrations include the designated revision rounds detailed in the package brief. Production files (Vector/PDF/PNG) and commercial rights transfer upon final balance settlement."}
          </p>
        </div>
      </div>
    </div>
  );
}
