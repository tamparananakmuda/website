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

async function insertAll() {
  const files = [11, 12, 13];
  for (const i of files) {
    const raw = readFileSync(`/tmp/tam-article-${i}.json`, 'utf8');
    const data = JSON.parse(raw);

    // Read body from draft markdown (strip title line and source section)
    const draft = readFileSync(`/tmp/tam-article-${i}-draft.md`, 'utf8');
    const lines = draft.split('\n');
    // Remove first line (title) and source section
    let body = lines.slice(1).join('\n').trim();
    const sourceIdx = body.indexOf('## Sumber');
    if (sourceIdx > -1) {
      body = body.substring(0, sourceIdx).trim();
    }

    // Calculate reading time (words / 200)
    const wordCount = body.split(/\s+/).filter(w => w.length > 0).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    const insertData = {
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      body: body,
      categoryId: data.categoryId,
      subcategoryId: data.subcategoryId,
      authorId: data.authorId,
      status: data.status,
      povTag: data.povTag,
      humanSignature: data.humanSignature,
      factCheckStatus: data.factCheckStatus,
      reviewStatus: data.reviewStatus,
      publishedAt: data.publishedAt,
      seoMetaTitle: data.seoMetaTitle,
      seoMetaDescription: data.seoMetaDescription,
      ogHeadline: data.ogHeadline,
      seoKeywords: data.seoKeywords,
      sourceReferences: data.sourceReferences,
      readingTime: readingTime,
    };

    const [inserted] = await db.insert(posts).values(insertData).returning({ id: posts.id, slug: posts.slug, title: posts.title });
    console.log(`INSERTED [${i}]: ${inserted.id} | ${inserted.slug} | ${inserted.title}`);
  }
  process.exit(0);
}

insertAll().catch(e => { console.error(e); process.exit(1); });
