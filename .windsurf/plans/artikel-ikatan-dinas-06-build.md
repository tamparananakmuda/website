# Artikel 06-Build: Ikatan Dinas Bukan Beasiswa

## Build Quality Score: 10/10 (target: min 8)

| Factor | Weight | Score | Justifikasi |
|--------|--------|-------|-------------|
| **Frontmatter completeness** | 2 | 2 | Semua fields terisi (25 fields) |
| **SEO metadata** | 2 | 2 | 6 fields pass (title, desc, slug, excerpt, og, keywords) |
| **File creation** | 1 | 2 | Created di content/articles/kehidupan/ |
| **Schema readiness** | 1 | 2 | Article + FAQPage ready (5 Q&A) |
| **OG image** | 1 | 2 | ogHeadline unique, 50 char, punchy |
| **Internal links** | 1 | 2 | 6 links, 4 unique targets, semua valid |
| **Inventory** | 1 | 2 | Updated entry #186, format benar |
| **Post-insert verification** | 1 | 2 | CLEAN, all checks passed |

## Pre-Flight Check

| Check | Result |
|-------|--------|
| Slug uniqueness | AVAILABLE (no existing file) |
| Category valid | Kehidupan |
| Author valid | Yovie Setiawan |

## SEO Metadata Validation

| Field | Value | Length | Status |
|-------|-------|--------|--------|
| seoMetaTitle | Ikatan Dinas Bukan Beasiswa, Kamu Dijual ke Perusahaan | 54 char | PASS (max 70, keyword "ikatan dinas") |
| seoMetaDescription | Masalahmu bukan biaya kuliah. Ada kontrak 10 tahun... | 126 char | PASS (max 160, keyword + hook) |
| slug | ikatan-dinas-bukan-beasiswa-kamu-dijual-ke-perusahaan | 53 char | PASS (max 60, keyword) |
| excerpt | Masalahnya bukan beasiswa. Ada kontrak 10 tahun... | 123 char | PASS (max 160, different from desc) |
| ogHeadline | Beasiswa ikatan dinas bikin kamu nggak bisa keluar | 50 char | PASS (max 50, different from title) |
| seoKeywords | 7 keywords, all in body | 7 | PASS (3-8 range) |

## File Created

`content/articles/kehidupan/ikatan-dinas-bukan-beasiswa-kamu-dijual-ke-perusahaan.md`

## Frontmatter Summary

| Field | Value |
|-------|-------|
| title | Ikatan Dinas Bukan Beasiswa, Kamu Dijual ke Perusahaan |
| slug | ikatan-dinas-bukan-beasiswa-kamu-dijual-ke-perusahaan |
| status | published |
| publishedAt | 2026-09-13T01:00:00+00 |
| category | kehidupan |
| subcategory | kehidupan-relasi |
| author | yovie-setiawan |
| povTag | kontra-narasi |
| readingTime | 8 |
| ogHeadline | Beasiswa ikatan dinas bikin kamu nggak bisa keluar |
| tags | 7 (ikatan-dinas, beasiswa, kontrak-kerja, denda-resign, pilot-lion-air, sekolah-kedinasan, perbudakan-modern) |
| sourceReferences | 15 (array) |
| featured | false |
| humanSignature | true |
| factCheckStatus | verified |
| reviewStatus | publish |

## Post-Insert Verification

All checks passed:
- publishedAt: set
- author: set
- category: set
- sourceReferences: array
- excerpt: 123 char (max 160)
- readingTime: 8 (not 1)
- ogHeadline: set, different from title

## Internal Link Verification

| # | Target slug | Category | Exists? |
|---|-------------|----------|---------|
| 1 | magang-gratis-bukan-belajar-eksploitasi-dikemas-pengalaman | karier | YES |
| 2 | freelance-transfer-risiko-dari-perusahaan-ke-kamu | bisnis | YES |
| 3 | phk-membongkar-ilusi-kerja-keras-nggak-menjamin-aman | karier | YES |
| 4 | ukt-naik-50-persen-bukan-investasi-utang-sebelum-kerja | kehidupan | YES |

6 total links, 4 unique targets, all valid.

## Chart Verification

| # | Type | Valid | Title | Data points |
|---|------|-------|-------|-------------|
| 1 | bar | YES | Besaran Denda Ikatan Dinas per Profesi/Institusi | 5 |
| 2 | bar | YES | Durasi Ikatan Dinas per Institusi | 5 |

## Schema Markup Readiness

| Schema | Ready? | Fields |
|--------|--------|--------|
| Article | YES | title, author, datePublished, image (OG), publisher |
| FAQPage | YES | 5 Q&A in body (### format) |
| BreadcrumbList | Auto | category > artikel |

## Article Inventory

Updated `files/article-inventory.md` with entry #186.

## Checklist

- [x] Slug uniqueness dicek
- [x] Category dan author valid
- [x] File `content/articles/kehidupan/ikatan-dinas-bukan-beasiswa-kamu-dijual-ke-perusahaan.md` created
- [x] Frontmatter lengkap dan valid (25 fields)
- [x] `sourceReferences` isArray = true (15 entries)
- [x] `excerpt` <= 160 chars (123)
- [x] `publishedAt` tidak null (2026-09-13T01:00:00+00)
- [x] `readingTime` di-set (8, bukan 1)
- [x] SEO Metadata Validation: 6 fields pass
- [x] Schema Markup Verification: Article + FAQPage ready
- [x] OG Image Verification: ogHeadline set, unique, 50 char
- [x] Internal Link Verification: 6 links, 4 unique targets, semua exists
- [x] Interactive blocks: 2 chart:bar, valid JSON
- [x] Reading Progress Bar: otomatis (component di page layout)
- [x] Article inventory updated (#186)
- [x] Post-Insert Verification: CLEAN
- [x] Build Quality Score: 10/10 (> 8)

## Next

Lanjut ke `/artikel-07-qc`
