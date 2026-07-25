---
description: Whitepaper step 08 - Finalisasi dokumen dan simpan sebagai file Markdown
---

# 08-build

Finalisasi dokumen dan simpan sebagai file Markdown di `content/whitepaper/`.

## Prev

Dari `/whitepaper-07-design`

```bash
export ARTICLE_JSON="/tmp/tam-article.json"
```

**CRITICAL:** Whitepaper disimpan sebagai file Markdown di `content/whitepaper/`. Tidak ada DB insert. Pastikan frontmatter lengkap.

## Pre-Flight File Check

```bash
npx tsx -e "
const { existsSync } = require('fs');
const { join } = require('path');
const slug = 'SLUG_WHITEPAPER';
const filePath = join(process.cwd(), 'content', 'whitepaper', slug + '.md');
console.log('SLUG CHECK:', existsSync(filePath) ? 'FATAL: FILE EXISTS' : 'SLUG AVAILABLE: ' + slug);
"
```

## Whitepaper frontmatter fields

- `title`, `slug`, `subtitle`, `summary`
- `coverImageUrl` (null jika pakai OG image dynamic)
- `author` (default: 'TAMPARAN ANAK MUDA'), `downloadUrl`
- `readingTime` (integer, default 10), `tags` (array)
- `status` ('draft' atau 'published'), `publishedAt` (ISO date string)

## Insert command (write file Markdown)

```bash
npx tsx -e "
const fs = require('fs'); const path = require('path');
const wp = JSON.parse(fs.readFileSync(process.env.ARTICLE_JSON || '/tmp/tam-article.json', 'utf8'));

if (!wp.slug || !wp.title || !wp.body) { console.error('FATAL: slug, title, body required'); process.exit(1); }
if (!wp.published_at) { console.error('FATAL: published_at required'); process.exit(1); }

const dir = path.join(process.cwd(), 'content', 'whitepaper');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const frontmatter = [
  'title: ' + JSON.stringify(wp.title),
  'slug: ' + JSON.stringify(wp.slug),
  wp.subtitle ? 'subtitle: ' + JSON.stringify(wp.subtitle) : 'subtitle: null',
  wp.summary ? 'summary: ' + JSON.stringify(wp.summary) : 'summary: null',
  wp.cover_image_url ? 'coverImageUrl: ' + JSON.stringify(wp.cover_image_url) : 'coverImageUrl: null',
  'author: ' + JSON.stringify(wp.author || 'TAMPARAN ANAK MUDA'),
  wp.download_url ? 'downloadUrl: ' + JSON.stringify(wp.download_url) : 'downloadUrl: null',
  'readingTime: ' + (wp.reading_time || 10),
  'tags: ' + JSON.stringify(wp.tags || []),
  'status: ' + JSON.stringify(wp.status === 'scheduled' ? 'draft' : (wp.status || 'published')),
  'publishedAt: ' + JSON.stringify(wp.published_at),
].join('\n');

const fileContent = '---\n' + frontmatter + '\n---\n\n' + wp.body + '\n';
const filePath = path.join(dir, wp.slug + '.md');
fs.writeFileSync(filePath, fileContent, 'utf8');
console.log('Whitepaper written:', wp.slug, '| status:', wp.status || 'published', '| reading_time:', wp.reading_time || 10);
"
```

## Post-Insert Verification

```bash
npx tsx -e "
const { existsSync, readFileSync, statSync } = require('fs');
const { join } = require('path');
const matter = require('gray-matter');
const filePath = join(process.cwd(), 'content', 'whitepaper', 'SLUG_WHITEPAPER.md');
if (!existsSync(filePath)) { console.error('FATAL: file not found'); process.exit(1); }
const { data, content } = matter(readFileSync(filePath, 'utf8'));
console.log('slug:', data.slug, '| status:', data.status, '| publishedAt:', data.publishedAt, '| readingTime:', data.readingTime, '| body:', content.length, 'chars');
console.log('All checks passed.');
"
```

## Checklist

- [ ] Slug uniqueness dicek (file tidak exists)
- [ ] File `content/whitepaper/SLUG.md` created
- [ ] Frontmatter lengkap dan valid
- [ ] `status` = `published` atau `draft`
- [ ] `publishedAt` tidak null
- [ ] `body` tidak kosong
- [ ] `readingTime` > 0

## Next

Lanjut ke `/whitepaper-09-qc`
