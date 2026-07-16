import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
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

    const { data } = await supabase
      .from('premium_unlocks')
      .select('id')
      .eq('reader_id', user.id)
      .eq('post_id', postId)
      .single();

    return NextResponse.json({ unlocked: !!data });
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

    const { error } = await supabase
      .from('premium_unlocks')
      .upsert({
        reader_id: user.id,
        post_id,
      }, {
        onConflict: 'reader_id,post_id',
      });

    if (error) throw error;

    return NextResponse.json({ success: true, unlocked: true });
  } catch (error) {
    console.error('Premium unlock error:', error);
    return NextResponse.json(
      { error: 'Gagal membuka artikel' },
      { status: 500 }
    );
  }
}
