---
description: Workflow eksekusi artikel standalone TAM, dari riset topik sampai distribusi multi-platform
---

# Artikel Execution Workflow

Workflow untuk artikel standalone (bukan seri, bukan whitepaper). Setiap step harus complete sebelum lanjut.

## Env Var Reference

**Database (Drizzle ORM):** DB dipakai untuk `post_metadata` (OG image URLs), bookmarks, comments, dan email subscribers. Artikel disimpan sebagai file Markdown di `content/articles/`.

**Supabase (auth only):** Supabase hanya digunakan untuk auth/session (`@supabase/ssr`).

| Env Var | Fungsi | Scope |
|---------|--------|-------|
| `DATABASE_URL` | PostgreSQL connection string untuk Drizzle | Server only |
| `NEXT_PUBLIC_SUPABASE_URL` | URL Supabase project (auth only) | Public |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key (auth only) | Public |
| `NEXT_PUBLIC_SITE_URL` | URL production | Public |
| `BREVO_API_KEY` | Newsletter | Server only |
| `BREVO_LIST_ID` | Subscriber list | Server only |
| `R2_ACCESS_KEY_ID` | Cloudflare R2 S3 access key | Server only |
| `R2_SECRET_ACCESS_KEY` | Cloudflare R2 S3 secret | Server only |
| `R2_ENDPOINT` | R2 S3 endpoint URL | Server only |
| `R2_BUCKET_NAME` | R2 bucket name (`cdn-tam`) | Server only |
| `CDN_BASE_URL` | CDN domain (`https://cdn.tamparananakmuda.com`) | Public |
| `CRON_SECRET` | Auth secret untuk cron API auto-publish | Server only |

```bash
export ARTICLE_JSON="/tmp/tam-article.json"
```

**CRITICAL:**
- Artikel disimpan sebagai file Markdown di `content/articles/`. DB hanya dipakai untuk `post_metadata` (OG URLs).
- Jangan pakai Supabase REST API untuk insert konten.

## Step -1: Topic Research & Angle Test

Sebelum drafting, validasi ide artikel. Mencegah artikel generik dan memastikan angle TAM unik.

**Untuk ide yang sudah melalui workflow `/content-ideation`** (file: `.windsurf/workflows/content-ideation.md`), langsung lanjut ke Step 0 dengan ide yang sudah terpilih.

**Untuk ide ad-hoc (tidak dari ideation workflow):** lakukan angle test di bawah ini.

**Angle Test (2 pertanyaan wajib):**
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

**Category Reference (updated via migration 000003):**
| Slug | Title | Color |
|------|-------|-------|
| `mindset` | Mindset | #D13A3A |
| `karier` | Karier | #4080D9 |
| `kehidupan` | Kehidupan | #40B880 |
| `uang` | Uang | #D9A040 |
| `bisnis` | Bisnis | #A040D9 |
| `teknologi` | Teknologi | #6040D9 |

**Checklist:**
- [ ] Angle test lolos (kedua pertanyaan)
- [ ] POV tag dipilih
- [ ] Category dipilih
- [ ] Keyword target ditentukan (long-tail, Bahasa Indonesia)
- [ ] Minimal 1 insight unik yang tidak ada di 3 artikel pertama Google

## Step 0: Pre-Flight File Check

Verifikasi struktur data sebelum insert. Cek slug uniqueness, category, dan author dari config.

**Cek slug uniqueness + category + author (file-based):**
```bash
npx tsx -e "
const { existsSync } = require('fs');
const { join } = require('path');
const { categories, authors, getCategoryBySlug, getAuthorBySlug } = require('./content/config');

console.log('=== CATEGORIES ===');
categories.forEach(c => console.log(c.slug + ' | ' + c.title + ' | color: ' + c.color));

console.log('\n=== AUTHORS ===');
authors.forEach(a => console.log(a.slug + ' | ' + a.name));

const slug = 'SLUG_ARTIKEL';
const filePath = join(process.cwd(), 'content', 'articles', slug + '.md');
console.log('\nSLUG CHECK:', existsSync(filePath) ? 'FATAL: FILE EXISTS' : 'SLUG AVAILABLE: ' + slug);

const cat = getCategoryBySlug('CATEGORY_SLUG');
console.log('Category valid:', cat ? cat.title : 'FATAL: CATEGORY NOT FOUND');

const auth = getAuthorBySlug('AUTHOR_SLUG');
console.log('Author valid:', auth ? auth.name : 'FATAL: AUTHOR NOT FOUND');
"
```

**Frontmatter fields (file-based system):**
- `title`, `slug`, `excerpt`, `body` (below frontmatter), `publishedAt`, `status`
- `category` (slug, bukan UUID), `subcategory` (slug atau null), `author` (slug, bukan UUID)
- `series` (slug atau null), `seriesOrder` (number atau null)
- `povTag`, `tags` (array string), `ogHeadline`
- `seoMetaTitle`, `seoMetaDescription`, `seoKeywords` (array string)
- `sourceReferences` (array `{type, url, label}`)
- `featured`, `humanSignature`, `factCheckStatus`, `reviewStatus`
- `isSponsored`, `sponsorName`, `sponsorUrl`, `sponsorDisclosure`
- `isPremium`, `premiumExcerpt`
- `coverImageUrl`, `coverImageAlt` (null jika pakai OG image dynamic)

**Subcategory (Pillar) Reference (dari `content/config.ts`):**
| Slug | Title | Category |
|------|-------|----------|
| `mindset-realita` | Mindset & Realita | mindset |
| `karier-dunia-kerja` | Karier & Dunia Kerja | karier |
| `keuangan-uang` | Keuangan & Uang | uang |
| `bisnis` | Bisnis | bisnis |
| `teknologi-ai` | Teknologi & AI | teknologi |
| `hubungan-sosial` | Hubungan Sosial | kehidupan |
| `produktivitas` | Produktivitas | kehidupan |
| `psikologi` | Psikologi | kehidupan |
| `analisis-fenomena` | Analisis Fenomena | kehidupan |
| `lifestyle` | Lifestyle | kehidupan |
| `skill-masa-depan` | Skill Masa Depan | karier |
| `sejarah-orang-sukses` | Sejarah Orang Sukses | bisnis |
| `komunikasi` | Komunikasi | karier |
| `filosofi-hidup` | Filosofi Hidup | mindset |
| `tamparan` | Tamparan | mindset |
| `ulasan-buku` | Ulasan Buku | mindset |
| `pendidikan` | Pendidikan | kehidupan |

