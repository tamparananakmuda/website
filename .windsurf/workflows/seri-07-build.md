---
description: Seri step 07 - CMS, internal link, previous/next navigation
---

# 07-build

CMS, internal link, previous/next navigation.

## Prev

Dari `/seri-06-review`

## Env Var Reference

| Env Var | Fungsi | Scope |
|---------|--------|-------|
| `DATABASE_URL` | PostgreSQL connection string untuk Drizzle | Server only |
| `CDN_BASE_URL` | CDN domain (`https://cdn.tamparananakmuda.com`) | Public |

```bash
export ARTICLE_JSON="/tmp/tam-article.json"
```

**CRITICAL:** Seri disimpan sebagai file Markdown di `content/seri/SERIES-SLUG/`. DB hanya untuk `post_metadata`. Jangan pakai Supabase REST API.

## Pre-Flight File Check

```bash
npx tsx -e "
const { existsSync } = require('fs');
const { join } = require('path');
const { categories, authors, series, getCategoryBySlug, getAuthorBySlug } = require('./content/config');
console.log('=== SERIES ===');
series.forEach(s => console.log(s.slug + ' | ' + s.title));
const slug = 'SLUG_ARTIKEL';
const filePath = join(process.cwd(), 'content', 'seri', 'SERIES-SLUG', slug + '.md');
console.log('SLUG CHECK:', existsSync(filePath) ? 'FATAL: FILE EXISTS' : 'SLUG AVAILABLE: ' + slug);
"
```

## Frontmatter fields

- `title`, `slug`, `excerpt`, `body`, `publishedAt`, `status`
- `category` (slug), `subcategory` (slug/null), `author` (slug)
- `series` (slug seri dari config) - WAJIB
- `seriesOrder` (number, mulai dari 1) - WAJIB
- `povTag`, `tags` (array), `ogHeadline`
- `seoMetaTitle`, `seoMetaDescription`, `seoKeywords` (array)
- `sourceReferences` (array `{type, url, label}`)

## Scheduling Strategy

- **Publish langsung:** `status: "published"`, `published_at` di now/past
- **Scheduled:** `status: "scheduled"`, `published_at` di masa depan. Cron auto-publish + auto-generate OG.

## Insert command (buat file Markdown per part)

```bash
npx tsx -e "
const { readFileSync, writeFileSync, mkdirSync } = require('fs');
const { join } = require('path');
const article = JSON.parse(readFileSync(process.env.ARTICLE_JSON || '/tmp/tam-article.json', 'utf8'));

if (article.excerpt && article.excerpt.length > 160) { console.error('FATAL: excerpt > 160 chars'); process.exit(1); }
if (!Array.isArray(article.source_references)) { console.error('FATAL: source_references must be array'); process.exit(1); }
if (!article.published_at) { console.error('FATAL: published_at is required'); process.exit(1); }
if (!article.slug || !article.title || !article.body) { console.error('FATAL: slug, title, body required'); process.exit(1); }
if (!article.series) { console.error('FATAL: series is required for Seri'); process.exit(1); }
if (!article.series_order) { console.error('FATAL: series_order is required for Seri'); process.exit(1); }

const frontmatter = {
  title: article.title, slug: article.slug, excerpt: article.excerpt || '',
  publishedAt: article.published_at, status: article.status === 'scheduled' ? 'scheduled' : 'published',
  category: article.category || 'kehidupan', subcategory: article.subcategory || null,
  author: article.author || 'yovie-setiawan',
  series: article.series, seriesOrder: article.series_order,
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
console.log('slug:', article.slug, '| series:', frontmatter.series, '| seriesOrder:', frontmatter.seriesOrder, '| status:', frontmatter.status);
"
```

## Post-Insert Verification

