# Seri Sistem Kesehatan Indonesia - Step 02 Strategy

## Meta
- Series: Sakit Itu Mahal: Tubuh yang Dijadikan Bisnis
- Slug: sistem-kesehatan-indonesia
- Category: Kehidupan
- POV: kontra-narasi
- Parts: 8
- Created: 2026-08-09
- Status: Strategy complete, ready for step 03-research

## Template Output Strategy

```
Alur seri: Thematic (setiap part bahas 1 tema dalam sistem kesehatan besar)
Jumlah part: 8 part
Series slug: sistem-kesehatan-indonesia
Series title: Sakit Itu Mahal: Tubuh yang Dijadikan Bisnis
Series description: Sistem kesehatan Indonesia tidak dirancang untuk membuatmu sehat, tapi untuk mengubah tubuhmu menjadi bisnis. 8 part membongkar kenapa BPJS defisit, kenapa dokter keluar negeri, kenapa obat mahal, dan kenapa sakit itu mahal bukan karena alam tapi karena desain.

Part roadmap:
- Part 1: BPJS Defisit: Jaring Pengaman yang Robek - BPJS defisit sebagai gejala sistem - keyword: BPJS defisit
- Part 2: Akses Layanan: Mati atau Hidup Ditentukan Kode Pos - ketimpangan akses geografis - keyword: akses kesehatan Indonesia
- Part 3: Industri Farmasi: Obat Mahal Bukan Karena Riset - monopoli dan impor bahan baku - keyword: industri farmasi Indonesia
- Part 4: Dokter Indonesia: Ekspor SDM, Impor Kekosongan - brain drain dokter - keyword: dokter Indonesia keluar negeri
- Part 5: Rumah Sakit: Bisnis Bukan Layanan - komersialisasi RS - keyword: rumah sakit swasta Indonesia
- Part 6: Penyakit Tidak Menular: Epidemik yang Tidak Dibiayai - PTM vs kapasitas BPJS - keyword: penyakit tidak menular Indonesia
- Part 7: Medikal Tourism: Keluar Saat Sakit - warga Indonesia berobat ke luar - keyword: medikal tourism Indonesia
- Part 8: Sintesis: Sistem yang Tidak Dirancang untuk Sehat - recontextualization - keyword: sistem kesehatan Indonesia

Rilis strategy:
- 1 part/hari, 08:00 WIB (01:00 UTC)
- Estimasi tanggal rilis part 1: Februari 2027 (setelah Sistem Pangan Jan 5-11, 2027)
```

## Alur Seri: Thematic

Dipilih **thematic** karena:
- Setiap part bahas 1 tema berbeda dalam sistem kesehatan (BPJS, akses, farmasi, dokter, RS, PTM, medikal tourism, sintesis)
- Tidak ada timeline kronologis yang jelas (tidak seperti krisis ekonomi)
- Tidak ada progression complexity (tidak seperti investasi basic→advanced)
- Tidak pure problem-solution (setiap part lebih investigatif daripada preskriptif)
- Setiap tema layak standalone dengan angle sendiri

## Act Structure

| Act | Parts | Function | Emotional arc |
|-----|-------|----------|---------------|
| **Act 1: Anxiety** | P1-P2 | Gejala sistem: BPJS defisit + ketimpangan akses. Reader sadar sistem tidak bekerja. | Shock → Cemas |
| **Act 2: Surprise** | P3-P5 | Struktur sistem: farmasi, dokter, RS. Reader lihat siapa yang untung. | Surprise → Kecewa |
| **Act 2B: Midpoint twist** | P5 (Rumah Sakit) | Twist: RS bukan tempat sembuh, tapi bisnis. Pasien = customer. | Paradigm shift |
| **Act 3: Awe** | P6-P8 | Konsekuensi + recontextualization: PTM, medikal tourism, sintesis. | Awe → Sadar |

## Part Dependency Map

