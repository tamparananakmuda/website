import { Redis } from '@upstash/redis';
import { NextRequest, NextResponse } from 'next/server';

let redis: Redis | null = null;
let redisWarned = false;

function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    if (!redisWarned) {
      console.warn('Upstash Redis not configured. Rate limiting is disabled (fail-open).');
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
}

interface RateLimitResult {
  success: boolean;
  remaining: number;
  reset: number;
}

export async function rateLimit(
  request: NextRequest,
  options: RateLimitOptions
): Promise<RateLimitResult> {
  const r = getRedis();
  if (!r) {
    return { success: true, remaining: 0, reset: 0 };
  }

  const ip = getClientIP(request);
  const key = `ratelimit:${options.identifier}:${ip}`;
  const now = Date.now();
  const windowStart = now - options.window * 1000;

  const pipeline = r.pipeline();
  pipeline.zremrangebyscore(key, 0, windowStart);
  pipeline.zadd(key, { score: now, member: now.toString() });
  pipeline.zcard(key);
  pipeline.expire(key, options.window);

  const results = await pipeline.exec();
  const count = results[2] as number;

  const remaining = Math.max(0, options.limit - count);
  const reset = now + options.window * 1000;
  const success = count <= options.limit;

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
