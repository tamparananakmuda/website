import { NextRequest, NextResponse } from 'next/server';
import { getSocialPostBySourceUrl, createSocialPost } from '@/lib/db/queries/social-posts';
import { socialImportSchema } from '@/lib/validations/social';
import { previewSocialContent } from '@/lib/social-preview';
import { rateLimit, rateLimitResponse } from '@/lib/rate-limit';
import { checkAdminAuth } from '@/lib/auth/admin-check';
import { parseRequestBody } from '@/lib/validations/helpers';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const auth = await checkAdminAuth();
    if (!auth.isAdmin) return auth.response;

    const limit = await rateLimit(request, {
      limit: 10,
      window: 60,
      identifier: 'social-import',
    });
    if (!limit.success) {
      return rateLimitResponse(limit);
    }

    const parsed = await parseRequestBody(request, socialImportSchema);
    if (!parsed.success) return parsed.errorResponse;

    const preview = await previewSocialContent(parsed.data.url);

    const existing = await getSocialPostBySourceUrl(parsed.data.url);

    if (existing) {
      return NextResponse.json({
        success: true,
        preview,
        existing_id: existing.id,
        existing_status: existing.status,
        message: 'Konten ini sudah pernah diimport',
      });
    }

    const post = await createSocialPost({
      platform: preview.platform,
      sourceUrl: preview.source_url,
      sourceId: preview.source_id,
      authorHandle: preview.author_handle,
      authorName: preview.author_name,
      authorAvatarUrl: preview.author_avatar_url,
      contentText: preview.content_text,
      mediaUrls: preview.media_urls,
      videoUrl: preview.video_url,
      thumbnailUrl: preview.thumbnail_url,
      title: preview.title,
      excerpt: preview.excerpt,
      status: 'draft',
    });

    return NextResponse.json({
      success: true,
      preview,
      id: post.id,
    });
  } catch (error) {
    console.error('Social import error:', error);
    return NextResponse.json(
      { error: 'Gagal mengimport konten' },
      { status: 500 }
    );
  }
}
