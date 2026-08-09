# Series Strategy: Sistem Media Indonesia

**Step:** 02-strategy
**Date:** 2027-03-01
**Status:** DONE

---

## 1. Alur Seri

**Alur: Progressive Complexity**

Seri ini membongkar sistem media Indonesia dari strukturnya (siapa punya) sampai mekanismenya (kenapa bikin marah) sampai sintesisnya (didesain bikin kamu nggak percaya). Setiap part membangun pemahaman dari part sebelumnya:

- **Act 1 (P1-P2): Struktur & Mekanisme** — Siapa punya media? Kenapa bikin marah?
- **Act 2 (P3-P5): Distribusi & Polusi** — Algoritma, hoax, influencer sebagai pengganti
- **Act 3 (P6-P7): Blindspot & Sintesis** — Daerah tanpa suara, sintesis desain

### Kenapa Progressive Complexity?
- Topik butuh pemahaman bertahap: reader harus paham struktur (P1) sebelum paham kenapa mekanisme marah (P2) ada
- Setiap part membangun di atas konsep sebelumnya: kepemilikan → ekonomi klik → algoritma → hoax → influencer → jurnalisme lokal → sintesis
- Nggak bisa kronologis (bukan timeline), nggak bisa problem-solution (bukan solusi per part), nggak bisa thematic murni (ada progression)

---

## 2. Jumlah Part

**7 parts**

| Part | Judul Sementara | Angle | Keyword Utama |
|------|-----------------|-------|---------------|
| 1 | Konsentrasi Kepemilikan: 6 Grup, 90% Berita | Siapa punya media Indonesia | kepemilikan media Indonesia |
| 2 | Ekonomi Klik: Marah = Engagement = Iklan | Kenapa berita bikin marah | ekonomi klik Indonesia |
| 3 | Algoritma sebagai Editor: Platform Bukan Netral | Platform asing kontrol informasi | algoritma media sosial Indonesia |
| 4 | Ekosistem Hoax: Industri yang Untung | Hoax sebagai industri | hoax Indonesia, buzzer |
| 5 | Influencer sebagai Jurnalis: Opini Dikemas Fakta | Pengganti jurnalis tanpa kode etik | influencer jurnalis Indonesia |
| 6 | Kematian Jurnalisme Lokal: Daerah Tanpa Suara | Daerah tanpa peliput | jurnalisme lokal Indonesia |
| 7 | Sintesis: Media Tidak Gagal, Didesain Bikin Kamu Nggak Percaya | Sintesis: desain bikin nggak percaya | sistem media Indonesia |

---

## 3. Series Slug

```
sistem-media-indonesia
```

### Naming Convention Slug (per part)
```
sistem-media-indonesia-part-1-konsentrasi-kepemilikan-6-grup-90-persen-berita
sistem-media-indonesia-part-2-ekonomi-klik-marah-engagement-iklan
sistem-media-indonesia-part-3-algoritma-sebagai-editor-platform-bukan-netral
sistem-media-indonesia-part-4-ekosistem-hoax-industri-yang-untung
sistem-media-indonesia-part-5-influencer-sebagai-jurnalis-opini-dikemas-fakta
sistem-media-indonesia-part-6-kematian-jurnalisme-lokal-daerah-tanpa-suara
sistem-media-indonesia-part-7-sintesis-media-tidak-gagal-didesain-bikin-kamu-nggak-percaya
```

---

## 4. Config Registration

**Status:** ✅ Terdaftar di `content/config.ts` (line 90)
**Validasi:** ✅ `npx tsx` confirm: `OK: sistem-media-indonesia | Kamu Marah, Mereka Untung: Sistem Media Indonesia`

---

## 5. Part Dependency Map

