# Features.md - Feature Specification
# TAMPARAN ANAK MUDA Website

**Versi:** 1.4  
**Status:** Draft - comprehensive feature specification + donation support + editorial workflow + TikTok pipeline + acceptance criteria

---

## Feature Priority Framework

```
P0 - Must Have (MVP blocker)
P1 - Should Have (launch ideal)
P2 - Nice to Have (Phase 2)
P3 - Future (Phase 3+)
```

---

## Phase 1 - MVP Features

### F01 - Homepage `P0`

**Deskripsi:** Halaman utama brand TAM

**Komponen:**
- Hero section dengan brand statement / tagline
- Featured artikel (3 terbaru atau 1 featured + 2 terbaru)
- Seri pilihan (horizontal scroll)
- Newsletter CTA block
- Footer dengan link sosial

**Acceptance Criteria:**
- [ ] Hero text tidak lebih dari 2 baris di desktop
- [ ] Artikel featured ditentukan dari database (bisa di-pin via `featured` flag)
- [ ] Newsletter form berfungsi dan terhubung ke Resend
- [ ] Load time < 2 detik (LCP)
- [ ] Fully responsive mobile/tablet/desktop

---

### F02 - Blog Engine (Artikel) `P0`

**Deskripsi:** Sistem publish dan display artikel long-form

**Halaman yang dibutuhkan:**
- `/artikel` - listing semua artikel (paginated)
- `/artikel/[slug]` - halaman artikel individual

**Fitur artikel:**
- Rich text content (Markdown, di-parse via marked + rehype-sanitize)
- Cover image dengan alt text
- Reading time estimate (otomatis berdasarkan word count)
- Kategori badge
- Tanggal publish
- Artikel terkait (berdasarkan kategori yang sama, 2 artikel)
- Progress bar baca (scroll indicator)
- Inline newsletter CTA (muncul setelah 3 paragraf)
- OG image dinamis per artikel (card 800x450 + feature 1600x900 WebP, via @vercel/og + sharp, upload ke R2 CDN)

**Acceptance Criteria:**
- [ ] Artikel tampil dengan tipografi yang readable (min 18px body, line-height 1.7)
- [ ] Cover image dioptimasi (Next.js Image component)
- [ ] Slug URL unik dan SEO-friendly
- [ ] OG image ter-generate otomatis dari og_headline + kategori (2 sizes: card + feature WebP, upload ke R2 CDN)
- [ ] Artikel terkait tidak menampilkan artikel yang sedang dibaca
- [ ] Editorial checklist sebelum publish (angle test, human signature, fact-check)
- [ ] POV tag di artikel (kontra-narasi / refleksi / data / framework)
- [ ] Human signature checkbox wajib diceklis sebelum publish

---

### F03 - Sistem Kategori `P0`

**Deskripsi:** Pengelompokan konten berdasarkan topik

**Kategori awal TAM:**
- Mindset
- Karier
- Kehidupan
- Uang
- Bisnis
- Teknologi

**Halaman:**
- `/topik/[category]` - listing artikel per kategori

**Acceptance Criteria:**
- [ ] Setiap artikel wajib punya satu kategori
- [ ] Badge kategori clickable, mengarah ke halaman topik
- [ ] Halaman topik menampilkan deskripsi kategori + semua artikel

---

### F04 - Seri Konten `P1`

**Deskripsi:** Kumpulan artikel yang berurutan dan berkaitan

**Contoh seri:**
- "Seri: Dari 0 Sampai Kerja" (5 artikel soal karir)
- "Seri: Uang di Usia 20an" (4 artikel soal keuangan muda)

**Halaman:**
- `/seri` - listing semua seri
- `/seri/[slug]` - halaman seri dengan daftar artikel

**Fitur:**
- Progress indicator di dalam artikel: "Bagian 2 dari 5"
- Navigasi prev/next di dalam seri
- CTA untuk baca dari awal jika masuk di tengah seri

