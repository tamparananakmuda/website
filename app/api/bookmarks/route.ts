import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { rateLimit, rateLimitResponse } from '@/lib/rate-limit';

const bookmarkSchema = z.object({
  post_id: z.number().int().positive(),
});

export async function POST(request: NextRequest) {
  try {
    const limit = await rateLimit(request, {
      limit: 20,
      window: 60,
      identifier: 'bookmark',
    });
    if (!limit.success) {
      return rateLimitResponse(limit);
    }

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Masuk untuk menyimpan artikel' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const parsed = bookmarkSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Post ID tidak valid' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('bookmarks')
      .insert({
        reader_id: user.id,
        post_id: parsed.data.post_id,
      });

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ success: true, message: 'Sudah disimpan' });
      }
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Bookmark error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const limit = await rateLimit(request, {
      limit: 20,
      window: 60,
      identifier: 'bookmark-delete',
    });
    if (!limit.success) {
      return rateLimitResponse(limit);
    }

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Masuk untuk menghapus bookmark' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('post_id');

    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID wajib diisi' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('reader_id', user.id)
      .eq('post_id', parseInt(postId, 10));

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Bookmark delete error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ bookmarks: [] });
    }

    const { data, error } = await supabase
      .from('bookmarks')
      .select('post_id')
      .eq('reader_id', user.id);

    if (error) throw error;

    return NextResponse.json({
      bookmarks: data?.map((b) => b.post_id) || [],
    });
  } catch (error) {
    console.error('Bookmark list error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan' },
      { status: 500 }
    );
  }
}
