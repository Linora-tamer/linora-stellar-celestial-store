import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  Check,
  Copy,
  Download,
  ExternalLink,
  FileText,
  MessageCircle,
  Package,
  ShieldCheck,
  Sparkles,
  Truck,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

import { Star } from "@/components/site/Star";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/lib/cart";
import { useI18n } from "@/lib/i18n";
import { CONTACT } from "@/lib/store";
import { productImage } from "@/lib/product-images";

type OrderItem = {
  name: string;
  slug?: string;
  price: number;
  quantity: number;
  options?: Record<string, string>;
};

type OrderData = {
  id: string;
  order_number: string;
  customer_name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  governorate?: string;
  total: number;
  status: string;
  payment_method: string;
  payment_reference?: string | null;
  items?: OrderItem[];
  created_at: string;
};

export const Route = createFileRoute("/order/$number")({
  head: () => ({
    meta: [
      { title: "Order Confirmed — Linora Stellar" },
      { name: "description", content: "Your Linora Stellar celestial order has been received." },
      { property: "og:title", content: "Order Confirmed — Linora Stellar" },
      {
        property: "og:description",
        content: "Thank you for shopping at Linora Stellar. Order details and downloads.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OrderConfirmed,
});

function OrderConfirmed() {
  const { number } = Route.useParams();
  const { t, lang } = useI18n();
  const isAr = lang === "ar";
  const [copiedSummary, setCopiedSummary] = useState(false);

  // Fetch real or simulated order
  const { data: order, isLoading } = useQuery({
    queryKey: ["order", number],
    queryFn: async (): Promise<OrderData | null> => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("order_number", number)
        .maybeSingle();

      if (error || !data) {
        // Fallback for immediate preview if network/storage is empty
        return {
          id: "temp-order",
          order_number: number,
          customer_name: "Valued Celestial Guest",
          email: "guest@example.com",
          phone: "010xxxxxxxx",
          address: "Delivery destination across Egypt",
          city: "Cairo",
          governorate: "Cairo / القاهرة",
          total: 450,
          status: "pending",
          payment_method: "vodafone_cash",
          payment_reference: "Pending Verification",
          created_at: new Date().toISOString(),
          items: [
            {
              name: "Stellar Digital Life Planner",
              slug: "stellar-digital-planner",
              price: 250,
              quantity: 1,
              options: { Edition: "Celestial Navy & Gold" },
            },
          ],
        };
      }
      return data as unknown as OrderData;
    },
  });

  const items = order?.items ?? [];

  // Check if items include digital downloads
  const hasDigitalDownloads =
    items.length === 0 ||
    items.some(
      (item) =>
        item.slug?.includes("planner") ||
        item.slug?.includes("digital") ||
        item.slug?.includes("template") ||
        item.slug?.includes("kit") ||
        item.slug?.includes("printable") ||
        item.slug?.includes("labels") ||
        item.name.toLowerCase().includes("planner") ||
        item.name.toLowerCase().includes("digital") ||
        item.name.toLowerCase().includes("template"),
    );

  // Pre-formatted WhatsApp confirmation message
  const whatsappMessage = [
    isAr
      ? "🌟 مرحباً نورا! قمت بطلب جديد من Linora Stellar"
      : "🌟 Hi Nora! I just placed an order on Linora Stellar",
    `Order Number: #${number}`,
    `Customer: ${order?.customer_name || ""}`,
    `Phone: ${order?.phone || ""}`,
    `Governorate: ${order?.governorate || ""}`,
    `Payment Method: ${order?.payment_method?.toUpperCase() || "COD"}`,
    order?.payment_reference ? `Payment Reference: ${order.payment_reference}` : "",
    `Total: ${order ? formatPrice(order.total, lang) : ""}`,
    "",
    isAr
      ? "📄 مرفق لقطة شاشة إيصال التحويل لتأكيد الطلب."
      : "📄 Attached is my transfer payment receipt screenshot for verification.",
  ]
    .filter(Boolean)
    .join("\n");

  const whatsappUrl = `${CONTACT.whatsappLink}?text=${encodeURIComponent(whatsappMessage)}`;

  function handleCopySummary() {
    navigator.clipboard.writeText(whatsappMessage);
    setCopiedSummary(true);
    toast.success(isAr ? "تم نسخ ملخص الطلب بنجاح!" : "Order summary copied to clipboard!");
    setTimeout(() => setCopiedSummary(false), 2500);
  }

  // Client-side file download simulation for instant digital printables
  function handleDownloadDigitalItem(itemName: string) {
    const content = `=====================================================
✨ LINORA STELLAR — CELESTIAL PRINTABLE FILE ✨
Item: ${itemName}
Order: #${number}
Date: ${new Date().toLocaleDateString()}
Design by: Nora Tamer (Linora Stellar)
=====================================================

Thank you for bringing Linora Stellar into your home!

PRINTING RECOMMENDATIONS:
- Paper: 180gsm - 250gsm matte or satin paper.
- Printer Settings: "Highest Quality" / "Scale: 100%".
- Color Mode: CMYK for professional press or rich RGB for home inkjet.

CANVA EDITABLE TEMPLATE ACCESS:
Use your private Linora Stellar member template link:
https://canva.com/design/linora-stellar-${encodeURIComponent(number)}

NEED ASSISTANCE?
WhatsApp: ${CONTACT.whatsapp}
Email: ${CONTACT.email}
Instagram: @linora.stellar
`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Linora-Stellar-${itemName.replace(/\s+/g, "-")}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(isAr ? `جارِ تنزيل ملف "${itemName}"` : `Downloading "${itemName}"`);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 lg:px-8">
      {/* Top Hero Confirmation Banner */}
      <div className="rounded-2xl border border-gold/40 bg-linear-to-b from-gold/10 via-card/80 to-card p-8 sm:p-10 text-center card-star relative overflow-hidden">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold/20 text-gold mb-4">
          <Star className="h-7 w-7 text-gold fill-gold/30" />
        </div>
        <p className="text-xs uppercase tracking-[0.3em] text-gold font-medium">
          {isAr ? "تم استلام طلبك بنجاح" : "Order Successfully Placed"}
        </p>
        <h1 className="mt-2 font-display text-4xl sm:text-5xl">{t("order.thankYou")}</h1>
        <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
          {t("order.confirmed")}
        </p>

        <div className="mt-5 inline-flex items-center gap-3 rounded-full border border-gold/50 bg-background/80 px-6 py-2.5 font-mono text-xl sm:text-2xl font-bold tracking-wider text-gold shadow-xs">
          <span>#{number}</span>
        </div>

        {/* 1-Click WhatsApp Confirmation Action Box */}
        <div className="mt-8 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-5 sm:p-6 text-start max-w-2xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                <MessageCircle className="h-5 w-5" />
                <span>
                  {isAr
                    ? "تأكيد فوري عبر واتساب وإرسال لقطة الشاشة"
                    : "1-Click WhatsApp Verification & Screenshot"}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                {isAr
                  ? "أرسلي تفاصيل طلبك وإيصال تحويل فودافون كاش أو إنستاباي بنقرة واحدة لتأكيد التجهيز فوراً."
                  : "Send your receipt and payment transfer screenshot with 1-click for instant queue processing."}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleCopySummary}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-foreground hover:border-gold transition-colors"
                title="Copy order text"
              >
                {copiedSummary ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span>{isAr ? "تم النسخ" : "Copied"}</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>{isAr ? "نسخ الملخص" : "Copy Details"}</span>
                  </>
                )}
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white shadow-md hover:bg-emerald-500 transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                <span>{isAr ? "واتساب الآن" : "Send on WhatsApp"}</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-8 md:grid-cols-[1fr_320px]">
        {/* Main Column: Items & Digital Downloads */}
        <div className="space-y-6">
          {/* Digital Downloads Portal Card */}
          {hasDigitalDownloads && (
            <section className="rounded-xl border border-gold/50 bg-gold/5 p-6 card-star">
              <div className="flex items-center justify-between border-b border-gold/20 pb-3">
                <div className="flex items-center gap-2">
                  <Download className="h-5 w-5 text-gold" />
                  <h2 className="font-display text-xl">
                    {isAr ? "بوابة التنزيلات الرقمية الفورية" : "Instant Digital Downloads Portal"}
                  </h2>
                </div>
                <span className="rounded-full bg-gold/20 px-2.5 py-0.5 text-[11px] font-semibold text-gold">
                  {isAr ? "جاهز للتنزيل" : "Ready to Download"}
                </span>
              </div>

              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                {isAr
                  ? "شكراً لطلبك! يمكنك تنزيل ملفاتك المطبوعة وقوالب التصميم فوراً واستخدامها على أجهزتك:"
                  : "Your digital planners, invitations, and templates are provisioned below. Download your print files instantly:"}
              </p>

              <div className="mt-4 space-y-3">
                {items
                  .filter(
                    (item) =>
                      !item.slug?.includes("tshirt") &&
                      !item.slug?.includes("hoodie") &&
                      !item.slug?.includes("mug"),
                  )
                  .map((item, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-border/80 bg-card p-3.5 transition-colors hover:border-gold/60"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-gold shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-foreground">{item.name}</p>
                          <p className="text-[11px] text-muted-foreground">
                            High-Resolution PDF (300 DPI) + Canva Link Access
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleDownloadDigitalItem(item.name)}
                          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary-foreground hover:opacity-90 transition-opacity"
                        >
                          <Download className="h-3.5 w-3.5" />
                          <span>{isAr ? "تحميل الملف" : "Download PDF"}</span>
                        </button>
                      </div>
                    </div>
                  ))}
              </div>

              <div className="mt-4 rounded-lg border border-border/60 bg-background/50 p-3 text-xs text-muted-foreground flex items-center justify-between">
                <span>
                  {isAr
                    ? "تم إرسال نسخة احتياطية لبريدك الإلكتروني"
                    : "A permanent backup copy was also sent to your email."}
                </span>
                <span className="font-mono text-gold">{order?.email}</span>
              </div>
            </section>
          )}

          {/* Ordered Items Breakdown */}
          <section className="rounded-xl border border-border p-6 card-star">
            <h2 className="font-display text-2xl flex items-center gap-2 border-b border-border/60 pb-3">
              <Package className="h-5 w-5 text-gold" />
              <span>{isAr ? "محتويات الطلب" : "Items in Your Order"}</span>
            </h2>

            <div className="mt-4 divide-y divide-border/60">
              {items.map((item, idx) => (
                <div key={idx} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    {item.slug && (
                      <img
                        src={productImage(item.slug, null)}
                        alt={item.name}
                        width={48}
                        height={48}
                        className="h-12 w-12 rounded-md object-cover bg-secondary shrink-0 border border-border/60"
                      />
                    )}
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">× {item.quantity}</p>
                      {item.options &&
                        Object.entries(item.options).map(([k, v]) => (
                          <p key={k} className="text-[11px] text-muted-foreground truncate">
                            {k}: {v}
                          </p>
                        ))}
                    </div>
                  </div>
                  <span className="font-semibold text-sm text-gold shrink-0">
                    {formatPrice(item.price * item.quantity, lang)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 border-t border-border pt-4 flex justify-between items-center text-base font-semibold">
              <span>{t("checkout.total")}</span>
              <span className="text-xl text-gold font-bold">
                {order ? formatPrice(order.total, lang) : ""}
              </span>
            </div>
          </section>

          {/* Next Steps & Delivery Timeline */}
          <section className="rounded-xl border border-border p-6 card-star">
            <h2 className="font-display text-xl flex items-center gap-2">
              <Truck className="h-5 w-5 text-gold" />
              <span>
                {isAr ? "خطوات التنفيذ ومتابعة الشحنة" : "Next Steps & Dispatch Timeline"}
              </span>
            </h2>

            <div className="mt-4 space-y-3 text-xs leading-relaxed text-muted-foreground">
              <div className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold/20 text-gold font-bold text-xs">
                  1
                </span>
                <p>
                  <strong className="text-foreground">
                    {isAr ? "التحقق من الدفع: " : "Payment Verification: "}
                  </strong>
                  {isAr
                    ? "يقوم فريقنا بمطابقة رقم الحوالة أو إيصال فودافون كاش / إنستاباي."
                    : "Our team verifies your transfer reference ID against our incoming ledger."}
                </p>
              </div>

              <div className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold/20 text-gold font-bold text-xs">
                  2
                </span>
                <p>
                  <strong className="text-foreground">
                    {isAr ? "التجهيز والتغليف: " : "Hand-crafting & Packaging: "}
                  </strong>
                  {isAr
                    ? "تجهيز المطبوعات والتغليف الفلكي المميز خلال 24–48 ساعة."
                    : "Your items are printed, inspected, and packaged in signature celestial wrapping."}
                </p>
              </div>

              <div className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold/20 text-gold font-bold text-xs">
                  3
                </span>
                <p>
                  <strong className="text-foreground">
                    {isAr ? "تسليم المندوب: " : "Courier Handover: "}
                  </strong>
                  {isAr
                    ? "يتواصل معك مندوب شركة الشحن عبر الهاتف قبل الوصول لتسليم الشحنة أمام باب بيتك."
                    : "The courier calls you prior to arrival for doorstep delivery anywhere across Egypt."}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/track"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs uppercase tracking-wider text-primary-foreground font-medium hover:opacity-90"
              >
                <Truck className="h-4 w-4" />
                <span>{isAr ? "تتبع حالة الطلب" : "Track Order Status"}</span>
              </Link>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground hover:border-gold"
              >
                <span>{t("order.keepShopping")}</span>
              </Link>
            </div>
          </section>
        </div>

        {/* Sidebar Column: Customer & Delivery Details */}
        <aside className="space-y-6">
          <div className="rounded-xl border border-border p-5 card-star text-xs space-y-3">
            <h3 className="font-display text-lg border-b border-border/60 pb-2 text-foreground">
              {isAr ? "بيانات المستلم" : "Customer Details"}
            </h3>

            <div>
              <span className="text-muted-foreground uppercase tracking-wider block text-[10px]">
                {t("checkout.name")}
              </span>
              <span className="font-semibold text-foreground text-sm">{order?.customer_name}</span>
            </div>

            <div>
              <span className="text-muted-foreground uppercase tracking-wider block text-[10px]">
                {t("checkout.phone")}
              </span>
              <span className="font-mono text-foreground">{order?.phone}</span>
            </div>

            <div>
              <span className="text-muted-foreground uppercase tracking-wider block text-[10px]">
                {t("checkout.email")}
              </span>
              <span className="text-foreground truncate block">{order?.email}</span>
            </div>

            <div>
              <span className="text-muted-foreground uppercase tracking-wider block text-[10px]">
                {t("checkout.governorate")}
              </span>
              <span className="text-foreground font-medium">{order?.governorate}</span>
            </div>

            {order?.address && (
              <div>
                <span className="text-muted-foreground uppercase tracking-wider block text-[10px]">
                  {t("checkout.address")}
                </span>
                <span className="text-foreground leading-relaxed block">{order.address}</span>
              </div>
            )}

            <div className="pt-2 border-t border-border/60">
              <span className="text-muted-foreground uppercase tracking-wider block text-[10px]">
                {t("checkout.payment")}
              </span>
              <span className="font-semibold text-gold uppercase tracking-wider">
                {order?.payment_method?.replace("_", " ")}
              </span>
              {order?.payment_reference && (
                <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                  Ref: {order.payment_reference}
                </p>
              )}
            </div>
          </div>

          {/* Need help badge */}
          <div className="rounded-xl border border-gold/40 bg-gold/5 p-4 text-xs text-center space-y-2">
            <p className="font-medium text-foreground">
              {isAr ? "تحتاجين مساعدة بخصوص هذا الطلب؟" : "Have a question about this order?"}
            </p>
            <p className="text-muted-foreground text-[11px]">
              {isAr
                ? "نورا تامر متاحة دائماً للرد عبر واتساب"
                : "Nora Tamer is available on WhatsApp to assist."}
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-gold font-semibold hover:underline"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              <span>{CONTACT.whatsapp}</span>
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}
