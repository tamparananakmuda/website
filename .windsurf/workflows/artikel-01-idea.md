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

## Title & Hook/Foreshadow Formula Selection (Level: Artikel)

Reference lengkap: `Hook & Foreshadow by Content Level.md` (30 Hook formula + 20 Foreshadow formula)

### Title Artikel (natural, punchy, research-backed)

Title artikel HARUS natural, punchy, dan terdengar seperti cara orang muda bicara. Bukan judul skripsi. Bukan judul clickbait. Tamparan yang bikin penasaran.

**20 prinsip riset yang bikin judul PUNCHY** (Nature, PLOS, Science Advances, Wharton, Upworthy 100K+ A/B tests, Google Discover 3.4M articles, Kentucky 6 studies, PNAS, CHI 2021, Deep Marketing 35K content):

1. **Simplicity** — kata umum + pendek = gampang diproses = gampang diklik. "Nggak" > "Tidak"
2. **Negativity Bias** — kata negatif naikkan CTR 2.3% per kata. "Hilang", "Gagal", "Trap" > "Berhasil", "Untung"
3. **Contrast & Surprise** — otak = prediction machine, surprise = strongest attention attractor (72% gaze shifts). "Bukan [X]" setelah [Y] = kontras
4. **Curiosity Gap** — cukup info untuk penasaran, tidak cukup untuk puas. Terlalu vague = klik rendah, terlalu concrete = klik rendah
5. **Concreteness** — angka spesifik > klaim abstrak. "74%" > "Banyak". Familiar + concrete = foundations of good copywriting
6. **Brevity** — working memory 3-4 chunks. 5-8 kata ideal, max 10 kata. 40-60 karakter = highest CTR
7. **Active Verbs** — verb di dekat awal = urgency. Verbs > nouns untuk action. "Hilang", "Jadi", "Bocor"
8. **2nd Person** — "kamu" naikkan engagement + resonance. Question + "kamu" = 175% more clicks
9. **Rhythm & Alliteration** — staccato = urgency. Alliteration reduces N400 (easier to process) + boosts memory. Baca keras-keras: kalau ngos-ngosan, terlalu panjang
10. **Emotional Arousal** — high-arousal (kecewa, terkejut, sadar) > low-arousal (sedih). TAM: jujur, bukan marah
11. **Loss Framing** — "Kamu akan kehilangan" > "Kamu akan dapat". Subtle scarcity = effective, explicit FOMO = NOT effective
12. **Digits > Number Words** — "7" > "tujuh". Digits feel right, processed faster, stand out visually
13. **Odd Numbers** — 3, 5, 7, 9 outperform even by ~20%. Odd = less padded, more authentic
14. **Forward Referencing** — "Yang Tidak Pernah..." = tease yang belum diungkap. Create information gap
15. **Unresolved Emotion** — hope > happiness, anxiety > sadness, excitement > satisfaction. Uncertainty = sustained attention
16. **Avoid Fear Words** — fear = avoidance (TURUNKAN CTR). Sadness = approach (naikkan CTR). "Rugi" > "Bahaya"
17. **1st Person Singular > Plural** — "aku" = strongest pronoun effect. "kita" = negatively associated. Hindari "kita"
18. **Avoid Clickbait** — non-clickbait 2.22x more clicks. Clickbait = source derogation. Punchy != clickbait
19. **Avoid Positive Superlatives** — "terbaik", "hebat", "amazing" = decrease CTR. Nyatakan temuan, bukan self-praise
20. **Alliteration** — sound pattern boosts attention + memory traces. "Trap, Bukan Tangga" (T-T)

