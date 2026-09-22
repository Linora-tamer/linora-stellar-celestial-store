import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Star } from "@/components/site/Star";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Linora Stellar" },
      {
        name: "description",
        content: "Sign in or create your Linora Stellar account to track orders and save your details.",
      },
      { property: "og:title", content: "Sign in — Linora Stellar" },
      { property: "og:description", content: "Your Linora Stellar account: orders, details, custom requests." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

const field =
  "mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-gold";
const labelCls = "text-xs uppercase tracking-[0.16em] text-muted-foreground";

function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState<string | null>(null);
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) navigate({ to: "/account", replace: true });
  }, [user, loading, navigate]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    setBusy(true);
    try {
      if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        setSent("We sent you a link to set a new password.");
      } else if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: String(form.get("full_name") ?? "") },
          },
        });
        if (error) throw error;
        if (!data.session) setSent("Check your email to confirm your address, then sign in.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/account" });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  async function social(provider: "google" | "apple" | "microsoft") {
    try {
      await lovable.auth.signInWithOAuth(provider, { redirect_uri: window.location.origin });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sign-in is unavailable right now.");
    }
  }

  return (
    <div className="starfield sky min-h-[80vh] py-16">
      <div className="relative mx-auto w-full max-w-md px-4">
        <div className="card-star rounded-2xl p-7">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-gold" />
            <h1 className="font-display text-2xl">
              {mode === "signup" ? "Create your account" : mode === "forgot" ? "Reset password" : "Welcome back"}
            </h1>
          </div>

          {sent ? (
            <p className="mt-6 rounded-md border border-border bg-background/60 p-4 text-sm text-muted-foreground">
              {sent}
            </p>
          ) : (
            <>
              <div className="mt-6 grid gap-2">
                {(["google", "apple", "microsoft"] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => social(p)}
                    className="rounded-md border border-border px-4 py-2 text-sm capitalize transition-colors hover:border-gold"
                  >
                    Continue with {p}
                  </button>
                ))}
              </div>

              <div className="my-6 flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
              </div>

              <form onSubmit={onSubmit} className="space-y-4">
                {mode === "signup" && (
                  <div>
                    <label className={labelCls} htmlFor="full_name">
                      Full name
                    </label>
                    <input id="full_name" name="full_name" required className={field} autoComplete="name" />
                  </div>
                )}
                <div>
                  <label className={labelCls} htmlFor="email">
                    Email
                  </label>
                  <input id="email" name="email" type="email" required className={field} autoComplete="email" />
                </div>
                {mode !== "forgot" && (
                  <div>
                    <label className={labelCls} htmlFor="password">
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      minLength={6}
                      className={field}
                      autoComplete={mode === "signup" ? "new-password" : "current-password"}
                    />
                  </div>
                )}
                <button
                  type="submit"
                  disabled={busy}
                  className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
                >
                  {busy
                    ? "Please wait…"
                    : mode === "signup"
                      ? "Create account"
                      : mode === "forgot"
                        ? "Send reset link"
                        : "Sign in"}
                </button>
              </form>
            </>
          )}

          <div className="mt-6 space-y-2 text-sm text-muted-foreground">
            {mode !== "signin" && (
              <button type="button" className="hover:text-foreground" onClick={() => { setMode("signin"); setSent(null); }}>
                Already have an account? Sign in
              </button>
            )}
            {mode !== "signup" && (
              <button type="button" className="block hover:text-foreground" onClick={() => { setMode("signup"); setSent(null); }}>
                New here? Create an account
              </button>
            )}
            {mode !== "forgot" && (
              <button type="button" className="block hover:text-foreground" onClick={() => { setMode("forgot"); setSent(null); }}>
                Forgot your password?
              </button>
            )}
            <Link to="/shop" className="block hover:text-foreground">
              Keep shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
