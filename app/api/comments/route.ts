import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import { rateLimit, rateLimitResponse } from '@/lib/rate-limit';
import { commentSchema } from '@/lib/validations/comment';
import { commentsQuerySchema } from '@/lib/validations/query-params';
import { parseQueryParams, parseRequestBody } from '@/lib/validations/helpers';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const query = parseQueryParams(request, commentsQuerySchema);
    if (!query.success) return query.errorResponse;

    if (!query.data.post_id) {
      return NextResponse.json(
        { error: 'Post ID wajib diisi' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    const { data: comments, error } = await supabase
      .from('comments')
      .select(`
        id,
        post_id,
        parent_id,
        reader_id,
        author_name,
        body,
        likes_count,
        created_at,
        updated_at
      `)
      .eq('post_id', query.data.post_id)
      .eq('status', 'approved')
      .order('created_at', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ comments: comments || [] });
  } catch (error) {
    console.error('Comments fetch error:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil komentar' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const limit = await rateLimit(request, {
      limit: 5,
      window: 300,
      identifier: 'comment',
    });
    if (!limit.success) {
      return rateLimitResponse(limit);
    }

    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;

    if (!user) {
      return NextResponse.json(
        { error: 'Login dulu untuk berkomentar' },
        { status: 401 }
      );
    }

    const parsed = await parseRequestBody(request, commentSchema);
    if (!parsed.success) return parsed.errorResponse;

    const { data: profile } = await supabase
      .from('reader_profiles')
      .select('name, email')
      .eq('user_id', user.id)
      .single();

    const authorName = profile?.name || user.email?.split('@')[0] || 'Anonim';
    const authorEmail = profile?.email || user.email || null;

    const { data, error } = await supabase
      .from('comments')
      .insert({
        post_id: parsed.data.post_id,
        parent_id: parsed.data.parent_id || null,
        reader_id: user.id,
        author_name: authorName,
        author_email: authorEmail,
        body: parsed.data.body,
        status: 'approved',
      })
      .select('id, post_id, parent_id, author_name, body, likes_count, created_at')
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, comment: data });
  } catch (error) {
    console.error('Comment create error:', error);
    return NextResponse.json(
      { error: 'Gagal menambahkan komentar' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const query = parseQueryParams(request, commentsQuerySchema);
    if (!query.success) return query.errorResponse;

    if (!query.data.id) {
      return NextResponse.json(
        { error: 'ID komentar wajib diisi' },
        { status: 400 }
      );
    }

    const commentId = query.data.id;

    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;

    if (!user) {
      return NextResponse.json(
        { error: 'Tidak punya akses' },
        { status: 401 }
      );
    }

    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId)
      .eq('reader_id', user.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Comment delete error:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus komentar' },
      { status: 500 }
    );
  }
}
