# UserFlow.md - User Journey & Flow
# TAMPARAN ANAK MUDA Website

**Versi:** 1.3  
**Status:** Draft - comprehensive user flow & analytics mapping + donation flow + editorial workflow + TikTok pipeline

---

## 1. User Personas

### Persona A: "Raka" - Mahasiswa yang Mencari Arah
- 20 tahun, mahasiswa semester 5
- Sering scroll IG, nemu konten TAM dari repost temannya
- Belum tahu mau kerja apa setelah lulus
- **Goal:** Artikel yang bikin dia mikir ulang soal karir dan tujuan

### Persona B: "Nindi" - Fresh Graduate yang Burnout
- 24 tahun, kerja 1 tahun pertama, mulai ngerasa stuck
- Aktif di Twitter/X dan IG
- Cari konten yang validate experience-nya tapi juga kasih perspektif baru
- **Goal:** Konten yang bilang "kamu tidak sendirian" sekaligus "ini cara pikir lain"

### Persona C: "Dio" - Repeat Reader
- 22 tahun, sudah follow IG TAM, sekarang aktif baca web
- Mau selalu update konten terbaru
- **Goal:** Subscribe newsletter, ikuti seri tertentu

---

## 2. Primary User Flows

### Flow 1: Discovery dari Instagram → Baca Artikel

```
[IG Story/Post TAM]
      │
      ▼
[Klik link di bio / swipe up]
      │
      ▼
[Homepage TAM]                         → Event: pageview (utm_source=instagram)
   ├── Baca headline & excerpt artikel featured
   ├── Klik featured article            → Event: homepage_featured_article_click
   ├── Scroll lihat kategori
   ├── Klik seri                        → Event: homepage_series_click
      │
      ▼
[Klik artikel]
      │
      ▼
[Halaman Artikel]                      → Event: pageview
   ├── Baca artikel (avg 3-5 menit)
   ├── Scroll 50%                       → Event: article_read_half
   ├── Lihat "Baca Juga" di tengah artikel
   ├── Klik "Baca Juga"                → Event: article_related_click
   ├── Scroll 90%                       → Event: article_read_complete
   ├── Scroll ke bawah → Newsletter CTA
      │
      ├── [Klik Subscribe CTA]         → Event: newsletter_cta_click
      │   ├── Submit sukses            → Event: newsletter_subscribed
      │   └── Submit gagal             → Event: newsletter_subscribe_fail
      │
      └── [Klik Baca Juga] ──→ [Artikel lain] → Loop
```

### Flow 2: Google Search → Artikel → Brand Discovery

```
[Google: "cara keluar dari comfort zone anak muda"]
      │
      ▼
[Hasil pencarian → Artikel TAM]
      │
      ▼
[Halaman Artikel - first impression]   → Event: pageview (utm_source=google)
   ├── Baca artikel                     → Event: article_read_half / article_read_complete
   ├── Lihat brand TAM di header
   ├── Klik "Tentang" - penasaran siapa TAM
      │
      ▼
[Halaman Tentang / Manifesto]          → Event: pageview
   ├── Baca manifesto TAM
   ├── Klik link IG                      → Event: social_click (platform=instagram)
   ├── Klik link TikTok                  → Event: social_click (platform=tiktok)
      │
      └── [Follow IG] ✓ atau [Subscribe Newsletter] ✓ → Event: newsletter_subscribed
```

### Flow 3: Pembaca Setia → Subscribe Newsletter

```
[Sudah baca 2-3 artikel]
      │
      ▼
[Lihat Newsletter CTA - inline artikel atau footer]
      │
      ▼
[Klik CTA]                              → Event: newsletter_cta_click
      │
      ▼
[Isi email di form]
      │
      ▼
[Submit → API simpan ke DB + kirim welcome email via Resend]
      │
      ├── Sukses                         → Event: newsletter_subscribed
      │
      └── Gagal                          → Event: newsletter_subscribe_fail
      │
      ▼
[Halaman terima kasih / konfirmasi]
   "Cek email kamu untuk konfirmasi"
      │
      ▼
[Email konfirmasi masuk - double opt-in]
      │
      ▼
[Klik konfirmasi di email]
      │
      ▼
[Masuk list subscriber] ✓
[Redirect ke halaman "Selamat Datang"]
```

### Flow 3b: Newsletter Welcome Journey

Setelah double opt-in:

