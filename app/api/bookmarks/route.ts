import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createBookmark, deleteBookmark, getBookmarkPostIdsByUser } from '@/lib/db/queries/bookmarks';
import { rateLimit, rateLimitResponse } from '@/lib/rate-limit';
import { bookmarkSchema } from '@/lib/validations/bookmark';
import { bookmarksQuerySchema } from '@/lib/validations/query-params';
import { parseRequestBody, parseQueryParams } from '@/lib/validations/helpers';

export const dynamic = 'force-dynamic';

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
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;

    if (!user) {
      return NextResponse.json(
        { error: 'Masuk untuk menyimpan artikel' },
        { status: 401 }
      );
    }

    const parsed = await parseRequestBody(request, bookmarkSchema);
    if (!parsed.success) return parsed.errorResponse;

    const { error } = await createBookmark(user.id, parsed.data.post_id)
      .then(() => ({ error: null }))
      .catch((e: { code?: string }) => ({ error: e }));

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
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;

    if (!user) {
      return NextResponse.json(
        { error: 'Masuk untuk menghapus bookmark' },
        { status: 401 }
      );
    }

    const query = parseQueryParams(request, bookmarksQuerySchema);
    if (!query.success) return query.errorResponse;

    if (!query.data.post_id) {
      return NextResponse.json(
        { error: 'Post ID wajib diisi' },
        { status: 400 }
      );
    }

    await deleteBookmark(user.id, query.data.post_id);

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
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;

    if (!user) {
      return NextResponse.json({ bookmarks: [] });
    }

    const bookmarkIds = await getBookmarkPostIdsByUser(user.id);

    return NextResponse.json({
      bookmarks: bookmarkIds,
    });
  } catch (error) {
    console.error('Bookmark list error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan' },
      { status: 500 }
    );
  }
}
