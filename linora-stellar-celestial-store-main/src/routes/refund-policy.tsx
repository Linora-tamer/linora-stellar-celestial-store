import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ShieldAlert, CheckCircle, HelpCircle, MessageCircle } from "lucide-react";
import { Star } from "@/components/site/Star";
import { CONTACT } from "@/lib/store";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/refund-policy")({
  head: () => ({
    meta: [
      { title: "Refund & Exchange Policy — Linora Stellar" },
      {
        name: "description",
        content:
          "Clear, transparent refund, return and exchange policy for Linora Stellar digital printables, bespoke branding and custom merch in Egypt.",
      },
      { property: "og:title", content: "Refund & Exchange Policy — Linora Stellar" },
      {
        property: "og:description",
        content: "Transparent return guidelines complying with Egyptian e-commerce standards.",
      },
    ],
  }),
  component: RefundPolicy,
});

function RefundPolicy() {
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
        <span>{isAr ? "سياسات لينورا ستيلر" : "Customer Care & Guarantees"}</span>
      </div>

      <h1 className="mt-3 font-display text-4xl sm:text-5xl">
        {isAr ? "سياسة الاستبدال والاسترجاع" : "Refund & Exchange Policy"}
      </h1>

      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        {isAr
          ? "في لينورا ستيلر، نحرص على تقديم تصميمات فلكية راقية ومطبوعات فائقة الجودة. توضح هذه السياسة حقوقك وإجراءات الاسترجاع والاستبدال وفقاً لقوانين حماية المستهلك في جمهورية مصر العربية وطبيعة المنتجات الرقمية والمخصصة."
          : "At Linora Stellar, we craft high-touch celestial printables, stationery, and bespoke branding. This policy clearly outlines your consumer rights, refund rules, and exchange procedures in accordance with Egyptian Consumer Protection Agency standards."}
      </p>

      <div className="mt-10 space-y-8">
        {/* Digital Products */}
        <div className="rounded-xl border border-border p-6 card-star">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold/15 text-gold font-bold">
              1
            </span>
            <h2 className="font-display text-2xl">
              {isAr ? "المنتجات الرقمية والتنزيلات الفورية" : "Digital Downloads & Printables"}
            </h2>
          </div>
          <div className="mt-4 space-y-2 text-sm leading-relaxed text-muted-foreground">
            <p>
              {isAr
                ? "نظراً لطبيعة الملفات الرقمية (المخططات الفلكية، القوالب، حزم الأنشطة، قوالب كانفا) التي يتم تسليمها وتحميلها فورياً، فإن المبيعات الرقمية نهائية وغير قابلة للاسترجاع بمجرد إتاحة رابط التحميل."
                : "Due to the non-tangible, irrevocable nature of digital downloads (PDF planners, party kits, Canva templates, activity packs), all digital sales are final once access is granted."}
            </p>
            <p className="text-foreground/90 font-medium">
              {isAr
                ? "💡 في حال واجهتِ أي صعوبة تقنية في تحميل الملفات أو فتحها، تواصلي معنا وسنرسل لكِ نسخة بديلة فوراً عبر واتساب أو البريد الإلكتروني."
                : "💡 If you experience any technical difficulties opening or downloading your files, message us immediately and we will re-send your files directly via WhatsApp or email."}
            </p>
          </div>
        </div>

        {/* Custom and Personalized Products */}
        <div className="rounded-xl border border-border p-6 card-star">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold/15 text-gold font-bold">
              2
            </span>
            <h2 className="font-display text-2xl">
              {isAr
                ? "المنتجات المخصصة والطلبات الخاصة (الأسماء والتصميمات المخصصة)"
                : "Personalized & Custom Orders"}
            </h2>
          </div>
          <div className="mt-4 space-y-2 text-sm leading-relaxed text-muted-foreground">
            <p>
              {isAr
                ? "القطع التي تمت طباعتها أو تخصيصها باسم العميل أو تاريخ محدد (مثل التيشيرتات المطبوعة بالاسم، دعوات الزفاف الشخصية، وباقات الهوية البصرية) تُنفذ خصيصاً لكِ، ولذلك لا يمكن استرجاعها بعد بدء مرحلة الطباعة والتجهيز إلا في حالة وجود خطأ في التنفيذ مقارنة بالبيانات المعتمدة من العميل."
                : "Items personalized with customer names, custom dates, or custom branding suites cannot be refunded once production begins, as they are crafted specifically for you."}
            </p>
            <p>
              {isAr
                ? "قبل الطباعة، نرسل بروفة معاينة للعميل لاعتماد الاسم والتهجئة لتجنب أي أخطاء مطبعية."
                : "We send a digital proof before printing to guarantee name spellings and details meet your exact specifications."}
            </p>
          </div>
        </div>

        {/* Physical Products */}
        <div className="rounded-xl border border-border p-6 card-star">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold/15 text-gold font-bold">
              3
            </span>
            <h2 className="font-display text-2xl">
              {isAr
                ? "المنتجات المادية غير المخصصة (أدوات مكتبية، مجات جاهزة)"
                : "Physical Non-Personalized Goods"}
            </h2>
          </div>
          <div className="mt-4 space-y-2 text-sm leading-relaxed text-muted-foreground">
            <p>
              {isAr
                ? "يحق للعميل استبدال أو استرجاع المنتجات المادية غير المخصصة خلال 14 يوماً من تاريخ الاستلام بشرط أن تكون بحالتها الأصلية غير المستخدمة مع غلافها الكامل."
                : "Non-personalized physical merchandise may be returned or exchanged within 14 days of delivery, provided items are unused, in original condition, and in complete packaging."}
            </p>
            <p>
              {isAr
                ? "في حالة وجود عيب مصنعي أو تلف ناتج عن الشحن، تتحمل لينورا ستيلر كامل تكاليف الشحن وتوفير قطعة بديلة مجانية فوراً."
                : "In the rare event of a printing defect or shipping damage, Linora Stellar covers 100% of return shipping and dispatches a complimentary replacement immediately."}
            </p>
          </div>
        </div>

        {/* How to Initiate */}
        <div className="rounded-xl border border-gold/40 bg-gold/5 p-6">
          <h2 className="font-display text-xl text-gold flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            {isAr ? "كيفية طلب الاستبدال أو الاسترجاع" : "How to Request an Exchange or Return"}
          </h2>
          <div className="mt-3 space-y-2 text-sm text-foreground/90">
            <p>
              {isAr
                ? "يرجى مراسلتنا مباشرة عبر واتساب مع إرفاق رقم الطلب وصورة واضحة للمنتج المطلوب استبداله:"
                : "Message our customer care team on WhatsApp with your order number and photos of the item:"}
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <a
                href={`${CONTACT.whatsappLink}?text=${encodeURIComponent("Hi Nora! I would like to inquire about an exchange/return for my order.")}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs uppercase tracking-wider text-primary-foreground font-medium hover:opacity-90 transition-opacity"
              >
                <MessageCircle className="h-4 w-4" />
                <span>WhatsApp: {CONTACT.whatsapp}</span>
              </a>
              <a
                href={`mailto:${CONTACT.email}?subject=Return/Exchange Inquiry`}
                className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-xs uppercase tracking-wider text-foreground hover:border-gold transition-colors"
              >
                <span>{CONTACT.email}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
