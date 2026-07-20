const { readFileSync } = require('fs');
const { join } = require('path');

// Load .env.local manually BEFORE requiring DB modules
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

const { getAllPublishedPostsWithRelations, countPublishedPostsInSeries, updatePostOGUrls } = require('../lib/db/queries/posts');
const { generateAndUploadOGImages } = require('../lib/cdn/generate');
const { deleteOldOGImages } = require('../lib/cdn/r2');

async function main() {
  const allPosts = await getAllPublishedPostsWithRelations();

  console.log(`Found ${allPosts.length} published posts to generate OG images for\n`);

  let success = 0;
  let failed = 0;

  for (const post of allPosts) {
    const category = post.category ?? null;
    const author = post.author ?? null;
    const series = post.series ?? null;

    let seriesCurrent: number | undefined;
    let seriesTotal: number | undefined;
    if (series && post.seriesOrder) {
      seriesTotal = await countPublishedPostsInSeries(series.id);
      seriesCurrent = post.seriesOrder;
    }

    try {
      process.stdout.write(`Generating for "${post.slug}"... `);
      await deleteOldOGImages(post.slug);
      const urls = await generateAndUploadOGImages(post.slug, {
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
