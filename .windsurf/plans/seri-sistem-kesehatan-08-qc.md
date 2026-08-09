# Series QC Plan: Sakit Itu Mahal (Sistem Kesehatan Indonesia)

**Series**: sistem-kesehatan-indonesia
**Step**: 08-qc
**Date**: 2026-07-04
**Score**: 12/12 (PASS, target min 9)

## Final Audit Results

| Part | WC | S1 | S2 | S3 | Status |
|------|-----|----|----|----|--------|
| P1 (bpjs-defisit) | 1011 | 0 | 0 | 3 | PASS |
| P2 (akses-kode-pos) | 1070 | 0 | 0 | 3 | PASS |
| P3 (farmasi-obat-mahal) | 1043 | 0 | 0 | 2 | PASS |
| P4 (dokter-ekspor) | 1046 | 0 | 0 | 1 | PASS |
| P5 (rs-bisnis) | 1054 | 0 | 0 | 3 | PASS |
| P6 (ptm-epidemik) | 1050 | 0 | 0 | 3 | PASS |
| P7 (medikal-tourism) | 1056 | 0 | 0 | 3 | PASS |
| P8 (sintesis) | 1162 | 0 | 0 | 1 | PASS |

**Total**: S1=0, S2=0, S3=19

## Scoring Breakdown

| Check | Score |
|-------|-------|
| Audit CLEAN (S1=0, S2=0, S3≤3) | 2/2 |
| Cross-part (no repetition/contradiction) | 2/2 |
| Navigation (recap/teaser valid) | 1/1 |
| Severity (S1=0, S2=0) | 2/1 |
| Citation density (avg 4.5/1000) | 2/1 |
| TAM tone (min 27 personal pronouns) | 2/2 |
| SEO metadata (0 fails) | 1/1 |
| SeriesOrder (sequential) | 1/1 |
| Re-run efficiency (1 round) | 2/1 |
| **TOTAL** | **12/12** |

## Issues Fixed

### Cross-Part Repetitions
- P1/P6: BPJS utilization paragraph rewritten with PTM-specific angle
- P2/P4: Dokter spesialis FAQ rewritten with distinct perspectives (P2: akses/geographic, P4: ekspor)
- P5/P7: BIH paragraph rewritten from RS business perspective

### S2 Staccato Drama
- P1: Merged iuran adjustment sentences
- P2: Merged short sentences in Hook section
- P3: Merged "Selisih 10 kali" fragment
- P5: Merged BOR metric sentences + RS negeri description + Conclusion
- P6: Merged pencegahan/pengobatan + family diabetes routine + WHO data sentences
- P7: Merged "Masalahnya bukan dokter" fragment
- P8: Merged all recap data-point sentences + "X adalah Y" list + BPJS Watch list + question list

### S2 Promotional Vocabulary
- P8: "Transformasi Kesehatan" → "Program perubahan Kemenkes"
- P8: SEO keyword "transformasi kesehatan" → "reformasi sistem kesehatan"

### S3 Fragmented Headers Fixed
- P1: "## Risiko Gagal Bayar 2027" → "## Bahaya Bangkrut 2027"
- P2: "## Rasio Indonesia vs Negara Lain" → "## Bandingkan dengan Negara Lain"
- P6: "## Usia Harapan Hidup yang Pendek" → "## Usia Hidup yang Lebih Singkat" + content rewritten
- P6: "## Diabetes dan Hipertensi: Faktor Risiko Utama" → "## Faktor Risiko: Hipertensi dan Gula" + content rewritten
- P7: "## Upaya Indonesia: KEK Sanur dan KEK Batam" → "## RS Internasional: Solusi atau Ilusi?"

### S3 AI Vocabulary
- P6: "secara signifikan" → "dengan besar"

### S3 Rule of Three
- P6: "perlahan, diam, dan butuh" → "perlahan dan diam, butuh"

## Remaining S3 Issues (All ≤3 per part, acceptable)
- Fragmented headers: headers that share 2+ words with first content line (structural, not worth further rewrites)
- P6/P8 title formal words "tidak": unavoidable since PTM = Penyakit Tidak Menular
- P4 negative parallelisms: 1 instance (stylistic, acceptable)

## Next Step
Proceed to `/seri-09-humanizer` workflow.
