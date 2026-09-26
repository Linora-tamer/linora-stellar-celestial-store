import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  CheckCircle2,
  Clock,
  Package,
  Search,
  Truck,
  MessageCircle,
  MapPin,
  ShieldCheck,
  Sparkles,
  XCircle,
  ArrowRight,
} from "lucide-react";

import { Star } from "@/components/site/Star";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/lib/cart";
import { useI18n } from "@/lib/i18n";
import { CONTACT } from "@/lib/store";

type TrackSearch = { order?: string | undefined };

export const Route = createFileRoute("/track")({
  validateSearch: (search: Record<string, unknown>): TrackSearch => ({
    order: typeof search["order"] === "string" ? search["order"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Track Your Order — Linora Stellar" },
      {
        name: "description",
        content: "Track your Linora Stellar order status, delivery progress and verification.",
      },
      { property: "og:title", content: "Track Your Order — Linora Stellar" },
      { property: "og:description", content: "Live order tracking across Egypt." },
    ],
  }),
  component: TrackPage,
});

type TrackedOrder = {
  id: string;
  order_number: string;
  customer_name: string;
  email: string;
  phone: string;
  address?: string;
  governorate?: string;
  city?: string;
  status: string;
  total: number;
  payment_method: string;
  payment_reference?: string | null;
  created_at: string;
  items?: Array<{
    name: string;
    quantity: number;
    price: number;
    options?: Record<string, string>;
  }>;
};