| Part | Dependency | Bisa baca standalone? | Recap strategy |
|------|------------|----------------------|----------------|
| 1 | Tidak ada (entry point) | Ya ✅ | N/A — hook pembuka seri |
| 2 | Part 1 (siapa punya media → kenapa bikin marah) | Ya (dengan recap 1-2 kalimat) | "Sebelumnya: 6 grup kontrol 90% berita Indonesia, cross-ownership dengan politik." |
| 3 | Part 2 (ekonomi klik → algoritma sebagai distributor) | Ya (dengan recap 1-2 kalimat) | "Sebelumnya: media adopsi clickbait karena marah = engagement = iklan." |
| 4 | Part 3 (algoritma → hoax menyebar via algoritma) | Ya (dengan recap 1-2 kalimat) | "Sebelumnya: algoritma platform asing jadi editor utama berita Indonesia." |
| 5 | Part 4 (hoax → influencer sebagai pengganti jurnalis) | Ya (dengan recap 1-2 kalimat) | "Sebelumnya: hoax bukan kesalahan, industri buzzer dan bot akun." |
| 6 | Part 1+5 (kepemilikan + influencer → media lokal mati) | Ya (dengan recap 1-2 kalimat) | "Sebelumnya: influencer-jurnalis tanpa kode etik punya jangkauan lebih besar dari media." |
| 7 | Part 1-6 (sintesis semua) | Ya (dengan recap 1-2 kalimat) | "Sebelumnya: media lokal mati, 70% berita daerah rewrite dari Jakarta." |

### Aturan Dependency
- **No circular dependency** ✅ — P3 nggak butuh P5, P4 nggak butuh P6
- **Part 1 selalu standalone** ✅ — entry point, hook pembaca
- **Part 2-7 standalone dengan recap** ✅ — 1-2 kalimat recap di awal
- **Setiap part punya teaser ke part berikutnya** ✅ — di akhir

---

## 6. Series Hook & Foreshadow Strategy

### Series Hook Formula: #7 "The Uncomfortable Truth"

**Implementasi:**
- **Series title:** "Kamu Marah, Mereka Untung" — uncomfortable truth yang sulit dibantah
- **Series description:** "Media Indonesia tidak gagal memberitahu. Media didesain untuk membuat kamu marah."
- **Part 1 opening:** "Setiap kali kamu buka berita, kamu marah. Itu bukan kebetulan. Itu desain."

**Konsistensi dengan alur Progressive Complexity:**
- Hook #7 cocok karena seri ini membongkar "truth" yang tidak nyaman secara bertahap
- Setiap part menambah layer truth: P1 (siapa punya) → P2 (kenapa marah) → P3 (siapa distribusi) → dst
- Reader mulai dengan "media bikin marah" dan akhir di "media didesain bikin nggak percaya"

### Series Foreshadow Formula: #12 "The Number Tease"

**Implementasi:**
- **Series description teaser:** "6 grup media kontrol 90% berita Indonesia"
- **Part 1 closing foreshadow:** "Tapi kepemilikan cuma awal. Kenapa media yang dimiliki orang yang sama bikin kamu marah setiap kali kamu baca? Itu di part berikutnya."
- **Engine question:** "Kalau media yang bikin kamu marah dimiliki oleh orang yang sama, apa yang sebenarnya kamu tidak tahu?"

**Tease engine question tanpa spoiler:**
- Angka 6 grup / 90% bikin penasaran tanpa reveal cross-ownership detail
- Engine question ("apa yang kamu tidak tahu?") drive reader baca semua 7 part

---

## 7. Episode Hook/Foreshadow Strategy (per part)

### Hook Progression
| Part | Hook Type | Strategy |
|------|-----------|----------|
| 1 | Broad hook | "6 grup, 90% berita. Siapa yang punya apa yang kamu baca?" |
| 2 | Mechanism hook | "Kenapa setiap berita bikin marah? Bukan karena dunia buruk. Karena marah = iklan." |
| 3 | Distribution hook (MIDPOINT) | "Algoritma TikTok yang tentukan apa yang kamu lihat bukan editor Kompas." |
| 4 | Industry hook | "Hoax bukan kesalahan. Hoax industri. Dan kamu yang bayar." |
| 5 | Replacement hook | "Influencer dengan 2 juta followers punya jangkauan lebih besar dari Kompas. Tanpa editor." |
| 6 | Blindspot hook | "70% berita daerah adalah rewrite dari Jakarta. Daerah tanpa suara." |
| 7 | Synthesis hook (TWIST) | "Media literacy bukan solusi. Sistem yang bikin masalah nggak bisa diperbaiki dengan awareness." |

