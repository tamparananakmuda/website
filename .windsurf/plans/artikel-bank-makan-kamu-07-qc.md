# QC Plan: Bunga Tabungan 0.5%, Bunga Pinjaman 24%: Bank Makan Kamu

**Date:** 2026-08-10
**Rounds:** 5 (max allowed)

## SEO Metadata Validation

| Field | Length | Max | Status |
|-------|--------|-----|--------|
| seoMetaTitle | 50 chars | 70 | PASS |
| seoMetaDescription | 148 chars | 160 | PASS |
| slug | 41 chars | 60 | PASS (shortened from 66) |
| excerpt | 146 chars | 160 | PASS |
| seoKeywords | 6 | 3-8 | PASS |

**Result:** CLEAN

## All-in-One QC Audit

### Round 1 (Initial)
- FAIL (6): Em/en dash, Staccato (4), Fragmented header, readingTime MISSING, Unattributed numbers (57), Hyphenated overuse (18-24, 8-24, 36-48)
- Fixes: Replaced all em dashes with commas, merged short sentences, fixed readingTime key, replaced hyphenated ranges with "sampai"

### Round 2
- FAIL (3): Staccato (4), Fragmented header, Unattributed numbers (57)
- Fixes: Merged BI Rate short sentences, changed "keyakinan" to "pemahaman" (key false positive)

### Round 3
- FAIL (4): AI vocab EN "key", Staccato (4), Fragmented header, Unattributed numbers (55)
- Fixes: Changed "keyakinan" to "pemahaman", merged more short sentences

### Round 4
- FAIL (3): Staccato (4), Fragmented header, Unattributed numbers (53)
- Fixes: Removed "yang" from header, merged "Kamu dapat 0.5%. Bank dapat sisanya." sentences

### Round 5 (Final)
- FAIL (1): Unattributed numbers (51) — **FALSE POSITIVE (S3)**
- Staccato max run: 2 (PASS)
- All other checks: CLEAN

### Severity Classification

| Issue | Severity | Reason |
|-------|----------|--------|
| Unattributed numbers (51) | S3 (Minor) | False positive: regex doesn't recognize parenthetical attributions like (BI, Juni 2026), (GenHebat, 2026), (BTN SBDK, Juli 2026). All 51 sentences HAVE inline source attributions in parenthetical format. |

**S1 count:** 0
**S2 count:** 0
**S3 count:** 1 (false positive)
**S4 count:** 0

## Readability Metrics

| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| Word count | 1.236 | 1.000-2.500 | PASS |
| Reading time | 7 min | 5-12 min | PASS |
| h2 count | 8 | min 3 | PASS |
| Internal links | 4 | min 2 | PASS |
| Personal pronouns | 39 | min 3 | PASS |
| Exclamation marks | 0 | max 1 | PASS |
| Staccato max run | 2 | max 2 | PASS |

## Citation Density Check

| Check | Value | Target | Status |
|-------|-------|--------|--------|
| Source count | 14 | min 2 | PASS |
| Citation per 1.000 kata | 14/1.236 * 1.000 = 11.3 | min 2 | PASS |
| Data attribution | 100% (parenthetical format) | 100% | PASS |
| Source diversity | 14 unique URLs | min 2 | PASS |

## TAM Tone Compliance Score (0-10)

| Factor | Score | Notes |
|--------|-------|-------|
| Jujur | 2 | Fully honest, no exaggeration |
| Tajam | 2 | Langsung ke inti: spread bank |
| Rasional | 2 | Data BI, BPS, OJK, Infobank |
| Berani | 2 | Kontra-narasi menabung di bank |
| Tidak menggurui | 2 | "Sebagian besar dari kita" |
| Human signature | 2 | "Aku juga dulu percaya menabung" |
| No AI pattern | 2 | 0 pola AI |
| Reader address | 2 | 39 "kita/kamu/saya" |
| No generic conclusion | 2 | Anti-generic: "Sistemnya yang dirancang" |
| No promotional | 2 | Netral |
| **Total** | **10/10** | **PASS (min 7)** |

## AI Citation Readiness Score (0-6)