function TrackPage() {
  const { order: urlOrderParam } = Route.useSearch();
  const [searchInput, setSearchInput] = useState(urlOrderParam || "");
  const [activeQuery, setActiveQuery] = useState(urlOrderParam || "");
  const { t, lang } = useI18n();
  const isAr = lang === "ar";

  useEffect(() => {
    if (urlOrderParam) {
      setSearchInput(urlOrderParam);
      setActiveQuery(urlOrderParam);
    }
  }, [urlOrderParam]);

  const {
    data: order,
    isLoading,
    isFetched,
  } = useQuery({
    queryKey: ["track_order", activeQuery],
    enabled: !!activeQuery.trim(),
    queryFn: async (): Promise<TrackedOrder | null> => {
      const q = activeQuery.trim().toUpperCase();
      const phoneQ = activeQuery.trim();

      // Check by order_number
      const { data: byOrder } = await supabase
        .from("orders")
        .select("*")
        .eq("order_number", q)
        .maybeSingle();

      if (byOrder) return byOrder as TrackedOrder;

      // Or check by phone
      const { data: byPhone } = await supabase
        .from("orders")
        .select("*")
        .eq("phone", phoneQ)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      return (byPhone as TrackedOrder) ?? null;
    },
  });

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!searchInput.trim()) return;
    setActiveQuery(searchInput.trim());
  }

  // Calculate timeline milestone indices
  // 1: pending, 2: confirmed, 3: preparing/packaging, 4: shipped, 5: delivered
  const statusStr = (order?.status || "").toLowerCase();
  const isCancelled = statusStr === "cancelled";

  let stepLevel = 1;
  if (statusStr === "confirmed") stepLevel = 2;
  else if (statusStr === "preparing") stepLevel = 3;
  else if (statusStr === "shipped") stepLevel = 4;
  else if (statusStr === "delivered") stepLevel = 5;

  const steps = [
    {
      num: 1,
      title: t("track.step1"),
      desc: t("track.step1Desc"),
      icon: Clock,
      done: stepLevel >= 1 && !isCancelled,
      current: stepLevel === 1 && !isCancelled,
    },
    {
      num: 2,
      title: t("track.step2"),
      desc: t("track.step2Desc"),
      icon: ShieldCheck,
      done: stepLevel >= 2 && !isCancelled,
      current: stepLevel === 2 && !isCancelled,
    },
    {
      num: 3,
      title: t("track.step3"),
      desc: t("track.step3Desc"),
      icon: Sparkles,
      done: stepLevel >= 3 && !isCancelled,
      current: stepLevel === 3 && !isCancelled,
    },
    {
      num: 4,
      title: t("track.step4"),
      desc: t("track.step4Desc"),
      icon: Truck,
      done: stepLevel >= 4 && !isCancelled,
      current: stepLevel === 4 && !isCancelled,
    },
    {
      num: 5,
      title: t("track.step5"),
      desc: t("track.step5Desc"),
      icon: Package,
      done: stepLevel >= 5 && !isCancelled,
      current: stepLevel === 5 && !isCancelled,
    },
  ];

  return (
    <div className="pb-24">
      {/* Header Banner */}
      <section className="starfield sky border-b border-border/60 py-16">
        <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
          <p className="flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-gold">
            <Star className="h-3 w-3" /> {t("track.badge")}
          </p>
          <h1 className="mt-4 font-display text-4xl sm:text-5xl">{t("track.title")}</h1>
          <p className="mt-3 max-w-xl text-sm text-muted-foreground leading-relaxed">
            {t("track.lead")}
          </p>

          {/* Search Box */}
          <form onSubmit={handleSearch} className="mt-8 flex max-w-lg gap-2">
            <div className="relative flex-1">
              <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={t("track.placeholder")}
                className="w-full rounded-full border border-border bg-card/80 ps-10 pe-4 py-3 text-sm font-mono text-foreground placeholder:font-sans placeholder:text-muted-foreground outline-none focus:border-gold transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !searchInput.trim()}
              className="rounded-full bg-primary px-7 py-3 text-xs uppercase tracking-[0.16em] text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-opacity font-medium"
            >
              {isLoading ? t("track.searching") : t("track.submit")}
            </button>
          </form>
        </div>
      </section>

      {/* Main Track Section */}
      <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        {isLoading && (
          <div className="py-20 text-center text-sm text-muted-foreground">
            <Clock className="mx-auto h-8 w-8 animate-spin text-gold/70 mb-3" />
            <p>{t("track.searching")}</p>
          </div>
        )}

        {!isLoading && isFetched && !order && (
          <div className="card-star rounded-2xl border border-border p-10 text-center max-w-lg mx-auto">
            <XCircle className="mx-auto h-12 w-12 text-rose-400 mb-3" />
            <h3 className="font-display text-xl">{t("track.notFound")}</h3>
            <p className="mt-2 text-xs text-muted-foreground">
              {isAr
                ? "تأكدي من كتابة رقم الطلب بصيغة LS-XXXXXX أو رقم هاتفك المستخدم عند الشراء."
                : "Make sure you entered the reference number formatted as LS-XXXXXX or the phone number used at checkout."}
            </p>
            <div className="mt-6">
              <a
                href={`${CONTACT.whatsappLink}?text=${encodeURIComponent(`Hi Nora! I need help tracking my Linora Stellar order #${searchInput}.`)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-gold px-6 py-2.5 text-xs uppercase tracking-[0.14em] text-gold hover:bg-gold/10"
              >
                <MessageCircle className="h-4 w-4" />
                <span>{t("track.whatsapp")}</span>
              </a>
            </div>
          </div>
        )}

        {!isLoading && order && (
          <div className="space-y-10">
            {/* Status Header Tile */}
            <div className="card-star rounded-2xl border border-border/80 p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">
                    {isAr ? "رقم الطلب" : "Order Reference"}
                  </span>
                  <p className="font-mono text-3xl font-bold text-gold tracking-wide mt-1">
                    {order.order_number}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {isAr ? "تم الطلب بتاريخ: " : "Placed on: "}
                    {new Date(order.created_at).toLocaleDateString(isAr ? "ar-EG" : "en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                <div className="text-end">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">
                    {isAr ? "إجمالي المبلغ" : "Total Amount"}
                  </span>
                  <p className="font-display text-3xl font-bold text-gold">
                    {formatPrice(Number(order.total), lang)}
                  </p>
                  <span className="inline-block mt-1 capitalize text-xs text-muted-foreground">
                    {order.payment_method.replace("_", " ")}
                  </span>
                </div>
              </div>
            </div>

            {/* Cancelled Banner */}
            {isCancelled && (
              <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 p-6 text-center">
                <XCircle className="mx-auto h-8 w-8 text-rose-400 mb-2" />
                <h3 className="font-display text-2xl text-rose-300">{t("track.stepCancelled")}</h3>
                <p className="mt-1 text-xs text-rose-200/80">
                  {isAr
                    ? "تم إلغاء هذا الطلب. إذا كان لديك استفسار يرجى مراسلتنا على واتساب."
                    : "This order has been cancelled. For inquiries, please reach out via WhatsApp."}
                </p>
              </div>
            )}

            {/* Visual Timeline Steps */}
            {!isCancelled && (
              <div className="card-star rounded-2xl border border-border/80 p-6 sm:p-8">
                <h2 className="font-display text-2xl mb-8 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-gold" />
                  <span>{t("track.timeline")}</span>
                </h2>

                <div className="relative">
                  {/* Progress Line */}
                  <div className="hidden sm:block absolute top-1/2 -translate-y-1/2 start-8 end-8 h-0.5 bg-border/80 -z-0">
                    <div
                      className="h-full bg-gold transition-all duration-700"
                      style={{
                        width: `${Math.min(100, Math.max(0, ((stepLevel - 1) / (steps.length - 1)) * 100))}%`,
                      }}
                    />
                  </div>

                  <div className="grid gap-6 sm:grid-cols-5 relative z-10">
                    {steps.map((step) => {
                      const Icon = step.icon;
                      return (
                        <div
                          key={step.num}
                          className="flex sm:flex-col items-center sm:text-center gap-4 sm:gap-3"
                        >
                          <div
                            className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all shrink-0 ${
                              step.done
                                ? "border-gold bg-gold text-black shadow-md shadow-gold/20"
                                : step.current
                                  ? "border-gold bg-card text-gold ring-4 ring-gold/20 animate-pulse"
                                  : "border-border bg-card/60 text-muted-foreground"
                            }`}
                          >
                            {step.done && step.num < stepLevel ? (
                              <CheckCircle2 className="h-6 w-6" />
                            ) : (
                              <Icon className="h-5 w-5" />
                            )}
                          </div>
                          <div>
                            <h4
                              className={`text-sm font-semibold transition-colors ${
                                step.done || step.current
                                  ? "text-foreground"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {step.title}
                            </h4>
                            <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                              {step.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Order Details & Summary Grid */}
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Delivery & Payment Info */}
              <div className="card-star rounded-2xl border border-border/80 p-6 sm:p-8 space-y-5">
                <h3 className="font-display text-xl flex items-center gap-2 border-b border-border/60 pb-3">
                  <MapPin className="h-5 w-5 text-gold" />
                  <span>{t("track.deliveryTo")}</span>
                </h3>

                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-muted-foreground block">
                      {isAr ? "الاسم" : "Recipient"}
                    </span>
                    <p className="font-medium text-foreground">{order.customer_name}</p>
                  </div>

                  <div>
                    <span className="text-xs uppercase tracking-wider text-muted-foreground block">
                      {isAr ? "رقم الهاتف" : "Phone"}
                    </span>
                    <p className="font-mono text-foreground">{order.phone}</p>
                  </div>

                  {order.address && (
                    <div>
                      <span className="text-xs uppercase tracking-wider text-muted-foreground block">
                        {isAr ? "العنوان" : "Address"}
                      </span>
                      <p className="text-foreground">
                        {order.address} {order.city && `, ${order.city}`}
                      </p>
                    </div>
                  )}

                  {order.governorate && (
                    <div>
                      <span className="text-xs uppercase tracking-wider text-muted-foreground block">
                        {isAr ? "المحافظة" : "Governorate"}
                      </span>
                      <p className="font-medium text-gold">{order.governorate}</p>
                    </div>
                  )}

                  <div className="pt-3 border-t border-border/60">
                    <span className="text-xs uppercase tracking-wider text-muted-foreground block">
                      {t("track.paymentInfo")}
                    </span>
                    <p className="capitalize font-medium text-foreground">
                      {order.payment_method.replace("_", " ")}
                    </p>
                    {order.payment_reference && (
                      <p className="mt-1 font-mono text-xs text-gold">
                        {t("track.transferRef")}: {order.payment_reference}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="card-star rounded-2xl border border-border/80 p-6 sm:p-8 space-y-5">
                <h3 className="font-display text-xl flex items-center gap-2 border-b border-border/60 pb-3">
                  <Package className="h-5 w-5 text-gold" />
                  <span>{t("track.items")}</span>
                </h3>

                {order.items && order.items.length > 0 ? (
                  <ul className="divide-y divide-border/60">
                    {order.items.map((item, idx) => (
                      <li
                        key={idx}
                        className="py-3 flex items-center justify-between gap-3 text-sm"
                      >
                        <div>
                          <p className="font-medium text-foreground">{item.name}</p>
                          <span className="text-xs text-muted-foreground">× {item.quantity}</span>
                          {item.options &&
                            Object.entries(item.options).map(([k, v]) => (
                              <p key={k} className="text-[11px] text-muted-foreground">
                                {k}: {v}
                              </p>
                            ))}
                        </div>
                        <span className="font-semibold text-gold shrink-0">
                          {formatPrice(item.price * item.quantity, lang)}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-muted-foreground italic">
                    {isAr ? "تم تسجيل المنتجات بالطلب." : "Custom celestial pieces included."}
                  </p>
                )}

                {/* Direct WhatsApp help link */}
                <div className="pt-4 border-t border-border/60 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs text-muted-foreground">{t("track.support")}</span>
                  <a
                    href={`${CONTACT.whatsappLink}?text=${encodeURIComponent(`Hi Nora! I'm following up on my order ${order.order_number}.`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-1.5 text-xs font-medium text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    <span>{t("track.whatsapp")}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
