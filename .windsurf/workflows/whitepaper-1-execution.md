---
description: Workflow eksekusi whitepaper TAM, dari riset topik sampai distribusi multi-platform
---

# Whitepaper Execution Workflow

Workflow untuk whitepaper. Disimpan langsung di DB (tabel `whitepapers`) via Drizzle ORM. Tidak ada file Markdown. Setiap step harus complete sebelum lanjut.

## Env Var Reference

**Database (Drizzle ORM):** Whitepaper disimpan langsung di DB (tabel `whitepapers`). Tidak ada file Markdown.

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

```bash
export ARTICLE_JSON="/tmp/tam-article.json"
```

**CRITICAL:**
- Whitepaper disimpan langsung di DB (tabel `whitepapers`). Tidak ada file Markdown, tidak ada frontmatter.
- Jangan pakai Supabase REST API untuk insert konten.
- Pastikan ada `DATABASE_URL` di `.env.local`.

## Step -1: Topic Research & Angle Test

Sebelum drafting, validasi ide whitepaper. Fokus pada data + riset, bukan opini. Pastikan ada minimal 5 sumber primer.

**Untuk ide yang sudah melalui workflow `/content-ideation`** (file: `.windsurf/workflows/content-ideation.md`), langsung lanjut ke Step 0 dengan ide yang sudah terpilih.

**Untuk ide ad-hoc (tidak dari ideation workflow):** lakukan angle test di bawah ini.

**Angle Test (2 pertanyaan wajib):**
1. "Apakah ada media lain yang akan menulis ini dengan cara yang sama?" Jika ya, rewrite angle.
2. "Kalau saya hapus nama TAM dari whitepaper ini, apakah pembaca tahu ini tulisan TAM?" Jika tidak, terlalu generik.

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

**Checklist:**
- [ ] Angle test lolos (kedua pertanyaan)
- [ ] Minimal 5 sumber primer teridentifikasi
- [ ] Outline section dibuat
- [ ] Keyword target ditentukan (long-tail, Bahasa Indonesia)
- [ ] Minimal 1 insight unik yang tidak ada di 3 artikel pertama Google

## Step 0: Pre-Flight DB Check

Verifikasi struktur data sebelum insert. Cek slug uniqueness di DB.

**Cek slug uniqueness di DB (tabel `whitepapers`):**
```bash
npx tsx -e "
const fs = require('fs');
const path = require('path');
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const t = line.trim();
    if (!t || t.startsWith('#')) return;
    const i = t.indexOf('=');
    if (i === -1) return;
    process.env[t.substring(0, i).trim()] = t.substring(i + 1).trim();
  });
}
const { db } = require('./lib/db');
const { whitepapers } = require('./lib/db/schema');
const { eq } = require('drizzle-orm');
db.select().from(whitepapers).where(eq(whitepapers.slug, 'SLUG')).then(r => {
  if (r.length > 0) {
    console.log('FATAL: SLUG ALREADY EXISTS in whitepapers table');
    process.exit(1);
  } else {
    console.log('SLUG AVAILABLE: SLUG');
  }
}).catch(e => { console.error('FATAL:', e.message); process.exit(1); });
"
```

**Whitepaper DB fields (tabel `whitepapers`):**
- `title`, `slug`, `subtitle`, `summary`, `body` (markdown string)
- `coverImageUrl`, `author` (default: 'TAMPARAN ANAK MUDA'), `downloadUrl`
- `readingTime` (integer, default 10), `tags` (text array)
- `status` ('draft' atau 'published'), `publishedAt` (timestamp)
- Tidak ada frontmatter, POV tag, atau SEO fields terpisah (SEO dari title + summary)

**CRITICAL rules:**
- `publishedAt`: WAJIB set untuk whitepaper. `readingTime` di-set manual (default 10).
- `status='draft'` untuk unpublished, `status='published'` untuk live
- Tidak ada scheduled/cron untuk whitepaper — publish manual dengan ubah `status` di DB
- Slug harus unique di tabel `whitepapers`

