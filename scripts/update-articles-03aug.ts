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
const { posts } = require('../lib/db/schema');
const { eq } = require('drizzle-orm');
const matter = require('gray-matter');

const articleFiles = [
  'content/articles/karier/neet-gen-z-1-dari-5-anak-muda-indonesia-hilang-dari-sistem.md',
  'content/articles/kehidupan/back-to-basic-dating-bukan-konservatif-efisiensi-emosional.md',
  'content/articles/mindset/gen-z-doomerism-pesimis-bukan-depresi-mereka-baca-datanya.md',
];

async function update() {
  for (const file of articleFiles) {
    const { data: f, content: body } = matter(readFileSync(join(process.cwd(), file), 'utf8'));

    const wordCount = body.split(/\s+/).length;
    const readingTime = Math.max(1, Math.round(wordCount / 200));

    await db.update(posts).set({
      title: f.title,
      excerpt: f.excerpt,
      body: body,
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
    }).where(eq(posts.slug, f.slug));

    console.log('UPDATED:', f.slug);
  }
  console.log('DONE ALL');
  process.exit(0);
}

update().catch((e) => { console.error(e); process.exit(1); });
