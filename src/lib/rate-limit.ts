// Simple in-memory rate limiter for development / single-instance deployments.
// For production with multiple instances, swap this with a Redis/Upstash backend.

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  resetInSeconds: number;
}

/**
 * @param key       Unique identifier (e.g. `${ip}:register`)
 * @param limit     Max requests allowed within the window
 * @param windowMs  Window size in milliseconds
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, resetInSeconds: Math.ceil(windowMs / 1000) };
  }

  existing.count += 1;
  const remaining = Math.max(0, limit - existing.count);
  const resetInSeconds = Math.max(0, Math.ceil((existing.resetAt - now) / 1000));

  return { ok: existing.count <= limit, remaining, resetInSeconds };
}

/**
 * Best-effort client IP from common forwarding headers. Falls back to a
 * placeholder when the IP cannot be determined.
 */
export function getClientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}
