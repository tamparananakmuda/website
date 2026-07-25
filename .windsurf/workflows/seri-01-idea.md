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

## Next

Lanjut ke `/seri-02-strategy`
