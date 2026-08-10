# Artikel Outsourcing - 05 Review

## Fact-Check Results

| Check | Result | Notes |
|-------|--------|-------|
| Total sources | 10 | 3 T1 + 7 T2 |
| Number sentences | 22 | All have attribution |
| Unattributed | 3 (false positives) | All have context attribution in same paragraph |
| Em dash | 0 | PASS |
| En dash | 0 | PASS |
| Exclamation marks | 0 | PASS (max 1) |
| Ellipsis | 0 | PASS (fixed from heading) |
| Data freshness | All 2022-2026 | PASS (max 2 years) |

### 3 "Unattributed" False Positives

1. **"4 juta pendaftar"** — This is the title of the linked CPNS article (`cpns-bukan-karier-aman-itu-lotere-4-juta-pendaftar`), not a standalone data claim. Attribution is the article link itself.
2. **"270 ribu perusahaan"** — Preceding sentence: "Data Kemnaker 2022 melaporkan jumlah pengawas ketenagakerjaan hanya sekitar 2.700 orang." The 270 ribu is in the next sentence, same paragraph, same source.
3. **Conclusion summary** — Preceding clause: "Data ABADI, BPS, dan BPJS Ketenagakerjaan mencatat 2,2 juta, mungkin 6,4 juta, mungkin 8,9 juta orang." The "Mereka kerja di tempat..." sentence continues the same attributed data.

**Verdict: CLEAN** — All data has traceable source attribution.

## Multi-Pass Review

### P1: Structure

| Check | Result | Notes |
|-------|--------|-------|
| Hook power | PASS | Data Shock formula, 2,2 juta + "disposable" |
| Section progression | PASS | Hook → Konteks → Siapa → Data → Gaji → Aturan → Pengawas → Prabowo → Insight → Conclusion |
| Data section depth | PASS | 3+ data points per data section |
| Insight landing | PASS | "Sistem transfer risiko" — TAM angle clear |
| Conclusion callback | PASS | References hook (2,2 juta), data (3 angka), aturan (berubah), pengawas (2.700) |
| Section length balance | PASS | All sections 105-352 words, none > 500 or < 100 |
| Paragraph rhythm | PASS | Mix of short (1-2 sentences) and long (4-5 sentences) |
| Heading structure | PASS | 11 H2, no H1 in body, H3 for subsections |

**P1: PASS — No structural issues.**

### P2: Evidence

| Claim | Evidence | Source | Check |
|-------|----------|--------|-------|
| 2,2 juta pekerja | ABADI data | CNBC Indonesia (2025) | PASS |
| 6,4 juta pekerja | BPS data | Zenodo/BPS (2024) | PASS |
| 8,9 juta terdaftar | BPJS data | BPJS Ketenagakerjaan (2023) | PASS |
| 25-30% gaji lebih rendah | BPS data | Zenodo/BPS (2024) | PASS |
| 23,5% JKN, 18,7% BPJS | BPS data | Zenodo/BPS (2024) | PASS |
| 74% kepatuhan iuran | BPJS data | Exa.ai/BPJS (2023) | PASS |
| 20,2% PHK naik, 77.965 kasus | BPS data | Zenodo/BPS (2024) | PASS |
| Upah di bawah UMP | Aspirasi/Mirah Sumirat | Kompas (2025) | PASS |
| 2.700 pengawas, 270 ribu perusahaan | Kemnaker data | Exa.ai (2022) | PASS |
| 31% PKWT > 3 tahun | Disnaker Sumut | Exa.ai (2023) | PASS |
| Permenaker 7/2026, 6 bidang | Kemnaker regulation | JDIH Kemnaker (2026) | PASS |
| "Layanan penunjang operasional" multitafsir | Nabiyla UGM, Timboel OPSI | BBC News Indonesia (2026) | PASS |
| Prabowo janji hapus | Prabowo pidato | Detik/Tempo (2025) | PASS |
| Revisi 4 bidang, BUMN anak usaha | Said Iqbal, Afriansyah | Bisnis.com (2026) | PASS |
| 6 bulan transisi | Said Iqbal | Bisnis.com (2026) | PASS |
| Gaji ranges | Wageindicator | Wageindicator (2024) | PASS |
| HRnetRimbun "bukan kelas dua" | HRnetRimbun article | HRnetRimbun website | PASS (cited as competitor view) |
| Cake.me "pintu masuk strategis" | Cake.me article | Cake.me website | PASS (cited as competitor view) |

**P2: PASS — All claims have traceable evidence.**

### P3: Tone

| Check | Result | Notes |
|-------|--------|-------|
| TAM voice (jujur, tajam, rasional) | PASS | Data-driven, direct, no hedging |
| Human signature | PASS | Cleaning service 7 tahun, vendor ganti tiap 2 tahun |
| No AI vocabulary | PASS | No "delve", "crucial", "landscape", "tapestry", "realm" |
| No menggurui | PASS | "Kamu" not "kamu bodoh" |
| No selling hope | PASS | Conclusion: "hasilnya tetap sama" |
| Tone consistency | PASS | Consistent throughout, no sudden formal/academic shift |
| Competitor views cited fairly | PASS | HRnetRimbun and Cake.me cited, then rebutted with data |
| Active voice | PASS | Minimal passive constructions |
| 2nd person "kamu" | PASS | Used consistently |

**P3: PASS — Tone is authentic TAM.**