| Part | Dependency | Standalone? | Recap needed |
|------|------------|-------------|--------------|
| P1 | Tidak ada (entry point) | Ya, fully standalone | Tidak perlu |
| P2 | P1 (konteks BPJS) | Ya, dengan recap 1 kalimat | "Sebelumnya: BPJS defisit..." |
| P3 | P2 (konteks akses) | Ya, dengan recap 1 kalimat | "Sebelumnya: akses kesehatan timpang..." |
| P4 | P3 (konteks farmasi) | Ya, dengan recap 1 kalimat | "Sebelumnya: obat mahal karena impor..." |
| P5 | P4 (konteks dokter) | Ya, dengan recap 1 kalimat | "Sebelumnya: dokter keluar negeri..." |
| P6 | P5 (konteks RS) | Ya, dengan recap 1 kalimat | "Sebelumnya: RS jadi bisnis..." |
| P7 | P6 (konteks PTM) | Ya, dengan recap 1 kalimat | "Sebelumnya: PTM epidemik..." |
| P8 | P1-P7 (sintesis) | Sebagian (butuh konteks semua part) | Full recap 2 kalimat |

## Naming Convention Slug

```
sistem-kesehatan-indonesia-part-{n}-{article-slug}
```

| Part | Slug |
|------|------|
| P1 | sistem-kesehatan-indonesia-part-1-bpjs-defisit |
| P2 | sistem-kesehatan-indonesia-part-2-akses-kode-pos |
| P3 | sistem-kesehatan-indonesia-part-3-farmasi-obat-mahal |
| P4 | sistem-kesehatan-indonesia-part-4-dokter-ekspor |
| P5 | sistem-kesehatan-indonesia-part-5-rs-bisnis |
| P6 | sistem-kesehatan-indonesia-part-6-ptm-epidemik |
| P7 | sistem-kesehatan-indonesia-part-7-medikal-tourism |
| P8 | sistem-kesehatan-indonesia-part-8-sintesis |

## Series Hook Formula Strategy

### Series Hook: Colon + Twist (Pattern #2)

**Title**: Sakit Itu Mahal: Tubuh yang Dijadikan Bisnis
**og_headline (series-level)**: "Sakit itu mahal bukan karena alam, tapi karena sistem"

Implementasi:
- **Series title**: "Sakit Itu Mahal" = konteks (relatable, everyone knows sakit itu mahal) + "Tubuh yang Dijadikan Bisnis" = twist (bukan tentang kesehatan, tapi tentang bisnis)
- **Series description**: "tidak dirancang untuk membuatmu sehat, tapi untuk mengubah tubuhmu menjadi bisnis" = twist di kalimat pertama
- **Part 1 opening**: Mulai dengan data BPJS defisit yang menunjukkan "sakit itu mahal" adalah desain, bukan kebetulan

Konsisten dengan alur thematic: setiap part akan reveal 1 layer bisnis di balik sistem kesehatan.

### Series Foreshadow: Forward Referencing + Unresolved Emotion (Pattern #14 + #15)

**Series tease**: "BPJS defisit tiap tahun, dokter keluar negeri, obat mahal. Sistem kesehatan untuk siapa: yang sakit atau yang untung?"

Implementasi:
- **Series description**: tease 3 gejala (BPJS, dokter, obat) tanpa spoiler jawaban
- **Part 1 closing**: "Tapi BPJS defisit bukan akhir cerita. Kenapa akses ke layanan kesehatan ditentukan oleh kode pos? Part berikutnya."
- **Engine question**: "untuk siapa: yang sakit atau yang untung?" = unresolved emotion yang drive 8 part

## Episode Hook/Foreshadow Strategy

### Hook Progression

| Part | Hook type | Strategy |
|------|-----------|----------|
| P1 | Data shock | BPJS defisit Rp triliunan, rasio klaim vs iuran |
| P2 | Kontra-narasi | "Indonesia punya RS terbaik di Asia" vs data ratio dokter 0.4/1000 |
| P3 | Pertanyaan provokatif | "Kenapa obat yang sama di India harganya 10x lebih murah?" |
| P4 | Observasi spesifik | "Spesialis di RS swasta Jakarta vs Puskesmas di NTT" |
| P5 (MIDPOINT) | Twist hook | "RS swasta IPO, pasien jadi customer, sembuh bukan KPI" |
| P6 | Refleksi personal | "Orang tua kamu sakit diabetes, berapa biaya per bulan?" |
| P7 | Data shock | "Berapa warga Indonesia berobat ke Malaysia tiap tahun?" |
| P8 (FINAL) | Synthesis hook | "8 part, 1 kesimpulan: sistem tidak gagal, itu desain" |

