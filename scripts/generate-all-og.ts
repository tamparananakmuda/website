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

const { getAllArticlesUncached } = require('../lib/articles/loader');
const { updatePostOGUrls } = require('../lib/db/queries/posts');
const { generateAndUploadOGImages } = require('../lib/cdn/generate');
const { deleteOldOGImages } = require('../lib/cdn/r2');
const { getCategoryBySlug, getAuthorBySlug, getSeriesBySlug } = require('../content/config');

async function main() {
  const now = new Date().toISOString();
  const allRaw = getAllArticlesUncached();
  const published = allRaw
    .filter((a) => a.status === 'published' && a.publishedAt <= now)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  console.log(`Found ${published.length} published posts to generate OG images for\n`);

  let success = 0;
  let failed = 0;

  for (const raw of published) {
    const category = getCategoryBySlug(raw.categorySlug) ?? null;
    const author = getAuthorBySlug(raw.authorSlug) ?? null;
    const series = raw.seriesSlug ? getSeriesBySlug(raw.seriesSlug) : null;

    let seriesCurrent: number | undefined;
    let seriesTotal: number | undefined;
    if (series && raw.seriesOrder) {
      seriesTotal = published.filter((a) => a.seriesSlug === raw.seriesSlug).length;
      seriesCurrent = raw.seriesOrder;
    }

    try {
      process.stdout.write(`Generating for "${raw.slug}"... `);
      await deleteOldOGImages(raw.slug);
      const urls = await generateAndUploadOGImages(raw.slug, {
        title: raw.title,
        category: category?.title,
        categoryColor: category?.color ?? undefined,
        categorySlug: category?.slug ?? undefined,
        excerpt: raw.excerpt || undefined,
        readingTime: raw.readingTime ?? undefined,
        publishedAt: raw.publishedAt ?? undefined,
        authorName: author?.name ?? undefined,
        isPremium: raw.isPremium ?? undefined,
        isSponsored: raw.isSponsored ?? undefined,
        seriesCurrent,
        seriesTotal,
        coverImageUrl: raw.coverImageUrl ?? undefined,
        ogHeadline: raw.ogHeadline || undefined,
      });

      await updatePostOGUrls(raw.slug, {
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
