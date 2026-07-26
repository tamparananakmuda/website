---
description: Artikel step 01 - Menentukan topik, target audience, search intent, dan goal artikel
---

# 01-idea

Menentukan topik, target audience, search intent, dan goal artikel.

## Lifecycle

Dari step ini, artikel akan disimpan sebagai JSON di `$ARTICLE_JSON` (`/tmp/tam-article.json`). JSON ini akan dipakai dari step 04 sampai 06. Pastikan semua output dari step-step berikutnya konsisten dengan JSON.

## Untuk ide dari workflow `/content-ideation`

Langsung lanjut ke `/artikel-02-research` dengan ide yang sudah terpilih. Ide dari content-ideation sudah punya: topik, kategori, POV, angle, working title, seo_keywords.

## Untuk ide ad-hoc

Lakukan Angle Test (2 pertanyaan wajib):

1. "Apakah ada media lain yang akan menulis ini dengan cara yang sama?" Jika ya, rewrite angle.
2. "Kalau saya hapus nama TAM dari artikel ini, apakah pembaca tahu ini tulisan TAM?" Jika tidak, terlalu generik.

## POV Selection (wajib pilih salah satu)

- `kontra-narasi` - melawan narasi populer dengan dasar kuat
- `refleksi` - pengalaman/observasi personal yang spesifik
- `data` - data + interpretasi yang tidak obvious
- `framework` - kerangka berpikir original
- `tamparan` - statement tajam yang membongkar ilusi langsung
- `riset` - temuan riset/studi sebagai angle utama
- `opini` - sudut pandang yang berani dan spesifik
- `panduan` - guide praktis berbasis pengalaman nyata
- `inspirasi` - cerita inspiratif tanpa menjual harapan palsu

## Category Reference

| Slug | Title | Color |
|------|-------|-------|
| `mindset` | Mindset | #D13A3A |
| `karier` | Karier | #4080D9 |
| `kehidupan` | Kehidupan | #40B880 |
| `uang` | Uang | #D9A040 |
| `bisnis` | Bisnis | #A040D9 |
| `teknologi` | Teknologi | #6040D9 |

## Target Audience Framework

Wajib tentukan minimal 3 dari 5 aspek:

| Aspek | Contoh |
|-------|--------|
| Demografi | Usia 18-30, lulusan S1, urban |
| Psikografi | Ambisius tapi cemas, konsumen konten self-improvement |
| Pain point | Bingung masa depan, merasa tertinggal dari teman |
| Platform | Instagram, TikTok, LinkedIn |
| Awareness level | Problem-aware (tahu ada masalah, belum tahu solusi) |

## Search Intent Analysis

Tentukan search intent untuk keyword utama:

| Intent | Definisi | Contoh query | Format artikel |
|--------|----------|-------------|----------------|
| Informational | Cari info/edukasi | "kenapa gen Z sulit beli rumah" | Edukasi + data |
| Navigational | Cari situs/brand spesifik | "tamparan anak muda artikel karier" | Brand search |
| Transactional | Cari solusi/produk | "cara mulai side hustle 2026" | Panduan praktis |
| Commercial investigation | Compare sebelum decide | "freelance vs full time salary" | Perbandingan + rekomendasi |

## Content Cluster Awareness

Cek artikel existing di kategori yang sama sebelum tentukan ide:

```bash
# Cek artikel di kategori yang sama
grep -rl "category:.*\"KATEGORI\"" content/articles/ --include="*.md" 2>/dev/null \
  | while read f; do echo "$(basename $f .md)"; done

# Cek artikel dengan keyword serupa
grep -rl "KEYWORD" content/articles/ --include="*.md" 2>/dev/null \
  | while read f; do echo "$(basename $f .md)"; done
```

Pertanyaan cluster:
- Apakah sudah ada artikel di kategori/keyword yang sama?
- Jika ya: artikel baru ini melengkapi, melawan, atau update dari artikel lama?
- Jika belum: ini artikel pertama di cluster, plan untuk buat 2-3 artikel terkait dalam 30 hari

## Template Output Ide

Dokumentasi ide dalam format ini (simpan di notes, akan dipakai di step berikutnya):

```
Topik: [topik utama]
Kategori: [slug kategori]
POV: [pov tag]
Angle: [1-2 kalimat angle unik]
Working title: [judul sementara]
Target audience: [demografi + pain point]
Search intent: [informational/navigational/transactional/commercial]
Goal: [educate/provoke/convert]
Cluster: [artikel baru di cluster / melengkapi artikel X / melawan artikel Y]
Keyword utama: [1 keyword utama untuk SEO]
```

## Idea Quality Score (0-15)

Score ide sebelum lanjut ke 02-research. Target: minimal 10.

| Factor | Weight | 0 (weak) | 1 (ok) | 2 (strong) |
|--------|--------|----------|--------|------------|
| **TAM fit** | 2 | Bukan tone TAM | Sebagiane TAM | Fully jujur + tajam + rasional |
| **Angle uniqueness** | 2 | Sudah pernah dibaca di media lain | Ada angle tapi tidak sharp | Kontra-narasi atau angle yang tidak ada di kompetitor |
| **Data availability** | 1 | Tidak ada data yang bisa dipakai | Data ada tapi tipis | 2+ data sources tersedia |
| **Search demand** | 1 | Tidak ada orang search ini | Volume rendah | Volume medium + long-tail |
| **Reader pain** | 2 | Tidak address pain point nyata | Pain point ada tapi vague | Pain point spesifik + urgent |
| **Cluster potential** | 1 | One-off article | Bisa jadi 2-3 artikel | Bisa jadi seri atau cluster 5+ |
| **AI citation potential** | 1 | Tidak ada format yang AI bisa cite | Ada definisi/data | Data self-contained + FAQ-ready |
| **Emotional trigger** | 1 | Tidak ada emotional hook | Ada tapi lemah | Surprise/kontra-narasi/validasi |
| **Timeliness** | 1 | Evergreen tapi tidak urgent | Sebagiane timely | Hook ke event/trend terkini |

