import { NextRequest, NextResponse } from 'next/server';
import { verifyTurnstileToken } from '@/lib/turnstile';
import { rateLimit, rateLimitResponse } from '@/lib/rate-limit';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const schema = z.object({
  email: z.string().trim().toLowerCase().email('Format email tidak valid').max(255),
  turnstile_token: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const limit = await rateLimit(request, {
      limit: 5,
      window: 300,
      identifier: 'login',
    });
    if (!limit.success) {
      return rateLimitResponse(limit);
    }

    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: 'Body request tidak valid' }, { status: 400 });
    }

    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Input tidak valid' },
        { status: 400 }
      );
    }

    const { turnstile_token } = parsed.data;

    const valid = await verifyTurnstileToken(turnstile_token, request);
    if (!valid) {
      return NextResponse.json(
        { error: 'Verifikasi keamanan gagal. Coba lagi.' },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Turnstile verification error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan. Coba lagi nanti.' },
      { status: 500 }
    );
  }
}
