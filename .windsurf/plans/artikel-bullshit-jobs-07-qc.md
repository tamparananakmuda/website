# Artikel QC Plan: Bullshit Jobs: Kerjamu Mungkin Nggak Ada Gunanya

## QC Audit Result

| Metric | Value |
|--------|-------|
| Word count | 2,151 |
| H2 count | 8 |
| Internal links | 4 |
| Sources | 14 |
| Personal pronouns | 33 |
| Exclamation marks | 0 |
| Triples (rule of three) | 1 (max 2) |
| Staccato max run | 2 (max 2) |
| **Status** | **CLEAN** |

## Fixes Applied (Round 1 → Round 3)

### Round 1 (8 issues → fixed)
- **AI vocab ID** (3 words): `secara fundamental` → removed, `signifikan` → removed, `mendalam` → removed
- **Staccato drama** (max run 3): Merged "datang, duduk, selesaikan tugas, pulang" into one sentence; merged "Bukan gaji. Bukan sistem penghargaan. Bukan rasa..." into one; merged "Kebahagiaan tidak berbanding lurus..." sentences
- **Rule of three** (5 → 1): Removed triples from definition, WEF prediction, Periskop observation, AI tasks, Australia/Singapura/Hong Kong, Harvard/Gallup/Walton, shit jobs description, clerical/admin/data
- **Fragmented headers** (2): `## AI Justru Mengekspos Pekerjaan Sia-sia` → `## AI Mengekspos Pekerjaan Tanpa Guna`; `## Boreout: Sakit yang Tidak Terlihat` → `## Boreout: Dampak Klinis dari Pekerjaan Hampa`
- **Unattributed numbers** (1): Fixed duplicate "Survei Jobstreet mencatat" text from previous sed replacements; added WEF abbreviation
- **Authority tropes** (1): Removed `yang sebenarnya` from 2 locations (duct-taper + box-ticker sections)
- **Hyphenated overuse** (3 words): `di-automate` → `diautomasi` (2 locations); `sia-sia` reduced from 11 to 6 occurrences by replacing with `tanpa guna` / `nggak ada gunanya`
- **Duplicate text**: Removed triplicated "Survei Jobstreet mencatat Survei Jobstreet mencatat" and "Survei yang sama menemukan Survei yang sama menemukan"
- **AI-generated paragraph**: Removed spurious paragraph with AI patterns (`signifikan`, `dengan demikian`)

### Round 2 (2 issues → fixed)
- **Authority tropes**: `yang sebenarnya` in 2 more locations → replaced with `yang bisa` and `yang tidak`
- **Hyphenated overuse**: `di-automate` → `diautomasi`; `sia-sia` reduced via synonym replacement

### Round 3: CLEAN

## Severity Classification

| Severity | Count | Issues |
|----------|-------|--------|
| S1 (Critical) | 0 | None |
| S2 (Major) | 0 | None |
| S3 (Minor) | 0 | None |
| S4 (Info) | 0 | None |

## Source Quality Audit

| Check | Result | Notes |
|-------|--------|-------|
| URL aktif | PASS | All 14 URLs verified in 05-review |
| Source label | PASS | All 14 have descriptive labels |
| Source type | PASS | All "link" type |
| Tier label | PASS | 7 T1 + 7 T2, no T4 |
| Data match | PASS | All numbers match sources |
| Freshness | PASS | All within max age (Gallup 2026, YouGov 2025, WEF 2025, Paedagogy Dec 2025, Jobstreet 2024) |

## Readability Metrics

| Metric | Target | Actual | Pass? |
|--------|--------|--------|-------|
| Word count | 1,000-2,500 | 2,151 | PASS |
| Reading time | 5-12 min | 11 min | PASS |
| H2 count | Min 5 | 8 | PASS |
| Sentence variety | Mix | Short + long, no staccato | PASS |
| Data density | 1 per 200-300 words | 14 sources / 2,151 words = 1 per 154 words | PASS (dense) |

## Citation Density Check

| Check | Target | Actual | Pass? |
|-------|--------|--------|-------|
| Source count | Min 2 | 14 | PASS |
| Citation per 1,000 words | Min 2 | 6.5 per 1,000 | PASS (strong) |
| Data attribution | 100% | 100% (all numbers attributed) | PASS |
| Source diversity | Min 2 unique | 14 unique URLs | PASS |

## TAM Tone Compliance Score (0-10)

