import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Star } from "@/components/site/Star";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { formatPrice } from "@/lib/cart";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "My account — Linora Stellar" },
      { name: "description", content: "Your Linora Stellar profile, saved address and order history." },
      { property: "og:title", content: "My account — Linora Stellar" },
      { property: "og:description", content: "Profile, saved address and orders." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Account,
});

const field =
  "mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-gold";
const labelCls = "text-xs uppercase tracking-[0.16em] text-muted-foreground";

type OrderRow = {
  id: string;
  order_number: string;
  status: string;
  total: number;
  created_at: string;
  payment_method: string;
};

type AddressRow = {
  id: string;
  full_name: string;
  phone: string;
  alt_phone: string | null;
  address: string;
  city: string;
  governorate: string | null;
  postal_code: string | null;
};

function Account() {
  const { user, loading, isOwner } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth", replace: true });
  }, [user, loading, navigate]);

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, email, phone")
        .eq("id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const { data: orders = [] } = useQuery({
    queryKey: ["my_orders", user?.id],
    enabled: !!user,
    queryFn: async (): Promise<OrderRow[]> => {
      const { data, error } = await supabase
        .from("orders")
        .select("id, order_number, status, total, created_at, payment_method")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as OrderRow[];
    },
  });

  const { data: address } = useQuery({
    queryKey: ["my_address", user?.id],
    enabled: !!user,
    queryFn: async (): Promise<AddressRow | null> => {
      const { data, error } = await supabase
        .from("addresses")
        .select("id, full_name, phone, alt_phone, address, city, governorate, postal_code")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return (data as AddressRow) ?? null;
    },
  });

  async function saveProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) return;
    const form = new FormData(e.currentTarget);
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: String(form.get("full_name") ?? "").slice(0, 100),
        phone: String(form.get("phone") ?? "").slice(0, 30) || null,
      })
      .eq("id", user.id);
    setSaving(false);
    if (error) {
      toast.error("Couldn't save your details.");
      return;
    }
    toast.success("Details saved.");
    queryClient.invalidateQueries({ queryKey: ["profile", user.id] });
  }

  async function saveAddress(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) return;
    const form = new FormData(e.currentTarget);
    const payload = {
      user_id: user.id,
      full_name: String(form.get("full_name") ?? "").slice(0, 100),
      phone: String(form.get("phone") ?? "").slice(0, 30),
      alt_phone: String(form.get("alt_phone") ?? "").slice(0, 30) || null,
      address: String(form.get("address") ?? "").slice(0, 400),
      city: String(form.get("city") ?? "").slice(0, 100),
      governorate: String(form.get("governorate") ?? "").slice(0, 100) || null,
      postal_code: String(form.get("postal_code") ?? "").slice(0, 20) || null,
      is_default: true,
    };
    setSaving(true);
    const { error } = address
      ? await supabase.from("addresses").update(payload).eq("id", address.id)
      : await supabase.from("addresses").insert(payload);
    setSaving(false);
    if (error) {
      toast.error("Couldn't save your address.");
      return;
    }
    toast.success("Address saved.");
    queryClient.invalidateQueries({ queryKey: ["my_address", user.id] });
  }

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  if (loading || !user) {
    return <div className="mx-auto max-w-7xl px-4 py-20 text-sm text-muted-foreground">Loading…</div>;
  }

  return (
    <div>
      <section className="starfield sky border-b border-border/60 py-14">
        <div className="relative mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-4 lg:px-8">
          <div>
            <p className="flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-gold">
              <Star className="h-3 w-3" /> Your account
            </p>
            <h1 className="mt-4 font-display text-4xl">{profile?.full_name || user.email}</h1>
          </div>
          <div className="ml-auto flex gap-2">
            {isOwner && (
              <Link
                to="/admin"
                className="rounded-md border border-gold px-4 py-2 text-sm text-gold hover:bg-primary hover:text-primary-foreground"
              >
                Dashboard
              </Link>
            )}
            <button
              type="button"
              onClick={signOut}
              className="rounded-md border border-border px-4 py-2 text-sm hover:border-gold"
            >
              Sign out
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-14 lg:grid-cols-2 lg:px-8">
        <form onSubmit={saveProfile} className="card-star space-y-4 rounded-2xl p-6">
          <h2 className="font-display text-2xl">Your details</h2>
          <div>
            <label className={labelCls} htmlFor="full_name">
              Full name
            </label>
            <input id="full_name" name="full_name" defaultValue={profile?.full_name ?? ""} className={field} />
          </div>
          <div>
            <label className={labelCls} htmlFor="email">
              Email
            </label>
            <input id="email" value={user.email ?? ""} readOnly className={`${field} opacity-70`} />
          </div>
          <div>
            <label className={labelCls} htmlFor="phone">
              Phone
            </label>
            <input id="phone" name="phone" defaultValue={profile?.phone ?? ""} className={field} />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60"
          >
            Save details
          </button>
        </form>

        <form onSubmit={saveAddress} className="card-star space-y-4 rounded-2xl p-6">
          <h2 className="font-display text-2xl">Saved delivery address</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls} htmlFor="a_name">
                Full name
              </label>
              <input
                id="a_name"
                name="full_name"
                required
                defaultValue={address?.full_name ?? profile?.full_name ?? ""}
                className={field}
              />
            </div>
            <div>
              <label className={labelCls} htmlFor="a_phone">
                Phone
              </label>
              <input id="a_phone" name="phone" required defaultValue={address?.phone ?? ""} className={field} />
            </div>
            <div>
              <label className={labelCls} htmlFor="a_alt">
                Alternate phone
              </label>
              <input id="a_alt" name="alt_phone" defaultValue={address?.alt_phone ?? ""} className={field} />
            </div>
            <div>
              <label className={labelCls} htmlFor="a_city">
                City
              </label>
              <input id="a_city" name="city" required defaultValue={address?.city ?? ""} className={field} />
            </div>
            <div>
              <label className={labelCls} htmlFor="a_gov">
                Governorate
              </label>
              <input id="a_gov" name="governorate" defaultValue={address?.governorate ?? ""} className={field} />
            </div>
            <div>
              <label className={labelCls} htmlFor="a_post">
                Postal code
              </label>
              <input id="a_post" name="postal_code" defaultValue={address?.postal_code ?? ""} className={field} />
            </div>
          </div>
          <div>
            <label className={labelCls} htmlFor="a_address">
              Address
            </label>
            <textarea id="a_address" name="address" required rows={3} defaultValue={address?.address ?? ""} className={field} />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60"
          >
            Save address
          </button>
        </form>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 lg:px-8">
        <h2 className="font-display text-2xl">Order history</h2>
        {orders.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">
            No orders yet.{" "}
            <Link to="/shop" className="text-gold hover:underline">
              Start shopping
            </Link>
            .
          </p>
        ) : (
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="text-left text-xs uppercase tracking-[0.16em] text-muted-foreground">
                <tr>
                  <th className="py-3">Order</th>
                  <th>Date</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th className="text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-t border-border/60">
                    <td className="py-3">
                      <Link to="/order/$number" params={{ number: o.order_number }} className="text-gold hover:underline">
                        {o.order_number}
                      </Link>
                    </td>
                    <td>{new Date(o.created_at).toLocaleDateString()}</td>
                    <td className="capitalize">{o.payment_method}</td>
                    <td className="capitalize">{o.status}</td>
                    <td className="text-right">{formatPrice(Number(o.total))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
