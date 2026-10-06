import { getRequest } from "@tanstack/react-start/server";

// Best-effort, per-instance limiter. On serverless/edge each instance keeps its own
// counters, so this stops casual abuse and runaway loops, not a distributed attack.
// For stronger protection put Cloudflare rate-limiting rules in front of /_serverFn.
const buckets = new Map<string, { count: number; resetAt: number }>();

export function clientIp(): string {
  const req = getRequest();
  const h = req?.headers;
  if (!h) return "unknown";
  return (
    h.get("cf-connecting-ip") ||
    h.get("x-real-ip") ||
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

/** Returns true when the call is allowed, false when the limit is exceeded. */
export function allow(bucket: string, limit: number, windowMs: number): boolean {
  const key = `${bucket}:${clientIp()}`;
  const now = Date.now();
  const entry = buckets.get(key);

  if (buckets.size > 5000) {
    for (const [k, v] of buckets) if (v.resetAt <= now) buckets.delete(k);
  }

  if (!entry || entry.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  entry.count += 1;
  return entry.count <= limit;
}
