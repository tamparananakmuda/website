# Seri Sistem Pangan Indonesia - Step 10 Schedule

## Meta
- Series: Makanan Murah, Tubuh Mahal
- Slug: sistem-pangan-indonesia
- Created: 2026-08-09
- Status: Schedule complete, ready for step 11-publish

## Schedule

| Part | publishedAt (UTC) | WIB | Day | Status |
|------|-------------------|-----|-----|--------|
| P1 | 2027-01-05T01:00:00.000Z | 08:00 | Selasa | scheduled |
| P2 | 2027-01-06T01:00:00.000Z | 08:00 | Rabu | scheduled |
| P3 | 2027-01-07T01:00:00.000Z | 08:00 | Kamis | scheduled |
| P4 | 2027-01-08T01:00:00.000Z | 08:00 | Jumat | scheduled |
| P5 | 2027-01-09T01:00:00.000Z | 08:00 | Sabtu | scheduled |
| P6 | 2027-01-10T01:00:00.000Z | 08:00 | Minggu | scheduled |
| P7 | 2027-01-11T01:00:00.000Z | 08:00 | Senin | scheduled |

**Pattern**: 1 part/day, 1-day gap, all 08:00 WIB (01:00 UTC) slot
**Cron**: GitHub Actions every 5 min auto-publish + OG gen

## Conflict Check

| Series | Dates | Conflict? |
|--------|-------|-----------|
| Sistem Finansial Indonesia | Aug 1-6, 2026 | No |
| Sistem Hukum Indonesia | Sep 15-22, 2026 | No |
| Industri Penderitaan Gen Z | Nov 1-7, 2026 | No |
| Infrastruktur Kesepian | Dec 1-4, 2026 | No |
| **Sistem Pangan Indonesia** | **Jan 5-11, 2027** | **No conflict** |

## Config Update

- `content/config.ts` line 85: status updated from `coming-soon` to `scheduled`
- `expectedDate: '2027-01-05'` added (matches P1 publishedAt)

## Schedule Verification Protocol

| Check | Result | Detail |
|-------|--------|--------|
| Part 1 first | PASS | P1: 2027-01-05 < P2: 2027-01-06 |
| No overlap | PASS | 7 unique slots for 7 parts |
| Gap tolerance | PASS | Max gap: 1 day (max 3) |
| Slot consistency | PASS | All at 01:00 UTC (08:00 WIB) |
| Cron awareness | PASS | GitHub Actions every 5 min auto-publish + OG gen |
| Future date valid | PASS | All > now (2026-08-09) |

**All 6 checks: PASS**

## Series Schedule Quality Score (0-10)

| Factor | Weight | Score | Notes |
|--------|--------|-------|-------|
| Part 1 first | 2 | 2 | P1 first, slot optimal (08:00 WIB) |
| Gap | 1 | 1 | 1 day gap |
| Slot | 1 | 1 | Konsisten 08:00 WIB |
| Status | 1 | 1 | Semua scheduled |
| Cron | 1 | 1 | Set + verified (publish-scheduled.yml) |
| Verification | 1 | 1 | All 6 checks pass |
| Cadence | 2 | 2 | Konsisten 1 part/day |
| Binge-read | 1 | 1 | Designed for binge (1/day, 7 days) |
| **TOTAL** | **10** | **10** | (target: min 8) PASS |

## Checklist

- [x] Jadwal rilis per part ditentukan: Jan 5-11, 2027
- [x] `status` dan `publishedAt` benar per part: all scheduled, all 01:00 UTC
- [x] `CRON_SECRET` set di Vercel dan GitHub Secrets (sudah ada dari seri sebelumnya)
- [x] GitHub Actions workflow deployed (`.github/workflows/publish-scheduled.yml`)
- [x] Part 1 publish/schedule sebelum part lain: P1 = Jan 5, earliest
- [x] Gap antar part max 3 hari: 1 day gap
- [x] Schedule Verification: all 6 checks pass
- [x] Series Schedule Quality Score: 10/10 (target: min 8) PASS
- [x] Config updated: status='scheduled', expectedDate='2027-01-05'
- [x] No conflict with other scheduled series

## Next

Lanjut ke `/seri-11-publish`