1. **Halaman Selamat Datang** `/newsletter/welcome`
   - Konfirmasi sukses subscribe
   - CTA: "Baca artikel populer" atau "Follow IG"
   - Event: `newsletter_welcome_view`

2. **Welcome Email (Resend)**
   - Subject: "Selamat datang. Ini yang bisa kamu expect."
   - Isi: tone TAM, link 3 artikel terbaik, link IG
   - Track: open rate, click rate

3. **First Newsletter (1 minggu kemudian)**
   - Jangan kirim langsung setelah subscribe - beri jarak 3-7 hari
   - Track: open rate, click rate, unsubscribe rate

### Flow 4: Eksplorasi Seri Konten

```
[Homepage atau Artikel]
      │
      ▼
[Klik badge kategori]                   → Event: article_category_click
      │
      ▼
[Halaman Kategori]                       → Event: pageview
   ├── Daftar artikel dalam kategori
   ├── Klik artikel                       → Event: category_article_click
      │
      ▼
[Klik navigasi seri]
      │
      ▼
[Halaman Seri: "Seri: Kerja & Tujuan"]   → Event: pageview
   ├── Deskripsi seri
   ├── Daftar artikel dalam urutan
   ├── Klik artikel                       → Event: homepage_series_click
   ├── Prev / Next navigation             → Event: series_prev_click / series_next_click
      │
      ▼
[Baca artikel satu per satu dalam seri]
      │
      └── Progress indicator: "Bagian 2 dari 5"
```

### Flow 5: Search Internal (Phase 2)

```
[User klik icon search di header]
      │
      ▼
[Modal search muncul]
      │
      ▼
[User ketik query]                       → Event: search_query
      │
      ▼
[Hasil muncul]                           → Event: search_result_click (query, slug, position)
      │
      ├── Klik hasil
      │
      └── Tidak ada hasil                 → Event: search_no_result
```

### Flow 6: Social Share (Phase 1)

```
[Di halaman artikel]
      │
      ▼
[User klik tombol share]
      │
      ├── WhatsApp                         → Event: article_share (platform=whatsapp)
      ├── Telegram                         → Event: article_share (platform=telegram)
      ├── Twitter/X                        → Event: article_share (platform=twitter)
      ├── Copy link                        → Event: article_share (platform=copy)
      │
      └── (URL dibuat dengan UTM builder)
```

### Flow 7: Donasi / Dukung TAM (Phase 2)

```
[User baca artikel / tentang / footer]
      │
      ▼
[Klik CTA "Dukung TAM"]                  → Event: donation_cta_click
      │
      ▼
[Halaman /dukung]                        → Event: donation_page_view
      │
      ▼
[Pilih nominal]
      │
      ├── 25.000                           → Event: donation_amount_selected (amount=25000)
      ├── 50.000                           → Event: donation_amount_selected (amount=50000)
      ├── 100.000                          → Event: donation_amount_selected (amount=100000)
      └── Custom                           → Event: donation_amount_selected (amount=custom)
      │
      ▼
[Pilih metode: qris / gopay / shopeepay / bni_va / bri_va / permata_va / cimb_niaga_va]
      │
      ▼
[Isi nama & email (opsional)]
      │
      ▼
[Klik "Lanjutkan Pembayaran"]            → Event: donation_checkout_initiated
      │
      ▼
[POST /api/donation/create]
      │
      ├── Sukses                           → Event: donation_checkout_success
      │   ├── QRIS: tampil QR code
      │   ├── VA: tampil nomor VA
      │   └── E-Wallet: redirect deeplink
      │
      └── Gagal                            → Event: donation_checkout_fail
      │
      ▼
[User bayar]
      │
      ▼
[Webhook Louvin → /api/donation/webhook]
      │
      ├── Settled                          → Event: donation_success
      │   ├── Update tabel donations
      │   ├── Kirim email terima kasih (Resend)
      │   └── Redirect /dukung/terima-kasih
      │
      └── Failed                           → Event: donation_failed
```

### Flow 8: Admin Editorial Workflow (Phase 1 admin, Phase 2 full)

