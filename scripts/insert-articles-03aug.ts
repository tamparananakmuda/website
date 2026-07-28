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
const { posts, subcategories } = require('../lib/db/schema');
const { eq } = require('drizzle-orm');
const matter = require('gray-matter');

const CATEGORY_KARIER = 'a085b98d-c314-485e-a989-d5fc7078ec04';
const CATEGORY_KEHIDUPAN = '3f5fcde6-2a00-418b-88a6-4b485c122067';
const CATEGORY_MINDSET = '3a71ab8a-526f-4d19-a434-f54814f233dd';
const AUTHOR_ID = '30268f32-de51-4080-ba1b-20c20fff3c6b';

const articleFiles = [
  {
    file: 'content/articles/karier/neet-gen-z-1-dari-5-anak-muda-indonesia-hilang-dari-sistem.md',
    categoryId: CATEGORY_KARIER,
    subcategorySlug: 'karier-dunia-kerja',
  },
  {
    file: 'content/articles/kehidupan/back-to-basic-dating-bukan-konservatif-efisiensi-emosional.md',
    categoryId: CATEGORY_KEHIDUPAN,
    subcategorySlug: 'hubungan-sosial',
  },
  {
    file: 'content/articles/mindset/gen-z-doomerism-pesimis-bukan-depresi-mereka-baca-datanya.md',
    categoryId: CATEGORY_MINDSET,
    subcategorySlug: 'mindset-realita',
  },
];

async function insert() {
  for (const cfg of articleFiles) {
    const { data: f, content: body } = matter(readFileSync(join(process.cwd(), cfg.file), 'utf8'));

    const existing = await db.select({ id: posts.id }).from(posts).where(eq(posts.slug, f.slug));
    if (existing.length > 0) {
      console.log('SKIP (already exists):', f.slug);
      continue;
    }

    const sub = await db.select().from(subcategories).where(eq(subcategories.slug, cfg.subcategorySlug)).limit(1);
    const subId = sub[0]?.id || null;

    const wordCount = body.split(/\s+/).length;
    const readingTime = Math.max(1, Math.round(wordCount / 200));

    await db.insert(posts).values({
      title: f.title,
      slug: f.slug,
      excerpt: f.excerpt,
      body: body,
      categoryId: cfg.categoryId,
      subcategoryId: subId,
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

    console.log('INSERTED:', f.slug, '| scheduled:', f.publishedAt);
  }
  console.log('DONE ALL');
  process.exit(0);
}

insert().catch((e) => { console.error(e); process.exit(1); });
