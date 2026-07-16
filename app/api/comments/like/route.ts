import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { toggleCommentLike, getCommentById } from '@/lib/db/queries/comments';
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
      await toggleCommentLike(comment_id, user.id);
    } else if (action === 'unlike') {
      await toggleCommentLike(comment_id, user.id);
    }

    const comment = await getCommentById(comment_id);

    return NextResponse.json({
      success: true,
      likes_count: comment?.likesCount || 0,
    });
  } catch (error) {
    console.error('Comment like error:', error);
    return NextResponse.json(
      { error: 'Gagal memproses like' },
      { status: 500 }
    );
  }
}
