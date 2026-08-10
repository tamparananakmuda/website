# Artikel Outsourcing - 08 Humanizer

## Humanizer Audit Results (29 categories)

| Category | Result | Notes |
|----------|--------|-------|
| 1. Punctuation (em/en dash, curly quotes, ellipsis) | CLEAN | 0 found |
| 2. AI vocab EN | CLEAN | 0 found |
| 3. AI vocab ID | CLEAN | 0 found |
| 4. Staccato drama | CLEAN | Max run 2 (fixed in QC step) |
| 5. Rule of three | CLEAN | 2 (fixed in QC step) |
| 6. Negative parallelisms | CLEAN | 0 |
| 7. Curly quotes | CLEAN | 0 |
| 8. -ing superficial | FALSE POSITIVE | 5 matches, all "Outsourcing akan/adalah" (ID words, not EN gerunds) |
| 9. Promotional | CLEAN | 0 |
| 10. Signposting | CLEAN | 0 |
| 11. Filler phrases | CLEAN | 0 |
| 12. Generic conclusions | CLEAN | 0 |
| 13. Exclamation marks | CLEAN | 0 (max 1) |
| 14. Human signature | PASS | 37 personal pronouns (kita/kamu/saya) |
| 15. Copula avoidance | CLEAN | 0 |
| 16. Authority tropes | CLEAN | 0 |
| 17. Rhetorical openers | CLEAN | 0 |
| 18. Hyphenated overuse | CLEAN | 0 (di-outsourcing fixed: 6 → 0) |
| 19. Significance emphasis | CLEAN | 0 |
| 20. Notability emphasis | CLEAN | 0 |
| 21. Challenges/future prospects | CLEAN | 0 |
| 22. False ranges | CLEAN | 0 |
| 23. Inline-header lists | CLEAN | 0 |
| 24. Emojis | CLEAN | 0 |
| 25. Collaborative artifacts | CLEAN | 0 |
| 26. Knowledge-cutoff disclaimers | CLEAN | 0 |
| 27. Sycophantic tone | CLEAN | 0 |
| 28. Excessive hedging | CLEAN | 0 |
| 29. Tailing negations | CLEAN | 0 |
| 30. Diff-anchored writing | CLEAN | 0 |
| 31. Ellipsis | CLEAN | 0 |
| 32. benar-benar overuse | CLEAN | 0 |

## Fixes Applied

### di-outsourcing hyphenated overuse (6 → 0)

Replaced 6 instances of "di-outsourcing" with Indonesian alternatives:
1. "boleh di-outsourcing" → "boleh dialihdayakan" (Konteks section)
2. "tidak boleh di-outsourcing" → "tidak boleh" (Konteks section)
3. "bisa di-outsourcing" → "bisa dialihdayakan" (Konteks section)
4. "tidak boleh di-outsourcing" → "tidak boleh dialihdayakan" (Aturan section)
5. "bisa di-outsourcing" → "bisa diserahkan ke vendor" (Aturan section)
6. "boleh di-outsourcing" → "boleh dialihdayakan" (Celah Multitafsir section)

### -ing superficial (FALSE POSITIVE - no fix needed)

5 regex matches but all are "Outsourcing akan" / "Outsourcing adalah" — Indonesian words where "outsourcing" ends in "ing" and "a" is the start of "akan"/"adalah". Not English "-ing" gerund constructions.

## Human Signature Verification

| Check | Result |
|-------|--------|
| Personal pronouns (kita/kamu/saya) | 37 (min 3) PASS |
| Human signature paragraph | "Saya pernah ngobrol dengan seorang cleaning service yang sudah 7 tahun di gedung yang sama..." PASS |
| Opinions/reactions present | Yes: "Tapi mari jujur. Outsourcing bukan fleksibilitas untuk pekerja." PASS |
| Tone: jujur, rasional, berani, tidak menggurui | PASS |
| Inclusive "kita" and "kamu" | PASS (no "Anda") |

## Tone Consistency Check

| Section | Tone | Notes |
|---------|------|-------|
| Hook | Data-driven, direct | TAM voice |
| Konteks | Factual, contextual | TAM voice |
| Kamu Kerja untuk Siapa | Explanatory, concrete example (PT Maju Jaya) | TAM voice |
| Data yang Tidak Cocok | Analytical, questioning | TAM voice |
| Gaji 25% Lebih Rendah | Data-heavy, empathetic | TAM voice |
| Aturan yang Berubah | Legal analysis, critical | TAM voice |
| 2.700 Pengawas | Data, logical argument | TAM voice |
| Prabowo Mau Hapus | Political analysis, balanced | TAM voice |
| Insight | Opinion, human signature | TAM voice |
| Conclusion | TAM formula (tamparan + resolution tease) | TAM voice |
| FAQ | Practical, neutral | TAM voice |

Tone consistency: PASS throughout

## Formula Preservation Check

| Formula | Status |
|---------|--------|
| Hook (Data Shock #02) | Intact: "Data ABADI Mei 2025 mencatat 2,2 juta..." |
| Foreshadow #14 (Inversion Tease) | Intact: "Tapi masalahnya bukan kontraknya berakhir..." |
| Foreshadow #08 (Data Tease) | Intact: "Dan angka ini bukan yang paling mengejutkan." |
| Foreshadow #19 (Reframe Tease) | Intact: "Dan masalahnya tidak berhenti di gaji..." |
| Foreshadow #20 (Resolution Tease) | Intact: "Tapi solusi sejati bukan menghapus sistem..." |
| Conclusion (Tamparan + Resolution Tease) | Intact: "nama sistemnya bisa berubah, hasilnya tetap sama." |

## OG Headline & SEO Check

| Field | Value | Constraint | Status |
|-------|-------|-----------|--------|
| ogHeadline | "Kerja di perusahaan yang tidak kenal kamu" | Max 50, != title | PASS (41 chars) |
| seoMetaDescription | 140 chars | Max 160 | PASS |
| seoMetaTitle | 49 chars | Max 70 | PASS |
| excerpt | 138 chars | Max 160 | PASS |

## Post-Humanizer QC

| Check | Value | Status |
|-------|-------|--------|
| Word count | 2.412 | PASS |
| Staccato max run | 2 | PASS |
| Rule of three | 2 | PASS |
| AI vocab | 0 | PASS |
| Em dash | 0 | PASS |
| Exclamation | 0 | PASS |
| Internal links | 5 | PASS |
| Duplicated sentences | 0 | PASS |

Post-humanizer QC: CLEAN

## Article File Updated

- `content/articles/karier/outsourcing-bukan-karier-kamu-bisa-diganti-besok.md` updated
- `humanSignature: true` set in frontmatter

## Checklist

- [x] 29 humanizer categories audited
- [x] di-outsourcing hyphenated overuse fixed (6 → 0)
- [x] -ing superficial: false positive confirmed (ID words, not EN gerunds)
- [x] Human signature: 37 personal pronouns, 1 signature paragraph
- [x] Tone consistency: TAM voice throughout all 11 sections
- [x] Formula preservation: Hook, 4 foreshadows, conclusion all intact
- [x] OG headline different from title, ≤50 chars
- [x] SEO meta description ≤160 chars
- [x] Post-humanizer QC: CLEAN
- [x] humanSignature: true set in frontmatter
- [x] Article file updated

## Next

Lanjut ke `/artikel-09-publish`
