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
const { posts, series, subcategories } = require('../lib/db/schema');
const { eq } = require('drizzle-orm');
const matter = require('gray-matter');

const CATEGORY_KEHIDUPAN = '3f5fcde6-2a00-418b-88a6-4b485c122067';
const AUTHOR_ID = '30268f32-de51-4080-ba1b-20c20fff3c6b';
const SERIES_SLUG = 'hubungan-era-tidak-pasti';

const articleFiles = [
  { file: 'content/seri/hubungan-era-tidak-pasti/part-1-situationship-ekonomi.md', order: 1 },
  { file: 'content/seri/hubungan-era-tidak-pasti/part-2-ghosting-bandwidth.md', order: 2 },
  { file: 'content/seri/hubungan-era-tidak-pasti/part-3-friendship-luxury.md', order: 3 },
  { file: 'content/seri/hubungan-era-tidak-pasti/part-4-kesepian-digital.md', order: 4 },
  { file: 'content/seri/hubungan-era-tidak-pasti/part-5-menikah-ekonomi.md', order: 5 },
  { file: 'content/seri/hubungan-era-tidak-pasti/part-6-hubungan-sewa.md', order: 6 },
];

async function insert() {
  // 1. Check or create series
  let seriesRow = await db.select().from(series).where(eq(series.slug, SERIES_SLUG)).limit(1);
  let seriesId;

  if (seriesRow.length > 0) {
    seriesId = seriesRow[0].id;
    console.log('Series already exists:', SERIES_SLUG, '|', seriesId);
  } else {
    const [created] = await db.insert(series).values({
      title: 'Hubungan Era Tidak Pasti',
      slug: SERIES_SLUG,
      description: 'Seri 6 part tentang bagaimana ekonomi tidak pasti mengubah hubungan Gen Z: situationship, ghosting, friendship breakup, kesepian digital, menunda menikah, dan hubungan sewa.',
    }).returning();
    seriesId = created.id;
    console.log('Series created:', SERIES_SLUG, '|', seriesId);
  }

  // 2. Get subcategory
  const sub = await db.select().from(subcategories).where(eq(subcategories.slug, 'hubungan-sosial')).limit(1);
  const subId = sub[0]?.id || null;
  console.log('Subcategory hubungan-sosial:', subId || 'NOT FOUND');

  // 3. Insert each part
  for (const cfg of articleFiles) {
    const { data: f, content: body } = matter(readFileSync(join(process.cwd(), cfg.file), 'utf8'));

    const existing = await db.select({ id: posts.id }).from(posts).where(eq(posts.slug, f.slug));
    if (existing.length > 0) {
      console.log('SKIP (already exists):', f.slug);
      continue;
    }

    const wordCount = body.split(/\s+/).length;
    const readingTime = Math.max(1, Math.round(wordCount / 200));

    await db.insert(posts).values({
      title: f.title,
      slug: f.slug,
      excerpt: f.excerpt,
      body: body,
      categoryId: CATEGORY_KEHIDUPAN,
      subcategoryId: subId,
      seriesId: seriesId,
      seriesOrder: cfg.order,
      authorId: AUTHOR_ID,
      status: 'scheduled',
      povTag: f.povTag,
      humanSignature: true,
      factCheckStatus: 'verified',
      reviewStatus: 'publish',
      sourceReferences: f.sourceReferences || [],
      readingTime,
      publishedAt: f.publishedAt,
      seoMetaTitle: f.seoMetaTitle,
      seoMetaDescription: f.seoMetaDescription,
      ogHeadline: f.ogHeadline,
      seoKeywords: f.seoKeywords || [],
      featured: f.featured || false,
      tags: f.tags || [],
    });

    console.log('INSERTED:', f.slug, '| order:', cfg.order, '| scheduled:', f.publishedAt);
  }

  console.log('DONE ALL');
  process.exit(0);
}

insert().catch((e) => { console.error(e); process.exit(1); });
