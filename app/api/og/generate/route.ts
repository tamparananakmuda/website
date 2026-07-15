import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { checkAdminAuth } from '@/lib/auth/admin-check';
import { generateAndUploadOGImages } from '@/lib/cdn/generate';
import { deleteOldOGImages } from '@/lib/cdn/r2';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const auth = await checkAdminAuth();
  if (!auth.isAdmin) return auth.response;

  try {
    const { slug } = await request.json();

    if (!slug) {
      return NextResponse.json({ error: 'Slug wajib diisi' }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: false } }
    );

    const { data: post, error } = await supabase
      .from('posts')
      .select(`
        title, excerpt, og_headline, cover_image_url, published_at, reading_time,
        is_premium, is_sponsored, series_order, slug,
        category:categories ( title, slug, color ),
        series:series ( id, title ),
        author:authors ( name )
      `)
      .eq('slug', slug)
      .single();

    if (error || !post) {
      return NextResponse.json({ error: 'Artikel tidak ditemukan' }, { status: 404 });
    }

    const categoryList = post.category as unknown as { title: string; slug: string; color: string }[] | null;
    const authorList = post.author as unknown as { name: string }[] | null;
    const seriesList = post.series as unknown as { id: string; title: string }[] | null;
    const category = categoryList?.[0] ?? null;
    const author = authorList?.[0] ?? null;
    const series = seriesList?.[0] ?? null;

    let seriesCurrent: number | undefined;
    let seriesTotal: number | undefined;
    if (series && post.series_order) {
      const { count } = await supabase
        .from('posts')
        .select('id', { count: 'exact', head: true })
        .eq('series_id', series.id)
        .eq('status', 'published');
      seriesCurrent = post.series_order;
      seriesTotal = count || undefined;
    }

    await deleteOldOGImages(slug);

    const urls = await generateAndUploadOGImages(slug, {
      title: post.title,
      category: category?.title,
      categoryColor: category?.color,
      categorySlug: category?.slug,
      excerpt: post.excerpt || undefined,
      readingTime: post.reading_time,
      publishedAt: post.published_at,
      authorName: author?.name,
      isPremium: post.is_premium,
      isSponsored: post.is_sponsored,
      seriesCurrent,
      seriesTotal,
      coverImageUrl: post.cover_image_url,
      ogHeadline: post.og_headline || undefined,
    });

    const serviceSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    );

    await serviceSupabase
      .from('posts')
      .update({
        og_card_url: urls.card,
        og_feature_url: urls.feature,
        og_image_url: urls.feature,
      })
      .eq('slug', slug);

    return NextResponse.json({ success: true, urls });
  } catch (error) {
    console.error('OG generate error:', error);
    return NextResponse.json(
      { error: 'Gagal generate OG images: ' + (error instanceof Error ? error.message : 'unknown') },
      { status: 500 }
    );
  }
}