```
[Admin login di /admin]
      │
      ▼
[Admin panel: list artikel dengan status badge]
      │
      ├── Status: draft (abu)
      ├── Status: review (kuning)
      ├── Status: fact-check (oranye)
      └── Status: published (hijau)
      │
      ▼
[Admin klik artikel draft]
      │
      ▼
[Editor artikel: pilih POV tag]              → Event: content_pov_tag (povType)
      │
      ├── Kontra-narasi
      ├── Refleksi
      ├── Data
      └── Framework
      │
      ▼
[Klik "Kirim ke Review"]
      │
      ▼
[Angle test modal muncul]
      │
      ├── Lolos                            → Event: editorial_angle_test_pass
      │   └── Status berubah: draft -> review
      │
      └── Gagal                            → Event: editorial_angle_test_fail (reason)
          └── Modal jelaskan kenapa gagal, admin revisi
      │
      ▼
[Editor review: baca dan edit artikel]
      │
      ▼
[Klik "Kirim ke Fact-Check"]
      │
      ▼
[Status berubah: review -> fact-check]
      │
      ▼
[Fact-checker: review klaim faktual]
      │
      ├── Tambah source references          → POST /api/posts/[id]/source-references
      │   ├── Link (url + label)
      │   ├── Footnote
      │   └── Inline reference
      │   │
      │   ▼
      │   [Update fact-check status]        → PUT /api/posts/[id]/fact-check
      │   ├── Verified                       → fact_check_status = verified
      │   └── Flagged                        → fact_check_status = flagged (kembali ke editor)
      │
      ▼
[Human signature checkbox]
      │
      ├── Diceklis                          → Event: editorial_human_signature_verified
      └── Tidak diceklis                     → Publish button disabled
      │
      ▼
[Klik "Publish"]
      │
      ▼
[Status berubah: fact-check -> published]
      │
      ▼
[Artikel live di website] ✓
```

### Flow 9: Admin TikTok Script Generation (Phase 2)

```
[Admin login di /admin/tiktok]
      │
      ▼
[Daftar video scripts dengan status: draft / approved / published]
      │
      ▼
[Admin pilih artikel published untuk di-generate script]
      │
      ▼
[POST /api/tiktok/generate-script]
      │
      ▼
[Script draft muncul]
      ├── Hook line (dari hook_lines library atau custom)
      ├── Body script (30-60 detik, 1 insight)
      └── Export format untuk recording
      │
      ▼
[Admin edit/customize script]
      │
      ▼
[Klik "Approve"]
      │
      ▼
[Status: approved]
      │
      ▼
[Admin rekam video, upload ke TikTok]
      │
      ▼
[Input video URL, klik "Published"]         → Event: tiktok_video_published
      │
      ▼
[Video live, track views]                  → Event: tiktok_video_views
```

---

## 3. Page-by-Page Flow Detail

### Homepage `/`

```
┌─────────────────────────────────────┐
│  NAV: Logo | Artikel | Seri | Tentang│
├─────────────────────────────────────┤
│  HERO                               │
│  // PERSPEKTIF UNTUK ANAK MUDA      │
│  Headline brand statement (besar)   │
│  [Mulai Baca] CTA                   │
├─────────────────────────────────────┤
│  ARTIKEL TERBARU (3 cards)          │
│  [Lihat Semua Artikel →]            │
├─────────────────────────────────────┤
│  SERI PILIHAN (horizontal scroll)   │
├─────────────────────────────────────┤
│  NEWSLETTER CTA BLOCK               │
├─────────────────────────────────────┤
│  FOOTER                             │
└─────────────────────────────────────┘

User actions:
- Klik CTA hero → /artikel
- Klik card artikel → /artikel/[slug]
- Klik "Lihat Semua" → /artikel
- Subscribe newsletter → POST /api/subscribe
- Klik seri → /seri/[slug]
```

### Halaman Artikel `/artikel/[slug]`

```
┌─────────────────────────────────────┐
│  NAV                                │
├─────────────────────────────────────┤
│  BREADCRUMB: Home > Mindset         │
│  KATEGORI BADGE: // MINDSET         │
│  JUDUL ARTIKEL                      │
│  Meta: X menit baca · Tanggal       │
├─────────────────────────────────────┤
│  COVER IMAGE                        │
├─────────────────────────────────────┤
│  BODY ARTIKEL                       │
│  ...                                │
│  [INLINE NEWSLETTER CTA]            │  ← setelah 3 paragraf
│  ...                                │
│  [QUOTE CALLOUT]                    │
│  ...                                │
├─────────────────────────────────────┤
│  ARTIKEL TERKAIT (2 cards)          │
├─────────────────────────────────────┤
│  NEWSLETTER CTA (bottom)            │
├─────────────────────────────────────┤
│  FOOTER                             │
└─────────────────────────────────────┘
```

