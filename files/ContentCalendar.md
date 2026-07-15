# Content Calendar & SOP TAM

Framework jadwal publikasi dan standard operating procedure tim editorial TAMPARAN ANAK MUDA.

---

## 1. Kadens Publikasi

**Target: 3-4 artikel per minggu (12-16 per bulan)**

### Jam Publish Optimal (WIB)

Berdasarkan riset data: Sprout Social (2B+ engagements), Neil Patel (158K blog posts), We Are Social Indonesia, Buffer (4.8M LinkedIn posts), dan Vedit.co.id (Indonesia 2026).

| Slot | Jam WIB | Alasan | Cocok untuk |
|---|---|---|---|
| **Pagi** | 07:30 | Audiens cek HP sebelum kerja/kuliah. Konten muncul saat feed masih sepi, dapat engagement awal | Artikel pillar utama (Senin, Rabu) |
| **Siang** | 12:15 | Jam istirahat makan siang. Lonjakan aktivitas tertinggi di Indonesia (DailySocial) | Artikel data/panduan (Rabu) |
| **Sore** | 17:00 | Audiens selesai kerja, mulai santai. Engagement tinggi untuk konten reflektif | Artikel POV refleksi/tamparan (Sabtu) |
| **Malam** | 19:30 | Puncak retensi pengguna Indonesia. Cocok untuk konten panjang yang butuh fokus | Artikel evergreen mendalam |

**Aturan:**
- Hari terbaik: **Selasa, Rabu, Kamis** (Sprout Social, Neil Patel)
- Hari terburuk: **Sabtu** (engagement 35% lebih rendah, kecuali malam 20:00-22:00)
- Jangan publish 2 artikel di jam yang sama. Spacing minimal 4 jam
- Publish 10 menit sebelum golden hour untuk dapat momentum algoritma

### Jadwal Mingguan

| Hari | Aktivitas | Jam WIB | Platform |
|---|---|---|---|
| Senin | Publikasi artikel pillar utama | 07:30 | Web |
| Selasa | Distribusi carousel dari artikel Senin | 12:15 | Instagram |
| Rabu | Publikasi artikel pillar rotasi | 12:15 | Web |
| Kamis | Distribusi video script dari artikel | 19:30 | TikTok/Reels |
| Jumat | Kirim newsletter mingguan | 08:00 | Email (Brevo) |
| Sabtu | Publikasi artikel POV tag `tamparan` | 17:00 | Web |
| Minggu | Planning konten minggu depan | - | Internal |

## 2. Distribusi Pillar Per Bulan

### Minggu 1
| Hari | Pillar | POV Tag |
|---|---|---|
| Senin | Mindset & Realita | kontra-narasi / refleksi |
| Rabu | Bisnis | data / panduan |
| Sabtu | Tamparan | tamparan |

### Minggu 2
| Hari | Pillar | POV Tag |
|---|---|---|
| Senin | Karier & Dunia Kerja | panduan / refleksi |
| Rabu | Teknologi & AI atau Produktivitas | data / framework |
| Sabtu | Tamparan | tamparan |

### Minggu 3
| Hari | Pillar | POV Tag |
|---|---|---|
| Senin | Uang | data / panduan |
| Rabu | Psikologi atau Skill Masa Depan atau Analisis Fenomena | refleksi / riset |
| Sabtu | Tamparan | tamparan |

### Minggu 4
| Hari | Pillar | POV Tag |
|---|---|---|
| Senin | As-needed pillar (Pendidikan, Komunikasi, Hubungan Sosial, Lifestyle, Sejarah, Ulasan Buku, Filosofi) | bebas |
| Rabu | Mindset & Realita (refresh atau baru) | kontra-narasi |
| Sabtu | Tamparan | tamparan |
| Minggu | Newsletter recap bulan ini + review | - |

## 3. SOP Penulisan

### Stage 1: Idea (`idea`)

**Siapa:** Editor / Writer / siapapun di tim

