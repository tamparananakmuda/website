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
grep -rl "category:.*\"KATEGORI\"" content/articles/*.md 2>/dev/null \
  | while read f; do echo "$(basename $f .md)"; done

# Cek artikel dengan keyword serupa
grep -rl "KEYWORD" content/articles/*.md 2>/dev/null \
  | while read f; do echo "$(basename $f .md)"; done

# Cek seri existing
grep -rl "series:" content/articles/*.md 2>/dev/null \
  | while read f; do echo "$(basename $f .md)"; done
```

Pertanyaan cluster:
- Apakah sudah ada seri di kategori/keyword yang sama?
- Jika ya: seri baru ini melengkapi, melawan, atau update dari seri lama?
- Jika belum: ini seri pertama di cluster, plan untuk buat artikel pendukung

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
Working title seri: [judul seri sementara]
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

## Checklist

- [ ] Tema utama seri ditentukan
- [ ] Seri vs artikel tunggal decision dibuat
- [ ] Target audience jelas (min 3 dari 5 aspek)
- [ ] Search intent dianalisis
- [ ] Goal seri didefinisikan
- [ ] Angle test lolos
- [ ] POV tag dipilih
- [ ] Category dipilih
- [ ] Content cluster dicek (artikel/seri existing di kategori sama)
- [ ] Estimasi jumlah part ditentukan
- [ ] Template output ide seri diisi
- [ ] (Jika 5+ part) Engine question didefinisikan
- [ ] (Jika 5+ part) Emotional arc dipilih (sesuai goal seri)
- [ ] (Jika 5+ part) POV shift per act dipilih (sesuai karakter seri)
- [ ] (Jika 5+ part) Ending type dipilih (sesuai goal seri)
- [ ] (Jika 5+ part) Act structure ditentukan (sesuai jumlah part)
- [ ] (Jika 5+ part) Seed planting & payoff map dibuat
- [ ] (Jika 5+ part) Klimaks & cliffhanger per part didefinisikan
- [ ] (Jika 5+ part) Template output storytelling framework diisi

## Next

Lanjut ke `/seri-02-strategy`
