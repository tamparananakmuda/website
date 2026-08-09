# Seri 05 - Draft: Infrastruktur Kesepian

## Status: DONE

## Draft Files

| Part | File | Word count | H2 (content) | Internal links | Charts | Featured |
|------|------|-----------|-------------|----------------|--------|----------|
| 1 | `part-1-kematian-third-place.md` | 1,156 | 6 (Hook, Konteks, 4 Data, Insight, Conclusion) + FAQ | 3 (soft-socializing, friendship-recession, P2 tease) | 1 (bar: RTH) | true |
| 2 | `part-2-substitusi-digital.md` | 1,242 | 6 (Hook, Konteks, 4 Data, Insight, Conclusion) + FAQ | 6 (P1 recap, fomo, soft-socializing, healing-culture, bed-rotting, P3 tease) | 1 (bar: AI paradox) | false |
| 3 | `part-3-infrastruktur-fisik-isolasi.md` | 1,021 | 6 (Hook, Konteks, 4 Data, Insight, Conclusion) | 6 (P2 recap, gen-z-naik-ojol, time-poverty, quiet-living, friendship-recession, P4 tease) | 0 | false |
| 4 | `part-4-kesepian-sebagai-desain.md` | 1,038 | 6 (Hook, Konteks, 4 Data, Insight, Conclusion) | 6 (P1-3 recap, industri-penderitaan, generasi-stroberi, friendship-recession) | 1 (funnel: substitution) | false |

## Quality Gates

### G1: Structure
- All parts: 6+ content h2 (Hook, Konteks, 4 Data/Analysis sections, Insight, Conclusion) ✅
- Section balance: Hook ~10%, Konteks ~15%, Data ~40%, Insight ~15%, Conclusion ~10%, Teaser ~5% ✅
- Part 1 & 2 have FAQ section ✅

### G2: Evidence
- All angka in body have source attribution ✅
- Source references in frontmatter: P1=11, P2=8, P3=8, P4=9 ✅
- No unsourced numbers ✅

### G3: Tone
- TAM voice: jujur, rasional, berani, tidak menggurui ✅
- Human signature: min 1 per part ✅
  - P1: "Gue sering perhatikan di Jakarta. Anak muda kumpul di mobil..."
  - P2: "Gue pernah coba curhat ke ChatGPT. Ngetik panjang, cerita masalah..."
  - P3: "Gue pernah coba jalan kaki dari stasiun MRT Bendungan Hilir ke kantor..."
  - P4: "Gue nulis ini bukan karena gue punya solusi..."
- No em dash: 0 across all parts ✅
- No ellipsis: 0 across all parts ✅
- Max 1 exclamation mark: 0 across all parts ✅

### Cross-Part Consistency
- Tone: consistent kontra-narasi ✅
- Terminology: "third place", "substitusi digital", "walkability", "infrastruktur kesepian" consistent ✅
- Data: RTH 5.59% (P1, P4), 59.4% curhat AI (P2, P4), 19% kesepian remaja (P1, P4) — no contradiction ✅
- Recap: P2 recap matches P1 conclusion, P3 recap matches P2 conclusion, P4 recap matches P1-3 ✅
- Teaser: P1 tease "yang menggantikan ruang" → P2 hook AI companion ✅, P2 tease "infrastruktur fisik" → P3 hook trotoar ✅, P3 tease "satu pola" → P4 hook pattern recognition ✅

## Hook/Foreshadow/Teaser Implementation

| Part | Hook formula | Foreshadow formula | Next Tease formula |
|------|-------------|-------------------|-------------------|
| 1 | #19 Reframe ✅ | #02 Curiosity ✅ | Curiosity Tease ✅ |
| 2 | #22 Hidden Truth ✅ | #06 Transformation ✅ | Escalation ✅ |
| 3 | #26 System Failure ✅ | #15 Connection Tease ✅ | Setup-Payoff ✅ |
| 4 | #14 Pattern Recognition ✅ | #06 Transformation ✅ | Resolution Tease ✅ |

## Series Draft Quality Score (0-12)

| Factor | Weight | Score | Justification |
|--------|--------|-------|---------------|
| **Structure** | 2 | 2 | 6+ h2 per part (4 Data sections each) |
| **Evidence** | 2 | 2 | 100% angka have source, 36 sourceReferences total |
| **Tone** | 2 | 2 | Full TAM voice + human signature per part, no AI patterns |
| **Cross-part** | 2 | 2 | Fully consistent: tone, terminology, data, recap, teaser |
| **Word count** | 1 | 1 | All 1,000-1,250 (within 1,000-2,500 range) |
| **Internal links** | 1 | 1 | P1=3, P2=6, P3=6, P4=6 (all 3+) |
| **Storytelling** | 1 | 1 | Strong hook + cliffhanger per part, escalating |
| **Recap/teaser** | 1 | 1 | All accurate, all payoff verified |

**Total Score: 12/12 (min 9)** ✅ PASS

## Checklist

- [x] Semua 4 part ditulis lengkap
- [x] Word count per part: 1,021-1,242 (within 1,000-2,500)
- [x] Heading: h2 only, min 6 content h2 per part
- [x] Internal linking: min 2 + link antar part (P1=3, P2=6, P3=6, P4=6)
- [x] `series` dan `seriesOrder` diisi di frontmatter
- [x] Draft Quality Gates: G1, G2, G3 pass per part
- [x] Cross-Part Consistency: 5 checks pass
- [x] `excerpt`: max 160 karakter per part
- [x] `ogHeadline`: berbeda dari title, max 50 karakter per part
- [x] Episode Hook formula diimplementasi di opening per part
- [x] Episode Foreshadow formula diimplementasi di transition/conclusion per part
- [x] Next Tease / Bridge formula diimplementasi di akhir part 1-3
- [x] Meta description mengandung Hook + Foreshadow element per part (max 160 karakter)
- [x] Series Draft Quality Score: 12/12 (min 9) PASS
- [x] No em dash, no ellipsis, max 1 exclamation mark (all 0)
- [x] Charts: P1 bar (RTH), P2 bar (AI paradox), P4 funnel (substitution pattern)
- [x] FAQ sections: P1 (3 Q&A), P2 (3 Q&A)
- [x] Human signature: 1 per part minimum

## Next

Lanjut ke `/seri-06-review`