## Step 0.5: Draft Writing Guidelines

Aturan formatting markdown body whitepaper sebelum masuk ke QC.

**Word Count (STANDAR TAM):**
- Target: 3.000-10.000 kata (15-60 menit baca)
- Referensi: `files/templates/article-template.md`, `files/ContentStrategy.md`
- Di bawah 3.000 kata = terlalu tipis untuk whitepaper, pertimbangkan jadi artikel (gunakan workflow `/artikel-1-execution`)

**Heading Structure (CRITICAL untuk Table of Contents):**
- Gunakan `##` (h2) untuk section utama, `###` (h3) untuk sub-section
- JANGAN gunakan `#` (h1) di body, h1 sudah dipakai untuk title
- TableOfContents parse h2 dan h3. Jika tidak ada, TOC kosong
- Minimal 5 heading h2 untuk TOC berfungsi (whitepaper lebih panjang dari artikel)

**Internal Linking (Wajib):**
- Minimal 3 link ke artikel atau whitepaper TAM lain di body
- Format: `[judul](/artikel/slug-artikel)` atau `[judul](/whitepaper/slug-whitepaper)`
- Cek artikel relevan via `files/article-inventory.md` (baca file lokal, nggak perlu query DB atau search online)

**Markdown Rules:**
- Tidak ada raw HTML `<script>`, `<iframe>`, `<style>` di body
- Gunakan `![alt](url)` untuk gambar, bukan `<img>`
- Link eksternal pakai `[text](url)`, tidak perlu `target="_blank"`

**Punctuation:**
- Tidak pakai em dash (—) atau en dash (–)
- Maks 1 exclamation mark per whitepaper
- Tidak pakai ellipsis (...) sebagai desain

## Step 1: Editorial QC Audit (All-in-One)

Validasi semua data, klaim, pola AI, heading, dan metadata dalam satu command. Jalankan sampai CLEAN, fix semua FAIL, re-run. Word count target: 3.000-10.000.

**Humanizer rules lengkap:** Lihat `files/HumanizerRules.md` (single source of truth, 15 kategori).

**Checklist (wajib semua sebelum lanjut Step 2):**
- [ ] Setiap angka punya sumber yang bisa ditrace (URL aktif di sourceReferences atau inline links)
- [ ] Angka di konten cocok dengan sumber (tidak dibulat-bulat)
- [ ] Tidak ada angka tanpa atribusi sumber di kalimat yang sama
- [ ] Data tidak outdated (max 2 tahun untuk data ekonomi)
- [ ] Heading: h2/h3 only, minimal 5 h2, tidak ada h1
- [ ] Internal linking: minimal 3 link ke konten TAM lain
- [ ] Tidak ada raw HTML script/iframe/style di body
- [ ] Word count: 3.000-10.000 kata
- [ ] No em dash, no en dash, no curly quotes
- [ ] No AI vocab EN/ID (lihat HumanizerRules.md)
- [ ] No staccato drama, rule-of-three abuse (>2x), negative parallelisms
- [ ] No promotional language, signposting, filler, generic conclusions
- [ ] Max 1 exclamation mark
- [ ] Human signature: minimal 1 paragraf pengalaman/observasi/opini spesifik
- [ ] Tone: jujur, rasional, berani, tidak menggurudi

