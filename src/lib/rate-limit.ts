// src/lib/rate-limit.ts
// Simple in-memory rate limiter for API routes.
// For production, use a Redis-based implementation or Upstash.

interface RateLimitEntry {
  count: number;
  reset: number;
}

const store = new Map<string, RateLimitEntry>();

const WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10);
const MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '30', 10);

/**
 * Check whether the given identifier (e.g., hashed IP) is within the rate limit.
 * Returns { allowed: true } if OK, or { allowed: false, retryAfter } if throttled.
 */
export function checkRateLimit(id: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const entry = store.get(id);

  if (!entry || now > entry.reset) {
    store.set(id, { count: 1, reset: now + WINDOW_MS });
    return { allowed: true };
  }

  if (entry.count >= MAX_REQUESTS) {
    return { allowed: false, retryAfter: Math.ceil((entry.reset - now) / 1000) };
  }

  entry.count++;
  return { allowed: true };
}

/**
 * Get a safe, non-reversible identifier from the request IP.
 * Uses first two octets only (e.g., "192.168.x.x") for partial privacy.
 */
export async function getAnonymousId(request: Request): Promise<string> {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';

  // Partial anonymization: keep only first two octets
  const parts = ip.split('.');
  const partial = parts.length >= 2 ? `${parts[0]}.${parts[1]}.x.x` : ip;

  // Hash using SHA-256 for storage
  const encoder = new TextEncoder();
  const data = encoder.encode(partial + process.env.ADMIN_AUTH_SECRET);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, 32);
}
