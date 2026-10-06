import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Clock,
  Package,
  Truck,
  XCircle,
  MessageCircle,
  Plus,
  Trash2,
  Edit2,
  FolderOpen,
  ShoppingBag,
  Sparkles,
  RefreshCw,
  Bot,
  Inbox,
  Tag,
  LayoutDashboard,
  Save,
} from "lucide-react";
import { toast } from "sonner";

import { Star } from "@/components/site/Star";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { formatPrice } from "@/lib/cart";
import { categoriesQuery } from "@/lib/store";
import { generateAdminSummaryReport } from "@/lib/gemini";
import { productImage } from "@/lib/product-images";
import { uploadProductImage } from "@/lib/product-image-upload";

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

type TabType = "orders" | "custom_requests" | "categories" | "products" | "messages";

type OrderItem = {
  id: string;
  order_number: string;
  customer_name: string;
  email: string;
  phone: string;
  address?: string;
  governorate?: string;
  status: string;
  total: number;
  payment_method: string;
  payment_reference: string | null;
  payment_status?: string | null;
  created_at: string;
};

type CustomOrderItem = {
  id: string;
  name: string;
  email: string;
  phone: string;
  design_type: string;
  description: string;
  preferred_style?: string | null;
  preferred_colors?: string | null;
  budget?: string | null;
  deadline?: string | null;
  reference_url?: string | null;
  status: string;
  created_at: string;
};

type CategoryItem = {
  id: string;
  slug: string;
  name: string;
  name_ar?: string;
  description: string | null;
  description_ar?: string | null;
  sort_order: number;
};

function statusBadge(status: string) {
  const s = status.toLowerCase();
  if (s === "pending") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-400">
        <Clock className="h-3 w-3" /> Pending verification
      </span>
    );
  }
  if (s === "confirmed") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-blue-500/30 bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-400">
        <CheckCircle2 className="h-3 w-3" /> Confirmed
      </span>
    );
  }
  if (s === "shipped") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-purple-500/30 bg-purple-500/10 px-2.5 py-0.5 text-xs font-medium text-purple-400">
        <Truck className="h-3 w-3" /> Shipped
      </span>
    );
  }
  if (s === "delivered") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
        <Package className="h-3 w-3" /> Delivered
      </span>
    );
  }
  if (s === "cancelled") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/10 px-2.5 py-0.5 text-xs font-medium text-rose-400">
        <XCircle className="h-3 w-3" /> Cancelled
      </span>
    );
  }
  return <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs capitalize">{status}</span>;
}

