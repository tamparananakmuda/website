---
description: Workflow lengkap untuk eksekusi artikel TAM setelah draft selesai, dari QC editorial sampai distribusi multi-platform
---

# Post-Article Execution Workflow

Workflow ini dijalankan setelah draft artikel selesai ditulis. Setiap step harus complete sebelum lanjut ke step berikutnya.

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
- [ ] `excerpt`: 100-200 karakter, hook yang membuat orang mau baca
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
print(f'Excerpt: {len(d[\"excerpt\"])} chars (max 200)')
"
```

## Step 4: Database Insert

Insert artikel ke Supabase database via API atau SQL.

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
  "source_references": [...],
  "featured": true,
  "seo_meta_title": "...",
  "seo_meta_description": "...",
  "reading_time": 10
}
```

**Post-insert verification:**
- [ ] Artikel muncul di homepage
- [ ] Artikel muncul di category page
- [ ] URL `/artikel/[slug]` accessible
- [ ] OG image ter-generate dengan benar

## Step 5: OG Image Generation

Pastikan OG image ter-generate untuk artikel baru.

**Check:**
- [ ] Akses `/api/og?slug=[slug]&type=og` menghasilkan image 1200x630
- [ ] Akses `/api/og?slug=[slug]&type=feature` menghasilkan image 1600x900
- [ ] Category color ter-aplikasi dengan benar di accent pillar
- [ ] Headline tidak terpotong
- [ ] Brand mark (TAMPARAN ANAK MUDA) terlihat di header

## Step 6: Content Atomization

Pecah artikel jadi format distribusi multi-platform.

### 6a. Instagram Carousel (5-8 slides)
- Slide 1: Hook headline + visual
- Slide 2-6: Key data points (1 per slide, max 3 angka per slide)
- Slide 7: Pertanyaan refleksi
- Slide 8: CTA ke full article

**Format:** 1080x1080px, brand colors, Syne font untuk headline

### 6b. Newsletter Section (400-600 words)
- 1 insight utama dari artikel
- 1 quote yang striking
- 1 pertanyaan untuk subscriber
- Link ke full article

**Kirim via:** Brevo (Sendinblue)

### 6c. IG Stories (3-5 stories)
- Story 1: Polling question terkait topik
- Story 2-3: Key takeaways dengan visual
- Story 4: Q&A sticker
- Story 5: Link sticker ke artikel

### 6d. TikTok/Reels Script (Phase 2)
- Generate via `/api/tiktok/generate-script`
- 30-60 detik, 1 insight per video
- Hook line wajib di 3 detik pertama
- CTA: "Baca full artikel di bio"

## Step 7: Distribution Schedule

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

## Step 8: Analytics Tracking

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

## Step 9: Post-Publish Maintenance

**Monthly:**
- Cek apakah data di artikel masih relevan
- Update jika ada survei baru yang relevan
- Cek internal links masih aktif
- Refresh SEO jika ranking turun

**Quarterly:**
- Review artikel di cluster topik yang sama
- Identifikasi artikel untuk update vs archive
- Plan seri konten baru berdasarkan performa
