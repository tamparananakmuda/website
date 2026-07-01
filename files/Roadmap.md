# Roadmap.md - Product Roadmap
# TAMPARAN ANAK MUDA Website

**Versi:** 1.3  
**Status:** Draft - comprehensive product roadmap + donation support + content quality

---

## Vision Statement

> Dalam 2 tahun, tamparananakmuda.com menjadi **destination utama** anak muda Indonesia yang ingin perspektif jujur tentang hidup, karir, dan diri sendiri - bukan sekadar blog, tapi sebuah gerakan tumbuh bersama.

---

## Phase 0 - Foundation (Bulan 1-2)
**Status:** Pre-development

### Goals
- Semua dokumentasi produk selesai (PRD, Design, Architecture, dll)
- Tech stack diputuskan dan di-setup
- Konten pipeline awal siap (10 artikel draft)
- Brand identity website dikonfirmasi

### Deliverables
- [ ] Repo GitHub dibuat
- [ ] Supabase project setup (tables + RLS policies + storage bucket)
- [ ] Next.js boilerplate dengan Tailwind
- [ ] Design system diimplementasi (warna, font, komponen dasar)
- [ ] 10 artikel pertama didraft di Supabase
- [ ] Domain dikonfigurasi ke Vercel
- [ ] Brevo account + list setup
- [ ] Umami analytics setup (lihat `Analytics.md`)

---

## Phase 1 - MVP Launch (Bulan 3-4)
**Status:** Development

### Goals
- Website live dengan konten awal
- Newsletter subscription aktif
- SEO foundation solid
- Mulai distribusi via IG

### Features yang diluncurkan
- ✅ Homepage
- ✅ Blog listing + artikel individual
- ✅ Sistem kategori (5 kategori awal)
- ✅ Newsletter subscription (Brevo)
- ✅ Halaman Tentang / Manifesto
- ✅ SEO on-page + sitemap + OG images
- ✅ Umami analytics
- ✅ Responsive mobile

### Konten target saat launch
- 10 artikel published
- 2 seri konten (masing-masing 3 artikel)
- Semua kategori ada minimal 2 artikel
- Semua artikel lolos angle test dan punya human signature (lihat `ContentStrategy.md` Section 5 & 11)

### Success Metrics (Akhir Phase 1)
- [ ] Website live tanpa bug kritis
- [ ] 100 email subscriber pertama
- [ ] 500 unique visitors bulan pertama
- [ ] Core Web Vitals: LCP < 2.5s, CLS < 0.1
- [ ] 100% artikel lolos angle test

---

## Phase 2 - Growth (Bulan 5-8)
**Status:** Planned

### Goals
- Trafik organik mulai tumbuh dari SEO
- Email list aktif dengan pengiriman rutin
- Konten pipeline konsisten

### Features yang ditambahkan
- 🔍 Search artikel (Algolia)
- 📖 Reading progress bar yang disempurnakan
- 🔖 Bookmark artikel (local storage)
- 👤 Author profile (jika mulai ada kontributor)
- 📊 Dashboard analytics lebih detail
- 🔗 RSS feed aktif
- 📱 PWA dasar (installable, offline-ready)
- 💳 Donasi / Support TAM via Louvin payment gateway (lihat `Payment.md`)
- 🎬 TikTok / short-form video pipeline (lihat `ContentStrategy.md` Section 9)
- ✍️ Editorial workflow dengan fact-check tracking (lihat `Features.md` F21)

### Konten target
- 30+ artikel total
- Newsletter mingguan konsisten (4x/bulan)
- 2-3 seri baru diluncurkan
- TikTok: 2-3 video per minggu saat aktif

### Success Metrics (Akhir Phase 2)
- [ ] 500 email subscriber
- [ ] 2.000 monthly organic visitors
- [ ] 10 artikel dengan traffic > 100 views/bulan dari SEO
- [ ] Newsletter open rate > 35%
- [ ] Halaman donasi live
- [ ] 5+ donasi settled dalam bulan pertama donasi live
- [ ] TikTok: 10+ video published
- [ ] Editorial workflow aktif (fact-check status di semua artikel)

---

## Phase 3 - Community & Monetisasi (Bulan 9-18)
**Status:** Future / TBD

### Goals
- Membangun komunitas pembaca yang aktif
- Eksplor monetisasi pertama yang tidak mengkompromikan trust

### Features yang dipertimbangkan
- 💬 Sistem komentar (Giscus atau custom)
- 👥 User account (opsional, butuh evaluasi)
- 📚 Digital product pertama (ebook, template, atau guide)
- 🎙️ Podcast player terintegrasi (jika TAM ekspansi ke audio)
- ✍️ Submission penulis tamu dengan review process
- 🏆 "TAM Alumni" - showcase anak muda yang berhasil tumbuh

### Monetisasi yang mungkin dieksplorasi
- Newsletter premium (Substack model)
- Sponsorship konten yang sangat selektif dan relevan
- Digital product (bukan kursus dulu)
- Workshop / event (offline maupun online)

### Success Metrics (Akhir Phase 3)
- [ ] 2.000 email subscriber
- [ ] 10.000 monthly visitors
- [ ] Revenue pertama (berapa pun jumlahnya)

---

## Prinsip Roadmap

1. **Konten dulu, fitur belakangan** - jangan build fitur kalau konten belum cukup menarik orang
2. **Jangan over-engineer Phase 1** - static site yang cepat dan rapi lebih baik dari SPA yang kompleks
3. **Email list adalah aset paling berharga** - selalu prioritaskan pertumbuhan subscriber
4. **Monetisasi hanya kalau trust sudah terbangun** - jangan rush ke sini
5. **Iterasi berdasarkan data nyata** - Umami analytics jadi panduan keputusan fitur selanjutnya
6. **Kualitas > kuantitas** - Angle test wajib sebelum publish. Lebih baik 8 artikel berkualitas dari 20 artikel generik.

---

## Timeline Visual

```
2026          Q3            Q4            2027 Q1       Q2
├─────────────┼─────────────┼─────────────┼─────────────┤
│  Phase 0    │  Phase 1    │  Phase 2    │  Phase 3    │
│  Foundation │  MVP Launch │  Growth     │  Community  │
│  (Bln 1-2) │  (Bln 3-4) │  (Bln 5-8) │  (Bln 9+)  │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

---

## Changelog

| Versi | Tanggal | Perubahan |
|---|---|---|
| 1.0 | Jun 2026 | Draft awal. |
| 1.3 | Jul 2026 | Added content quality milestones, TikTok pipeline in Phase 2, editorial workflow, angle test requirement, prinsip #6. |
| 1.2 | Jul 2026 | Phase 2 includes Louvin donation / Support TAM feature and metrics. |
| 1.1 | Jul 2026 | Phase 0 deliverable references `Analytics.md` for Umami setup. |
