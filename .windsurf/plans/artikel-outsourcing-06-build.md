# Artikel Outsourcing - 06 Build

## Pre-Flight Checks

| Check | Result |
|-------|--------|
| Slug available | PASS — no existing file |
| Category valid | PASS — Karier |
| Author valid | PASS — Yovie Setiawan |
| excerpt ≤ 160 chars | PASS — 138 chars |
| seoMetaDescription ≤ 160 chars | PASS — 140 chars |
| ogHeadline ≤ 50 chars | PASS — 41 chars |
| seoMetaTitle ≤ 70 chars | PASS — 49 chars |
| slug ≤ 60 chars | PASS — 49 chars |
| sourceReferences is array | PASS — 10 items |
| publishedAt set | PASS — 2026-09-26 01:00:00+00 |
| body not empty | PASS — 17,879 chars |

## File Created

`content/articles/karier/outsourcing-bukan-karier-kamu-bisa-diganti-besok.md`

## Frontmatter Verification

| Field | Value |
|-------|-------|
| title | Outsourcing Bukan Karier, Kamu Bisa Diganti Besok |
| slug | outsourcing-bukan-karier-kamu-bisa-diganti-besok |
| status | scheduled |
| publishedAt | 2026-09-26 01:00:00+00 |
| category | karier |
| subcategory | karier-sistem |
| author | yovie-setiawan |
| povTag | data |
| ogHeadline | Kerja di perusahaan yang tidak kenal kamu |
| seoMetaTitle | Outsourcing Bukan Karier, Kamu Bisa Diganti Besok |
| seoMetaDescription | 140 chars |
| seoKeywords | 6 keywords |
| tags | 6 tags |
| excerpt | 138 chars |
| sourceReferences | 10 items (array) |
| readingTime | 12 |
| humanSignature | false (will set true after humanizer) |
| factCheckStatus | verified |
| reviewStatus | publish |
| featured | false |
| coverImageUrl | null (dynamic OG) |

## Internal Links Verification

| # | Target Slug | Status |
|---|------------|--------|
| 1 | magang-gratis-bukan-belajar-eksploitasi-dikemas-pengalaman | FOUND |
| 2 | phk-membongkar-ilusi-kerja-keras-nggak-menjamin-aman | FOUND |
| 3 | cpns-bukan-karier-aman-itu-lotere-4-juta-pendaftar | FOUND |
| 4 | negosiasi-gaji-gen-z-sistem-didesain-kamu-ngga-nanya | FOUND |
| 5 | freelance-bukan-kebebasan-itu-jebakan-tanpa-jaring-pengaman | FOUND |

All 5 internal links: FOUND

## Article Inventory Updated

| # | Title | Slug | Category | Pillar | POV | Date |
|---|-------|------|----------|--------|-----|------|
| 213 | Outsourcing Bukan Karier, Kamu Bisa Diganti Besok | outsourcing-bukan-karier-kamu-bisa-diganti-besok | Karier | Karier & Dunia Kerja | data | 2026-09-26 (scheduled 08:00 WIB) |

## Scheduling

- Status: `scheduled`
- PublishedAt: `2026-09-26 01:00:00+00` (08:00 WIB)
- Cron job every 5 min will auto-publish when `publishedAt <= now()`
- Cron also auto-generates OG image
- No code deploy needed

## Chart Verification

1 bar chart: "Jumlah Pekerja Outsourcing: 3 Sumber, 3 Angka"
- Type: bar
- Data: ABADI (2.2), BPS (6.4), BPJS (8.9)
- Source: "ABADI (2025), BPS (2024), BPJS Ketenagakerjaan (2023)"
- Valid JSON: PASS

## Cleanup

- Temp scripts removed: preflight-outsourcing.ts, build-outsourcing.ts, verify-outsourcing.ts

## Checklist

- [x] Pre-flight: slug available, category valid, author valid
- [x] SEO metadata: all fields within limits
- [x] File created: content/articles/karier/outsourcing-bukan-karier-kamu-bisa-diganti-besok.md
- [x] Frontmatter: all fields correct
- [x] Internal links: 5/5 FOUND
- [x] Article inventory: updated (#213)
- [x] Scheduling: status=scheduled, publishedAt=2026-09-26 01:00:00+00
- [x] Chart: 1 bar chart, valid JSON
- [x] Cleanup: temp scripts removed

## Next

Lanjut ke `/artikel-07-qc`
