// Server-only transactional email via Resend's HTTP API (no SDK, works on Node and edge).
// Docs: https://resend.com/docs/api-reference/emails/send-email
import { env, OWNER_EMAIL, siteUrl } from "./env.server";

export function isEmailConfigured(): boolean {
  return Boolean(env("RESEND_API_KEY"));
}

export function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

type SendArgs = {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
};

/** Returns true on success. Never throws: a failed email must not fail an order. */
export async function sendEmail({ to, subject, html, replyTo }: SendArgs): Promise<boolean> {
  const apiKey = env("RESEND_API_KEY");
  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY is not set — email skipped:", subject);
    return false;
  }
  // Until a domain is verified in Resend, only "onboarding@resend.dev" can send, and only
  // to the Resend account's own address. Set EMAIL_FROM once linorastellar.com is verified.
  const from = env("EMAIL_FROM") ?? "Linora Stellar <onboarding@resend.dev>";

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
    });
    if (!res.ok) {
      console.error("[email] Resend rejected the message:", res.status, await res.text());
      return false;
    }
    return true;
  } catch (error) {
    console.error("[email] Network error while sending:", error);
    return false;
  }
}

// ---------------------------------------------------------------------------
// Templates (inline styles only — email clients ignore <style> blocks)
// ---------------------------------------------------------------------------

function shell(title: string, body: string): string {
  return `<!doctype html><html dir="auto"><body style="margin:0;background:#080D1A;padding:24px;font-family:Arial,Helvetica,sans-serif;color:#FFF6ED">
  <div style="max-width:560px;margin:0 auto;background:#10182B;border:1px solid #DFAD71;border-radius:14px;padding:28px">
    <p style="margin:0 0 4px;color:#DFAD71;letter-spacing:3px;font-size:12px">✦ LINORA STELLAR</p>
    <h1 style="margin:0 0 18px;font-size:22px;color:#FFF6ED">${escapeHtml(title)}</h1>
    ${body}
  </div></body></html>`;
}

const row = (label: string, value: unknown) =>
  `<tr><td style="padding:6px 12px 6px 0;color:#9AA7C4;font-size:13px;vertical-align:top">${escapeHtml(label)}</td><td style="padding:6px 0;font-size:14px">${escapeHtml(value)}</td></tr>`;

export type OrderEmailData = {
  order_number: string;
  customer_name: string;
  email: string;
  phone: string;
  address?: string | null;
  city?: string | null;
  governorate?: string | null;
  payment_method: string;
  payment_status?: string | null;
  payment_reference?: string | null;
  total: number;
  notes?: string | null;
  items: Array<{ name: string; quantity: number; price: number }>;
};

const PAYMENT_LABELS: Record<string, string> = {
  vodafone_cash: "Vodafone Cash",
  instapay: "InstaPay",
  cod: "Cash on Delivery",
  card: "Credit / Debit card",
};

function itemsTable(order: OrderEmailData): string {
  const lines = order.items
    .map(
      (i) =>
        `<tr><td style="padding:6px 0;font-size:14px">${escapeHtml(i.name)} × ${escapeHtml(i.quantity)}</td><td style="padding:6px 0;text-align:right;font-size:14px">${escapeHtml(Math.round(i.price * i.quantity))} EGP</td></tr>`,
    )
    .join("");
  return `<table style="width:100%;border-collapse:collapse;border-top:1px solid #28344E;margin-top:8px">${lines}
    <tr><td style="padding:10px 0 0;font-weight:bold;border-top:1px solid #28344E">Total</td><td style="padding:10px 0 0;text-align:right;font-weight:bold;border-top:1px solid #28344E;color:#DFAD71">${escapeHtml(Math.round(order.total))} EGP</td></tr></table>`;
}