### Foreshadow Progression
| Part | Foreshadow ke | Tease |
|------|---------------|-------|
| 1 → 2 | Kenapa media bikin marah | "Kepemilikan cuma awal. Kenapa bikin marah? Itu part berikutnya." |
| 2 → 3 | Algoritma sebagai distributor | "Media bikin marah, tapi siapa yang pilih berita mana yang kamu lihat? Bukan editor." |
| 3 → 4 | Hoax via algoritma | "Algoritma bikin echo chamber. Dan echo chamber itu tempat hoax hidup." |
| 4 → 5 | Influencer sebagai pengganti | "Hoax menyebar via buzzer. Tapi buzzer sekarang punya wajah: influencer." |
| 5 → 6 | Media lokal mati | "Influencer ganti jurnalis. Tapi jurnalis lokal yang sebenarnya hilang." |
| 6 → 7 | Sintesis | "Pola jelas: kepemilikan, klik, algoritma, hoax, influencer, lokal. Saat gabungkan, jawabannya nggak nyaman." |
| 7 → | Whitepaper/artikel turunan | "Sistem media Indonesia bukan gagal. Tapi kalau bukan gagal, apa solusinya?" |

### Next Tease/Bridge Formula (antar part)
Setiap part diakhiri dengan bridge yang:
1. Summarize part ini (1 kalimat)
2. Tease part berikutnya (1 kalimat)
3. Link ke part berikutnya

---

## 8. Thumbnail & Meta Strategy (per part)

| Part | og_headline (max 50 char) | excerpt (max 160 char) | meta desc (max 160 char) |
|------|---------------------------|------------------------|--------------------------|
| 1 | 6 grup punya 90% berita Indonesia | 6 grup media kontrol 90% berita Indonesia. Cross-ownership dengan politik. Media bukan netral, media milik orang yang punya kepentingan. | 6 grup media kontrol 90% berita Indonesia. Cross-ownership dengan politik. Media bukan netral, media milik orang yang punya kepentingan. |
| 2 | Marah = engagement = iklan | Berita bikin marah karena marah = engagement tertinggi. Media adopsi clickbait sebagai strategi, bukan kecelakaan. | Berita bikin marah karena marah = engagement tertinggi. Media adopsi clickbait sebagai strategi, bukan kecelakaan. |
| 3 | Algoritma TikTok jadi editor utama | TikTok, IG, YouTube bukan netral. Algoritma pilih apa yang kamu lihat. Platform asing kontrol informasi publik Indonesia. | Algoritma platform asing jadi editor utama berita Indonesia. Filter bubble, echo chamber. Platform bukan netral. |
| 4 | Hoax bukan kesalahan, hoax industri | Hoax bukan kesalahan, industri. Buzzers, bot akun, paid propaganda. Ekonomi politik misinformasi yang untung dari ketidaktahuanmu. | Hoax Indonesia bukan kesalakan, industri. Buzzers, bot akun, paid propaganda. Ekonomi politik misinformasi. |
| 5 | Influencer jurnalis tanpa kode etik | Influencer-jurnalis tanpa kode etik, tanpa editor, tanpa fact-check. Tapi jangkauan lebih besar dari media mainstream. | Influencer-jurnalis tanpa kode etik punya jangkauan lebih besar dari media mainstream. Opini dikemas fakta. |
| 6 | 70% berita daerah rewrite Jakarta | Media lokal mati. 70% berita daerah adalah rewrite dari Jakarta. Tanpa jurnalis lokal, daerah tidak punya suara. | Media lokal Indonesia mati. 70% berita daerah rewrite dari Jakarta. Daerah tanpa suara. |
| 7 | Media literacy bukan solusi | Media didesain bikin kamu marah, terbelah, nggak percaya. Karena nggak percaya = mudah dikontrol. Media literacy bukan solusi. | Media Indonesia didesain bikin kamu nggak percaya. Media literacy bukan solusi karena sistem yang bikin masalah. |

