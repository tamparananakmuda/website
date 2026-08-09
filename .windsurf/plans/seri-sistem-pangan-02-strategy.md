# Seri Sistem Pangan Indonesia - Step 02 Strategy

## Meta
- Series: Makanan Murah, Tubuh Mahal
- Slug: sistem-pangan-indonesia
- Series ID: c9d0e1f2-a3b4-5678-cdef-901234567890
- Created: 2026-08-09
- Status: Strategy complete, ready for step 03-research

## Template Output Strategy

```
Alur seri: Thematic (setiap part bahas 1 tema dalam topik besar "sistem pangan")
Jumlah part: 7
Series slug: sistem-pangan-indonesia
Series title: Makanan Murah, Tubuh Mahal
Series description: Makanan sehat itu mewah bukan karena alam, tapi karena sistem yang membuat junk food murah, mudah didapat, dan adiktif. 7 part membongkar kenapa 47% yang kamu makan bukan makanan, kenapa 65% bahan pangan diimpor, dan kenapa industri $101 miliar untung dari kamu sakit.

Part roadmap:
- Part 1: Makanan Sehat Itu Mewah - angle: affordability crisis, healthy = 90% gaji harian - keyword: makanan sehat mahal
- Part 2: 47% Yang Kamu Makan Bukan Makanan - angle: ultra-processed food dominance - keyword: ultra-processed food indonesia
- Part 3: Negara yang Impor Makanannya - angle: import dependency 65% - keyword: impor pangan indonesia
- Part 4: Sawah Jadi Mal, Beras Jadi Impor - angle: alih fungsi lahan 554k ha - keyword: alih fungsi lahan sawah
- Part 5: Food Delivery Trap - angle: $6.4B GMV, kematian memasak - keyword: food delivery indonesia
- Part 6: $101 Miliar dari Kamu Sakit - angle: industri vs hidden costs - keyword: industri pangan indonesia
- Part 7: Sistem yang Bikin Sakit Itu Desain, Bukan Gagal - angle: synthesis + twist - keyword: sistem pangan indonesia

Rilis strategy:
- 1 part/hari, 08:00 WIB (01:00 UTC)
- Estimasi tanggal rilis part 1: Jan 5, 2027 (setelah Infrastruktur Kesepian Dec 1-4, 2026 dan Industri Penderitaan Nov 1-7, 2026)
- Gap: 1 hari antar part
- All scheduled, cron auto-publish
```

## Alur Seri: Thematic

Dipilih **thematic** karena:
- Setiap part bahas 1 tema berbeda dalam topik besar "sistem pangan Indonesia"
- Tema-tema tidak kronologis (tidak ada timeline sejarah)
- Tema-tema tidak problem-solution (tidak ada solusi per part, ini investigasi)
- Tema-tema tidak progressive complexity (tidak butuh pemahaman bertahap, setiap part standalone)
- Setiap tema layak standalone dengan angle sendiri

## Part Dependency Map

| Part | Dependency | Bisa baca standalone? | Recap strategy |
|------|------------|----------------------|----------------|
| P1 | Tidak ada (entry point) | Ya | Tidak perlu recap |
| P2 | P1 (konteks: makanan sehat mahal) | Ya | 1 kalimat: "Bagian sebelumnya: makanan sehat butuh 90% gaji harianmu." |
| P3 | P2 (konteks: UPF dominan) | Ya | 1 kalimat: "Bagian sebelumnya: 47% makanan kemasan yang kamu beli bukan makanan." |
| P4 | P3 (konteks: impor pangan) | Ya | 1 kalimat: "Bagian sebelumnya: 65% bahan pangan olahan Indonesia diimpor." |
| P5 | P4 (konteks: lahan hilang) | Ya | 1 kalimat: "Bagian sebelumnya: 554 ribu hektar sawah hilang jadi mal dan perumahan." |
| P6 | P5 (konteks: food delivery) | Ya | 1 kalimat: "Bagian sebelumnya: food delivery Indonesia $6.4 miliar, kamu tidak masak lagi." |
| P7 | P6 (konteks: industri profit) | Ya | 1 kalimat: "Bagian sebelumnya: industri pangan $101 miliar untung dari kamu sakit." |

**Aturan:**
- Part 1 selalu standalone (entry point seri, hook pembaca)
- Part 2-7 bisa berdiri sendiri dengan recap 1 kalimat di awal
- Setiap part WAJIB punya teaser ke part berikutnya di akhir