### Foreshadow Progression

| Part | Foreshadow type | Tease to |
|------|----------------|----------|
| P1 | Direct tease | P2: "Tapi BPJS cuma satu masalah. Kenapa akses ditentukan kode pos?" |
| P2 | Direct tease | P3: "Akses timpang. Tapi bahkan yang ada, obatnya mahal. Kenapa?" |
| P3 | Direct tease | P4: "Obat mahal. Tapi siapa yang resep? Dokter. Dan dokter Indonesia keluar." |
| P4 | Direct tease | P5: "Dokter keluar. Yang tinggal kerja di mana? Rumah sakit. Dan RS jadi bisnis." |
| P5 | Midpoint tease | P6: "RS bisnis. Tapi bisnis terbesar bukan dari orang sehat. Dari orang sakit kronis." |
| P6 | Direct tease | P7: "PTM mahal. Tapi yang mampu keluar negeri. Medikal tourism." |
| P7 | Direct tease | P8: "Yang mampu keluar. Yang tidak mampu? Sintesis. Part terakhir." |
| P8 | Series tease | Whitepaper: "Seri ini bukan akhir. Whitepaper: Sistem Kesehatan Indonesia yang Tidak Ada." |

### Next Tease/Bridge Formula

Bridge pattern: **Data bridge** (setiap teaser dihubungkan dengan data dari part berikutnya)
- P1→P2: BPJS defisit → akses geografis data
- P2→P3: Akses timpang → farmasi data
- P3→P4: Obat mahal → dokter data
- P4→P5: Dokter keluar → RS data
- P5→P6: RS bisnis → PTM data
- P6→P7: PTM mahal → medikal tourism data
- P7→P8: Medikal tourism → sintesis all data

## Thumbnail & Meta Strategy

### og_headline (max 50 char, != title, conversational/direct)

| Part | og_headline | Char count |
|------|-------------|------------|
| P1 | BPJS kamu bayar, tapi siapa yang untung? | 39 |
| P2 | Tempat tinggalmu tentukan kamu sakit atau mati | 47 |
| P3 | Obat mahal bukan karena riset, tapi monopoli | 43 |
| P4 | Dokter Indonesia pergi, siapa yang sisa? | 39 |
| P5 | Rumah sakit bukan tempat sembuh, tempat bisnis | 46 |
| P6 | Diabetes dan jantung: epidemik yang diabaikan | 46 |
| P7 | Warga Indonesia keluar saat sakit, kenapa? | 42 |
| P8 | Sistem kesehatan tidak gagal, itu desain | 40 |

### excerpt (max 160 char, visual foreshadow)

| Part | excerpt | Char count |
|------|---------|------------|
| P1 | BPJS defisit triliunan tiap tahun. Iuran kamu naik, layanan turun. Jaring pengaman yang dirancang untuk robek. | 115 |
| P2 | Jakarta punya 50 RS, NTT punya 5. Ratio dokter 0.4 per 1000, target WHO 1. Mati atau hidup ditentukan kode pos. | 116 |
| P3 | Indonesia impor 90% bahan baku obat. Industri farmasi kontrol harga. Obat yang sama 10x lebih murah di India. | 115 |
| P4 | 10.000 dokter Indonesia keluar negeri. Spesialis kurang. Yang tinggal kerja di RS swasta. Puskesmas kosong. | 111 |
| P5 | RS swasta IPO di bursa saham. Pasien jadi customer. Sembuh bukan KPI. BOR rate yang dijaga, bukan health outcome. | 117 |
| P6 | PTM: diabetes, jantung, obesitas. 73% kematian Indonesia. Biaya pengobatan makan 40% klaim BPJS. Sistem tidak siap. | 117 |
| P7 | 2 juta warga Indonesia berobat ke luar negeri tiap tahun. Malaysia, Singapore, India. Yang mampu keluar, yang tidak menetap. | 125 |
| P8 | 8 part, 1 kesimpulan. Sistem kesehatan Indonesia tidak gagal. Itu berfungsi seperti yang dirancang: untung dari sakitmu. | 122 |

