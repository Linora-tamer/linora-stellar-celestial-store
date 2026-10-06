// Server-only helpers for reading configuration. Never import from client code.

export function env(name: string): string | undefined {
  const v = process.env[name];
  return v && v.trim() ? v.trim() : undefined;
}

export function isSupabaseServerConfigured(): boolean {
  return Boolean(env("SUPABASE_URL") && env("SUPABASE_SERVICE_ROLE_KEY"));
}

/** Public origin of the site, used for payment redirect/callback URLs and email links. */
export function siteUrl(): string {
  return (env("SITE_URL") ?? "http://localhost:3000").replace(/\/+$/, "");
}

export const OWNER_EMAIL = env("OWNER_EMAIL") ?? "norafayed06@gmail.com";
