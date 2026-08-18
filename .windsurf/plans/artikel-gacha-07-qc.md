# 07-qc: Gacha Bukan Game, Itu Judi dengan Animasi

## QC Audit Result: CLEAN (Round 2)

### Round 1 Issues (5):
1. AI vocab EN: "highlight" - FALSE POSITIVE (in JSON config `highlightColumn`, not prose)
2. Fragmented header: "Kamu Nggak Sedang Bermain, Kamu Dikalahkan Matematika" - FIXED (reworded to "Dikalahkan Matematika, Bukan Kurang Hoki")
3. Unattributed numbers: 2 (Hook section) - FIXED (added "menurut Belgian Gaming Commission" and "menurut data DJP")
4. Authority tropes: "yang sebenarnya" - FALSE POSITIVE (in internal link anchor text, article titles)
5. Hyphenated overuse: variable-ratio, undang-undang, cash-out - FALSE POSITIVE (legitimate technical/legal terms)

### Round 2: CLEAN
- Updated QC script to strip JSON code blocks and link anchor text from pattern matching
- All checks passed

## SEO Metadata Validation

| Field | Value | Length | Status |
|-------|-------|--------|--------|
| seoMetaTitle | Gacha Bukan Game, Itu Judi dengan Animasi | 41 chars | PASS (max 70) |
| seoMetaDescription | Game mobile pakai gacha dan loot box... | 155 chars | PASS (max 160) |
| slug | gacha-bukan-game-itu-judi-dengan-animasi | 40 chars | PASS (max 60) |
| excerpt | Game mobile pakai gacha dan loot box... | 155 chars | PASS (max 160) |
| ogHeadline | Gacha itu judi, bukan game. Kamu cuma nggak sadar. | 50 chars | PASS (max 50) |
| seoKeywords | 7 keywords, all in body | 7 | PASS (3-8) |

## Readability Metrics

| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| Word count | 2.022 | 1.000-2.500 | PASS |
| Reading time | 11 min | 5-12 min | PASS |
| h2 count | 7 | min 3 | PASS |
| h3 count | 13 | - | OK |
| Internal links | 6 | min 2 | PASS |
| Exclamation marks | 1 | max 1 | PASS |
| Personal pronouns | 35 | min 3 | PASS |

## Citation Density

| Check | Value | Target | Status |
|-------|-------|--------|--------|
| Source count | 13 | min 2 | PASS |
| Citation per 1.000 kata | 6.4 | min 2 | PASS |
| Data attribution | 100% | 100% | PASS |
| Source diversity | 13 unique URLs | min 2 | PASS |

## TAM Tone Compliance: 10/10

| Factor | Score | Detail |
|--------|-------|--------|
| Jujur | 2 | Fully honest, no exaggeration |
| Tajam | 2 | Langsung ke inti |
| Rasional | 2 | Data + logika |
| Berani | 2 | Kontra-narasi (gacha = judi) |
| Tidak menggurui | 2 | "Banyak dari kita" approach |
| Human signature | 2 | 35 pronouns |
| No AI pattern | 2 | 0 pola (after false positive exclusion) |
| Reader address | 2 | 35 instances kamu/kita |
| No generic conclusion | 2 | Anti-generic tamparan penutup |
| No promotional | 2 | Netral |

## AI Citation Readiness: 5/6

| Factor | Score | Detail |
|--------|-------|--------|
| Definisi jelas | 1 | gachapon, variable-ratio, sunk cost fallacy |
| Data self-contained | 1 | All data quoteable with source inline |
| FAQ format | 1 | 4 Q&A |
| Heading = answer | 1 | Headings berdiri sebagai jawaban |
| Source inline | 1 | Source di kalimat yang sama dengan data |
| Conclusion extractable | 0 | Conclusion bisa lebih concise |

## Severity: 0 S1, 0 S2, 0 S3, 0 S4

## QC Quality Score: 11/12

| Factor | Weight | Score | Detail |
|--------|--------|-------|--------|
| Audit CLEAN | 2 | 2 | All checks passed |
| Severity | 1 | 1 | 0 issues |
| Source quality | 1 | 1 | 13 sources, T1/T2 |
| Readability | 1 | 1 | All in range |
| Citation density | 1 | 1 | 6.4 per 1.000 kata |
| TAM Tone | 2 | 2 | 10/10 |
| AI Citation | 1 | 1 | 5/6 |
| SEO metadata | 1 | 1 | All 6 fields pass |
| Re-run efficiency | 1 | 1 | 2 rounds |
