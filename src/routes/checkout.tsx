import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { formatPrice, useCart } from "@/lib/cart";
import { paymentMethodsQuery } from "@/lib/store";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Linora Stellar" },
      { name: "description", content: "Complete your Linora Stellar order with Vodafone Cash, InstaPay or cash on delivery." },
      { property: "og:title", content: "Checkout — Linora Stellar" },
      { property: "og:description", content: "Delivery details and payment for your order." },
    ],
  }),
  component: Checkout,
});

const field =
  "mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-gold";
const labelCls = "text-xs uppercase tracking-[0.16em] text-muted-foreground";

function Checkout() {
  const { items, total, clear } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: methods = [] } = useQuery(paymentMethodsQuery);
  const active = methods.filter((m) => m.is_active);
  const [method, setMethod] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  const chosen = active.find((m) => m.code === method) ?? active[0];
  const selectedCode = method || chosen?.code || "cod";

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }
    const form = new FormData(e.currentTarget);
    setSubmitting(true);
    const { data, error } = await supabase
      .from("orders")
      .insert({
        user_id: user?.id ?? null,
        customer_name: String(form.get("name") ?? ""),
        email: String(form.get("email") ?? ""),
        phone: String(form.get("phone") ?? ""),
        alt_phone: String(form.get("alt_phone") ?? "") || null,
        national_id: String(form.get("national_id") ?? "") || null,
        address: String(form.get("address") ?? ""),
        city: String(form.get("city") ?? ""),
        governorate: String(form.get("governorate") ?? "") || null,
        postal_code: String(form.get("postal_code") ?? "") || null,
        notes: String(form.get("notes") ?? "") || null,
        payment_method: selectedCode,
        payment_reference: String(form.get("payment_reference") ?? "") || null,
        total,
        items: items.map((i) => ({
          name: i.name,
          slug: i.slug,
          price: i.price,
          quantity: i.quantity,
          options: i.options ?? {},
        })),
      })
      .select("order_number")
      .single();
    setSubmitting(false);

    if (error || !data) {
      toast.error("We couldn't place the order. Please try again or message us on WhatsApp.");
      return;
    }
    clear();
    navigate({ to: "/order/$number", params: { number: data.order_number } });
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-display text-4xl">Nothing to check out yet</h1>
        <Link to="/shop" className="mt-6 inline-block text-sm text-gold underline">
          Browse the shop
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 lg:px-8">
      <h1 className="font-display text-5xl">Checkout</h1>
      <form onSubmit={submit} className="mt-10 grid gap-10 lg:grid-cols-[1fr_340px]">
        <div className="space-y-8">
          <section className="rounded-xl border border-border p-6">
            <h2 className="font-display text-2xl">Delivery details</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={labelCls} htmlFor="name">Full name</label>
                <input id="name" name="name" required className={field} />
              </div>
              <div>
                <label className={labelCls} htmlFor="email">Email</label>
                <input id="email" name="email" type="email" required defaultValue={user?.email ?? ""} className={field} />
              </div>
              <div>
                <label className={labelCls} htmlFor="phone">Phone</label>
                <input id="phone" name="phone" required className={field} />
              </div>
              <div>
                <label className={labelCls} htmlFor="alt_phone">Alternate phone</label>
                <input id="alt_phone" name="alt_phone" className={field} />
              </div>
              <div>
                <label className={labelCls} htmlFor="national_id">National ID (optional)</label>
                <input id="national_id" name="national_id" className={field} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls} htmlFor="address">Address</label>
                <input id="address" name="address" required className={field} />
              </div>
              <div>
                <label className={labelCls} htmlFor="city">City</label>
                <input id="city" name="city" required className={field} />
              </div>
              <div>
                <label className={labelCls} htmlFor="governorate">Governorate</label>
                <input id="governorate" name="governorate" className={field} />
              </div>
              <div>
                <label className={labelCls} htmlFor="postal_code">Postal code</label>
                <input id="postal_code" name="postal_code" className={field} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls} htmlFor="notes">Order notes</label>
                <textarea id="notes" name="notes" rows={3} className={field} />
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-border p-6">
            <h2 className="font-display text-2xl">Payment</h2>
            <div className="mt-5 space-y-3">
              {active.map((m) => (
                <label
                  key={m.id}
                  className={`flex cursor-pointer gap-3 rounded-lg border p-4 transition-colors ${
                    selectedCode === m.code ? "border-gold" : "border-border"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment_method"
                    value={m.code}
                    checked={selectedCode === m.code}
                    onChange={() => setMethod(m.code)}
                    className="mt-1"
                  />
                  <span>
                    <span className="block text-sm font-medium">{m.label}</span>
                    <span className="block text-xs text-muted-foreground">{m.instructions}</span>
                    {m.account_number && (
                      <span className="mt-1 block text-xs text-gold">{m.account_number}</span>
                    )}
                  </span>
                </label>
              ))}
            </div>
            {(selectedCode === "vodafone_cash" || selectedCode === "instapay") && (
              <div className="mt-4">
                <label className={labelCls} htmlFor="payment_reference">Transfer reference</label>
                <input id="payment_reference" name="payment_reference" className={field} />
              </div>
            )}
          </section>
        </div>

        <aside className="h-fit rounded-xl border border-border p-6">
          <h2 className="font-display text-2xl">Your order</h2>
          <ul className="mt-4 space-y-3">
            {items.map((i) => (
              <li key={i.id} className="flex justify-between gap-3 text-sm">
                <span className="text-muted-foreground">
                  {i.name} × {i.quantity}
                </span>
                <span>{formatPrice(i.price * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex justify-between border-t border-border pt-4 text-base">
            <span>Total</span>
            <span className="text-gold">{formatPrice(total)}</span>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full rounded-full bg-primary px-6 py-3 text-sm uppercase tracking-[0.16em] text-primary-foreground disabled:opacity-60"
          >
            {submitting ? "Placing order…" : "Place order"}
          </button>
        </aside>
      </form>
    </div>
  );
}
