---
description: Artikel step 06 - Upload ke CMS (file Markdown), meta SEO, schema, gambar, internal/external link
---

# 06-build

Upload ke CMS (file Markdown), meta SEO, schema, gambar, dan internal/external link.

## Env Var Reference

| Env Var | Fungsi | Scope |
|---------|--------|-------|
| `DATABASE_URL` | PostgreSQL connection string untuk Drizzle | Server only |
| `CDN_BASE_URL` | CDN domain (`https://cdn.tamparananakmuda.com`) | Public |

```bash
export ARTICLE_JSON="/tmp/tam-article.json"
```

**CRITICAL:** Artikel disimpan sebagai file Markdown di `content/articles/`. DB hanya untuk `post_metadata` (OG URLs). Jangan pakai Supabase REST API.

## Pre-Flight File Check

```bash
npx tsx -e "
const { existsSync } = require('fs');
const { join } = require('path');
const { categories, authors, getCategoryBySlug, getAuthorBySlug } = require('./content/config');
const slug = 'SLUG_ARTIKEL';
const filePath = join(process.cwd(), 'content', 'articles', slug + '.md');
console.log('SLUG CHECK:', existsSync(filePath) ? 'FATAL: FILE EXISTS' : 'SLUG AVAILABLE: ' + slug);
const cat = getCategoryBySlug('CATEGORY_SLUG');
console.log('Category valid:', cat ? cat.title : 'FATAL: CATEGORY NOT FOUND');
const auth = getAuthorBySlug('AUTHOR_SLUG');
console.log('Author valid:', auth ? auth.name : 'FATAL: AUTHOR NOT FOUND');
"
```

## Frontmatter fields

- `title`, `slug`, `excerpt`, `body`, `publishedAt`, `status`
- `category` (slug), `subcategory` (slug/null), `author` (slug)
- `series` (null), `seriesOrder` (null)
- `povTag`, `tags` (array), `ogHeadline`
- `seoMetaTitle`, `seoMetaDescription`, `seoKeywords` (array)
- `sourceReferences` (array `{type, url, label}`)
- `featured`, `humanSignature`, `factCheckStatus`, `reviewStatus`
- `coverImageUrl`, `coverImageAlt` (null jika pakai OG image dynamic)

## CRITICAL rules

- `sourceReferences`: HARUS array, bukan string
- `excerpt`: MAX 160 karakter
- `seoMetaDescription`: MAX 160 karakter
- `readingTime`: Tidak perlu set. Loader auto-calculate
- `publishedAt`: WAJIB set. Jika null, artikel tidak muncul di homepage

## Scheduling Strategy

- **Publish langsung:** `"status": "published"`, `"published_at"` di now/past
  - `publishedAt` HARUS di masa lalu atau sekarang (UTC)
  - QC harus dilakukan SEBELUM insert. Begitu file dibuat, langsung live.
- **Scheduled:** `"status": "scheduled"`, `"published_at"` di masa depan
  - Cron job every 5 min auto-publish saat `publishedAt <= now()`
  - Cron juga auto-generate OG images
  - Tidak perlu code deploy

## Insert command (buat file Markdown)