1. Submit ide ke content queue (admin panel atau Notion)
2. Isi: judul working, pillar, POV tag, target keyword
3. Angle test: "Apakah ada media lain yang akan menulis ini dengan cara yang sama?" Jika ya, revise angle.

### Stage 2: Research (`research`)

**Siapa:** Writer

1. Riset keyword: search volume, intent, kompetitor top 3 di Google
2. Baca 3 artikel kompetitor, identifikasi kelemahan/angle yang kurang
3. Isi SEO brief (lihat `files/templates/seo-brief-template.md`)
4. Tentukan formula Tamparan-Penjelasan-Solusi

### Stage 3: Draft (`draft`)

**Siapa:** Writer

1. Tulis draft mengikuti template artikel (`files/templates/article-template.md`)
2. Pastikan human signature (pengalaman/observasi personal) ada
3. Setiap klaim faktual punya sumber
4. Target: 1.000-2.500 kata
5. No em-dash, no AI pattern (lengkap: lihat `files/HumanizerRules.md`)

### Stage 4: Review (`review`)

**Siapa:** Editor

1. Cek angle test: kalau nama TAM dihapus, apakah pembaca tahu ini TAM?
2. Cek formula: Tamparan-Penjelasan-Solusi semua ada?
3. Cek human signature: ada pengalaman/observasi personal?
4. Cek sumber: setiap klaim faktual terverifikasi?
5. Berikan feedback ke writer

### Stage 5: Revision (`revision`)

**Siapa:** Writer

1. Apply feedback dari editor
2. Resubmit untuk review atau langsung ke fact-check

### Stage 6: Fact-Check (`fact-check`)

**Siapa:** Editor / Fact-checker

1. Verifikasi semua angka, statistik, dan klaim faktual
2. Cek link sumber: masih aktif dan relevan?
3. Set fact_check_status: `verified` atau `flagged`
4. Jika `flagged`, kembali ke writer untuk revisi

### Stage 7: Schedule (`scheduled`)

**Siapa:** Editor

1. Final check: SEO title max 70 karakter, meta description max 160 karakter
2. Set publish date
3. Set human_signature = true
4. Set formula checklist complete
5. Schedule di admin panel

### Stage 8: Publish (`published`)

**Siapa:** System (auto-publish pada scheduled date)

1. Artikel live di website
2. Auto-generate OG image
3. Update sitemap
4. Notifikasi tim untuk distribusi

### Stage 9: Distribute

**Siapa:** Social media team / Writer

1. Buat carousel dari artikel (lihat `files/templates/carousel-template.md`)
2. Buat video script (lihat `files/templates/video-script-template.md`)
3. Include di newsletter mingguan jika relevan
4. Post di Instagram, TikTok, X/Threads

## 4. Monthly Review

Setiap awal bulan, editor melakukan review:

- [ ] Berapa artikel published bulan lalu? (target: 12-16)
- [ ] Pillar distribution: apakah sesuai alokasi persentase?
- [ ] POV tag distribution: sebaran sehat antar 9 types?
- [ ] Top 5 artikel by pageview
- [ ] Bottom 5 artikel: kenapa underperform?
- [ ] Artikel mana yang perlu di-refresh/update?
- [ ] Keyword ranking: ada yang naik? turun?
- [ ] Newsletter open rate dan click rate
- [ ] Plan bulan ini: pillar apa yang perlu di-fokuskan?

## 5. Quarterly Review

Setiap 3 bulan:

- [ ] Launch 1 seri konten baru (3-6 artikel)
- [ ] Refresh 3-5 artikel evergreen yang masih relevan
- [ ] Evaluasi: pillar mana yang paling perform? Double-down.
- [ ] Evaluasi: pillar mana yang underperform? Kurangi atau revise angle.
- [ ] Cek kompetitor: ada topik baru yang mereka cover tapi TAM belum?
- [ ] Update SEO strategy berdasarkan Google Search Console data
