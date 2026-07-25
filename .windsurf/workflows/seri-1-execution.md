---
description: Workflow eksekusi seri multi-part TAM, dari tema sampai iterasi
---

# Seri Execution Workflow

Workflow untuk seri (multi-part). Setiap part disimpan sebagai file Markdown di `content/articles/` dengan `series` dan `seriesOrder` wajib diisi.

## Env Var Reference

| Env Var | Fungsi | Scope |
|---------|--------|-------|
| `DATABASE_URL` | PostgreSQL connection string untuk Drizzle | Server only |
| `NEXT_PUBLIC_SITE_URL` | URL production | Public |
| `BREVO_API_KEY` | Newsletter | Server only |
| `R2_ACCESS_KEY_ID` | Cloudflare R2 S3 access key | Server only |
| `R2_SECRET_ACCESS_KEY` | Cloudflare R2 S3 secret | Server only |
| `R2_ENDPOINT` | R2 S3 endpoint URL | Server only |
| `R2_BUCKET_NAME` | R2 bucket name (`cdn-tam`) | Server only |
| `CDN_BASE_URL` | CDN domain (`https://cdn.tamparananakmuda.com`) | Public |
| `CRON_SECRET` | Auth secret untuk cron API auto-publish | Server only |

```bash
export ARTICLE_JSON="/tmp/tam-article.json"
```

**CRITICAL:** Seri disimpan sebagai file Markdown di `content/articles/`. DB hanya untuk `post_metadata`. Jangan pakai Supabase REST API.

---

## 01-idea

Menentukan tema utama seri.

**Untuk ide dari workflow `/content-ideation`:** Langsung lanjut ke 02-strategy dengan ide yang sudah terpilih.

**Angle Test (2 pertanyaan wajib):**
1. "Apakah ada media lain yang akan menulis seri ini dengan cara yang sama?" Jika ya, rewrite angle.
2. "Kalau saya hapus nama TAM, apakah pembaca tahu ini tulisan TAM?" Jika tidak, terlalu generik.

**POV Selection (wajib pilih salah satu):**
- `kontra-narasi`, `refleksi`, `data`, `framework`, `tamparan`, `riset`, `opini`, `panduan`, `inspirasi`

**Category Reference:**
| Slug | Title | Color |
|------|-------|-------|
| `mindset` | Mindset | #D13A3A |
| `karier` | Karier | #4080D9 |
| `kehidupan` | Kehidupan | #40B880 |
| `uang` | Uang | #D9A040 |
| `bisnis` | Bisnis | #A040D9 |
| `teknologi` | Teknologi | #6040D9 |

**Checklist:**
- [ ] Tema utama seri ditentukan
- [ ] Target audience jelas
- [ ] Search intent dianalisis
- [ ] Goal seri didefinisikan
- [ ] Angle test lolos
- [ ] POV tag dipilih
- [ ] Category dipilih

---

## 02-strategy

Menentukan alur pembelajaran atau storytelling seri.

**Framework Seri:**
- Tentukan alur: kronologis, problem-solution, progressive complexity, atau thematic
- Setiap part harus berdiri sendiri sebagai artikel, tapi terhubung ke tema seri
- Tentukan jumlah part dan estimasi word count per part (1.000-2.500 kata per part)

**Prasyarat:** Definisikan seri di `content/config.ts`:
```typescript
export const series: SeriesConfig[] = [
  { id: 'uuid-generated', title: 'Nama Seri', slug: 'slug-seri', description: 'Deskripsi seri' },
];
```

**Naming convention slug (WAJIB):**
```
{series-slug}-part-{n}-{article-slug}
```
Contoh: `detoks-dopamin-part-1-kenapa-kamu-kecanduan`

**Checklist:**
- [ ] Alur pembelajaran/storytelling ditentukan
- [ ] Jumlah part ditentukan
- [ ] Seri didefinisikan di `content/config.ts`
- [ ] Naming convention slug dipahami

---

## 03-research

