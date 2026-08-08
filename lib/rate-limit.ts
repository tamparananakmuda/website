import { Redis } from '@upstash/redis';
import { NextRequest, NextResponse } from 'next/server';

let redis: Redis | null = null;
let redisWarned = false;

function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    if (!redisWarned) {
      console.warn('Upstash Redis not configured. Falling back to in-memory rate limiting (not shared across instances).');
      redisWarned = true;
    }
    return null;
  }

  if (!redis) {
    redis = new Redis({ url, token });
  }

  return redis;
}

interface RateLimitOptions {
  /** Maximum number of requests allowed in the window */
  limit: number;
  /** Time window in seconds */
  window: number;
  /** Unique identifier for the rate limit rule (e.g., 'donasi', 'newsletter') */
  identifier: string;
  /** Higher limit for authenticated users (optional) */
  authenticatedLimit?: number;
  /** Burst limit: max requests in a short burst window (optional) */
  burstLimit?: number;
  /** Burst window in seconds (default: 10) */
  burstWindow?: number;
}

interface RateLimitResult {
  success: boolean;
  remaining: number;
  reset: number;
}

// In-memory fallback: sliding window per IP
// NOTE: Not shared across instances — only protects single-instance scenarios.
// Entries are cleaned up lazily on each check to avoid memory leaks.
const memoryStore = new Map<string, number[]>();

function memoryRateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const windowStart = now - windowMs;

  const timestamps = (memoryStore.get(key) || []).filter((t) => t > windowStart);
  timestamps.push(now);
  memoryStore.set(key, timestamps);

  const count = timestamps.length;
  const success = count <= limit;
  const remaining = Math.max(0, limit - count);
  const reset = now + windowMs;

  return { success, remaining, reset };
}

// Cleanup stale memory entries every 10 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, timestamps] of Array.from(memoryStore.entries())) {
      const cleaned = timestamps.filter((t: number) => now - t < 600_000);
      if (cleaned.length === 0) {
        memoryStore.delete(key);
      } else {
        memoryStore.set(key, cleaned);
      }
    }
  }, 600_000);
}

export async function rateLimit(
  request: NextRequest,
  options: RateLimitOptions
): Promise<RateLimitResult> {
  const ip = getClientIP(request);
  const userId = request.headers.get('x-user-id') || '';
  const userKey = userId ? `user:${userId}` : `ip:${ip}`;
  const key = `ratelimit:${options.identifier}:${userKey}`;
  const windowMs = options.window * 1000;

  // Determine effective limit: authenticated users get higher limit if configured
  const effectiveLimit = (userId && options.authenticatedLimit) ? options.authenticatedLimit : options.limit;

  // Check burst limit first (if configured)
  if (options.burstLimit) {
    const burstWindowMs = (options.burstWindow || 10) * 1000;
    const burstKey = `${key}:burst`;
    const r = getRedis();

    if (!r) {
      const burstResult = memoryRateLimit(burstKey, options.burstLimit, burstWindowMs);
      if (!burstResult.success) {
        return { success: false, remaining: 0, reset: Date.now() + burstWindowMs };
      }
    } else {
      const now = Date.now();
      const burstStart = now - burstWindowMs;
      const burstPipeline = r.pipeline();
      burstPipeline.zremrangebyscore(burstKey, 0, burstStart);
      burstPipeline.zadd(burstKey, { score: now, member: now.toString() });
      burstPipeline.zcard(burstKey);
      burstPipeline.expire(burstKey, options.burstWindow || 10);
      const burstResults = await burstPipeline.exec();
      const burstCount = burstResults[2] as number;
      if (burstCount > options.burstLimit) {
        return { success: false, remaining: 0, reset: now + burstWindowMs };
      }
    }
  }

  const r = getRedis();

  if (!r) {
    return memoryRateLimit(key, effectiveLimit, windowMs);
  }

  const now = Date.now();
  const windowStart = now - windowMs;

  const pipeline = r.pipeline();
  pipeline.zremrangebyscore(key, 0, windowStart);
  pipeline.zadd(key, { score: now, member: now.toString() });
  pipeline.zcard(key);
  pipeline.expire(key, options.window);

  const results = await pipeline.exec();
  const count = results[2] as number;

  const remaining = Math.max(0, effectiveLimit - count);
  const reset = now + windowMs;
  const success = count <= effectiveLimit;

  return { success, remaining, reset };
}

export function rateLimitResponse(result: RateLimitResult): NextResponse {
  return NextResponse.json(
    { error: 'Terlalu banyak permintaan. Coba lagi nanti.' },
    {
      status: 429,
      headers: {
        'Retry-After': String(Math.ceil((result.reset - Date.now()) / 1000)),
        'X-RateLimit-Remaining': String(result.remaining),
        'X-RateLimit-Reset': String(result.reset),
      },
    }
  );
}

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP.trim();
  }
  return 'unknown';
}
