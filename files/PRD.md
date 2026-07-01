# PRD - Product Requirements Document
# TAMPARAN ANAK MUDA Website

**Versi:** 1.4  
**Tanggal:** Juli 2026  
**Owner:** Yovie Setiawan (SETIAWAN GROUP)  
**Status:** Draft - comprehensive PRD + donation support + content quality + editorial workflow + TikTok pipeline

---

## 1. Latar Belakang & Konteks

TAMPARAN ANAK MUDA (TAM) adalah brand pengembangan diri dan perspektif anak muda Indonesia yang saat ini aktif di Instagram (@tamparananakmuda.com). Brand ini hadir untuk mengisi gap: media pengembangan diri berbahasa Indonesia yang *estetik, kritis, dan substantif* - bukan sekadar konten motivasi clickbait.

Website TAM adalah **ekstensi digital** dari brand yang sudah ada di Instagram. Instagram menangani awareness dan engagement harian; website menangani kedalaman, SEO jangka panjang, dan kepemilikan audiens (via email list).

---

## 2. Problem Statement

| Problem | Dampak |
|---|---|
| Konten panjang tidak bisa diterbitkan di IG | Ide yang dalam terpotong, tidak optimal |
| Tidak ada kepemilikan audiens (IG bisa mati/berubah algoritma) | Brand rentan terhadap perubahan platform |
| Tidak ada SEO presence | Anak muda yang cari topik relevan tidak menemukan TAM |
| Tidak ada hub terpusat untuk semua konten TAM | Brand terasa fragmented |

---

## 3. Target Pengguna

### Primary User
**Anak muda Indonesia, 17-28 tahun**
- Mahasiswa atau profesional muda
- Aktif di media sosial tapi mulai merasa konten IG dangkal
- Sedang mencari arah: karir, mindset, relasi, identitas
- Literate secara digital, nyaman baca artikel panjang

### Secondary User
**Kreator & kolaborator potensial**
- Penulis muda yang ingin berkontribusi
- Brand/startup yang relevan untuk kolaborasi

---

## 4. Goals & Success Metrics

### Business Goals
- Membangun **email list** sebagai aset audiens yang dimiliki penuh
- Meningkatkan **brand authority** TAM di space pengembangan diri Indonesia
- Menciptakan **SEO footprint** untuk topik-topik relevan

### User Goals
- Menemukan konten yang "menampar" dan mengubah cara pandang
- Mengikuti seri/topik yang relevan dengan perjalanan hidup mereka
- Merasa menjadi bagian dari komunitas yang *tumbuh bersama*

### Success Metrics (6 bulan post-launch)

| Metric | Target |
|---|---|
| Email subscriber | 500+ |
| Monthly organic visitors | 2.000+ |
| Artikel terpublikasi | 20+ |
| Avg. time on page | > 3 menit |
| Newsletter open rate | > 35% |

---

## 5. Scope

### In Scope (Phase 1 - MVP)
- Homepage dengan brand statement kuat
- Blog/artikel engine (long-form content)
- Sistem kategori/seri konten
- Newsletter subscription (terintegrasi Brevo)
- Halaman Tentang / Manifesto
- SEO on-page dasar
- Responsive mobile
- Analytics & error tracking (Umami, Sentry, web-vitals)

### Out of Scope (Phase 1)
- User account / login
- Komentar & interaksi komunitas
- Monetisasi (kursus, ebook, merchandise)
- Multi-author dengan dashboard editor
- Podcast player terintegrasi
- Internal search
- Bookmark/reading list
- Donasi / support payment (Phase 2)

### Roadmap Phase 2-3
Lihat `Roadmap.md` - termasuk fitur donasi via Louvin payment gateway, editorial workflow dashboard, dan TikTok / short-form video pipeline.

---

## 6. User Stories & Acceptance Criteria

### US-1: Membaca Artikel
Sebagai pengunjung, saya ingin membaca artikel panjang dengan nyaman agar saya bisa mendapatkan perspektif yang mendalam.

**Acceptance Criteria:**
- [ ] Artikel page load < 3s di 3G.
- [ ] Reading time ditampilkan.
- [ ] Artikel readable di mobile (font-size ≥ 16px, line-height ≥ 1.6).
- [ ] Scroll depth tracking ke Umami (50% dan 90%).
- [ ] Related articles muncul di tengah dan bottom artikel.

### US-2: Subscribe Newsletter
Sebagai pembaca, saya ingin subscribe newsletter dengan mudah agar saya tidak ketinggalan konten baru.

**Acceptance Criteria:**
- [ ] Form newsletter di homepage, inline artikel, bottom artikel, dan footer.
- [ ] Validasi email inline.
- [ ] Double opt-in via Brevo.
- [ ] Success message: "Cek email kamu untuk konfirmasi."
- [ ] Error message sesuai jenis error (invalid, duplicate, server).
- [ ] Rate limit: max 3 attempt per IP per 10 menit.

