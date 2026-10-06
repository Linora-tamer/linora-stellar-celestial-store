import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Copy, Check, ShieldCheck, Truck, Sparkles, MessageCircle } from "lucide-react";
import { toast } from "sonner";

import { ShippingZonesCard } from "@/components/site/ShippingZonesCard";
import { useAuth } from "@/lib/auth";
import { formatPrice, useCart } from "@/lib/cart";
import {
  EGYPTIAN_GOVERNORATES,
  getGovernorate,
  requiresPhysicalShipping,
} from "@/lib/egypt-shipping";
import { useI18n } from "@/lib/i18n";
import { orderErrorMessage, submitOrder } from "@/lib/place-order";
import { CONTACT, paymentMethodsQuery } from "@/lib/store";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Linora Stellar" },
      {
        name: "description",
        content:
          "Complete your Linora Stellar order with Vodafone Cash, InstaPay or cash on delivery.",
      },
      { property: "og:title", content: "Checkout — Linora Stellar" },
      { property: "og:description", content: "Delivery details and payment for your order." },
    ],
  }),
  component: Checkout,
});

const field =
  "mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-gold";
const labelCls = "text-xs uppercase tracking-[0.16em] text-muted-foreground";

const LOCAL_STORAGE_PROFILE_KEY = "linora_customer_profile";
const LOCAL_STORAGE_ADDRESS_KEY = "linora_customer_address";

