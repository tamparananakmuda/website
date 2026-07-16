import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { rateLimit, rateLimitResponse } from '@/lib/rate-limit';
import { commentLikeSchema } from '@/lib/validations/comment';
import { parseRequestBody } from '@/lib/validations/helpers';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const limit = await rateLimit(request, {
      limit: 10,
      window: 60,
      identifier: 'comment-like',
    });
    if (!limit.success) {
      return rateLimitResponse(limit);
    }

    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;

    if (!user) {
      return NextResponse.json(
        { error: 'Login dulu untuk menyukai komentar' },
        { status: 401 }
      );
    }

    const parsed = await parseRequestBody(request, commentLikeSchema);
    if (!parsed.success) return parsed.errorResponse;

    const { comment_id, action } = parsed.data;

    if (action === 'like') {
      const { error } = await supabase
        .from('comment_likes')
        .insert({ comment_id, reader_id: user.id });

      if (error && error.code !== '23505') throw error;
    } else if (action === 'unlike') {
      const { error } = await supabase
        .from('comment_likes')
        .delete()
        .eq('comment_id', comment_id)
        .eq('reader_id', user.id);

      if (error) throw error;
    }

    const { data: comment } = await supabase
      .from('comments')
      .select('likes_count')
      .eq('id', comment_id)
      .single();

    return NextResponse.json({
      success: true,
      likes_count: comment?.likes_count || 0,
    });
  } catch (error) {
    console.error('Comment like error:', error);
    return NextResponse.json(
      { error: 'Gagal memproses like' },
      { status: 500 }
    );
  }
}