### US-3: Eksplorasi Kategori & Seri
Sebagai pembaca, saya ingin eksplorasi artikel berdasarkan kategori atau seri agar saya bisa mengikuti topik yang relevan.

**Acceptance Criteria:**
- [ ] Homepage menampilkan artikel terbaru dan seri pilihan.
- [ ] Halaman kategori menampilkan semua artikel dalam kategori tersebut.
- [ ] Halaman seri menampilkan daftar artikel dalam urutan.
- [ ] Navigasi prev/next di artikel seri.

### US-4: Admin Publish Konten
Sebagai admin, saya ingin publish dan manage artikel via admin panel agar tidak perlu edit database manual.

**Acceptance Criteria:**
- [ ] Admin panel protected by Supabase Auth.
- [ ] CRUD artikel (title, slug, body, excerpt, cover, category, series, status, SEO meta).
- [ ] Markdown editor dengan preview.
- [ ] Auto-calculate reading time.
- [ ] Publish/unpublish artikel.
- [ ] Editorial checklist sebelum publish (angle test, human signature, fact-check status).
- [ ] POV tag di artikel (kontra-narasi / refleksi / data / framework). Tidak bisa publish tanpa minimal 1 POV.
- [ ] Human signature checkbox wajib diceklis sebelum publish.

### US-5: SEO & Discoverability
Sebagai brand, saya ingin konten TAM mudah ditemukan di Google agar organic traffic tumbuh.

**Acceptance Criteria:**
- [ ] Setiap artikel punya meta title, description, og image.
- [ ] Sitemap.xml auto-generated.
- [ ] RSS.xml tersedia.
- [ ] Structured data (Article schema) untuk artikel.
- [ ] URL slug bersih dan readable.

### US-6: Performance & Reliability
Sebagai pengunjung, saya ingin website cepat dan tidak error agar pengalaman membaca tidak terganggu.

**Acceptance Criteria:**
- [ ] LCP < 2.5s, CLS < 0.1, INP < 200ms.
- [ ] Sentry error tracking aktif.
- [ ] Uptime monitoring > 99.9%.
- [ ] Core Web Vitals tracking via web-vitals.

### US-7: Mendukung TAM Secara Finansial
Sebagai pembaca setia, saya ingin donasi ke TAM dengan mudah agar saya bisa membantu brand ini terus berkarya.

**Acceptance Criteria:**
- [ ] CTA "Dukung TAM" tersedia di artikel, tentang, dan footer.
- [ ] Halaman `/dukung` dengan pilihan nominal dan metode pembayaran.
- [ ] Support QRIS, GoPay, ShopeePay, BNI/BRI/Permata/CIMB VA.
- [ ] API key Louvin tidak terexposure di client.
- [ ] Webhook dari Louvin diproses dan update status transaksi.
- [ ] Donor redirect ke halaman terima kasih setelah settled.
- [ ] Email terima kasih dikirim via Brevo (opsional).
- [ ] Lihat `Payment.md` untuk detail teknis.

### US-8: TikTok / Short-Form Video Pipeline
Sebagai admin, saya ingin generate video script dari artikel yang sudah publish agar saya bisa distribusi konten ke TikTok / IG Reels.

**Acceptance Criteria:**
- [ ] Admin panel `/admin/tiktok` untuk manage video scripts.
- [ ] Generate script dari artikel published via `/api/tiktok/generate-script`.
- [ ] Hook line library dari tabel `hook_lines` (lihat `Architecture.md` Section 4).
- [ ] Script status: draft, approved, published.
- [ ] Video URL field untuk track video yang sudah di-upload.
- [ ] Analytics: `tiktok_video_published`, `tiktok_video_views`, `tiktok_profile_click` (lihat `Analytics.md`).
- [ ] Lihat `ContentStrategy.md` Section 9 untuk strategy dan `Features.md` F20 untuk spec lengkap.

---

## 7. Constraints

- **Budget:** Lean - prioritas tools gratis/murah (Vercel, Supabase free tier, Brevo free)
- **Tim:** Yovie + tim BHUYA (5 orang), web dev bukan fokus utama
- **Waktu:** Long-term planning, tidak ada deadline agresif
- **Konten:** Konten awal dari konversi konten IG yang sudah ada + artikel baru
- **AI Policy:** AI-assisted content boleh, tapi human signature wajib (lihat `ContentStrategy.md` Section 11). Setiap artikel lolos angle test sebelum publish.

---

## 8. Dependencies