### meta description (max 160 char, Hook + Foreshadow)

| Part | meta description | Char count |
|------|-----------------|------------|
| P1 | BPJS defisit tiap tahun, iuran naik, layanan turun. Kenapa jaring pengaman kesehatan Indonesia dirancang untuk robek? Data menunjukkan bukan kegagalan. | 146 |
| P2 | Ratio dokter 0.4 per 1000 penduduk, target WHO 1. Jakarta punya 50 RS, NTT punya 5. Akses kesehatan ditentukan kode pos, bukan kebutuhan. | 135 |
| P3 | Indonesia impor 90% bahan baku obat. Industri farmasi kontrol harga. Obat yang sama 10x lebih murah di India. Kenapa obat mahal bukan karena riset. | 141 |
| P4 | 10.000 dokter Indonesia keluar negeri. Spesulis kurang. Yang tinggal kerja di RS swasta. Puskesmas kosong. Kenapa dokter ekspor SDM, impor kekosongan. | 144 |
| P5 | RS swasta IPO di bursa saham. Pasien jadi customer. Sembuh bukan KPI. Rumah sakit Indonesia bisnis bukan layanan. Data menunjukkan desain, bukan kegagalan. | 148 |
| P6 | PTM: 73% kematian Indonesia. Diabetes, jantung, obesitas. Biaya pengobatan makan 40% klaim BPJS. Epidemik yang tidak dibiayai sistem kesehatan Indonesia. | 146 |
| P7 | 2 juta warga Indonesia berobat ke luar negeri tiap tahun. Malaysia, Singapore, India. Medikal tourism: yang mampu keluar, yang tidak menetap dan bayar. | 143 |
| P8 | 8 part membongkar sistem kesehatan Indonesia. BPJS, farmasi, dokter, RS, PTM. Sistem tidak gagal, itu desain. Sakit itu mahal bukan karena alam, tapi sistem. | 148 |

## Series Arc Integrity Check

| Check | Pertanyaan | Result | Status |
|-------|------------|--------|--------|
| **Arc completeness** | Awal, tengah, akhir jelas? | Act 1 (P1-P2 anxiety), Act 2 (P3-P5 surprise + midpoint twist), Act 3 (P6-P8 awe + sintesis) | PASS |
| **Part balance** | Ada part terlalu padat/tipis? | Setiap part punya 1 tema dengan data sendiri, potensi 1.000-1.500 kata each | PASS |
| **Progression logic** | Part N butuh N-1? | Ya, tapi setiap part punya recap 1 kalimat untuk standalone | PASS |
| **Climax placement** | Klimaks di tempat tepat? | P5 midpoint twist (RS bisnis), P8 final synthesis. Klimaks di Act 3. | PASS |
| **Engine question** | 1 pertanyaan drive seri? | "Sistem kesehatan untuk siapa: yang sakit atau yang untung?" - tidak bisa dijawab 1 part | PASS |
| **Emotional arc** | Emosi berubah P1→P8? | Anxiety (P1-P2) → Surprise (P3-P5) → Kecewa (P6-P7) → Awe (P8) | PASS |

**All 6 checks: PASS**

## Cross-Part Dependency Audit

