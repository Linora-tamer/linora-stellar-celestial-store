import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Set a new password — Linora Stellar" },
      { name: "description", content: "Choose a new password for your Linora Stellar account." },
      { property: "og:title", content: "Set a new password — Linora Stellar" },
      {
        property: "og:description",
        content: "Choose a new password for your Linora Stellar account.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ResetPassword,
});

function ResetPassword() {
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const password = String(form.get("password") ?? "");
    if (password !== String(form.get("confirm") ?? "")) {
      toast.error("The two passwords don't match.");
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Your password is updated.");
    navigate({ to: "/account", replace: true });
  }

  return (
    <div className="starfield sky min-h-[70vh] py-16">
      <div className="relative mx-auto w-full max-w-md px-4">
        <form onSubmit={submit} className="card-star space-y-4 rounded-2xl p-7">
          <h1 className="font-display text-2xl">Set a new password</h1>
          <div>
            <label
              className="text-xs uppercase tracking-[0.16em] text-muted-foreground"
              htmlFor="password"
            >
              New password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              minLength={6}
              required
              autoComplete="new-password"
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-gold"
            />
          </div>
          <div>
            <label
              className="text-xs uppercase tracking-[0.16em] text-muted-foreground"
              htmlFor="confirm"
            >
              Confirm password
            </label>
            <input
              id="confirm"
              name="confirm"
              type="password"
              minLength={6}
              required
              autoComplete="new-password"
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-gold"
            />
          </div>
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60"
          >
            {busy ? "Saving…" : "Save password"}
          </button>
        </form>
      </div>
    </div>
  );
}
