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

const CATEGORY_UANG = '62d4cac7-789f-4d35-9cd8-35f25a5bb042';
const CATEGORY_BISNIS = '53135a88-ce72-408c-9bc1-9fe32eb82548';
const CATEGORY_TEKNOLOGI = '92366694-94ef-419c-bb1a-cfd502b0d028';
const AUTHOR_ID = '30268f32-de51-4080-ba1b-20c20fff3c6b';

const articleFiles = [
  {
    file: 'content/articles/uang/dana-darurat-6x-gaji-saran-finansial-orang-yang-sudah-makan.md',
    categoryId: CATEGORY_UANG,
    subcategorySlug: 'keuangan-uang',
  },
  {
    file: 'content/articles/bisnis/dropshipping-bukan-bisnis-gen-z-pekerja-gratis-marketplace.md',
    categoryId: CATEGORY_BISNIS,
    subcategorySlug: 'bisnis',
  },
  {
    file: 'content/articles/teknologi/gojek-grab-bukan-jadi-bos-algoritma-yang-jadi-bosmu.md',
    categoryId: CATEGORY_TEKNOLOGI,
    subcategorySlug: 'analisis-fenomena',
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
    });

    console.log('INSERTED:', f.slug, '| scheduled:', f.publishedAt);
  }
  console.log('DONE ALL');
  process.exit(0);
}

insert().catch((e) => { console.error(e); process.exit(1); });