**Acceptance Criteria:**
- [ ] Urutan artikel dalam seri bisa diatur dari admin panel (`series_order`)
- [ ] Artikel yang bagian dari seri menampilkan "Bagian dari Seri: ..."
- [ ] Navigasi prev/next berfungsi

---

### F05 - Newsletter Subscription `P0`

**Deskripsi:** Form subscribe email, terintegrasi Resend

**Lokasi form:**
- Homepage (dedicated block)
- Inline di dalam artikel (setelah paragraf ke-3)
- Bottom setiap artikel
- Footer (mini form)

**Flow:**
1. User isi email
2. Validasi format email (client-side)
3. POST ke `/api/subscribe`
4. Server simpan ke database + kirim welcome email via Resend
5. User langsung aktif sebagai subscriber
6. Redirect ke `/newsletter` (thank you page)

**Acceptance Criteria:**
- [ ] Validasi email sebelum submit
- [ ] Loading state saat submit
- [ ] Success state dengan pesan konfirmasi
- [ ] Error state dengan pesan yang actionable
- [ ] Duplicate email tidak menyebabkan error yang confusing
- [ ] API key Resend tidak pernah exposed ke client
- [ ] Welcome email terkirim otomatis

---

### F06 - Halaman Tentang / Manifesto `P1`

**Deskripsi:** Halaman yang menjelaskan TAM bukan dengan cara "about us" biasa, tapi sebagai manifesto

**Konten:**
- Manifesto TAM (bukan "kami adalah..." tapi "kenapa TAM ada")
- Nilai-nilai yang dipegang
- Link ke IG, konten awal
- CTA subscribe newsletter

**Acceptance Criteria:**
- [ ] Tone konsisten dengan brand TAM
- [ ] Tidak ada foto tim (belum perlu di Phase 1)
- [ ] Fully copywritable dari admin panel (table `site_settings`)

---

### F07 - SEO Foundation `P0`

**Deskripsi:** Setup SEO dasar untuk semua halaman

**Implementasi:**
- `<title>` dan `<meta description>` per halaman
- Open Graph tags (og:title, og:description, og:image)
- Twitter Card tags
- Canonical URL
- `sitemap.xml` auto-generated
- `robots.txt`
- `rss.xml` feed untuk artikel
- Structured data (Article schema) untuk artikel
- Next.js Metadata API

**Acceptance Criteria:**
- [ ] Setiap halaman punya unique title + description
- [ ] OG image muncul saat share di WhatsApp/IG/Twitter
- [ ] sitemap.xml valid dan include semua halaman publik
- [ ] Tidak ada duplicate meta tags

---

### F08 - Analytics `P1`

**Deskripsi:** Tracking pengunjung dan behavior tanpa melanggar privasi

**Tool:** Umami Analytics (self-hosted, privacy-first)

**Events yang di-track (Phase 1):**
- Pageview (otomatis)
- `newsletter_cta_click` - klik tombol subscribe
- `newsletter_subscribed` - berhasil subscribe
- `newsletter_subscribe_fail` - gagal subscribe
- `article_read_half` - sudah baca 50% artikel
- `article_read_complete` - selesai baca artikel
- `article_share` - artikel dibagikan
- `social_click` - klik link IG/sosial
- `homepage_featured_article_click` - klik artikel di homepage
- `homepage_series_click` - klik seri di homepage
- `article_related_click` - klik artikel terkait
- `article_category_click` - klik badge kategori
- `category_article_click` - klik artikel dari halaman kategori
- `series_prev_click` / `series_next_click` - navigasi seri
- `editorial_angle_test_pass` - artikel lolos angle test
- `editorial_angle_test_fail` - artikel gagal angle test
- `editorial_human_signature_verified` - human signature diceklis
- `content_pov_tag` - POV tag dipilih (properties: `pov_type`)