Keyword research, competitor analysis, data pendukung, dan referensi untuk seluruh seri.

**Keyword Research:**
- Target: 3-8 keyword long-tail per part, Bahasa Indonesia
- Identifikasi keyword yang bisa dipakai di multiple parts

**Competitor Analysis:**
- Cek apakah ada seri serupa dari media lain
- Identifikasi gap: apa yang mereka tidak bahas?

**Data Pendukung:**
- Kumpulkan data sources untuk seluruh seri
- Pastikan data cukup untuk semua part

**Checklist:**
- [ ] Keyword research per part selesai
- [ ] Competitor analysis selesai
- [ ] Data pendukung cukup untuk semua part
- [ ] Semua source URL aktif

---

## 04-outline

Outline setiap episode/part.

**Heading Structure (CRITICAL untuk Table of Contents):**
- `##` (h2) untuk section utama, `###` (h3) untuk sub-section
- JANGAN gunakan `#` (h1) di body
- Minimal 3 heading h2 per part

**Internal Linking Plan:**
- Minimal 2 link ke artikel TAM lain per part
- WAJIB link ke part sebelumnya dan sesudahnya dalam seri (jika ada)
- Format: `[judul](/artikel/slug-artikel)`

**SEO Metadata Plan per part:**
- Meta Title: `[Keyword Utama] + [Hook] | TAM` (max 70 karakter)
- Meta Description: `[Konteks] + [Value Prop] + [CTA]` (max 160 karakter)
- Slug: `{series-slug}-part-{n}-{article-slug}`, max 60 karakter
- OG Headline: berbeda dari title, max 50 karakter, conversational

**Checklist:**
- [ ] Outline per part lengkap (min 3 h2 per part)
- [ ] Internal linking plan: min 2 link + link antar part
- [ ] SEO metadata per part direncanakan
- [ ] OG headline per part direncanakan

---

## 05-draft

Menulis seluruh episode.

**Word Count (STANDAR TAM):**
- Target: 1.000-2.500 kata per part (5-12 menit baca per part)
- Referensi: `files/templates/article-template.md`, `files/ContentStrategy.md`

**Markdown Rules:**
- Tidak ada raw HTML `<script>`, `<iframe>`, `<style>`
- Gunakan `![alt](url)` untuk gambar
- Jangan tambahkan CTA "Dukung TAM" manual

**Punctuation:**
- Tidak pakai em dash (—) atau en dash (–)
- Maks 1 exclamation mark per part
- Tidak pakai ellipsis (...)

**Tone TAM:**
- Jujur, rasional, berani, tidak menggurui
- Human signature: minimal 1 paragraf pengalaman/observasi/opini spesifik per part

**Seri JSON Template (simpan ke `$ARTICLE_JSON`):**
```json
{
  "title": "Judul Part 1",
  "slug": "series-slug-part-1-artikel-slug",
  "excerpt": "Excerpt max 160 karakter",
  "body": "## Heading 1\n\nKonten...\n\n## Heading 2\n\nKonten...",
  "category": "kehidupan",
  "subcategory": "mindset-realita",
  "author": "yovie-setiawan",
  "status": "published",
  "seo_keywords": ["keyword 1", "keyword 2", "keyword 3"],
  "pov_tag": "data",
  "human_signature": true,
  "source_references": [
    {"type": "link", "url": "https://sumber.com", "label": "Nama Sumber"}
  ],
  "featured": false,
  "seo_meta_title": "SEO Title max 70",
  "seo_meta_description": "SEO desc max 160",
  "og_headline": "OG headline max 50",
  "published_at": "2026-01-01T00:00:00.000Z",
  "series": "slug-seri-dari-config",
  "series_order": 1
}
```

**Checklist:**
- [ ] Semua part ditulis lengkap
- [ ] Word count per part: 1.000-2.500 kata
- [ ] Heading: h2/h3 only, min 3 h2 per part
- [ ] Internal linking: min 2 link + link antar part
- [ ] `series` dan `series_order` diisi di JSON
- [ ] JSON disimpan ke `$ARTICLE_JSON`

