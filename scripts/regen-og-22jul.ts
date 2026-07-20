const { readFileSync } = require('fs');
const { join } = require('path');
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
const { posts, categories, authors } = require('../lib/db/schema');
const { eq } = require('drizzle-orm');
const { generateAndUploadOGImages } = require('../lib/cdn/generate');

const SLUGS = [
  'linkedin-kena-ick-gen-z-cari-kerja-di-tiktok',
  'emotional-exhaustion-bukan-sekadar-capek-kamu-kosong',
  'generasi-stroberi-label-untuk-sistem-yang-gagal',
];

async function regen() {
  for (const slug of SLUGS) {
    const rows = await db.select().from(posts)
      .leftJoin(categories, eq(posts.categoryId, categories.id))
      .leftJoin(authors, eq(posts.authorId, authors.id))
      .where(eq(posts.slug, slug));
    if (rows.length === 0) {
      console.log('NOT FOUND:', slug);
      continue;
    }
    const row = rows[0];
    const post = row.posts;
    const category = row.categories;
    const author = row.authors;
    console.log('Generating OG for:', slug);

    const templateProps = {
      title: post.ogHeadline || post.title,
      category: category?.title || '',
      categoryColor: category?.color || '#D13A3A',
      categorySlug: category?.slug || '',
      excerpt: post.excerpt || '',
      readingTime: post.readingTime || 5,
      publishedAt: post.publishedAt,
      authorName: author?.name || '',
      ogHeadline: post.ogHeadline || post.title,
    };

    const { card: cardUrl, feature: featureUrl } = await generateAndUploadOGImages(slug, templateProps);

    await db.update(posts).set({
      ogCardUrl: cardUrl,
      ogFeatureUrl: featureUrl,
      ogImageUrl: featureUrl,
    }).where(eq(posts.slug, slug));

    console.log('DONE:', slug);
    console.log('  card:', cardUrl);
    console.log('  feature:', featureUrl);
  }
  console.log('ALL DONE');
  process.exit(0);
}

regen().catch(e => { console.error(e); process.exit(1); });
