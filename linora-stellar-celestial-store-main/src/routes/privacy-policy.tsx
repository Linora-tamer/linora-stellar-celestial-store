import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Shield, Lock, Eye, FileText } from "lucide-react";
import { Star } from "@/components/site/Star";
import { CONTACT } from "@/lib/store";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Linora Stellar" },
      {
        name: "description",
        content:
          "How Linora Stellar protects your personal data, phone numbers, delivery addresses, and payment information in Egypt.",
      },
      { property: "og:title", content: "Privacy Policy — Linora Stellar" },
      {
        property: "og:description",
        content: "Data privacy standards and protection guarantees.",
      },
    ],
  }),
  component: PrivacyPolicy,
});

function PrivacyPolicy() {
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
        <span>{isAr ? "حماية الخصوصية" : "Data Protection & Privacy"}</span>
      </div>

      <h1 className="mt-3 font-display text-4xl sm:text-5xl">
        {isAr ? "سياسة الخصوصية وأمان البيانات" : "Privacy Policy"}
      </h1>

      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        {isAr
          ? "خصوصيتك وثقتك في لينورا ستيلر هي أولويتنا القصوى. توضح هذه الوثيقة ماهية البيانات التي نجمعها عند إتمام طلبك وكيفية استخدامها وتأمينها بأعلى المعايير."
          : "Your privacy and trust are paramount at Linora Stellar. This document details what information we collect when you place an order, and how we protect and safeguard your personal data."}
      </p>

      <div className="mt-10 space-y-6">
        <div className="rounded-xl border border-border p-6 card-star">
          <div className="flex items-center gap-3">
            <Lock className="h-5 w-5 text-gold" />
            <h2 className="font-display text-2xl">
              {isAr ? "1. البيانات التي نجمعها" : "1. Information We Collect"}
            </h2>
          </div>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground list-disc ps-5 leading-relaxed">
            <li>
              <strong className="text-foreground">
                {isAr ? "بيانات التواصل: " : "Contact Information: "}
              </strong>
              {isAr
                ? "الاسم الكامل، عنوان البريد الإلكتروني، ورقم الهاتف أو الواتساب للتواصل بخصوص حالة الطلب."
                : "Full name, email address, and WhatsApp/phone number for delivery updates."}
            </li>
            <li>
              <strong className="text-foreground">
                {isAr ? "بيانات الشحن: " : "Delivery Address: "}
              </strong>
              {isAr
                ? "المحافظة، المدينة، والشارع لتسليم المندوب الشحنة حتى بابك."
                : "Governorate, district, street address, and courier delivery notes."}
            </li>
            <li>
              <strong className="text-foreground">
                {isAr ? "بيانات التحقق من الدفع: " : "Payment Verification: "}
              </strong>
              {isAr
                ? "رقم العملية المرجعي لتحويل فودافون كاش أو إنستاباي. نحن لا نطلع على أو نخزن أية أرقام سرية أو كلمات مرور بنكية."
                : "Transaction reference ID or sender phone number. We never collect or store banking passwords, OTPs, or card PINs."}
            </li>
          </ul>
        </div>

        <div className="rounded-xl border border-border p-6 card-star">
          <div className="flex items-center gap-3">
            <Eye className="h-5 w-5 text-gold" />
            <h2 className="font-display text-2xl">
              {isAr ? "2. كيف نستخدم بياناتك" : "2. How We Use Your Data"}
            </h2>
          </div>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
            {isAr
              ? "نستخدم بياناتك حصرياً لتجهيز وشحن طلبك، إرسال روابط التنزيل الرقمي، والتواصل معك بخصوص أي استفسار حول التصميم المخصص. لا نقوم إطلاقاً ببيع أو تأجير أو مشاركة بيانات عملائنا مع أي أطراف إعلانية خارجية."
              : "Your information is used strictly to fulfill and dispatch orders, email digital printables, and coordinate bespoke design specifications. We never sell, rent, or trade customer data to third-party marketing brokers."}
          </p>
        </div>

        <div className="rounded-xl border border-border p-6 card-star">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-gold" />
            <h2 className="font-display text-2xl">
              {isAr ? "3. أمان وحفظ البيانات" : "3. Data Security"}
            </h2>
          </div>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
            {isAr
              ? "تُحفظ سجلات الطلبات في قواعد بيانات مشفرة ومحمية ببروتوكولات التشفير القياسية (SSL/TLS)، مع تقييد وصول البيانات لفريق إدارة لينورا ستيلر ومندوب الشحن المسؤول فقط."
              : "Order records are stored securely in encrypted databases under industry-standard SSL/TLS protocols. Access is strictly restricted to authorized Linora Stellar fulfillment personnel and the assigned courier."}
          </p>
        </div>
      </div>
    </div>
  );
}
