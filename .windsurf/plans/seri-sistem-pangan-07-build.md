# Seri Sistem Pangan Indonesia - Step 07 Build

## Meta
- Series: Makanan Murah, Tubuh Mahal
- Slug: sistem-pangan-indonesia
- Created: 2026-08-09
- Status: Build complete, ready for step 08-qc

## Pre-Flight File Check
- Series registered in `content/config.ts`: PASS (slug: sistem-pangan-indonesia, expectedParts: 7, status: coming-soon)
- Slug uniqueness: PASS (all 7 slugs unique, no conflicts)
- File path: `content/seri/sistem-pangan-indonesia/part-{N}-*.md` (7 files created)

## Frontmatter Verification (7/7 PASS)

| Part | title | slug | excerpt | publishedAt | status | series | seriesOrder | ogHeadline | seoMetaTitle | seoMetaDescription | seoKeywords | sourceReferences | tags | humanSignature |
|------|-------|------|---------|-------------|--------|--------|-------------|------------|--------------|-------------------|-------------|------------------|------|----------------|
| P1 | PASS | PASS | PASS | PASS | scheduled | PASS | 1 | PASS | PASS | PASS | PASS (6) | PASS (5) | PASS (6) | PASS |
| P2 | PASS | PASS | PASS | PASS | scheduled | PASS | 2 | PASS | PASS | PASS | PASS (6) | PASS (6) | PASS (6) | PASS |
| P3 | PASS | PASS | PASS | PASS | scheduled | PASS | 3 | PASS | PASS | PASS | PASS (6) | PASS (4) | PASS (6) | PASS |
| P4 | PASS | PASS | PASS | PASS | scheduled | PASS | 4 | PASS | PASS | PASS | PASS (6) | PASS (2) | PASS (6) | PASS |
| P5 | PASS | PASS | PASS | PASS | scheduled | PASS | 5 | PASS | PASS | PASS | PASS (6) | PASS (3) | PASS (6) | PASS |
| P6 | PASS | PASS | PASS | PASS | scheduled | PASS | 6 | PASS | PASS | PASS | PASS (6) | PASS (5) | PASS (6) | PASS |
| P7 | PASS | PASS | PASS | PASS | scheduled | PASS | 7 | PASS | PASS | PASS | PASS (6) | PASS (6) | PASS (6) | PASS |

## SEO Metadata Validation (7/7 PASS)

| Part | seoMetaTitle < 70 | seoMetaDesc < 200 | slug < 60 | excerpt < 160 | ogHeadline < 50 | ogHeadline != title | keywords 3-8 | tags 3-7 |
|------|-------------------|-------------------|-----------|---------------|-----------------|---------------------|--------------|----------|
| P1 | PASS | PASS | PASS | PASS | PASS | PASS | PASS (6) | PASS (6) |
| P2 | PASS | PASS | PASS | PASS | PASS | PASS | PASS (6) | PASS (6) |
| P3 | PASS | PASS | PASS | PASS | PASS | PASS | PASS (6) | PASS (6) |
| P4 | PASS | PASS | PASS | PASS | PASS | PASS | PASS (6) | PASS (6) |
| P5 | PASS | PASS | PASS | PASS | PASS | PASS | PASS (6) | PASS (6) |
| P6 | PASS | PASS | PASS | PASS | PASS | PASS | PASS (6) | PASS (6) |
| P7 | PASS | PASS | PASS | PASS | PASS | PASS | PASS (6) | PASS (6) |

## Navigation Verification (7/7 PASS)

| Part | Prev link | Next link | Recap link | Teaser link |
|------|-----------|-----------|------------|-------------|
| P1 | N/A | PASS | N/A | PASS |
| P2 | PASS | PASS | PASS | PASS |
| P3 | PASS | PASS | PASS | PASS |
| P4 | PASS | PASS | PASS | PASS |
| P5 | PASS | PASS | PASS | PASS |
| P6 | PASS | PASS | PASS | PASS |
| P7 | PASS | N/A | PASS | N/A |

## Internal Links Verification (7/7 PASS)

| Part | TAM article links | Cross-part links | All targets exist |
|------|-------------------|------------------|-------------------|
| P1 | 2 (conscious-consumption, kopi-gen-z) | 1 (P2) | PASS |
| P2 | 2 (doom-spending, overconsumption-core) | 1 (P3) | PASS |
| P3 | 2 (gen-z-belanja-12-juta, beli-rumah) | 1 (P4) | PASS |
| P4 | 2 (pulang-bukan-gagal, beli-rumah) | 1 (P5) | PASS |
| P5 | 2 (time-poverty, langganan-digital) | 1 (P6) | PASS |
| P6 | 2 (bpjs-kelas-3, pajak-gen-z) | 1 (P7) | PASS |
| P7 | 2 (generasi-stroberi, quarter-life-crisis) | 0 (resolution) | PASS |

## Chart JSON Verification (7/7 PASS)

| Part | Chart type | Valid JSON | title | source | data array |
|------|-----------|-----------|-------|--------|------------|
| P1 | bar | PASS | PASS | PASS | PASS |
| P2 | bar | PASS | PASS | PASS | PASS |
| P3 | bar | PASS | PASS | PASS | PASS |
| P4 | bar | PASS | PASS | PASS | PASS |
| P5 | pie | PASS | PASS | PASS | PASS |
| P6 | bar | PASS | PASS | PASS | PASS |
| P7 | bar | PASS | PASS | PASS | PASS |

## Article Inventory Updated
- 7 new entries added (#177-#183) to `files/article-inventory.md`
- Format: `| # | Title | Slug | Kategori | Pillar | POV | Published |`

## Series Build Quality Score (0-12)

| Factor | Weight | Score | Notes |
|--------|--------|-------|-------|
| Frontmatter | 2 | 2 | Semua fields terisi di 7/7 parts |
| Series fields | 2 | 2 | series + seriesOrder valid, match config |
| SEO metadata | 1 | 1 | Semua 6 fields pass di 7/7 parts |
| Navigation | 2 | 2 | Full prev/next + recap/teaser di semua parts |
| Internal links | 1 | 1 | 3+ per part (2 TAM + 1 cross-part) |
| OG headline | 1 | 1 | Unique + punchy, max 50 chars, != title |
| File creation | 1 | 1 | Path benar: content/seri/sistem-pangan-indonesia/ |
| Post-insert | 1 | 1 | CLEAN (all verification checks pass) |
| Inventory | 1 | 1 | Updated + format benar |
| **TOTAL** | **12** | **12** | (target: min 9) PASS |

## Checklist

- [x] Seri didefinisikan di `content/config.ts`
- [x] Slug uniqueness dicek per part
- [x] File `content/seri/sistem-pangan-indonesia/SLUG.md` created per part (7 files)
- [x] `series` dan `seriesOrder` valid di frontmatter per part
- [x] Article inventory updated per part (#177-#183)
- [x] SEO Metadata Validation: 6 fields pass per part (7/7)
- [x] Schema Markup: FAQ section per part (3 Q&A each)
- [x] OG Image: ogHeadline unique, max 50 chars per part (7/7)
- [x] Internal Link: min 2 + antar part, semua target exists (7/7)
- [x] Interactive blocks: 7 charts with valid JSON
- [x] Reading Progress Bar: otomatis (component di artikel page layout)
- [x] Series Navigation: prev/next link konsisten antar part (7/7)
- [x] Post-Insert Verification: CLEAN per part
- [x] Series Build Quality Score: 12/12 (target: min 9) PASS

## Next

Lanjut ke `/seri-08-qc`
