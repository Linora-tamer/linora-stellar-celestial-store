import { createFileRoute } from "@tanstack/react-router";

/**
 * Paymob "Transaction Processed Callback" (server-to-server POST).
 * Set this URL in the Paymob dashboard for your card integration:
 *   https://YOUR-DOMAIN/api/public/paymob-webhook
 * (The same URL is also sent as notification_url on every payment intention.)
 *
 * Security: the request is only trusted if its HMAC-SHA512 signature matches, and the paid
 * amount must equal the order total stored in our own database.
 */
export const Route = createFileRoute("/api/public/paymob-webhook")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const { verifyHmac } = await import("@/lib/paymob.server");
        type Tx = import("@/lib/paymob.server").PaymobTransaction;

        const url = new URL(request.url);
        let payload: { obj?: Tx } | null = null;
        try {
          payload = (await request.json()) as { obj?: Tx };
        } catch {
          return new Response("Bad request", { status: 400 });
        }
        const tx = payload?.obj;
        if (!tx) return new Response("Bad request", { status: 400 });

        if (!(await verifyHmac(tx, url.searchParams.get("hmac")))) {
          return new Response("Invalid signature", { status: 401 });
        }

        const { isSupabaseServerConfigured } = await import("@/lib/env.server");
        if (!isSupabaseServerConfigured())
          return new Response("Server not configured", { status: 500 });

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { notifyOrder } = await import("@/lib/orders.server");

        // Match by our order number (special_reference) first, then by Paymob's order id.
        const merchantRef = tx.order?.merchant_order_id ?? null;
        const providerRef = tx.order?.id != null ? String(tx.order.id) : null;

        let order: {
          id: string;
          total: number;
          status: string;
          payment_status: string;
        } | null = null;

        if (merchantRef) {
          const { data } = await supabaseAdmin
            .from("orders")
            .select("id, total, status, payment_status")
            .eq("order_number", merchantRef)
            .maybeSingle();
          order = (data as typeof order) ?? null;
        }
        if (!order && providerRef) {
          const { data } = await supabaseAdmin
            .from("orders")
            .select("id, total, status, payment_status")
            .eq("payment_provider_ref", providerRef)
            .maybeSingle();
          order = (data as typeof order) ?? null;
        }
        // Unknown order: acknowledge so Paymob stops retrying, but change nothing.
        if (!order) return new Response("OK", { status: 200 });

        const txRef = tx.id != null ? String(tx.id) : null;

        if (tx.is_refunded || tx.is_voided) {
          await supabaseAdmin
            .from("orders")
            .update({ payment_status: "refunded", updated_at: new Date().toISOString() })
            .eq("id", order.id);
          return new Response("OK", { status: 200 });
        }

        if (tx.success === true && tx.pending !== true && tx.error_occured !== true) {
          const expectedCents = Math.round(Number(order.total) * 100);
          if (Number(tx.amount_cents) !== expectedCents) {
            console.error(
              `[paymob] amount mismatch on order ${order.id}: paid ${tx.amount_cents}, expected ${expectedCents}`,
            );
            await supabaseAdmin
              .from("orders")
              .update({ payment_status: "failed", payment_provider_ref: txRef })
              .eq("id", order.id);
            return new Response("OK", { status: 200 });
          }
          if (order.payment_status !== "paid") {
            await supabaseAdmin
              .from("orders")
              .update({
                payment_status: "paid",
                paid_at: new Date().toISOString(),
                payment_provider_ref: txRef ?? providerRef,
                payment_reference: txRef ? `Paymob #${txRef}` : null,
                status: order.status === "pending" ? "confirmed" : order.status,
                updated_at: new Date().toISOString(),
              })
              .eq("id", order.id);
          }
          await notifyOrder(order.id);
          return new Response("OK", { status: 200 });
        }

        // Failed attempt. Never downgrade an order that is already paid.
        if (order.payment_status !== "paid" && tx.pending !== true) {
          await supabaseAdmin
            .from("orders")
            .update({ payment_status: "failed", updated_at: new Date().toISOString() })
            .eq("id", order.id);
        }
        return new Response("OK", { status: 200 });
      },
    },
  },
});