---

## 9. Rilis Strategy

- **Cadence:** 1 part/hari, 08:00 WIB (01:00 UTC)
- **Estimasi tanggal rilis part 1:** 2027-04-01
- **Schedule:**
  - P1: 2027-04-01T01:00:00.000Z
  - P2: 2027-04-02T01:00:00.000Z
  - P3: 2027-04-03T01:00:00.000Z
  - P4: 2027-04-04T01:00:00.000Z
  - P5: 2027-04-05T01:00:00.000Z
  - P6: 2027-04-06T01:00:00.000Z
  - P7: 2027-04-07T01:00:00.000Z
- **Gap:** 1 hari antar part (max 3 hari allowed) ✅
- **Status saat build:** `scheduled` (bukan published, bukan draft)
- **Cron:** GitHub Actions cek setiap 5 menit, auto-publish saat `publishedAt <= now()`

### Schedule Gap Check
- Pajak Indonesia: Mar 1-7, 2027
- **Sistem Media: Apr 1-7, 2027** (25-day gap from Pajak P7) ✅
- Sakit Itu Mahal: Feb 1-8, 2027
- No conflict with any other series ✅

---

## 10. Series Arc Integrity Check

| Check | Pertanyaan | Result | Notes |
|-------|------------|--------|-------|
| **Arc completeness** | Apakah alur punya awal, tengah, akhir yang jelas? | ✅ PASS | Act 1 (P1-P2): Struktur & Mekanisme. Act 2 (P3-P5): Distribusi & Polusi. Act 3 (P6-P7): Blindspot & Sintesis. |
| **Part balance** | Apakah ada part yang terlalu padat atau terlalu tipis? | ✅ PASS | Setiap part punya 1 angle spesifik dengan data pendukung. Potensi 1,000-1,200 kata per part. |
| **Progression logic** | Apakah part N membutuhkan part N-1 untuk konteks? | ✅ PASS | Ya, tapi bisa standalone dengan recap 1-2 kalimat. |
| **Climax placement** | Apakah klimaks/insight terbesar di tempat yang tepat? | ✅ PASS | P7 (TWIST: media literacy bukan solusi) di Act 3, bukan Act 1. |
| **Engine question** | Apakah 1 pertanyaan drive seluruh seri? | ✅ PASS | "Kalau media yang bikin kamu marah dimiliki oleh orang yang sama, apa yang sebenarnya kamu tidak tahu?" |
| **Emotional arc** | Apakah emosi reader berubah dari part 1 ke part N? | ✅ PASS | P1: surprise → P2: frustration → P3: realization → P4: anger → P5: distrust → P6: empathy → P7: clarity |

**Result: 6/6 PASS** ✅

---

## 11. Cross-Part Dependency Audit

| Check | Pertanyaan | Result | Notes |
|-------|------------|--------|-------|
| **No circular dependency** | Apakah part 3 tidak butuh part 5 untuk dipahami? | ✅ PASS | Linear progression, no forward reference |
| **Recap sufficiency** | Apakah recap 1-2 kalimat cukup untuk standalone? | ✅ PASS | Setiap recap summarize 1 key fact dari part sebelumnya |
| **Teaser accuracy** | Apakah teaser part N sesuai dengan konten part N+1? | ✅ PASS | Teaser directly maps to next part's angle |
| **No orphan part** | Apakah setiap part punya koneksi ke min 1 part lain? | ✅ PASS | P1↔P2, P2↔P3, P3↔P4, P4↔P5, P5↔P6, P6↔P7. P7 references all. |
| **Entry point clarity** | Apakah part 1 jelas sebagai entry point? | ✅ PASS | P1 hook: "6 grup, 90% berita" — clear entry, no prerequisite |

**Result: 5/5 PASS** ✅

---

## 12. Release Strategy Verification

