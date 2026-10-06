// Server-only order helpers shared by server functions and the payment webhook.
import { getRequest } from "@tanstack/react-start/server";

import {
  customerOrderEmail,
  ownerOrderEmail,
  sendEmail,
  type OrderEmailData,
} from "./email.server";
import { OWNER_EMAIL } from "./env.server";

/** 10 chars from a 32-symbol alphabet = 50 bits; unguessable enough for a link-style lookup. */
export function generateOrderNumber(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(10));
  return "LS-" + Array.from(bytes, (b) => alphabet[b % 32]).join("");
}

/** Verified user id from the Bearer token the client attaches, or null for guests. */
export async function optionalUserId(): Promise<string | null> {
  const header = getRequest()?.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) return null;
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin.auth.getUser(header.slice(7));
  return data?.user?.id ?? null;
}

const SYNTHETIC_EMAIL_SUFFIX = "@customer.linorastellar.com";

type OrderRow = OrderEmailData & { id: string; items: unknown };

/**
 * Sends the customer + owner emails exactly once per order. The `notified_at` column is
 * claimed atomically first, so a double webhook or a replayed request can't send twice.
 */
export async function notifyOrder(orderId: string): Promise<{ sent: boolean }> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const { data: claimed } = await supabaseAdmin
    .from("orders")
    .update({ notified_at: new Date().toISOString() })
    .eq("id", orderId)
    .is("notified_at", null)
    .select("*")
    .maybeSingle();
  if (!claimed) return { sent: false };

  const row = claimed as unknown as OrderRow;
  const order: OrderEmailData = {
    ...row,
    items: Array.isArray(row.items) ? (row.items as OrderEmailData["items"]) : [],
  };

  const jobs: Array<Promise<boolean>> = [];
  const owner = ownerOrderEmail(order);
  jobs.push(sendEmail({ to: OWNER_EMAIL, subject: owner.subject, html: owner.html, replyTo: order.email }));

  // Express checkout invents an address from the phone number; never email those.
  if (order.email && !order.email.endsWith(SYNTHETIC_EMAIL_SUFFIX)) {
    const customer = customerOrderEmail(order);
    jobs.push(sendEmail({ to: order.email, subject: customer.subject, html: customer.html }));
  }

  const results = await Promise.all(jobs);
  if (!results.some(Boolean)) {
    // Nothing went out (no API key / provider down): release the claim so it can retry.
    await supabaseAdmin.from("orders").update({ notified_at: null }).eq("id", orderId);
    return { sent: false };
  }
  return { sent: true };
}

/** Fields safe to return to whoever holds the order number. */
export function publicOrderView(row: Record<string, unknown>) {
  const keys = [
    "id",
    "order_number",
    "customer_name",
    "email",
    "phone",
    "address",
    "city",
    "governorate",
    "total",
    "status",
    "payment_method",
    "payment_reference",
    "payment_status",
    "items",
    "notes",
    "created_at",
  ];
  return Object.fromEntries(keys.map((k) => [k, row[k] ?? null]));
}
