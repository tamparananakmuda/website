---
description: Workflow lengkap untuk eksekusi artikel TAM setelah draft selesai, dari QC editorial sampai distribusi multi-platform
---

# Post-Article Execution Workflow

Workflow ini dijalankan setelah draft artikel selesai ditulis. Setiap step harus complete sebelum lanjut ke step berikutnya.

## Step 0: Pre-Flight Database Check

Sebelum insert, verifikasi struktur data sesuai schema database aktual. Ini mencegah error 500 di production.

**WAJIB cek kolom yang ada di tabel `posts`:**
```bash
# Cek kolom yang ada di posts table
curl -s "$SUPA_URL/rest/v1/posts?select=id&limit=1" \
  -H "apikey: $SUPA_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer $SUPA_SERVICE_ROLE_KEY" \
  -H "Prefer: return=representation" | node -e "
const d=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8'));
if(d.message) console.error('DB ERROR:', d.message);
else console.log('DB connection OK');
"
```

**Kolom yang ADA di tabel `posts` (verified):**
- `id`, `title`, `slug`, `excerpt`, `body`, `category_id`, `status`
- `pov_tag`, `human_signature`, `fact_check_status`, `review_status`
- `source_references` (JSONB array, BUKAN string)
- `seo_meta_title`, `seo_meta_description`, `reading_time`
- `og_headline`, `cover_image_url`, `is_premium`, `is_sponsored`
- `sponsor_name`, `sponsor_url`, `sponsor_disclosure`
- `premium_excerpt`, `series_id`, `series_order`
- `published_at`, `created_at`, `updated_at`, `featured`

**Kolom yang TIDAK ADA (jangan pernah reference):**
- `tags` (tidak ada di posts table, hanya di social_posts/whitepapers)
- `author_id` (pakai relasi `author:authors(*)` di select)

**Aturan `source_references` (CRITICAL):**
- HARUS di-insert sebagai JSON array, BUKAN `JSON.stringify()` string
- Format: `[{"type":"link","url":"https://...","label":"..."}]`
- Jika di-insert sebagai string, artikel akan 500 di production
- Verifikasi setelah insert: `typeof data.source_references` harus `"object"` dan `Array.isArray()` harus `true`

**Aturan `excerpt` (CRITICAL):**
- MAX 160 karakter (ada DB constraint `posts_excerpt_check`)
- Jika lebih dari 160, insert akan ditolak dengan error constraint violation

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

**Command:**
```bash
# Cek em dash dan en dash
grep -c '—' /tmp/tam-article-N.json || echo "0 em dashes"
grep -c '–' /tmp/tam-article-N.json || echo "0 en dashes"

# Cek AI vocabulary
python3 -c "
import json
d = json.load(open('/tmp/tam-article-N.json'))
ai_words = ['crucial','pivotal','vibrant','tapestry','delve','showcase','underscore','testament','foster','garner','intricate','landscape']
found = [w for w in ai_words if w in d['body'].lower()]
print(f'AI vocabulary found: {found if found else \"None\"}')
"
```

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
- [ ] `seo_meta_description`: max 160 karakter, mengandung angka/data hook
- [ ] `slug`: kebab-case, mengandung keyword, max 60 karakter
- [ ] `excerpt`: **MAX 160 karakter** (DB constraint, bukan 200)
- [ ] `og_headline`: max 60 karakter untuk OG image (fallback ke title)
- [ ] Internal linking: identifikasi minimal 2 artikel TAM lain untuk di-link di body

**Command:**
```bash
python3 -c "
import json
d = json.load(open('/tmp/tam-article-N.json'))
print(f'SEO title: {len(d[\"seo_meta_title\"])} chars (max 70)')
print(f'SEO desc: {len(d[\"seo_meta_description\"])} chars (max 160)')
print(f'Slug: {len(d[\"slug\"])} chars (max 60)')
excerpt_len = len(d['excerpt'])
print(f'Excerpt: {excerpt_len} chars (max 160)')
if excerpt_len > 160:
    print('WARNING: Excerpt exceeds 160 chars! Will fail DB insert.')
    print('Trim to:', d['excerpt'][:157] + '...')
"
```

## Step 4: Database Insert

Insert artikel ke Supabase database. Gunakan **service role key** (bukan anon key) untuk bypass RLS.

**CRITICAL - Gunakan SUPABASE_SERVICE_ROLE_KEY, bukan NEXT_PUBLIC_SUPABASE_ANON_KEY.**
Anon key akan diblokir oleh RLS policy untuk insert.

**Required fields:**
```json
{
  "title": "...",
  "slug": "...",
  "excerpt": "...",
  "body": "...",
  "category_id": "...",
  "status": "published",
  "pov_tag": "data",
  "human_signature": true,
  "fact_check_status": "verified",
  "review_status": "publish",
  "source_references": [{"type":"link","url":"https://...","label":"..."}],
  "featured": true,
  "seo_meta_title": "...",
  "seo_meta_description": "...",
  "reading_time": 10,
  "og_headline": "..."
}
```

