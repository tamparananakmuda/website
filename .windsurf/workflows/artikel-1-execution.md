---
description: Workflow eksekusi artikel standalone TAM, dari ide sampai update konten
---

# Artikel Execution Workflow

Workflow untuk artikel standalone (bukan seri, bukan whitepaper). Disimpan sebagai file Markdown di `content/articles/`.

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

**CRITICAL:** Artikel disimpan sebagai file Markdown di `content/articles/`. DB hanya untuk `post_metadata` (OG URLs). Jangan pakai Supabase REST API untuk insert konten.

---

## 01-idea

Menentukan topik, target audience, search intent, dan goal artikel.

**Untuk ide dari workflow `/content-ideation`:** Langsung lanjut ke 02-research dengan ide yang sudah terpilih.

**Untuk ide ad-hoc, lakukan Angle Test (2 pertanyaan wajib):**
1. "Apakah ada media lain yang akan menulis ini dengan cara yang sama?" Jika ya, rewrite angle.
2. "Kalau saya hapus nama TAM dari artikel ini, apakah pembaca tahu ini tulisan TAM?" Jika tidak, terlalu generik.

**POV Selection (wajib pilih salah satu):**
- `kontra-narasi` - melawan narasi populer dengan dasar kuat
- `refleksi` - pengalaman/observasi personal yang spesifik
- `data` - data + interpretasi yang tidak obvious
- `framework` - kerangka berpikir original
- `tamparan` - statement tajam yang membongkar ilusi langsung
- `riset` - temuan riset/studi sebagai angle utama
- `opini` - sudut pandang yang berani dan spesifik
- `panduan` - guide praktis berbasis pengalaman nyata
- `inspirasi` - cerita inspiratif tanpa menjual harapan palsu

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
- [ ] Topik ditentukan
- [ ] Target audience jelas
- [ ] Search intent dianalisis (informational, navigational, transactional)
- [ ] Goal artikel didefinisikan (educate, provoke, convert)
- [ ] Angle test lolos (kedua pertanyaan)
- [ ] POV tag dipilih
- [ ] Category dipilih

---

## 02-research

Keyword research, competitor analysis, data pendukung, dan referensi.

**Keyword Research:**
- Target: 3-8 keyword long-tail, Bahasa Indonesia
- Prioritas: search volume medium + difficulty low
- Cek 3 artikel pertama Google untuk keyword target

**Competitor Analysis:**
- Baca 3 artikel pertama Google untuk keyword target
- Identifikasi gap: apa yang mereka tidak bahas?
- Minimal 1 insight unik yang tidak ada di 3 artikel tersebut

**Data Pendukung:**
- Kumpulkan minimal 2 data sources per artikel
- Cek data tidak outdated (max 2 tahun untuk data ekonomi)
- Pastikan URL sumber aktif

**Source Verification (Tier System):**
- **Tier 1:** Terverifikasi langsung dari publikasi asli (URL aktif, data bisa dikonfirmasi)
- **Tier 2:** Tidak terverifikasi langsung (kutipan media sekunder, wajib label atribusi)
- **Yang harus dihapus:** Dead link, sample terlalu kecil (n < 5.000), blog post tanpa data primer

**Command cek HTTP status semua source references:**
```bash
node -e "
const fs = require('fs');
const a = JSON.parse(fs.readFileSync(process.env.ARTICLE_JSON || '/tmp/tam-article.json', 'utf8'));
const refs = a.source_references || [];
(async () => {
  for (const ref of refs) {
    try {
      const res = await fetch(ref.url, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(10000) });
      console.log((res.status >= 200 && res.status < 400 ? 'OK' : 'DEAD') + ' [' + res.status + '] ' + ref.url);
    } catch (e) {
      try {
        const res = await fetch(ref.url, { redirect: 'follow', signal: AbortSignal.timeout(10000) });
        console.log((res.status >= 200 && res.status < 400 ? 'OK' : 'DEAD') + ' [' + res.status + '] ' + ref.url);
      } catch (e2) {
        console.log('DEAD [ERR] ' + ref.url);
      }
    }
  }
})();
"
```

