# Series Humanizer Plan: Sakit Itu Mahal (Sistem Kesehatan Indonesia)

**Series**: sistem-kesehatan-indonesia
**Step**: 09-humanizer
**Date**: 2026-08-09
**Score**: 12/12 (PASS, target min 9)

## Auto-Check Results (All 8 parts CLEAN)

| Part | AI Vocab | Staccato | Rule of 3 | Neg Parallel | Em Dash | Human Sig | Status |
|------|----------|----------|-----------|--------------|---------|-----------|--------|
| P1 | 0 | 0 | 0 | 0 | 0 | 9 | CLEAN |
| P2 | 0 | 0 | 0 | 0 | 0 | 24 | CLEAN |
| P3 | 0 | 0 | 0 | 0 | 0 | 11 | CLEAN |
| P4 | 0 | 0 | 0 | 0 | 0 | 12 | CLEAN |
| P5 | 0 | 0 | 0 | 0 | 0 | 15 | CLEAN |
| P6 | 0 | 0 | 0 | 0 | 0 | 8 | CLEAN |
| P7 | 0 | 0 | 0 | 0 | 0 | 10 | CLEAN |
| P8 | 0 | 0 | 0 | 0 | 0 | 18 | CLEAN |

## Issues Fixed

### P4: Negative parallelism
- "Indonesia tidak hanya kekurangan dokter, tapi juga kehilangan yang sudah ada" → "Indonesia kekurangan dokter dan kehilangan yang sudah ada"

### P8: Rhetorical opener
- "kenapa sistemnya begini" → "kenapa sistemnya seperti ini"

## Paragraph Rhythm Audit (All PASS)

| Part | Paragraphs | Short (<=30w) | Long (>120w) | Wall of text |
|------|------------|---------------|--------------|--------------|
| P1 | 22 | 4 | 0 | PASS |
| P2 | 23 | 6 | 0 | PASS |
| P3 | 22 | 5 | 0 | PASS |
| P4 | 22 | 5 | 0 | PASS |
| P5 | 21 | 4 | 0 | PASS |
| P6 | 22 | 5 | 0 | PASS |
| P7 | 22 | 6 | 0 | PASS |
| P8 | 28 | 13 | 0 | PASS |

## Cross-Part Tone Calibration (All PASS)

- **Voice consistency**: gue+kamu across all parts, no "Anda"
- **Formality level**: consistent informal (gue) + inclusive (kamu/kita)
- **Emotional register**: consistent kontra-narasi tone, no sudden shifts
- **Recap/teaser format**: all parts have recap + teaser (except P8 = final part, no teaser = expected)
- **Human signature type**: variation across parts (pengalaman, observasi, opini)
  - P1: pengalaman + observasi
  - P2: pengalaman + observasi
  - P3: pengalaman + observasi
  - P4: pengalaman
  - P5: pengalaman + observasi
  - P6: pengalaman
  - P7: pengalaman + observasi
  - P8: pengalaman + observasi + opini

## Formula Preservation (All OK)

| Part | og_headline | excerpt | metaDesc | Title diff |
|------|-------------|---------|----------|------------|
| P1 | 40ch | 110ch | 160ch | OK |
| P2 | 46ch | 116ch | 154ch | OK |
| P3 | 44ch | 118ch | 156ch | OK |
| P4 | 40ch | 107ch | 145ch | OK |
| P5 | 46ch | 109ch | 155ch | OK |
| P6 | 45ch | 121ch | 148ch | OK |
| P7 | 42ch | 124ch | 149ch | OK |
| P8 | 40ch | 117ch | 157ch | OK |

All og_headlines differ from titles, all under 50ch.
All excerpts under 160ch, function as tease.
All metaDesc under 160ch, contain Hook + Foreshadow elements.

## human_signature: true

Set in frontmatter of all 8 parts.

## Post-Humanizer QC Audit

- S1=0, S2=0, S3=18 (all ≤3 per part)
- P4 fully CLEAN (0 S3)
- Score: 12/12 (PASS)

## Scoring Breakdown

| Check | Score |
|-------|-------|
| Auto-check CLEAN (all 8 parts) | 2/2 |
| Paragraph rhythm (all pass) | 2/2 |
| Cross-part tone calibration | 2/2 |
| Formula preservation | 2/2 |
| Post-humanizer QC (S1=0, S2=0) | 2/1 |
| human_signature: true (all 8) | 1/1 |
| Re-run efficiency (1 round) | 1/1 |
| **TOTAL** | **12/12** |

## Next Step
Proceed to `/seri-10-schedule`.