| Factor | Score | Notes |
|--------|-------|-------|
| Jujur | 2 | Fully honest, no exaggeration |
| Tajam | 2 | Direct to the point |
| Rasional | 2 | Data + logic throughout |
| Berani | 2 | Kontra-narasi: "bukan kamu malas, sistemnya" |
| Tidak menggurui | 2 | Empathetic, not lecturing |
| Human signature | 2 | 2 instances (BUMN + Telegram/LinkedIn) |
| No AI pattern | 2 | 0 pola AI detected |
| Reader address | 2 | 33 personal pronouns |
| No generic conclusion | 2 | "Bukan kamu yang nggak bisa diandalkan. Sistemnya." |
| No promotional | 2 | Neutral throughout |

**TAM Tone Score: 10/10** (target: min 7)

## AI Citation Readiness Score (0-6)

| Factor | Score | Notes |
|--------|-------|-------|
| Definisi jelas | 1 | Bullshit jobs defined in 1 sentence in FAQ |
| Data self-contained | 1 | All data can be quoted directly |
| FAQ format | 1 | 5 Q&A with direct answers |
| Heading = answer | 1 | Headings work as standalone answers |
| Source inline | 1 | Sources in same sentence as data |
| Conclusion extractable | 1 | Conclusion is extractable as summary |

**AI Citation Score: 6/6** (target: min 4)

## Hook & Foreshadow Formula Audit

| Check | Result |
|-------|--------|
| og_headline different from title | PASS (40 chars, "Kerjamu mungkin memang nggak ada gunanya") |
| og_headline max 50 chars | PASS (40) |
| excerpt as thumbnail caption max 160 | PASS (145 chars) |
| meta description Hook + Foreshadow | PASS (142 chars) |

## Punchy Title Audit (20 prinsip)

| Principle | Check | Pass? |
|-----------|-------|-------|
| No formal words | No "tidak/memberikan/alasan" | PASS |
| No fear words | No "bahaya/ancaman/mematikan" | PASS |
| No superlatives | No "terbaik/hebat/amazing" | PASS |
| No "kita/kami" | Uses "kerjamu" | PASS |
| No clickbait | No "rahasia/terungkap/viral" | PASS |
| No number words | No "lima/enam/tiga" | PASS |
| No explicit FOMO | No "jangan sampai/segera" | PASS |
| Max 10 words | 7 words | PASS |
| Active verb | "Nggak Ada" | PASS |

## Math Consistency Check

No ratio claims (e.g. "2 dari 3", "setengah") found that conflict with raw numbers. All percentages match their sources.

## Duplicate Sentence Check

0 duplicate sentences detected.

## QC Quality Score (0-12)

| Factor | Weight | Score | Notes |
|--------|--------|-------|-------|
| Audit CLEAN | 2 | 2 (strong) | Fully CLEAN on round 3 |
| Severity | 1 | 2 (strong) | 0 S1, 0 S2, 0 S3, 0 S4 |
| Source quality | 1 | 2 (strong) | 14 sources, T1-T2 |
| Readability | 1 | 2 (strong) | All in range |
| Citation density | 1 | 2 (strong) | 6.5 per 1,000 words |
| TAM Tone | 2 | 2 (strong) | 10/10 |
| AI Citation | 1 | 2 (strong) | 6/6 |
| SEO metadata | 1 | 2 (strong) | All pass |
| Re-run efficiency | 1 | 1 (ok) | 3 rounds to CLEAN |

**Total Score: 10/12** — **PASS** (target: min 9)

## Checklist

- [x] Grammar clean
- [x] SEO metadata valid (title 48, desc 142, slug 45, excerpt 145, keywords 8)
- [x] Tidak ada broken link (4 internal links, all targets exist)
- [x] Formatting markdown benar (8 h2, no h1)
- [x] Readability OK (2,151 words, 11 min reading time)
- [x] `readingTime` di-set (11)
- [x] SEO title tidak ada suffix "| TAM"
- [x] Tidak ada kalimat duplikat
- [x] Math consistency: no conflicting ratios
- [x] Hook & Foreshadow formula audit: og_headline 40 chars, excerpt 145 chars, meta desc 142 chars
- [x] Punchy Title Audit: 9/9 principles pass
- [x] QC audit CLEAN (0 S1, 0 S2, 0 S3)
- [x] Source Quality Audit: 6/6 checks pass
- [x] Citation Density: 6.5 per 1,000 words, 100% data attribution
- [x] TAM Tone Compliance Score: 10/10
- [x] AI Citation Readiness Score: 6/6
- [x] Re-Run Protocol: 3 rounds for CLEAN
- [x] QC Quality Score: 10/12

## Next

Lanjut ke `/artikel-08-humanizer`