**Insert command (curl dengan service role key):**
```bash
# 1. Prepare payload dari article JSON
node -e "
const fs = require('fs');
const article = JSON.parse(fs.readFileSync('/tmp/tam-article-N.json', 'utf8'));

const payload = {
  title: article.title,
  slug: article.slug,
  excerpt: article.excerpt,  // MAX 160 chars!
  body: article.body,
  category_id: article.category_id,
  status: 'published',
  pov_tag: article.pov_tag || 'data',
  human_signature: article.human_signature || true,
  fact_check_status: 'verified',
  review_status: 'publish',
  source_references: article.source_references.map(r => ({
    type: 'link',
    url: r.url,
    label: r.title  // field di DB: 'label', bukan 'title'
  })),
  featured: true,
  seo_meta_title: article.seo_meta_title,
  seo_meta_description: article.seo_meta_description,
  reading_time: article.reading_time,
  og_headline: article.og_headline || article.title
};

// VALIDASI sebelum write
if (payload.excerpt.length > 160) {
  console.error('FATAL: excerpt > 160 chars (' + payload.excerpt.length + ')');
  process.exit(1);
}
if (typeof payload.source_references === 'string') {
  console.error('FATAL: source_references must be array, not string');
  process.exit(1);
}

fs.writeFileSync('/tmp/tam-article-N-payload.json', JSON.stringify(payload));
console.log('Payload ready. source_references type:', typeof payload.source_references, 'isArray:', Array.isArray(payload.source_references));
"

# 2. Insert via curl
curl -s -X POST "$SUPA_URL/rest/v1/posts" \
  -H "apikey: $SUPA_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer $SUPA_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d @/tmp/tam-article-N-payload.json | node -e "
const d = JSON.parse(require('fs').readFileSync('/dev/stdin','utf8'));
if (d.message) { console.error('INSERT FAILED:', d.message); process.exit(1); }
console.log('Inserted:', d[0].slug);
console.log('source_references type:', typeof d[0].source_references);
console.log('source_references isArray:', Array.isArray(d[0].source_references));
if (!Array.isArray(d[0].source_references)) {
  console.error('WARNING: source_references is not array! Will cause 500 on production.');
}
"
```

**Post-insert verification:**
- [ ] Response tidak ada `message` field (error)
- [ ] `source_references` type = `"object"`, isArray = `true`
- [ ] `excerpt` length <= 160
- [ ] Artikel muncul di homepage
- [ ] Artikel muncul di category page
- [ ] URL `/artikel/[slug]` accessible (cek dengan `curl -s -o /dev/null -w "%{http_code}"`)
- [ ] OG image ter-generate dengan benar

## Step 5: OG Image Generation

Pastikan OG image ter-generate untuk artikel baru.

**Check:**
- [ ] Akses `/api/og/feature?slug=[slug]` menghasilkan image 1600x900 (HTTP 200)
- [ ] Akses `/api/og/card?slug=[slug]` menghasilkan image 800x450 (HTTP 200)
- [ ] Category color ter-aplikasi dengan benar di accent pillar
- [ ] Headline tidak terpotong
- [ ] Brand mark (TAMPARAN ANAK MUDA) terlihat di header
- [ ] `og_headline` dipakai jika ada (fallback ke `title`)

**Command:**
```bash
curl -s -o /dev/null -w "feature: %{http_code}\n" "http://localhost:3000/api/og/feature?slug=SLUG"
curl -s -o /dev/null -w "card: %{http_code}\n" "http://localhost:3000/api/og/card?slug=SLUG"
```

## Step 6: Production Deployment Check

Setelah artikel live di local, pastikan production juga jalan.

**Checklist:**
- [ ] `git add -A && git commit && git push origin main`
- [ ] Tunggu Vercel auto-deploy (cek GitHub deployment status)
- [ ] `curl -s -o /dev/null -w "%{http_code}" "https://tamparananakmuda.com/artikel/SLUG"` = 200
- [ ] Jika 500: cek apakah ada import library yang crash di Vercel serverless (seperti `isomorphic-dompurify`)

**Known Vercel serverless issues:**
- `isomorphic-dompurify` crash di Vercel (jsdom dependency). Sudah diganti dengan regex sanitizer di `components/markdown-content.tsx`. Jangan import library ini lagi.
- `cookies()` dari `next/headers` bisa fail di `generateMetadata` saat static generation. Gunakan `createPublicClient` dari `@/lib/supabase/public` (no cookies) untuk page components.

## Step 7: Content Atomization

Pecah artikel jadi format distribusi multi-platform.

### 7a. Instagram Carousel (5-8 slides)
- Slide 1: Hook headline + visual
- Slide 2-6: Key data points (1 per slide, max 3 angka per slide)
- Slide 7: Pertanyaan refleksi
- Slide 8: CTA ke full article

**Format:** 1080x1080px, brand colors, Syne font untuk headline

### 7b. Newsletter Section (400-600 words)
- 1 insight utama dari artikel
- 1 quote yang striking
- 1 pertanyaan untuk subscriber
- Link ke full article

**Kirim via:** Brevo (Sendinblue)

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

## Error Prevention Reference

Bug yang pernah terjadi dan cara mencegah:

| Bug | Penyebab | Pencegahan |
|-----|----------|------------|
| 500 di production (semua artikel) | `post.tags` di-reference di page.tsx tapi kolom tidak ada | Step 0: cek kolom yang ada |
| 500 di production (semua artikel) | `isomorphic-dompurify` crash di Vercel serverless | Sudah diganti regex sanitizer, jangan import lagi |
| `citations.map is not a function` | `source_references` di-insert sebagai string, bukan array | Step 4: verifikasi isArray setelah insert |
| DB insert ditolak | `excerpt` > 160 karakter (constraint violation) | Step 3: cek excerpt length sebelum insert |
| DB insert ditolak (RLS) | Pakai anon key untuk insert | Step 4: selalu pakai service role key |
| 500 setelah deploy | Code belum di-deploy ke production | Step 6: commit + push, tunggu Vercel deploy |
