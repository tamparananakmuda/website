# Seri Infrastruktur Kesepian - Step 10 Schedule

## Meta
- Series: Infrastruktur Kesepian
- Parts: 4
- Schedule already set during build step (07-build)

## Schedule Details

| Part | Slug | PublishedAt (UTC) | WIB | Status | Days from now |
|---|---|---|---|---|---|
| P1 | part-1-kematian-third-place | 2026-12-01T01:00:00.000Z | 08:00 | scheduled | 114 |
| P2 | part-2-substitusi-digital | 2026-12-02T01:00:00.000Z | 08:00 | scheduled | 115 |
| P3 | part-3-infrastruktur-fisik-isolasi | 2026-12-03T01:00:00.000Z | 08:00 | scheduled | 116 |
| P4 | part-4-kesepian-sebagai-desain | 2026-12-04T01:00:00.000Z | 08:00 | scheduled | 117 |

## Schedule Strategy

- **Pattern**: 1 part per day, consecutive days (Dec 1-4, 2026)
- **Slot**: 08:00 WIB (01:00 UTC) - morning reading slot
- **Gap**: 1 day between parts (optimal for binge-read + anticipation)
- **Part 1 first**: Yes, Dec 1 before Part 2 on Dec 2
- **Binge-read**: All 4 parts available by Dec 4, designed for sequential reading

## Schedule Verification Protocol

| Check | Status | Notes |
|---|---|---|
| Part 1 first | PASS | P1 Dec 1 < P2 Dec 2 |
| No overlap | PASS | All 4 different dates |
| Gap tolerance | PASS | 1 day gap (max 3 days) |
| Slot consistency | PASS | All 08:00 WIB (01:00 UTC) |
| Cron awareness | PASS | GitHub Actions every 5 min auto-publish + OG gen |
| Future date valid | PASS | All dates > now (Aug 9, 2026) |

## Cron Setup

- Workflow: `.github/workflows/publish-scheduled.yml`
- Trigger: every 5 minutes
- Endpoint: `/api/cron/publish-scheduled` with CRON_SECRET
- Auto-publish: when `publishedAt <= now()`, status changes to `published`
- Auto-generate OG images on publish
- No code deploy needed for scheduled content

## Series Schedule Quality Score: 10/10

| Factor | Weight | Score | Notes |
|---|---|---|---|
| Part 1 first | 2 | 2 | P1 first + slot optimal (08:00 WIB) |
| Gap | 1 | 1 | 1 day gap (optimal) |
| Slot | 1 | 1 | Konsisten 08:00 WIB |
| Status | 1 | 1 | All scheduled |
| Cron | 1 | 1 | Set + verified |
| Verification | 1 | 1 | All 6 checks pass |
| Cadence | 2 | 2 | Konsisten (1 day, same slot) |
| Binge-read | 1 | 1 | Designed for binge after Dec 4 |
| **TOTAL** | **10** | **10** | |

## Checklist

- [x] Jadwal rilis per part ditentukan (Dec 1-4, 2026)
- [x] `status` dan `publishedAt` benar per part (all scheduled, future dates)
- [x] `CRON_SECRET` set di Vercel dan GitHub Secrets
- [x] GitHub Actions workflow deployed (publish-scheduled.yml)
- [x] Part 1 publish/schedule sebelum part lain (Dec 1 < Dec 2-4)
- [x] Gap antar part max 3 hari (1 day gap)
- [x] Schedule Verification: all 6 checks pass
- [x] Series Schedule Quality Score: 10/10 (target: min 8)

## Ready for /seri-11-publish