| Check | Pertanyaan | Result | Notes |
|-------|------------|--------|-------|
| **Cadence** | Apakah ritme rilis konsisten? | ✅ PASS | 1 part/hari, 08:00 WIB, konsisten |
| **Part 1 first** | Apakah part 1 publish/sebelum part lain? | ✅ PASS | P1: Apr 1, P2: Apr 2, ... P7: Apr 7 |
| **Gap tolerance** | Apakah gap antar part tidak terlalu lama? | ✅ PASS | 1 hari antar part (max 3 hari) |
| **Binge option** | Apakah reader bisa binge read setelah seri selesai? | ✅ PASS | Semua part scheduled, available after Apr 7 |
| **SEO compounding** | Apakah setiap part publish akan boost part lain? | ✅ PASS | Internal links (prev/next) + recap + teaser + cluster effect |

**Result: 5/5 PASS** ✅

---

## 13. Template Output Strategy

```
Alur seri: Progressive Complexity
Jumlah part: 7 parts
Series slug: sistem-media-indonesia
Series title: Kamu Marah, Mereka Untung: Sistem Media Indonesia
Series description: Media Indonesia tidak gagal memberitahu. Media didesain untuk membuat kamu marah. Karena marah = engagement = iklan. 7 part membongkar kenapa 6 grup media kontrol 90% berita Indonesia, kenapa ekonomi klik mengubah jurnalisme menjadi attention engineering, kenapa algoritma platform asing jadi editor utama, kenapa hoax bukan kesalahan tapi industri, kenapa influencer-jurnalis tanpa kode etik punya jangkauan lebih besar dari media mainstream, dan kenapa jurnalisme lokal mati membuat daerah tanpa suara.

Part roadmap:
- Part 1: Konsentrasi Kepemilikan: 6 Grup, 90% Berita - siapa punya media - kepemilikan media Indonesia
- Part 2: Ekonomi Klik: Marah = Engagement = Iklan - kenapa bikin marah - ekonomi klik Indonesia
- Part 3: Algoritma sebagai Editor: Platform Bukan Netral - platform asing kontrol info - algoritma media sosial
- Part 4: Ekosistem Hoax: Industri yang Untung - hoax sebagai industri - hoax Indonesia buzzer
- Part 5: Influencer sebagai Jurnalis: Opini Dikemas Fakta - pengganti jurnalis - influencer jurnalis
- Part 6: Kematian Jurnalisme Lokal: Daerah Tanpa Suara - daerah tanpa peliput - jurnalisme lokal
- Part 7: Sintesis: Media Tidak Gagal, Didesain Bikin Kamu Nggak Percaya - sintesis desain - sistem media Indonesia

Rilis strategy:
- 1 part/hari, 08:00 WIB (01:00 UTC)
- Estimasi tanggal rilis part 1: 2027-04-01
```

---

## 14. Series Strategy Quality Score

| Factor | Weight | Score | Points | Notes |
|--------|--------|-------|--------|-------|
| Alur choice | 2 | 2 | 2 | Progressive Complexity match perfectly dengan topik yang butuh pemahaman bertahap |
| Part count | 1 | 2 | 1 | 7 parts optimal: 6 sub-topic + sintesis, tidak dipaksakan |
| Dependency map | 1 | 2 | 1 | Clear, no circular, recap strategy defined |
| Arc integrity | 2 | 2 | 2 | 6/6 PASS |
| Release strategy | 1 | 2 | 1 | Clear, consistent, 1/day, 25-day gap from previous series |
| Config registration | 1 | 2 | 1 | Terdaftar + validated via npx tsx |
| Naming convention | 1 | 2 | 1 | Semua part mengikuti {series-slug}-part-{n}-{article-slug} |
| Standalone potential | 1 | 2 | 1 | Semua part standalone dengan recap 1-2 kalimat |
| SEO compounding | 1 | 2 | 1 | Internal links + cluster + recap/teaser + sitemap |
| Binge-read design | 1 | 2 | 1 | Strong binge-read path: hook progression + foreshadow + bridge |

**Total Score: 12/12** ✅ (target: min 9)

---

## Next

Lanjut ke `/seri-03-research`