**Checklist:**
- [ ] Keyword research selesai (3-8 long-tail keyword)
- [ ] Competitor analysis selesai (3 artikel Google diperiksa)
- [ ] Minimal 1 insight unik teridentifikasi
- [ ] Data pendukung terkumpul (min 2 sources)
- [ ] Semua source URL aktif (HTTP 200-399)
- [ ] Tidak ada dead link

---

## 03-outline

Struktur H1-H4, FAQ, CTA, dan internal linking plan.

**Heading Structure (CRITICAL untuk Table of Contents):**
- Gunakan `##` (h2) untuk section utama, `###` (h3) untuk sub-section
- JANGAN gunakan `#` (h1) di body, h1 sudah dipakai untuk title
- Minimal 3 heading h2 untuk TOC berfungsi

**Internal Linking Plan:**
- Minimal 2 link ke artikel TAM lain di body
- Cek artikel relevan via `files/article-inventory.md`
- Kalau artikel di kategori yang relevan belum ada, link ke category page: `/kategori/[kategori-slug]`
- Format: `[judul](/artikel/slug-artikel)`

**SEO Metadata Plan:**
- Meta Title Formula: `[Keyword Utama] + [Hook] | TAM` (max 70 karakter)
- Meta Description Formula: `[Konteks] + [Value Prop] + [CTA]` (max 160 karakter)
- Slug: kebab-case, keyword di awal, max 60 karakter, unique

**OG Headline Plan:**
- HARUS berbeda dari `title`. Jangan copy-paste
- Max 50 karakter, punchy, conversational
- Format: kalimat langsung, bukan judul formal
- Contoh: title "PHK Membongkar Ilusi: Kerja Keras Tidak Menjamin Aman" → ogHeadline "Kerja keras tidak menjamin kamu aman dari PHK"

**Checklist:**
- [ ] Struktur H2-H4 lengkap (min 3 h2)
- [ ] FAQ section direncanakan (jika relevan)
- [ ] CTA direncanakan (link ke `/dukung` atau artikel terkait)
- [ ] Internal linking plan: min 2 link ke artikel TAM
- [ ] SEO meta title direncanakan (max 70 chars)
- [ ] SEO meta description direncanakan (max 160 chars)
- [ ] Slug direncanakan (kebab-case, max 60 chars)
- [ ] OG headline direncanakan (max 50 chars, berbeda dari title)

---

## 04-draft

Menulis artikel lengkap mengikuti outline dari 03.

**Word Count (STANDAR TAM):**
- Target: 1.000-2.500 kata (5-12 menit baca)
- Referensi: `files/templates/article-template.md`, `files/ContentStrategy.md`
- Di bawah 1.000 kata = perlu expand depth
- Di atas 2.500 kata = perlu trim atau pecah jadi seri (gunakan workflow `/seri-1-execution`)

**Markdown Rules:**
- Tidak ada raw HTML `<script>`, `<iframe>`, `<style>` di body
- Gunakan `![alt](url)` untuk gambar, bukan `<img>`
- Link eksternal pakai `[text](url)`, tidak perlu `target="_blank"`
- Jangan tambahkan CTA "Dukung TAM" manual di body. CTA otomatis muncul di article page.

**Punctuation:**
- Tidak pakai em dash (—) atau en dash (–)
- Maks 1 exclamation mark per artikel
- Tidak pakai ellipsis (...) sebagai desain

**Tone TAM:**
- Jujur, rasional, berani, tidak menggurui
- "Mengatakan hal yang perlu didengar, bukan yang ingin didengar"
- Human signature: minimal 1 paragraf pengalaman/observasi/opini spesifik