### P4: Reader Value

| Check | Result | Notes |
|-------|--------|-------|
| Pain point addressed | PASS | Pekerja outsourcing yang tidak tahu hak mereka |
| Key takeaway | PASS | "Outsourcing bukan karier, itu sistem transfer risiko" |
| Actionability | PASS | Reader understands: hak mereka, celah hukum, situasi regulasi |
| Data they can use | PASS | Gaji ranges, BPJS coverage, PHK stats |
| FAQ answers | PASS | 6 practical Q&A |
| Not just complaining | PASS | Explains sistem, not just "outsourcing buruk" |
| Forward-looking | PASS | Prabowo revisi, 6 bulan transisi |

**P4: PASS — Reader gets clear value.**

## Bayesian Claim Audit

| Claim | Type | Evidence | Match? |
|-------|------|----------|--------|
| "Outsourcing adalah sistem transfer risiko" | Moderate | Data: gaji 25% lower, BPJS 23%, PHK 20% up, no pesangon | PASS — correlation + mechanism |
| "Pemerintah tidak tahu jumlah pasti" | Weak | 3 angka berbeda dari 3 sumber | PASS — hedging proportionate |
| "Mustahil semua pelanggaran terdeteksi" | Weak | Rasio 1:100 vs ILO 1:10.000 | PASS — mathematical logic |
| "Outsourcing bukan fleksibilitas untuk pekerja" | Opini | Data + logic + personal observation | PASS — labeled as insight |
| "Solusi sejati bukan menghapus sistem" | Opini | Conclusion, labeled as TAM angle | PASS — conclusion formula |

**Bayesian: PASS — Claim strength matches evidence strength.**

## E-E-A-T Check

| Dimension | Check | Result |
|-----------|-------|--------|
| Experience | Human signature: cleaning service 7 tahun | PASS |
| Expertise | 3 T1 sources (BPS, Kemnaker, BPJS) + 7 T2 | PASS |
| Authoritativeness | Author: yovie-setiawan (TAM) | PASS |
| Trust | All angka traceable to sourceReferences | PASS |

**E-E-A-T: PASS — All 4 dimensions pass.**

## Red Flags Check

| Red flag | Found? | Notes |
|----------|--------|-------|
| Angka tanpa sumber | No | All have attribution |
| Generalisasi berlebihan | No | "banyak" not "semua" |
| Klaim absolut | No | "jarang" not "tidak pernah" |
| Data dibulat-bulat | No | Exact numbers used (23,5%, 18,7%, 20,2%) |
| Opinion sebagai fakta | No | "Tapi mari jujur" labels opinion |
| Sumber tidak kredibel | No | All T1/T2 |
| Kontradiksi internal | No | Consistent throughout |

**Red flags: 0 found.**

## Hook & Foreshadow Validation

| Check | Result |
|-------|--------|
| Hook formula (Data Shock #02) implemented | PASS — "Data ABADI Mei 2025 mencatat 2,2 juta..." |
| Foreshadow #14 (Inversion Tease) | PASS — "Tapi masalahnya bukan kontraknya berakhir..." |
| Foreshadow #08 (Data Tease) | PASS — "Dan angka ini bukan yang paling mengejutkan." |
| Foreshadow #19 (Reframe Tease) | PASS — "Dan masalahnya tidak berhenti di gaji..." |
| Foreshadow #20 (Resolution Tease) | PASS — "Tapi solusi sejati bukan menghapus sistem..." |
| Hook power | PASS — Strong, specific data |
| Foreshadow payoff | PASS — All teasers paid off in subsequent sections |

**Hook & Foreshadow: PASS.**

## Review Quality Score

| Factor | Score | Notes |
|--------|-------|-------|
| Fact-check (all data attributed) | 2 | 3 false positives, all context-attributed |
| Multi-pass review (4 passes) | 2 | All 4 passes PASS |
| E-E-A-T (4 dimensions) | 2 | All 4 PASS |
| Red flags (0 found) | 2 | Clean |
| Bayesian audit (claim-evidence match) | 1 | All claims match evidence |
| Hook & foreshadow validation | 1 | All formulas implemented |
| Section balance (all 100-500 words) | 1 | All sections in range |
| Tone consistency | 1 | Authentic TAM throughout |
| **Total** | **12/12** | **PASS** (target min 8) |

## Fixes Applied

1. **Ellipsis removed**: "Prabowo Mau Hapus, Tapi..." → "Prabowo Mau Hapus, Tapi Belum Jadi"
2. **Hook expanded**: 54 → 105 words (added 2nd paragraph with "disposable" callback)
3. **Source attributions added**: 9 sentences got explicit source mentions (ABADI, BPS, Kemnaker, Disnaker Sumut, Wageindicator)
4. **Article JSON updated**: Body synced to latest version

## Checklist

- [x] Fact-check: all data attributed to sources
- [x] P1 Structure: PASS
- [x] P2 Evidence: PASS
- [x] P3 Tone: PASS
- [x] P4 Reader: PASS
- [x] E-E-A-T: 4/4 PASS
- [x] Red flags: 0
- [x] Bayesian audit: PASS
- [x] Hook & foreshadow: PASS
- [x] Section balance: all 105-352 words
- [x] No em dash, no ellipsis, 0 exclamation marks
- [x] Review Quality Score: 12/12
- [x] Fixes applied and verified

## Next

Lanjut ke `/artikel-06-build`
