import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  CircleUserRound,
  Download,
  Truck,
  LogOut,
  LogIn,
  UserPlus,
  Sparkles,
  ChevronDown,
  ShieldCheck,
  FileCheck,
  Heart,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { useWishlist } from "@/lib/wishlist";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

export function UserAccountDropdown() {
  const { user } = useAuth();
  const { count: wishlistCount } = useWishlist();
  const { t, lang } = useI18n();
  const isAr = lang === "ar";
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function handleSignOut() {
    setOpen(false);
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="group relative flex items-center gap-1.5 rounded-full border border-border/80 bg-surface/60 p-2 sm:px-3 text-xs text-text-primary hover:border-accent hover:text-accent transition-all shadow-xs"
        title={
          user
            ? isAr
              ? "حسابي الشخصي: التحميلات الرقمية وتتبع الطلبات"
              : "My Account: Digital Downloads & Order Tracking"
            : isAr
              ? "حسابي: تسجيل الدخول / إنشاء حساب / تتبع الطلبات والتحميلات"
              : "My Account: Sign In / Track Orders / Digital Downloads"
        }
        aria-expanded={open}
        aria-label="My Account Menu"
      >
        <div className="relative">
          <CircleUserRound className="h-4.5 w-4.5 text-accent transition-transform group-hover:scale-110" />
          {user && (
            <span className="absolute -top-0.5 -end-0.5 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-surface" />
          )}
        </div>
        <span className="hidden sm:inline font-semibold text-xs whitespace-nowrap">
          {user ? (isAr ? "حسابي" : "My Account") : isAr ? "حسابي / دخول" : "My Account"}
        </span>
        <ChevronDown
          className={`h-3 w-3 text-text-secondary transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute end-0 top-full mt-1.5 z-50 w-72 rounded-2xl border border-accent/40 bg-surface p-2 shadow-2xl backdrop-blur-xl card-star animate-in fade-in zoom-in-95 duration-150">
            {user ? (
              <>
                {/* User info banner */}
                <div className="p-2.5 border-b border-border/60 mb-1.5 rounded-xl bg-surface-elevated/60">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/20 text-accent font-bold text-xs uppercase border border-accent/40">
                      {user.email?.charAt(0) || "U"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-text-primary truncate">
                        {user.user_metadata?.full_name || user.email?.split("@")[0]}
                      </p>
                      <p className="text-[10px] text-text-secondary truncate">{user.email}</p>
                    </div>
                  </div>
                </div>

                {/* 3 Essential Account Pillars */}
                <div className="space-y-1">
                  {/* 1. Account Dashboard */}
                  <Link
                    to="/account"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-text-primary hover:bg-surface-elevated hover:text-accent transition-colors group"
                  >
                    <CircleUserRound className="h-4 w-4 text-accent transition-transform group-hover:scale-110" />
                    <div className="flex-1">
                      <span className="font-semibold block">
                        {isAr ? "لوحة التحكم والملف الشخصي" : "Account Dashboard"}
                      </span>
                      <span className="text-[10px] text-text-secondary block">
                        {isAr
                          ? "العناوين المحفوظة وإعدادات الحساب"
                          : "Saved address & profile settings"}
                      </span>
                    </div>
                  </Link>

                  {/* 2. Accessing Digital Downloads */}
                  <Link
                    to="/account"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-text-primary hover:bg-surface-elevated hover:text-accent transition-colors group"
                  >
                    <Download className="h-4 w-4 text-accent transition-transform group-hover:scale-110" />
                    <div className="flex-1">
                      <span className="font-semibold block">
                        {isAr ? "مكتبة التحميلات الرقمية" : "Digital Downloads Library"}
                      </span>
                      <span className="text-[10px] text-text-secondary block">
                        {isAr
                          ? "تحميل فوري لملفات PDF والبلانرز المشتراة"
                          : "Instant access to purchased files & planners"}
                      </span>
                    </div>
                  </Link>

                  {/* 3. Tracking Orders & Shipments */}
                  <Link
                    to="/track"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-text-primary hover:bg-surface-elevated hover:text-accent transition-colors group"
                  >
                    <Truck className="h-4 w-4 text-accent transition-transform group-hover:scale-110" />
                    <div className="flex-1">
                      <span className="font-semibold block">
                        {isAr ? "تتبع الشحنات والطلبات" : "Track Orders & Shipments"}
                      </span>
                      <span className="text-[10px] text-text-secondary block">
                        {isAr
                          ? "حالة الشحن والتوصيل في محافظات مصر"
                          : "Live delivery status across Egypt"}
                      </span>
                    </div>
                  </Link>

                  {/* 4. Saved Wishlist */}
                  <Link
                    to="/wishlist"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-text-primary hover:bg-surface-elevated hover:text-accent transition-colors group"
                  >
                    <Heart className="h-4 w-4 text-rose-400 transition-transform group-hover:scale-110" />
                    <div className="flex-1 flex items-center justify-between">
                      <div>
                        <span className="font-semibold block">
                          {isAr ? "قائمة الأمنيات المحفوظة" : "Saved Wishlist"}
                        </span>
                        <span className="text-[10px] text-text-secondary block">
                          {isAr ? "المنتجات والمطبوعات المفضلة" : "Favorite stationery & designs"}
                        </span>
                      </div>
                      {wishlistCount > 0 && (
                        <span className="rounded-full bg-rose-500/20 px-2 py-0.5 text-[10px] font-bold text-rose-400">
                          {wishlistCount}
                        </span>
                      )}
                    </div>
                  </Link>

                  <div className="border-t border-border/50 my-1 pt-1">
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 transition-colors text-start font-medium"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>{isAr ? "تسجيل الخروج" : "Sign Out"}</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Guest welcome & login / signup */}
                <div className="p-3 border-b border-border/60 mb-1.5 rounded-xl bg-surface-elevated/60 text-center">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent/15 text-accent mb-2 border border-accent/40">
                    <CircleUserRound className="h-5 w-5" />
                  </div>
                  <p className="text-xs font-bold text-text-primary">
                    {isAr ? "حسابي في لينورا ستيلار" : "My Account at Linora Stellar"}
                  </p>
                  <p className="text-[11px] text-text-secondary mt-0.5">
                    {isAr
                      ? "سجلي الدخول لتحميل ملفاتك الرقمية ومتابعة الشحنات"
                      : "Sign in to access digital downloads & track orders"}
                  </p>
                  <div className="flex gap-2 mt-2.5">
                    <Link
                      to="/auth"
                      onClick={() => setOpen(false)}
                      className="flex-1 rounded-xl bg-accent py-2 px-3 text-xs font-bold text-background text-center hover:brightness-110 shadow-xs flex items-center justify-center gap-1"
                    >
                      <LogIn className="h-3.5 w-3.5" />
                      <span>{isAr ? "تسجيل الدخول" : "Sign In"}</span>
                    </Link>
                    <Link
                      to="/auth"
                      onClick={() => setOpen(false)}
                      className="flex-1 rounded-xl border border-accent/60 bg-accent/10 py-2 px-3 text-xs font-bold text-accent text-center hover:bg-accent/20 flex items-center justify-center gap-1"
                    >
                      <UserPlus className="h-3.5 w-3.5" />
                      <span>{isAr ? "إنشاء حساب" : "Sign Up"}</span>
                    </Link>
                  </div>
                </div>

                {/* 3 Essential Account Pillars for Guests */}
                <div className="space-y-1">
                  {/* 1. Digital Downloads */}
                  <Link
                    to="/auth"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-text-primary hover:bg-surface-elevated hover:text-accent transition-colors group"
                  >
                    <Download className="h-4 w-4 text-accent transition-transform group-hover:scale-110" />
                    <div className="flex-1">
                      <span className="font-semibold block">
                        {isAr ? "تحميلاتي الرقمية" : "Access Digital Downloads"}
                      </span>
                      <span className="text-[10px] text-text-secondary block">
                        {isAr
                          ? "تحميل فوري لملفاتك المشتراة بعد تسجيل الدخول"
                          : "Download PDF/PNG/Canva templates"}
                      </span>
                    </div>
                  </Link>

                  {/* 2. Track Orders */}
                  <Link
                    to="/track"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-text-primary hover:bg-surface-elevated hover:text-accent transition-colors group"
                  >
                    <Truck className="h-4 w-4 text-accent transition-transform group-hover:scale-110" />
                    <div className="flex-1">
                      <span className="font-semibold block">
                        {isAr ? "تتبع الشحنات بالرقم" : "Track Order Status"}
                      </span>
                      <span className="text-[10px] text-text-secondary block">
                        {isAr
                          ? "تتبع طردك برقم الشحنة مباشرة دون تسجيل"
                          : "Track delivery without logging in"}
                      </span>
                    </div>
                  </Link>

                  {/* 3. Saved Wishlist */}
                  <Link
                    to="/wishlist"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-text-primary hover:bg-surface-elevated hover:text-accent transition-colors group"
                  >
                    <Heart className="h-4 w-4 text-rose-400 transition-transform group-hover:scale-110" />
                    <div className="flex-1 flex items-center justify-between">
                      <div>
                        <span className="font-semibold block">
                          {isAr ? "قائمة الأمنيات المحفوظة" : "Saved Wishlist"}
                        </span>
                        <span className="text-[10px] text-text-secondary block">
                          {isAr ? "مفضلاتك المحفوظة في هذا الجهاز" : "Items saved in this session"}
                        </span>
                      </div>
                      {wishlistCount > 0 && (
                        <span className="rounded-full bg-rose-500/20 px-2 py-0.5 text-[10px] font-bold text-rose-400">
                          {wishlistCount}
                        </span>
                      )}
                    </div>
                  </Link>

                  {/* 4. Support & Policies */}
                  <Link
                    to="/faq"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-text-primary hover:bg-surface-elevated hover:text-accent transition-colors group"
                  >
                    <ShieldCheck className="h-4 w-4 text-accent transition-transform group-hover:scale-110" />
                    <div className="flex-1">
                      <span className="font-semibold block">
                        {isAr ? "الأسئلة وسياسة الشحن" : "Shipping & Order FAQ"}
                      </span>
                      <span className="text-[10px] text-text-secondary block">
                        {isAr
                          ? "شحن القاهرة والمحافظات وسياسة الاستبدال"
                          : "Delivery times, rates & guarantees"}
                      </span>
                    </div>
                  </Link>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
