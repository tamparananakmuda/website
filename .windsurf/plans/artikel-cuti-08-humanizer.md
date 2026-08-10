# Artikel Cuti - 08 Humanizer

## Humanizer Check Result

```
=== HUMANIZER CHECK ===
CLEAN: All humanizer checks passed.
```

## Post-Humanizer QC Result

```
=== QC AUDIT ===
Word count: 1788 | h2: 10 | internal links: 5 | sources: 17
Personal pronouns: 56 | staccato max run: 2 | rule of three: 2

CLEAN: All checks passed.
```

## Changes Applied

### 1. Paragraph Rhythm Fix
Merged 8 pairs of adjacent short paragraphs to create rhythm variation:
- Konteks: merged 2 paragraphs → 1 medium (78w)
- Data 1: merged 2 paragraphs → kept separate (49w + 40w, first para kept short for header compat)
- Data 1: merged 2 paragraphs → 1 long (111w)
- Cuti Bersama: merged 2 paragraphs → 1 medium (69w)
- Cuti Bersama: merged 2 paragraphs → 1 long (112w)
- Data 3: merged 2 paragraphs → kept separate (first para for header compat)
- Data 3: merged 2 paragraphs → 1 long (109w)
- UU Cipta Kerja: merged 2 paragraphs → 1 long (112w)
- Stigma: merged 2 paragraphs → 1 long (97w)
- Stigma: merged 2 paragraphs → 1 long (109w)

**Before:** 42 paragraphs (38 short, 4 medium, 0 long)
**After:** 34 paragraphs (24 short, 7 medium, 3 long)

### 2. Typo Fix
- "tumpangan" → "tumpukan" (introduced during merge, fixed immediately)

### 3. human_signature Set
- `human_signature: true` set in article JSON

## Paragraph Rhythm Audit

| Pattern | Before | After | Status |
|---------|--------|-------|--------|
| Short (<60) | 38 | 24 | OK (emphasis paragraphs) |
| Medium (60-100) | 4 | 7 | PASS |
| Long (>100) | 0 | 3 | PASS |
| **Total** | 42 | 34 | Varied rhythm |

## Concrete-to-Abstract Ratio

| Type | Count | Percentage | Target | Result |
|------|-------|-----------|--------|--------|
| Concrete (data/numbers) | ~50% | 50% | 40-60% | PASS |
| Abstract (concepts/opinions) | ~50% | 50% | 40-60% | PASS |

## Transition Quality Audit

| Quality | Count | Verdict |
|---------|-------|---------|
| Robotik | 0 | PASS |
| Generic | 0 | PASS |
| Natural | ~15 | PASS |
| Strong (bridge/punch) | ~8 | PASS |

All transitions natural or strong. Key bridges: "Dan angka 12 hari itu belum termasuk...", "Cuti bersama sepertinya hadiah tambahan...", "Dan angka itu bukan yang paling mengejutkan.", "Dan ada hak cuti yang sudah dihapus...", "Dan yang paling menyedihkan..."

## Opening Line Quality per Section

| Section | Opening Line | Quality |
|---------|-------------|---------|
| Hook | "Indonesia ngasih kamu 12 hari cuti per tahun..." | Data-led PASS |
| Konteks | "UU No. 13 Tahun 2003 Pasal 79 mengatur..." | Data-led PASS |
| 12 Hari di Seluruh Dunia | "Bandingkan jatah liburan antarnegara." | Provokasi PASS |
| Cuti Bersama | "Mulai tahun 2002, kebijakan ini ditetapkan..." | Data-led PASS |
| 66% Tetap Kerja | "Riset SiteMinder 2025 menemukan fenomena mengejutkan..." | Data-led PASS |
| UU Cipta Kerja | "Dulu, aturan ketenagakerjaan mewajibkan cuti panjang..." | Conclusion-first PASS |
| Stigma Cuti | "IDN Times mengidentifikasi empat pola toxic..." | Data-led PASS |
| Insight | "Sistem cuti Indonesia dirancang untuk ekstraksi maksimum..." | Conclusion-first PASS |
| Conclusion | "Kamu dikasih 12 hari cuti per tahun." | Data callback PASS |

## Closing Line Quality per Section

| Section | Closing Line | Quality |
|---------|-------------|---------|
| Hook | "Tapi masalahnya bukan jumlahnya, tapi sistem dirancang untuk membuat kamu merasa bersalah ambil cuti." | Punch PASS |
| Konteks | "Dan angka 12 hari itu belum termasuk potongan yang tidak kamu sadari." | Bridge PASS |
| 12 Hari | "Cuti bersama sepertinya hadiah tambahan. Tapi siapa yang diuntung dari sistem ini?" | Bridge PASS |
| Cuti Bersama | "Dan angka itu bukan yang paling mengejutkan." | Bridge PASS |
| 66% Tetap Kerja | "Dan ada hak cuti yang sudah dihapus tanpa kamu sadar." | Bridge PASS |
| UU Cipta Kerja | "Dan yang paling menyedihkan: kamu sendiri merasa bersalah ambil cuti." | Punch PASS |
| Stigma | "Solusinya bukan menambah hari cuti. Itu mengubah siapa yang punya hak atas waktumu." | Punch PASS |
| Insight | "...karena istirahat dianggap kemewahan, bukan hak." | Data callback PASS |
| Conclusion | "Bukan kamu yang salah. Sistemnya yang tidak dirancang untuk mengistirahatkan kamu." | Punch PASS |