**Acceptance Criteria:**
- [ ] Script Umami load async dengan `lazyOnload`, tidak block render
- [ ] Tidak ada cookie banner yang diperlukan (Umami cookieless)
- [ ] Custom events berfungsi dan nama event sesuai dengan `Analytics.md`
- [ ] Dashboard Umami accessible
- [ ] Scroll depth tracking menggunakan IntersectionObserver, bukan scroll listener
- [ ] `useAnalytics` hook memiliki TypeScript declaration untuk `window.umami`

---

## Phase 2 Features (Roadmap)

### F09 - Search Artikel `P2`
- Integrasi Algolia free tier
- Search by judul, konten, kategori

**Acceptance Criteria:**
- [ ] Search results muncul real-time (debounced 300ms)
- [ ] Highlight query di hasil search
- [ ] No result state dengan saran konten terkait
- [ ] Analytics: `search_query`, `search_result_click`, `search_no_result`

### F10 - Author Profile `P2`
- Jika TAM mulai terima kontribusi penulis tamu
- Halaman author dengan list artikelnya

**Acceptance Criteria:**
- [ ] Halaman `/author/[slug]` menampilkan bio, avatar, social links
- [ ] List artikel author dengan pagination
- [ ] Analytics: `author_page_view`, `author_article_click`

### F11 - Reading List / Bookmark `P2`
- User bisa save artikel (local storage, no login)

**Acceptance Criteria:**
- [ ] Tombol bookmark di halaman artikel
- [ ] Halaman `/reading-list` menampilkan artikel tersimpan
- [ ] Data persist di local storage (cross-session)
- [ ] Analytics: `bookmark_add`, `bookmark_remove`, `reading_list_view`

### F12 - Komentar `P3`
- Custom comments table (lihat `Architecture.md`)
- Pending approval workflow untuk moderasi
- Low priority karena butuh moderasi aktif

**Acceptance Criteria:**
- [ ] Form komentar dengan nama, email, body
- [ ] Komentar masuk status `pending` untuk moderasi admin
- [ ] Threaded replies (parent_id)
- [ ] Admin bisa approve/reject komentar
- [ ] Analytics: `comment_view`, `comment_submit`, `comment_upvote`

### F13 - Performance Monitoring `P0`
- Sentry error tracking
- Web Vitals tracking via `web-vitals` library
- Umami custom events untuk LCP/CLS/INP

**Acceptance Criteria:**
- [ ] Sentry DSN dikonfigurasi di production
- [ ] Error events terkirim ke Sentry dashboard
- [ ] Web Vitals (LCP, CLS, INP) terkirim ke Umami
- [ ] Source maps upload ke Sentry saat build

### F14 - Uptime Monitoring `P1`
- Uptime Kuma self-hosted
- Monitor homepage, `/api/subscribe`, Umami instance

**Acceptance Criteria:**
- [ ] Uptime Kuma monitor homepage (60s interval)
- [ ] Monitor `/api/subscribe` endpoint (5min interval)
- [ ] Monitor Umami instance
- [ ] Alert via email + Telegram/Discord webhook
- [ ] Status page accessible

### F19 - Donasi / Support TAM `P2`
- Integrasi Louvin payment gateway (lihat `Payment.md`)
- Halaman `/dukung` dengan pilihan nominal dan metode pembayaran
- CTA di artikel, halaman tentang, dan footer
- Backend proxy: `/api/donation/create` dan `/api/donation/webhook`
- Tabel `donations` untuk tracking transaksi
- Support QRIS, GoPay, ShopeePay, BNI/BRI/Permata/CIMB VA
- Halaman terima kasih `/dukung/terima-kasih`
- Email terima kasih via Resend (opsional)

**Acceptance Criteria:**
- [ ] API key Louvin server-only, tidak terexposure di client
- [ ] Validasi input: amount > 0, payment_type valid
- [ ] Webhook update status transaksi di tabel `donations`
- [ ] Rate limiting 5 create-transaction per IP per jam
- [ ] Webhook endpoint return HTTP 200 selalu
- [ ] Tampilkan fee transparan ke user
- [ ] QRIS/VA expired handling dengan countdown
- [ ] Analytics events: `donation_cta_click`, `donation_checkout_initiated`, `donation_success`, `donation_failed`

