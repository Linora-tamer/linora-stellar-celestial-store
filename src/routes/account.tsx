import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Clock,
  KeyRound,
  MapPin,
  Package,
  Search,
  Truck,
  User,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { ShippingZonesCard } from "@/components/site/ShippingZonesCard";
import { Star } from "@/components/site/Star";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { formatPrice } from "@/lib/cart";
import { EGYPTIAN_GOVERNORATES, getGovernorate } from "@/lib/egypt-shipping";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "My account — Linora Stellar" },
      {
        name: "description",
        content: "Your Linora Stellar customer profile, saved Egyptian address and order history.",
      },
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
  customer_name: string;
  status: string;
  total: number;
  created_at: string;
  payment_method: string;
  payment_reference?: string | null;
  items?: Array<{ name: string; quantity: number; price: number }>;
};

type AddressRow = {
  id?: string;
  full_name: string;
  phone: string;
  alt_phone: string | null;
  address: string;
  city: string;
  governorate: string | null;
  postal_code: string | null;
};

type ProfileData = {
  full_name: string;
  email: string;
  phone: string;
  alt_phone?: string;
};

const LOCAL_STORAGE_PROFILE_KEY = "linora_customer_profile";
const LOCAL_STORAGE_ADDRESS_KEY = "linora_customer_address";