---

## 06-review

Review kesinambungan antar episode.

**Review Editorial:**
- Apakah alur antar part logis dan mengalir?
- Apakah tidak ada repetisi berlebihan antar part?
- Apakah setiap part bisa berdiri sendiri?
- Apakah tone konsisten di seluruh seri?

**Validasi Fakta:**
- Setiap angka punya sumber yang bisa ditrace
- Data tidak outdated (max 2 tahun untuk data ekonomi)

**Cek Logika:**
- Argumen konsisten antar part
- Tidak ada kontradiksi antar part

**Checklist:**
- [ ] Kesinambungan antar part dicek
- [ ] Tidak ada repetisi berlebihan
- [ ] Setiap part bisa berdiri sendiri
- [ ] Tone konsisten di seluruh seri
- [ ] Semua klaim terverifikasi

---

## 07-build

CMS, internal link, previous/next navigation.

**Pre-Flight File Check:**
```bash
npx tsx -e "
const { existsSync } = require('fs');
const { join } = require('path');
const { categories, authors, series, getCategoryBySlug, getAuthorBySlug } = require('./content/config');
console.log('=== SERIES ===');
series.forEach(s => console.log(s.slug + ' | ' + s.title));
const slug = 'SLUG_ARTIKEL';
const filePath = join(process.cwd(), 'content', 'articles', slug + '.md');
console.log('SLUG CHECK:', existsSync(filePath) ? 'FATAL: FILE EXISTS' : 'SLUG AVAILABLE: ' + slug);
"
```

**Frontmatter fields:**
- `title`, `slug`, `excerpt`, `body`, `publishedAt`, `status`
- `category` (slug), `subcategory` (slug/null), `author` (slug)
- `series` (slug seri dari config) — WAJIB
- `seriesOrder` (number, mulai dari 1) — WAJIB
- `povTag`, `tags` (array), `ogHeadline`
- `seoMetaTitle`, `seoMetaDescription`, `seoKeywords` (array)
- `sourceReferences` (array `{type, url, label}`)

**Scheduling Strategy:**
- **Publish langsung:** `status: "published"`, `published_at` di now/past
- **Scheduled:** `status: "scheduled"`, `published_at` di masa depan. Cron auto-publish + auto-generate OG.

**Insert command (buat file Markdown per part):**
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

**Post-Insert Verification:**
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

**Update article inventory (WAJIB):** Update `files/article-inventory.md` per part.

**Checklist:**
- [ ] Seri didefinisikan di `content/config.ts`
- [ ] Slug uniqueness dicek per part
- [ ] File `content/articles/SLUG.md` created per part
- [ ] `series` dan `seriesOrder` valid di frontmatter
- [ ] Article inventory updated per part

---

## 08-qc

Grammar, fakta, dan konsistensi.

