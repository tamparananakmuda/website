import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAuth } from '@/lib/auth/admin-check';
import { getPostWithRelationsBySlug, countPublishedPostsInSeries, updatePostOGUrls } from '@/lib/db/queries/posts';
import { generateAndUploadOGImages } from '@/lib/cdn/generate';
import { deleteOldOGImages } from '@/lib/cdn/r2';
import { ogGenerateSchema } from '@/lib/validations/og';
import { parseRequestBody } from '@/lib/validations/helpers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const auth = await checkAdminAuth();
  if (!auth.isAdmin) return auth.response;

  try {
    const parsed = await parseRequestBody(request, ogGenerateSchema);
    if (!parsed.success) return parsed.errorResponse;

    const { slug } = parsed.data;

    const post = await getPostWithRelationsBySlug(slug);

    if (!post) {
      return NextResponse.json({ error: 'Artikel tidak ditemukan' }, { status: 404 });
    }

    const category = post.category ?? null;
    const author = post.author ?? null;
    const series = post.series ?? null;

    let seriesCurrent: number | undefined;
    let seriesTotal: number | undefined;
    if (series && post.seriesOrder) {
      seriesTotal = await countPublishedPostsInSeries(series.id);
      seriesCurrent = post.seriesOrder;
    }

    await deleteOldOGImages(slug);

    const urls = await generateAndUploadOGImages(slug, {
      title: post.title,
      category: category?.title,
      categoryColor: category?.color ?? undefined,
      categorySlug: category?.slug ?? undefined,
      excerpt: post.excerpt || undefined,
      readingTime: post.readingTime ?? undefined,
      publishedAt: post.publishedAt ?? undefined,
      authorName: author?.name ?? undefined,
      isPremium: post.isPremium ?? undefined,
      isSponsored: post.isSponsored ?? undefined,
      seriesCurrent,
      seriesTotal,
      coverImageUrl: post.coverImageUrl ?? undefined,
      ogHeadline: post.ogHeadline || undefined,
    });

    await updatePostOGUrls(post.id, {
      ogCardUrl: urls.card,
      ogFeatureUrl: urls.feature,
      ogImageUrl: urls.feature,
    });

    return NextResponse.json({ success: true, urls });
  } catch (error) {
    console.error('OG generate error:', error);
    return NextResponse.json(
      { error: 'Gagal generate OG images: ' + (error instanceof Error ? error.message : 'unknown') },
      { status: 500 }
    );
  }
}
