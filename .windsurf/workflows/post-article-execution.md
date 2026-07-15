---
description: Workflow lengkap untuk eksekusi artikel TAM, dari riset topik sampai distribusi multi-platform
---

# Post-Article Execution Workflow

Workflow ini mencakup seluruh pipeline: riset, drafting, QC, insert database, deploy, distribusi, dan maintenance. Setiap step harus complete sebelum lanjut.

## Env Var Reference

| Env Var | Fungsi | Scope |
|---------|--------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL Supabase project | Public |
| `SUPABASE_SERVICE_ROLE_KEY` | Bypass RLS untuk insert | Server only |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Read published posts (RLS) | Public |
| `NEXT_PUBLIC_SITE_URL` | URL production | Public |
| `BREVO_API_KEY` | Newsletter | Server only |
| `BREVO_LIST_ID` | Subscriber list | Server only |
| `R2_ACCESS_KEY_ID` | Cloudflare R2 S3 access key | Server only |
| `R2_SECRET_ACCESS_KEY` | Cloudflare R2 S3 secret | Server only |
| `R2_ENDPOINT` | R2 S3 endpoint URL | Server only |
| `R2_BUCKET_NAME` | R2 bucket name (`cdn-tam`) | Server only |
| `CDN_BASE_URL` | CDN domain (`https://cdn.tamparananakmuda.com`) | Public |

```bash
export SUPA_URL="$NEXT_PUBLIC_SUPABASE_URL"
export SUPA_KEY="$SUPABASE_SERVICE_ROLE_KEY"
export ARTICLE_JSON="/tmp/tam-article.json"
```

## Step -1: Topic Research & Angle Test

Sebelum drafting, validasi ide artikel. Mencegah artikel generik dan memastikan angle TAM unik.

**Untuk ide yang sudah melalui workflow `/content-ideation`**, langsung lanjut ke Step 0 dengan ide yang sudah terpilih.

**Untuk ide ad-hoc (tidak dari ideation workflow):** lakukan angle test di bawah ini.

**Angle Test (2 pertanyaan wajib):**
1. "Apakah ada media lain yang akan menulis ini dengan cara yang sama?" Jika ya, rewrite angle.
2. "Kalau saya hapus nama TAM dari artikel ini, apakah pembaca tahu ini tulisan TAM?" Jika tidak, terlalu generik.

**POV Selection (wajib pilih salah satu):**
- `kontra-narasi` - melawan narasi populer dengan dasar kuat
- `refleksi` - pengalaman/observasi personal yang spesifik
- `data` - data + interpretasi yang tidak obvious
- `framework` - kerangka berpikir original

**Category Reference:**
| Slug | Title | Color |
|------|-------|-------|
| `mindset` | Mindset | #D13A3A |
| `karir-tujuan` | Karir & Tujuan | #4080D9 |
| `relasi` | Relasi | #40B880 |
| `keuangan` | Keuangan | #D9A040 |
| `identitas` | Identitas | #A040D9 |

**Checklist:**
- [ ] Angle test lolos (kedua pertanyaan)
- [ ] POV tag dipilih
- [ ] Category dipilih
- [ ] Keyword target ditentukan (long-tail, Bahasa Indonesia)
- [ ] Minimal 1 insight unik yang tidak ada di 3 artikel pertama Google

## Step 0: Pre-Flight Database Check

Verifikasi struktur data sesuai schema database aktual. Mencegah error 500 di production.

**Cek koneksi database:**
```bash
curl -s "$SUPA_URL/rest/v1/posts?select=id&limit=1" \
  -H "apikey: $SUPA_KEY" \
  -H "Authorization: Bearer $SUPA_KEY" | node -e "
const d=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8'));
if(d.message) console.error('DB ERROR:', d.message);
else console.log('DB connection OK');
"
```

**Cek slug uniqueness (CRITICAL):**
```bash
curl -s "$SUPA_URL/rest/v1/posts?slug=eq.SLUG&select=id,slug" \
  -H "apikey: $SUPA_KEY" \
  -H "Authorization: Bearer $SUPA_KEY" | node -e "
const d=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8'));
if(d.length > 0) { console.error('FATAL: Slug exists!', d[0].slug); process.exit(1); }
else console.log('Slug available');
"
```