**All-in-One QC Audit (jalankan sampai CLEAN):**
```bash
npx tsx -e "
const fs = require('fs');
const a = JSON.parse(fs.readFileSync(process.env.ARTICLE_JSON || '/tmp/tam-article.json', 'utf8'));
const body = a.body || ''; const title = a.title || ''; const excerpt = a.excerpt || '';
const full = body + ' ' + title + ' ' + excerpt;
const issues = [];
if (full.includes('\u2014') || full.includes('\u2013')) issues.push('Em/en dash found');
if (body.includes('\u201c') || body.includes('\u201d')) issues.push('Curly quotes');
const exclCount = (body.match(/!/g) || []).length;
if (exclCount > 1) issues.push('Exclamation marks: ' + exclCount);
const aiEn = ['crucial','pivotal','vibrant','tapestry','delve','showcase','underscore','testament','foster','garner','intricate','landscape','additionally','enduring','enhance','highlight','interplay','multifaceted','nuanced','robust','holistic','paradigm','leverage','realm','seamless','empower','transform','unlock','unleash'];
const foundEn = aiEn.filter(w => body.toLowerCase().includes(w));
if (foundEn.length) issues.push('AI vocab EN: ' + foundEn.join(', '));
const aiId = ['signifikan','krusial','esensial','vital','mendalam','memperhatikan','pada dasarnya','secara fundamental','pada intinya','pada akhirnya','menariknya','perlu dicatat','perlu diingat','tidak dapat dipungkiri'];
const foundId = aiId.filter(w => body.toLowerCase().includes(w));
if (foundId.length) issues.push('AI vocab ID: ' + foundId.join(', '));
const sentences = body.split(/[.!?]\s+/);
let currentRun = 0, maxRun = 0;
for (const s of sentences) { if (s.split(/\s+/).length <= 6) { currentRun++; maxRun = Math.max(maxRun, currentRun); } else currentRun = 0; }
if (maxRun >= 3) issues.push('Staccato drama');
const triples = body.match(/(\w+,\s+\w+,\s+(?:dan|and)\s+\w+)/g) || [];
if (triples.length > 2) issues.push('Rule of three: ' + triples.length);
const neg = body.match(/(tidak hanya.*tapi juga|bukan hanya.*melainkan|not only.*but also)/gi) || [];
if (neg.length) issues.push('Negative parallelisms: ' + neg.length);
const promo = ['game-changing','revolutionary','groundbreaking','cutting-edge','seamless','empower','transform','unlock','unleash','supercharge','skyrocket'];
const foundPromo = promo.filter(w => body.toLowerCase().includes(w));
if (foundPromo.length) issues.push('Promotional: ' + foundPromo.join(', '));
const signs = ['let.s dive','here.s what you need','marilah kita','berikut adalah hal yang perlu','tanpa berpanjang lebar'];
if (signs.some(w => new RegExp(w, 'i').test(body))) issues.push('Signposting detected');
const fillers = ['in order to','due to the fact','at this point in time','it is important to note','perlu diketahui bahwa'];
const foundFillers = fillers.filter(w => body.toLowerCase().includes(w));
if (foundFillers.length) issues.push('Filler: ' + foundFillers.join(', '));
const generic = ['the future looks bright','exciting times','masa depan yang cerah','awal dari sesuatu yang besar','peluang tak terbatas'];
const foundGeneric = generic.filter(w => body.toLowerCase().includes(w));
if (foundGeneric.length) issues.push('Generic conclusion: ' + foundGeneric.join(', '));
const personal = (body.match(/\bkita\b|\bkamu\b|\bsaya\b/gi) || []).length;
if (personal < 3) issues.push('Human signature weak (need 3+)');
const lines = body.split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].startsWith('## ') && i + 1 < lines.length) {
    const next = lines[i+1].trim() || (lines[i+2] ? lines[i+2].trim() : '');
    if (next) {
      const hw = new Set(lines[i].replace('## ','').toLowerCase().split(/\s+/));
      const nw = new Set(next.toLowerCase().split(/\s+/));
      if ([...hw].filter(w => nw.has(w)).length >= 2) issues.push('Fragmented header: \"' + lines[i].trim() + '\"');
    }
  }
}
const h1 = (body.match(/^# /gm) || []).length;
const h2 = (body.match(/^## /gm) || []).length;
if (h1 > 0) issues.push('h1 found: ' + h1);
if (h2 < 3) issues.push('h2 count: ' + h2 + ' (need min 3)');
const il = (body.match(/\]\(\/artikel\//g) || []).length;
if (il < 2) issues.push('Internal links: ' + il + ' (need min 2)');
const wc = body.split(/\s+/).filter(w => w.length > 0).length;
if (wc < 1000) issues.push('Word count: ' + wc + ' (need min 1.000)');
if (wc > 2500) issues.push('Word count: ' + wc + ' (max 2.500)');
const og = a.og_headline || '';
if (!og) issues.push('og_headline: MISSING');
else if (og === title) issues.push('og_headline == title');
else if (og.length > 50) issues.push('og_headline length: ' + og.length + ' (max 50)');
if (!a.series) issues.push('series: MISSING (required)');
if (!a.series_order) issues.push('series_order: MISSING (required)');
const refs = a.source_references || [];
if (!Array.isArray(refs)) issues.push('source_references: must be array');
if (excerpt.length > 160) issues.push('Excerpt > 160');
const seoDesc = a.seo_meta_description || '';
if (seoDesc.length > 160) issues.push('SEO desc > 160');
console.log('=== QC AUDIT (SERI) ===');
console.log('Word count:', wc, '| h2:', h2, '| internal links:', il, '| series:', a.series, '| order:', a.series_order);
if (issues.length) { console.log('\nFAIL (' + issues.length + '):'); issues.forEach(i => console.log('  - ' + i)); process.exit(1); }
else console.log('\nCLEAN: All checks passed.');
"
```