## Naming Convention Slug

```
sistem-pangan-indonesia-part-{n}-{article-slug}
```

Contoh:
- `sistem-pangan-indonesia-part-1-makanan-sehat-mewah`
- `sistem-pangan-indonesia-part-2-47-persen-bukan-makanan`
- `sistem-pangan-indonesia-part-3-negara-impor-makanan`
- `sistem-pangan-indonesia-part-4-sawah-jadi-mal`
- `sistem-pangan-indonesia-part-5-food-delivery-trap`
- `sistem-pangan-indonesia-part-6-101-miliar-dari-sakit`
- `sistem-pangan-indonesia-part-7-desain-bukan-gagal`

## Series Hook Formula Strategy

### Series Hook Formula #28 (Silent Epidemic)

Template: `Tidak Ada yang Bicara tentang [X]. Tapi [Data] Menunjukkan [Y].`

**Implementasi:**
- **og_headline seri**: "Tidak ada yang bilang makanan murah bikin kamu sakit" (48 char)
- **Series description (config.ts)**: Mengandung elemen silent epidemic: "47% yang kamu makan bukan makanan", "industri $101 miliar untung dari kamu sakit"
- **Part 1 opening**: Mulai dengan silent epidemic hook: "Tidak ada yang bilang makanan murah bikin kamu sakit. Tapi 1 dari 3 orang dewasa Indonesia obesitas. Dan makanan sehat butuh 90% gaji harianmu."
- **Konsisten dengan alur thematic**: Setiap part reveal 1 aspek silent epidemic yang tidak dibicarakan

### Series Foreshadow Formula #15 (Connection Tease)

Template: `[X] dan [Y] terlihat tidak related. Tapi keduanya punya akar yang sama.`

**Implementasi:**
- **Series promise (Part 1 closing)**: "GoFood, Indomaret, obesitas, stunting. Terlihat tidak related. Tapi semua punya akar yang sama. Di bagian berikutnya, kamu akan mulai melihat polanya." (93 char + bridge)
- **Tease engine question tanpa spoiler**: Tidak reveal jawaban (jawaban di P7: sistem didesain untuk profit, bukan kesehatan)
- **Konsisten dengan alur thematic**: Setiap part tambah 1 piece puzzle, P7 reveal gambar lengkap

## Episode Hook/Foreshadow Strategy (per part)

### Hook Progression

| Part | Hook Type | Strategy |
|------|-----------|----------|
| P1 | Broad hook (data shock) | "Makanan sehat butuh 90% gaji harianmu" - relatable, personal |
| P2 | Pattern hook (counter-narrative) | "47% yang kamu makan bukan makanan" - challenge assumption |
| P3 | Data hook (scale shock) | "65% bahan pangan diimpor, 100% gandum" - scale revelation |
| P4 | Twist hook (MIDPOINT reversal) | "Kita negara agraris. Tapi sawah hilang jadi mal." - kontras narasi |
| P5 | Observation hook (relatable) | "Kamu GoFood setiap hari. Kenapa kamu tidak masak lagi?" - personal |
| P6 | Scale hook (money shock) | "$101 miliar industri. $210-622 miliar hidden costs." - money scale |
| P7 | Synthesis hook (recontextualization) | "Semua yang kamu baca di 6 part sebelumnya. Bukan kebetulan." - twist |

### Foreshadow Progression

| Part | Foreshadow Type | Tease |
|------|----------------|-------|
| P1 | Connection tease | "GoFood, Indomaret, obesitas. Terlihat tidak related." |
| P2 | Pattern tease | "Kalau 47% bukan makanan, kenapa gampang banget didapat?" |
| P3 | Setup tease | "Kalau 65% diimpor, berapa sawah kita yang tersisa?" |
| P4 | Reversal tease (MIDPOINT) | "Sawah hilang. Tapi yang ganti bukan sawah baru. Yang ganti: mal dan perumahan." |
| P5 | Scale tease | "Food delivery $6.4 miliar. Tapi yang untung bukan kamu." |
| P6 | Convergence tease | "Industri $101 miliar. Hidden costs $210-622 miliar. Siapa yang bayar?" |
| P7 | Final reveal | "Sistem yang bikin kamu sakit bukan gagal. Itu desain." |