---

### F20 - TikTok / Short-Form Video Pipeline `P2`

**Deskripsi:** Pipeline konversi artikel ke short-form video script untuk TikTok dan IG Reels

**Fitur:**
- Script template dari artikel (1 insight = 1 video, lihat `ContentStrategy.md` Section 9)
- Hook line library dengan formula yang sudah teruji
- Posting schedule integration di admin panel
- Analytics: video views, completion rate, profile clicks (tracked via Umami custom events, bukan TikTok API)

**Database:** Tabel `tiktok_scripts` dan `hook_lines` (lihat `Architecture.md` Section 4)

**API Endpoints:**
- `POST /api/tiktok/generate-script` - Generate script draft dari artikel
- `GET /api/tiktok/scripts` - List semua video scripts
- `PUT /api/tiktok/scripts/[id]` - Update script (status, hook line, body, video_url)

**Acceptance Criteria:**
- [ ] Admin bisa generate script draft dari artikel yang sudah publish
- [ ] Hook line library bisa di-customize
- [ ] Script export ke format yang bisa dipakai untuk recording
- [ ] Analytics events: `tiktok_video_published`, `tiktok_video_views`, `tiktok_profile_click`

---

### F21 - Editorial Workflow `P2`

**Deskripsi:** Workflow editorial di admin panel untuk memastikan kualitas konten sebelum publish

**Fitur:**
- Fact-check status tracking (pending / verified / flagged)
- Review pipeline: draft -> review -> fact-check -> publish
- Source reference manager (link, footnote, inline reference)
- Angle test checklist built into admin panel (lihat `ContentStrategy.md` Section 5)
- Human signature verification (lihat `ContentStrategy.md` Section 11)
- POV tag selector (kontra-narasi / refleksi / data / framework)

**API Endpoints:**
- `PUT /api/posts/[id]/fact-check` - Update fact-check status
- `PUT /api/posts/[id]/review-status` - Update review pipeline status
- `POST /api/posts/[id]/source-references` - Tambah source reference
- `DELETE /api/posts/[id]/source-references/[refId]` - Hapus source reference

**Database:** Kolom editorial di tabel `posts` (lihat `Architecture.md` Section 4): `pov_tag`, `human_signature`, `fact_check_status`, `review_status`, `source_references`

**Acceptance Criteria:**
- [ ] Artikel tidak bisa publish tanpa minimal 1 POV tag
- [ ] Human signature checkbox wajib diceklis sebelum publish
- [ ] Fact-check status required sebelum publish (minimal pending)
- [ ] Angle test checklist muncul sebagai modal sebelum publish button
- [ ] Source reference bisa ditambahkan per artikel
- [ ] Review pipeline status terlihat di admin dashboard

---

## Phase 3 Features (Future)

### F15 - Akun User & Komunitas `P3`
### F16 - Kursus / Digital Product `P3`
### F17 - Submission Penulis Tamu `P3`
### F18 - Podcast Player Terintegrasi `P3`

---

## Changelog

| Versi | Tanggal | Perubahan |
|---|---|---|
| 1.0 | Jun 2026 | Draft awal. |
| 1.3 | Jul 2026 | Added editorial checklist in F02, content quality analytics events, F20 TikTok pipeline, F21 editorial workflow. |
| 1.4 | Jul 2026 | Added acceptance criteria for F09-F14, F20 database/API specs, F21 API endpoint specs, clarified F20 analytics tracking via Umami. |
| 1.5 | Jul 2026 | Updated category names (Karier, Kehidupan, Uang, Bisnis, Teknologi), OG image sizes (card + feature WebP via R2 CDN). |
| 1.2 | Jul 2026 | Added F19 Donasi / Support TAM via Louvin payment gateway. |
| 1.1 | Jul 2026 | Analytics F08 event names aligned with `Analytics.md`, added F13 Performance Monitoring, F14 Uptime Monitoring, komentar moved to P3. |
