import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const itemSchema = z.object({
  slug: z.string().trim().min(1).max(200),
  name: z.string().trim().min(1).max(200),
  price: z.number().finite().min(0).max(100000),
  quantity: z.number().int().min(1).max(50),
  options: z.record(z.string().max(300)).optional(),
});

const placeOrderSchema = z.object({
  customer: z.object({
    name: z.string().trim().min(2).max(120),
    email: z.string().trim().email().max(255),
    phone: z.string().trim().min(6).max(30),
    altPhone: z.string().trim().max(30).optional(),
    address: z.string().trim().min(1).max(500),
    city: z.string().trim().min(1).max(120),
    governorate: z.string().trim().min(1).max(120),
    postalCode: z.string().trim().max(20).optional(),
    notes: z.string().trim().max(1000).optional(),
  }),
  paymentMethod: z.string().trim().min(1).max(40),
  paymentReference: z.string().trim().max(200).optional(),
  couponCode: z.string().trim().max(40).optional(),
  items: z.array(itemSchema).min(1).max(50),
});

export type PlaceOrderInput = z.infer<typeof placeOrderSchema>;

export type PlaceOrderResult =
  | { ok: true; orderNumber: string; paymentUrl?: string }
  | {
      ok: false;
      code:
        | "rate_limited"
        | "not_configured"
        | "invalid_payment_method"
        | "reference_required"
        | "governorate_required"
        | "card_unavailable"
        | "card_items"
        | "card_failed"
        | "server_error";
    };

/**
 * Creates an order on the server: re-prices it from the products table, saves it with the
 * service-role client, emails the customer/owner, and (for cards) opens a Paymob checkout.
 */
export const placeOrder = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => placeOrderSchema.parse(input))
  .handler(async ({ data }): Promise<PlaceOrderResult> => {
    try {
      const { allow } = await import("./rate-limit.server");
      if (!allow("place-order", 10, 10 * 60_000)) return { ok: false, code: "rate_limited" };

      const { isSupabaseServerConfigured } = await import("./env.server");
      if (!isSupabaseServerConfigured()) return { ok: false, code: "not_configured" };

      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { priceOrder } = await import("./pricing.server");
      const { generateOrderNumber, notifyOrder, optionalUserId } = await import("./orders.server");
      const { requiresPhysicalShipping, getGovernorate } = await import("./egypt-shipping");

      // 1. Payment method must exist and be enabled.
      const { data: method } = await supabaseAdmin
        .from("payment_methods")
        .select("code, is_active")
        .eq("code", data.paymentMethod)
        .maybeSingle();
      if (!method || method.is_active === false) return { ok: false, code: "invalid_payment_method" };

      const needsRef = data.paymentMethod === "vodafone_cash" || data.paymentMethod === "instapay";
      if (needsRef && !data.paymentReference) return { ok: false, code: "reference_required" };

      // 2. Authoritative pricing.
      const physical = requiresPhysicalShipping(data.items);
      const gov = getGovernorate(data.customer.governorate);
      if (physical && !gov) return { ok: false, code: "governorate_required" };

      const priced = await priceOrder({
        items: data.items,
        governorate: data.customer.governorate,
        couponCode: data.couponCode,
      });

      // 3. Card checks happen BEFORE anything is saved.
      const isCard = data.paymentMethod === "card";
      let paymob: typeof import("./paymob.server") | null = null;
      if (isCard) {
        paymob = await import("./paymob.server");
        if (!paymob.isPaymobConfigured()) return { ok: false, code: "card_unavailable" };
        // Custom/bundle items have no catalog price to verify, so they can't be paid by card.
        if (!priced.allFromCatalog) return { ok: false, code: "card_items" };
      }

      // 4. Save.
      const orderNumber = generateOrderNumber();
      const govName = gov ? `${gov.nameEn} / ${gov.nameAr}` : data.customer.governorate;
      const { data: order, error } = await supabaseAdmin
        .from("orders")
        .insert({
          order_number: orderNumber,
          user_id: await optionalUserId(),
          customer_name: data.customer.name,
          email: data.customer.email,
          phone: data.customer.phone,
          alt_phone: data.customer.altPhone || null,
          national_id: null,
          address: data.customer.address,
          city: data.customer.city,
          governorate: govName,
          postal_code: data.customer.postalCode || null,
          notes: data.customer.notes || null,
          payment_method: data.paymentMethod,
          payment_reference: data.paymentReference || null,
          payment_status: isCard ? "pending" : "unpaid",
          payment_provider: isCard ? "paymob" : null,
          total: priced.total,
          items: priced.items.map(({ fromCatalog: _ignored, ...rest }) => rest),
        })
        .select("id, order_number")
        .single();

      if (error || !order) {
        console.error("[placeOrder] insert failed:", error);
        return { ok: false, code: "server_error" };
      }

      // 5a. Card: hand over to Paymob. Emails are sent by the webhook once payment succeeds.
      if (isCard && paymob) {
        try {
          const intention = await paymob.createIntention({
            orderNumber,
            totalEgp: priced.total,
            customerName: data.customer.name,
            email: data.customer.email,
            phone: data.customer.phone,
            city: data.customer.city,
          });
          await supabaseAdmin
            .from("orders")
            .update({ payment_provider_ref: intention.providerRef })
            .eq("id", order.id);
          return { ok: true, orderNumber, paymentUrl: intention.checkoutUrl };
        } catch (err) {
          console.error("[placeOrder] Paymob intention failed:", err);
          await supabaseAdmin
            .from("orders")
            .update({ status: "cancelled", payment_status: "failed" })
            .eq("id", order.id);
          return { ok: false, code: "card_failed" };
        }
      }

      // 5b. Manual methods: notify immediately.
      await notifyOrder(order.id);
      return { ok: true, orderNumber };
    } catch (err) {
      console.error("[placeOrder] unexpected error:", err);
      return { ok: false, code: "server_error" };
    }
  });

