# Series Schedule Plan: Sakit Itu Mahal (Sistem Kesehatan Indonesia)

**Series**: sistem-kesehatan-indonesia
**Step**: 10-schedule
**Date**: 2026-08-09
**Score**: 10/10 (PASS, target min 8)

## Schedule Details

| Part | PublishedAt | Status | Slot (WIB) | Auto-publish |
|------|-------------|--------|------------|--------------|
| P1 | 2027-02-01T01:00:00.000Z | scheduled | 08:00 | ~176 days |
| P2 | 2027-02-02T01:00:00.000Z | scheduled | 08:00 | ~177 days |
| P3 | 2027-02-03T01:00:00.000Z | scheduled | 08:00 | ~178 days |
| P4 | 2027-02-04T01:00:00.000Z | scheduled | 08:00 | ~179 days |
| P5 | 2027-02-05T01:00:00.000Z | scheduled | 08:00 | ~180 days |
| P6 | 2027-02-06T01:00:00.000Z | scheduled | 08:00 | ~181 days |
| P7 | 2027-02-07T01:00:00.000Z | scheduled | 08:00 | ~182 days |
| P8 | 2027-02-08T01:00:00.000Z | scheduled | 08:00 | ~183 days |

- **Pattern**: 1 part/day, 1-day gap, all 08:00 WIB (01:00 UTC) slot
- **Duration**: Feb 1-8, 2027 (8 days)
- **Cron**: GitHub Actions every 5 min auto-publish + OG gen

## Schedule Verification Protocol

| Check | Result | Status |
|-------|--------|--------|
| Part 1 first | P1 (Feb 1) < P2 (Feb 2) | PASS |
| No overlap | All unique dates | PASS |
| Gap tolerance | 1 day between all parts | PASS |
| Slot consistency | All at 01:00 UTC (08:00 WIB) | PASS |
| Cron awareness | GitHub Actions every 5 min | PASS |
| Future date valid | All > now (Aug 2026) | PASS |

**All 6 checks: PASS**

## Config Verification

- `content/config.ts`: status='scheduled', expectedDate='2027-02-01', expectedParts=8
- No date conflicts with other series (sistem-pangan ends Jan 11, sistem-kesehatan starts Feb 1)

## Conflict Check

- Previous series: sistem-pangan-indonesia (Jan 5-11, 2027) — 21-day gap before this series
- Next series: none scheduled after Feb 8, 2027
- No date overlaps with any other series

## Cron Setup

- GitHub Actions workflow: `.github/workflows/publish-scheduled.yml`
- Cron: `*/5 * * * *` (every 5 minutes)
- Endpoint: `https://tamparananakmuda.com/api/cron/publish-scheduled`
- Auth: `CRON_SECRET` in GitHub Secrets + Vercel env

## Scoring Breakdown

| Factor | Weight | Score | Notes |
|--------|--------|-------|-------|
| Part 1 first | 2 | 2 | P1 first + slot optimal (08:00 WIB) |
| Gap | 1 | 2 | 1 day gap |
| Slot | 1 | 2 | All consistent 08:00 WIB |
| Status | 1 | 2 | All scheduled |
| Cron | 1 | 2 | Set + verified |
| Verification | 1 | 2 | All 6 checks pass |
| Cadence | 2 | 2 | Consistent daily |
| Binge-read | 1 | 1 | Possible after all 8 published |
| **TOTAL** | | **10/10** | |

## Next Step
Proceed to `/seri-11-publish`.