**CRITICAL rules:**
- `sourceReferences`: HARUS array, bukan string. Format: `[{type: "link", url: "...", label: "..."}]`
- `excerpt`: MAX 160 karakter
- `seoMetaDescription`: MAX 160 karakter
- `readingTime`: Tidak perlu set di frontmatter. Loader auto-calculate dari body (jumlah kata / 200)
- `publishedAt`: WAJIB set. Jika null, artikel tidak muncul di top homepage. Jika `status='scheduled'`, set ke waktu publish di masa depan. Cron job akan auto-publish saat `publishedAt <= now()`.
- `series` dan `seriesOrder`: Set ke `null` untuk artikel standalone.

## Step 0.5: Draft Writing Guidelines

Aturan formatting markdown body artikel sebelum masuk ke QC.

**Word Count (STANDAR TAM):**
- Target: 1.000-2.500 kata (5-12 menit baca)
- Referensi: `files/templates/article-template.md`, `files/ContentStrategy.md`, `files/ContentCalendar.md`, `files/Payment.md` (untuk CTA "Dukung TAM" di artikel)
- Di bawah 1.000 kata = perlu expand depth (data tambahan, contoh kasus, elaborasi argumentasi)
- Di atas 2.500 kata = perlu trim atau pecah jadi multi-part series (gunakan workflow `/seri-1-execution`)

**Heading Structure (CRITICAL untuk Table of Contents):**
- Gunakan `##` (h2) untuk section utama, `###` (h3) untuk sub-section
- JANGAN gunakan `#` (h1) di body, h1 sudah dipakai untuk title
- TableOfContents parse h2 dan h3. Jika tidak ada, TOC kosong
- Minimal 3 heading h2 untuk TOC berfungsi

**Internal Linking (Wajib):**
- Minimal 2 link ke artikel TAM lain di body
- Format: `[judul](/artikel/slug-artikel)`
- Cek artikel relevan via `files/article-inventory.md` (baca file lokal, nggak perlu query DB atau search online)
- Kalau artikel di kategori yang relevan belum ada, link ke category page: `/kategori/[kategori-slug]`

**Markdown Rules:**
- Tidak ada raw HTML `<script>`, `<iframe>`, `<style>` di body
- Gunakan `![alt](url)` untuk gambar, bukan `<img>`
- Link eksternal pakai `[text](url)`, tidak perlu `target="_blank"`
- Jangan tambahkan CTA "Dukung TAM" manual di body artikel. CTA tersebut otomatis muncul di article page (lihat `files/Payment.md` Section 10). Jika ingin referensi donasi di body, cukup link ke `/dukung`.

**Punctuation:**
- Tidak pakai em dash (—) atau en dash (–)
- Maks 1 exclamation mark per artikel
- Tidak pakai ellipsis (...) sebagai desain

**OG Headline (CRITICAL):**
- `ogHeadline` HARUS berbeda dari `title`. Jangan copy-paste title ke ogHeadline
- `ogHeadline` harus lebih pendek, punchy, dan conversational (max 50 karakter, sesuai card template `titleMaxChars=50`)
- Fungsi: hook untuk OG image yang membuat orang klik saat share di social media
- Format: kalimat langsung, bukan judul formal. Contoh:
  - title: "Perbandingan Diri di Era Media Sosial: Kenapa Kamu Merasa Tidak Cukup"
  - ogHeadline: "Scroll media sosial bikin kamu merasa gagal?"
  - title: "PHK Membongkar Ilusi: Kerja Keras Tidak Menjamin Aman"
  - ogHeadline: "Kerja keras tidak menjamin kamu aman dari PHK"
- Jika `ogHeadline` null, OG image akan fallback ke `title` (tidak ideal untuk social click-through)

**Command cek heading + internal links:**
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
// Cek og_headline vs title
const og = a.og_headline || '';
console.log('og_headline:', og ? og : 'MISSING');
console.log('og_headline == title?', og === a.title ? 'WARNING: harus berbeda!' : 'OK');
console.log('og_headline length:', og.length, og.length > 50 ? 'WARNING: max 50' : 'OK');
// Cek word count
const wc = b.split(/\s+/).length;
console.log('word count:', wc, wc < 1000 ? 'WARNING: butuh min 1.000' : wc > 2500 ? 'WARNING: max 2.500' : 'OK');
"
```

## Step 1: Editorial QC Audit (All-in-One)

Validasi semua data, klaim, pola AI, heading, dan metadata dalam satu command. Jalankan sampai CLEAN, fix semua FAIL, re-run.

**Humanizer rules lengkap:** Lihat `files/HumanizerRules.md` (single source of truth, 15 kategori).

**Checklist (wajib semua sebelum lanjut Step 2):**
- [ ] Setiap angka punya sumber yang bisa ditrace (URL aktif di sourceReferences)
- [ ] Angka di artikel cocok dengan sumber (tidak dibulat-bulat)
- [ ] Tidak ada angka tanpa atribusi sumber di kalimat yang sama
- [ ] Data tidak outdated (max 2 tahun untuk data ekonomi)
- [ ] POV tag dipilih dan konsisten
- [ ] Heading: h2/h3 only, minimal 3 h2, tidak ada h1
- [ ] Internal linking: minimal 2 link ke artikel TAM lain
- [ ] Tidak ada raw HTML script/iframe/style di body
- [ ] OG headline berbeda dari title, max 50 karakter, conversational
- [ ] Word count: 1.000-2.500 kata
- [ ] No em dash, no en dash, no curly quotes
- [ ] No AI vocab EN/ID (lihat HumanizerRules.md)
- [ ] No staccato drama, rule-of-three abuse (>2x), negative parallelisms
- [ ] No promotional language, signposting, filler, generic conclusions
- [ ] Max 1 exclamation mark
- [ ] Human signature: minimal 1 paragraf pengalaman/observasi/opini spesifik
- [ ] Tone: jujur, rasional, berani, tidak menggurui

**Command (all-in-one audit, jalankan sampai CLEAN):**
```bash
npx tsx -e "
const fs = require('fs');
const a = JSON.parse(fs.readFileSync(process.env.ARTICLE_JSON || '/tmp/tam-article.json', 'utf8'));
const body = a.body || '';
const title = a.title || '';
const excerpt = a.excerpt || '';
const full = body + ' ' + title + ' ' + excerpt;
const issues = [];