```bash
npx tsx -e "
const { readFileSync, writeFileSync, mkdirSync } = require('fs');
const { join } = require('path');
const article = JSON.parse(readFileSync(process.env.ARTICLE_JSON || '/tmp/tam-article.json', 'utf8'));

if (article.excerpt && article.excerpt.length > 160) { console.error('FATAL: excerpt > 160 chars'); process.exit(1); }
if (article.seo_meta_description && article.seo_meta_description.length > 160) { console.error('FATAL: seo_meta_description > 160 chars'); process.exit(1); }
if (!Array.isArray(article.source_references)) { console.error('FATAL: source_references must be array'); process.exit(1); }
if (!article.published_at) { console.error('FATAL: published_at is required'); process.exit(1); }
if (!article.slug || !article.title || !article.body) { console.error('FATAL: slug, title, body are required'); process.exit(1); }

const frontmatter = {
  title: article.title, slug: article.slug, excerpt: article.excerpt || '',
  publishedAt: article.published_at, status: article.status === 'scheduled' ? 'scheduled' : 'published',
  category: article.category || 'kehidupan', subcategory: article.subcategory || null,
  author: article.author || 'yovie-setiawan', series: null, seriesOrder: null,
  povTag: article.pov_tag || 'data', tags: [], ogHeadline: article.og_headline || article.title,
  seoMetaTitle: article.seo_meta_title || '', seoMetaDescription: article.seo_meta_description || '',
  seoKeywords: article.seo_keywords || [],
  sourceReferences: article.source_references.map((r) => ({ type: r.type || 'link', url: r.url, label: r.label || '' })),
  featured: article.featured || false, humanSignature: article.human_signature !== false,
  factCheckStatus: 'verified', reviewStatus: 'publish',
  isSponsored: false, sponsorName: null, sponsorUrl: null, sponsorDisclosure: null,
  isPremium: false, premiumExcerpt: null, coverImageUrl: null, coverImageAlt: null,
};

function toYaml(obj, indent = '') {
  let lines = [];
  for (const [key, value] of Object.entries(obj)) {
    if (value === null) { lines.push(indent + key + ': null'); }
    else if (typeof value === 'string') { lines.push(indent + key + ': \"' + value.replace(/\"/g, '\\\"') + '\"'); }
    else if (typeof value === 'boolean' || typeof value === 'number') { lines.push(indent + key + ': ' + value); }
    else if (Array.isArray(value)) {
      if (value.length === 0) { lines.push(indent + key + ': []'); }
      else if (typeof value[0] === 'string') { lines.push(indent + key + ':'); value.forEach(v => lines.push(indent + '  - \"' + v.replace(/\"/g, '\\\"') + '\"')); }
      else { lines.push(indent + key + ':'); value.forEach(v => { lines.push(indent + '  - ' + (typeof v === 'object' ? JSON.stringify(v) : v)); }); }
    } else if (typeof value === 'object') { lines.push(indent + key + ':'); lines.push(toYaml(value, indent + '  ')); }
  }
  return lines.join('\n');
}

const yaml = toYaml(frontmatter);
const markdown = '---\n' + yaml + '\n---\n\n' + article.body + '\n';
const articlesDir = join(process.cwd(), 'content', 'articles');
mkdirSync(articlesDir, { recursive: true });
const filePath = join(articlesDir, article.slug + '.md');
writeFileSync(filePath, markdown, 'utf8');
console.log('File created:', filePath);
console.log('slug:', article.slug, '| status:', frontmatter.status, '| published_at:', frontmatter.publishedAt);
"
```

## Post-Insert Verification

```bash
npx tsx -e "
const { readFileSync } = require('fs');
const { join } = require('path');
const matter = require('gray-matter');
const filePath = join(process.cwd(), 'content', 'articles', 'SLUG' + '.md');
const { data: f, content: body } = matter(readFileSync(filePath, 'utf8'));
console.log('slug:', f.slug, '| status:', f.status, '| publishedAt:', f.publishedAt);
console.log('category:', f.category, '| author:', f.author);
console.log('sourceReferences isArray:', Array.isArray(f.sourceReferences));
const issues = [];
if (!f.publishedAt) issues.push('publishedAt is null');
if (!f.author) issues.push('author is null');
if (!f.category) issues.push('category is null');
if (!Array.isArray(f.sourceReferences)) issues.push('sourceReferences not array');
if (f.excerpt && f.excerpt.length > 160) issues.push('excerpt > 160');
if (issues.length) { console.error('ISSUES:', issues.join(', ')); process.exit(1); }
else console.log('All checks passed.');
"
```

## Update article inventory (WAJIB)

Update `files/article-inventory.md` dengan baris baru:
```
| [N] | [Title] | [slug] | [Kategori] | [Pillar] | [POV] | [YYYY-MM-DD] |
```

## Checklist

- [ ] Slug uniqueness dicek
- [ ] Category dan author valid
- [ ] File `content/articles/SLUG.md` created
- [ ] Frontmatter lengkap dan valid
- [ ] `sourceReferences` isArray = true
- [ ] `excerpt` <= 160 chars
- [ ] `publishedAt` tidak null
- [ ] Article inventory updated

## Next

Lanjut ke `/artikel-07-qc`