**Checklist:**
- [ ] Grammar clean per part
- [ ] Fakta terverifikasi per part
- [ ] Konsistensi antar part dicek
- [ ] SEO metadata valid per part
- [ ] QC audit CLEAN per part

---

## 09-humanizer

Menyamakan tone seluruh seri.

**Humanizer rules lengkap:** Lihat `files/HumanizerRules.md`.

**Yang diperbaiki di step ini:**
- Flow kalimat: perbaiki transisi yang terlalu formal/robotik
- Hilangkan pola AI: staccato drama, rule-of-three abuse, negative parallelisms
- Tambahkan contoh konkret
- Natural tone: ganti kata formal AI dengan kata natural
- **Konsistensi tone antar part:** pastikan semua part punya voice yang sama
- Human signature: minimal 1 paragraf pengalaman/observasi/opini spesifik per part

**Checklist:**
- [ ] No em dash, no en dash, no curly quotes (semua part)
- [ ] No AI vocab EN/ID (semua part)
- [ ] Tone konsisten di seluruh seri
- [ ] Human signature per part
- [ ] `human_signature: true` di JSON per part

---

## 10-schedule

Jadwal rilis.

**Scheduling Strategy:**
- Setiap hari minimal 1 artikel di-publish
- Jam posting ideal: 08:00 WIB (01:00 UTC), 12:00 WIB (05:00 UTC), 17:00 WIB (10:00 UTC)
- **Publish langsung:** `status: "published"`, `published_at` di now/past
- **Scheduled:** `status: "scheduled"`, `published_at` di masa depan
  - Cron job every 5 min auto-publish + auto-generate OG images
  - Tidak perlu code deploy

**Verifikasi scheduling:**
```bash
npx tsx -e "
const { readFileSync } = require('fs');
const { join } = require('path');
const matter = require('gray-matter');
const filePath = join(process.cwd(), 'content', 'articles', 'SLUG' + '.md');
const { data: f } = matter(readFileSync(filePath, 'utf8'));
console.log('status:', f.status, '| publishedAt:', f.publishedAt);
if (f.status === 'scheduled') {
  const pubDate = new Date(f.publishedAt); const now = new Date();
  if (pubDate <= now) console.error('WARNING: publishedAt is past but status is scheduled!');
  else console.log('Will auto-publish in ~' + Math.ceil((pubDate.getTime() - now.getTime()) / 60000) + ' minutes');
}
"
```

**Checklist:**
- [ ] Jadwal rilis per part ditentukan
- [ ] `status` dan `publishedAt` benar per part
- [ ] `CRON_SECRET` set di Vercel dan GitHub Secrets (jika scheduled)
- [ ] GitHub Actions workflow deployed

---

## 11-publish

Publikasi.

**OG Image Generation (wajib untuk publish langsung, skip untuk scheduled):**
```bash
curl -s -X POST "https://tamparananakmuda.com/api/og/generate" \
  -H "Content-Type: application/json" -H "Cookie: <admin-session-cookie>" \
  -d '{"slug":"SLUG"}'
```

**Deploy:**
```bash
git add -A && git commit -m "feat: add new seri part SLUG" && git push origin main
```