**Command (all-in-one audit, jalankan sampai CLEAN):**
```bash
npx tsx -e "
const fs = require('fs');
const a = JSON.parse(fs.readFileSync(process.env.ARTICLE_JSON || '/tmp/tam-article.json', 'utf8'));
const body = a.body || '';
const title = a.title || '';
const full = body + ' ' + title;
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

// Heading structure
const h1 = (body.match(/^# /gm) || []).length;
const h2 = (body.match(/^## /gm) || []).length;
const h3 = (body.match(/^### /gm) || []).length;
if (h1 > 0) issues.push('h1 found: ' + h1 + ' (use h2/h3 only)');
if (h2 < 5) issues.push('h2 count: ' + h2 + ' (need min 5 for whitepaper)');

// Internal links
const ilArtikel = (body.match(/\]\(\/artikel\//g) || []).length;
const ilWp = (body.match(/\]\(\/whitepaper\//g) || []).length;
const il = ilArtikel + ilWp;
if (il < 3) issues.push('Internal links: ' + il + ' (need min 3)');

// Word count
const wc = body.split(/\s+/).filter(w => w.length > 0).length;
if (wc < 3000) issues.push('Word count: ' + wc + ' (need min 3.000 for whitepaper)');
if (wc > 10000) issues.push('Word count: ' + wc + ' (max 10.000)');

// Data attribution check
const numberSentences = sentences.filter(s => /\d+%|\d+\s*(triliun|miliar|juta|ribu)|Rp[\d.,]+|\d+\s*(persen|%)/i.test(s));
const unattributed = numberSentences.filter(s => !/(menurut|berdasarkan|data|catatan|mencatat|riset|survei|studi|OJK|BPS|We Are Social|Kemenkop|Jakpat)/i.test(s));
if (unattributed.length > 0) issues.push('Unattributed numbers: ' + unattributed.length + ' sentences with numbers but no source');

console.log('=== ALL-IN-ONE QC AUDIT (WHITEPAPER) ===');
console.log('Word count:', wc, '| h2:', h2, '| h3:', h3, '| internal links:', il);
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
- Step 1 CLEAN adalah **gate** untuk lanjut ke Step 2

## Step 2: SEO & Source Verification

Verifikasi semua source URL aktif sebelum insert.

### 2a. Source Verification (Tier System)

**Tier 1: Terverifikasi langsung dari publikasi asli** - URL aktif, data bisa dikonfirmasi
**Tier 2: Tidak terverifikasi langsung** - Data dikutip dari media sekunder, wajib label atribusi

**Yang harus dihapus:** Dead link, sample terlalu kecil (n < 5.000), blog post tanpa data primer

**Command cek HTTP status semua inline links di body:**
```bash
node -e "
const fs = require('fs');
const a = JSON.parse(fs.readFileSync(process.env.ARTICLE_JSON || '/tmp/tam-article.json', 'utf8'));
const body = a.body || '';
const urls = [...body.matchAll(/\]\((https?:\/\/[^)]+)\)/g)].map(m => m[1]);
(async () => {
  for (const url of urls) {
    try {
      const res = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(10000) });
      console.log((res.status >= 200 && res.status < 400 ? 'OK' : 'DEAD') + ' [' + res.status + '] ' + url);
    } catch (e) {
      console.log('DEAD [ERR] ' + url);
    }
  }
})();
"
```

### 2b. SEO Metadata Check

Whitepaper tidak punya SEO fields terpisah. SEO dari `title` + `summary`.

**Checklist:**
- [ ] Semua source URL aktif (HTTP 200-399)
- [ ] Tidak ada dead link di body
- [ ] `title`: max 70 karakter (untuk SEO meta title)
- [ ] `summary`: max 300 karakter (untuk SEO meta description + card display)
- [ ] `slug`: kebab-case, keyword di awal, max 60 karakter, unique di tabel `whitepapers`
- [ ] h2 mengandung secondary keyword
- [ ] Internal linking: minimal 3 link, anchor text bervariasi

## Step 4: Whitepaper DB Insert

Insert langsung ke DB via Drizzle ORM (tabel `whitepapers`). Tidak ada file Markdown, tidak ada frontmatter.

**Whitepaper JSON Template (simpan ke `$ARTICLE_JSON`):**
```json
{
  "title": "Judul Whitepaper",
  "slug": "slug-whitepaper-kebab-case",
  "subtitle": "Subtitle whitepaper (opsional)",
  "summary": "Summary untuk SEO dan card display (max 300 karakter)",
  "body": "## Section 1\n\nKonten...\n\n## Section 2\n\nKonten...",
  "author": "TAMPARAN ANAK MUDA",
  "download_url": null,
  "reading_time": 15,
  "tags": ["riset", "gen z", "data"],
  "status": "published",
  "published_at": "2026-01-01T00:00:00.000Z"
}
```

**Insert command (DB via Drizzle ORM):**
```bash
npx tsx -e "
const fs = require('fs');
const path = require('path');