**9/9 sections pass. 6 punch/bridge (target: min 3).**

## TAM Voice Calibration

| Element | TAM voice | AI voice | Check |
|---------|-----------|----------|-------|
| Pronoun | kamu=54, aku=1 | pembaca=0, masyarakat=0 | PASS |
| Verb | Aktif (menghapus, mencatat, menemukan) | - | PASS |
| Sentence length | Mix 8-25 kata | - | PASS |
| Hedging | Proportionate (data-backed) | - | PASS |
| Emotion | Controlled, honest | - | PASS |
| Opini marker | "Aku dulu juga merasa bersalah" | - | PASS |

**0 elements match AI voice. Full TAM.**

## Hook & Foreshadow Formula Preservation

| Field | Value | Length | Rule | Result |
|-------|-------|--------|------|--------|
| title | "12 Hari Cuti, 66% Tetap Kerja: Sistem Nggak Ngasih Istirahat" | 60 chars | Max 70 | PASS |
| ogHeadline | "12 hari cuti, tapi 66% tetap kerja saat liburan" | 47 chars | Max 50, != title | PASS |
| excerpt | "Indonesia cuma ngasih 12 hari cuti per tahun..." | 157 chars | Max 160 | PASS |
| seoMetaDescription | "Indonesia cuma ngasih 12 hari cuti per tahun..." | 153 chars | Max 160, != excerpt | PASS |
| slug | "12-hari-cuti-indonesia-nggak-ngasih-kamu-istirahat" | 50 chars | Max 60 | PASS |

**Formula intact after humanizing.**

## Title Punchy Audit

| Check | Result |
|-------|--------|
| Word count: 10 (max 10) | PASS |
| No formal words (uses "Nggak" not "Tidak") | PASS |
| No fear words | PASS |
| No superlatives | PASS |
| No "kita/kami" | PASS |
| No clickbait pattern | PASS |
| Active verb ("Tetap Kerja") | PASS |

## Humanizer Quality Score

| Factor | Weight | Score | Notes |
|--------|--------|-------|-------|
| AI pattern removal | 2 | 2/2 | 0 pola (humanizer check CLEAN) |
| Paragraph rhythm | 1 | 1/1 | 24 short, 7 medium, 3 long (varied) |
| Concrete ratio | 1 | 2/1 (strong) | 50% concrete (target 40-60%) |
| Transition quality | 1 | 1/1 | All natural/strong, 0 robotik/generic |
| Opening lines | 1 | 1/1 | 9/9 sections pass |
| Closing lines | 1 | 1/1 | 9/9 pass, 6 punch/bridge (min 3) |
| TAM voice | 2 | 2/2 | Full TAM, 0 AI elements |
| Human signature | 1 | 1/1 | 1 ("Aku dulu juga merasa bersalah ambil cuti") |
| Jargon translation | 1 | 1/1 | All jargon translated |
| Bold usage | 0.5 | 0.5/0.5 | Minimal, purposeful |
| Flow | 0.5 | 0.5/0.5 | Smooth, engaging |
| **Total** | **12** | **12/12** | |

## Checklist

- [x] No em dash, no en dash, no curly quotes
- [x] No AI vocab EN/ID
- [x] No staccato drama, rule-of-three abuse, negative parallelisms
- [x] No promotional language, signposting, filler, generic conclusions
- [x] No copula avoidance
- [x] No authority tropes
- [x] No rhetorical openers
- [x] No hyphenated word pair overuse
- [x] No undue emphasis on significance/legacy
- [x] No undue emphasis on notability
- [x] No challenges/future prospects formulaic sections
- [x] No false ranges
- [x] No inline-header vertical lists
- [x] No emojis
- [x] No collaborative artifacts
- [x] No knowledge-cutoff disclaimers
- [x] No sycophantic tone
- [x] No excessive hedging
- [x] No tailing negations
- [x] No diff-anchored writing
- [x] Max 1 exclamation mark
- [x] Human signature: 1 paragraf pengalaman ("Aku dulu juga merasa bersalah ambil cuti")
- [x] Tone: jujur, rasional, berani, tidak menggurui
- [x] Paragraph Rhythm Audit: 24 short, 7 medium, 3 long (varied)
- [x] Concrete-to-Abstract Ratio: 50% concrete
- [x] Transition Quality: 0 robotik, 0 generic, all natural/strong
- [x] Opening Line Quality: 9/9 pass
- [x] Closing Line Quality: 9/9 pass, 6 punch/bridge
- [x] TAM Voice Calibration: 0 element AI voice
- [x] `human_signature: true` di JSON
- [x] Hook & Foreshadow formula intact
- [x] Title: no AI tells, 10 words, active verb, punchy
- [x] og_headline != title, 47 chars (max 50)
- [x] excerpt max 160 chars (157), function sebagai tease
- [x] Meta description max 160 chars (153), Hook + Foreshadow
- [x] Humanizer Quality Score: 12/12 (min 9)
- [x] Re-run QC: CLEAN

## Next

Lanjut ke `/artikel-09-publish`