**Cek category_id:**
```bash
curl -s "$SUPA_URL/rest/v1/categories?slug=eq.karir-tujuan&select=id,title,color" \
  -H "apikey: $SUPA_KEY" -H "Authorization: Bearer $SUPA_KEY" | node -e "
const d=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8'));
if(d[0]) console.log('ID:', d[0].id, '| Color:', d[0].color);
else console.error('Category not found');
"
```

**Cek author_id (default: Yovie Setiawan):**
```bash
curl -s "$SUPA_URL/rest/v1/authors?slug=eq.yovie-setiawan&select=id,name" \
  -H "apikey: $SUPA_KEY" -H "Authorization: Bearer $SUPA_KEY" | node -e "
const d=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8'));
if(d[0]) console.log('Author ID:', d[0].id, '| Name:', d[0].name);
else console.error('Author not found');
"
```

**Kolom ADA di `posts` (verified dari schema + migrations):**
- `id`, `title`, `slug`, `excerpt`, `body`, `category_id`, `author_id`, `status`
- `pov_tag`, `human_signature`, `fact_check_status`, `review_status`
- `source_references` (JSONB array, BUKAN string)
- `seo_meta_title`, `seo_meta_description`, `reading_time`
- `og_headline`, `og_card_url`, `og_feature_url`, `og_image_url`, `cover_image_url`, `cover_image_alt`, `is_premium`, `is_sponsored`
- `sponsor_name`, `sponsor_url`, `sponsor_disclosure`, `premium_excerpt`
- `series_id`, `series_order`, `published_at`, `created_at`, `updated_at`, `featured`

**Kolom TIDAK ADA:** `tags`

**CRITICAL rules:**
- `source_references`: HARUS JSON array, bukan string. Format: `[{"type":"link","url":"...","label":"..."}]`
- `excerpt`: MAX 160 karakter (DB constraint `char_length <= 160`)
- `seo_meta_description`: MAX 160 karakter (DB constraint)
- `reading_time`: Auto-calculated by DB trigger, tidak perlu manual insert
- `published_at`: WAJIB set ke `new Date().toISOString()`. Jika null, artikel tidak muncul di top homepage (sort by `published_at DESC`)

## Step 0.5: Draft Writing Guidelines

Aturan formatting markdown body artikel sebelum masuk ke QC.

**Heading Structure (CRITICAL untuk Table of Contents):**
- Gunakan `##` (h2) untuk section utama, `###` (h3) untuk sub-section
- JANGAN gunakan `#` (h1) di body, h1 sudah dipakai untuk title
- TableOfContents parse h2 dan h3. Jika tidak ada, TOC kosong
- Minimal 3 heading h2 untuk TOC berfungsi

**Internal Linking (Wajib):**
- Minimal 2 link ke artikel TAM lain di body
- Format: `[judul](/artikel/slug-artikel)`
- Cek artikel relevan:
```bash
curl -s "$SUPA_URL/rest/v1/posts?status=eq.published&select=title,slug&limit=20" \
  -H "apikey: $SUPA_KEY" -H "Authorization: Bearer $SUPA_KEY" | node -e "
const d=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8'));
d.forEach(p => console.log(p.title + ' -> /artikel/' + p.slug));
"
```

**Markdown Rules:**
- Tidak ada raw HTML `<script>`, `<iframe>`, `<style>` di body
- Gunakan `![alt](url)` untuk gambar, bukan `<img>`
- Link eksternal pakai `[text](url)`, tidak perlu `target="_blank"`