---

## 4. Error States & Edge Cases

| Situasi | Tampilan | Analytics Event |
|---|---|---|
| Artikel tidak ditemukan | 404 page dengan pesan khas TAM + link ke /artikel | pageview + 404 status |
| Email sudah terdaftar (subscribe) | Pesan: "Email ini sudah terdaftar. Selamat datang kembali!" | newsletter_subscribe_fail (error=already_subscribed) |
| Email invalid format | Inline validation sebelum submit | - |
| Gagal subscribe (server error) | Pesan: "Gagal mendaftar. Coba lagi atau hubungi kami." | newsletter_subscribe_fail (error=server_error) |
| Halaman kosong (0 artikel) | Empty state dengan CTA "Ikuti IG kami dulu" | - |
| Search tidak ada hasil | Pesan: "Tidak ada hasil untuk [query]." | search_no_result |
| Gagal load artikel | Error state dengan button retry | - |
| Umami script gagal load | Fallback: tidak break UX, log ke Sentry | - |

### Error Handling Principles

- **Jangan blame user.** Pesan error jelaskan apa yang terjadi dan apa yang bisa dilakukan.
- **Preserve context.** Jika subscribe gagal, jangan hapus email yang sudah diisi.
- **Retry mechanism.** Berikan tombol retry untuk error network/server.
- **Log to Sentry.** Semua unexpected error dikirim ke Sentry dengan context.

---

## 5. Mobile Flow Considerations

- Nav collapse ke hamburger di mobile
- Article cards stack vertikal
- Newsletter form full-width
- Seri konten: horizontal scroll dengan snap → vertikal list
- Reading progress bar di artikel (mobile + desktop)
- Sticky "Subscribe" mini-button muncul setelah scroll 50% artikel
  - Mini-button muncul dengan animasi subtle
  - Klik mini-button → scroll ke newsletter CTA atau buka modal subscribe
  - Event: `newsletter_cta_click` dengan `location: sticky`

### Donation Flow Mobile Considerations
- QR code display: ukuran optimal untuk mobile screen (min 200x200px)
- QR code bisa di-screenshot untuk scan dengan phone lain
- VA number: tombol copy dengan visual feedback (checkmark animation)
- VA number: auto-format dengan spasi untuk readability
- Countdown timer untuk QRIS/VA expired: visible, tidak terpotong
- E-wallet deeplink: fallback ke browser jika app tidak terinstall
- Nominal selection: touch target min 44x44px
- Payment method selector: scrollable list, bukan dropdown

---

## 6. Accessibility Flow

### Keyboard Navigation

- Tab order: logo → nav → hero CTA → content → footer
- Skip to content link di atas nav
- Search modal: trap focus, escape to close
- Newsletter form: submit dengan Enter

### Screen Reader Flow

- Heading hierarchy: h1 hero, h2 section titles, h2/h3 cards
- Article page: h1 judul, landmark `main`, `article`
- Live region untuk newsletter success/error message
- Decorative images: `alt=""` atau `aria-hidden`

### Reduced Motion

- Entrance animations disabled jika user prefers reduced motion
- Sticky subscribe button tetap muncul tapi tanpa animasi

### Donation Flow Accessibility

- QR code: alt text deskriptif ("QR code untuk pembayaran Rp 50.000 via QRIS")
- VA number: `aria-label` lengkap dengan nomor dan nama bank
- Copy button: `aria-label` dan `aria-live` untuk feedback sukses copy
- Countdown timer: `aria-live="polite"` untuk screen reader
- Nominal buttons: `role="radio"` dalam `role="radiogroup"`
- Payment method selector: keyboard navigable, focus indicator jelas
- Error state: `role="alert"` untuk pesan error payment

---

## 7. Changelog

| Versi | Tanggal | Perubahan |
|---|---|---|
| 1.0 | Jun 2026 | Draft awal. |
| 1.2 | Jul 2026 | Added donation flow (Flow 7) with Louvin payment events. |
| 1.3 | Jul 2026 | Added Flow 8 admin editorial workflow, Flow 9 TikTok script generation, donation mobile considerations, donation accessibility flow. |
| 1.1 | Jul 2026 | Analytics event mapping di setiap flow, newsletter welcome journey, search flow, social share flow, error handling principles, accessibility flow, mobile sticky button. |