| Dependency | Source | Mitigation |
|---|---|---|
| Domain `tamparananakmuda.com` | Sudah dikonfigurasi | - |
| Supabase project + database | Perlu setup | Gunakan Supabase CLI dan migrations |
| Vercel deployment | Perlu setup | Connect GitHub repo ke Vercel |
| Brevo account + list | Perlu setup | Daftar Brevo free tier, setup double opt-in |
| Umami instance | Perlu setup | Self-host di Vercel/Railway |
| Louvin account + API key | Perlu setup | Daftar di louvin.dev, project slug `tamparananakmuda` |
| Webhook URL untuk Louvin | Perlu setup | `/api/donation/webhook` setelah production deploy |
| 10 artikel awal | Konten tim | Konversi konten IG + artikel baru |
| Brand assets (logo, favicon) | Tim kreatif | Prioritaskan SVG/wordmark |

---

## 9. Assumptions

- Domain `tamparananakmuda.com` akan digunakan.
- Konten ditulis dalam Bahasa Indonesia.
- Tidak ada kebutuhan multi-bahasa di Phase 1.
- Yovie sebagai editor utama konten.
- Target audiens utama: anak muda Indonesia 17-28 tahun.
- Instagram tetap menjadi channel utama untuk distribusi.
- Setiap artikel lolos angle test (`ContentStrategy.md` Section 5) dan punya minimal 1 human signature.

---

## 10. Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Konten pipeline macet | Medium | High | Buat content calendar 3 bulan di awal; batch writing |
| Low organic traffic awal | High | Medium | Distribusi via IG, fokus SEO long-tail, newsletter welcome |
| Over-engineering sebelum ada trafik | Medium | High | Mulai dengan MVP, defer Phase 2 features |
| Email list tidak tumbuh | Medium | High | Newsletter value proposition harus kuat; double opt-in clear |
| Brevo API limit tercapai | Low | Medium | Monitor 300 email/hari; upgrade jika perlu |
| Supabase free tier limit | Low | Medium | Monitor 500MB DB; optimize images; upgrade ke Pro |
| Security incident (API key leak) | Low | High | Server-only secrets, audit env vars, rotate keys |
| Brand voice tidak konsisten | Medium | Medium | Editorial guidelines + review process |
| Louvin API key exposed | Low | High | Server-only, never prefix NEXT_PUBLIC_, rotate quarterly |
| Webhook spoofing / replay | Low | High | Implement webhook signature verification + idempotency |
| Payment fraud / abuse | Low | Medium | Rate limiting, amount cap, monitoring anomalies |
| Donation volume rendah | High | Low | Jadikan CTA non-intrusif, fokus value dulu |
| AI-generated content diluting brand voice | Medium | High | AI Usage Policy + human signature requirement (`ContentStrategy.md` Section 11) |
| Content pipeline macet karena standard terlalu tinggi | Low | Medium | Batch writing, quality bar gradual, editorial checklist yang actionable |

---

## 11. Success Metrics by Phase

### Phase 1 - MVP (Bulan 3-4)
| Metric | Target |
|---|---|
| Artikel published | 10+ |
| Email subscribers | 100+ |
| Monthly visitors | 500+ |
| Website live | ✓ |
| Artikel lolos angle test | 100% |

### Phase 2 - Growth (Bulan 5-8)
| Metric | Target |
|---|---|
| Artikel published | 30+ |
| Email subscribers | 500+ |
| Monthly organic visitors | 2.000+ |
| Search internal aktif | ✓ |
| Author profiles | ✓ |
| Donation page live | ✓ |
| Donasi settled (bulan pertama) | 5+ |
| Content quality score (editorial review) | > 80 |
| TikTok / short-form video pipeline | 10+ video published |

### Phase 3 - Community (Bulan 9-18)
| Metric | Target |
|---|---|
| Email subscribers | 2.000+ |
| Monthly visitors | 10.000+ |
| Revenue pertama | ✓ |
| Digital product / podcast | ✓ |

---

## 12. Changelog

| Versi | Tanggal | Perubahan |
|---|---|---|
| 1.0 | Jun 2026 | Draft awal. |
| 1.3 | Jul 2026 | Added AI policy constraint, content quality risks, editorial checklist in US-4, angle test in success metrics, TikTok pipeline in Phase 2. |
| 1.4 | Jul 2026 | Added US-8 TikTok pipeline, editorial workflow in Phase 2 scope, defined content quality score target (> 80, lihat ContentStrategy.md Section 13), fixed TikTok metric to measurable target. |
| 1.2 | Jul 2026 | Added donation support feature (US-7), Louvin dependencies, payment risks, Phase 2 donation metrics. |
| 1.1 | Jul 2026 | User stories + acceptance criteria, dependencies table, expanded risks, success metrics by phase, changelog. |
