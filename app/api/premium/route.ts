import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isPremiumUnlocked, unlockPremium } from '@/lib/db/queries/premium';
import { rateLimit, rateLimitResponse } from '@/lib/rate-limit';
import { premiumUnlockSchema } from '@/lib/validations/premium';
import { parseRequestBody } from '@/lib/validations/helpers';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('post_id');

    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID wajib diisi' },
        { status: 400 }
      );
    }

    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;

    if (!user) {
      return NextResponse.json({ unlocked: false });
    }

    const unlocked = await isPremiumUnlocked(user.id, postId);

    return NextResponse.json({ unlocked });
  } catch {
    return NextResponse.json({ unlocked: false });
  }
}

export async function POST(request: NextRequest) {
  try {
    const limit = await rateLimit(request, {
      limit: 10,
      window: 60,
      identifier: 'premium-unlock',
    });
    if (!limit.success) {
      return rateLimitResponse(limit);
    }

    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;

    if (!user) {
      return NextResponse.json(
        { error: 'Login dulu untuk membuka artikel premium' },
        { status: 401 }
      );
    }

    const parsed = await parseRequestBody(request, premiumUnlockSchema);
    if (!parsed.success) return parsed.errorResponse;

    const { post_id } = parsed.data;

    await unlockPremium(user.id, post_id);

    return NextResponse.json({ success: true, unlocked: true });
  } catch (error) {
    console.error('Premium unlock error:', error);
    return NextResponse.json(
      { error: 'Gagal membuka artikel' },
      { status: 500 }
    );
  }
}