function Checkout() {
  const { items, total, finalTotal, discountAmount, coupon, clear } = useCart();
  const { user } = useAuth();
  const { t, pick, lang } = useI18n();
  const isAr = lang === "ar";
  const navigate = useNavigate();

  const { data: methods = [] } = useQuery(paymentMethodsQuery);
  const active = methods.filter((m) => m.is_active);

  // Load saved customer details from localStorage or user
  const [name, setName] = useState("");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState("");
  const [altPhone, setAltPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [selectedGovId, setSelectedGovId] = useState("cairo");
  const [postalCode, setPostalCode] = useState("");
  const [notes, setNotes] = useState("");

  const [method, setMethod] = useState<string>("vodafone_cash");
  const [paymentReference, setPaymentReference] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  // Auto-fill from saved profile
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedProf = localStorage.getItem(LOCAL_STORAGE_PROFILE_KEY);
        if (savedProf) {
          const parsed = JSON.parse(savedProf);
          if (parsed.full_name) setName(parsed.full_name);
          if (parsed.email && !email) setEmail(parsed.email);
          if (parsed.phone) setPhone(parsed.phone);
        }
        const savedAddr = localStorage.getItem(LOCAL_STORAGE_ADDRESS_KEY);
        if (savedAddr) {
          const parsed = JSON.parse(savedAddr);
          if (parsed.full_name && !name) setName(parsed.full_name);
          if (parsed.phone && !phone) setPhone(parsed.phone);
          if (parsed.alt_phone) setAltPhone(parsed.alt_phone);
          if (parsed.address) setAddress(parsed.address);
          if (parsed.city) setCity(parsed.city);
          if (parsed.governorate) setSelectedGovId(parsed.governorate);
          if (parsed.postal_code) setPostalCode(parsed.postal_code);
        }
      } catch {
        // Fallback to defaults
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isPhysical = requiresPhysicalShipping(items);
  const selectedGov = getGovernorate(selectedGovId);
  const shippingFee = isPhysical ? (selectedGov ? selectedGov.fee : 0) : 0;
  const grandTotal = finalTotal + shippingFee;

  const chosen = active.find((m) => m.code === method) ?? active[0];
  const selectedCode = method || chosen?.code || "vodafone_cash";

  function copyToClipboard(text: string) {
    const cleanNumber = text.split(" ")[0] ?? text;
    navigator.clipboard.writeText(cleanNumber);
    setCopiedAccount(text);
    toast.success(t("checkout.copied"));
    setTimeout(() => setCopiedAccount(null), 2500);
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (items.length === 0) {
      toast.error(t("checkout.emptyTitle"));
      return;
    }

    const refValue = paymentReference.trim();
    if ((selectedCode === "vodafone_cash" || selectedCode === "instapay") && !refValue) {
      toast.error(t("checkout.refRequired"));
      document.getElementById("payment_reference")?.focus();
      return;
    }

    if (isPhysical && !selectedGovId) {
      toast.error(
        isAr
          ? "يرجى اختيار المحافظة لحساب تكلفة الشحن."
          : "Please select your governorate for shipping calculation.",
      );
      document.getElementById("governorate")?.focus();
      return;
    }

    setSubmitting(true);

    // Save profile locally for future checkouts
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(
          LOCAL_STORAGE_PROFILE_KEY,
          JSON.stringify({ full_name: name, email, phone }),
        );
        localStorage.setItem(
          LOCAL_STORAGE_ADDRESS_KEY,
          JSON.stringify({
            full_name: name,
            phone,
            alt_phone: altPhone,
            address,
            city,
            governorate: selectedGovId,
            postal_code: postalCode,
          }),
        );
      } catch {
        // Ignore storage errors
      }
    }

    const result = await submitOrder({
      customer: {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        altPhone: altPhone.trim() || undefined,
        address: address.trim() || (isPhysical ? "" : "Digital Instant Download"),
        city: city.trim() || (isPhysical ? "" : "Instant Download"),
        governorate: selectedGovId || "cairo",
        postalCode: postalCode.trim() || undefined,
        notes: notes.trim() || undefined,
      },
      paymentMethod: selectedCode,
      paymentReference: refValue || undefined,
      couponCode: coupon?.code,
      items: items.map((i) => ({
        name: i.name,
        slug: i.slug,
        price: i.price,
        quantity: i.quantity,
        options: i.options ?? {},
      })),
    });

    setSubmitting(false);

    if (!result.ok) {
      toast.error(orderErrorMessage(result.code, isAr));
      return;
    }

    // Card: the cart is kept until the payment is confirmed (the order page clears it),
    // so a customer who abandons the payment page doesn't lose their basket.
    if (result.paymentUrl) {
      window.location.href = result.paymentUrl;
      return;
    }

    clear();
    navigate({ to: "/order/$number", params: { number: result.orderNumber } });
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-display text-4xl">{t("checkout.emptyTitle")}</h1>
        <Link to="/shop" className="mt-6 inline-block text-sm text-gold underline">
          {t("cart.browse")}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-5xl">{t("checkout.title")}</h1>
          <p className="mt-2 text-xs text-muted-foreground">
            {isAr
              ? "بيانات التوصيل والدفع في جمهورية مصر العربية."
              : "Delivery details & payment in Egypt."}
          </p>
        </div>

        <Link to="/account" className="text-xs text-gold underline hover:text-foreground">
          {isAr ? "تعديل تفاصيلي المحفوظة في حسابي ←" : "Manage saved details in My Account →"}
        </Link>
      </div>

      <form onSubmit={submit} className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          {/* Shipping Zones Card Helper */}
          <ShippingZonesCard />

          {/* Section 1: Customer Delivery Details */}
          <section className="rounded-xl border border-border p-6 sm:p-8 card-star">
            <h2 className="font-display text-2xl flex items-center gap-2">
              <Truck className="h-5 w-5 text-gold" />
              <span>{t("checkout.delivery")}</span>
            </h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={labelCls} htmlFor="name">
                  {t("checkout.name")} *
                </label>
                <input
                  id="name"
                  name="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={isAr ? "اسم المستلم بالكامل" : "Full name"}
                  className={field}
                />
              </div>

              <div>
                <label className={labelCls} htmlFor="email">
                  {t("checkout.email")} *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nora@example.com"
                  className={field}
                />
              </div>

              <div>
                <label className={labelCls} htmlFor="phone">
                  {t("checkout.phone")} *
                </label>
                <input
                  id="phone"
                  name="phone"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="010xxxxxxxx"
                  className={field}
                />
              </div>

              <div>
                <label className={labelCls} htmlFor="alt_phone">
                  {t("checkout.altPhone")}
                </label>
                <input
                  id="alt_phone"
                  name="alt_phone"
                  value={altPhone}
                  onChange={(e) => setAltPhone(e.target.value)}
                  placeholder="01xxxxxxxxx"
                  className={field}
                />
              </div>

              <div>
                <label className={labelCls} htmlFor="governorate">
                  {t("checkout.governorate")} {isPhysical && "*"}
                </label>
                <select
                  id="governorate"
                  name="governorate"
                  required={isPhysical}
                  value={selectedGovId}
                  onChange={(e) => setSelectedGovId(e.target.value)}
                  className={field}
                >
                  {EGYPTIAN_GOVERNORATES.map((gov) => (
                    <option key={gov.id} value={gov.id}>
                      {isAr
                        ? `${gov.nameAr} (${gov.fee} ج.م • ${gov.estimatedDaysAr})`
                        : `${gov.nameEn} (${gov.fee} EGP • ${gov.estimatedDays})`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelCls} htmlFor="city">
                  {t("checkout.city")} *
                </label>
                <input
                  id="city"
                  name="city"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder={isAr ? "المعادي / مدينة نصر / سموحة" : "City / District"}
                  className={field}
                />
              </div>

              <div className="sm:col-span-2">
                <label className={labelCls} htmlFor="address">
                  {t("checkout.address")} *
                </label>
                <input
                  id="address"
                  name="address"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={
                    isAr
                      ? "رقم العمارة، اسم الشارع، رقم الشقة، علامة مميزة"
                      : "Building #, Street name, Apt #, Landmark"
                  }
                  className={field}
                />
              </div>

              <div>
                <label className={labelCls} htmlFor="postal_code">
                  {t("checkout.postalCode")}
                </label>
                <input
                  id="postal_code"
                  name="postal_code"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className={field}
                />
              </div>

              <div className="sm:col-span-2">
                <label className={labelCls} htmlFor="notes">
                  {t("checkout.notes")}
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={
                    isAr
                      ? "أي تعليمات خاصة للمندوب أو للتوصيل…"
                      : "Any special delivery instructions for the courier…"
                  }
                  className={field}
                />
              </div>
            </div>
          </section>

          {/* Section 2: Egypt Payment Methods */}
          <section className="rounded-xl border border-border p-6 sm:p-8 card-star">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <h2 className="font-display text-2xl flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-gold" />
                <span>{t("checkout.payment")}</span>
              </h2>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 text-gold" />
                {isAr ? "وسائل دفع معتمدة في مصر" : "Egypt Verified Gateways"}
              </span>
            </div>

            <div className="mt-5 space-y-3.5">
              {active.map((m) => {
                const label = pick(m, "label");
                const instructions = pick(m, "instructions");
                const isSelected = selectedCode === m.code;

                return (
                  <label
                    key={m.id}
                    className={`block cursor-pointer rounded-xl border p-4 sm:p-5 transition-all ${
                      isSelected
                        ? "border-gold bg-primary/10 shadow-xs"
                        : "border-border hover:border-gold/50 bg-card/40"
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <input
                        type="radio"
                        name="payment_method"
                        value={m.code}
                        checked={isSelected}
                        onChange={() => setMethod(m.code)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="font-medium text-base text-foreground">{label}</span>
                          {m.code === "vodafone_cash" && (
                            <span className="rounded-full bg-rose-500/20 px-2 py-0.5 text-[11px] font-semibold text-rose-300">
                              Vodafone Cash
                            </span>
                          )}
                          {m.code === "instapay" && (
                            <span className="rounded-full bg-purple-500/20 px-2 py-0.5 text-[11px] font-semibold text-purple-300">
                              InstaPay
                            </span>
                          )}
                        </div>

                        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                          {instructions}
                        </p>

                        {/* Wallet number & 1-click copy */}
                        {m.account_number && (
                          <div className="mt-3 flex items-center justify-between rounded-lg border border-gold/40 bg-card px-3.5 py-2">
                            <div>
                              <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">
                                {isAr ? "رقم المحفظة / الحساب للتحويل:" : "Transfer account:"}
                              </span>
                              <span className="font-mono text-sm font-bold tracking-wide text-gold">
                                {m.account_number}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                copyToClipboard(m.account_number!);
                              }}
                              className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1 text-xs text-foreground transition-colors hover:border-gold hover:text-gold"
                            >
                              {copiedAccount === m.account_number ? (
                                <>
                                  <Check className="h-3 w-3 text-emerald-400" />
                                  <span>{t("checkout.copied")}</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3 w-3" />
                                  <span>{t("checkout.copy")}</span>
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>

            {/* Reference input for Vodafone Cash & InstaPay */}
            {(selectedCode === "vodafone_cash" || selectedCode === "instapay") && (
              <div className="mt-5 rounded-xl border border-gold/40 bg-gold/5 p-4 sm:p-5">
                <label className={labelCls} htmlFor="payment_reference">
                  {t("checkout.reference")} *
                </label>
                <p className="mt-1 text-xs text-muted-foreground">{t("checkout.referenceDesc")}</p>
                <input
                  id="payment_reference"
                  name="payment_reference"
                  required
                  value={paymentReference}
                  onChange={(e) => setPaymentReference(e.target.value)}
                  placeholder={t("checkout.referencePlaceholder")}
                  className={field}
                />
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
              <span>{isAr ? "تحتاجين مساعدة في الدفع؟" : "Need help with payment?"}</span>
              <a
                href={`${CONTACT.whatsappLink}?text=${encodeURIComponent("Hi Nora! I need help with payment on Linora Stellar.")}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-gold hover:underline"
              >
                <MessageCircle className="h-3 w-3" />
                <span>{isAr ? "تحدثي معنا عبر واتساب" : "Chat on WhatsApp"}</span>
              </a>
            </div>
          </section>
        </div>

        {/* Aside Summary */}
        <aside className="h-fit rounded-xl border border-border p-6 sticky top-24 card-star">
          <h2 className="font-display text-2xl">{t("checkout.orderSummary")}</h2>
          <ul className="mt-4 divide-y divide-border/60 max-h-72 overflow-y-auto">
            {items.map((i) => (
              <li key={i.id} className="py-3 flex justify-between gap-3 text-sm">
                <div className="min-w-0">
                  <p className="font-medium truncate">{i.name}</p>
                  <p className="text-xs text-muted-foreground">× {i.quantity}</p>
                  {i.options &&
                    Object.entries(i.options).map(([k, v]) => (
                      <p key={k} className="text-[11px] text-muted-foreground truncate">
                        {k}: {v}
                      </p>
                    ))}
                </div>
                <span className="shrink-0 font-medium">{formatPrice(i.price * i.quantity)}</span>
              </li>
            ))}
          </ul>

          <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("cart.subtotal")}</span>
              <span className="font-medium">{formatPrice(total)}</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {isAr ? "خصم" : "Discount"} {coupon ? `(${coupon.code})` : ""}
                </span>
                <span className="font-medium text-emerald-400">
                  − {formatPrice(discountAmount)}
                </span>
              </div>
            )}

            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">{t("checkout.shipping")}</span>
              <span>
                {!isPhysical ? (
                  <span className="text-emerald-400 font-medium">{t("checkout.freeShipping")}</span>
                ) : selectedGov ? (
                  <span className="font-medium">{formatPrice(selectedGov.fee)}</span>
                ) : (
                  <span className="text-xs text-gold">{t("checkout.selectGovShipping")}</span>
                )}
              </span>
            </div>

            {selectedGov && isPhysical && (
              <p className="text-[11px] text-muted-foreground text-end">
                {isAr ? selectedGov.estimatedDaysAr : selectedGov.estimatedDays}
              </p>
            )}
          </div>

          <div className="mt-4 flex justify-between border-t border-border pt-4 text-base font-semibold">
            <span>{t("checkout.total")}</span>
            <span className="text-xl text-gold">{formatPrice(grandTotal)}</span>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full rounded-full bg-primary px-6 py-3.5 text-sm uppercase tracking-[0.16em] text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60 font-medium"
          >
            {submitting ? t("checkout.placing") : t("checkout.placeOrder")}
          </button>
        </aside>
      </form>
    </div>
  );
}
