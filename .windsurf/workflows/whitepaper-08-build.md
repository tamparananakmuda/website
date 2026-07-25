---
description: Whitepaper step 08 - Finalisasi dokumen dan insert ke DB
---

# 08-build

Finalisasi dokumen dan insert ke DB.

## Prev

Dari `/whitepaper-07-design`

```bash
export ARTICLE_JSON="/tmp/tam-article.json"
```

**CRITICAL:** Whitepaper disimpan langsung di DB (tabel `whitepapers`). Tidak ada file Markdown, tidak ada frontmatter. Pastikan `DATABASE_URL` di `.env.local`.

## Pre-Flight DB Check

```bash
npx tsx -e "
const fs = require('fs'); const path = require('path');
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const t = line.trim(); if (!t || t.startsWith('#')) return;
    const i = t.indexOf('='); if (i === -1) return;
    process.env[t.substring(0, i).trim()] = t.substring(i + 1).trim();
  });
}
const { db } = require('./lib/db'); const { whitepapers } = require('./lib/db/schema'); const { eq } = require('drizzle-orm');
db.select().from(whitepapers).where(eq(whitepapers.slug, 'SLUG')).then(r => {
  if (r.length > 0) { console.log('FATAL: SLUG ALREADY EXISTS'); process.exit(1); }
  else console.log('SLUG AVAILABLE');
}).catch(e => { console.error('FATAL:', e.message); process.exit(1); });
"
```

## Whitepaper DB fields

- `title`, `slug`, `subtitle`, `summary`, `body` (markdown string)
- `coverImageUrl`, `author` (default: 'TAMPARAN ANAK MUDA'), `downloadUrl`
- `readingTime` (integer, default 10), `tags` (text array)
- `status` ('draft' atau 'published'), `publishedAt` (timestamp)
- Tidak ada frontmatter, POV tag, atau SEO fields terpisah

## Insert command (DB via Drizzle ORM)

```bash
npx tsx -e "
const fs = require('fs'); const path = require('path');
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const t = line.trim(); if (!t || t.startsWith('#')) return;
    const i = t.indexOf('='); if (i === -1) return;
    process.env[t.substring(0, i).trim()] = t.substring(i + 1).trim();
  });
}
const { db } = require('./lib/db'); const { whitepapers } = require('./lib/db/schema');
const wp = JSON.parse(fs.readFileSync(process.env.ARTICLE_JSON || '/tmp/tam-article.json', 'utf8'));

if (!wp.slug || !wp.title || !wp.body) { console.error('FATAL: slug, title, body required'); process.exit(1); }
if (!wp.published_at) { console.error('FATAL: published_at required'); process.exit(1); }

db.insert(whitepapers).values({
  slug: wp.slug, title: wp.title, subtitle: wp.subtitle || null,
  summary: wp.summary || null, body: wp.body,
  coverImageUrl: wp.cover_image_url || null, author: wp.author || 'TAMPARAN ANAK MUDA',
  downloadUrl: wp.download_url || null, readingTime: wp.reading_time || 10,
  tags: wp.tags || [], status: wp.status === 'scheduled' ? 'draft' : (wp.status || 'published'),
  publishedAt: wp.published_at,
}).then(() => {
  console.log('Whitepaper inserted:', wp.slug, '| status:', wp.status || 'published', '| reading_time:', wp.reading_time || 10);
}).catch(e => { console.error('FATAL:', e.message); process.exit(1); });
"
```

## Post-Insert Verification

```bash
npx tsx -e "
const fs = require('fs'); const path = require('path');
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const t = line.trim(); if (!t || t.startsWith('#')) return;
    const i = t.indexOf('='); if (i === -1) return;
    process.env[t.substring(0, i).trim()] = t.substring(i + 1).trim();
  });
}
const { db } = require('./lib/db'); const { whitepapers } = require('./lib/db/schema'); const { eq } = require('drizzle-orm');
db.select().from(whitepapers).where(eq(whitepapers.slug, 'SLUG')).then(r => {
  const w = r[0]; if (!w) { console.error('FATAL: not found'); process.exit(1); }
  console.log('slug:', w.slug, '| status:', w.status, '| publishedAt:', w.publishedAt, '| readingTime:', w.readingTime, '| body:', w.body.length, 'chars');
  console.log('All checks passed.');
}).catch(e => { console.error('FATAL:', e.message); process.exit(1); });
"
```

## Checklist

- [ ] Slug uniqueness dicek di DB
- [ ] Whitepaper inserted ke DB
- [ ] `status` = `published` atau `draft`
- [ ] `publishedAt` tidak null
- [ ] `body` tidak kosong
- [ ] `readingTime` > 0

## Next

Lanjut ke `/whitepaper-09-qc`