```bash
npx tsx -e "
const { readFileSync } = require('fs');
const { join } = require('path');
const matter = require('gray-matter');
const filePath = join(process.cwd(), 'content', 'articles', 'SLUG' + '.md');
const { data: f } = matter(readFileSync(filePath, 'utf8'));
console.log('slug:', f.slug, '| series:', f.series, '| seriesOrder:', f.seriesOrder, '| status:', f.status);
const issues = [];
if (!f.series) issues.push('series is null (REQUIRED)');
if (!f.seriesOrder) issues.push('seriesOrder is null (REQUIRED)');
if (!f.publishedAt) issues.push('publishedAt is null');
if (issues.length) { console.error('ISSUES:', issues.join(', ')); process.exit(1); }
else console.log('All checks passed.');
"
```

## Update article inventory (WAJIB)

Update `files/article-inventory.md` per part.

## Checklist

- [ ] Seri didefinisikan di `content/config.ts`
- [ ] Slug uniqueness dicek per part
- [ ] File `content/seri/SERIES-SLUG/SLUG.md` created per part
- [ ] `series` dan `seriesOrder` valid di frontmatter per part
- [ ] Article inventory updated per part
- [ ] SEO Metadata Validation: 6 fields pass per part
- [ ] Schema Markup: Article + FAQ (jika ada) per part
- [ ] OG Image: ogHeadline unique, max 50 chars per part
- [ ] Internal Link: min 2 + antar part, semua target exists
- [ ] Interactive blocks (`chart:type`, `calc:type`, `comparison`, `nerd`) punya valid JSON jika ada
- [ ] Reading Progress Bar otomatis tampil (component `ReadingProgress` di artikel page layout)
- [ ] Series Navigation: prev/next link konsisten antar part
- [ ] Post-Insert Verification: CLEAN per part
- [ ] Series Build Quality Score: min 9 (dari 12)

## SEO Metadata Validation per Part

| Field | Rule | Check |
|-------|------|-------|
| **seoMetaTitle** | Max 70, keyword utama | Length + keyword |
| **seoMetaDescription** | Max 160, keyword + hook | Length + keyword |
| **slug** | Kebab-case, max 60, naming convention | Format + convention |
| **excerpt** | Max 160, berbeda dari desc | Length + uniqueness |
| **ogHeadline** | Max 50, berbeda dari title | Length + uniqueness |
| **seoKeywords** | 3-8, muncul di body | Count + body presence |

## Series Navigation Verification

| Check | Cara | Pass criteria |
|-------|------|---------------|
| **Prev link** | Part 2+ punya link ke part sebelumnya | Ada dan format benar |
| **Next link** | Part 1-N-1 punya link ke part berikutnya | Ada dan format benar |
| **Recap link** | Part 2+ punya recap dengan link ke part sebelumnya | Ada dan link aktif |
| **Teaser link** | Part 1-N-1 punya teaser dengan link ke part berikutnya | Ada dan link aktif |
| **Series page** | Semua part muncul di series page | Cek di /seri/SERIES-SLUG |

## Series Build Quality Score (0-12)

Target: min 9.

| Factor | Weight | 0 | 1 | 2 |
|--------|--------|---|---|---|
| **Frontmatter** | 2 | > 3 fields kosong | 1-2 kosong | Semua terisi |
| **Series fields** | 2 | series/seriesOrder missing | Ada tapi salah | Valid + match config |
| **SEO metadata** | 1 | > 2 fail | 1 fail | Semua pass |
| **Navigation** | 2 | No prev/next | Sebagiane | Full prev/next + recap/teaser |
| **Internal links** | 1 | < 2 atau broken | 2-3 | 3+ + antar part |
| **OG headline** | 1 | Missing atau = title | Ada | Unique + punchy |
| **File creation** | 1 | Tidak created | Created tapi path salah | Path benar |
| **Post-insert** | 1 | Tidak di-run | Run tapi issues | CLEAN |
| **Inventory** | 1 | Tidak updated | Updated | Updated + format benar |

Jika score < 9: fix sebelum lanjut ke QC.

## Next

Lanjut ke `/seri-08-qc`
