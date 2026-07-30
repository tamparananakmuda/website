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

const CATEGORY_MINDSET = '3a71ab8a-526f-4d19-a434-f54814f233dd';
const AUTHOR_ID = '30268f32-de51-4080-ba1b-20c20fff3c6b';

async function insert() {
  const raw = readFileSync(
    join(process.cwd(), 'content/whitepaper/krisis-kesehatan-mental-indonesia-sistem-yang-tidak-ada.md'),
    'utf8'
  );

  // Extract frontmatter
  const fmMatch = raw.match(/^---\n([\s\S]*?)\n---/);
  const fm = fmMatch ? fmMatch[1] : '';
  const fmLines = fm.split('\n');
  const meta = {};
  for (const line of fmLines) {
    const m = line.match(/^(\w+):\s*"?(.*?)"?\s*$/);
    if (m) meta[m[1]] = m[2];
  }

  // Extract body between START/END markers
  const startIdx = raw.indexOf('<!-- START WHITEPAPER CONTENT -->');
  const endIdx = raw.indexOf('<!-- END WHITEPAPER CONTENT -->');
  const body = raw.substring(startIdx + 35, endIdx).trim();

  const slug = 'krisis-kesehatan-mental-indonesia-sistem-yang-tidak-ada';
  const title = 'Krisis Kesehatan Mental Indonesia: Sistem yang Tidak Ada';
  const excerpt = 'Anggaran <1% APBN, 0,3 psikiater per 100.000, pasung masih ada. Gen Z bukan lemah mental, sistemnya yang tidak ada.';
  const ogHeadline = 'Gen Z bukan lemah mental, sistemnya yang tidak ada';

  // Check existing
  const existing = await db.select({ id: posts.id }).from(posts).where(eq(posts.slug, slug));
  if (existing.length > 0) {
    console.log('SKIP (already exists):', slug);
    process.exit(0);
  }

  // Find subcategory for mindset
  const sub = await db.select().from(subcategories).where(eq(subcategories.categoryId, CATEGORY_MINDSET)).limit(1);
  const subId = sub[0]?.id || null;

  const wordCount = body.split(/\s+/).length;
  const readingTime = Math.max(1, Math.round(wordCount / 200));

  await db.insert(posts).values({
    title,
    slug,
    excerpt,
    body,
    categoryId: CATEGORY_MINDSET,
    subcategoryId: subId,
    authorId: AUTHOR_ID,
    status: 'published',
    povTag: 'kontra-narasi',
    humanSignature: true,
    factCheckStatus: 'verified',
    reviewStatus: 'publish',
    sourceReferences: [
      { type: 'link', url: 'https://www.who.int/publications/i/item/mental-health-atlas-2024', label: 'WHO Mental Health Atlas 2024' },
      { type: 'link', url: 'https://frontiersin.org/articles/10.3389/fpubh.2025', label: 'Frontiers in Public Health: Economic burden of anxiety & depression in Indonesia (2025)' },
      { type: 'link', url: 'https://www.deloitte.com/global/en/our-thinking/insights/topics/gen-z-millennial-survey.html', label: 'Deloitte Global Gen Z & Millennial Survey 2026' },
      { type: 'link', url: 'https://www.kemkes.go.id/', label: 'Kemenkes RI: Data anggaran, SDM, pasung (2026)' },
    ],
    readingTime,
    publishedAt: '2026-07-29T01:00:00.000Z',
    seoMetaTitle: 'Krisis Kesehatan Mental Indonesia: Sistem yang Tidak Ada | TAM',
    seoMetaDescription: excerpt,
    ogHeadline,
    seoKeywords: ['krisis kesehatan mental indonesia', 'sistem kesehatan mental', 'psikiater indonesia', 'pasung indonesia', 'gen z kesehatan mental', 'anggaran kesehatan mental', 'healing culture'],
  });

  console.log('INSERTED:', slug);
  console.log('Word count:', wordCount);
  console.log('Reading time:', readingTime);
  process.exit(0);
}

insert().catch((e) => { console.error(e); process.exit(1); });