**Simpan draft ke `$ARTICLE_JSON`:**
```json
{
  "title": "Judul Artikel",
  "slug": "slug-artikel-kebab-case",
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
  "featured": true,
  "seo_meta_title": "SEO Title max 70",
  "seo_meta_description": "SEO desc max 160",
  "og_headline": "OG headline max 50",
  "published_at": "2026-01-01T00:00:00.000Z",
  "series": null,
  "series_order": null
}
```

**Command cek heading + internal links + word count:**
```bash
node -e "
const fs = require('fs');
const a = JSON.parse(fs.readFileSync('$ARTICLE_JSON', 'utf8'));
const b = a.body;
const h1 = (b.match(/^# /gm) || []).length;
const h2 = (b.match(/^## /gm) || []).length;
const h3 = (b.match(/^### /gm) || []).length;
console.log('h1:', h1, h1 > 0 ? 'WARNING: jangan pakai h1' : 'OK');
console.log('h2:', h2, h2 < 3 ? 'WARNING: butuh min 3' : 'OK');
console.log('h3:', h3);
const il = (b.match(/\]\(\/artikel\//g) || []).length;
console.log('internal links:', il, il < 2 ? 'WARNING: butuh min 2' : 'OK');
const og = a.og_headline || '';
console.log('og_headline:', og ? og : 'MISSING');
console.log('og_headline == title?', og === a.title ? 'WARNING: harus berbeda!' : 'OK');
console.log('og_headline length:', og.length, og.length > 50 ? 'WARNING: max 50' : 'OK');
const wc = b.split(/\s+/).length;
console.log('word count:', wc, wc < 1000 ? 'WARNING: butuh min 1.000' : wc > 2500 ? 'WARNING: max 2.500' : 'OK');
"
```

**Checklist:**
- [ ] Artikel lengkap ditulis mengikuti outline
- [ ] Word count: 1.000-2.500 kata
- [ ] Heading: h2/h3 only, min 3 h2, tidak ada h1
- [ ] Internal linking: min 2 link ke artikel TAM
- [ ] `sourceReferences`: array `{type, url, label}`
- [ ] `excerpt`: max 160 karakter
- [ ] `ogHeadline`: berbeda dari title, max 50 karakter
- [ ] JSON disimpan ke `$ARTICLE_JSON`

---

## 05-review

Review editorial, validasi fakta, dan cek logika.

**Review Editorial:**
- Apakah argumen utama jelas dan didukung data?
- Apakah struktur logis? (hook → context → data → insight → conclusion)
- Apakah tone konsisten dengan TAM voice?

**Validasi Fakta:**
- Setiap angka punya sumber yang bisa ditrace (URL aktif di sourceReferences)
- Angka di artikel cocok dengan sumber (tidak dibulat-bulat)
- Tidak ada angka tanpa atribusi sumber di kalimat yang sama
- Data tidak outdated (max 2 tahun untuk data ekonomi)

**Cek Logika:**
- Tidak ada kontradiksi internal
- Setiap klaim didukung argumen atau data
- Conclusion mengikuti dari premise

**Content Quality Score (0-100, target > 80):**

| Komponen | Max | Kriteria |
|----------|-----|----------|
| Angle test | 25 | Lolos percobaan pertama (25), kedua (15), ketiga+ (5) |
| Human signature | 25 | Pengalaman personal (25), observasi (20), opini spesifik (15), tidak ada (0) |
| Fact-check | 25 | Semua klaim terverifikasi (25), minor issues (15), flagged (0) |
| POV clarity | 25 | POV tag dipilih dan konsisten (25), tidak konsisten (10), tidak ada (0) |

**Checklist:**
- [ ] Review editorial selesai
- [ ] Semua klaim terverifikasi (URL aktif, data cocok)
- [ ] Tidak ada angka tanpa atribusi sumber
- [ ] Logika argumen konsisten
- [ ] Content Quality Score > 80

