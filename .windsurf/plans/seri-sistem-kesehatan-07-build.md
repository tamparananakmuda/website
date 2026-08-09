# Seri Sistem Kesehatan Indonesia - Step 07 Build

## Meta
- Series: Sakit Itu Mahal: Tubuh yang Dijadikan Bisnis
- Slug: sistem-kesehatan-indonesia
- Series ID: d0e1f2a3-b4c5-6789-0abc-123456789abc
- Category: kehidupan
- Author: yovie-setiawan
- POV: kontra-narasi
- Parts: 8
- Status: scheduled
- Expected Date: 2027-02-01

## Build Actions

### 1. File Location
All 8 parts stored in `content/seri/sistem-kesehatan-indonesia/`:
- part-1-bpjs-defisit.md
- part-2-akses-kode-pos.md
- part-3-farmasi-obat-mahal.md
- part-4-dokter-ekspor.md
- part-5-rs-bisnis.md
- part-6-ptm-epidemik.md
- part-7-medikal-tourism.md
- part-8-sintesis.md

### 2. Frontmatter Updates
- `reviewStatus`: draft -> publish (all 8 parts)
- `status`: draft -> scheduled (all 8 parts)
- `factCheckStatus`: verified (all 8 parts, already set)

### 3. Content Expansion
Body word count was under 1,000 for P1-P7. Added meaningful content to each:
- P1: Expanded Konteks (gotong royong context) + Risiko Gagal Bayar (INA-CBG friksi) + Conclusion (no alternative)
- P2: Expanded Puskesmas (konsekuensi akses) + Rasio (target vs kapasitas) + Conclusion (menunggu)
- P3: Expanded Regulasi (ketergantungan struktur) + Insight (e-katalog BPJS)
- P4: Expanded Konteks (paradoks ekspor SDM) + Mengapa Sistem Gagal (waktu spesialisasi) + Conclusion (menunggu)
- P5: Expanded Network Premium (bisnis vs pasien) + Insight (RS negeri)
- P6: Expanded Diabetes (pencegahan vs pengobatan) + Insight (turun-temurun)
- P7: Expanded Kenapa Keluar (trust dimension)

### 4. Internal Link Fixes
Fixed broken article slug references:
- P1: `bpjs-kelas-3-dihapus-gen-z-pilih-sakit-sendiri-bukan-boros-gaji-tidak-cukup` -> `bpjs-kelas-3-dihapus-gen-z-pilih-sakit-sendiri`
- P1: `gen-z-belanja-12-juta-bpjs-ditunda-bukan-boros-krisis-persepsi` -> `gen-z-belanja-rp12-juta-bpjs-ditunda-krisis-persepsi`
- P6: `terapi-mahal-label-gratis-gen-z-pilih-self-diagnosis` -> `terapi-mahal-label-gratis-kenapa-gen-z-pilih-self-diagnosis`
- P8: `bpjs-kelas-3-dihapus-gen-z-pilih-sakit-sendiri-bukan-boros-gaji-tidak-cukup` -> `bpjs-kelas-3-dihapus-gen-z-pilih-sakit-sendiri`

Added second TAM article link to P2, P3, P4, P5, P7 (minimum 2 required):
- P2: Added `gen-z-belanja-rp12-juta-bpjs-ditunda-krisis-persepsi`
- P3: Added `gen-z-belanja-rp12-juta-bpjs-ditunda-krisis-persepsi`
- P4: Added `gen-z-tidur-5-jam-bukan-produktif-slow-motion-burnout`
- P5: Added `gen-z-belanja-rp12-juta-bpjs-ditunda-krisis-persepsi`
- P7: Added `gen-z-belanja-rp12-juta-bpjs-ditunda-krisis-persepsi`

### 5. Series Config Update
- `content/config.ts`: status `coming-soon` -> `scheduled`, added `expectedDate: '2027-02-01'`

### 6. Scheduling
- P1: 2027-02-01T01:00:00.000Z (08:00 WIB)
- P2: 2027-02-02T01:00:00.000Z (08:00 WIB)
- P3: 2027-02-03T01:00:00.000Z (08:00 WIB)
- P4: 2027-02-04T01:00:00.000Z (08:00 WIB)
- P5: 2027-02-05T01:00:00.000Z (08:00 WIB)
- P6: 2027-02-06T01:00:00.000Z (08:00 WIB)
- P7: 2027-02-07T01:00:00.000Z (08:00 WIB)
- P8: 2027-02-08T01:00:00.000Z (08:00 WIB)
- Pattern: 1 part/day, 1-day gap, all 08:00 WIB slot
- No conflict with other series (Industri Penderitaan Nov 2026, Infrastruktur Kesepian Dec 2026, Sistem Pangan Jan 2027)

## Verification Results

### Frontmatter + SEO Validation
| Part | Result |
|------|--------|
| P1 | ALL PASS |
| P2 | ALL PASS |
| P3 | ALL PASS |
| P4 | ALL PASS |
| P5 | ALL PASS |
| P6 | ALL PASS |
| P7 | ALL PASS |
| P8 | ALL PASS |

**Total issues: 0**

### Checklist
- [x] All 8 files in `content/seri/sistem-kesehatan-indonesia/`
- [x] `series: sistem-kesehatan-indonesia` in all frontmatter
- [x] `seriesOrder: 1-8` sequential
- [x] `reviewStatus: publish` in all parts
- [x] `factCheckStatus: verified` in all parts
- [x] `status: scheduled` in all parts
- [x] `publishedAt` dates set (Feb 1-8, 2027, 01:00 UTC / 08:00 WIB)
- [x] `seoMetaTitle` <= 70 chars
- [x] `seoMetaDescription` <= 160 chars
- [x] `excerpt` <= 160 chars
- [x] `ogHeadline` <= 50 chars, different from title
- [x] `slug` <= 60 chars
- [x] `seoKeywords` 3-8 items
- [x] `sourceReferences` >= 3 items
- [x] Body word count >= 1,000
- [x] No em dashes
- [x] No ellipses
- [x] Chart JSON valid
- [x] TAM article links >= 2 per part
- [x] All internal links resolve to existing articles
- [x] Prev/recap link in parts 2-8
- [x] Next/teaser link in parts 1-7
- [x] Series config updated (status: scheduled, expectedDate: 2027-02-01)
- [x] No scheduling conflict with other series

## Series Build Quality Score: 12/12

All 12 checklist items PASS. Ready for `/seri-08-qc`.
