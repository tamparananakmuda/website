import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { rateLimit } from '@/lib/rate-limit';

const clickSchema = z.object({
  slug: z.string().max(200),
  type: z.enum(['article', 'series', 'whitepaper']),
  messageId: z.string().max(100).optional().default(''),
  timestamp: z.string().max(50),
});

// In-memory click counter (resets on cold start)
const clickCounts = new Map<string, number>();

export async function POST(req: NextRequest) {
  const rlResult = await rateLimit(req, { limit: 60, window: 60, identifier: 'tami-click' });
  if (!rlResult.success) {
    return NextResponse.json({ error: 'Rate limited' }, { status: 429 });
  }

  try {
    const body = await req.json();
    const parsed = clickSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    const { slug, type } = parsed.data;
    const key = `${type}:${slug}`;
    clickCounts.set(key, (clickCounts.get(key) || 0) + 1);

    console.log(`[TAMI CLICK] ${type}/${slug} | total=${clickCounts.get(key)}`);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function GET() {
  const sorted = Array.from(clickCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([key, count]) => ({ slug: key, clicks: count }));

  return NextResponse.json({ topCitations: sorted, totalTracked: clickCounts.size });
}