---

## 06-build

Upload ke CMS (file Markdown), meta SEO, schema, gambar, dan internal/external link.

**Pre-Flight File Check:**
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

**Frontmatter fields:**
- `title`, `slug`, `excerpt`, `body`, `publishedAt`, `status`
- `category` (slug), `subcategory` (slug/null), `author` (slug)
- `series` (null), `seriesOrder` (null)
- `povTag`, `tags` (array), `ogHeadline`
- `seoMetaTitle`, `seoMetaDescription`, `seoKeywords` (array)
- `sourceReferences` (array `{type, url, label}`)
- `featured`, `humanSignature`, `factCheckStatus`, `reviewStatus`
- `coverImageUrl`, `coverImageAlt` (null jika pakai OG image dynamic)

**CRITICAL rules:**
- `sourceReferences`: HARUS array, bukan string
- `excerpt`: MAX 160 karakter
- `seoMetaDescription`: MAX 160 karakter
- `readingTime`: Tidak perlu set. Loader auto-calculate
- `publishedAt`: WAJIB set. Jika null, artikel tidak muncul di homepage

**Scheduling Strategy:**
- **Publish langsung:** `"status": "published"`, `"published_at"` di now/past
  - `publishedAt` HARUS di masa lalu atau sekarang (UTC)
  - QC harus dilakukan SEBELUM insert. Begitu file dibuat, langsung live.
- **Scheduled:** `"status": "scheduled"`, `"published_at"` di masa depan
  - Cron job every 5 min auto-publish saat `publishedAt <= now()`
  - Cron juga auto-generate OG images
  - Tidak perlu code deploy

**Insert command (buat file Markdown):**
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

**Post-Insert Verification:**
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

**Update article inventory (WAJIB):** Update `files/article-inventory.md` dengan baris baru.

**Checklist:**
- [ ] Slug uniqueness dicek
- [ ] Category dan author valid
- [ ] File `content/articles/SLUG.md` created
- [ ] Frontmatter lengkap dan valid
- [ ] `sourceReferences` isArray = true
- [ ] `excerpt` <= 160 chars
- [ ] `publishedAt` tidak null
- [ ] Article inventory updated

---

## 07-qc

Grammar, SEO, broken link, formatting, dan readability.

**SEO Metadata Validation:**
```bash
npx tsx -e "
const fs = require('fs');
const a = JSON.parse(fs.readFileSync(process.env.ARTICLE_JSON || '/tmp/tam-article.json', 'utf8'));
console.log('SEO title:', (a.seo_meta_title||'').length, 'chars (max 70)');
console.log('SEO desc:', (a.seo_meta_description||'').length, 'chars (max 160)');
console.log('Slug:', (a.slug||'').length, 'chars (max 60)');
console.log('Excerpt:', (a.excerpt||'').length, 'chars (max 160)');
console.log('Keywords:', (a.seo_keywords||[]).length, '(target 3-8)');
const issues = [];
if ((a.seo_meta_title||'').length > 70) issues.push('SEO title > 70');
if ((a.seo_meta_description||'').length > 160) issues.push('SEO desc > 160');
if ((a.excerpt||'').length > 160) issues.push('Excerpt > 160');
if ((a.slug||'').length > 60) issues.push('Slug > 60');
if (!a.seo_keywords || a.seo_keywords.length < 3) issues.push('Keywords < 3');
if (issues.length) { console.log('\nFAIL:', issues.join(', ')); process.exit(1); }
else console.log('\nCLEAN: SEO metadata OK.');
"
```

