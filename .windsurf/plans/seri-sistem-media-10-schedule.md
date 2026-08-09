# Seri Sistem Media Indonesia - Step 10 Schedule

## Series Info
- **Slug**: sistem-media-indonesia
- **Parts**: 7
- **Category**: Teknologi
- **Schedule**: April 1-7, 2027, 08:00 WIB (01:00 UTC) daily

## Schedule Details

| Part | Slug | publishedAt | Status | Slot |
|------|------|-------------|--------|------|
| P1 | konsentrasi-kepemilikan-6-grup-90-persen-berita | 2027-04-01T01:00:00.000Z | scheduled | 08:00 WIB |
| P2 | ekonomi-klik-marah-engagement-iklan | 2027-04-02T01:00:00.000Z | scheduled | 08:00 WIB |
| P3 | algoritma-sebagai-editor-platform-bukan-netral | 2027-04-03T01:00:00.000Z | scheduled | 08:00 WIB |
| P4 | ekosistem-hoax-industri-yang-untung | 2027-04-04T01:00:00.000Z | scheduled | 08:00 WIB |
| P5 | influencer-sebagai-jurnalis-opini-dikemas-fakta | 2027-04-05T01:00:00.000Z | scheduled | 08:00 WIB |
| P6 | kematian-jurnalisme-lokal-daerah-tanpa-suara | 2027-04-06T01:00:00.000Z | scheduled | 08:00 WIB |
| P7 | sintesis-media-tidak-gagal-didesain-bikin-kamu-nggak-percaya | 2027-04-07T01:00:00.000Z | scheduled | 08:00 WIB |

## Config Status
- `content/config.ts`: status='scheduled', expectedDate='2027-04-01'

## Schedule Verification Protocol

| Check | Result | Pass |
|-------|--------|------|
| **Part 1 first** | P1=Apr 1 < P2=Apr 2 < ... < P7=Apr 7 | YES |
| **No overlap** | Each part on different day, no slot collision | YES |
| **Gap tolerance** | 1-day gap between each part (max 3 days) | YES |
| **Slot consistency** | All parts at 01:00 UTC (08:00 WIB) | YES |
| **Cron awareness** | GitHub Actions `publish-scheduled.yml` runs every 5 min with CRON_SECRET | YES |
| **Future date valid** | Apr 2027 is in the future (> now) | YES |

**All 6 checks PASS.**

## Conflict Check

| Series | Schedule | Gap to Sistem Media |
|--------|----------|---------------------|
| Sistem Pangan | Jan 5-11, 2027 | 80 days before |
| Sistem Kesehatan | Feb 1-8, 2027 | 52 days before |
| Sistem Pajak | Mar 1-7, 2027 | 25 days before |
| **Sistem Media** | **Apr 1-7, 2027** | **--** |

No conflicts. 25-day gap from previous series (sistem-pajak ends Mar 7).

## GitHub Actions Cron
- Workflow: `.github/workflows/publish-scheduled.yml`
- Schedule: `*/5 * * * *` (every 5 minutes)
- Endpoint: `https://tamparananakmuda.com/api/cron/publish-scheduled`
- Auth: `CRON_SECRET` in GitHub Secrets
- Auto-publishes scheduled articles + auto-generates OG images

## Series Schedule Quality Score

| Factor | Weight | Score | Points |
|--------|--------|-------|--------|
| Part 1 first | 2 | 2 (Ya + slot optimal 08:00) | 2 |
| Gap | 1 | 2 (1 day) | 1 |
| Slot | 1 | 2 (Konsisten 08:00 WIB) | 1 |
| Status | 1 | 2 (Semua scheduled) | 1 |
| Cron | 1 | 2 (Set + verified) | 1 |
| Verification | 1 | 2 (All pass) | 1 |
| Cadence | 2 | 2 (Konsisten daily) | 2 |
| Binge-read | 1 | 2 (Designed for binge, 1/day x 7) | 1 |

**Total Score: 10/10** (min 8 required)

## Checklist

- [x] Jadwal rilis per part ditentukan
- [x] `status` dan `publishedAt` benar per part
- [x] `CRON_SECRET` set di Vercel dan GitHub Secrets
- [x] GitHub Actions workflow deployed
- [x] Part 1 publish/schedule sebelum part lain
- [x] Gap antar part max 3 hari (1 day)
- [x] Schedule Verification: all 6 checks pass
- [x] Series Schedule Quality Score: 10/10 (min 8)

## Next

Lanjut ke `/seri-11-publish`
