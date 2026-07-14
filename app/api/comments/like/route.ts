import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { rateLimit, rateLimitResponse } from '@/lib/rate-limit';

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

    const { comment_id, action } = await request.json();

    if (!comment_id || !action) {
      return NextResponse.json(
        { error: 'Comment ID dan action wajib diisi' },
        { status: 400 }
      );
    }

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
    } else {
      return NextResponse.json(
        { error: 'Action tidak valid' },
        { status: 400 }
      );
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
