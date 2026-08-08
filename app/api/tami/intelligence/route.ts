import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { processTamiIntelligence } from '@/lib/tami/agent/orchestrator';
import { rateLimit, rateLimitResponse } from '@/lib/rate-limit';
import { moderateInput, checkRateLimit as checkSafetyRateLimit, trackConversation } from '@/lib/tami/guardrails/safety';

export const maxDuration = 60;

const tamiRequestSchema = z.object({
  query: z.string().trim().min(1, 'Query wajib diisi').max(2000, 'Query terlalu panjang (maks 2000 karakter)'),
  history: z.array(
    z.object({
      role: z.enum(['user', 'assistant']),
      content: z.string().max(5000),
    })
  ).max(20, 'Riwayat percakapan terlalu panjang (maks 20 pesan)').optional().default([]),
});

export async function POST(req: NextRequest) {
  try {
    const rlResult = await rateLimit(req, { limit: 15, window: 60, identifier: 'tami-intelligence' });
    if (!rlResult.success) {
      return rateLimitResponse(rlResult);
    }

    const body = await req.json();
    const parsed = tamiRequestSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0];
      return NextResponse.json(
        { error: firstError?.message || 'Input tidak valid.' },
        { status: 400 }
      );
    }

    const { query, history } = parsed.data;

    // T7-5: Content moderation check
    const moderation = moderateInput(query);
    if (!moderation.allowed) {
      return NextResponse.json({ error: moderation.reason }, { status: 400 });
    }

    // T7-5: Per-IP safety rate limiting (sliding window)
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    const safetyLimit = checkSafetyRateLimit(ip);
    if (!safetyLimit.allowed) {
      return NextResponse.json(
        { error: 'Terlalu banyak permintaan. Coba lagi dalam beberapa saat.' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil(safetyLimit.resetInMs / 1000)) } }
      );
    }

    // T7-5: Track conversation for retention policy
    trackConversation(`conv-${Date.now()}-${ip.slice(-6)}`);

    const response = await processTamiIntelligence(query, history);
    return NextResponse.json(response);
  } catch (error: any) {
    console.error('[TAMI API] Intelligence route failed:', error);
    return NextResponse.json(
      { error: 'Gagal memproses kecerdasan TAMI. Silakan coba beberapa saat lagi.' },
      { status: 500 }
    );
  }
}
