// Server-only Paymob (Accept) integration — Egypt, Intention API + Unified Checkout.
// Docs: https://developers.paymob.com/egypt
//
// Required environment variables (see .env.example):
//   PAYMOB_SECRET_KEY      egy_sk_...   (Dashboard → Settings → Account Info)
//   PAYMOB_PUBLIC_KEY      egy_pk_...
//   PAYMOB_INTEGRATION_ID  numeric id of your *online card* integration
//   PAYMOB_HMAC_SECRET     Dashboard → Settings → Account Info → HMAC
import { env, siteUrl } from "./env.server";

const BASE_URL = () => env("PAYMOB_BASE_URL") ?? "https://accept.paymob.com";

export function isPaymobConfigured(): boolean {
  return Boolean(
    env("PAYMOB_SECRET_KEY") &&
    env("PAYMOB_PUBLIC_KEY") &&
    env("PAYMOB_INTEGRATION_ID") &&
    env("PAYMOB_HMAC_SECRET"),
  );
}

type IntentionArgs = {
  orderNumber: string;
  totalEgp: number;
  customerName: string;
  email: string;
  phone: string;
  city?: string | null;
};

export type IntentionResult = {
  checkoutUrl: string;
  /** Paymob's own order id for this intention, when returned. Used to match the callback. */
  providerRef: string | null;
};

function splitName(full: string): { first: string; last: string } {
  const parts = full.trim().split(/\s+/);
  return { first: parts[0] || "Customer", last: parts.slice(1).join(" ") || "NA" };
}

export async function createIntention(args: IntentionArgs): Promise<IntentionResult> {
  const secret = env("PAYMOB_SECRET_KEY");
  const publicKey = env("PAYMOB_PUBLIC_KEY");
  const integrationId = Number(env("PAYMOB_INTEGRATION_ID"));
  if (!secret || !publicKey || !Number.isFinite(integrationId)) {
    throw new Error("Paymob is not configured");
  }

  const amountCents = Math.round(args.totalEgp * 100);
  const { first, last } = splitName(args.customerName);
  const base = siteUrl();

  const res = await fetch(`${BASE_URL()}/v1/intention/`, {
    method: "POST",
    headers: { Authorization: `Token ${secret}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      amount: amountCents,
      currency: "EGP",
      payment_methods: [integrationId],
      // One line that equals the full amount (shipping and discounts already included),
      // so Paymob's "items must add up to amount" validation can never fail.
      items: [
        {
          name: `Linora Stellar order ${args.orderNumber}`,
          amount: amountCents,
          description: "Linora Stellar order",
          quantity: 1,
        },
      ],
      billing_data: {
        first_name: first,
        last_name: last,
        email: args.email,
        phone_number: args.phone,
        country: "EG",
        city: args.city || "NA",
        street: "NA",
        building: "NA",
        floor: "NA",
        apartment: "NA",
      },
      customer: { first_name: first, last_name: last, email: args.email },
      special_reference: args.orderNumber,
      notification_url: `${base}/api/public/paymob-webhook`,
      redirection_url: `${base}/order/${encodeURIComponent(args.orderNumber)}`,
    }),
  });

  const body = (await res.json().catch(() => null)) as {
    client_secret?: string;
    intention_order_id?: number | string;
    detail?: unknown;
  } | null;

  if (!res.ok || !body?.client_secret) {
    console.error("[paymob] intention failed:", res.status, JSON.stringify(body));
    throw new Error("Paymob rejected the payment request");
  }

  const checkoutUrl = `${BASE_URL()}/unifiedcheckout/?publicKey=${encodeURIComponent(publicKey)}&clientSecret=${encodeURIComponent(body.client_secret)}`;
  return {
    checkoutUrl,
    providerRef: body.intention_order_id != null ? String(body.intention_order_id) : null,
  };
}

// ---------------------------------------------------------------------------
// Callback verification
// ---------------------------------------------------------------------------

export type PaymobTransaction = {
  id?: number | string;
  amount_cents?: number;
  success?: boolean;
  pending?: boolean;
  is_refunded?: boolean;
  is_voided?: boolean;
  error_occured?: boolean;
  order?: { id?: number | string; merchant_order_id?: string | null };
  source_data?: { pan?: string; sub_type?: string; type?: string };
  [key: string]: unknown;
};

/** Field order is fixed by Paymob's "Transaction Processed Callback" HMAC spec. */
const HMAC_FIELDS = [
  "amount_cents",
  "created_at",
  "currency",
  "error_occured",
  "has_parent_transaction",
  "id",
  "integration_id",
  "is_3d_secure",
  "is_auth",
  "is_capture",
  "is_refunded",
  "is_standalone_payment",
  "is_voided",
  "order.id",
  "owner",
  "pending",
  "source_data.pan",
  "source_data.sub_type",
  "source_data.type",
  "success",
] as const;

function readPath(obj: Record<string, unknown>, path: string): string {
  let cur: unknown = obj;
  for (const key of path.split(".")) {
    if (cur == null || typeof cur !== "object") return "";
    cur = (cur as Record<string, unknown>)[key];
  }
  return cur == null ? "" : String(cur);
}

export async function verifyHmac(
  obj: PaymobTransaction,
  received: string | null,
): Promise<boolean> {
  const secret = env("PAYMOB_HMAC_SECRET");
  if (!secret || !received) return false;
  const { createHmac, timingSafeEqual } = await import("node:crypto");

  const concatenated = HMAC_FIELDS.map((f) => readPath(obj as Record<string, unknown>, f)).join("");
  const expected = createHmac("sha512", secret).update(concatenated, "utf8").digest("hex");

  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(received.toLowerCase(), "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}