// ---------------------------------------------------------------------------
// Guest-safe lookups (RLS only lets signed-in customers read their own rows)
// ---------------------------------------------------------------------------

const ORDER_NUMBER_RE = /^LS-[A-Z0-9]{6,12}$/;

export const lookupOrder = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ orderNumber: z.string().trim().min(4).max(30) }).parse(input),
  )
  .handler(async ({ data }) => {
    const { allow } = await import("./rate-limit.server");
    if (!allow("lookup-order", 40, 10 * 60_000)) return { order: null };

    const { isSupabaseServerConfigured } = await import("./env.server");
    if (!isSupabaseServerConfigured()) return { order: null };

    const number = data.orderNumber.toUpperCase();
    if (!ORDER_NUMBER_RE.test(number)) return { order: null };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { publicOrderView } = await import("./orders.server");
    const { data: row } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("order_number", number)
      .maybeSingle();
    return { order: row ? publicOrderView(row as unknown as Record<string, unknown>) : null };
  });

/**
 * Order tracking. An order number returns the full order; a phone number returns only the
 * status of the latest order (no address, items or email), so a stranger who types someone
 * else's number learns almost nothing.
 */
export const trackOrder = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ query: z.string().trim().min(3).max(40) }).parse(input),
  )
  .handler(async ({ data }) => {
    const { allow } = await import("./rate-limit.server");
    if (!allow("track-order", 30, 10 * 60_000)) return { order: null, partial: false };

    const { isSupabaseServerConfigured } = await import("./env.server");
    if (!isSupabaseServerConfigured()) return { order: null, partial: false };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { publicOrderView } = await import("./orders.server");

    const asNumber = data.query.toUpperCase();
    if (ORDER_NUMBER_RE.test(asNumber)) {
      const { data: row } = await supabaseAdmin
        .from("orders")
        .select("*")
        .eq("order_number", asNumber)
        .maybeSingle();
      return {
        order: row ? publicOrderView(row as unknown as Record<string, unknown>) : null,
        partial: false,
      };
    }

    const { data: row } = await supabaseAdmin
      .from("orders")
      .select("id, order_number, status, payment_status, payment_method, total, created_at")
      .eq("phone", data.query)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    return { order: row ?? null, partial: true };
  });
