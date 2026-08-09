---
description: Seri step 01 - Menentukan tema utama seri
---

# 01-idea

Menentukan tema utama seri.

## Prev

Dari workflow `/content-ideation` atau ide ad-hoc

## Lifecycle

Dari step ini, setiap part akan disimpan sebagai JSON di `$ARTICLE_JSON` (`/tmp/tam-article.json`). JSON ini dipakai dari step 05 sampai 07. Pastikan semua output konsisten dengan JSON.

## Untuk ide dari workflow `/content-ideation`

Langsung lanjut ke `/seri-02-strategy` dengan ide yang sudah terpilih.

## Untuk ide ad-hoc

Lakukan Angle Test (2 pertanyaan wajib):

1. "Apakah ada media lain yang akan menulis seri ini dengan cara yang sama?" Jika ya, rewrite angle.
2. "Kalau saya hapus nama TAM, apakah pembaca tahu ini tulisan TAM?" Jika tidak, terlalu generik.

## Seri vs Artikel Tunggal: Kapan Bikin Seri?

| Kondisi | Pilih |
|---------|-------|
| Topik terlalu luas untuk 1 artikel (2.500 kata) | Seri (pecah jadi 3-7 part) |
| Topik punya multiple sub-topic yang masing-masing layak standalone | Seri |
| Topik butuh alur pembelajaran bertahap (basic → advanced) | Seri |
| Topik bisa diselesaikan dalam 1.000-2.500 kata | Artikel tunggal |
| Topik punya 1 angle utama, tidak perlu dipecah | Artikel tunggal |
| Target audience butuh depth di 1 topik tertentu | Seri |

## POV Selection (wajib pilih salah satu)

- `kontra-narasi`, `refleksi`, `data`, `framework`, `tamparan`, `riset`, `opini`, `panduan`, `inspirasi`

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

Tentukan search intent untuk keyword utama seri:

| Intent | Definisi | Contoh query | Format seri |
|--------|----------|-------------|-------------|
| Informational | Cari info/edukasi | "kenapa gen Z sulit beli rumah" | Edukasi bertahap |
| Transactional | Cari solusi/produk | "cara mulai side hustle 2026" | Panduan praktis bertahap |
| Commercial investigation | Compare sebelum decide | "freelance vs full time salary" | Perbandingan multi-part |

## Content Cluster Awareness

Cek artikel existing di kategori yang sama sebelum tentukan ide seri:

```bash
# Cek artikel di kategori yang sama
grep -rl "category:.*\"KATEGORI\"" content/articles/ --include="*.md" 2>/dev/null \
  | while read f; do echo "$(basename $f .md)"; done

# Cek artikel dengan keyword serupa
grep -rl "KEYWORD" content/articles/ --include="*.md" 2>/dev/null \
  | while read f; do echo "$(basename $f .md)"; done

# Cek seri existing
grep -rl "series:" content/ --include="*.md" 2>/dev/null \
  | while read f; do echo "$(basename $f .md)"; done
```

Pertanyaan cluster:
- Apakah sudah ada seri di kategori/keyword yang sama?
- Jika ya: seri baru ini melengkapi, melawan, atau update dari seri lama?
- Jika belum: ini seri pertama di cluster, plan untuk buat artikel pendukung

## Title & Series Hook/Foreshadow Formula Selection (Level: Series)

Reference lengkap: `Hook & Foreshadow by Content Level.md` (30 Hook formula + 20 Foreshadow formula)

Series Hook dan Series Foreshadow berbeda dari Episode Hook/Foreshadow. Series Hook = hook untuk seluruh seri (og_headline + series promise). Series Foreshadow = tease untuk membuat reader commit baca semua part.

### Title Seri (natural, punchy, research-backed)

Title seri HARUS natural, punchy, dan terdengar seperti cara orang muda bicara. Bukan judul skripsi. Bukan judul clickbait. Tamparan yang bikin penasaran untuk seluruh seri.

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