### Next Tease/Bridge Strategy (antar part)

| Bridge | From -> To | Tease |
|--------|-----------|-------|
| P1 -> P2 | "Makanan sehat mahal. Tapi kenapa yang murah begitu murah? 47% jawabannya di bagian berikutnya." |
| P2 -> P3 | "47% makanan kemasan bukan makanan. Tapi dari mana semua ini datang? 65% diimpor. Lanjut ke bagian 3." |
| P3 -> P4 | "65% bahan pangan diimpor. Tapi kenapa kita tidak bisa produksi sendiri? Jawabannya: sawah kita hilang. Bagian 4." |
| P4 -> P5 | "Sawah jadi mal. Makan jadi beli. Tapi beli dari mana? Food delivery $6.4 miliar. Bagian 5." |
| P5 -> P6 | "Food delivery $6.4 miliar. Tapi itu cuma distribusi. Industri di belakangnya: $101 miliar. Bagian 6." |
| P6 -> P7 | "Industri $101 miliar untung. Hidden costs $210-622 miliar. Kamu bayar. Tapi kenapa sistem begini? Bagian terakhir." |

## Thumbnail & Meta Strategy (per part)

| Part | og_headline (max 50 char) | excerpt (max 160 char) | meta desc (max 160 char) |
|------|--------------------------|----------------------|------------------------|
| P1 | Makan sehat butuh 90% gaji harianmu (38) | Makanan sehat di Indonesia butuh 90% gaji harian. Bukan pilihan, tapi sistem yang bikin junk food murah. (104) | Makanan sehat di Indonesia butuh 90% gaji harian. Bukan pilihan, tapi sistem yang bikin junk food murah dan gampang didapat. (116) |
| P2 | 47% yang kamu makan bukan makanan (37) | 47% makanan kemasan di Indonesia adalah ultra-processed. 65% konsumsi instant noodles. Ini bukan makanan. (100) | 47% makanan kemasan Indonesia adalah ultra-processed food. 1 dari 3 dewasa obesitas. Kenapa yang murah bukan makanan? (108) |
| P3 | 65% bahan makanan Indonesia diimpor (37) | Indonesia impor 100% gandum, 80% susu, 70% kedelai. Kita ngga bisa buat makanan sendiri tanpa orang lain. (103) | Indonesia impor 65% bahan pangan olahan: 100% gandum, 80% susu, 70% kedelai. Negara agraris yang impor makanannya. (110) |
| P4 | 554 ribu hektar sawah hilang jadi mal (38) | 554.615 hektar sawah hilang (2019-2025). 144 ribu hektar lahan dilindungi yang tetap dibangun. (89) | 554.615 hektar sawah Indonesia hilang jadi mal dan perumahan (2019-2025). 144 ribu hektar lahan dilindungi tetap dibangun. (117) |
| P5 | Food delivery $6.4 miliar, kamu ngga masak (41) | GoFood, GrabFood, ShopeeFood: $6.4 miliar GMV Indonesia. Kamu bayar mahal untuk tidak masak. (86) | Food delivery Indonesia $6.4 miliar GMV (2025). Grab 46%, GoFood 31%. Kamu bayar mahal untuk tidak masak lagi. (102) |
| P6 | Industri $101 miliar untung dari kamu sakit (43) | Industri pangan Indonesia $101 miliar. Hidden costs $210-622 miliar. Siapa yang bayar? Kamu. (84) | Industri pangan Indonesia $101 miliar. Hidden costs sistem pangan $210-622 miliar (28-45% GDP). Kamu bayar dengan tubuh. (115) |
| P7 | Sistem pangan bukan gagal, itu desain (38) | 7 part. 1 kesimpulan: sistem pangan Indonesia tidak gagal. Itu didesain untuk profit, bukan kesehatan. (97) | Sistem pangan Indonesia bukan gagal. Itu desain: UPF murah, lahan hilang, impor tinggi, industri untung, kamu sakit. (110) |

## Series Arc Integrity Check