**Punctuation:**
- Tidak pakai em dash (—) atau en dash (–)
- Maks 1 exclamation mark per artikel
- Tidak pakai ellipsis (...) sebagai desain

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
"
```

## Step 1: Editorial QC Audit

Validasi semua data dan klaim dalam artikel sebelum masuk ke database.

**Checklist:**
- [ ] Setiap angka punya sumber yang bisa ditrace (URL aktif)
- [ ] Tidak ada em dash (—) atau en dash (–) di body, title, excerpt, meta
- [ ] Tidak ada AI vocabulary: crucial, pivotal, vibrant, tapestry, delve, showcase, underscore, testament, foster, garner, intricate, landscape
- [ ] Tidak ada rule-of-three abuse (3 item list beruntun lebih dari 2x per artikel)
- [ ] Tidak ada promotional language ("game-changing", "revolutionary", dll)
- [ ] Tidak ada vague attribution ("studies show..." tanpa sumber spesifik)
- [ ] Tone check: jujur, rasional, berani, tidak menggurui
- [ ] POV tag dipilih: kontra-narasi / refleksi / data / framework
- [ ] Human signature: minimal 1 paragraf dari pengalaman/observasi/opini spesifik
- [ ] Heading structure: h2/h3 only, minimal 3 h2, tidak ada h1
- [ ] Internal linking: minimal 2 link ke artikel TAM lain
- [ ] Tidak ada raw HTML script/iframe/style di body

**Command:**
```bash
# Cek em dash dan en dash
grep -c '—' "$ARTICLE_JSON" || echo "0 em dashes"
grep -c '–' "$ARTICLE_JSON" || echo "0 en dashes"

# Cek AI vocabulary
python3 -c "
import json
d = json.load(open('$ARTICLE_JSON'))
ai_words = ['crucial','pivotal','vibrant','tapestry','delve','showcase','underscore','testament','foster','garner','intricate','landscape']
found = [w for w in ai_words if w in d['body'].lower()]
print(f'AI vocabulary found: {found if found else \"None\"}')
"