// Load env
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const t = line.trim();
    if (!t || t.startsWith('#')) return;
    const i = t.indexOf('=');
    if (i === -1) return;
    process.env[t.substring(0, i).trim()] = t.substring(i + 1).trim();
  });
}

const { db } = require('./lib/db');
const { whitepapers } = require('./lib/db/schema');

const wp = JSON.parse(fs.readFileSync(process.env.ARTICLE_JSON || '/tmp/tam-article.json', 'utf8'));

// VALIDASI
if (!wp.slug || !wp.title || !wp.body) {
  console.error('FATAL: slug, title, body are required'); process.exit(1);
}
if (!wp.published_at) {
  console.error('FATAL: published_at is required'); process.exit(1);
}

db.insert(whitepapers).values({
  slug: wp.slug,
  title: wp.title,
  subtitle: wp.subtitle || null,
  summary: wp.summary || null,
  body: wp.body,
  coverImageUrl: wp.cover_image_url || null,
  author: wp.author || 'TAMPARAN ANAK MUDA',
  downloadUrl: wp.download_url || null,
  readingTime: wp.reading_time || 10,
  tags: wp.tags || [],
  status: wp.status === 'scheduled' ? 'draft' : (wp.status || 'published'),
  publishedAt: wp.published_at,
}).then(() => {
  console.log('Whitepaper inserted to DB:', wp.slug);
  console.log('status:', wp.status || 'published');
  console.log('published_at:', wp.published_at);
  console.log('reading_time:', wp.reading_time || 10, 'min');
}).catch(e => {
  console.error('FATAL:', e.message);
  process.exit(1);
});
"
```

**Catatan Whitepaper:**
- Tidak ada frontmatter, tidak ada file Markdown
- Slug harus unique di tabel `whitepapers`
- `status='draft'` untuk unpublished, `status='published'` untuk live
- Tidak ada scheduled/cron untuk whitepaper — publish manual dengan ubah `status` di DB
- OG image untuk whitepaper: generate manual (template berbeda dari artikel)

## Step 4.5: Post-Insert Verification

Verifikasi whitepaper tersimpan di DB.

**Command (DB query verification):**
```bash
npx tsx -e "
const fs = require('fs');
const path = require('path');
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const t = line.trim();
    if (!t || t.startsWith('#')) return;
    const i = t.indexOf('=');
    if (i === -1) return;
    process.env[t.substring(0, i).trim()] = t.substring(i + 1).trim();
  });
}
const { db } = require('./lib/db');
const { whitepapers } = require('./lib/db/schema');
const { eq } = require('drizzle-orm');
db.select().from(whitepapers).where(eq(whitepapers.slug, 'SLUG')).then(r => {
  const w = r[0];
  if (!w) { console.error('FATAL: Whitepaper not found in DB'); process.exit(1); }
  console.log('=== Whitepaper Verification ===');
  console.log('slug:', w.slug);
  console.log('status:', w.status);
  console.log('publishedAt:', w.publishedAt);
  console.log('readingTime:', w.readingTime);
  console.log('body length:', w.body.length, 'chars');
  console.log('All checks passed.');
}).catch(e => { console.error('FATAL:', e.message); process.exit(1); });
"
```

**Checklist:**
- [ ] Whitepaper exists di DB dengan slug yang benar
- [ ] `status` = `published` atau `draft`
- [ ] `publishedAt` tidak null
- [ ] `body` tidak kosong
- [ ] `readingTime` > 0

## Step 5: OG Image Generation

Whitepaper OG image: generate manual (template berbeda dari artikel). Tidak ada auto-generate via cron.

**Generate via API (admin auth required):**
```bash
curl -s -X POST "https://tamparananakmuda.com/api/og/generate" \
  -H "Content-Type: application/json" \
  -H "Cookie: <admin-session-cookie>" \
  -d '{"slug":"SLUG"}'
