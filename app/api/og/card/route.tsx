import { ImageResponse } from '@vercel/og';
import { createClient } from '@supabase/supabase-js';
import { OgTemplate } from '@/lib/og/template';
import { getFonts } from '@/lib/og/fonts';

export const runtime = 'nodejs';
export const revalidate = 86400;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  if (!slug) {
    return new Response('Missing slug parameter', { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );

  const { data: post } = await supabase
    .from('posts')
    .select(`
      title, og_headline, cover_image_url, published_at,
      is_premium, is_sponsored,
      category:categories ( title, slug, color )
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .lte('published_at', new Date().toISOString())
    .single();

  if (!post) {
    return new Response('Article not found', { status: 404 });
  }

  const fonts = await getFonts();

  const categoryList = post.category as unknown as { title: string; slug: string; color: string }[] | null;
  const category = categoryList?.[0] ?? null;

  return new ImageResponse(
    (
      <OgTemplate
        title={post.title}
        category={category?.title}
        categoryColor={category?.color}
        categorySlug={category?.slug}
        publishedAt={post.published_at}
        isPremium={post.is_premium}
        isSponsored={post.is_sponsored}
        coverImageUrl={post.cover_image_url}
        ogHeadline={post.og_headline || undefined}
        size="card"
      />
    ),
    {
      width: 800,
      height: 450,
      fonts: [
        { name: 'Syne', data: fonts.display, weight: 700, style: 'normal' },
        { name: 'Plus Jakarta Sans', data: fonts.body, weight: 400, style: 'normal' },
        { name: 'Plus Jakarta Sans', data: fonts.bodySemiBold, weight: 600, style: 'normal' },
        { name: 'JetBrains Mono', data: fonts.mono, weight: 400, style: 'normal' },
      ],
    }
  );
}