**Aturan Title Artikel:**
- Max 10 kata (ideal 5-8, working memory 3-4 chunks)
- Kata umum > kata formal ("Nggak" > "Tidak", "Rugi" > "Kerugian") (#1)
- Conclusive: nyatakan temuan, bukan deskripsi topik
- Kontras/surprise: ada elemen yang melanggar ekspektasi (#3)
- Active verb di dekat awal (#7)
- Boleh pakai "kamu" untuk personal relevance (#8)
- Boleh pakai "aku" (1st person singular = strongest pronoun effect #17)
- Hindari "kita" / "kami" (negatively associated #17)
- Loss framing > gain framing (#11): "Kamu akan kehilangan" > "Kamu akan dapat"
- Pakai digit, bukan kata angka (#12): "74%" > "tujuh puluh empat persen"
- Pakai sadness/loss words, hindari fear words (#16): "Rugi" > "Bahaya"
- Hindari positive superlatives (#19): no "terbaik", "hebat", "amazing"
- Hindari clickbait yang tidak di-backup data (#18)
- Cari alliteration atau rhythm (#9, #20): "Trap, Bukan Tangga" (T-T)
- Searchable: mengandung keyword utama
- Bervariasi: jangan ulang pattern
- Baca keras-keras: kalau ngos-ngosan, terlalu panjang

**Pattern title yang boleh dipakai (variasikan):**

| Pattern | Contoh punchy | Kapan dipakai |
|---------|--------------|---------------|
| **Declarative + Contrast** | "Kerja Keras Nggak Menjamin Aman" | Temuan bisa diungkap 1 kalimat tegas |
| **Question** | "Scroll Media Sosial Bikin Kamu Merasa Gagal?" | Artikel menjawab pertanyaan provokatif |
| **Data-driven** | "74% Lulusan Kuliah Menganggur" | Angka adalah hook terkuat |
| **Kontra-narasi** | "Quiet Quitting Bukan Malas" | Membongkar narasi populer |
| **Punchy short (hammer)** | "Hustle Culture Itu Trap" | Temuan bisa diungkap 3-5 kata |
| **2nd Person direct** | "Kamu Nggak Akan Bisa Beli Rumah" | Sistem berdampak langsung ke reader |
| **Reframe** | "Masalahmu Bukan Malas. Masalahnya Sistem." | Artikel mengubah cara pandang |

**Anti-pattern title (HINDARI):**
- Kata formal/akademis (#1): "Tidak" → "Nggak", "Kerugian" → "Rugi"
- Title > 10 kata (#6): shorter = more clicks, setiap kata harus earn tempatnya
- Title deskriptif tanpa temuan (#4): "Analisis PHK" = lemah, zero curiosity gap
- Zero kontras/surprise (#3): surprise = strongest attention attractor
- Clickbait yang tidak di-backup data (#18): non-clickbait 2.22x more clicks
- Passive voice atau verb-less (#7): active verb = more engagement
- Fear words (#16): "Bahaya", "Mengerikan" = avoidance, turunkan CTR
- "Kita" / "kami" (#17): 1st person plural = negatively associated
- Positive superlatives (#19): "Terbaik", "Hebat" = decrease CTR
- Explicit FOMO (#11): "Jangan sampai ketinggalan!" = NOT effective
- Number words (#12): "tujuh" > "7" = wrong direction

### Hook Formula untuk og_headline + Opening (pilih 1 dari 30)

Pilih Hook formula untuk og_headline (thumbnail text) dan paragraf pembuka artikel. BUKAN untuk title. Formula terbaik untuk artikel: **01, 07, 10, 19, 22**.

| Formula | Nama | Template untuk og_headline / Opening |
|---------|------|-------------------------------------|
| 01 | Expectation vs Reality | `[X] Bukan [Y]: Kenapa [asumsi umum] Adalah Mitos` |
| 07 | Myth Breaking | `Kalau Kamu Masih Percaya [X], Saatnya Berpikir Ulang` |
| 10 | False Belief | `Kesalahan Terbesar tentang [X] yang Dilakukan Hampir Semua Orang` |
| 19 | Reframe | `Masalahmu Bukan [X]. Masalahmu Adalah [Y].` |
| 22 | Hidden Truth | `Yang Tidak Pernah Diajarkan tentang [X]` |

Lihat file reference untuk semua 30 formula (02-30).

### Foreshadow Formula untuk Working Subtitle (pilih 1)

Pilih dari 20 Foreshadow formula. Formula terbaik untuk artikel: **01, 02, 06, 18**.

| Formula | Nama | Template |
|---------|------|----------|
| 01 | Promise | `Di akhir artikel ini, kamu akan paham [X].` |
| 02 | Curiosity | `Masalahnya bukan [X]. Ada [Y] yang tidak kamu sadari.` |
| 06 | Transformation | `Setelah memahami ini, cara kamu melihat [X] akan berubah.` |
| 18 | Personal | `Aku dulu juga berpikir seperti itu. Sampai [X].` |

Lihat file reference untuk semua 20 formula (03-20).

### Aturan Formula Selection

- **Title:** natural, punchy, max 10 kata, bervariasi pattern (tidak locked ke satu formula)
- **1 Hook formula** untuk og_headline (max 50 karakter) dan paragraf pembuka artikel
- **1 Foreshadow formula** untuk working subtitle (max 170 karakter)
- Hook dan Foreshadow boleh dari formula berbeda (tidak harus sama nomor)
- Pilih formula yang paling cocok dengan angle dan POV artikel
- Title akan di-refine di step 03-outline (final title)
- Working subtitle akan di-refine di step 03-outline (final excerpt)

## Template Output Ide

Dokumentasi ide dalam format ini (simpan di notes, akan dipakai di step berikutnya):

```
Topik: [topik utama]
Kategori: [slug kategori]
POV: [pov tag]
Angle: [1-2 kalimat angle unik]
Working title (natural, punchy, max 10 kata): [judul sementara, bahasa orang muda, bukan jurnal]
Hook formula [N] (untuk og_headline + opening): [hook pendek, max 50 char untuk og_headline]
Working subtitle (Foreshadow formula [N]): [subjudul sementara, max 170 karakter]
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
- [ ] Title artikel punchy berdasar 20 prinsip riset (simplicity, negativity, contrast, curiosity gap, concreteness, brevity, active verb, 2nd person, rhythm, emotional arousal, loss framing, digits, odd numbers, forward referencing, unresolved emotion, avoid fear, 1st person singular, avoid clickbait, avoid superlatives, alliteration)
- [ ] Title max 10 kata (ideal 5-8), kata umum > formal, ada kontras/surprise
- [ ] Hook formula dipilih untuk og_headline + opening (bukan untuk title)
- [ ] Template output ide diisi

## Next

Lanjut ke `/artikel-02-research`
