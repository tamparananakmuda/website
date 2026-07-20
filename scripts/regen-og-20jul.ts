const { readFileSync } = require('fs');
const { join } = require('path');

// Load env
const envPath = join(process.cwd(), '.env.local');
const envContent = readFileSync(envPath, 'utf8');
envContent.split('\n').forEach((line) => {
  const t = line.trim();
  if (!t || t.startsWith('#')) return;
  const i = t.indexOf('=');
  if (i === -1) return;
  const k = t.substring(0, i).trim();
  const v = t.substring(i + 1).trim();
  if (!process.env[k]) process.env[k] = v;
});

const { db } = require('../lib/db');
const { posts } = require('../lib/db/schema');
const { eq } = require('drizzle-orm');
const { getPublishedPostWithRelationsBySlug, countPublishedPostsInSeries } = require('../lib/db/queries/posts');
const { generateAndUploadOGImages } = require('../lib/cdn/generate');
const { deleteOldOGImages } = require('../lib/cdn/r2');

const SLUGS = [
  'viral-bukan-bisnis-kenapa-bisnis-gen-z-cepat-meledak-lalu-cepat-mati',
  'tiktok-bukan-terapis-bahaya-self-diagnosis-kesehatan-mental',
  'paylater-bukan-kemudahan-penjaga-gaji-kamu',
  's1-rebutan-loker-smk-pendidikan-tinggi-jadi-trap',
  'kesepian-dibungkus-estetik-algoritma-tiktok-makan-trauma',
  'passive-income-bukan-tentang-malas-kerja',
  '300-lamaran-ditolak-bukan-pilih-pilih-sistemnya-yang-tidak-mau-kamu',
  'healing-culture-self-care-atau-performance-untuk-konten',
  'side-hustle-bukan-ambisi-kebutuhan-ekonomi',
];

async function regenAll() {
  for (const slug of SLUGS) {
    try {
      // Use raw query since scheduled posts won't be returned by getPublishedPostWithRelationsBySlug
      const result = await db.select().from(posts).where(eq(posts.slug, slug)).limit(1);
      if (!result[0]) {
        console.log(`SKIP [not found]: ${slug}`);
        continue;
      }
      const post = result[0];

      // Get category and author separately
      const { categories } = require('../lib/db/schema');
      const { authors } = require('../lib/db/schema');
      const { series } = require('../lib/db/schema');
      const catRow = post.categoryId ? await db.select().from(categories).where(eq(categories.id, post.categoryId)).limit(1) : [];
      const authorRow = post.authorId ? await db.select().from(authors).where(eq(authors.id, post.authorId)).limit(1) : [];
      const seriesRow = post.seriesId ? await db.select().from(series).where(eq(series.id, post.seriesId)).limit(1) : [];

      const category = catRow[0] || null;
      const author = authorRow[0] || null;
      const postSeries = seriesRow[0] || null;

      let seriesCurrent, seriesTotal;
      if (postSeries && post.seriesOrder) {
        seriesTotal = await countPublishedPostsInSeries(postSeries.id);
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

      await db.update(posts).set({
        ogCardUrl: urls.card,
        ogFeatureUrl: urls.feature,
        ogImageUrl: urls.feature,
      }).where(eq(posts.id, post.id));

      console.log(`REGEN OK: ${slug}`);
      console.log(`  card: ${urls.card}`);
      console.log(`  feature: ${urls.feature}`);
    } catch (err) {
      console.error(`FAIL [${slug}]:`, err.message || err);
    }
  }
  process.exit(0);
}

regenAll().catch(e => { console.error(e); process.exit(1); });