export function customerOrderEmail(order: OrderEmailData) {
  const paid = order.payment_status === "paid";
  const paymentLine = paid
    ? "Your card payment was received — thank you!"
    : order.payment_method === "cod"
      ? "You'll pay in cash when your order arrives."
      : "We'll confirm your transfer shortly. You can also send the receipt screenshot on WhatsApp.";
  const trackUrl = `${siteUrl()}/track?order=${encodeURIComponent(order.order_number)}`;
  return {
    subject: `Linora Stellar — order ${order.order_number} received`,
    html: shell(
      `Thank you, ${order.customer_name}!`,
      `<p style="font-size:14px;line-height:1.6;margin:0 0 12px">We received your order <b style="color:#DFAD71">${escapeHtml(order.order_number)}</b>. ${escapeHtml(paymentLine)}</p>
       ${itemsTable(order)}
       <p style="margin:18px 0 0"><a href="${escapeHtml(trackUrl)}" style="display:inline-block;background:#DFAD71;color:#080D1A;text-decoration:none;padding:10px 18px;border-radius:999px;font-size:13px;font-weight:bold">Track your order</a></p>
       <p style="margin:18px 0 0;font-size:12px;color:#9AA7C4">Questions? Reply to this email or message us on WhatsApp +201040277935.</p>`,
    ),
  };
}

export function ownerOrderEmail(order: OrderEmailData) {
  const adminUrl = `${siteUrl()}/admin`;
  return {
    subject: `New order ${order.order_number} — ${Math.round(order.total)} EGP (${PAYMENT_LABELS[order.payment_method] ?? order.payment_method})`,
    html: shell(
      `New order ${order.order_number}`,
      `<table style="border-collapse:collapse">
        ${row("Customer", order.customer_name)}
        ${row("Phone", order.phone)}
        ${row("Email", order.email)}
        ${row("Governorate", order.governorate)}
        ${row("City", order.city)}
        ${row("Address", order.address)}
        ${row("Payment", PAYMENT_LABELS[order.payment_method] ?? order.payment_method)}
        ${row("Payment status", order.payment_status ?? "unpaid")}
        ${row("Payment reference", order.payment_reference)}
        ${row("Notes", order.notes)}
      </table>
      ${itemsTable(order)}
      <p style="margin:18px 0 0"><a href="${escapeHtml(adminUrl)}" style="color:#DFAD71">Open the dashboard</a></p>`,
    ),
  };
}

export function ownerContactEmail(msg: { name: string; email: string; subject?: string | null; message: string }) {
  return {
    subject: `Contact form: ${msg.subject?.trim() || "New message"} — ${msg.name}`,
    html: shell(
      "New message from the contact form",
      `<table style="border-collapse:collapse">${row("Name", msg.name)}${row("Email", msg.email)}${row("Subject", msg.subject)}</table>
       <p style="white-space:pre-line;font-size:14px;line-height:1.6;border-top:1px solid #28344E;margin-top:12px;padding-top:12px">${escapeHtml(msg.message)}</p>
       <p style="font-size:12px;color:#9AA7C4">Just hit Reply — it goes to ${escapeHtml(msg.email)}.</p>`,
    ),
  };
}

export function ownerCustomOrderEmail(req: {
  name: string;
  email: string;
  phone: string;
  design_type: string;
  description: string;
  budget?: string | null;
  deadline?: string | null;
  preferred_style?: string | null;
  preferred_colors?: string | null;
  reference_url?: string | null;
}) {
  return {
    subject: `New custom design request — ${req.design_type} (${req.name})`,
    html: shell(
      "New custom design request",
      `<table style="border-collapse:collapse">
        ${row("Name", req.name)}${row("Email", req.email)}${row("Phone", req.phone)}
        ${row("Type", req.design_type)}${row("Budget", req.budget)}${row("Deadline", req.deadline)}
        ${row("Style", req.preferred_style)}${row("Colors", req.preferred_colors)}${row("Reference", req.reference_url)}
      </table>
      <p style="white-space:pre-line;font-size:14px;line-height:1.6;border-top:1px solid #28344E;margin-top:12px;padding-top:12px">${escapeHtml(req.description)}</p>`,
    ),
  };
}

export { OWNER_EMAIL };