# Cek heading + internal links
node -e "
const fs = require('fs');
const a = JSON.parse(fs.readFileSync('$ARTICLE_JSON', 'utf8'));
const b = a.body;
const h1 = (b.match(/^# /gm) || []).length;
const h2 = (b.match(/^## /gm) || []).length;
const il = (b.match(/\]\(\/artikel\//g) || []).length;
console.log('h1:', h1, h1 > 0 ? 'WARNING' : 'OK');
console.log('h2:', h2, h2 < 3 ? 'WARNING: need 3+' : 'OK');
console.log('internal links:', il, il < 2 ? 'WARNING: need 2+' : 'OK');
"
```

**Content Quality Score (0-100, target > 80):**

| Komponen | Max | Kriteria |
|----------|-----|----------|
| Angle test | 25 | Lolos percobaan pertama (25), kedua (15), ketiga+ (5) |
| Human signature | 25 | Pengalaman personal (25), observasi (20), opini spesifik (15), tidak ada (0) |
| Fact-check | 25 | Semua klaim terverifikasi (25), minor issues (15), flagged (0) |
| POV clarity | 25 | POV tag dipilih dan konsisten (25), tidak konsisten (10), tidak ada (0) |

## Step 2: Source Verification (Tier System)

Klasifikasi semua sumber ke dalam tier reliability.

**Tier 1: Terverifikasi langsung dari publikasi asli**
- URL aktif dan bisa diakses
- Data bisa dikonfirmasi di halaman sumber
- Tidak ada perantara (artikel sekunder yang mengutip)

**Tier 2: Tidak terverifikasi langsung, digunakan dengan atribusi jelas**
- Data dikutip dari media sekunder (contoh: "menurut data Jakpat yang dikutip Mojok.co")
- Tidak bisa konfirmasi langsung dari publikasi primer
- Wajib label atribusi di body artikel

**Yang harus dihapus:**
- Sumber yang URL-nya dead link
- Data dari survei internal dengan sample terlalu kecil (n < 5.000 untuk klaim general)
- Blog post tanpa data primer
- Artikel sekunder yang tidak menambah data unik

**Output:** Update `source_references` di JSON dengan hanya sumber yang lulus verifikasi.

## Step 3: SEO Metadata Finalization

Pastikan semua metadata SEO optimal sebelum insert ke database.

**Checklist:**
- [ ] `seo_meta_title`: max 70 karakter, mengandung keyword utama
- [ ] `seo_meta_description`: **MAX 160 karakter** (DB constraint)
- [ ] `slug`: kebab-case, mengandung keyword, max 60 karakter, **unique** (cek di Step 0)
- [ ] `excerpt`: **MAX 160 karakter** (DB constraint)
- [ ] `og_headline`: max 60 karakter untuk OG image (fallback ke title)
- [ ] Internal linking: identifikasi minimal 2 artikel TAM lain untuk di-link di body
- [ ] `category_id`: sudah di-query dari Step 0
- [ ] `author_id`: sudah di-query dari Step 0 (default: Yovie Setiawan)

**Command:**
```bash
python3 -c "
import json
d = json.load(open('$ARTICLE_JSON'))
print(f'SEO title: {len(d[\"seo_meta_title\"])} chars (max 70)')
print(f'SEO desc: {len(d[\"seo_meta_description\"])} chars (max 160)')
print(f'Slug: {len(d[\"slug\"])} chars (max 60)')
excerpt_len = len(d['excerpt'])
print(f'Excerpt: {excerpt_len} chars (max 160)')
if excerpt_len > 160:
    print('WARNING: Excerpt exceeds 160 chars! Will fail DB insert.')
    print('Trim to:', d['excerpt'][:157] + '...')
seo_desc_len = len(d['seo_meta_description'])
if seo_desc_len > 160:
    print('WARNING: SEO description exceeds 160 chars! Will fail DB insert.')
"
```

## Step 4: Database Insert

Insert artikel ke Supabase database. Gunakan **service role key** (bukan anon key) untuk bypass RLS.

**CRITICAL - Gunakan `$SUPA_KEY` (SUPABASE_SERVICE_ROLE_KEY), bukan anon key.**

**Article JSON Template (simpan ke `$ARTICLE_JSON`):**
```json
{
  "title": "Judul Artikel",
  "slug": "slug-artikel-kebab-case",
  "excerpt": "Excerpt max 160 karakter",
  "body": "## Heading 1\n\nKonten...\n\n## Heading 2\n\nKonten...\n\n### Sub-heading\n\nKonten...",
  "category_id": "UUID dari Step 0",
  "author_id": "UUID dari Step 0",
  "status": "published",
  "pov_tag": "data",
  "human_signature": true,
  "fact_check_status": "verified",
  "review_status": "publish",
  "source_references": [
    {"type": "link", "url": "https://sumber.com", "label": "Nama Sumber"}
  ],
  "featured": true,
  "seo_meta_title": "SEO Title max 70",
  "seo_meta_description": "SEO desc max 160",
  "og_headline": "OG headline max 60",
  "published_at": "2026-01-01T00:00:00.000Z"
}
```

**Optional fields (tambah hanya jika perlu):**
- `cover_image_url`, `cover_image_alt`: null (OG image auto-generate via R2)
- `og_card_url`, `og_feature_url`, `og_image_url`: null (auto-populated by OG generate step)
- `is_premium`, `premium_excerpt`: false, null
- `is_sponsored`, `sponsor_name`, `sponsor_url`, `sponsor_disclosure`: false, null
- `series_id`, `series_order`: null (untuk multi-part articles)

**Catatan:**
- `reading_time`: Tidak perlu insert. DB trigger auto-calculate dari body
- `published_at`: WAJIB set. Jika null, artikel tidak muncul di top homepage
- `source_references`: Field di DB pakai `label`, bukan `title`

**Insert command:**
```bash
# 1. Prepare payload
node -e "
const fs = require('fs');
const article = JSON.parse(fs.readFileSync('$ARTICLE_JSON', 'utf8'));

const payload = {
  title: article.title,
  slug: article.slug,
  excerpt: article.excerpt,
  body: article.body,
  category_id: article.category_id,
  author_id: article.author_id,
  status: 'published',
  pov_tag: article.pov_tag || 'data',
  human_signature: article.human_signature !== false,
  fact_check_status: 'verified',
  review_status: 'publish',
  source_references: article.source_references.map(r => ({
    type: r.type || 'link',
    url: r.url,
    label: r.label || r.title
  })),
  featured: article.featured || false,
  seo_meta_title: article.seo_meta_title,
  seo_meta_description: article.seo_meta_description,
  og_headline: article.og_headline || article.title,
  published_at: article.published_at || new Date().toISOString()
};

// VALIDASI
if (payload.excerpt.length > 160) {
  console.error('FATAL: excerpt > 160 chars (' + payload.excerpt.length + ')');
  process.exit(1);
}
if (payload.seo_meta_description && payload.seo_meta_description.length > 160) {
  console.error('FATAL: seo_meta_description > 160 chars');
  process.exit(1);
}
if (!Array.isArray(payload.source_references)) {
  console.error('FATAL: source_references must be array');
  process.exit(1);
}
if (!payload.published_at) {
  console.error('FATAL: published_at is required');
  process.exit(1);
}

fs.writeFileSync('/tmp/tam-payload.json', JSON.stringify(payload));
console.log('Payload ready. Array:', Array.isArray(payload.source_references));
"

# 2. Insert via curl
curl -s -X POST "$SUPA_URL/rest/v1/posts" \
  -H "apikey: $SUPA_KEY" \
  -H "Authorization: Bearer $SUPA_KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d @/tmp/tam-payload.json | node -e "
const d = JSON.parse(require('fs').readFileSync('/dev/stdin','utf8'));
if (d.message) { console.error('INSERT FAILED:', d.message); process.exit(1); }
console.log('Inserted:', d[0].slug);
console.log('source_references isArray:', Array.isArray(d[0].source_references));
console.log('published_at:', d[0].published_at);
console.log('author_id:', d[0].author_id);
if (!Array.isArray(d[0].source_references)) {
  console.error('WARNING: source_references not array! Will cause 500.');
}
if (!d[0].published_at) {
  console.error('WARNING: published_at is null! Article will not appear on homepage.');
}
"
```

## Step 4.5: Post-Insert Data Verification

Verifikasi data yang masuk DB sudah benar sebelum lanjut.

**Command:**
```bash
curl -s "$SUPA_URL/rest/v1/posts?slug=eq.SLUG&select=*" \
  -H "apikey: $SUPA_KEY" -H "Authorization: Bearer $SUPA_KEY" | node -e "
const d = JSON.parse(require('fs').readFileSync('/dev/stdin','utf8'));
const p = d[0];
if (!p) { console.error('NOT FOUND'); process.exit(1); }
console.log('=== Post-Insert Verification ===');
console.log('slug:', p.slug);
console.log('status:', p.status);
console.log('published_at:', p.published_at);
console.log('author_id:', p.author_id);
console.log('category_id:', p.category_id);
console.log('source_references isArray:', Array.isArray(p.source_references));
console.log('excerpt length:', p.excerpt ? p.excerpt.length : 'null', '(max 160)');
console.log('reading_time:', p.reading_time, '(auto-calculated)');
console.log('featured:', p.featured);

const issues = [];
if (!p.published_at) issues.push('published_at is null');
if (!p.author_id) issues.push('author_id is null');
if (!p.category_id) issues.push('category_id is null');
if (!Array.isArray(p.source_references)) issues.push('source_references not array');
if (p.excerpt && p.excerpt.length > 160) issues.push('excerpt > 160');

if (issues.length > 0) {
  console.error('ISSUES:', issues.join(', '));
  process.exit(1);
} else {
  console.log('All checks passed.');
}
"
```

**Checklist:**
- [ ] Response tidak ada `message` field (error)
- [ ] `source_references` isArray = `true`
- [ ] `published_at` tidak null
- [ ] `author_id` tidak null
- [ ] `category_id` tidak null
- [ ] `excerpt` length <= 160
- [ ] `reading_time` terisi (auto-calculated by trigger)

## Step 5: OG Image Generation (WebP via R2 CDN)

Setelah artikel di-insert, generate OG images ke R2 CDN. Sistem menghasilkan **2 WebP images per post**:
- **Card** (800x450) → `og/{slug}-card.webp` → untuk thumbnail article list
- **Feature** (1600x900) → `og/{slug}-feature.webp` → untuk header artikel + social meta tags

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

**Verify DB updated:**
```bash
curl -s "$SUPA_URL/rest/v1/posts?slug=eq.SLUG&select=og_card_url,og_feature_url,og_image_url" \
  -H "apikey: $SUPA_KEY" -H "Authorization: Bearer $SUPA_KEY" | node -e "
const d=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8'));
const p=d[0];
console.log('card:', p.og_card_url);
console.log('feature:', p.og_feature_url);
console.log('og:', p.og_image_url);
"
```

**Checklist:**
- [ ] API/batch script sukses generate (no errors)
- [ ] `og/{slug}-card.webp` HTTP 200 di CDN
- [ ] `og/{slug}-feature.webp` HTTP 200 di CDN
- [ ] DB: `og_card_url` = `https://cdn.tamparananakmuda.com/og/{slug}-card.webp`
- [ ] DB: `og_feature_url` = `https://cdn.tamparananakmuda.com/og/{slug}-feature.webp`
- [ ] DB: `og_image_url` = sama dengan `og_feature_url` (untuk social meta)
- [ ] Category color ter-aplikasi di accent pillar
- [ ] Headline tidak terpotong
- [ ] Brand mark (TAMPARAN ANAK MUDA) terlihat
- [ ] `og_headline` dipakai jika ada (fallback ke `title`)

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

**Known Vercel serverless issues:**
- `isomorphic-dompurify` crash di Vercel (jsdom dependency). Sudah diganti regex sanitizer di `components/markdown-content.tsx`. Jangan import library ini lagi.
- `cookies()` dari `next/headers` bisa fail di `generateMetadata` saat static generation. Gunakan `createPublicClient` dari `@/lib/supabase/public` (no cookies) untuk page components.

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

## Step 8: Distribution Schedule

Jadwalkan distribusi sesuai content calendar.

**Timeline:**
```
Hari 1 (Senin): Publish artikel di website
Hari 2 (Selasa): Post IG Carousel + Stories
Hari 3 (Rabu): Kirim newsletter
Hari 4 (Kamis): TikTok/Reels video (jika Phase 2 aktif)
Hari 7 (Senin): Review analytics awal
```

**Tools:**
- IG posting: Manual atau Meta Business Suite
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

**Delete post dari DB:**
```bash
curl -s -X DELETE "$SUPA_URL/rest/v1/posts?slug=eq.SLUG" \
  -H "apikey: $SUPA_KEY" \
  -H "Authorization: Bearer $SUPA_KEY" | node -e "
const d = JSON.parse(require('fs').readFileSync('/dev/stdin','utf8'));
if (d.message) console.error('DELETE FAILED:', d.message);
else console.log('Deleted:', d.length, 'rows');
"
```

**Delete OG images dari R2:**
```bash
# OG images sekarang disimpan di R2, bukan Vercel cache
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

**Note:** Setelah rollback, slug bisa dipakai ulang karena row sudah dihapus.

## Error Prevention Reference

Bug yang pernah terjadi dan cara mencegah:

| Bug | Penyebab | Pencegahan |
|-----|----------|------------|
| 500 di production (semua artikel) | `post.tags` di-reference di page.tsx tapi kolom tidak ada | Step 0: cek kolom yang ada |
| 500 di production (semua artikel) | `isomorphic-dompurify` crash di Vercel serverless | Sudah diganti regex sanitizer, jangan import lagi |
| `citations.map is not a function` | `source_references` di-insert sebagai string, bukan array | Step 4: verifikasi isArray setelah insert |
| DB insert ditolak | `excerpt` > 160 karakter (constraint violation) | Step 3: cek excerpt length sebelum insert |
| DB insert ditolak | `seo_meta_description` > 160 karakter (constraint violation) | Step 3: cek seo_meta_description length |
| DB insert ditolak (RLS) | Pakai anon key untuk insert | Step 4: selalu pakai service role key |
| 500 setelah deploy | Code belum di-deploy ke production | Step 6: commit + push, tunggu Vercel deploy |
| Artikel tidak muncul di homepage | `published_at` null saat insert | Step 4: WAJIB set `published_at` |
| Artikel tidak punya penulis | `author_id` null saat insert | Step 0: query author_id, Step 4: include di payload |
| TOC kosong di artikel | Heading pakai h1 atau tidak ada h2 | Step 0.5: h2/h3 only, min 3 h2 |
| Internal link kurang dari 2 | Tidak ada validasi internal linking | Step 0.5: cek min 2 link ke `/artikel/` |
| Slug duplikat, insert fail | Tidak cek slug uniqueness sebelum insert | Step 0: cek slug uniqueness |
