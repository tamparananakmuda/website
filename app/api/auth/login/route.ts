import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { verifyTurnstileToken } from '@/lib/turnstile';
import { rateLimit, rateLimitResponse } from '@/lib/rate-limit';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const loginSchema = z.object({
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

    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Input tidak valid' },
        { status: 400 }
      );
    }

    const { email, turnstile_token } = parsed.data;

    const valid = await verifyTurnstileToken(turnstile_token, request);
    if (!valid) {
      return NextResponse.json(
        { error: 'Verifikasi keamanan gagal. Coba lagi.' },
        { status: 403 }
      );
    }

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://tamparananakmuda.com'}/auth/callback`,
        shouldCreateUser: false,
      },
    });

    if (error) {
      const message = error.message.includes('not registered') || error.message.includes('no user')
        ? 'Email belum terdaftar. Hubungi admin untuk mendaftar.'
        : error.message;
      return NextResponse.json({ error: message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan. Coba lagi nanti.' },
      { status: 500 }
    );
  }
}
