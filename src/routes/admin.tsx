import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { Star } from "@/components/site/Star";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { formatPrice } from "@/lib/cart";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Dashboard — Linora Stellar" },
      { name: "description", content: "Owner dashboard for Linora Stellar orders and requests." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Dashboard — Linora Stellar" },
      { property: "og:description", content: "Owner dashboard for Linora Stellar." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Admin,
});

function Admin() {
  const { user, loading, isOwner } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth", replace: true });
  }, [user, loading, navigate]);

  const { data: orders = [] } = useQuery({
    queryKey: ["admin_orders"],
    enabled: !!user && isOwner,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("id, order_number, customer_name, status, total, payment_method, payment_reference, created_at")
        .order("created_at", { ascending: false })
        .limit(25);
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: requests = [] } = useQuery({
    queryKey: ["admin_custom_orders"],
    enabled: !!user && isOwner,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("custom_orders")
        .select("id, name, design_type, status, created_at")
        .order("created_at", { ascending: false })
        .limit(25);
      if (error) throw error;
      return data ?? [];
    },
  });

  if (loading || !user) {
    return <div className="mx-auto max-w-7xl px-4 py-20 text-sm text-muted-foreground">Loading…</div>;
  }

  if (!isOwner) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="font-display text-3xl">Owner only</h1>
        <p className="mt-3 text-sm text-muted-foreground">This area is for the Linora Stellar owner.</p>
        <Link to="/" className="mt-6 inline-block rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground">
          Go home
        </Link>
      </div>
    );
  }

  return (
    <div>
      <section className="starfield sky border-b border-border/60 py-14">
        <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
          <p className="flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-gold">
            <Star className="h-3 w-3" /> Owner
          </p>
          <h1 className="mt-4 font-display text-4xl">Dashboard</h1>
          <p className="mt-3 max-w-xl text-sm text-muted-foreground">
            Latest orders and custom design requests. Product, category, collection and portfolio
            management arrive in the next stage.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <h2 className="font-display text-2xl">Recent orders</h2>
        {orders.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">No orders yet.</p>
        ) : (
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="text-left text-xs uppercase tracking-[0.16em] text-muted-foreground">
                <tr>
                  <th className="py-3">Order</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Payment</th>
                  <th>Reference</th>
                  <th>Status</th>
                  <th className="text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-t border-border/60">
                    <td className="py-3">{o.order_number}</td>
                    <td>{o.customer_name}</td>
                    <td>{new Date(o.created_at).toLocaleDateString()}</td>
                    <td className="capitalize">{o.payment_method}</td>
                    <td>{o.payment_reference ?? "—"}</td>
                    <td className="capitalize">{o.status}</td>
                    <td className="text-right">{formatPrice(Number(o.total))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 lg:px-8">
        <h2 className="font-display text-2xl">Custom design requests</h2>
        {requests.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">No requests yet.</p>
        ) : (
          <ul className="mt-5 space-y-3">
            {requests.map((r) => (
              <li key={r.id} className="card-star flex flex-wrap items-center gap-3 rounded-xl px-4 py-3 text-sm">
                <span className="font-medium">{r.name}</span>
                <span className="text-muted-foreground">{r.design_type}</span>
                <span className="ml-auto capitalize text-gold">{r.status}</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(r.created_at).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
