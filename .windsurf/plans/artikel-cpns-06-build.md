# Artikel CPNS - 06 Build

## Pre-Flight File Check

| Check | Result |
|-------|--------|
| Slug uniqueness | PASS — `cpns-bukan-karier-aman-itu-lotere-4-juta-pendaftar` available |
| Category valid | PASS — Karier |
| Author valid | PASS — Yovie Setiawan |
| Internal link targets exist | PASS — All 3 targets verified |

## File Created

| Field | Value |
|-------|-------|
| Path | `content/articles/karier/cpns-bukan-karier-aman-itu-lotere-4-juta-pendaftar.md` |
| Status | published |
| PublishedAt | 2026-09-25T01:00:00+00 |
| ReadingTime | 8 |
| SourceReferences | 10 |

## Post-Insert Verification

| Check | Result |
|-------|--------|
| slug | cpns-bukan-karier-aman-itu-lotere-4-juta-pendaftar |
| status | published |
| publishedAt | 2026-09-25T01:00:00+00 |
| category | karier |
| author | yovie-setiawan |
| sourceReferences isArray | true |
| readingTime | 8 (not 1) |
| ogHeadline | 4 juta orang rebutan 250 ribu kursi CPNS |
| ogHeadline != title | PASS |
| ogHeadline <= 50 chars | PASS (40) |
| excerpt <= 160 chars | PASS (124) |
| seoMetaDescription <= 160 chars | PASS (142) |
| internal links | 3 (min 2) |
| word count | 1,423 |
| **All checks** | **CLEAN** |

## SEO Metadata Validation

| Field | Chars | Limit | Keyword | Status |
|-------|-------|-------|---------|--------|
| seoMetaTitle | 51 | 70 | "CPNS" present | PASS |
| seoMetaDescription | 142 | 160 | "CPNS" + hook | PASS |
| slug | 50 | 60 | "cpns" present | PASS |
| excerpt | 124 | 160 | Unique from desc | PASS |
| ogHeadline | 40 | 50 | Unique from title | PASS |
| seoKeywords | 7 | 3-8 | All in body | PASS |

**6/6 fields PASS**

## Schema Markup Verification

| Schema | Trigger | Fields Ready | Status |
|--------|---------|--------------|--------|
| Article | All articles | headline, author, datePublished, image (OG dynamic) | PASS |
| FAQPage | 3 Q&A in body | mainEntity (3 Q&A pairs) | PASS |
| BreadcrumbList | Auto by layout | itemListElement | PASS |

## OG Image Verification

| Check | Result |
|-------|--------|
| ogHeadline set | "4 juta orang rebutan 250 ribu kursi CPNS" |
| ogHeadline unique from title | PASS |
| ogHeadline <= 50 chars | PASS (40) |
| ogHeadline punchy | PASS — hook format, conversational |
| OG image auto-generate | Cron will generate (scheduled status) |

## Internal Link Verification

| # | Anchor | Target slug | Target exists | Format | Anchor descriptive |
|---|--------|-------------|---------------|--------|-------------------|
| 1 | PHK membongkar ilusi kerja keras | phk-membongkar-ilusi-kerja-keras-nggak-menjamin-aman | PASS | `/artikel/` | PASS |
| 2 | 300 lamaran ditolak | 300-lamaran-ditolak-bukan-pilih-pilih-sistemnya-yang-nggak-mau-kamu | PASS | `/artikel/` | PASS |
| 3 | hustle culture pun sudah berhenti berlari | hustle-culture-kenapa-gen-z-berhenti-berlari | PASS | `/artikel/` | PASS |

**3/3 links PASS, min 2 required**

## Interactive Blocks Verification

| Block | Type | JSON Valid | Status |
|-------|------|------------|--------|
| Chart 1 | `chart:bar` | PASS — 4 data points, title, subtitle, source, yLabel | VALID |

## Article Inventory

| # | Title | Slug | Category | Pillar | POV | Date |
|---|-------|------|----------|--------|-----|------|
| 212 | CPNS Bukan Karier Aman, Itu Lotere 4 Juta Pendaftar | cpns-bukan-karier-aman-itu-lotere-4-juta-pendaftar | Karier | Karier & Dunia Kerja | kontra-narasi | 2026-09-25 (scheduled 08:00 WIB) |

Updated in `files/article-inventory.md`.

## Build Quality Score (0-10)

| Factor | Weight | Score | Notes |
|--------|--------|-------|-------|
| Frontmatter completeness | 2 | 2 | Semua fields terisi |
| SEO metadata | 2 | 2 | 6/6 fields pass |
| File creation | 1 | 1 | Created di correct path |
| Schema readiness | 1 | 1 | Article + FAQ + Breadcrumb ready |
| OG image | 1 | 1 | ogHeadline unique + punchy, 40 chars |
| Internal links | 1 | 1 | 3 links, semua valid, descriptive anchor |
| Inventory | 1 | 1 | Updated + format benar |
| Post-insert verification | 1 | 1 | CLEAN |
| **Total** | | **10/10** | **Target: min 8** PASS |

## Checklist

- [x] Slug uniqueness dicek
- [x] Category dan author valid
- [x] File `content/articles/karier/cpns-bukan-karier-aman-itu-lotere-4-juta-pendaftar.md` created
- [x] Frontmatter lengkap dan valid
- [x] `sourceReferences` isArray = true (10 entries)
- [x] `excerpt` <= 160 chars (124)
- [x] `publishedAt` tidak null (2026-09-25T01:00:00+00)
- [x] `readingTime` di-set (8, bukan 1)
- [x] SEO Metadata Validation: 6/6 fields pass
- [x] Schema Markup Verification: Article + FAQ + Breadcrumb ready
- [x] OG Image Verification: ogHeadline set, unique, 40 chars
- [x] Internal Link Verification: 3 links, semua target exists, descriptive anchor
- [x] Interactive blocks: 1 chart:bar with valid JSON
- [x] Article inventory updated (#212)
- [x] Post-Insert Verification: CLEAN
- [x] Build Quality Score: 10/10 (target min 8) PASS

## Next

Lanjut ke `/artikel-07-qc`