function Admin() {
  const { user, loading, isOwner } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [currentTab, setCurrentTab] = useState<TabType>("orders");

  // Category editing state
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [catNameEn, setCatNameEn] = useState("");
  const [catNameAr, setCatNameAr] = useState("");
  const [catSlug, setCatSlug] = useState("");
  const [catDescEn, setCatDescEn] = useState("");
  const [catDescAr, setCatDescAr] = useState("");
  const [catOrder, setCatOrder] = useState<number>(1);

  // AI Smart Summary & Nora Email Notifications state
  const [aiReport, setAiReport] = useState<string>("");
  const [loadingAi, setLoadingAi] = useState<boolean>(false);

  useEffect(() => {
    if (!loading && !user && !isOwner) {
      navigate({ to: "/auth", replace: true });
    }
  }, [user, loading, isOwner, navigate]);

  const { data: orders = [], refetch: refetchOrders } = useQuery({
    queryKey: ["admin_orders"],
    enabled: isOwner,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as OrderItem[];
    },
  });

  const { data: requests = [], refetch: refetchRequests } = useQuery({
    queryKey: ["admin_custom_orders"],
    enabled: isOwner,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("custom_orders")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as CustomOrderItem[];
    },
  });

  const { data: categories = [], refetch: refetchCategories } = useQuery({
    ...categoriesQuery,
    enabled: isOwner,
  });

  async function updateOrderStatus(orderId: string, newStatus: string) {
    const { error } = await supabase.from("orders").update({ status: newStatus }).eq("id", orderId);

    if (error) {
      toast.error("Failed to update order status");
      return;
    }
    toast.success(`Order status updated to ${newStatus}`);
    refetchOrders();
  }

  async function markOrderPaid(orderId: string) {
    const { error } = await supabase
      .from("orders")
      .update({ payment_status: "paid", paid_at: new Date().toISOString() })
      .eq("id", orderId);
    if (error) {
      toast.error("Failed to mark order as paid");
      return;
    }
    toast.success("Order marked as paid");
    refetchOrders();
  }

  async function updateCustomOrderStatus(requestId: string, newStatus: string) {
    const { error } = await supabase
      .from("custom_orders")
      .update({ status: newStatus })
      .eq("id", requestId);

    if (error) {
      toast.error("Failed to update request status");
      return;
    }
    toast.success(`Request status updated to ${newStatus}`);
    refetchRequests();
  }

  function startCreateCategory() {
    setEditingCategory(null);
    setCatNameEn("");
    setCatNameAr("");
    setCatSlug("");
    setCatDescEn("");
    setCatDescAr("");
    setCatOrder(categories.length + 1);
    setIsCreatingCategory(true);
  }

  function startEditCategory(c: CategoryItem) {
    setIsCreatingCategory(false);
    setEditingCategory(c);
    setCatNameEn(c.name ?? "");
    setCatNameAr(c.name_ar ?? "");
    setCatSlug(c.slug ?? "");
    setCatDescEn(c.description ?? "");
    setCatDescAr(c.description_ar ?? "");
    setCatOrder(c.sort_order ?? 1);
  }

  async function saveCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!catNameEn.trim() || !catSlug.trim()) {
      toast.error("Name and slug are required");
      return;
    }

    const payload = {
      name: catNameEn.trim(),
      name_ar: catNameAr.trim() || null,
      slug: catSlug.trim().toLowerCase(),
      description: catDescEn.trim() || null,
      description_ar: catDescAr.trim() || null,
      sort_order: Number(catOrder) || 1,
    };

    if (editingCategory) {
      const { error } = await supabase
        .from("categories")
        .update(payload)
        .eq("id", editingCategory.id);
      if (error) {
        toast.error("Failed to update category");
        return;
      }
      toast.success("Category updated");
    } else {
      const { error } = await supabase.from("categories").insert(payload);
      if (error) {
        toast.error("Failed to add category");
        return;
      }
      toast.success("Category created");
    }

    setEditingCategory(null);
    setIsCreatingCategory(false);
    refetchCategories();
    queryClient.invalidateQueries({ queryKey: ["categories"] });
  }

  async function deleteCategory(id: string) {
    if (!confirm("Are you sure you want to delete this category?")) return;
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete category");
      return;
    }
    toast.success("Category deleted");
    refetchCategories();
    queryClient.invalidateQueries({ queryKey: ["categories"] });
  }

  async function refreshAiReport() {
    setLoadingAi(true);
    try {
      const text = await generateAdminSummaryReport(
        {
          orderCount: orders.length,
          pendingOrders: pendingOrdersCount,
          totalRevenue,
          customRequests: requests.length,
        },
        "en",
      );
      setAiReport(text);
    } catch {
      // ignore
    } finally {
      setLoadingAi(false);
    }
  }

  useEffect(() => {
    refreshAiReport();
  }, [orders.length, requests.length]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-sm text-muted-foreground">Loading…</div>
    );
  }

  if (!isOwner) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="font-display text-3xl">Owner access required</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          This area is reserved for Nora Tamer (Linora Stellar).
        </p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
        >
          Go to Storefront
        </Link>
      </div>
    );
  }

  const pendingOrdersCount = orders.filter((o) => o.status === "pending").length;
  const totalRevenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + Number(o.total || 0), 0);

  return (
    <div className="pb-24">
      <section className="starfield sky border-b border-border/60 py-12">
        <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-gold">
                <Star className="h-3 w-3" /> Linora Stellar Control Panel
              </p>
              <h1 className="mt-3 font-display text-4xl sm:text-5xl">Store Dashboard</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Manage Egyptian customer orders, verify Vodafone Cash / InstaPay transfers, track
                custom design requests, and update catalog categories.
              </p>
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 rounded-full border border-gold/50 px-5 py-2 text-xs uppercase tracking-[0.16em] text-gold hover:bg-gold/10"
            >
              <ShoppingBag className="h-3.5 w-3.5" /> View Storefront
            </Link>
          </div>

          {/* Quick metric tiles */}
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="card-star rounded-xl p-4">
              <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                Total Orders
              </span>
              <p className="mt-1 font-display text-3xl text-foreground">{orders.length}</p>
            </div>
            <div className="card-star rounded-xl p-4">
              <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                Pending Verification
              </span>
              <p className="mt-1 font-display text-3xl text-amber-400">{pendingOrdersCount}</p>
            </div>
            <div className="card-star rounded-xl p-4">
              <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                Gross Sales
              </span>
              <p className="mt-1 font-display text-3xl text-gold">{formatPrice(totalRevenue)}</p>
            </div>
          </div>

          {/* AI-Generated Summary Report & Instant Email Notifications System (Nora Tamer) */}
          <div className="mt-8 rounded-2xl border border-gold/40 bg-surface/85 p-6 shadow-xl backdrop-blur-md">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/70 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold/15 text-gold">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-lg text-foreground flex items-center gap-2">
                    <span>AI Business Intelligence & Pulse Report</span>
                    <span className="rounded-full bg-gold/20 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-gold font-semibold">
                      Gemini Flash
                    </span>
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Tailored insights & operational suggestions for Nora Tamer (Owner)
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={refreshAiReport}
                  disabled={loadingAi}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3.5 py-1.5 text-xs text-muted-foreground hover:border-gold hover:text-gold transition-colors font-medium disabled:opacity-50"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${loadingAi ? "animate-spin" : ""}`} />
                  <span>{loadingAi ? "Analyzing Data…" : "Regenerate AI Report"}</span>
                </button>
              </div>
            </div>

            {/* AI Report Content */}
            <div className="mt-4 rounded-xl border border-border/60 bg-background/50 p-4 text-xs leading-relaxed text-foreground font-sans">
              {loadingAi ? (
                <div className="flex items-center gap-2 text-muted-foreground py-2">
                  <Sparkles className="h-4 w-4 text-gold animate-spin" />
                  <span>Generating smart summary of your weekly orders and demand trends…</span>
                </div>
              ) : aiReport ? (
                <div className="space-y-2 whitespace-pre-line">{aiReport}</div>
              ) : (
                <p className="text-muted-foreground">Press “Regenerate AI Report” to get a summary of your orders (needs a Gemini API key).</p>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 lg:flex-row lg:px-8">
        <aside
          aria-label="Dashboard menu"
          className="flex shrink-0 gap-1 overflow-x-auto rounded-2xl border border-gold/30 bg-surface/85 p-2 backdrop-blur-md lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:w-64 lg:flex-col lg:self-start lg:overflow-y-auto lg:p-3"
        >
          <p className="hidden items-center gap-2 px-3 pb-2 pt-1 text-[11px] uppercase tracking-[0.25em] text-gold lg:flex">
            <LayoutDashboard className="h-3.5 w-3.5" /> Menu
          </p>
          {(
            [
              { id: "orders", label: "Orders & Payments", icon: Package, badge: pendingOrdersCount },
              { id: "custom_requests", label: "Custom Requests", icon: Sparkles, badge: requests.length },
              { id: "products", label: "Products & Prices", icon: Tag, badge: 0 },
              { id: "categories", label: "Categories", icon: FolderOpen, badge: categories.length },
              { id: "messages", label: "Messages", icon: Inbox, badge: 0 },
            ] as const
          ).map((item) => {
            const Icon = item.icon;
            const active = currentTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setCurrentTab(item.id)}
                aria-current={active ? "page" : undefined}
                className={`flex shrink-0 items-center gap-3 whitespace-nowrap rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-gold/15 text-gold"
                    : "text-muted-foreground hover:bg-card hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge > 0 && (
                  <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-xs text-amber-400">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
          <Link
            to="/shop"
            className="mt-1 flex shrink-0 items-center gap-3 whitespace-nowrap rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:bg-card hover:text-foreground lg:mt-3 lg:border-t lg:border-border/60"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>View Storefront</span>
          </Link>
        </aside>

        <div className="min-w-0 flex-1">

      {/* Tab 1: Orders & Payment Verification */}
      {currentTab === "orders" && (
        <section className="py-2">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl">Customer Orders ({orders.length})</h2>
          </div>

          {orders.length === 0 ? (
            <div className="mt-6 rounded-xl border border-border p-10 text-center text-muted-foreground">
              No orders placed yet. As customers check out, their orders and transfer references
              will appear here.
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {orders.map((o) => {
                const cleanPhone = (o.phone || "").replace(/\D/g, "");
                const waNumber = cleanPhone.startsWith("0") ? `2${cleanPhone}` : cleanPhone;
                const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(
                  `Hi ${o.customer_name}! Nora here from Linora Stellar regarding your order ${o.order_number}.`,
                )}`;

                return (
                  <div
                    key={o.id}
                    className="card-star rounded-xl border border-border p-5 transition-all hover:border-gold/40"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-base font-bold text-gold">
                            {o.order_number}
                          </span>
                          {statusBadge(o.status)}
                          {o.payment_status === "paid" ? (
                            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                              Paid
                            </span>
                          ) : o.payment_status === "pending" ? (
                            <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-400">
                              Card payment pending
                            </span>
                          ) : o.payment_status === "failed" ? (
                            <span className="rounded-full border border-rose-500/30 bg-rose-500/10 px-2.5 py-0.5 text-xs font-medium text-rose-400">
                              Payment failed
                            </span>
                          ) : (
                            <span className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground">
                              Unpaid
                            </span>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {new Date(o.created_at).toLocaleDateString()} at{" "}
                            {new Date(o.created_at).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <h3 className="mt-2 text-lg font-medium text-foreground">
                          {o.customer_name}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {o.email} • {o.phone}
                        </p>
                        {o.address && (
                          <p className="mt-1 text-xs text-muted-foreground">
                            📍 {o.address} {o.governorate && `(${o.governorate})`}
                          </p>
                        )}
                      </div>

                      <div className="text-right">
                        <span className="text-xs uppercase tracking-wider text-muted-foreground">
                          Total
                        </span>
                        <p className="font-display text-2xl text-gold">
                          {formatPrice(Number(o.total))}
                        </p>
                        <p className="mt-1 text-xs capitalize text-muted-foreground">
                          Method: {o.payment_method.replace("_", " ")}
                        </p>
                      </div>
                    </div>

                    {/* Payment Reference & Actions Bar */}
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs uppercase tracking-wider text-muted-foreground">
                          Payment Reference:
                        </span>
                        {o.payment_reference ? (
                          <span className="rounded-md border border-gold/40 bg-gold/10 px-2.5 py-1 font-mono text-xs font-semibold text-gold">
                            {o.payment_reference}
                          </span>
                        ) : (
                          <span className="text-xs italic text-muted-foreground">
                            No reference supplied (COD or Direct)
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {o.phone && (
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400 hover:bg-emerald-500/20"
                          >
                            <MessageCircle className="h-3.5 w-3.5" />
                            <span>WhatsApp</span>
                          </a>
                        )}

                        {o.payment_method !== "card" &&
                          o.payment_method !== "cod" &&
                          o.payment_status !== "paid" && (
                            <button
                              type="button"
                              onClick={() => markOrderPaid(o.id)}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-gold/50 bg-gold/10 px-3 py-1.5 text-xs font-medium text-gold hover:bg-gold/20"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              <span>Mark paid</span>
                            </button>
                          )}

                        {o.status === "pending" && (
                          <button
                            type="button"
                            onClick={() => updateOrderStatus(o.id, "confirmed")}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-500"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>Verify & Confirm</span>
                          </button>
                        )}

                        {o.status === "confirmed" && (
                          <button
                            type="button"
                            onClick={() => updateOrderStatus(o.id, "shipped")}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-purple-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-purple-500"
                          >
                            <Truck className="h-3.5 w-3.5" />
                            <span>Mark Shipped</span>
                          </button>
                        )}

                        {o.status === "shipped" && (
                          <button
                            type="button"
                            onClick={() => updateOrderStatus(o.id, "delivered")}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-600"
                          >
                            <Package className="h-3.5 w-3.5" />
                            <span>Mark Delivered</span>
                          </button>
                        )}

                        <select
                          value={o.status}
                          onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                          className="rounded-lg border border-input bg-background px-2.5 py-1 text-xs text-foreground outline-none focus:border-gold"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* Tab 2: Custom Design Requests */}
      {currentTab === "custom_requests" && (
        <section className="py-2">
          <h2 className="font-display text-2xl">Custom Requests ({requests.length})</h2>

          {requests.length === 0 ? (
            <div className="mt-6 rounded-xl border border-border p-10 text-center text-muted-foreground">
              No custom design requests yet.
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {requests.map((r) => {
                const cleanPhone = (r.phone || "").replace(/\D/g, "");
                const waNumber = cleanPhone.startsWith("0") ? `2${cleanPhone}` : cleanPhone;
                const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(
                  `Hi ${r.name}! Nora from Linora Stellar here regarding your custom design request for "${r.design_type}".`,
                )}`;

                return (
                  <div key={r.id} className="card-star rounded-xl border border-border p-5">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="font-display text-xl font-medium">{r.name}</h3>
                          <span className="rounded-full bg-gold/10 px-2.5 py-0.5 text-xs text-gold">
                            {r.design_type}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(r.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {r.email} • {r.phone}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        {r.phone && (
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400 hover:bg-emerald-500/20"
                          >
                            <MessageCircle className="h-3.5 w-3.5" />
                            <span>Chat on WhatsApp</span>
                          </a>
                        )}

                        <select
                          value={r.status}
                          onChange={(e) => updateCustomOrderStatus(r.id, e.target.value)}
                          className="rounded-lg border border-input bg-background px-2.5 py-1 text-xs text-foreground outline-none focus:border-gold"
                        >
                          <option value="pending">Pending</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="declined">Declined</option>
                        </select>
                      </div>
                    </div>

                    <div className="mt-4 rounded-lg bg-background/50 p-4 text-sm text-foreground">
                      <p className="font-medium text-xs uppercase tracking-wider text-gold mb-1">
                        Brief & Description:
                      </p>
                      <p className="whitespace-pre-wrap leading-relaxed">{r.description}</p>
                    </div>

                    {(r.preferred_style ||
                      r.preferred_colors ||
                      r.budget ||
                      r.deadline ||
                      r.reference_url) && (
                      <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
                        {r.preferred_style && <span>🎨 Style: {r.preferred_style}</span>}
                        {r.preferred_colors && <span>🖌 Colors: {r.preferred_colors}</span>}
                        {r.budget && <span>💰 Budget: {r.budget}</span>}
                        {r.deadline && <span>📅 Deadline: {r.deadline}</span>}
                        {r.reference_url && (
                          <a
                            href={r.reference_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-gold underline"
                          >
                            🔗 Inspiration Link
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* Tab 3: Category Management */}
      {currentTab === "categories" && (
        <section className="py-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl">Store Categories ({categories.length})</h2>
              <p className="text-xs text-muted-foreground mt-1">
                Add, rename, reorder, or archive storefront categories without writing code.
              </p>
            </div>
            {!isCreatingCategory && !editingCategory && (
              <button
                type="button"
                onClick={startCreateCategory}
                className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs uppercase tracking-[0.16em] text-primary-foreground hover:opacity-90"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Category</span>
              </button>
            )}
          </div>

          {(isCreatingCategory || editingCategory) && (
            <form
              onSubmit={saveCategory}
              className="mt-6 card-star space-y-4 rounded-xl border border-gold/40 p-6"
            >
              <h3 className="font-display text-xl text-gold">
                {editingCategory ? "Edit Category" : "New Category"}
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs uppercase tracking-wider text-muted-foreground">
                    Name (English) *
                  </label>
                  <input
                    value={catNameEn}
                    onChange={(e) => setCatNameEn(e.target.value)}
                    required
                    placeholder="e.g. Wedding Stationery"
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-muted-foreground">
                    Name (Arabic)
                  </label>
                  <input
                    value={catNameAr}
                    onChange={(e) => setCatNameAr(e.target.value)}
                    placeholder="مثال: دعوات وأدوات الزفاف"
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-muted-foreground">
                    URL Slug *
                  </label>
                  <input
                    value={catSlug}
                    onChange={(e) => setCatSlug(e.target.value)}
                    required
                    placeholder="e.g. wedding-stationery"
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-muted-foreground">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={catOrder}
                    onChange={(e) => setCatOrder(Number(e.target.value))}
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-muted-foreground">
                    Description (English)
                  </label>
                  <textarea
                    value={catDescEn}
                    onChange={(e) => setCatDescEn(e.target.value)}
                    rows={2}
                    placeholder="Short description for storefront filter"
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-muted-foreground">
                    Description (Arabic)
                  </label>
                  <textarea
                    value={catDescAr}
                    onChange={(e) => setCatDescAr(e.target.value)}
                    rows={2}
                    placeholder="وصف مختصر للقسم يظهر بالمتجر"
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreatingCategory(false);
                    setEditingCategory(null);
                  }}
                  className="rounded-md border border-border px-4 py-2 text-xs uppercase tracking-wider hover:bg-card"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-primary px-5 py-2 text-xs uppercase tracking-wider text-primary-foreground hover:opacity-90"
                >
                  Save Category
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => (
              <div
                key={c.id}
                className="card-star rounded-xl border border-border p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-gold">#{c.sort_order}</span>
                    <span className="font-mono text-xs text-muted-foreground">{c.slug}</span>
                  </div>
                  <h3 className="mt-2 text-lg font-medium text-foreground">{c.name}</h3>
                  {c.name_ar && <p className="text-sm text-gold font-serif mt-0.5">{c.name_ar}</p>}
                  {c.description && (
                    <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
                      {c.description}
                    </p>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-end gap-2 border-t border-border/60 pt-3">
                  <button
                    type="button"
                    onClick={() => startEditCategory(c)}
                    className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1 text-xs hover:border-gold hover:text-gold"
                  >
                    <Edit2 className="h-3 w-3" />
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteCategory(c.id)}
                    className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1 text-xs text-rose-400 hover:border-rose-400"
                  >
                    <Trash2 className="h-3 w-3" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {currentTab === "products" && <ProductsPanel />}
      {currentTab === "messages" && <MessagesPanel />}
        </div>
      </div>
    </div>
  );
}

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  price: number;
  image_url: string | null;
  is_active: boolean | null;
  is_featured: boolean | null;
};

const slugify = (v: string) =>
  v
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

function ProductsPanel() {
  const queryClient = useQueryClient();
  const { data: categories = [] } = useQuery(categoriesQuery);
  const { data: products = [], refetch } = useQuery({
    queryKey: ["admin_products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id,name,slug,price,image_url,is_active,is_featured")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as ProductRow[];
    },
  });
  const [edits, setEdits] = useState<Record<string, Partial<ProductRow>>>({});
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  // "Add product" form
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState("");
  const [newNameAr, setNewNameAr] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newPrice, setNewPrice] = useState(0);
  const [newCategory, setNewCategory] = useState("");
  const [newImage, setNewImage] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  function refreshAll() {
    refetch();
    queryClient.invalidateQueries({ queryKey: ["products"] });
  }

  async function save(id: string) {
    const patch = edits[id];
    if (!patch) return;
    const { error } = await supabase.from("products").update(patch).eq("id", id);
    if (error) {
      toast.error("Failed to save product");
      return;
    }
    toast.success("Product saved");
    setEdits((e) => {
      const { [id]: _removed, ...rest } = e;
      return rest;
    });
    refreshAll();
  }

  async function changeImage(id: string, file: File | undefined) {
    if (!file) return;
    setUploadingId(id);
    try {
      const url = await uploadProductImage(file);
      const { error } = await supabase.from("products").update({ image_url: url }).eq("id", id);
      if (error) throw new Error(error.message);
      toast.success("Image updated");
      refreshAll();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Image upload failed");
    } finally {
      setUploadingId(null);
    }
  }

  async function pickNewImage(file: File | undefined) {
    if (!file) return;
    try {
      setNewImage(await uploadProductImage(file));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Image upload failed");
    }
  }

  async function createProduct(e: React.FormEvent) {
    e.preventDefault();
    const slug = slugify(newName);
    if (!newName.trim() || !slug) {
      toast.error("Enter a product name (English letters or numbers for the link).");
      return;
    }
    if (products.some((p) => p.slug === slug)) {
      toast.error("A product with this name already exists.");
      return;
    }
    setCreating(true);
    const { error } = await supabase.from("products").insert({
      slug,
      name: newName.trim(),
      name_ar: newNameAr.trim() || null,
      description: newDesc.trim() || null,
      price: Number.isFinite(newPrice) && newPrice >= 0 ? newPrice : 0,
      category_id: newCategory || null,
      image_url: newImage,
      is_active: true,
      is_featured: false,
      sort_order: products.length + 1,
    });
    setCreating(false);
    if (error) {
      toast.error("Failed to create product");
      return;
    }
    toast.success("Product created");
    setNewName("");
    setNewNameAr("");
    setNewDesc("");
    setNewPrice(0);
    setNewCategory("");
    setNewImage(null);
    setShowNew(false);
    refreshAll();
  }

  const inputCls =
    "w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground";

  return (
    <section className="py-2">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-2xl">Products & Prices ({products.length})</h2>
        <button
          type="button"
          onClick={() => setShowNew((v) => !v)}
          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs text-primary-foreground"
        >
          <Plus className="h-3.5 w-3.5" /> {showNew ? "Close" : "Add product"}
        </button>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        Change prices and photos, hide products from the shop, or mark them as featured.
      </p>

      {showNew && (
        <form onSubmit={createProduct} className="card-star mt-5 space-y-3 rounded-xl p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              className={inputCls}
              placeholder="Name (English)"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              maxLength={120}
              required
            />
            <input
              className={inputCls}
              placeholder="الاسم بالعربية (اختياري)"
              value={newNameAr}
              onChange={(e) => setNewNameAr(e.target.value)}
              maxLength={120}
            />
            <input
              className={inputCls}
              type="number"
              min={0}
              placeholder="Price (EGP)"
              value={newPrice}
              onChange={(e) => setNewPrice(Number(e.target.value))}
            />
            <select
              className={inputCls}
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            >
              <option value="">No category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <textarea
            className={inputCls}
            rows={3}
            placeholder="Description"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            maxLength={2000}
          />
          <div className="flex flex-wrap items-center gap-3">
            {newImage && (
              <img src={newImage} alt="" className="h-16 w-16 rounded-lg border border-border object-cover" />
            )}
            <label className="cursor-pointer rounded-full border border-border px-3.5 py-1.5 text-xs hover:border-gold">
              {newImage ? "Change image" : "Upload image"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => pickNewImage(e.target.files?.[0])}
              />
            </label>
            <button
              type="submit"
              disabled={creating}
              className="ms-auto inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs text-primary-foreground disabled:opacity-50"
            >
              <Save className="h-3.5 w-3.5" /> {creating ? "Saving…" : "Create product"}
            </button>
          </div>
        </form>
      )}

      <div className="mt-6 space-y-3">
        {products.map((p) => {
          const e = edits[p.id] ?? {};
          const price = e.price ?? p.price;
          const active = e.is_active ?? p.is_active ?? true;
          const featured = e.is_featured ?? p.is_featured ?? false;
          const set = (patch: Partial<ProductRow>) =>
            setEdits((prev) => ({ ...prev, [p.id]: { ...prev[p.id], ...patch } }));
          return (
            <div key={p.id} className="card-star flex flex-wrap items-center gap-3 rounded-xl p-4">
              <img
                src={productImage(p.slug, p.image_url)}
                alt=""
                className="h-14 w-14 shrink-0 rounded-lg border border-border object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{p.name}</p>
                <p className="truncate text-xs text-muted-foreground">/{p.slug}</p>
              </div>
              <label className="cursor-pointer rounded-full border border-border px-3 py-1.5 text-xs hover:border-gold">
                {uploadingId === p.id ? "Uploading…" : "Change image"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploadingId === p.id}
                  onChange={(ev) => {
                    changeImage(p.id, ev.target.files?.[0]);
                    ev.target.value = "";
                  }}
                />
              </label>
              <label className="flex items-center gap-2 text-xs text-muted-foreground">
                Price
                <input
                  type="number"
                  min={0}
                  value={price}
                  onChange={(ev) => set({ price: Number(ev.target.value) })}
                  className="w-24 rounded-md border border-border bg-background px-2 py-1 text-sm text-foreground"
                />
              </label>
              <label className="flex items-center gap-1.5 text-xs">
                <input
                  type="checkbox"
                  checked={active}
                  onChange={(ev) => set({ is_active: ev.target.checked })}
                />
                Visible
              </label>
              <label className="flex items-center gap-1.5 text-xs">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(ev) => set({ is_featured: ev.target.checked })}
                />
                Featured
              </label>
              <button
                type="button"
                disabled={!edits[p.id]}
                onClick={() => save(p.id)}
                className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-1.5 text-xs text-primary-foreground disabled:opacity-40"
              >
                <Save className="h-3.5 w-3.5" /> Save
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}

type MessageRow = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  created_at: string;
};

function MessagesPanel() {
  const { data: messages = [] } = useQuery({
    queryKey: ["admin_messages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as MessageRow[];
    },
  });
  return (
    <section className="py-2">
      <h2 className="font-display text-2xl">Messages ({messages.length})</h2>
      <div className="mt-6 space-y-3">
        {messages.length === 0 && (
          <p className="text-sm text-muted-foreground">No messages yet.</p>
        )}
        {messages.map((m) => (
          <div key={m.id} className="card-star rounded-xl p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-medium">{m.name}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(m.created_at).toLocaleString()}
              </p>
            </div>
            <a href={`mailto:${m.email}`} className="text-xs text-gold hover:underline">
              {m.email}
            </a>
            {m.subject && <p className="mt-2 text-sm font-medium">{m.subject}</p>}
            <p className="mt-1 whitespace-pre-line text-sm text-muted-foreground">{m.message}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