```

**Verify di R2 CDN:**
```bash
curl -s -o /dev/null -w "card: %{http_code} (%{size_download} bytes)\n" "https://cdn.tamparananakmuda.com/og/SLUG-card.webp"
curl -s -o /dev/null -w "feature: %{http_code} (%{size_download} bytes)\n" "https://cdn.tamparananakmuda.com/og/SLUG-feature.webp"
```

**Checklist:**
- [ ] OG image sukses generate (no errors)
- [ ] `og/{slug}-card.webp` HTTP 200 di CDN
- [ ] `og/{slug}-feature.webp` HTTP 200 di CDN
- [ ] Headline tidak terpotong
- [ ] Brand mark (TAMPARAN ANAK MUDA) terlihat

## Step 6: Production Verification

Whitepaper tidak perlu deploy. Di-insert ke DB, langsung live saat `status='published'`. Tidak ada file yang di-commit.

**Verifikasi production:**
```bash
# HTTP status
curl -s -o /dev/null -w "whitepaper: %{http_code}\n" "https://tamparananakmuda.com/whitepaper/SLUG"

# Sitemap includes whitepaper
curl -s "https://tamparananakmuda.com/sitemap.xml" | grep "SLUG" && echo "Sitemap OK" || echo "Sitemap MISSING"
```

**Checklist:**
- [ ] HTTP 200 di production `/whitepaper/SLUG`
- [ ] Sitemap includes new slug
- [ ] Whitepaper muncul di `/whitepaper` list page

## Step 6.5: SEO Indexing

Submit URL baru ke Google dan cek indexing.

**Submit ke Google Search Console (manual via browser):**
1. Buka https://search.google.com/search-console
2. Masukkan URL: `https://tamparananakmuda.com/whitepaper/SLUG`
3. Klik "Request Indexing"

**Ping sitemap:**
```bash
curl -s "https://www.google.com/ping?sitemap=https://tamparananakmuda.com/sitemap.xml" && echo "Sitemap pinged"
```

**Checklist:**
- [ ] URL submitted ke Google Search Console
- [ ] Sitemap pinged

## Step 7: Content Atomization

Pecah whitepaper jadi format distribusi multi-platform. Whitepaper lebih data-heavy, jadi format distribusi lebih panjang.

### 7a. Instagram Carousel (8-12 slides)
- Slide 1: Hook headline + visual (brand colors, Syne font)
- Slide 2-10: Key data points (1 per slide, max 3 angka per slide)
- Slide 11: Pertanyaan refleksi
- Slide 12: CTA ke full whitepaper (`tamparananakmuda.com/whitepaper/SLUG`)

**Spec:** 1080x1080px, OLED black background, category color accent

### 7b. Newsletter (600-800 words)
- Subject line: 1 insight utama, bukan judul whitepaper
- Opening: 1 paragraf hook (bukan copy whitepaper)
- Body: 2-3 insight + 1 quote yang striking
- Closing: 1 pertanyaan untuk subscriber
- CTA: Link ke full whitepaper

**Kirim via:** Brevo dashboard (manual, bukan automated API)

### 7c. IG Stories (3-5 stories)
- Story 1: Polling question terkait topik
- Story 2-3: Key takeaways dengan visual
- Story 4: Q&A sticker
- Story 5: Link sticker ke whitepaper

### 7d. TikTok/Reels Script
- Tidak direkomendasikan untuk whitepaper (terlalu kompleks untuk short-form video)
- Jika ingin dibuat, pecah jadi beberapa video pendek dengan 1 insight per video

