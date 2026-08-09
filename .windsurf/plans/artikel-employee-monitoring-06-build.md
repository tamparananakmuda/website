# Artikel Build Plan: Kerja Remote Bukan Bebas, Laptop-mu Jadi Pengawas

## Pre-Flight Check
- **Slug uniqueness:** AVAILABLE (no existing file)
- **Category:** karier — valid (Karier)
- **Author:** yovie-setiawan — valid (Yovie Setiawan)

## File Created
- **Path:** `content/articles/karier/kerja-remote-bukan-bebas-laptop-jadi-pengawas.md`
- **Status:** draft (will be set to scheduled after QC)
- **publishedAt:** 2026-09-15T01:00:00+00 (Sep 15, 08:00 WIB)

## Frontmatter Verification

| Field | Value | Pass? |
|-------|-------|-------|
| title | Kerja Remote Bukan Bebas, Laptop-mu Jadi Pengawas | PASS |
| slug | kerja-remote-bukan-bebas-laptop-jadi-pengawas | PASS |
| excerpt | 160 chars | PASS (≤160) |
| publishedAt | 2026-09-15 01:00:00+00 | PASS (not null) |
| status | draft | PASS (will update to scheduled after QC) |
| category | karier | PASS |
| subcategory | karier-korporat | PASS |
| author | yovie-setiawan | PASS |
| series | null | PASS (standalone) |
| seriesOrder | null | PASS |
| povTag | kontra-narasi | PASS |
| tags | 7 tags | PASS |
| ogHeadline | Laptop kerjamu bukan alat, itu pengawas perusahaan | PASS (50 chars, ≠ title) |
| seoMetaTitle | Kerja Remote Bukan Bebas, Laptop-mu Jadi Pengawas | PASS (≤70 chars) |
| seoMetaDescription | 160 chars | PASS (≤160) |
| seoKeywords | 7 keywords | PASS |
| sourceReferences | 15 items, isArray | PASS |
| featured | false | PASS |
| readingTime | 9 | PASS (not 1) |
| humanSignature | true | PASS |
| factCheckStatus | verified | PASS |
| reviewStatus | publish | PASS |
| coverImageUrl | null | PASS (dynamic OG) |
| coverImageAlt | null | PASS |

## SEO Metadata Validation

| Field | Rule | Result |
|-------|------|--------|
| seoMetaTitle | Max 70, keyword present | PASS — 49 chars, "kerja remote" + "laptop" |
| seoMetaDescription | Max 160, keyword + hook | PASS — 160 chars, hook + foreshadow |
| slug | Kebab-case, max 60, keyword | PASS — 51 chars, "kerja-remote" + "laptop" |
| excerpt | Max 160, ≠ seoMetaDescription | PASS — 160 chars, different content |
| ogHeadline | Max 50, ≠ title, punchy | PASS — 50 chars, different, hook-style |
| seoKeywords | 3-8, all in body | PASS — 7 keywords |

## Schema Readiness

| Schema | Trigger | Fields needed | Ready? |
|--------|---------|---------------|--------|
| Article | All articles | title, slug, excerpt, publishedAt, author, category | PASS |
| FAQPage | h3 headings in FAQ section | 3 Q&A pairs present | PASS |
| BreadcrumbList | Automatic | category > article | PASS |
| Person | Author page | author slug valid | PASS |

## OG Image Verification

| Check | Result |
|-------|--------|
| ogHeadline set | PASS — "Laptop kerjamu bukan alat, itu pengawas perusahaan" |
| ogHeadline ≠ title | PASS |
| ogHeadline ≤ 50 chars | PASS — 50 chars |
| Category color | karier category has color in config |
| Image URL | Will auto-generate via cron when status=scheduled |

## Internal Link Verification

| Link | Target | Exists? | Anchor descriptive? |
|------|--------|---------|---------------------|
| /artikel/technostress-gen-z-beban-digital-kerja-hybrid | technostress-gen-z-beban-digital-kerja-hybrid.md | FOUND | "technostress dan beban digital kerja hybrid" |
| /artikel/quiet-firing-perusahaan-paksa-kamu-keluar | quiet-firing-perusahaan-paksa-kamu-keluar.md | FOUND | "quiet firing: perusahaan paksa kamu keluar" |
| /artikel/quiet-quitting-bukan-malas-sistem-kerja-nggak-mau-bayar-hati | quiet-quitting-bukan-malas-sistem-kerja-nggak-mau-bayar-hati.md | FOUND | "quiet quitting karena sistem tidak mau bayar hati" |
| /artikel/wlb-bukan-permintaan-syarat-bertahan-gen-z | wlb-bukan-permintaan-syarat-bertahan-gen-z.md | FOUND | "WLB bukan permintaan, tapi syarat bertahan" |

**4/4 links valid, all descriptive anchors**

## Interactive Blocks

| Block | Type | JSON valid? |
|-------|------|-------------|
| Adopsi Employee Monitoring 2020-2026 | bar chart | PASS — 4 data points, valid JSON |

## Article Inventory

- **Entry:** #202
- **Updated:** files/article-inventory.md

## Post-Insert Verification

| Check | Result |
|-------|--------|
| publishedAt not null | PASS |
| author not null | PASS |
| category not null | PASS |
| sourceReferences isArray | PASS |
| excerpt ≤ 160 | PASS |
| ogHeadline ≠ title | PASS |
| ogHeadline ≤ 50 | PASS |
| readingTime valid (9) | PASS |
| internal links ≥ 2 (4) | PASS |
| h2 ≥ 3 (10) | PASS |
| word count ≥ 1000 (1718) | PASS |

**All checks passed.**

## Build Quality Score (0-10)

| Factor | Weight | Score | Notes |
|--------|--------|-------|-------|
| Frontmatter completeness | 2 | 2 (strong) | All fields filled |
| SEO metadata | 2 | 2 (strong) | 6/6 fields pass |
| File creation | 1 | 2 (strong) | Created at correct path |
| Schema readiness | 1 | 2 (strong) | Article + FAQ + Breadcrumb + Person ready |
| OG image | 1 | 2 (strong) | ogHeadline unique, punchy, 50 chars |
| Internal links | 1 | 2 (strong) | 4 links, all valid, descriptive anchors |
| Inventory | 1 | 2 (strong) | Updated, format correct |
| Post-insert verification | 1 | 2 (strong) | CLEAN |

**Total Score: 10/10** → **PASS** (target: min 8)

## Checklist

- [x] Slug uniqueness dicek
- [x] Category dan author valid
- [x] File `content/articles/karier/kerja-remote-bukan-bebas-laptop-jadi-pengawas.md` created
- [x] Frontmatter lengkap dan valid
- [x] `sourceReferences` isArray = true (15 items)
- [x] `excerpt` <= 160 chars (160)
- [x] `publishedAt` tidak null
- [x] `readingTime` di-set (9)
- [x] SEO Metadata Validation: 6 fields pass
- [x] Schema Markup Verification: Article + FAQ ready
- [x] OG Image Verification: ogHeadline set, unique, 50 chars
- [x] Internal Link Verification: 4 links, semua target exists, descriptive anchor
- [x] Interactive blocks: 1 chart with valid JSON
- [x] Article inventory updated (#202)
- [x] Post-Insert Verification: CLEAN
- [x] Build Quality Score: 10/10 (PASS)

## Next

Lanjut ke `/artikel-07-qc`
