# Artikel Build Plan: Tempat Ketiga Mati

## Pre-Flight Check

| Check | Result |
|-------|--------|
| Slug uniqueness | AVAILABLE (no existing file) |
| Category valid | Kehidupan |
| Author valid | Yovie Setiawan |

## SEO Metadata Validation

| Field | Length | Rule | Result |
|-------|--------|------|--------|
| seoMetaTitle | 49 chars | Max 70, keyword "tempat ketiga" | PASS |
| seoMetaDescription | 154 chars | Max 160, keyword + hook | PASS |
| slug | 42 chars | Max 60, kebab-case | PASS |
| excerpt | 118 chars | Max 160, unique from metaDesc | PASS |
| ogHeadline | 48 chars | Max 50, unique from title | PASS |
| seoKeywords | 7 keywords | 3-8, all in body | PASS |

## File Created

| Field | Value |
|-------|-------|
| Path | `content/articles/kehidupan/tempat-ketiga-mati-gen-z-bayar-atau-pulang.md` |
| Status | scheduled |
| PublishedAt | 2026-09-18T01:00:00.000Z (08:00 WIB) |

## Post-Insert Verification

| Check | Result |
|-------|--------|
| slug | tempat-ketiga-mati-gen-z-bayar-atau-pulang |
| status | scheduled |
| publishedAt | 2026-09-18T01:00:00.000Z |
| category | kehidupan |
| author | yovie-setiawan |
| sourceReferences isArray | true (11 sources) |
| readingTime | 7 |
| ogHeadline | 173 Mall di Jakarta, Taman Gratis Tinggal Cerita |
| excerpt length | 118 (max 160) |
| metaDesc length | 154 (max 160) |
| excerpt != metaDesc | PASS |
| ogHeadline != title | PASS |
| internal links | 5 (min 2) |
| h2 count | 8 (min 3) |
| charts | 2 |
| **Verdict** | **All checks PASSED** |

## Internal Link Verification

| # | Target slug | File exists? | Anchor text |
|---|-------------|-------------|-------------|
| 1 | friendship-recession-gen-z-kehilangan-teman-struktur-hidup | FOUND | kehilangan teman karena struktur hidup, bukan karena tidak mau |
| 2 | soft-socializing-koneksi-digital-bikin-tatap-muka-beban | FOUND | koneksi digital bikin tatap muka jadi beban |
| 3 | time-poverty-gen-z-8-jam-kerja-makan-14-jam-hidupmu | FOUND | 8 jam kerja makan 14 jam hidupmu |
| 4 | doom-spending-bukan-self-care-itu-gejala-menyerah | FOUND | doom spending bukan self-care, itu gejala menyerah |
| 5 | kopi-gen-z-bukan-gaya-hidup-self-medikasi-sistemik | FOUND | kopi Gen Z bukan gaya hidup, itu self-medikasi sistemik |

**All 5 internal links: FOUND, descriptive anchor, no generic.**

## Schema Markup Readiness

| Schema | Ready? | Fields |
|--------|--------|--------|
| Article | Yes | title, author, datePublished, image (OG auto-gen) |
| FAQPage | Yes | 4 Q&A pairs in body (### questions) |
| BreadcrumbList | Auto | category > artikel |

## OG Image Verification

| Check | Result |
|-------|--------|
| ogHeadline set | Yes |
| ogHeadline != title | Yes |
| ogHeadline length | 48 chars (max 50) |
| Category color | kehidupan (config has color) |
| Auto-gen | Cron will generate on publish (scheduled) |

## Article Inventory

| # | Title | Slug | Category | Pillar | POV | Date |
|---|-------|------|----------|--------|-----|------|
| 205 | Tempat Ketiga Mati, Gen Z Bayar atau Pulang | tempat-ketiga-mati-gen-z-bayar-atau-pulang | Kehidupan | Kehidupan & Sosial | kontra-narasi | 2026-09-18 (scheduled) |

## Build Quality Score: 10/10 (target min 8)

| Factor | Weight | Score | Notes |
|--------|--------|-------|-------|
| Frontmatter completeness | 2 | 2 (strong) | All fields terisi |
| SEO metadata | 2 | 2 (strong) | All 6 fields pass |
| File creation | 1 | 1 (ok) | Created di correct path |
| Schema readiness | 1 | 1 (ok) | Article + FAQPage ready |
| OG image | 1 | 1 (ok) | ogHeadline unique + punchy |
| Internal links | 1 | 1 (ok) | 5 links, semua valid |
| Inventory | 1 | 1 (ok) | Updated + format correct |
| Post-insert verification | 1 | 1 (ok) | CLEAN |

## Checklist

- [x] Slug uniqueness dicek
- [x] Category dan author valid
- [x] File `content/articles/kehidupan/tempat-ketiga-mati-gen-z-bayar-atau-pulang.md` created
- [x] Frontmatter lengkap dan valid
- [x] `sourceReferences` isArray = true (11 sources)
- [x] `excerpt` <= 160 chars (118)
- [x] `publishedAt` tidak null (2026-09-18T01:00:00.000Z)
- [x] `readingTime` di-set (7)
- [x] SEO Metadata Validation: 6 fields pass
- [x] Schema Markup Verification: Article + FAQPage ready
- [x] OG Image Verification: ogHeadline set, unique, 48 chars
- [x] Internal Link Verification: 5 links, semua target exists, descriptive anchor
- [x] Interactive blocks: 2 chart:bar dengan valid JSON
- [x] Article inventory updated (#205)
- [x] Post-Insert Verification: CLEAN
- [x] Build Quality Score: 10/10

## Next

Lanjut ke `/artikel-07-qc`