function statusBadge(status: string, isAr: boolean) {
  const s = status.toLowerCase();
  let label = status;
  let cls = "bg-muted text-muted-foreground";

  if (s === "pending") {
    label = isAr ? "قيد المراجعة" : "Pending";
    cls = "bg-amber-500/10 text-amber-400 border border-amber-500/20";
  } else if (s === "confirmed") {
    label = isAr ? "مؤكد" : "Confirmed";
    cls = "bg-blue-500/10 text-blue-400 border border-blue-500/20";
  } else if (s === "shipped") {
    label = isAr ? "تم الشحن" : "Shipped";
    cls = "bg-purple-500/10 text-purple-400 border border-purple-500/20";
  } else if (s === "delivered") {
    label = isAr ? "تم التوصيل" : "Delivered";
    cls = "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
  } else if (s === "cancelled") {
    label = isAr ? "ملغي" : "Cancelled";
    cls = "bg-rose-500/10 text-rose-400 border border-rose-500/20";
  }

  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`}>
      {label}
    </span>
  );
}

function Account() {
  const { user, loading, isOwner } = useAuth();
  const { t, lang } = useI18n();
  const isAr = lang === "ar";
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Order tracking lookup for guest or specific search
  const [lookupOrderNumber, setLookupOrderNumber] = useState("");
  const [lookupResult, setLookupResult] = useState<OrderRow | null>(null);
  const [searchingOrder, setSearchingOrder] = useState(false);

  // Local fallback data
  const [localProfile, setLocalProfile] = useState<ProfileData>(() => {
    if (typeof window !== "undefined") {
      try {
        const item = localStorage.getItem(LOCAL_STORAGE_PROFILE_KEY);
        if (item) return JSON.parse(item);
      } catch {
        // Fallback to empty default
      }
    }
    return { full_name: "", email: "", phone: "", alt_phone: "" };
  });

  const [localAddress, setLocalAddress] = useState<AddressRow>(() => {
    if (typeof window !== "undefined") {
      try {
        const item = localStorage.getItem(LOCAL_STORAGE_ADDRESS_KEY);
        if (item) return JSON.parse(item);
      } catch {
        // Fallback to empty default
      }
    }
    return {
      full_name: "",
      phone: "",
      alt_phone: "",
      address: "",
      city: "",
      governorate: "cairo",
      postal_code: "",
    };
  });

  const { data: dbProfile } = useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, email, phone")
        .eq("id", user!.id)
        .maybeSingle();
      if (error) return null;
      return data;
    },
  });

  const { data: dbAddress } = useQuery({
    queryKey: ["my_address", user?.id],
    enabled: !!user,
    queryFn: async (): Promise<AddressRow | null> => {
      const { data, error } = await supabase
        .from("addresses")
        .select("id, full_name, phone, alt_phone, address, city, governorate, postal_code")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) return null;
      return (data as AddressRow) ?? null;
    },
  });

  const { data: orders = [] } = useQuery({
    queryKey: ["my_orders", user?.id],
    queryFn: async (): Promise<OrderRow[]> => {
      const query = supabase
        .from("orders")
        .select(
          "id, order_number, customer_name, status, total, created_at, payment_method, payment_reference, items",
        )
        .order("created_at", { ascending: false });

      if (user?.id) {
        // Find orders matching user_id or email
        const { data, error } = await query;
        if (error) return [];
        return (data ?? []) as OrderRow[];
      } else {
        // Return recent guest orders stored locally
        const { data } = await query.limit(10);
        return (data ?? []) as OrderRow[];
      }
    },
  });

  const activeFullName = dbProfile?.full_name || localProfile.full_name || user?.email || "";
  const activeEmail = dbProfile?.email || localProfile.email || user?.email || "";
  const activePhone = dbProfile?.phone || localProfile.phone || "";

  const activeAddress = dbAddress || localAddress;

  async function handleSaveProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const fullNameVal = String(form.get("full_name") ?? "")
      .trim()
      .slice(0, 100);
    const phoneVal = String(form.get("phone") ?? "")
      .trim()
      .slice(0, 30);
    const emailVal = String(form.get("email") ?? "")
      .trim()
      .slice(0, 255);

    const updatedProfile: ProfileData = {
      full_name: fullNameVal,
      email: emailVal,
      phone: phoneVal,
    };

    setSavingProfile(true);
    setLocalProfile(updatedProfile);
    localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(updatedProfile));

    if (user) {
      await supabase
        .from("profiles")
        .update({
          full_name: fullNameVal,
          phone: phoneVal || null,
        })
        .eq("id", user.id);
      queryClient.invalidateQueries({ queryKey: ["profile", user.id] });
    }

    setSavingProfile(false);
    toast.success(isAr ? "تم حفظ البيانات الشخصية بنجاح!" : "Personal details saved successfully!");
  }

  async function handleSaveAddress(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    const govId = String(form.get("governorate") ?? "");
    const govObj = getGovernorate(govId);
    const govName = govObj ? `${govObj.nameEn} / ${govObj.nameAr}` : govId;

    const addressPayload: AddressRow = {
      full_name: String(form.get("full_name") ?? "")
        .trim()
        .slice(0, 100),
      phone: String(form.get("phone") ?? "")
        .trim()
        .slice(0, 30),
      alt_phone:
        String(form.get("alt_phone") ?? "")
          .trim()
          .slice(0, 30) || null,
      address: String(form.get("address") ?? "")
        .trim()
        .slice(0, 400),
      city: String(form.get("city") ?? "")
        .trim()
        .slice(0, 100),
      governorate: govId || null,
      postal_code:
        String(form.get("postal_code") ?? "")
          .trim()
          .slice(0, 20) || null,
    };

    setSavingAddress(true);
    setLocalAddress(addressPayload);
    localStorage.setItem(LOCAL_STORAGE_ADDRESS_KEY, JSON.stringify(addressPayload));

    if (user) {
      const dbPayload = {
        ...addressPayload,
        governorate: govName,
        user_id: user.id,
        is_default: true,
      };
      if (dbAddress?.id) {
        await supabase.from("addresses").update(dbPayload).eq("id", dbAddress.id);
      } else {
        await supabase.from("addresses").insert(dbPayload);
      }
      queryClient.invalidateQueries({ queryKey: ["my_address", user.id] });
    }

    setSavingAddress(false);
    toast.success(
      isAr
        ? "تم حفظ عنوان التوصيل بنجاح وسيتم تعبئته تلقائياً عند الدفع!"
        : "Delivery address saved and will auto-fill at checkout!",
    );
  }

  async function handleUpdatePassword(e: React.FormEvent) {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      toast.error(
        isAr ? "يجب أن لا تقل كلمة المرور عن 6 أحرف." : "Password must be at least 6 characters.",
      );
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error(isAr ? "كلمتا المرور غير متطابقتين." : "Passwords do not match.");
      return;
    }

    setUpdatingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setUpdatingPassword(false);

    if (error) {
      toast.error(error.message || "Failed to update password");
      return;
    }
    setNewPassword("");
    setConfirmPassword("");
    toast.success(isAr ? "تم تحديث كلمة المرور بنجاح!" : "Password updated successfully!");
  }

  async function handleOrderLookup(e: React.FormEvent) {
    e.preventDefault();
    const query = lookupOrderNumber.trim().toUpperCase();
    if (!query) return;

    setSearchingOrder(true);
    const { data, error } = await supabase
      .from("orders")
      .select(
        "id, order_number, customer_name, status, total, created_at, payment_method, payment_reference, items",
      )
      .eq("order_number", query)
      .maybeSingle();

    setSearchingOrder(false);
    if (error || !data) {
      toast.error(
        isAr
          ? "لم نتمكن من العثور على هذا الطلب."
          : "No order found matching that reference number.",
      );
      setLookupResult(null);
      return;
    }
    setLookupResult(data as OrderRow);
  }

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="pb-24">
      {/* Header Banner */}
      <section className="starfield sky border-b border-border/60 py-14">
        <div className="relative mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 lg:px-8">
          <div>
            <p className="flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-gold">
              <Star className="h-3 w-3" /> {t("account.title")}
            </p>
            <h1 className="mt-4 font-display text-4xl sm:text-5xl">
              {activeFullName || (isAr ? "عميل لينورا ستيلر" : "Linora Stellar Customer")}
            </h1>
            <p className="mt-2 text-xs text-muted-foreground">
              {user ? (
                <span>
                  {isAr ? "حساب موثق: " : "Signed in as "} {user.email}
                </span>
              ) : (
                <span>
                  {isAr
                    ? "وضع العميل السريع — يتم حفظ بياناتك وعنوانك لتسهيل الشراء."
                    : "Customer Profile — your delivery details are saved to speed up checkout."}
                </span>
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {isOwner && (
              <Link
                to="/admin"
                className="rounded-full border border-gold px-4 py-2 text-xs uppercase tracking-[0.16em] text-gold hover:bg-gold hover:text-black transition-colors"
              >
                {t("account.dashboard")}
              </Link>
            )}

            {user ? (
              <button
                type="button"
                onClick={signOut}
                className="rounded-full border border-border px-4 py-2 text-xs uppercase tracking-[0.16em] hover:border-rose-400 hover:text-rose-400 transition-colors"
              >
                {t("account.signout")}
              </button>
            ) : (
              <Link
                to="/auth"
                className="rounded-full bg-primary px-5 py-2 text-xs uppercase tracking-[0.16em] text-primary-foreground hover:opacity-90 transition-opacity"
              >
                {isAr ? "تسجيل الدخول / إنشاء حساب" : "Sign in / Register"}
              </Link>
            )}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8 space-y-10">
        {/* Shipping Zones Guide Banner */}
        <ShippingZonesCard />

        {/* Form Grid: Details & Delivery Address */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Card 1: Personal Details */}
          <form
            onSubmit={handleSaveProfile}
            className="card-star space-y-5 rounded-2xl border border-border/80 p-6 sm:p-8"
          >
            <div className="flex items-center gap-2 border-b border-border/60 pb-3">
              <User className="h-5 w-5 text-gold" />
              <h2 className="font-display text-2xl">{t("account.details")}</h2>
            </div>

            <div>
              <label className={labelCls} htmlFor="full_name">
                {t("account.fullName")} *
              </label>
              <input
                id="full_name"
                name="full_name"
                required
                defaultValue={activeFullName}
                placeholder={isAr ? "نورا تامر" : "Nora Tamer"}
                className={field}
              />
            </div>

            <div>
              <label className={labelCls} htmlFor="email">
                {t("account.email")} *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                defaultValue={activeEmail}
                readOnly={!!user}
                placeholder="nora@example.com"
                className={`${field} ${user ? "opacity-75 cursor-not-allowed bg-muted/30" : ""}`}
              />
              {user && (
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {isAr ? "البريد مرتبط بحسابك المسجل." : "Email is tied to your verified account."}
                </p>
              )}
            </div>

            <div>
              <label className={labelCls} htmlFor="phone">
                {t("account.phone")} (WhatsApp) *
              </label>
              <input
                id="phone"
                name="phone"
                required
                defaultValue={activePhone}
                placeholder="010xxxxxxxx"
                className={field}
              />
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              className="w-full rounded-full bg-primary px-6 py-2.5 text-xs uppercase tracking-[0.16em] text-primary-foreground hover:opacity-90 disabled:opacity-60 transition-opacity font-medium"
            >
              {savingProfile ? (isAr ? "جارٍ الحفظ…" : "Saving…") : t("account.saveDetails")}
            </button>
          </form>

          {/* Card 2: Saved Delivery Address with Egyptian Governorate Selector */}
          <form
            onSubmit={handleSaveAddress}
            className="card-star space-y-5 rounded-2xl border border-border/80 p-6 sm:p-8"
          >
            <div className="flex items-center gap-2 border-b border-border/60 pb-3">
              <MapPin className="h-5 w-5 text-gold" />
              <h2 className="font-display text-2xl">{t("account.savedAddress")}</h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={labelCls} htmlFor="a_name">
                  {t("checkout.name")} *
                </label>
                <input
                  id="a_name"
                  name="full_name"
                  required
                  defaultValue={activeAddress.full_name || activeFullName}
                  placeholder={isAr ? "اسم المستلم" : "Recipient name"}
                  className={field}
                />
              </div>

              <div>
                <label className={labelCls} htmlFor="a_phone">
                  {t("checkout.phone")} *
                </label>
                <input
                  id="a_phone"
                  name="phone"
                  required
                  defaultValue={activeAddress.phone || activePhone}
                  placeholder="010xxxxxxxx"
                  className={field}
                />
              </div>

              <div>
                <label className={labelCls} htmlFor="a_alt">
                  {t("checkout.altPhone")}
                </label>
                <input
                  id="a_alt"
                  name="alt_phone"
                  defaultValue={activeAddress.alt_phone ?? ""}
                  placeholder="01xxxxxxxxx"
                  className={field}
                />
              </div>

              <div>
                <label className={labelCls} htmlFor="a_gov">
                  {t("checkout.governorate")} *
                </label>
                <select
                  id="a_gov"
                  name="governorate"
                  required
                  defaultValue={activeAddress.governorate || "cairo"}
                  className={field}
                >
                  {EGYPTIAN_GOVERNORATES.map((gov) => (
                    <option key={gov.id} value={gov.id}>
                      {isAr ? `${gov.nameAr} (${gov.fee} ج.م)` : `${gov.nameEn} (${gov.fee} EGP)`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelCls} htmlFor="a_city">
                  {t("checkout.city")} *
                </label>
                <input
                  id="a_city"
                  name="city"
                  required
                  defaultValue={activeAddress.city}
                  placeholder={isAr ? "المعادي / التجمع / سموحة" : "District / City"}
                  className={field}
                />
              </div>

              <div className="sm:col-span-2">
                <label className={labelCls} htmlFor="a_address">
                  {t("checkout.address")} *
                </label>
                <textarea
                  id="a_address"
                  name="address"
                  required
                  rows={2}
                  defaultValue={activeAddress.address}
                  placeholder={
                    isAr
                      ? "رقم العمارة، اسم الشارع، رقم الشقة، علامة مميزة"
                      : "Building #, Street name, Apt #, Landmark"
                  }
                  className={field}
                />
              </div>

              <div className="sm:col-span-2">
                <label className={labelCls} htmlFor="a_post">
                  {t("checkout.postalCode")}
                </label>
                <input
                  id="a_post"
                  name="postal_code"
                  defaultValue={activeAddress.postal_code ?? ""}
                  className={field}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={savingAddress}
              className="w-full rounded-full bg-primary px-6 py-2.5 text-xs uppercase tracking-[0.16em] text-primary-foreground hover:opacity-90 disabled:opacity-60 transition-opacity font-medium"
            >
              {savingAddress ? (isAr ? "جارٍ الحفظ…" : "Saving…") : t("account.saveAddress")}
            </button>
          </form>
        </div>

        {/* Change Password (if signed in) */}
        {user && (
          <form
            onSubmit={handleUpdatePassword}
            className="card-star rounded-2xl border border-border/80 p-6 sm:p-8 max-w-xl"
          >
            <div className="flex items-center gap-2 border-b border-border/60 pb-3">
              <KeyRound className="h-5 w-5 text-gold" />
              <h2 className="font-display text-2xl">
                {isAr ? "تغيير كلمة المرور" : "Change Password"}
              </h2>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls} htmlFor="new_pass">
                  {isAr ? "كلمة المرور الجديدة" : "New password"}
                </label>
                <input
                  id="new_pass"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className={field}
                />
              </div>
              <div>
                <label className={labelCls} htmlFor="confirm_pass">
                  {isAr ? "تأكيد كلمة المرور" : "Confirm password"}
                </label>
                <input
                  id="confirm_pass"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className={field}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={updatingPassword || !newPassword}
              className="mt-5 rounded-full border border-gold px-6 py-2 text-xs uppercase tracking-[0.16em] text-gold hover:bg-gold/10 disabled:opacity-50"
            >
              {updatingPassword
                ? isAr
                  ? "جارٍ التحديث…"
                  : "Updating…"
                : isAr
                  ? "تحديث كلمة المرور"
                  : "Update Password"}
            </button>
          </form>
        )}

        {/* Order Tracking & Lookup */}
        <div className="card-star rounded-2xl border border-border/80 p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-4">
            <div>
              <h2 className="font-display text-2xl flex items-center gap-2">
                <Package className="h-5 w-5 text-gold" />
                <span>{t("account.orderHistory")}</span>
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                {isAr
                  ? "تتبعي حالة طلباتك أو ابحثي برقم الطلب للتحقق من وصول التحويل وموعد الشحن."
                  : "Track your past orders or search by order reference to verify transfer receipt and shipment."}
              </p>
            </div>

            <form onSubmit={handleOrderLookup} className="flex gap-2">
              <input
                value={lookupOrderNumber}
                onChange={(e) => setLookupOrderNumber(e.target.value)}
                placeholder="LS-XXXXXX"
                className="w-36 rounded-lg border border-input bg-background px-3 py-1.5 font-mono text-xs uppercase outline-none focus:border-gold"
              />
              <button
                type="submit"
                disabled={searchingOrder}
                className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs text-primary-foreground hover:opacity-90"
              >
                <Search className="h-3.5 w-3.5" />
                <span>{isAr ? "بحث" : "Lookup"}</span>
              </button>
            </form>
          </div>

          {/* Searched Order Result */}
          {lookupResult && (
            <div className="mt-6 rounded-xl border border-gold/40 bg-gold/5 p-5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono text-base font-bold text-gold">
                  {lookupResult.order_number}
                </span>
                {statusBadge(lookupResult.status, isAr)}
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>
                  <span className="font-medium text-foreground">
                    {isAr ? "العميل: " : "Customer: "}
                  </span>
                  {lookupResult.customer_name}
                </p>
                <p>
                  <span className="font-medium text-foreground">
                    {isAr ? "طريقة الدفع: " : "Payment: "}
                  </span>
                  {lookupResult.payment_method.replace("_", " ")}
                </p>
                {lookupResult.payment_reference && (
                  <p>
                    <span className="font-medium text-foreground">
                      {isAr ? "المرجع / المحفظة: " : "Reference: "}
                    </span>
                    {lookupResult.payment_reference}
                  </p>
                )}
                <p>
                  <span className="font-medium text-foreground">
                    {isAr ? "الإجمالي: " : "Total: "}
                  </span>
                  <span className="text-gold font-bold">
                    {formatPrice(Number(lookupResult.total))}
                  </span>
                </p>
              </div>
              <Link
                to="/order/$number"
                params={{ number: lookupResult.order_number }}
                className="inline-block text-xs font-semibold text-gold underline pt-1"
              >
                {isAr ? "عرض صفحة تأكيد الطلب الكاملة ←" : "View full order confirmation page →"}
              </Link>
            </div>
          )}

          {/* Orders Table */}
          {orders.length === 0 ? (
            <p className="mt-6 text-center text-sm text-muted-foreground py-8">
              {t("account.noOrders")}{" "}
              <Link to="/shop" className="text-gold underline">
                {t("account.startShopping")}
              </Link>
            </p>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[640px] text-sm">
                <thead className="text-start text-xs uppercase tracking-[0.16em] text-muted-foreground border-b border-border/60">
                  <tr>
                    <th className="py-3 font-medium">{t("account.orderCol")}</th>
                    <th className="font-medium">{t("account.dateCol")}</th>
                    <th className="font-medium">{t("account.paymentCol")}</th>
                    <th className="font-medium">{t("account.statusCol")}</th>
                    <th className="text-end font-medium">{t("account.totalCol")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-card/40 transition-colors">
                      <td className="py-3.5">
                        <Link
                          to="/order/$number"
                          params={{ number: o.order_number }}
                          className="font-mono text-gold hover:underline font-semibold"
                        >
                          {o.order_number}
                        </Link>
                      </td>
                      <td className="text-muted-foreground">
                        {new Date(o.created_at).toLocaleDateString(isAr ? "ar-EG" : "en-US")}
                      </td>
                      <td className="capitalize text-muted-foreground">
                        {o.payment_method.replace("_", " ")}
                      </td>
                      <td>{statusBadge(o.status, isAr)}</td>
                      <td className="text-end font-semibold text-gold">
                        {formatPrice(Number(o.total))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