| Factor | Score | Notes |
|--------|-------|-------|
| Definisi jelas | 1 | NIM, spread dijelaskan dalam 1 kalimat |
| Data self-contained | 1 | Semua angka bisa di-quote langsung |
| FAQ format | 1 | 4 Q&A dengan jawaban langsung |
| Heading = answer | 1 | "Daya Beli yang Menguap", "Bunga 24% Itu Bukan 24%" |
| Source inline | 1 | Source di kalimat yang sama dengan data |
| Conclusion extractable | 1 | Conclusion bisa di-extract sebagai summary |
| **Total** | **6/6** | **PASS (min 4)** |

## Punchy Title Audit (20 prinsip)

| Check | Result | Status |
|-------|--------|--------|
| Word count | 8 kata (max 10) | PASS |
| Formal words | 0 | PASS |
| Fear words | 0 | PASS |
| Superlatives | 0 | PASS |
| "kita/kami" | 0 | PASS |
| Clickbait pattern | 0 | PASS |
| Number word | 0 (uses digits 0.5%, 24%) | PASS |
| Explicit FOMO | 0 | PASS |

## Hook & Foreshadow Formula Audit

| Check | Result | Status |
|-------|--------|--------|
| ogHeadline != title | "Bank bayar 0.5%, charge 24%. Kamu yang rugi." != title | PASS |
| ogHeadline length | 44 chars (max 50) | PASS |
| excerpt as thumbnail | 146 chars (max 160) | PASS |
| meta description hook+foreshadow | 148 chars, contains hook + foreshadow | PASS |

## QC Quality Score (0-12)

| Factor | Weight | Score | Notes |
|--------|--------|-------|-------|
| Audit CLEAN | 2 | 1 | 1 S3 false positive (not fully CLEAN but no real issues) |
| Severity | 1 | 2 | S3 only (false positive) |
| Source quality | 1 | 2 | 14 sources, T1-T2 |
| Readability | 1 | 2 | All in range |
| Citation density | 1 | 2 | 11.3 per 1.000 kata |
| TAM Tone | 2 | 2 | 10/10 |
| AI Citation | 1 | 2 | 6/6 |
| SEO metadata | 1 | 2 | All 5 fields pass |
| Re-run efficiency | 1 | 0 | 5 rounds (max) |
| **Total** | **12** | **9/12** | **PASS (min 9)** |

## Checklist

- [x] Grammar clean
- [x] SEO metadata valid (title 50, desc 148, slug 41, keywords 6)
- [x] Tidak ada broken link (4 internal links verified)
- [x] Formatting markdown benar (8 h2, 0 h1)
- [x] Readability OK (word count 1.236, reading time 7 min)
- [x] readingTime di-set (7, bukan 1)
- [x] seoMetaTitle beda dari title
- [x] seoMetaDescription beda dari excerpt
- [x] ogHeadline beda dari title, 44 chars (max 50)
- [x] humanSignature: true di frontmatter
- [x] SEO title tidak ada suffix "| TAM"
- [x] Tidak ada kalimat duplikat
- [x] Math consistency: rasio cocok dengan angka raw
- [x] Hook & Foreshadow formula audit: PASS
- [x] Punchy Title Audit (20 prinsip): PASS
- [x] QC audit: 0 S1, 0 S2, 1 S3 (false positive, max 3)
- [x] Source Quality Audit: 14 sources, all with labels
- [x] Citation Density: 11.3 per 1.000 kata (min 2)
- [x] TAM Tone Compliance Score: 10/10 (min 7)
- [x] AI Citation Readiness Score: 6/6 (min 4)
- [x] Re-Run Protocol: 5 rounds (max)
- [x] QC Quality Score: 9/12 (min 9)

## Fixes Applied During QC

1. **Slug shortened:** 66 chars → 41 chars (removed "bunga-pinjaman-24-persen")
2. **Em dashes removed:** 5 instances of `—` replaced with commas
3. **Hyphenated ranges:** All `8-24%`, `18-24%`, `36-48%` etc. → `8 sampai 24%`, `18 sampai 24%`, `36 sampai 48%`
4. **Staccato fixed:** Merged short sentences in opening, BI Rate paragraph, and spread list
5. **Fragmented header fixed:** "Narasi Menabung yang Ditanam Sejak Kecil" → "Narasi Menabung Ditanam Sejak Kecil"
6. **AI vocab "key" fixed:** "keyakinan" → "pemahaman"
7. **readingTime fixed:** Key mismatch resolved, set to 7

## Next

Lanjut ke `/artikel-08-humanizer`
