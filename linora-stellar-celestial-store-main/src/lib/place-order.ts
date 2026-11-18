import { supabase } from "@/integrations/supabase/client";

import { hasBackend } from "./backend";
import { couponDiscount, findCoupon } from "./coupons";
import { getGovernorate, requiresPhysicalShipping } from "./egypt-shipping";
import { placeOrder, type PlaceOrderInput } from "./orders.functions";

export type SubmitOrderResult =
  { ok: true; orderNumber: string; paymentUrl?: string } | { ok: false; code: string };

/**
 * Single entry point for every checkout in the app (full checkout and the one-page express
 * checkout). With a real Supabase backend the order is created and priced on the server
 * (emails, card payments). Without one (local preview) it falls back to the in-browser
 * mock store so the UI can still be demoed.
 */
export async function submitOrder(input: PlaceOrderInput): Promise<SubmitOrderResult> {
  if (hasBackend) {
    try {
      return await placeOrder({ data: input });
    } catch (error) {
      console.error("placeOrder failed:", error);
      return { ok: false, code: "server_error" };
    }
  }

  // ---- Preview mode (no Supabase credentials) ----
  if (input.paymentMethod === "card") return { ok: false, code: "card_unavailable" };

  const subtotal = input.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const discount = couponDiscount(subtotal, findCoupon(input.couponCode));
  const gov = getGovernorate(input.customer.governorate);
  const shipping = requiresPhysicalShipping(input.items) ? (gov?.fee ?? 0) : 0;

  const { data, error } = await supabase
    .from("orders")
    .insert({
      user_id: null,
      customer_name: input.customer.name,
      email: input.customer.email,
      phone: input.customer.phone,
      alt_phone: input.customer.altPhone || null,
      national_id: null,
      address: input.customer.address,
      city: input.customer.city,
      governorate: gov ? `${gov.nameEn} / ${gov.nameAr}` : input.customer.governorate,
      postal_code: input.customer.postalCode || null,
      notes: input.customer.notes || null,
      payment_method: input.paymentMethod,
      payment_reference: input.paymentReference || null,
      total: Math.max(0, subtotal - discount) + shipping,
      items: input.items.map((i) => ({ ...i, options: i.options ?? {} })),
    })
    .select("order_number")
    .single();

  if (error || !data) return { ok: false, code: "server_error" };
  return { ok: true, orderNumber: data.order_number };
}

export function orderErrorMessage(code: string, isAr: boolean): string {
  const m: Record<string, [string, string]> = {
    rate_limited: [
      "Too many attempts. Please wait a few minutes and try again.",
      "محاولات كثيرة. يرجى الانتظار بضع دقائق ثم المحاولة مرة أخرى.",
    ],
    not_configured: [
      "Online ordering isn't available right now. Please order via WhatsApp.",
      "الطلب الإلكتروني غير متاح حالياً. يرجى الطلب عبر واتساب.",
    ],
    invalid_payment_method: [
      "That payment method isn't available. Please choose another.",
      "وسيلة الدفع هذه غير متاحة. يرجى اختيار وسيلة أخرى.",
    ],
    reference_required: ["Please enter your transfer reference.", "يرجى إدخال رقم عملية التحويل."],
    governorate_required: ["Please select your governorate.", "يرجى اختيار المحافظة."],
    card_unavailable: [
      "Card payment isn't available yet. Please use Vodafone Cash, InstaPay or Cash on Delivery.",
      "الدفع بالبطاقة غير متاح حالياً. يرجى استخدام فودافون كاش أو إنستاباي أو الدفع عند الاستلام.",
    ],
    card_items: [
      "Custom items and bundles can't be paid by card. Please choose Vodafone Cash, InstaPay or Cash on Delivery.",
      "المنتجات المخصصة والباقات لا يمكن دفعها بالبطاقة. يرجى اختيار فودافون كاش أو إنستاباي أو الدفع عند الاستلام.",
    ],
    card_failed: [
      "We couldn't start the card payment. Nothing was charged — please try again or pick another method.",
      "تعذّر بدء الدفع بالبطاقة. لم يتم خصم أي مبلغ — حاولي مرة أخرى أو اختاري وسيلة أخرى.",
    ],
    server_error: [
      "Something went wrong placing your order. Please try again or contact us on WhatsApp.",
      "حدث خطأ أثناء إرسال الطلب. حاولي مرة أخرى أو تواصلي معنا عبر واتساب.",
    ],
  };
  const pair = m[code] ?? m["server_error"]!;
  return isAr ? pair[1] : pair[0];
}
