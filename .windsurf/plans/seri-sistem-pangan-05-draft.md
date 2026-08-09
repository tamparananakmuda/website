# Seri Sistem Pangan Indonesia - Step 05 Draft

## Meta
- Series: Makanan Murah, Tubuh Mahal
- Slug: sistem-pangan-indonesia
- Created: 2026-08-09
- Status: Draft complete, ready for step 06-review

## Draft Files

| Part | File | Words | h2 | Charts | Links | Featured |
|------|------|-------|----|--------|-------|----------|
| P1 | part-1-makanan-sehat-mewah.md | ~1,150 | 6 | 1 (bar) | 3 | true |
| P2 | part-2-47-persen-bukan-makanan.md | ~1,200 | 6 | 1 (bar) | 3 | false |
| P3 | part-3-negara-impor-makanan.md | ~1,180 | 5 | 1 (bar) | 3 | false |
| P4 | part-4-sawah-jadi-mal.md | ~1,180 | 5 | 1 (bar) | 3 | false |
| P5 | part-5-food-delivery-trap.md | ~1,150 | 5 | 1 (pie) | 3 | false |
| P6 | part-6-101-miliar-dari-sakit.md | ~1,200 | 5 | 1 (bar) | 3 | false |
| P7 | part-7-desain-bukan-gagal.md | ~1,350 | 5 | 1 (bar) | 3 | false |

## Hook & Foreshadow Implementation

| Part | Episode Hook | Episode Foreshadow | Next Tease |
|------|-------------|-------------------|------------|
| P1 | #02 Data Shock | #15 Connection Tease | Escalation |
| P2 | #05 Counter-Narrative | #09 Pattern Tease | Question Tease |
| P3 | #12 Comparison Shock | #04 Setup-Payoff | Cliffhanger |
| P4 | #09 Contradiction | #14 Inversion Tease | Setup-Payoff |
| P5 | #03 Provocative Question | #08 Data Tease | Escalation |
| P6 | #12 Comparison Shock | #16 Stakes Tease | Direct Tease |
| P7 | #14 Pattern Recognition | #20 Resolution Tease | N/A (Resolution) |

## Draft Quality Gates

| Part | G1: Structure | G2: Evidence | G3: Tone | Status |
|------|-------------|-------------|---------|--------|
| P1 | PASS (6 h2, balanced) | PASS (ATNi, SKI, CISDI all sourced) | PASS (TAM voice + human signature) | PASS |
| P2 | PASS (6 h2, balanced) | PASS (ATNi, WINA, CISDI, Indofood all sourced) | PASS (TAM voice + human signature) | PASS |
| P3 | PASS (5 h2, balanced) | PASS (USDA, BPN, Indofood, Oxford all sourced) | PASS (TAM voice + human signature) | PASS |
| P4 | PASS (5 h2, balanced) | PASS (BPS/Kompas, SSGI all sourced) | PASS (TAM voice + human signature) | PASS |
| P5 | PASS (5 h2, balanced) | PASS (Momentum Works, Jakpat, Snapcart all sourced) | PASS (TAM voice + human signature) | PASS |
| P6 | PASS (5 h2, balanced) | PASS (USDA, FOLU, Indofood, CNBC all sourced) | PASS (TAM voice + human signature) | PASS |
| P7 | PASS (5 h2, balanced) | PASS (SSGI, SKI, YLKI, Kompas, FOLU all sourced) | PASS (TAM voice + human signature) | PASS |

**7/7 parts PASS all 3 gates**

## Cross-Part Consistency Check

| Check | Status | Notes |
|-------|--------|-------|
| Tone | PASS | Voice sama: kontra-narasi, tajam, data-driven, tidak menggurui. "Gue" untuk human signature, "kamu" untuk reader. |
| Terminology | PASS | UPF, GGL, LP2B, MBG, MBDK, hidden costs konsisten antar part. |
| Data | PASS | Tidak ada kontradiksi. Obesitas 37.8% konsisten di P1, P2, P6, P7. Stunting 19.8% konsisten di P4, P7. Indofood Rp 10.68T konsisten di P2, P3, P6. |
| Recap | PASS | Setiap recap 1 kalimat, akurat mewakili conclusion part sebelumnya. |
| Teaser | PASS | Setiap teaser dipenuhi di hook part berikutnya. P1 tease "47%" -> P2 hook "47%". P2 tease "65% diimpor" -> P3 hook "100% gandum". Dst. |

**5/5 checks PASS**

## Punctuation Check
- No em dash (—) in any part: PASS
- Max 1 exclamation mark per part: PASS (0 in all parts)
- No ellipsis (...): PASS

## Series Draft Quality Score

| Factor | Weight | Score | Notes |
|--------|--------|-------|-------|
| Structure | 2 | 2 | 5-6 h2 per part (4+ required) |
| Evidence | 2 | 2 | 100% angka punya source (ATNi, SKI, SSGI, WINA, USDA, FOLU, Indofood, Momentum Works, Jakpat, Snapcart, CISDI, YLKI, Kompas, BPS, CNBC) |
| Tone | 2 | 2 | Full TAM voice + human signature per part (7/7) |
| Cross-part | 2 | 2 | Fully konsisten (5/5 checks pass) |
| Word count | 1 | 1 | All 1,150-1,350 (within 1,000-2,500 range) |
| Internal links | 1 | 1 | 3+ per part (2 TAM articles + cross-part) |
| Storytelling | 1 | 1 | Strong hook + cliffhanger per part, escalation clear |
| Recap/teaser | 1 | 1 | Accurate (7/7 recap-teaser match) |
| **TOTAL** | **12** | **12** | (target: min 9) PASS |

## Checklist

- [x] Semua part ditulis lengkap (7/7)
- [x] Word count per part: 1.000-2.500 kata (all within range)
- [x] Heading: h2/h3 only, min 3 h2 per part (5-6 per part)
- [x] Internal linking: min 2 link + link antar part (3 per part)
- [x] `series` dan `series_order` diisi di frontmatter (7/7)
- [x] Draft Quality Gates: G1, G2, G3 pass per part (7/7)
- [x] Cross-Part Consistency: 5 checks pass
- [x] `excerpt`: max 160 karakter per part (all within range)
- [x] `ogHeadline`: berbeda dari title, max 50 karakter (7/7 unique)
- [x] Episode Hook formula diimplementasi di opening per part
- [x] Episode Foreshadow formula diimplementasi di transition/conclusion per part
- [x] Next Tease / Bridge formula diimplementasi di akhir part 1 sampai 6
- [x] Meta description mengandung Hook + Foreshadow element per part (max 160 chars)
- [x] Series Draft Quality Score: 12/12 (target: min 9) PASS
- [x] No em dash in any part
- [x] Max 1 exclamation mark per part (0 in all)
- [x] No ellipsis
- [x] FAQ section per part (3 Q&A each)
- [x] Chart per part (7 charts total: 6 bar, 1 pie)
- [x] human_signature: true per part
- [x] status: scheduled, publishedAt: Jan 5-11, 2027

## Next

Lanjut ke `/seri-06-review`
