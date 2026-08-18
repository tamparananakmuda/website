# 08-humanizer: Gacha Bukan Game, Itu Judi dengan Animasi

## Humanizer Edits Applied

### 1. Hyphenated word pair overuse
- Replaced most `cash-out` occurrences with `penukaran uang` or `penukaran item jadi uang sungguhan` (kept `cash-out` only inside ````comparison` JSON block, which is exempt from prose checks).
- Replaced two `variable-ratio reinforcement` occurrences with `sistem reward dengan rasio tidak tetap` / `rasio tidak tetap untuk pemberian reward` while keeping the first h3 heading term once.
- Replaced `undang-undang perjudian` with `UU perjudian` in prose to reduce `undang-undang` overuse (kept one `UU Belgia` and `UU Belanda` usages).

### 2. AI vocabulary scrub
- Verified no `signifikan`, `krusial`, `pada dasarnya`, `penting untuk`, `highlight`, `crucial`, `delve`, `showcase`, `underscore`, `transform`, `unlock`, `leverage`, `realm`, `paradigm`.
- No promotional language: `game-changing`, `seamless`, `revolutionary`, `groundbreaking`.
- No copula constructions: `serves as`, `stands as`, `represents a`, `acts as`.

### 3. Human signature
- Already present in the tone: direct `kamu`/`kita` address, personal observational phrasing (`Kamu taruhan uang asli...`, `Kamu nggak akan berhenti karena seseorang menyuruh`).
- Added/retained concrete personal framing in the Hook and closing sections.
- `human_signature: true` set in `/tmp/tam-article.json`.

### 4. Flow and transition audit
- Removed formal transitions; kept direct bridges (`Tapi angka itu tidak cerita lengkap.` / `Dan itu baru satu masalah.`).
- No signposting (`marilah kita`, `berikut adalah`, `tanpa berpanjang lebar`).
- No filler phrases (`perlu diketahui bahwa`, `pada dasarnya`).

### 5. Staccato and rule-of-three
- No runs of 3+ short sentences.
- No excessive triple lists.
- No negative parallelisms (`tidak hanya... tapi juga`).

## Verification

### Humanizer quick check
- Em/en dash: none
- Curly quotes: none
- Exclamation marks: 1
- AI vocab EN: none
- AI vocab ID: none
- Staccato drama: none
- Rule of three: none
- Negative parallelisms: none
- Promotional: none
- Signposting: none
- Fillers: none
- Generic conclusions: none
- Copula: none
- Authority tropes: none
- Rhetorical openers: none
- Hyphenated overuse: none (prose only, JSON code block exempt)
- Significance emphasis: none
- Notability emphasis: none
- Challenges/future formula: none
- False ranges: none
- Inline-header lists: none
- Emojis: none
- Collaborative artifacts: none
- Knowledge-cutoff: none
- Sycophantic: none
- Excessive hedging: none
- Tailing negations: none
- Diff-anchored: none
- Personal pronouns (kamu/kita/saya): 35

### Re-run `/artikel-07-qc`
- Script: `node /tmp/tam-gacha-qc2.js`
- Result: **CLEAN**
- Word count: 2038
- h2: 7 | h3: 13
- Internal links: 6
- Sources: 13
- Reading time: 11 min

## Formula Preservation Check

- Hook (Counter-Narrative #05): preserved.
- og_headline: `Gacha itu judi, bukan game. Kamu cuma nggak sadar.` (different from title, 48 chars, punchy).
- excerpt: `Game mobile pakai gacha dan loot box, mekanisme judi yang dikemas animasi. Gen Z Indonesia habiskan jutaan untuk karakter virtual tanpa nilai jual kembali.` (158 chars, tease preserved).
- seo_meta_description: same as excerpt, Hook + Foreshadow structure intact.

## Humanizer Quality Score

| Factor | Score |
|--------|-------|
| AI pattern removal | 2/2 (0 patterns) |
| Paragraph rhythm | 1/1 (varied) |
| Concrete ratio | 1/1 (data + examples) |
| Transition quality | 1/1 (natural/strong) |
| Opening lines | 1/1 (all pass) |
| Closing lines | 1/1 (punch + bridge present) |
| TAM voice | 2/2 (kamu/aktif/variasi) |
| Human signature | 1/1 (present) |
| Jargon translation | 1/1 (technical terms explained) |
| Bold usage | 0.5/0.5 (minimal) |
| Flow | 0.5/0.5 (smooth) |
| **Total** | **12/12** |

## Status

- [x] Humanizer edits applied
- [x] `human_signature: true`
- [x] Humanizer check PASS
- [x] Re-run `/artikel-07-qc` CLEAN
- [x] Hook & Foreshadow formula preserved
- [x] SEO metadata intact

**Result: PASS — Ready for `/artikel-09-publish`.**
