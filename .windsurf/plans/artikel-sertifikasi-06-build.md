# Artikel 06-Build: Sertifikasi Bukan Investasi

## Pre-Flight Check

| Check | Hasil | Status |
|-------|-------|--------|
| Slug uniqueness | `sertifikasi-bukan-investasi-kerja-belum-pasti` - AVAILABLE | PASS |
| Category valid | `karier` → "Karier" | PASS |
| Author valid | `yovie-setiawan` → "Yovie Setiawan" | PASS |

## File Created

```
content/articles/karier/sertifikasi-bukan-investasi-kerja-belum-pasti.md
```
Size: 16.752 bytes

## Frontmatter

| Field | Value | Status |
|-------|-------|--------|
| title | Sertifikasi Bukan Investasi, Bayar Jutaan untuk Kerja Belum Pasti | OK |
| slug | sertifikasi-bukan-investasi-kerja-belum-pasti | OK (45 char) |
| excerpt | Gen Z bayar jutaan untuk sertifikasi PMP, AWS, Google, IELTS. Tapi perusahaan tetap cari pengalaman, bukan sertifikat. | OK (118 char) |
| publishedAt | 2026-09-14 01:00:00+00 | OK (Sep 14, 2026 08:00 WIB) |
| status | scheduled | OK (cron auto-publish) |
| category | karier | OK |
| subcategory | null | OK |
| author | yovie-setiawan | OK |
| series | null | OK |
| seriesOrder | null | OK |
| povTag | kontra-narasi | OK |
| tags | sertifikasi, pengangguran, karier, credential-inflation, gen-z, upskill, bnsp | OK (7 tags) |
| ogHeadline | Sertifikat jutaan nggak jamin kamu diterima kerja | OK (49 char, != title) |
| seoMetaTitle | Sertifikasi Bukan Investasi, Bayar Jutaan untuk Kerja Belum Pasti | OK (65 char, max 70) |
| seoMetaDescription | Gen Z bayar jutaan untuk sertifikasi PMP, AWS, Google, IELTS. Tapi 1,03 juta sarjana menganggur. Perusahaan tetap cari pengalaman, bukan sertifikat. | OK (148 char, max 160) |
| seoKeywords | 10 keywords | OK |
| sourceReferences | 15 items, array of {type, url, label} | OK |
| featured | false | OK |
| readingTime | 8 | OK |
| humanSignature | true | OK |
| factCheckStatus | verified | OK |
| reviewStatus | publish | OK |
| isSponsored | false | OK |
| isPremium | false | OK |
| coverImageUrl | null | OK (dynamic OG) |
| coverImageAlt | null | OK |

## SEO Metadata Validation

| Field | Rule | Value | Status |
|-------|------|-------|--------|
| seoMetaTitle | Max 70, contains keyword | 65 char, "sertifikasi" present | PASS |
| seoMetaDescription | Max 160, keyword + hook | 148 char, hook + foreshadow | PASS |
| slug | Kebab-case, max 60, keyword | 45 char, "sertifikasi" present | PASS |
| excerpt | Max 160, != seoMetaDescription | 118 char, different from meta desc | PASS |
| ogHeadline | Max 50, != title, punchy | 49 char, different, conversational | PASS |
| seoKeywords | 3-8 keywords in body | 10 keywords, all in body | PASS |

6/6 fields pass ✓

## Schema Markup Readiness

| Schema | Fields ready | Status |
|--------|-------------|--------|
| Article | headline (title), author, datePublished (publishedAt), image (dynamic OG) | READY |
| FAQPage | 4 Q&A pairs in body (mainEntity) | READY |
| BreadcrumbList | Auto by layout | READY |

## Internal Link Verification