### 7e. X/Twitter Thread (5-8 tweets)
- Tweet 1: Hook (1 kalimat tajam + angka/data yang mengejutkan)
- Tweet 2-6: Key insight (1 insight per tweet, max 280 chars, pakai thread numbering)
- Tweet 7: Quote atau data yang striking dari whitepaper
- Tweet 8: CTA ke full whitepaper (`tamparananakmuda.com/whitepaper/SLUG`)
- Tone: langsung, no fluff, pakai bahasa Indonesia
- Posting: manual via X app atau scheduler (Buffer/Hootsuite)

### 7f. LinkedIn Post (400-600 words + publish sebagai LinkedIn Article)
- Hook line: 1 kalimat yang relevan untuk professional audience (karir, bisnis, keuangan)
- Body: 2-3 insight utama dengan sudut pandang professional (bukan copy whitepaper)
- Format: short paragraphs, no bullet spam, conversational tone
- CTA: "Baca analisis lengkapnya di sini: tamparananakmuda.com/whitepaper/SLUG"
- Hashtags: 3-5 relevant hashtags (contoh: #GenZ #Riset #Data #Indonesia)
- Posting: publish sebagai LinkedIn Article (bukan post biasa) untuk reach lebih luas

## Step 8: Distribution Schedule

Jadwalkan distribusi sesuai content calendar.

**Timeline:**
```
Hari 1 (Senin): Publish whitepaper di website
Hari 2 (Selasa): Post IG Carousel + Stories + X/Twitter thread
Hari 3 (Rabu): Kirim newsletter + LinkedIn Article
Hari 7 (Senin): Review analytics awal
```

**Tools:**
- IG posting: Manual atau Meta Business Suite
- X/Twitter: Manual via X app atau Buffer/Hootsuite
- LinkedIn: Publish sebagai LinkedIn Article
- Newsletter: Brevo dashboard

## Step 9: Analytics Tracking

Monitor performa whitepaper 7 hari setelah publish.

**Metrics to track (via Umami):**
- Page views
- Unique visitors
- Average reading time
- Scroll depth
- Email subscribe rate dari whitepaper
- Social referral traffic
- Bounce rate
- PDF download count (jika `downloadUrl` di-set)

**Review schedule:**
- H+1: Cek apakah whitepaper ter-index Google (site:search)
- H+3: Cek social engagement (likes, shares, saves)
- H+7: Review metrics awal vs target
- H+30: Full performance review, decide if refresh needed

## Step 10: Post-Publish Maintenance

**Monthly:**
- Cek apakah data di whitepaper masih relevan
- Update jika ada survei baru yang relevan
- Cek internal links masih aktif
- Refresh SEO jika ranking turun

**Quarterly:**
- Review whitepaper secara keseluruhan
- Identifikasi whitepaper untuk update vs archive
- Plan whitepaper baru berdasarkan performa

## Step 11: Rollback Procedure

Jika insert gagal atau whitepaper salah publish, undo dengan:

**Delete whitepaper dari DB (via Drizzle ORM):**
```bash
npx tsx -e "
const fs = require('fs');
const path = require('path');
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const t = line.trim();
    if (!t || t.startsWith('#')) return;
    const i = t.indexOf('=');
    if (i === -1) return;
    process.env[t.substring(0, i).trim()] = t.substring(i + 1).trim();
  });
}
const { db } = require('./lib/db');
const { whitepapers } = require('./lib/db/schema');
const { eq } = require('drizzle-orm');
db.delete(whitepapers).where(eq(whitepapers.slug, 'SLUG')).then(() => {
  console.log('Whitepaper deleted from DB: SLUG');
}).catch(e => { console.error('FATAL:', e.message); process.exit(1); });
"
```

**Delete OG images dari R2 (jika ada):**
```bash
npx tsx -e "
require('fs').readFileSync('.env.local','utf8').split('\n').forEach(l => { const i=l.indexOf('='); if(i>0) process.env[l.substring(0,i).trim()] = l.substring(i+1).trim(); });
const { deleteOldOGImages } = require('./lib/cdn/r2');
deleteOldOGImages('SLUG').then(() => console.log('OG images deleted from R2'));
"
```