// Punctuation
if (full.includes('\u2014') || full.includes('\u2013')) issues.push('Em/en dash found');
if (body.includes('\u201c') || body.includes('\u201d')) issues.push('Curly quotes');
const exclCount = (body.match(/!/g) || []).length;
if (exclCount > 1) issues.push('Exclamation marks: ' + exclCount + ' (max 1)');

// AI vocab EN
const aiEn = ['crucial','pivotal','vibrant','tapestry','delve','showcase','underscore','testament','foster','garner','intricate','landscape','additionally','enduring','enhance','highlight','interplay','multifaceted','nuanced','robust','holistic','paradigm','leverage','realm','seamless','empower','transform','unlock','unleash'];
const foundEn = aiEn.filter(w => body.toLowerCase().includes(w));
if (foundEn.length) issues.push('AI vocab EN: ' + foundEn.join(', '));

// AI vocab ID
const aiId = ['signifikan','krusial','esensial','vital','mendalam','memperhatikan','pada dasarnya','secara fundamental','pada intinya','pada akhirnya','menariknya','perlu dicatat','perlu diingat','tidak dapat dipungkiri'];
const foundId = aiId.filter(w => body.toLowerCase().includes(w));
if (foundId.length) issues.push('AI vocab ID: ' + foundId.join(', '));

// Staccato drama
const sentences = body.split(/[.!?]\s+/);
let currentRun = 0, maxRun = 0;
for (const s of sentences) {
  if (s.split(/\s+/).length <= 6) { currentRun++; maxRun = Math.max(maxRun, currentRun); }
  else currentRun = 0;
}
if (maxRun >= 3) issues.push('Staccato drama (max run: ' + maxRun + ')');

// Rule of three
const triples = body.match(/(\w+,\s+\w+,\s+(?:dan|and)\s+\w+)/g) || [];
if (triples.length > 2) issues.push('Rule of three: ' + triples.length + ' (max 2)');

// Negative parallelisms
const neg = body.match(/(tidak hanya.*tapi juga|bukan hanya.*melainkan|not only.*but also|it.s not just.*it.s)/gi) || [];
if (neg.length) issues.push('Negative parallelisms: ' + neg.length);

// -ing superficial
const ing = body.match(/(\w+ing (?:the|its|a|this|that))/g) || [];
if (ing.length > 2) issues.push('-ing superficial: ' + ing.length);

// Promotional
const promo = ['game-changing','revolutionary','groundbreaking','cutting-edge','state-of-the-art','world-class','seamless','empower','transform','unlock','unleash','supercharge','skyrocket'];
const foundPromo = promo.filter(w => body.toLowerCase().includes(w));
if (foundPromo.length) issues.push('Promotional: ' + foundPromo.join(', '));

// Signposting
const signs = ['let.s dive','here.s what you need','marilah kita','berikut adalah hal yang perlu','tanpa berpanjang lebar'];
if (signs.some(w => new RegExp(w, 'i').test(body))) issues.push('Signposting detected');

// Filler
const fillers = ['in order to','due to the fact','at this point in time','it is important to note','perlu diketahui bahwa'];
const foundFillers = fillers.filter(w => body.toLowerCase().includes(w));
if (foundFillers.length) issues.push('Filler: ' + foundFillers.join(', '));

// Generic conclusions
const generic = ['the future looks bright','exciting times','masa depan yang cerah','awal dari sesuatu yang besar','peluang tak terbatas'];
const foundGeneric = generic.filter(w => body.toLowerCase().includes(w));
if (foundGeneric.length) issues.push('Generic conclusion: ' + foundGeneric.join(', '));

// Human signature
const personal = (body.match(/\bkita\b|\bkamu\b|\bsaya\b/gi) || []).length;
if (personal < 3) issues.push('Human signature weak (kita/kamu/saya: ' + personal + ', need 3+)');

// Fragmented headers
const lines = body.split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].startsWith('## ') && i + 1 < lines.length) {
    const next = lines[i+1].trim() || (lines[i+2] ? lines[i+2].trim() : '');
    if (next) {
      const hw = new Set(lines[i].replace('## ','').toLowerCase().split(/\s+/));
      const nw = new Set(next.toLowerCase().split(/\s+/));
      const overlap = [...hw].filter(w => nw.has(w));
      if (overlap.length >= 2) issues.push('Fragmented header: \"' + lines[i].trim() + '\"');
    }
  }
}