**All-in-One QC Audit (grammar, pola AI, heading, metadata):**
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
if (exclCount > 1) issues.push('Exclamation marks: ' + exclCount + ' (max 1)');
const aiEn = ['crucial','pivotal','vibrant','tapestry','delve','showcase','underscore','testament','foster','garner','intricate','landscape','additionally','enduring','enhance','highlight','interplay','multifaceted','nuanced','robust','holistic','paradigm','leverage','realm','seamless','empower','transform','unlock','unleash'];
const foundEn = aiEn.filter(w => body.toLowerCase().includes(w));
if (foundEn.length) issues.push('AI vocab EN: ' + foundEn.join(', '));
const aiId = ['signifikan','krusial','esensial','vital','mendalam','memperhatikan','pada dasarnya','secara fundamental','pada intinya','pada akhirnya','menariknya','perlu dicatat','perlu diingat','tidak dapat dipungkiri'];
const foundId = aiId.filter(w => body.toLowerCase().includes(w));
if (foundId.length) issues.push('AI vocab ID: ' + foundId.join(', '));
const sentences = body.split(/[.!?]\s+/);
let currentRun = 0, maxRun = 0;
for (const s of sentences) { if (s.split(/\s+/).length <= 6) { currentRun++; maxRun = Math.max(maxRun, currentRun); } else currentRun = 0; }
if (maxRun >= 3) issues.push('Staccato drama (max run: ' + maxRun + ')');
const triples = body.match(/(\w+,\s+\w+,\s+(?:dan|and)\s+\w+)/g) || [];
if (triples.length > 2) issues.push('Rule of three: ' + triples.length + ' (max 2)');
const neg = body.match(/(tidak hanya.*tapi juga|bukan hanya.*melainkan|not only.*but also|it.s not just.*it.s)/gi) || [];
if (neg.length) issues.push('Negative parallelisms: ' + neg.length);
const promo = ['game-changing','revolutionary','groundbreaking','cutting-edge','state-of-the-art','world-class','seamless','empower','transform','unlock','unleash','supercharge','skyrocket'];
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
if (personal < 3) issues.push('Human signature weak (kita/kamu/saya: ' + personal + ', need 3+)');
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
else if (og === title) issues.push('og_headline == title: must be different');
else if (og.length > 50) issues.push('og_headline length: ' + og.length + ' (max 50)');
const refs = a.source_references || [];
if (!Array.isArray(refs)) issues.push('source_references: must be array');
const numberSentences = sentences.filter(s => /\d+%|\d+\s*(triliun|miliar|juta|ribu)|Rp[\d.,]+|\d+\s*(persen|%)/i.test(s));
const unattributed = numberSentences.filter(s => !/(menurut|berdasarkan|data|catatan|mencatat|riset|survei|studi|OJK|BPS|We Are Social|Kemenkop|Jakpat)/i.test(s));
if (unattributed.length > 0) issues.push('Unattributed numbers: ' + unattributed.length);
if (excerpt.length > 160) issues.push('Excerpt: ' + excerpt.length + ' chars (max 160)');
const seoDesc = a.seo_meta_description || '';
if (seoDesc.length > 160) issues.push('SEO description: ' + seoDesc.length + ' chars (max 160)');
console.log('=== QC AUDIT ===');
console.log('Word count:', wc, '| h2:', h2, '| internal links:', il, '| sources:', refs.length);
if (issues.length) { console.log('\nFAIL (' + issues.length + '):'); issues.forEach(i => console.log('  - ' + i)); process.exit(1); }
else console.log('\nCLEAN: All checks passed.');
"
```

**Aturan:** Jalankan sampai CLEAN, fix semua FAIL, re-run. Maksimal 5 round.

**Checklist:**
- [ ] Grammar clean
- [ ] SEO metadata valid (title max 70, desc max 160, slug max 60, keywords 3-8)
- [ ] Tidak ada broken link
- [ ] Formatting markdown benar (h2/h3, no h1, min 3 h2)
- [ ] Readability OK (word count 1.000-2.500)
- [ ] QC audit CLEAN

---

## 08-humanizer

Perbaiki flow, hilangkan pola AI, tambahkan contoh, natural tone.

**Humanizer rules lengkap:** Lihat `files/HumanizerRules.md` (single source of truth, 15 kategori).

**Yang diperbaiki di step ini:**
- Flow kalimat: perbaiki transisi yang terlalu formal/robotik
- Hilangkan pola AI: staccato drama, rule-of-three abuse, negative parallelisms, fragmented headers
- Tambahkan contoh konkret: ganti klaim abstrak dengan contoh spesifik
- Natural tone: ganti kata formal AI (signifikan, krusial, mendalam) dengan kata natural
- Human signature: pastikan minimal 1 paragraf pengalaman/observasi/opini spesifik

**Setelah humanizer, set `human_signature: true` di article JSON.**

**Checklist:**
- [ ] No em dash, no en dash, no curly quotes
- [ ] No AI vocab EN/ID
- [ ] No staccato drama, rule-of-three abuse (>2x), negative parallelisms
- [ ] No promotional language, signposting, filler, generic conclusions
- [ ] Max 1 exclamation mark
- [ ] Human signature: minimal 1 paragraf pengalaman/observasi/opini spesifik
- [ ] Tone: jujur, rasional, berani, tidak menggurui
- [ ] `human_signature: true` di JSON

---

## 09-publish

Publish artikel ke production.

**Scheduling Verification (jika scheduled):**
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
} else if (f.status === 'published') console.log('Already published');
"
```

