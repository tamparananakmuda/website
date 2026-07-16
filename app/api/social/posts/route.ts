import { NextRequest, NextResponse } from 'next/server';
import { getAdminSocialPosts, updateSocialPost, deleteSocialPost } from '@/lib/db/queries/social-posts';
import { socialPostUpdateSchema } from '@/lib/validations/social';
import { socialPostsQuerySchema } from '@/lib/validations/query-params';
import { rateLimit, rateLimitResponse } from '@/lib/rate-limit';
import { checkAdminAuth } from '@/lib/auth/admin-check';
import { parseRequestBody, parseQueryParams } from '@/lib/validations/helpers';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const auth = await checkAdminAuth();
    if (!auth.isAdmin) return auth.response;

    const query = parseQueryParams(request, socialPostsQuerySchema);
    if (!query.success) return query.errorResponse;

    const { status, platform, limit } = query.data;

    const posts = await getAdminSocialPosts({ status, platform, limit });

    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Social posts list error:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const auth = await checkAdminAuth();
    if (!auth.isAdmin) return auth.response;

    const limit = await rateLimit(request, {
      limit: 20,
      window: 60,
      identifier: 'social-posts-update',
    });
    if (!limit.success) {
      return rateLimitResponse(limit);
    }

    const parsed = await parseRequestBody(request, socialPostUpdateSchema);
    if (!parsed.success) return parsed.errorResponse;

    const { id, ...updates } = parsed.data;

    const updateData: Record<string, unknown> = {};
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.excerpt !== undefined) updateData.excerpt = updates.excerpt;
    if (updates.content_text !== undefined) updateData.contentText = updates.content_text;
    if (updates.transcript !== undefined) updateData.transcript = updates.transcript;
    if (updates.tags !== undefined) updateData.tags = updates.tags;
    if (updates.status !== undefined) updateData.status = updates.status;

    await updateSocialPost(String(id), updateData);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Social post update error:', error);
    return NextResponse.json(
      { error: 'Gagal update konten' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const auth = await checkAdminAuth();
    if (!auth.isAdmin) return auth.response;

    const limit = await rateLimit(request, {
      limit: 10,
      window: 60,
      identifier: 'social-posts-delete',
    });
    if (!limit.success) {
      return rateLimitResponse(limit);
    }

    const query = parseQueryParams(request, socialPostsQuerySchema);
    if (!query.success) return query.errorResponse;

    if (!query.data.id) {
      return NextResponse.json(
        { error: 'ID wajib diisi' },
        { status: 400 }
      );
    }

    await deleteSocialPost(BigInt(query.data.id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Social post delete error:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus konten' },
      { status: 500 }
    );
  }
}