**Verifikasi production:**
```bash
curl -s -o /dev/null -w "article: %{http_code}\n" "https://tamparananakmuda.com/artikel/SLUG"
curl -s "https://tamparananakmuda.com/sitemap.xml" | grep "SLUG" && echo "Sitemap OK" || echo "Sitemap MISSING"
```

**SEO Indexing:**
1. Submit URL ke Google Search Console per part
2. Ping sitemap

**Checklist:**
- [ ] OG images generated per part (atau tunggu cron)
- [ ] `git push` sukses
- [ ] HTTP 200 di production per part
- [ ] Sitemap includes slug per part
- [ ] URL submitted ke Google Search Console per part

---

## 12-distribution

Promosi setiap episode.

### Instagram Carousel (5-8 slides per part + 1 carousel seri overview 10-12 slides)
- Slide 1: Hook headline + visual
- Slide 2-6: Key data points (1 per slide)
- Slide 7: Pertanyaan refleksi
- Slide 8: CTA ke full article

### Newsletter (400-600 words per part)
- Subject line: 1 insight utama, bukan judul
- Kirim via: Brevo dashboard (manual)

### IG Stories (3-5 stories per part)
- Polling, key takeaways, Q&A, link sticker

### TikTok/Reels Script (Phase 2)
- 30-60 detik, 1 insight per video
- CTA: "Baca full artikel di bio"

### X/Twitter Thread (3-5 tweets per part)
- Hook, key insights, quote/data, CTA

### LinkedIn Post (200-400 words per part)
- Hook professional, 1 insight, CTA, 3-5 hashtags

**Checklist:**
- [ ] IG Carousel per part + seri overview
- [ ] Newsletter per part
- [ ] IG Stories per part
- [ ] X/Twitter thread per part
- [ ] LinkedIn post per part

---

## 13-monitor

Retention, completion rate, dan engagement.

**Metrics to track (via Umami):**
- Page views per part
- Completion rate: berapa % pembaca lanjut ke part berikutnya
- Retention: drop-off antar part
- Social engagement per part
- Newsletter CTR per part

**Review schedule:**
- H+1: Cek indexing Google per part
- H+3: Cek social engagement per part
- H+7: Cek completion rate antar part
- H+30: Full performance review seri

**Checklist:**
- [ ] Indexing Google dicek per part (H+1)
- [ ] Social engagement dicek per part (H+3)
- [ ] Completion rate antar part dicek (H+7)
- [ ] Full performance review seri (H+30)

---

## 14-iterate

Perbaikan roadmap berdasarkan data.

**Berdasarkan data dari 13-monitor:**
- Jika part tertentu underperform: analisis kenapa, update content
- Jika completion rate rendah di part X: pertimbangkan rewrite atau merge
- Jika seri overall perform baik: plan seri lanjutan atau spin-off
- Update data jika ada survei baru yang relevan

**Rollback (jika perlu hapus part):**
```bash
rm content/articles/SLUG.md
npx tsx -e "const { readFileSync } = require('fs'); const { join } = require('path'); const envPath = join(process.cwd(), '.env.local'); const envContent = readFileSync(envPath, 'utf8'); envContent.split('\n').forEach((line) => { const t = line.trim(); if (!t || t.startsWith('#')) return; const i = t.indexOf('='); if (i === -1) return; const k = t.substring(0, i).trim(); const v = t.substring(i + 1).trim(); if (!process.env[k]) process.env[k] = v; }); const { db } = require('./lib/db'); const { postMetadata } = require('./lib/db/schema'); const { eq } = require('drizzle-orm'); db.delete(postMetadata).where(eq(postMetadata.slug, 'SLUG')).then(() => console.log('deleted: SLUG')).catch(console.error);"
```

**Checklist:**
- [ ] Data performa seri dianalisis
- [ ] Part underperform diidentifikasi
- [ ] Update/rewrite dilakukan jika perlu
- [ ] Roadmap seri diadjust berdasarkan data
