/**
 * True when real Supabase credentials are present in the browser build.
 * When false the app runs on the in-memory mock store (local preview), and
 * server-side features (emails, card payments, server-priced orders) are skipped.
 */
export const hasBackend = Boolean(
  import.meta.env["VITE_SUPABASE_URL"] && import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"],
);