| # | Anchor | Target slug | File exists | Status |
|---|--------|-------------|-------------|--------|
| 1 | kursus online Rp5 juta yang tidak menjamin kerja | kursus-online-rp5-juta-nggak-bikin-kamu-diterima-kerja | content/articles/teknologi/ | PASS |
| 2 | skill not school, tapi sistem tetap pakai ijazah | skill-not-school-tapi-sistem-tetap-pakai-ijazah | content/articles/karier/ | PASS |
| 3 | S1 rebutan loker SMK, pendidikan tinggi jadi trap | s1-rebutan-loker-smk-pendidikan-tinggi-jadi-trap | content/articles/karier/ | PASS |
| 4 | magang gratis yang dikemas pengalaman | magang-gratis-bukan-belajar-eksploitasi-dikemas-pengalaman | content/articles/karier/ | PASS |
| 5 | ikatan dinas yang menjualmu ke perusahaan | ikatan-dinas-bukan-beasiswa-kamu-dijual-ke-perusahaan | content/articles/kehidupan/ | PASS |
| 6 | career cushioning, bukan tidak loyal tapi survival | career-cushioning-bukan-tidak-loyal-survival-era-phk | content/articles/karier/ | PASS |

6/6 links valid, all descriptive anchor ✓

## Interactive Blocks Verification

| Block | Type | JSON valid | Data points | Status |
|-------|------|-----------|-------------|--------|
| Chart 1 | bar | YES | 5 (BNSP, PMP, AWS, IELTS, Google) | PASS |
| Chart 2 | line | YES | 6 (Agu 2022 - Mei 2026) | PASS |

## Post-Insert Verification

| Check | Value | Status |
|-------|-------|--------|
| slug | sertifikasi-bukan-investasi-kerja-belum-pasti | OK |
| status | scheduled | OK |
| publishedAt | 2026-09-14 01:00:00+00 | OK |
| category | karier | OK |
| author | yovie-setiawan | OK |
| sourceReferences isArray | true (15 items) | OK |
| ogHeadline | 49 char, != title | OK |
| seoMetaTitle | 65 char | OK |
| seoMetaDescription | 148 char | OK |
| excerpt | 118 char | OK |
| readingTime | 8 | OK |
| internal links | 6 | OK |
| h1 | 0 | OK |
| h2 | 9 | OK |
| h3 | 10 | OK |
| charts | 2 (valid JSON) | OK |
| FAQ | 4 Q&A | OK |
| word count | 1.683 | OK |

**All checks passed. CLEAN.**

## Article Inventory

Updated `files/article-inventory.md` with:
```
| 194 | Sertifikasi Bukan Investasi, Bayar Jutaan untuk Kerja Belum Pasti | sertifikasi-bukan-investasi-kerja-belum-pasti | Karier | Karier & Pekerjaan | kontra-narasi | 2026-09-14 (scheduled 08:00 WIB) |
```

## Build Quality Score: 10/10 (target: min 8)

| Factor | Weight | Score | Justifikasi |
|--------|--------|-------|-------------|
| **Frontmatter completeness** | 2 | 2 | Semua fields terisi |
| **SEO metadata** | 2 | 2 | 6/6 fields pass |
| **File creation** | 1 | 1 | Created di content/articles/karier/ |
| **Schema readiness** | 1 | 1 | Article + FAQPage + Breadcrumb ready |
| **OG image** | 1 | 1 | ogHeadline unique + punchy (49 char) |
| **Internal links** | 1 | 1 | 6 links, semua valid, descriptive anchor |
| **Inventory** | 1 | 1 | Updated + format benar |
| **Post-insert verification** | 1 | 1 | CLEAN |

## Checklist

- [x] Slug uniqueness dicek
- [x] Category dan author valid
- [x] File `content/articles/karier/sertifikasi-bukan-investasi-kerja-belum-pasti.md` created
- [x] Frontmatter lengkap dan valid
- [x] `sourceReferences` isArray = true (15 items)
- [x] `excerpt` <= 160 chars (118)
- [x] `publishedAt` tidak null (2026-09-14 01:00:00+00)
- [x] `readingTime` di-set (8)
- [x] SEO Metadata Validation: 6/6 fields pass
- [x] Schema Markup: Article + FAQPage ready
- [x] OG Image: ogHeadline set, unique, 49 char
- [x] Internal Link Verification: 6 links, semua target exists, descriptive anchor
- [x] Interactive blocks: 2 charts, valid JSON
- [x] Article inventory updated (#194)
- [x] Post-Insert Verification: CLEAN
- [x] Build Quality Score: 10/10 (min 8)

## Next

Lanjut ke `/artikel-07-qc`
