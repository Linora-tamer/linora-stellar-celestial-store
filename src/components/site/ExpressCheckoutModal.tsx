import { useState } from "react";
import {
  X,
  Zap,
  ShoppingBag,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  Phone,
  MessageCircle,
} from "lucide-react";
import { toast } from "sonner";
import { formatPrice } from "@/lib/cart";
import { useI18n } from "@/lib/i18n";
import {
  EGYPT_GOVERNORATES,
  calculateEgyptShipping,
  requiresPhysicalShipping,
} from "@/lib/egypt-shipping";
import { orderErrorMessage, submitOrder } from "@/lib/place-order";
import { CONTACT, type Product } from "@/lib/store";
import { productImage } from "@/lib/product-images";

interface ExpressCheckoutModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  selectedColor?: string;
  selectedSize?: string;
  personalName?: string;
}

type ExpressCompletedOrder = {
  id: string;
  order_number: string;
  customer_name: string;
  phone: string;
  total: number;
  [key: string]: unknown;
};

export function ExpressCheckoutModal({
  product,
  isOpen,
  onClose,
  selectedColor,
  selectedSize,
  personalName,
}: ExpressCheckoutModalProps) {
  const { lang, pick } = useI18n();
  const isAr = lang === "ar";

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [governorate, setGovernorate] = useState(EGYPT_GOVERNORATES[0]!.id);
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("vodafone_cash");
  const [submitting, setSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<ExpressCompletedOrder | null>(null);

  if (!isOpen || !product) return null;

  // Same rule the server uses to decide whether shipping applies.
  const isDigital = !requiresPhysicalShipping([product]);

  const price = Number(product.price);
  const shippingFee = isDigital ? 0 : calculateEgyptShipping(governorate, [product]).fee;
  const total = price + shippingFee;

  async function handleExpressSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!product || !name.trim() || !phone.trim() || (!isDigital && !address.trim())) {
      toast.error(
        isAr
          ? "يرجى استكمال البيانات الأساسية للتوصيل"
          : "Please complete required contact details",
      );
      return;
    }

    setSubmitting(true);
    const govObj = EGYPT_GOVERNORATES.find((g) => g.id === governorate);

    const result = await submitOrder({
      customer: {
        name: name.trim(),
        // Express checkout doesn't collect an email, so the server skips the customer email.
        email: `${phone.replace(/\D/g, "")}@customer.linorastellar.com`,
        phone: phone.trim(),
        address: isDigital ? "Digital Instant Download" : address.trim(),
        city: isDigital
          ? "Instant Download"
          : govObj
            ? isAr
              ? govObj.nameAr
              : govObj.nameEn
            : "Egypt",
        governorate: isDigital ? EGYPT_GOVERNORATES[0]!.id : governorate,
        notes: "Express 5-Second One-Page Checkout",
      },
      paymentMethod,
      paymentReference: `EXPRESS-${Date.now().toString().slice(-4)}`,
      items: [
        {
          slug: product.slug,
          name: pick(product, "name"),
          price,
          quantity: 1,
          options: {
            ...(selectedColor ? { Color: selectedColor } : {}),
            ...(selectedSize ? { Size: selectedSize } : {}),
            ...(personalName ? { PersonalizedName: personalName } : {}),
          },
        },
      ],
    });

    setSubmitting(false);

    // Previously a failed save still showed "Order placed!". Now the customer is told the truth.
    if (!result.ok) {
      toast.error(orderErrorMessage(result.code, isAr));
      return;
    }
    if (result.paymentUrl) {
      window.location.href = result.paymentUrl;
      return;
    }

    setCompletedOrder({
      id: result.orderNumber,
      order_number: result.orderNumber,
      customer_name: name.trim(),
      phone: phone.trim(),
      total,
    });

    toast.success(
      isAr
        ? `تم تأكيد طلبك السريع بنجاح! رقم الطلب #${result.orderNumber}`
        : `Express order placed! Order #${result.orderNumber}`,
    );
  }

  const displayName = pick(product, "name");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg rounded-2xl border border-accent/40 bg-surface p-5 sm:p-6 shadow-2xl card-star max-h-[92vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute end-4 top-4 rounded-full p-1.5 text-text-secondary hover:bg-surface-elevated hover:text-text-primary transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {completedOrder ? (
          <div className="text-center py-6 space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
              <CheckCircle2 className="h-9 w-9" />
            </div>

            <h3 className="font-display text-2xl text-text-primary">
              {isAr ? "تم تسجيل طلبكِ السريع بنجاح! ✦" : "Express Order Confirmed! ✦"}
            </h3>

            <p className="text-xs text-text-secondary max-w-sm mx-auto">
              {isAr
                ? `رقم الطلب: #${completedOrder.order_number} • جاري تحضير طلبكِ وسيتم التواصل معكِ فورياً لتأكيد الشحن.`
                : `Order #${completedOrder.order_number} has been logged. Nora Tamer will confirm dispatch via WhatsApp.`}
            </p>

            <div className="rounded-xl border border-border bg-surface-elevated p-4 text-xs text-start space-y-2">
              <div className="flex justify-between font-semibold text-text-primary">
                <span>{displayName}</span>
                <span className="text-accent">{formatPrice(total, lang)}</span>
              </div>
              <p className="text-text-secondary">
                {isAr ? "العميل:" : "Customer:"} {completedOrder.customer_name} (
                {completedOrder.phone})
              </p>
              <p className="text-text-secondary">
                {isAr ? "الدفع:" : "Payment:"}{" "}
                {paymentMethod === "vodafone_cash"
                  ? "Vodafone Cash"
                  : paymentMethod === "instapay"
                    ? "InstaPay"
                    : "Cash on Delivery"}
              </p>
            </div>

            {/* 1-Click WhatsApp Confirmation */}
            <a
              href={`${CONTACT.whatsappLink}?text=${encodeURIComponent(
                `Hi Nora! I just placed an Express Order #${completedOrder.order_number} for ${displayName} (${formatPrice(total, "en")}). My phone: ${completedOrder.phone}`,
              )}`}
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-emerald-500 transition-colors shadow-md"
            >
              <MessageCircle className="h-4 w-4" />
              <span>{isAr ? "إرسال الإشعار لواتساب نورا" : "Send Receipt to WhatsApp"}</span>
            </a>

            <button
              type="button"
              onClick={onClose}
              className="text-xs text-text-secondary hover:text-accent underline"
            >
              {isAr ? "إغلاق النافذة والعودة للتصفح" : "Close and continue shopping"}
            </button>
          </div>
        ) : (
          <form onSubmit={handleExpressSubmit} className="space-y-4">
            {/* Header */}
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-accent/20 px-3 py-1 text-[11px] font-semibold text-accent mb-2">
                <Zap className="h-3.5 w-3.5 fill-accent" />
                <span>
                  {isAr ? "طلب فوري بضغطة واحدة (أقل من 5 ثوانٍ)" : "Express 5-Second Buy Now"}
                </span>
              </div>
              <h3 className="font-display text-2xl text-text-primary">{displayName}</h3>
            </div>

            {/* Product summary strip */}
            <div className="flex items-center gap-3 rounded-xl border border-border/70 bg-surface-elevated p-3">
              <img
                src={productImage(product.slug, product.image_url)}
                alt={displayName}
                className="h-14 w-14 rounded-lg object-cover border border-border/50 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-text-primary truncate">{displayName}</p>
                <div className="flex items-center gap-2 mt-0.5 text-[11px] text-text-secondary">
                  {selectedColor && <span>{selectedColor}</span>}
                  {selectedSize && <span>• {selectedSize}</span>}
                  {personalName && <span>• "{personalName}"</span>}
                </div>
              </div>
              <div className="text-end">
                <p className="text-sm font-bold text-accent">{formatPrice(price, lang)}</p>
                <p className="text-[10px] text-text-secondary">
                  {shippingFee === 0
                    ? isAr
                      ? "شحن مجاني"
                      : "Free Delivery"
                    : `+${shippingFee} EGP`}
                </p>
              </div>
            </div>

            {/* Input Form: Name & Phone */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-[11px] uppercase tracking-wider text-text-secondary block mb-1 font-medium">
                  {isAr ? "الاسم بالكامل *" : "Full Name *"}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={isAr ? "مريم أحمد" : "Your full name"}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider text-text-secondary block mb-1 font-medium">
                  {isAr ? "رقم الهاتف / واتساب *" : "Phone / WhatsApp *"}
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="010XXXXXXXX"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs outline-none focus:border-accent"
                />
              </div>
            </div>

            {/* Address fields (if physical product) */}
            {!isDigital && (
              <div className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-text-secondary block mb-1 font-medium">
                      {isAr ? "المحافظة *" : "Governorate *"}
                    </label>
                    <select
                      value={governorate}
                      onChange={(e) => setGovernorate(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs outline-none focus:border-accent cursor-pointer"
                    >
                      {EGYPT_GOVERNORATES.map((g) => (
                        <option key={g.id} value={g.id}>
                          {isAr ? g.nameAr : g.nameEn} ({g.fee} EGP)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-text-secondary block mb-1 font-medium">
                      {isAr ? "العنوان بالتفصيل *" : "Delivery Address *"}
                    </label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder={isAr ? "الشارع، رقم العمارة، الشقة" : "Street, Bldg, Apt"}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs outline-none focus:border-accent"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Payment Method Selector */}
            <div>
              <label className="text-[11px] uppercase tracking-wider text-text-secondary block mb-1.5 font-medium">
                {isAr ? "طريقة الدفع" : "Payment Method"}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "vodafone_cash", label: "Vodafone Cash", sub: "01040277935" },
                  { id: "instapay", label: "InstaPay", sub: "Instant EGP" },
                  { id: "cod", label: isAr ? "عند الاستلام" : "Cash on Delivery", sub: "Doorstep" },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id)}
                    className={`rounded-lg border p-2 text-center text-xs transition-colors ${
                      paymentMethod === m.id
                        ? "border-accent bg-accent/15 text-accent font-semibold"
                        : "border-border text-text-secondary hover:border-accent"
                    }`}
                  >
                    <p className="font-semibold truncate">{m.label}</p>
                    <p className="text-[10px] opacity-75">{m.sub}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Total Strip */}
            <div className="border-t border-border/70 pt-3 flex items-center justify-between text-xs">
              <span className="text-text-secondary">
                {isAr ? "الإجمالي النهائي الشامل:" : "Final Total including delivery:"}
              </span>
              <span className="text-base font-bold text-accent">{formatPrice(total, lang)}</span>
            </div>

            {/* Express Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-background hover:opacity-90 disabled:opacity-60 transition-opacity shadow-lg"
            >
              <Zap className="h-4 w-4 fill-background" />
              <span>
                {submitting
                  ? isAr
                    ? "جارٍ تأكيد طلبكِ..."
                    : "Placing Order…"
                  : isAr
                    ? `تأكيد الشراء الفوري (${formatPrice(total, lang)})`
                    : `Confirm Express Order (${formatPrice(total, lang)})`}
              </span>
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-text-secondary">
              <Lock className="h-3 w-3" />
              <span>
                {isAr
                  ? "شراء سريع وآمن 100% بدون أي خطوات إضافية"
                  : "Fast & 100% secure direct order"}
              </span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