Jika score < 10: revisi angle atau cari ide baru. Jangan invest waktu di ide yang lemah.

## TAM Angle Verification Protocol

3 pertanyaan tambahan selain Angle Test:

| Pertanyaan | Pass criteria | Jika gagal |
|------------|---------------|-----------|
| **"Siapa yang akan marah baca ini?"** | Minimal 1 group yang tidak setuju | Jika semua setuju = terlalu safe, tajamkan |
| **"Apa konsekuensi jika reader tidak baca ini?"** | Reader akan tetap melakukan kesalahan yang sama | Jika tidak ada konsekuensi = tidak urgent |
| **"Bisakah saya menjelaskan ini ke teman dalam 30 detik?"** | Pitch jelas dan padat | Jika tidak = angle terlalu kompleks, simplify |

## Reader Empathy Map

Sebelum tentukan angle, pahami reader secara mendalam:

| Dimension | Pertanyaan | Output |
|-----------|------------|--------|
| **Apa yang reader pikirkan?** | Pre-occupations, worries, hopes | 3-5 pikiran dominan |
| **Apa yang reader rasakan?** | Emotions tentang topik ini | 3-5 emosi |
| **Apa yang reader dengar?** | Narasi yang sudah mereka terima dari media/orang lain | Dominant narrative |
| **Apa yang reader lakukan?** | Behavior saat ini terkait topik | Current behavior |
| **Apa yang reader takutkan?** | Fear yang block action | 2-3 fears |
| **Apa yang reader harapkan?** | Desired outcome | 2-3 hopes |

TAM angle = kontra-narasi dari "apa yang reader dengar" + validasi "apa yang reader rasakan" + solusi untuk "apa yang reader takutkan".

## Content Pillar Mapping

Setiap artikel harus map ke 1 content pillar TAM:

| Pillar | Fokus | Artikel dalam pillar |
|--------|-------|---------------------|
| **Realita Kerja** | PHK, gig economy, karier, pengangguran | Karier + Uang |
| **Kesehatan Mental Era Digital** | Burnout, FOMO, comparison, doomscroll | Mindset + Kehidupan |
| **Literasi Finansial** | Gaji, tabungan, investasi, utang | Uang |
| **Hubungan Era Modern** | Dating apps, ghosting, friendship, keluarga | Kehidupan |
| **Ilusi Self-Improvement** | Hustle culture, productivity porn, toxic positivity | Mindset + Bisnis |
| **Teknologi dan Generasi** | AI, automation, digital dependency | Teknologi |

Artikel harus jelas masuk 1 pillar. Jika ambiguous, pilih pillar yang paling dominan.

## Trend Alignment Check

Cek apakah topik align dengan trend terkini:

| Check | Cara | Output |
|-------|------|--------|
| **Google Trends** | Cek keyword di trends.google.com | Naik/stabil/turun |
| **Social signals** | Cek TikTok/IG/X apakah topik viral | Viral/emerging/niche |
| **News cycle** | Ada berita terkini yang relevant? | Hook opportunity |
| **Seasonal** | Apakah topik seasonal? (mudik, tahun baru, graduation) | Timing window |
| **TAM backlog** | Apakah ada artikel lama yang bisa di-update? | Update opportunity |

Jika topik declining di Google Trends dan tidak ada social signals: pertimbangkan ide lain.

## Idea Source Tracking

Catat dari mana ide berasal untuk future reference:

| Source | Contoh | Frequency target |
|--------|--------|-----------------|
| **Observasi pribadi** | "Saya perhatikan teman-teman..." | > 30% |
| **Data/riset** | "BPS rilis data baru..." | > 25% |
| **Social listening** | "Banyak diskusi di Twitter tentang..." | > 20% |
| **Reader feedback** | "Pembaca tanya di komentar..." | > 10% |
| **Competitor gap** | "Media lain tidak bahas..." | > 10% |
| **Trend/news** | "Berita terkini tentang..." | < 10% |

TAM lebih original jika ide datang dari observasi pribadi dan data, bukan dari trend chasing.

## Checklist

- [ ] Topik ditentukan
- [ ] Target audience jelas (min 3 dari 5 aspek)
- [ ] Search intent dianalisis (informational/navigational/transactional/commercial)
- [ ] Goal artikel didefinisikan (educate, provoke, convert)
- [ ] Angle test lolos (kedua pertanyaan)
- [ ] TAM Angle Verification: 3 pertanyaan tambahan lolos
- [ ] POV tag dipilih
- [ ] Category dipilih
- [ ] Content cluster dicek (artikel existing di kategori/keyword sama)
- [ ] Content pillar mapping: 1 pillar jelas
- [ ] Reader Empathy Map: 6 dimension diisi
- [ ] Trend Alignment Check: minimal 1 signal positif
- [ ] Idea Source Tracking: sumber ide tercatat
- [ ] Idea Quality Score: > 10 (dari 15)
- [ ] Template output ide diisi

## Next

Lanjut ke `/artikel-02-research`
