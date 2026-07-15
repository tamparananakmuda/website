import { readFileSync } from 'fs';
import { join } from 'path';
import { createClient } from '@supabase/supabase-js';
import { generateAndUploadOGImages } from '../lib/cdn/generate';

// Load .env.local manually
const envPath = join(process.cwd(), '.env.local');
const envContent = readFileSync(envPath, 'utf8');
envContent.split('\n').forEach((line) => {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) return;
  const eqIdx = trimmed.indexOf('=');
  if (eqIdx === -1) return;
  const key = trimmed.substring(0, eqIdx).trim();
  const value = trimmed.substring(eqIdx + 1).trim();
  if (!process.env[key]) {
    process.env[key] = value;
  }
});

async function main() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );

  const serviceSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );

  const { data: posts, error } = await supabase
    .from('posts')
    .select(`
      slug, title, excerpt, og_headline, cover_image_url, published_at, reading_time,
      is_premium, is_sponsored, series_order,
      category:categories ( title, slug, color ),
      series:series ( id, title ),
      author:authors ( name )
    `)
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Fetch error:', error.message);
    process.exit(1);
  }

  console.log(`Found ${posts?.length || 0} published posts to generate OG images for\n`);

  let success = 0;
  let failed = 0;

  for (const post of posts || []) {
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

    try {
      process.stdout.write(`Generating for "${post.slug}"... `);
      const urls = await generateAndUploadOGImages(post.slug, {
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

      await serviceSupabase
        .from('posts')
        .update({
          og_card_url: urls.card,
          og_feature_url: urls.feature,
          og_image_url: urls.og,
        })
        .eq('slug', post.slug);

      console.log('OK');
      success++;
    } catch (err) {
      console.log('FAILED:', err instanceof Error ? err.message : 'unknown');
      failed++;
    }
  }

  console.log(`\nDone: ${success} success, ${failed} failed`);
  process.exit(0);
}

main().catch(console.error);
