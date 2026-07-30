const { readFileSync, writeFileSync, existsSync } = require('fs');
const { join } = require('path');

// Load .env.local manually
const envPath = join(process.cwd(), '.env.local');
if (existsSync(envPath)) {
  const envContent = readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach((line: string) => {
    const t = line.trim();
    if (!t || t.startsWith('#')) return;
    const i = t.indexOf('=');
    if (i === -1) return;
    const k = t.substring(0, i).trim();
    const v = t.substring(i + 1).trim();
    if (!process.env[k]) process.env[k] = v;
  });
}

const { db } = require('../lib/db');
const { whitepapers } = require('../lib/db/schema');
const { eq } = require('drizzle-orm');
const matter = require('gray-matter');

const WHITEPAPER_FILE = 'content/whitepaper/krisis-pensiun-generasi-muda-sistem-yang-tidak-akan-ada.md';

async function insert() {
  const raw = readFileSync(join(process.cwd(), WHITEPAPER_FILE), 'utf8');
  const { data: f, content: fullContent } = matter(raw);

  // Extract only published content (between markers)
  const startMarker = '<!-- START WHITEPAPER CONTENT -->';
  const endMarker = '<!-- END WHITEPAPER CONTENT -->';
  const startIdx = fullContent.indexOf(startMarker);
  const endIdx = fullContent.indexOf(endMarker);

  const body =
    startIdx !== -1 && endIdx !== -1
      ? fullContent.slice(startIdx + startMarker.length, endIdx).trim()
      : fullContent.trim();

  // Check if already exists
  const existing = await db
    .select({ id: whitepapers.id })
    .from(whitepapers)
    .where(eq(whitepapers.slug, f.slug));

  if (existing.length > 0) {
    // Update existing
    await db
      .update(whitepapers)
      .set({
        title: f.title,
        subtitle: f.subtitle || null,
        summary: f.summary || null,
        body: body,
        author: f.author || 'TAMPARAN ANAK MUDA',
        downloadUrl: f.downloadUrl || null,
        readingTime: f.readingTime || 25,
        tags: f.tags || [],
        status: f.status || 'published',
        publishedAt: f.publishedAt || null,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(whitepapers.slug, f.slug));

    console.log('UPDATED:', f.slug, '| status:', f.status, '| publishedAt:', f.publishedAt);
  } else {
    // Insert new
    await db.insert(whitepapers).values({
      slug: f.slug,
      title: f.title,
      subtitle: f.subtitle || null,
      summary: f.summary || null,
      body: body,
      author: f.author || 'TAMPARAN ANAK MUDA',
      downloadUrl: f.downloadUrl || null,
      readingTime: f.readingTime || 25,
      tags: f.tags || [],
      status: f.status || 'published',
      publishedAt: f.publishedAt || null,
    });

    console.log('INSERTED:', f.slug, '| status:', f.status, '| publishedAt:', f.publishedAt);
  }

  console.log('Body length:', body.length, 'chars');
  console.log('DONE');
  process.exit(0);
}

insert().catch((e: Error) => {
  console.error(e);
  process.exit(1);
});