// Heading structure
const h1 = (body.match(/^# /gm) || []).length;
const h2 = (body.match(/^## /gm) || []).length;
const h3 = (body.match(/^### /gm) || []).length;
if (h1 > 0) issues.push('h1 found: ' + h1 + ' (use h2/h3 only)');
if (h2 < 3) issues.push('h2 count: ' + h2 + ' (need min 3)');

// Internal links
const il = (body.match(/\]\(\/artikel\//g) || []).length;
if (il < 2) issues.push('Internal links: ' + il + ' (need min 2)');

// Word count
const wc = body.split(/\s+/).filter(w => w.length > 0).length;
if (wc < 1000) issues.push('Word count: ' + wc + ' (need min 1.000)');
if (wc > 2500) issues.push('Word count: ' + wc + ' (max 2.500)');

// OG headline
const og = a.og_headline || '';
if (!og) issues.push('og_headline: MISSING');
else if (og === title) issues.push('og_headline == title: must be different');
else if (og.length > 50) issues.push('og_headline length: ' + og.length + ' (max 50)');

// Source references
const refs = a.source_references || [];
if (!Array.isArray(refs)) issues.push('source_references: must be array');

// Data attribution check
const numberSentences = sentences.filter(s => /\d+%|\d+\s*(triliun|miliar|juta|ribu)|Rp[\d.,]+|\d+\s*(persen|%)/i.test(s));
const unattributed = numberSentences.filter(s => !/(menurut|berdasarkan|data|catatan|mencatat|riset|survei|studi|OJK|BPS|We Are Social|Kemenkop|Jakpat)/i.test(s));
if (unattributed.length > 0) issues.push('Unattributed numbers: ' + unattributed.length + ' sentences with numbers but no source');

// Excerpt & SEO desc length
if (excerpt.length > 160) issues.push('Excerpt: ' + excerpt.length + ' chars (max 160)');
const seoDesc = a.seo_meta_description || '';
if (seoDesc.length > 160) issues.push('SEO description: ' + seoDesc.length + ' chars (max 160)');

console.log('=== ALL-IN-ONE QC AUDIT ===');
console.log('Word count:', wc, '| h2:', h2, '| h3:', h3, '| internal links:', il, '| sources:', refs.length);
console.log('og_headline:', og || 'MISSING');
if (issues.length) {
  console.log('\nFAIL (' + issues.length + ' issues):');
  issues.forEach(i => console.log('  - ' + i));
  console.log('\nFix all issues above, then re-run this command.');
  process.exit(1);
} else {
  console.log('\nCLEAN: All checks passed. Safe to proceed to Step 2.');
}
"
```

**Aturan:**
- Jalankan command di atas, fix semua FAIL, re-run sampai CLEAN
- Maksimal 5 round. Kalau setelah 5 round masih ada issue, review manual
- Setelah CLEAN, set `human_signature: true` di article JSON
- Step 1 CLEAN adalah **gate** untuk lanjut ke Step 2

**Content Quality Score (0-100, target > 80):**

| Komponen | Max | Kriteria |
|----------|-----|----------|
| Angle test | 25 | Lolos percobaan pertama (25), kedua (15), ketiga+ (5) |
| Human signature | 25 | Pengalaman personal (25), observasi (20), opini spesifik (15), tidak ada (0) |
| Fact-check | 25 | Semua klaim terverifikasi (25), minor issues (15), flagged (0) |
| POV clarity | 25 | POV tag dipilih dan konsisten (25), tidak konsisten (10), tidak ada (0) |

## Step 2: SEO & Source Verification

Verifikasi semua source URL aktif dan optimize SEO metadata sebelum insert.

### 2a. Source Verification (Tier System)

**Tier 1: Terverifikasi langsung dari publikasi asli** - URL aktif, data bisa dikonfirmasi
**Tier 2: Tidak terverifikasi langsung** - Data dikutip dari media sekunder, wajib label atribusi

**Yang harus dihapus:** Dead link, sample terlalu kecil (n < 5.000), blog post tanpa data primer

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

### 2b. SEO Metadata Check

**Meta Title Formula:** `[Keyword Utama] + [Hook] | TAM` (max 70 karakter)
**Meta Description Formula:** `[Konteks] + [Value Prop] + [CTA]` (max 160 karakter)
**Slug:** kebab-case, keyword di awal, max 60 karakter, unique

**Command (SEO metadata validation):**
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

**Checklist:**
- [ ] Semua source URL aktif (HTTP 200-399)
- [ ] Tidak ada dead link di sourceReferences
- [ ] `seoKeywords`: 3-8 keyword long-tail, Bahasa Indonesia
- [ ] `seoMetaTitle`: max 70 karakter, keyword utama di awal, ada `| TAM`
- [ ] `seoMetaDescription`: max 160 karakter, mengandung keyword
- [ ] `slug`: kebab-case, keyword di awal, max 60 karakter, unique
- [ ] `excerpt`: max 160 karakter
- [ ] `ogHeadline`: max 50 karakter, berbeda dari title
- [ ] h2 mengandung secondary keyword
- [ ] Internal linking: minimal 2 link, anchor text bervariasi
- [ ] `category`: slug kategori valid dari `content/config.ts`
- [ ] `author`: slug author valid dari `content/config.ts`

**SEO Scoring Rubric (0-100, target > 80):**

| Komponen | Max | Kriteria |
|----------|-----|----------|
| Keyword research | 20 | 5-8 keyword long-tail (20), 3-4 keyword (15), <3 (5) |
| Meta title | 15 | Keyword di awal + hook + max 70 (15), keyword ada tapi tidak di awal (10), >70 chars (0) |
| Meta description | 15 | Keyword + value prop + CTA + max 160 (15), ada keyword (10), >160 (0) |
| Heading SEO | 15 | h2 ada secondary keyword (15), h2 ada tapi no keyword (10), no h2 (0) |
| Internal linking | 15 | 3+ link bervariasi (15), 2 link (10), <2 (0) |
| Slug | 10 | Kebab-case + keyword di awal + max 60 (10), ada keyword (7), >60 (0) |
| Alt text | 10 | Semua gambar punya alt + keyword natural (10), ada alt (5), ada gambar tanpa alt (0) |

## Step 4: File-Based Article Insert

Insert artikel sebagai file Markdown dengan YAML frontmatter di `content/articles/`. Tidak ada DB insert untuk artikel — disimpan sebagai file `.md` dan dibaca oleh `lib/articles/loader.ts`.

**Article JSON Template (simpan ke `$ARTICLE_JSON`):**
```json
{
  "title": "Judul Artikel",
  "slug": "slug-artikel-kebab-case",
  "excerpt": "Excerpt max 160 karakter",
  "body": "## Heading 1\n\nKonten...\n\n## Heading 2\n\nKonten...\n\n### Sub-heading\n\nKonten...",
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

**Field mapping (JSON → frontmatter):**
- `category`: slug kategori dari `content/config.ts` (bukan UUID)
- `subcategory`: slug subkategori dari `content/config.ts` (bukan UUID, null jika tidak relevan)
- `author`: slug author dari `content/config.ts` (bukan UUID)
- `series`: null untuk artikel standalone
- `seo_keywords`: array string → `seoKeywords` di frontmatter
- `pov_tag`: string → `povTag` di frontmatter
- `source_references`: array `{type, url, label}` → `sourceReferences` di frontmatter

**Optional fields (tambah hanya jika perlu):**
- `is_premium`, `premium_excerpt` → `isPremium`, `premiumExcerpt` di frontmatter: false, null
- `is_sponsored`, `sponsor_name`, `sponsor_url`, `sponsor_disclosure` → `isSponsored`, `sponsorName`, `sponsorUrl`, `sponsorDisclosure` di frontmatter: false, null

**Scheduling Strategy (WAJIB BACA):**
- **Setiap hari harus ada minimal 1 artikel di-publish.** Kalau hari ini sudah publish langsung, artikel berikutnya harus scheduled untuk hari berikutnya.
- **Jam posting ideal:** Pagi 08:00 WIB (01:00 UTC) atau Siang 12:00 WIB (05:00 UTC) atau Sore 17:00 WIB (10:00 UTC)
- **Publish langsung:** `"status": "published"`, `"published_at": "2026-01-01T00:00:00.000Z"` (now atau past) → `publishedAt` di frontmatter
  - **WARNING: `publishedAt` HARUS di masa lalu atau sekarang (UTC).** Jika di masa depan, artikel tidak muncul karena loader memfilter `publishedAt <= now()`.
  - QC harus dilakukan SEBELUM insert (draft review, editorial QC, SEO validation). Begitu file dibuat, langsung live.
- **Scheduled:** `"status": "scheduled"`, `"published_at": "2026-07-18T01:00:00.000Z"` (future date, 08:00 WIB) → `publishedAt` di frontmatter
  - GitHub Actions cron job berjalan every 5 minutes, auto-publish artikel dengan `status='scheduled'` dan `publishedAt <= now()` (cron mengubah status di file frontmatter)
  - Cron job juga auto-generate OG images untuk setiap artikel yang di-publish
  - Max delay: 5 menit dari waktu scheduled
  - Tidak perlu manual Step 5 (OG generation) untuk scheduled articles
  - Tidak perlu code deploy, cron yang handle publish + OG

**Catatan:**
- `readingTime`: Tidak perlu set di frontmatter. Loader auto-calculate dari body (jumlah kata / 200)
- `publishedAt`: WAJIB set. Jika null, artikel tidak muncul di top homepage
- `sourceReferences`: Format array `{type, url, label}` di frontmatter
- File disimpan di `content/articles/{slug}.md`

**Insert command (buat file Markdown):**
```bash
npx tsx -e "
const { readFileSync, writeFileSync, mkdirSync } = require('fs');
const { join } = require('path');

const article = JSON.parse(readFileSync(process.env.ARTICLE_JSON || '/tmp/tam-article.json', 'utf8'));

// VALIDASI
if (article.excerpt && article.excerpt.length > 160) {
  console.error('FATAL: excerpt > 160 chars (' + article.excerpt.length + ')'); process.exit(1);
}
if (article.seo_meta_description && article.seo_meta_description.length > 160) {
  console.error('FATAL: seo_meta_description > 160 chars'); process.exit(1);
}
if (!Array.isArray(article.source_references)) {
  console.error('FATAL: source_references must be array'); process.exit(1);
}
if (!article.published_at) {
  console.error('FATAL: published_at is required'); process.exit(1);
}
if (!article.slug || !article.title || !article.body) {
  console.error('FATAL: slug, title, body are required'); process.exit(1);
}

// Build YAML frontmatter
const frontmatter = {
  title: article.title,
  slug: article.slug,
  excerpt: article.excerpt || '',
  publishedAt: article.published_at,
  status: article.status === 'scheduled' ? 'scheduled' : 'published',
  category: article.category || 'kehidupan',
  subcategory: article.subcategory || null,
  author: article.author || 'yovie-setiawan',
  series: article.series || null,
  seriesOrder: article.series_order || null,
  povTag: article.pov_tag || 'data',
  tags: [],
  ogHeadline: article.og_headline || article.title,
  seoMetaTitle: article.seo_meta_title || '',
  seoMetaDescription: article.seo_meta_description || '',
  seoKeywords: article.seo_keywords || [],
  sourceReferences: article.source_references.map((r) => ({ type: r.type || 'link', url: r.url, label: r.label || r.title || '' })),
  featured: article.featured || false,
  humanSignature: article.human_signature !== false,
  factCheckStatus: 'verified',
  reviewStatus: 'publish',
  isSponsored: article.is_sponsored || false,
  sponsorName: article.sponsor_name || null,
  sponsorUrl: article.sponsor_url || null,
  sponsorDisclosure: article.sponsor_disclosure || null,
  isPremium: article.is_premium || false,
  premiumExcerpt: article.premium_excerpt || null,
  coverImageUrl: null,
  coverImageAlt: null,
};

// Convert to YAML frontmatter string
function toYaml(obj, indent = '') {
  let lines = [];
  for (const [key, value] of Object.entries(obj)) {
    if (value === null) {
      lines.push(indent + key + ': null');
    } else if (typeof value === 'string') {
      const escaped = value.replace(/\"/g, '\\\"');
      lines.push(indent + key + ': \"' + escaped + '\"');
    } else if (typeof value === 'boolean' || typeof value === 'number') {
      lines.push(indent + key + ': ' + value);
    } else if (Array.isArray(value)) {
      if (value.length === 0) {
        lines.push(indent + key + ': []');
      } else if (typeof value[0] === 'string') {
        lines.push(indent + key + ':');
        value.forEach(v => lines.push(indent + '  - \"' + v.replace(/\"/g, '\\\"') + '\"'));
      } else {
        lines.push(indent + key + ':');
        value.forEach(v => {
          if (typeof v === 'object' && v !== null) {
            lines.push(indent + '  - ' + JSON.stringify(v));
          } else {
            lines.push(indent + '  - ' + v);
          }
        });
      }
    } else if (typeof value === 'object') {
      lines.push(indent + key + ':');
      lines.push(toYaml(value, indent + '  '));
    }
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
console.log('slug:', article.slug);
console.log('status:', frontmatter.status);
console.log('published_at:', frontmatter.publishedAt);
console.log('source_references count:', frontmatter.sourceReferences.length);
"
```

## Step 4.5: Post-Insert Verification

Verifikasi file Markdown yang dibuat sudah benar.

**Command (parse & verify frontmatter):**
```bash
npx tsx -e "
const { readFileSync } = require('fs');
const { join } = require('path');
const matter = require('gray-matter');

const filePath = join(process.cwd(), 'content', 'articles', 'SLUG' + '.md');
const fileContent = readFileSync(filePath, 'utf8');
const { data: frontmatter, content: body } = matter(fileContent);

console.log('=== File Verification ===');
console.log('slug:', frontmatter.slug);
console.log('status:', frontmatter.status);
console.log('publishedAt:', frontmatter.publishedAt);
console.log('category:', frontmatter.category);
console.log('author:', frontmatter.author);
console.log('sourceReferences isArray:', Array.isArray(frontmatter.sourceReferences));
console.log('excerpt length:', frontmatter.excerpt ? frontmatter.excerpt.length : 'null', '(max 160)');
console.log('body length:', body.length, 'chars');

const issues = [];
if (!frontmatter.publishedAt) issues.push('publishedAt is null');
if (!frontmatter.author) issues.push('author is null');
if (!frontmatter.category) issues.push('category is null');
if (!Array.isArray(frontmatter.sourceReferences)) issues.push('sourceReferences not array');
if (frontmatter.excerpt && frontmatter.excerpt.length > 160) issues.push('excerpt > 160');
if (!frontmatter.title) issues.push('title is missing');
if (!frontmatter.slug) issues.push('slug is missing');
if (issues.length > 0) {
  console.error('ISSUES:', issues.join(', '));
  process.exit(1);
} else {
  console.log('All checks passed.');
}
"
```

**Checklist:**
- [ ] File `content/articles/SLUG.md` exists
- [ ] `slug` di frontmatter = slug yang diharapkan
- [ ] `status` = `published` atau `scheduled`
- [ ] `publishedAt` tidak null
- [ ] `category` = slug kategori yang valid (dari `content/config.ts`)
- [ ] `author` = slug author yang valid (dari `content/config.ts`)
- [ ] `sourceReferences` isArray = `true`
- [ ] `excerpt` length <= 160
- [ ] Body content tidak kosong

**Update article inventory (WAJIB):**
Setelah verifikasi lolos, update `files/article-inventory.md` dengan baris baru:
```
| [N] | [Title] | [slug] | [Kategori] | [Pillar] | [POV] | [YYYY-MM-DD] |
```
File ini dipakai workflow untuk internal linking di artikel selanjutnya, jadi harus selalu up-to-date.

## Step 4.6: Scheduling Verification

Jika artikel di-insert dengan `status='scheduled'`, verifikasi scheduling akan berjalan.

**Cek status & publishedAt dari file frontmatter:**
```bash
npx tsx -e "
const { readFileSync } = require('fs');
const { join } = require('path');
const matter = require('gray-matter');

const filePath = join(process.cwd(), 'content', 'articles', 'SLUG' + '.md');
const { data: f } = matter(readFileSync(filePath, 'utf8'));

console.log('status:', f.status);
console.log('publishedAt:', f.publishedAt);

if (f.status === 'scheduled') {
  const now = new Date();
  const pubDate = new Date(f.publishedAt);
  if (pubDate <= now) {
    console.error('WARNING: publishedAt is in the past but status is scheduled! Cron should have published this.');
  } else {
    const minsUntil = Math.ceil((pubDate.getTime() - now.getTime()) / 60000);
    console.log('Will auto-publish in ~' + minsUntil + ' minutes (GitHub Actions cron runs every 5 min)');
  }
} else if (f.status === 'published') {
  console.log('Already published');
}
"
```

**Checklist (if scheduled):**
- [ ] `status` = `scheduled` di frontmatter file
- [ ] `publishedAt` di masa depan
- [ ] `CRON_SECRET` env var set di Vercel dashboard dan GitHub Secrets
- [ ] GitHub Actions workflow `.github/workflows/publish-scheduled.yml` deployed
- [ ] Frontend tidak menampilkan artikel (loader filter `status === 'published' && publishedAt <= now()` aktif)
- [ ] OG images akan auto-generate saat cron publish artikel (tidak perlu manual Step 5 untuk scheduled articles)

**Checklist (if published directly):**
- [ ] `status` = `published` di frontmatter file
- [ ] `publishedAt` di now atau past
- [ ] Artikel muncul di homepage/article list

## Step 5: OG Image Generation (WebP via R2 CDN)

Setelah artikel di-insert, generate OG images ke R2 CDN. Sistem menghasilkan **2 WebP images per post**:
- **Card** (800x450) → `og/{slug}-card.webp` → untuk thumbnail article list
- **Feature** (1600x900) → `og/{slug}-feature.webp` → untuk header artikel + social meta tags

**Note: Untuk artikel scheduled (status='scheduled'), OG images akan di-auto-generate oleh cron job saat artikel di-publish.** Step ini hanya wajib untuk artikel yang di-publish langsung (status='published').

**Generate via API (admin auth required):**
```bash
curl -s -X POST "https://tamparananakmuda.com/api/og/generate" \
  -H "Content-Type: application/json" \
  -H "Cookie: <admin-session-cookie>" \
  -d '{"slug":"SLUG"}'
```

**Atau via batch script (local, semua post):**
```bash
npx tsx scripts/generate-all-og.ts
```

**Verify di R2 CDN:**
```bash
curl -s -o /dev/null -w "card: %{http_code} (%{size_download} bytes)\n" "https://cdn.tamparananakmuda.com/og/SLUG-card.webp"
curl -s -o /dev/null -w "feature: %{http_code} (%{size_download} bytes)\n" "https://cdn.tamparananakmuda.com/og/SLUG-feature.webp"
```

**Verify post_metadata updated (via Drizzle ORM):**
```bash
npx tsx -e "const { readFileSync } = require('fs'); const { join } = require('path'); const envPath = join(process.cwd(), '.env.local'); const envContent = readFileSync(envPath, 'utf8'); envContent.split('\n').forEach((line) => { const t = line.trim(); if (!t || t.startsWith('#')) return; const i = t.indexOf('='); if (i === -1) return; const k = t.substring(0, i).trim(); const v = t.substring(i + 1).trim(); if (!process.env[k]) process.env[k] = v; }); const { db } = require('./lib/db'); const { postMetadata } = require('./lib/db/schema'); const { eq } = require('drizzle-orm'); db.select().from(postMetadata).where(eq(postMetadata.slug, 'SLUG')).then(r => { const p = r[0]; console.log('card:', p?.ogCardUrl); console.log('feature:', p?.ogFeatureUrl); console.log('og:', p?.ogImageUrl); }).catch(console.error);"
```

**Checklist:**
- [ ] API/batch script sukses generate (no errors)
- [ ] `og/{slug}-card.webp` HTTP 200 di CDN
- [ ] `og/{slug}-feature.webp` HTTP 200 di CDN
- [ ] post_metadata: `og_card_url` = `https://cdn.tamparananakmuda.com/og/{slug}-card.webp`
- [ ] post_metadata: `og_feature_url` = `https://cdn.tamparananakmuda.com/og/{slug}-feature.webp`
- [ ] post_metadata: `og_image_url` = sama dengan `og_feature_url` (untuk social meta)
- [ ] Category color ter-aplikasi di accent pillar
- [ ] Headline tidak terpotong
- [ ] Brand mark (TAMPARAN ANAK MUDA) terlihat
- [ ] `ogHeadline` dipakai jika ada (fallback ke `title`)

## Step 6: Production Deployment Check

Setelah artikel live di local, deploy dan verifikasi production.

**Deploy:**
```bash
git add -A && git commit -m "feat: add new article SLUG" && git push origin main
```

**Tunggu Vercel auto-deploy, lalu verifikasi:**
```bash
# HTTP status
curl -s -o /dev/null -w "article: %{http_code}\n" "https://tamparananakmuda.com/artikel/SLUG"

# JSON-LD schema present
curl -s "https://tamparananakmuda.com/artikel/SLUG" | grep -o '"@type":"Article"' && echo "Schema OK" || echo "Schema MISSING"

# OG meta tags
curl -s "https://tamparananakmuda.com/artikel/SLUG" | grep -o 'og:title' && echo "OG tags OK" || echo "OG tags MISSING"

# Sitemap includes new article
curl -s "https://tamparananakmuda.com/sitemap.xml" | grep "SLUG" && echo "Sitemap OK" || echo "Sitemap MISSING"

# RSS feed includes new article
curl -s "https://tamparananakmuda.com/rss.xml" | grep "SLUG" && echo "RSS OK" || echo "RSS MISSING"
```

**Checklist:**
- [ ] `git push` sukses
- [ ] Vercel deploy sukses (cek GitHub deployment status)
- [ ] HTTP 200 di production `/artikel/SLUG`
- [ ] JSON-LD schema `@type:Article` present di page source
- [ ] OG meta tags present (`og:title`, `og:description`, `og:image`)
- [ ] Sitemap includes new slug
- [ ] RSS feed includes new article
- [ ] Jika 500: cek Vercel serverless issues di bawah

**Note: `llms.txt` dan `llms-full.txt` tidak perlu update per artikel.** Hanya update jika ada perubahan struktur (kategori baru, halaman baru).

**Scheduling note:** Jika artikel di-insert sebagai `status='scheduled'`, tidak perlu code deploy. GitHub Actions cron job (every 5 min) akan auto-publish saat `published_at <= now()` dan langsung auto-generate OG images. Tidak perlu manual Step 5 untuk scheduled articles.

**Known Vercel serverless issues:**
- `isomorphic-dompurify` crash di Vercel (jsdom dependency). Sudah diganti regex sanitizer di `components/markdown-content.tsx`. Jangan import library ini lagi.
- `cookies()` dari `next/headers` bisa fail di `generateMetadata` saat static generation. Gunakan server-side Supabase client dari `@/lib/supabase/server.ts` dengan proper error handling. Note: Article pages sekarang SSG dengan `generateStaticParams`, jadi ini kurang relevan untuk article pages.

## Step 6.5: SEO Indexing

Submit URL baru ke Google dan cek indexing.

**Submit ke Google Search Console (manual via browser):**
1. Buka https://search.google.com/search-console
2. Masukkan URL: `https://tamparananakmuda.com/artikel/SLUG`
3. Klik "Request Indexing"

**Ping sitemap:**
```bash
curl -s "https://www.google.com/ping?sitemap=https://tamparananakmuda.com/sitemap.xml" && echo "Sitemap pinged"
```

**Cek robots.txt accessible:**
```bash
curl -s -o /dev/null -w "robots: %{http_code}\n" "https://tamparananakmuda.com/robots.txt"
```

**Checklist:**
- [ ] URL submitted ke Google Search Console
- [ ] Sitemap pinged
- [ ] robots.txt HTTP 200

## Step 7: Content Atomization

Pecah artikel jadi format distribusi multi-platform.

### 7a. Instagram Carousel (5-8 slides)
- Slide 1: Hook headline + visual (brand colors, Syne font)
- Slide 2-6: Key data points (1 per slide, max 3 angka per slide)
- Slide 7: Pertanyaan refleksi
- Slide 8: CTA ke full article (`tamparananakmuda.com/artikel/SLUG`)

**Spec:** 1080x1080px, OLED black background, category color accent

### 7b. Newsletter (400-600 words)
- Subject line: 1 insight utama, bukan judul artikel
- Opening: 1 paragraf hook (bukan copy artikel)
- Body: 1 insight + 1 quote yang striking
- Closing: 1 pertanyaan untuk subscriber
- CTA: Link ke full article

**Kirim via:** Brevo dashboard (manual, bukan automated API)

### 7c. IG Stories (3-5 stories)
- Story 1: Polling question terkait topik
- Story 2-3: Key takeaways dengan visual
- Story 4: Q&A sticker
- Story 5: Link sticker ke artikel

### 7d. TikTok/Reels Script (Phase 2)
- Generate via `/api/tiktok/generate-script`
- 30-60 detik, 1 insight per video
- Hook line wajib di 3 detik pertama
- CTA: "Baca full artikel di bio"

### 7e. X/Twitter Thread (3-5 tweets)
- Tweet 1: Hook (1 kalimat tajam + angka/data yang mengejutkan)
- Tweet 2-3: Key insight (1 insight per tweet, max 280 chars, pakai thread numbering)
- Tweet 4: Quote atau data yang striking dari artikel
- Tweet 5: CTA ke full article (`tamparananakmuda.com/artikel/SLUG`)
- Tone: langsung, no fluff, pakai bahasa Indonesia
- Posting: manual via X app atau scheduler (Buffer/Hootsuite)

### 7f. LinkedIn Post (200-400 words)
- Hook line: 1 kalimat yang relevan untuk professional audience (karir, bisnis, keuangan)
- Body: 1 insight utama dengan sudut pandang professional (bukan copy artikel)
- Format: short paragraphs, no bullet spam, conversational tone
- CTA: "Baca analisis lengkapnya di sini: tamparananakmuda.com/artikel/SLUG"
- Hashtags: 3-5 relevant hashtags (contoh: #GenZ #Karir #Mindset #Indonesia)
- Posting: manual via LinkedIn atau scheduler

## Step 8: Distribution Schedule

Jadwalkan distribusi sesuai content calendar.

**Timeline:**
```
Hari 1 (Senin): Publish artikel di website
Hari 2 (Selasa): Post IG Carousel + Stories + X/Twitter thread
Hari 3 (Rabu): Kirim newsletter + LinkedIn post
Hari 4 (Kamis): TikTok/Reels video (jika Phase 2 aktif)
Hari 7 (Senin): Review analytics awal
```

**Tools:**
- IG posting: Manual atau Meta Business Suite
- X/Twitter: Manual via X app atau Buffer/Hootsuite
- LinkedIn: Manual via LinkedIn atau scheduler
- Newsletter: Brevo dashboard
- TikTok: Manual upload (jika Phase 2)

## Step 9: Analytics Tracking

Monitor performa artikel 7 hari setelah publish.

**Metrics to track (via Umami):**
- Page views
- Unique visitors
- Average reading time
- Scroll depth
- Email subscribe rate dari artikel
- Social referral traffic
- Bounce rate

**Events to verify:**
- `article_published` fired saat publish
- `newsletter_sent` fired saat newsletter dikirim
- `tiktok_video_published` fired saat video upload (Phase 2)
- `donation_cta_click` fired saat user klik CTA "Dukung TAM" di artikel (Phase 2, lihat `files/Payment.md` Section 9)
- `donation_success` fired saat donasi berhasil settled via webhook (Phase 2)

**Review schedule:**
- H+1: Cek apakah artikel ter-index Google (site:search)
- H+3: Cek social engagement (likes, shares, saves)
- H+7: Review metrics awal vs target
- H+30: Full performance review, decide if refresh needed

## Step 10: Post-Publish Maintenance

**Monthly:**
- Cek apakah data di artikel masih relevan
- Update jika ada survei baru yang relevan
- Cek internal links masih aktif
- Refresh SEO jika ranking turun

**Quarterly:**
- Review artikel di cluster topik yang sama
- Identifikasi artikel untuk update vs archive
- Plan seri konten baru berdasarkan performa

## Step 11: Rollback Procedure

Jika insert gagal atau artikel salah publish, undo dengan:

**Delete article file:**
```bash
rm content/articles/SLUG.md
echo "Deleted: content/articles/SLUG.md"
```

**Delete post_metadata dari DB (via Drizzle ORM):**
```bash
npx tsx -e "const { readFileSync } = require('fs'); const { join } = require('path'); const envPath = join(process.cwd(), '.env.local'); const envContent = readFileSync(envPath, 'utf8'); envContent.split('\n').forEach((line) => { const t = line.trim(); if (!t || t.startsWith('#')) return; const i = t.indexOf('='); if (i === -1) return; const k = t.substring(0, i).trim(); const v = t.substring(i + 1).trim(); if (!process.env[k]) process.env[k] = v; }); const { db } = require('./lib/db'); const { postMetadata } = require('./lib/db/schema'); const { eq } = require('drizzle-orm'); db.delete(postMetadata).where(eq(postMetadata.slug, 'SLUG')).then(() => console.log('post_metadata deleted: SLUG')).catch(console.error);"
```

**Delete OG images dari R2:**
```bash
# Hapus card + feature WebP untuk slug tersebut
curl -s -X DELETE "https://cdn.tamparananakmuda.com/og/SLUG-card.webp"
curl -s -X DELETE "https://cdn.tamparananakmuda.com/og/SLUG-feature.webp"

# Atau jalankan via script (otomatis hapus semua varian OG untuk slug):
npx tsx -e "
require('fs').readFileSync('.env.local','utf8').split('\n').forEach(l => { const i=l.indexOf('='); if(i>0) process.env[l.substring(0,i).trim()] = l.substring(i+1).trim(); });
const { deleteOldOGImages } = require('./lib/cdn/r2');
deleteOldOGImages('SLUG').then(() => console.log('OG images deleted from R2'));
"
```

**Note:** Setelah rollback, slug bisa dipakai ulang karena file sudah dihapus. Jika artikel sudah di-deploy ke production, lakukan `git rm content/articles/SLUG.md && git commit && git push` untuk hapus dari production juga.

## Error Prevention Reference

Bug yang pernah terjadi dan cara mencegah:

| Bug | Penyebab | Pencegahan |
|-----|----------|------------|
| Artikel tidak muncul di homepage | `publishedAt` null atau di masa depan dengan status `published` | Step 4: WAJIB set `publishedAt` ke now/past untuk published, future untuk scheduled |
| Artikel tidak punya penulis | `author` null atau slug salah di frontmatter | Step 0: cek author slug dari `content/config.ts` |
| TOC kosong di artikel | Heading pakai h1 atau tidak ada h2 | Step 0.5: h2/h3 only, min 3 h2 |
| Internal link kurang dari 2 | Tidak ada validasi internal linking | Step 0.5: cek min 2 link ke `/artikel/` |
| Slug duplikat | Tidak cek file exists sebelum insert | Step 0: cek `existsSync(content/articles/SLUG.md)` |
| Scheduled article muncul sebelum waktunya | Loader tidak filter `publishedAt <= now()` | Loader sudah filter `status === 'published' && publishedAt <= now()` |
| Scheduled article tidak auto-publish | `CRON_SECRET` belum set atau tidak sinkron antara Vercel dan GitHub Secrets | Set `CRON_SECRET` di Vercel dashboard DAN GitHub Secrets, pastikan nilai sama |
| OG image null di meta tags | `post_metadata` belum di-populate (OG belum di-generate) | Step 5: generate OG via API atau tunggu cron auto-generate untuk scheduled |
| Artikel terdeteksi AI-generated | AI vocabulary (EN+ID), staccato drama, copula avoidance, significance inflation, signposting, filler, promotional language | Step 1: jalankan humanizer audit script (15 kategori di `files/HumanizerRules.md`), fix semua FAIL sebelum insert |
| AI vocab Indonesia (signifikan, krusial, mendalam) | Kata-kata formal yang sering dihasilkan AI bahasa Indonesia | Step 1: audit script cek AI vocab ID, ganti dengan kata natural |
| Curly quotes di body | Editor/CMS auto-convert straight quotes | Step 1: cek curly quotes, replace dengan straight quotes |
| Fragmented headers (heading + 1 kalimat restates) | AI pattern: heading diikuti kalimat yang hanya mengulang heading | Step 1: hapus kalimat restates, langsung masuk konten |
| Rule of three overuse | AI pattern: memaksakan 3 item beruntun | Step 1: max 2x per artikel, pecah jadi 2 item atau kalimat terpisah |
| Negative parallelisms ("not only...but also") | AI pattern: konstruksi "tidak hanya...tapi juga" berlebihan | Step 1: rewrite jadi kalimat langsung tanpa parallel construction |
| Aphorism formulas ("X is the Y of Z") | AI pattern: kalimat terdengar profound tapi tidak presisi | Step 1: ganti dengan klaim konkret tanpa formula |
| Vague attribution ("studi menunjukkan") | AI pattern: klaim tanpa sumber spesifik | Step 1: wajib sebut nama studi + tahun + link |
| Generic conclusions ("masa depan cerah") | AI pattern: penutup generic dan tidak spesifik | Step 1: ganti dengan perspektif spesifik TAM |
| OG headline sama dengan title | Copy-paste title ke ogHeadline, OG image tidak optimal untuk social CTR | Step 0.5: ogHeadline HARUS berbeda, lebih pendek, punchy, conversational (max 50 chars) |
| Sitemap lastModified tidak update | `updatedAt` pakai `publishedAt` bukan file mtime | Loader sekarang pakai `statSync(filePath).mtime` untuk `updatedAt` |