**OG Image Generation (wajib untuk publish langsung, skip untuk scheduled):**
```bash
curl -s -X POST "https://tamparananakmuda.com/api/og/generate" \
  -H "Content-Type: application/json" -H "Cookie: <admin-session-cookie>" \
  -d '{"slug":"SLUG"}'
```

Verify di CDN:
```bash
curl -s -o /dev/null -w "card: %{http_code}\n" "https://cdn.tamparananakmuda.com/og/SLUG-card.webp"
curl -s -o /dev/null -w "feature: %{http_code}\n" "https://cdn.tamparananakmuda.com/og/SLUG-feature.webp"
```

**Deploy:**
```bash
git add -A && git commit -m "feat: add new article SLUG" && git push origin main
```

**Verifikasi production:**
```bash
curl -s -o /dev/null -w "article: %{http_code}\n" "https://tamparananakmuda.com/artikel/SLUG"
curl -s "https://tamparananakmuda.com/artikel/SLUG" | grep -o '"@type":"Article"' && echo "Schema OK" || echo "Schema MISSING"
curl -s "https://tamparananakmuda.com/sitemap.xml" | grep "SLUG" && echo "Sitemap OK" || echo "Sitemap MISSING"
curl -s "https://tamparananakmuda.com/rss.xml" | grep "SLUG" && echo "RSS OK" || echo "RSS MISSING"
```

**SEO Indexing:**
1. Submit URL ke Google Search Console: `https://tamparananakmuda.com/artikel/SLUG`
2. Ping sitemap: `curl -s "https://www.google.com/ping?sitemap=https://tamparananakmuda.com/sitemap.xml"`

**Checklist:**
- [ ] `status` = `published` atau `scheduled`
- [ ] OG images generated (atau tunggu cron untuk scheduled)
- [ ] `git push` sukses
- [ ] Vercel deploy sukses
- [ ] HTTP 200 di production
- [ ] JSON-LD schema present
- [ ] Sitemap includes slug
- [ ] URL submitted ke Google Search Console

---

## 10-distribution

Social media, newsletter, dan syndication.

### Instagram Carousel (5-8 slides)
- Slide 1: Hook headline + visual (brand colors, Syne font)
- Slide 2-6: Key data points (1 per slide, max 3 angka per slide)
- Slide 7: Pertanyaan refleksi
- Slide 8: CTA ke full article

### Newsletter (400-600 words)
- Subject line: 1 insight utama, bukan judul artikel
- Opening: 1 paragraf hook
- Body: 1 insight + 1 quote striking
- Closing: 1 pertanyaan untuk subscriber
- Kirim via: Brevo dashboard (manual)