**Aturan Title Seri:**
- Max 10 kata (ideal 5-8, working memory 3-4 chunks)
- Kata umum > kata formal ("Nggak" > "Tidak", "Rugi" > "Kerugian") (#1)
- Conclusive: nyatakan temuan seri, bukan deskripsi topik
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
- Searchable: mengandung keyword utama seri
- Bervariasi: jangan ulang pattern
- Baca keras-keras: kalau ngos-ngosan, terlalu panjang
- Title seri harus cukup kuat untuk menahan minat reader di semua part

**Pattern title seri yang boleh dipakai (variasikan):**

| Pattern | Contoh punchy | Kapan dipakai |
|---------|--------------|---------------|
| **Declarative + Contrast** | "Industri Penderitaan Gen Z" | Temuan seri bisa diungkap 1 frasa tegas |
| **Colon + Twist** | "Infrastruktur Kesepian: Sistem yang Membuat Gen Z Sendiri" | Konteks + temuan punya kontras |
| **Question** | "Kenapa Gen Z Lebih Enak Sendiri?" | Seri menjawab pertanyaan provokatif |
| **Kontra-narasi** | "Hustle Culture Itu Trap" | Membongkar narasi populer |
| **Punchy short (hammer)** | "Generasi Sewa" | Temuan seri bisa diungkap 2-3 kata |
| **2nd Person direct** | "Bisnis yang Untung dari Kesengsaraanmu" | Sistem berdampak langsung ke reader |

**Anti-pattern title (HINDARI):**
- Kata formal/akademis (#1): "Tidak" → "Nggak", "Kerugian" → "Rugi"
- Title > 10 kata (#6): shorter = more clicks, setiap kata harus earn tempatnya
- Title deskriptif tanpa temuan (#4): "Analisis Generasi Z" = lemah, zero curiosity gap
- Zero kontras/surprise (#3): surprise = strongest attention attractor
- Clickbait yang tidak di-backup data (#18): non-clickbait 2.22x more clicks
- Passive voice atau verb-less (#7): active verb = more engagement
- Fear words (#16): "Bahaya", "Mengerikan" = avoidance, turunkan CTR
- "Kita" / "kami" (#17): 1st person plural = negatively associated
- Positive superlatives (#19): "Terbaik", "Hebat" = decrease CTR
- Explicit FOMO (#11): "Jangan sampai ketinggalan!" = NOT effective
- Number words (#12): "tujuh" > "7" = wrong direction

### Series Hook Formula (pilih 1 dari 30, untuk og_headline + series promise opening)

Pilih Hook formula untuk og_headline seri dan opening series promise. BUKAN untuk title. Formula terbaik untuk seri: **01, 05, 08, 14, 22, 28**.

| # | Nama | Template untuk og_headline / Series Promise |
|---|------|---------------------------------------------|
| 01 | Expectation vs Reality | `[X] Bukan [Y]: Kenapa [asumsi umum] Adalah Mitos` |
| 05 | Counter-Narrative | `Semua Bilang [X]. Tapi [Data/Fakta] Bilang Sebaliknya.` |
| 08 | Time Pressure | `Dalam [X] Tahun, [Y] Akan [Z]. Kamu Sudah Siap?` |
| 14 | Pattern Recognition | `Ada Pola: [X], [Y], [Z]. Semua Pointing ke [A].` |
| 22 | Hidden Truth | `Yang Tidak Pernah Diajarkan tentang [X]` |
| 28 | Silent Epidemic | `Tidak Ada yang Bicara tentang [X]. Tapi [Data] Menunjukkan [Y].` |

Lihat file reference untuk semua 30 formula.

### Series Foreshadow Formula (pilih 1-2 dari 20)

Pilih Foreshadow formula untuk series promise (tease apa yang reader dapat setelah baca semua part). Formula terbaik untuk seri: **01, 04, 06, 09, 15**.

| # | Nama | Template untuk Series Promise |
|---|------|------------------------------|
| 01 | Promise | `Di akhir seri ini, kamu akan paham [X].` |
| 04 | Setup-Payoff | `Ingat [X] di awal. Nanti kamu akan tahu kenapa.` |
| 06 | Transformation | `Setelah memahami ini, cara kamu melihat [X] akan berubah.` |
| 09 | Pattern Tease | `Kalau kamu lihat polanya, [X] bukan kebetulan.` |
| 15 | Connection Tease | `[X] dan [Y] terlihat tidak related. Tapi keduanya punya akar yang sama.` |

Lihat file reference untuk semua 20 formula.

### Aturan Formula Selection untuk Seri

- **Title seri:** natural, punchy, max 10 kata, bervariasi pattern (tidak locked ke satu formula)
- **1 Series Hook formula** untuk og_headline (max 50 karakter) dan series promise opening
- **1-2 Series Foreshadow formula** untuk series promise (max 170 karakter)
- Series Hook berbeda dari Episode Hook (dipilih di step 04-outline per part)
- Series Foreshadow berbeda dari Episode Foreshadow/Next Tease (dipilih di step 04-outline per part)
- Series Hook harus cukup kuat untuk menahan minat reader di semua part
- Series Foreshadow harus tease payoff di part terakhir tanpa spoiler

## Template Output Ide Seri

Dokumentasi ide dalam format ini (dipakai di step berikutnya):

```
Tema seri: [tema utama]
Kategori: [slug kategori]
POV: [pov tag]
Angle seri: [1-2 kalimat angle unik]
Estimasi jumlah part: [3-7 part]
Target audience: [demografi + pain point]
Search intent: [informational/transactional/commercial]
Goal seri: [educate/provoke/convert]
Cluster: [seri baru / melengkapi seri X / melawan seri Y]
Keyword utama seri: [1 keyword utama]
Working title seri (natural, punchy, max 10 kata): [judul seri sementara, bahasa orang muda, bukan jurnal]
Series Hook formula [N] (untuk og_headline + series promise opening): [hook pendek, max 50 char untuk og_headline]
Series promise (Series Foreshadow formula [N]): [promise seri, max 170 karakter]
```

## Cinematic Storytelling Framework (wajib untuk seri 5+ part)

Untuk seri dengan 5+ part, wajib apply Cinematic Storytelling Framework.
Framework ini **adaptive**, bukan prescriptive. Pilih teknik yang sesuai dengan karakter seri.
Reference lengkap (contoh implementasi): `files/seri-kesehatan-mental-storytelling-framework.md`

### 12 Teknik Tersedia (dari 7 Domain Riset: Film, Binge Psychology, Viral Content, TED Talks, Long-Form Journalism, Podcast Serial, Documentary):

**TEKNIK UNIVERSAL (wajib untuk semua seri 5+ part):**

1. **Zeigarnik Open Loop**: Setiap part berakhir dengan SATU pertanyaan yang menggantung (open loop). Bukan statement, bukan summary.
2. **Spielberg Compounding Tension**: 3 tease sebelum klimaks (relatable -> data -> pertanyaan -> reveal)
3. **Pixar Plant Early, Pay Off Late**: Setiap part menanam seed yang dipanen di part berikutnya atau beberapa part kemudian
4. **Gilligan Opening Promise**: Pembuka dengan promise ("ada satu hal yang belum kita selesaikan..."), bukan recap
5. **Wolfe Scene-by-Scene + Status Details**: Buka dengan scene spesifik, bukan generalisasi. Detail kecil relatable.
6. **Documentary Show Don't Tell**: Data dan scene, bukan "kami mengatakan". Pembaca menyimpulkan sendiri.
7. **Podcast Engine Question**: Satu pertanyaan yang drive seluruh seri dan tidak bisa dijawab dalam satu part

**TEKNIK ADAPTIVE (pilih sesuai karakter seri):**

8. **Parasite Midpoint Genre Shift**: Midpoint = reversal total. COCOK untuk seri provokatif/investigatif. TIDAK COCOK untuk seri panduan/edukasi.
9. **Black Mirror Recontextualization Twist**: Part terakhir membuat reinterpretasi semua part sebelumnya. COCOK untuk seri kontra-narasi. Alternatif untuk seri edukasi: "Synthesis" (gabungkan semua bagian jadi satu pemahaman utuh).
10. **Duarte "What Is" vs "What Could Be"**: Toggle antara realitas dan kemungkinan. COCOK untuk semua seri, tapi "what could be" berbeda per seri (provokatif = lebih gelap/jujur, panduan = lebih baik/mungkin, edukasi = lebih jelas/memahami).
11. **Berger-Milkman Emotional Targeting**: Pilih emotional arc sesuai goal seri. Hindari sadness (low-arousal) dan anger (tidak viral) untuk semua seri.
12. **Hitchcock Dramatic Irony**: Pembaca tahu sesuatu yang tidak mereka sadari. COCOK untuk seri kontra-narasi/investigatif. TIDAK COCOK untuk seri panduan praktis.

### Adaptive Elements (sesuaikan per seri):

**Emotional Arc (pilih berdasarkan goal seri):**

| Goal Seri | Emotional Arc | Primary Emotion per Act |
|-----------|---------------|------------------------|
| Provoke (buka mata) | Anxiety -> Surprise -> Awe | Act 1: Anxiety, Act 2: Surprise, Act 3: Awe |
| Educate (edukasi bertahap) | Curiosity -> Insight -> Confidence | Act 1: Curiosity, Act 2: Insight, Act 3: Confidence |
| Convert (panduan praktis) | Frustration -> Clarity -> Empowerment | Act 1: Frustration, Act 2: Clarity, Act 3: Empowerment |
| Inspire (motivasi) | Empathy -> Recognition -> Hope | Act 1: Empathy, Act 2: Recognition, Act 3: Hope |

**POV Shift (pilih berdasarkan karakter seri):**

| Karakter Seri | POV Act 1 | POV Act 2 | POV Act 3 |
|---------------|-----------|-----------|-----------|
| Kontra-narasi (investigasi) | "Kamu" (second person) | "Sistem" (machine POV) | "Mereka" (architects POV) |
| Edukasi (pembelajaran) | "Kamu" (second person) | "Kita" (collective learning) | "Kamu" (second person, empowered) |
| Panduan (praktis) | "Kamu" (second person) | "Kamu" (second person, guided) | "Kamu" (second person, independent) |
| Refleksi (personal) | "Aku/Kami" (first person) | "Kamu" (second person) | "Kita" (collective) |

**Ending Type (pilih berdasarkan goal seri):**

| Goal Seri | Ending Type | Contoh |
|-----------|-------------|--------|
| Provoke | Recontextualization Twist | Part terakhir reinterpretasi semua part sebelumnya |
| Educate | Synthesis | Part terakhir gabungkan semua bagian jadi satu pemahaman utuh |
| Convert | Call to Action | Part terakhir beri langkah konkret yang bisa dilakukan sekarang |
| Inspire | New Bliss | Part terakhir gambarkan dunia dengan perubahan yang diadopsi |

**Act Structure (pilih berdasarkan kompleksitas seri):**

| Jumlah Part | Struktur | Pembagian |
|-------------|----------|-----------|
| 3-4 part | 3 Act sederhana | Act 1 (1 part), Act 2 (1-2 part), Act 3 (1 part) |
| 5-8 part | 3 Act dengan midpoint | Act 1 (2-3 part), Act 2 (2-3 part, midpoint di tengah), Act 3 (1-2 part) |
| 9-12 part | 3 Act dengan midpoint + twist | Act 1 (3-4 part), Act 2 (3-4 part, midpoint reversal), Act 3 (3-4 part, twist/synthesis di akhir) |
| 13+ part | 4-5 Act atau non-linear | Sesuaikan dengan kompleksitas tema |

### Setiap part wajib punya (untuk semua seri 5+ part):
- Opening hook (Gilligan promise, bukan recap)
- 3 tease sebelum klimaks (Spielberg)
- Klimaks/revelation (mengubah cara pandang)
- Cliffhanger = 1 pertanyaan open loop (Zeigarnik)
- Seed planted untuk part berikutnya (Pixar)
- "What is" vs "What could be" toggle (Duarte, dengan tone sesuai goal seri)

### Template Output Storytelling Framework (isi saat planning):

```
Engine question: [1 pertanyaan yang drive seluruh seri]
Goal seri: [provoke/educate/convert/inspire]
Emotional arc: [pilih dari tabel di atas]
POV shift: [pilih dari tabel di atas]
Ending type: [recontextualization/synthesis/call-to-action/new-bliss]
Act structure: [3 act sederhana / 3 act + midpoint / 3 act + midpoint + twist / 4-5 act]
Midpoint (jika ada): [jenis reversal/shift di part tengah]
Climax type per part: [revelation/insight/breakthrough/synthesis]
```

## Seri Idea Quality Score (0-15)

Score ide seri sebelum lanjut ke 02-strategy. Target: minimal 11.

| Factor | Weight | 0 (fail) | 1 (ok) | 2 (strong) |
|--------|--------|----------|--------|------------|
| **TAM angle** | 2 | Generic, bisa media mana saja | Ada angle tapi tipis | Kontra-narasi atau angle unik |
| **Seri viability** | 2 | Topik tidak butuh seri | Bisa seri tapi forced | Natural multi-part |
| **Audience clarity** | 1 | Vague | 3 aspek terisi | 5 aspek terisi |
| **Search intent** | 1 | Tidak dianalisis | Dianalisis tapi tidak match format | Match format seri |
| **Cluster awareness** | 1 | Tidak cek existing | Cek tapi no action | Cek + positioning jelas |
| **Storytelling potential** | 2 | Flat, no arc | Ada arc tapi lemah | Strong arc (engine question + emotional arc) |
| **Data availability** | 1 | Tidak ada data | Min 2 per part | 3+ per part |
| **Goal clarity** | 1 | Vague | Clear tapi tidak measurable | Clear + measurable |
| **Part estimate** | 1 | Terlalu sedikit/banyak | OK | Optimal untuk topik |
| **Keyword potential** | 1 | Tidak dicek | Dicek tapi thin | 3-8 keyword per part |

Jika score < 11: ide perlu diperbaiki atau pilih ide lain.

## TAM Angle Verification Protocol

2 pertanyaan wajib + 2 pertanyaan tambahan untuk seri:

| Pertanyaan | Pass criteria |
|------------|---------------|
| "Apakah ada media lain yang akan menulis seri ini dengan cara yang sama?" | Tidak ada yang pakai angle sama |
| "Kalau saya hapus nama TAM, apakah pembaca tahu ini tulisan TAM?" | Tetap TAM (tone, angle, data) |
| "Apakah angle ini cukup kuat untuk N part?" | Angle tidak menipis di part 3+ |
| "Apakah angle ini melawan narasi populer?" | Ya (TAM = kontra-narasi) atau "ya, tapi dengan data yang tidak dibahas orang lain" |

Jika 2 pertanyaan pertama fail: rewrite angle. Jika pertanyaan 3-4 fail: pertimbangkan artikel tunggal.

## Reader Empathy Map

Sebelum lanjut ke strategy, definisikan empathy map untuk target audience seri:

| Dimension | Pertanyaan | Output |
|-----------|------------|--------|
| **Thinks** | Apa yang reader pikirkan tentang topik ini? | "Karier itu tentang kerja keras" |
| **Feels** | Apa emosi reader tentang topik ini? | Cemas, tertekan, merasa tertinggal |
| **Says** | Apa yang reader katakan ke teman? | "Gue mau resign tapi takut" |
| **Does** | Apa yang reader lakukan sekarang? | Scroll LinkedIn, compare diri dengan teman |
| **Pains** | Apa frustrasi terbesar reader? | Tidak tahu langkah selanjutnya |
| **Gains** | Apa yang reader harapkan setelah baca seri? | Clarity, arah, keberanian bertindak |

Empathy map ini dipakai di semua step berikutnya untuk verifikasi konten tetap reader-centric.

## Series Viability Check

| Check | Pertanyaan | Pass criteria |
|-------|------------|---------------|
| **Depth** | Apakah topik punya cukup depth untuk N part? | Setiap part punya min 1.000 kata potensi konten |
| **Progression** | Apakah ada alur yang natural antar part? | Part 1 -> Part N punya progression yang jelas |
| **Standalone** | Apakah setiap part bisa berdiri sendiri? | Setiap part punya value bahkan tanpa baca part lain |
| **Data sufficiency** | Apakah ada cukup data untuk semua part? | Min 2 data points per part |
| **Angle sustainability** | Apakah angle tidak menipis di part tengah? | Angle berkembang, tidak repetisi |
| **Reader commitment** | Apakah reader akan commit baca semua part? | Cliffhanger + progression yang menarik |

Jika > 2 check fail: pertimbangkan artikel tunggal, bukan seri.

## Checklist

- [ ] Tema utama seri ditentukan
- [ ] Seri vs artikel tunggal decision dibuat
- [ ] Series Viability Check: min 4 dari 6 pass
- [ ] Target audience jelas (min 3 dari 5 aspek)
- [ ] Reader Empathy Map diisi (6 dimension)
- [ ] Search intent dianalisis
- [ ] Goal seri didefinisikan
- [ ] TAM Angle Verification: 4 pertanyaan pass
- [ ] Angle test lolos
- [ ] POV tag dipilih
- [ ] Category dipilih
- [ ] Content cluster dicek (artikel/seri existing di kategori sama)
- [ ] Estimasi jumlah part ditentukan
- [ ] Title seri punchy berdasar 20 prinsip riset (simplicity, negativity, contrast, curiosity gap, concreteness, brevity, active verb, 2nd person, rhythm, emotional arousal, loss framing, digits, odd numbers, forward referencing, unresolved emotion, avoid fear, 1st person singular, avoid clickbait, avoid superlatives, alliteration)
- [ ] Title seri max 10 kata (ideal 5-8), kata umum > formal, ada kontras/surprise
- [ ] Series Hook formula dipilih untuk og_headline + series promise opening (bukan untuk title)
- [ ] Template output ide seri diisi
- [ ] (Jika 5+ part) Engine question didefinisikan
- [ ] (Jika 5+ part) Emotional arc dipilih (sesuai goal seri)
- [ ] (Jika 5+ part) POV shift per act dipilih (sesuai karakter seri)
- [ ] (Jika 5+ part) Ending type dipilih (sesuai goal seri)
- [ ] (Jika 5+ part) Act structure ditentukan (sesuai jumlah part)
- [ ] (Jika 5+ part) Seed planting & payoff map dibuat
- [ ] (Jika 5+ part) Klimaks & cliffhanger per part didefinisikan
- [ ] (Jika 5+ part) Template output storytelling framework diisi
- [ ] Seri Idea Quality Score: min 11 (dari 15)

## Next

Lanjut ke `/seri-02-strategy`