| Check | Status | Notes |
|-------|--------|-------|
| Arc completeness | PASS | Act 1 (P1-P2 anxiety), Act 2 (P3-P5 surprise, midpoint P4), Act 3 (P6-P7 awe) |
| Part balance | PASS | Setiap part 1000-2500 words potential, tidak ada part terlalu padat/tipis |
| Progression logic | PASS | Personal -> product -> nation -> land -> platform -> industry -> system |
| Climax placement | PASS | Klimaks terbesar (recontextualization twist) di P7 (Act 3) |
| Engine question | PASS | "Kenapa makan yang bikin sakit justru yang paling murah?" drive semua 7 part, tidak bisa dijawab 1 part |
| Emotional arc | PASS | Anxiety (P1-P2) -> Surprise (P3-P5) -> Awe (P6-P7) |

**6/6 checks PASS**

## Cross-Part Dependency Audit

| Check | Status | Notes |
|-------|--------|-------|
| No circular dependency | PASS | P3 tidak butuh P5, P5 tidak butuh P3. Linear progression. |
| Recap sufficiency | PASS | 1 kalimat recap cukup untuk standalone (lihat Part Dependency Map) |
| Teaser accuracy | PASS | Setiap teaser sesuai dengan konten part berikutnya (lihat Next Tease strategy) |
| No orphan part | PASS | Setiap part terhubung ke min 1 part lain via internal links + recap + teaser |
| Entry point clarity | PASS | P1 jelas sebagai entry point: hook terkuat (90% gaji), paling relatable (makanan sehat mahal) |

**5/5 checks PASS**

## Release Strategy Verification

| Check | Status | Notes |
|-------|--------|-------|
| Cadence | PASS | 1 part/hari, 08:00 WIB, konsisten |
| Part 1 first | PASS | P1 publish sebelum P2-P7 |
| Gap tolerance | PASS | 1 hari antar part (max 3 hari) |
| Binge option | PASS | Semua part scheduled, reader bisa binge setelah P7 publish |
| SEO compounding | PASS | Internal links antar part + cluster effect (seri pertama di cluster pangan) |

**5/5 checks PASS**

## Series Strategy Quality Score

| Factor | Weight | Score | Notes |
|--------|--------|-------|-------|
| Alur choice | 2 | 2 | Thematic match perfectly: 7 tema berbeda dalam topik sistem pangan |
| Part count | 1 | 1 | 7 part optimal: tidak terlalu sedikit (4), tidak terlalu banyak (10+) |
| Dependency map | 1 | 1 | Clear, no circular, recap 1 kalimat per part |
| Arc integrity | 2 | 2 | 6/6 checks pass |
| Release strategy | 1 | 1 | Clear + consistent (1/day, 08:00 WIB, all scheduled) |
| Config registration | 1 | 1 | Terdaftar + validated via command |
| Naming convention | 1 | 1 | Semua part mengikuti `{series-slug}-part-{n}-{article-slug}` |
| Standalone potential | 1 | 1 | Semua part standalone dengan recap 1 kalimat |
| SEO compounding | 1 | 1 | Internal links + cluster + sitemap (seri pertama di cluster) |
| Binge-read design | 1 | 1 | Strong binge-read path (cliffhanger per part + engine question) |
| **TOTAL** | **12** | **12** | (target: min 9) PASS |

## Checklist

- [x] Alur pembelajaran/storytelling dipilih: Thematic
- [x] Jumlah part ditentukan: 7
- [x] Seri didefinisikan di `content/config.ts`
- [x] Command validasi config: OK
- [x] Naming convention slug dipahami: `sistem-pangan-indonesia-part-{n}-{article-slug}`
- [x] Part dependency map dibuat: 7 parts, linear, no circular
- [x] Series Hook formula #28 strategy dirinci: Silent Epidemic, konsisten dengan thematic
- [x] Series Foreshadow formula #15 strategy dirinci: Connection Tease, tease engine question
- [x] Episode Hook/Foreshadow strategy per part direncanakan: broad -> twist -> synthesis progression
- [x] Next Tease/Bridge strategy antar part direncanakan: 6 bridges mapped
- [x] Thumbnail & meta strategy per part direncanakan: og_headline + excerpt + meta desc per part
- [x] Template output strategy diisi
- [x] Rilis strategy ditentukan: 1 part/hari, 08:00 WIB, Jan 2027
- [x] Series Arc Integrity Check: 6/6 pass
- [x] Cross-Part Dependency Audit: 5/5 pass
- [x] Release Strategy Verification: 5/5 pass
- [x] Series Strategy Quality Score: 12/12 (target: min 9) PASS

## Next

Lanjut ke `/seri-03-research`