### IG Stories (3-5 stories)
- Story 1: Polling question
- Story 2-3: Key takeaways dengan visual
- Story 4: Q&A sticker
- Story 5: Link sticker ke artikel

### TikTok/Reels Script (Phase 2)
- 30-60 detik, 1 insight per video
- Hook line wajib di 3 detik pertama
- CTA: "Baca full artikel di bio"

### X/Twitter Thread (3-5 tweets)
- Tweet 1: Hook (1 kalimat tajam + angka/data)
- Tweet 2-3: Key insight (1 per tweet, max 280 chars)
- Tweet 4: Quote atau data striking
- Tweet 5: CTA ke full article

### LinkedIn Post (200-400 words)
- Hook line: 1 kalimat relevan untuk professional audience
- Body: 1 insight utama dengan sudut pandang professional
- CTA: "Baca analisis lengkapnya di sini: tamparananakmuda.com/artikel/SLUG"
- Hashtags: 3-5 relevant hashtags

**Timeline:**
```
Hari 1: Publish artikel di website
Hari 2: Post IG Carousel + Stories + X/Twitter thread
Hari 3: Kirim newsletter + LinkedIn post
Hari 4: TikTok/Reels video (jika Phase 2)
Hari 7: Review analytics awal
```

**Checklist:**
- [ ] IG Carousel dibuat (5-8 slides)
- [ ] Newsletter dikirim
- [ ] IG Stories dipost
- [ ] X/Twitter thread dipost
- [ ] LinkedIn post dipost
- [ ] TikTok/Reels (jika Phase 2)

---

## 11-monitor

Ranking, CTR, traffic, dan engagement.

**Metrics to track (via Umami):**
- Page views, unique visitors, average reading time
- Scroll depth, email subscribe rate, social referral traffic, bounce rate

**Review schedule:**
- H+1: Cek apakah artikel ter-index Google (site:search)
- H+3: Cek social engagement (likes, shares, saves)
- H+7: Review metrics awal vs target
- H+30: Full performance review, decide if refresh needed

**Checklist:**
- [ ] Artikel ter-index Google (H+1)
- [ ] Social engagement dicek (H+3)
- [ ] Metrics awal vs target (H+7)
- [ ] Full performance review (H+30)

---

## 12-update

Refresh konten, update data, dan tambah insight.

**Monthly:**
- Cek apakah data di artikel masih relevan
- Update jika ada survei baru yang relevan
- Cek internal links masih aktif
- Refresh SEO jika ranking turun

**Quarterly:**
- Review artikel di cluster topik yang sama
- Identifikasi artikel untuk update vs archive
- Plan seri konten baru berdasarkan performa

**Rollback (jika perlu hapus artikel):**
```bash
rm content/articles/SLUG.md
npx tsx -e "const { readFileSync } = require('fs'); const { join } = require('path'); const envPath = join(process.cwd(), '.env.local'); const envContent = readFileSync(envPath, 'utf8'); envContent.split('\n').forEach((line) => { const t = line.trim(); if (!t || t.startsWith('#')) return; const i = t.indexOf('='); if (i === -1) return; const k = t.substring(0, i).trim(); const v = t.substring(i + 1).trim(); if (!process.env[k]) process.env[k] = v; }); const { db } = require('./lib/db'); const { postMetadata } = require('./lib/db/schema'); const { eq } = require('drizzle-orm'); db.delete(postMetadata).where(eq(postMetadata.slug, 'SLUG')).then(() => console.log('post_metadata deleted: SLUG')).catch(console.error);"
```

**Checklist:**
- [ ] Data masih relevan (monthly check)
- [ ] Internal links masih aktif (monthly check)
- [ ] SEO ranking stabil atau naik (monthly check)
- [ ] Cluster review dilakukan (quarterly)