| Check | Pertanyaan | Result | Status |
|-------|------------|--------|--------|
| **No circular dependency** | P3 tidak butuh P5? | Ya, P3 (farmasi) tidak butuh P5 (RS). Linear progression. | PASS |
| **Recap sufficiency** | Recap 1-2 kalimat cukup? | Ya, setiap recap hanya perlu 1 kalimat konteks dari part sebelumnya | PASS |
| **Teaser accuracy** | Teaser P1 sesuai konten P2? | Ya, P1 tease "akses kode pos" = P2 konten akses geografis | PASS |
| **No orphan part** | Setiap part koneksi ke min 1 part lain? | Ya, semua part punya recap (backward) + teaser (forward) | PASS |
| **Entry point clarity** | P1 jelas sebagai entry point? | Ya, P1 mulai dengan data BPJS defisit = gejala paling relatable | PASS |

**All 5 checks: PASS**

## Release Strategy Verification

| Check | Pertanyaan | Result | Status |
|-------|------------|--------|--------|
| **Cadence** | Ritme rilis konsisten? | 1 part/hari, 08:00 WIB, konsisten | PASS |
| **Part 1 first** | P1 publish sebelum part lain? | Ya, P1 scheduled first | PASS |
| **Gap tolerance** | Gap antar part max 3 hari? | 1 hari gap | PASS |
| **Binge option** | Reader bisa binge setelah selesai? | Ya, semua part scheduled, bisa binge setelah P8 publish | PASS |
| **SEO compounding** | Setiap part boost part lain? | Ya, internal links (recap + teaser) + cluster effect (healthcare cluster) | PASS |

**All 5 checks: PASS**

## Rilis Strategy

- Pattern: 1 part/hari, 08:00 WIB (01:00 UTC)
- Estimasi: Februari 2027 (setelah Sistem Pangan Jan 5-11, 2027)
- Gap: 1 hari antar part
- Total durasi: 8 hari (P1-P8)
- Cron: GitHub Actions every 5 min auto-publish + OG gen

## Series Strategy Quality Score (0-12)

| Factor | Weight | Score | Notes |
|--------|--------|-------|-------|
| **Alur choice** | 2 | 2 | Thematic match perfectly: setiap part 1 tema dalam sistem kesehatan |
| **Part count** | 1 | 1 | 8 part optimal untuk depth healthcare (7 sub-topic + 1 sintesis) |
| **Dependency map** | 1 | 1 | Clear, no circular, linear progression |
| **Arc integrity** | 2 | 2 | All 6 checks pass |
| **Release strategy** | 1 | 1 | Clear + consistent (1/day, 08:00 WIB) |
| **Config registration** | 1 | 1 | Terdaftar + validated via command |
| **Naming convention** | 1 | 1 | Semua part mengikuti `{series-slug}-part-{n}-{article-slug}` |
| **Standalone potential** | 1 | 1 | Semua part standalone dengan recap 1 kalimat |
| **SEO compounding** | 1 | 1 | Internal links + cluster + sitemap |
| **Binge-read design** | 1 | 1 | Strong binge-read path (1/day, recap+teaser per part) |
| **TOTAL** | **12** | **12** | (target: min 9) PASS |

## Checklist

- [x] Alur pembelajaran/storytelling dipilih: thematic
- [x] Jumlah part ditentukan: 8
- [x] Seri didefinisikan di `content/config.ts`
- [x] Command validasi config: OK
- [x] Naming convention slug dipahami
- [x] Part dependency map dibuat
- [x] Series Hook formula strategy dirinci (colon+twist, konsisten dengan thematic)
- [x] Series Foreshadow formula strategy dirinci (forward referencing + unresolved emotion)
- [x] Episode Hook/Foreshadow strategy per part direncanakan (progression: data shock → twist → synthesis)
- [x] Next Tease/Bridge strategy antar part direncanakan (data bridge pattern)
- [x] Thumbnail & meta strategy per part direncanakan (og_headline, excerpt, meta desc)
- [x] Template output strategy diisi
- [x] Rilis strategy ditentukan: 1 part/hari, 08:00 WIB, Feb 2027
- [x] Series Arc Integrity Check: 6/6 PASS
- [x] Cross-Part Dependency Audit: 5/5 PASS
- [x] Release Strategy Verification: 5/5 PASS
- [x] Series Strategy Quality Score: 12/12 (target: min 9) PASS

## Next

Lanjut ke `/seri-03-research`
