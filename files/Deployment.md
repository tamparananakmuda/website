# Deployment.md - Deployment & Infrastructure
# TAMPARAN ANAK MUDA Website

**Versi:** 1.3  
**Status:** Draft - comprehensive deployment & infrastructure spec + Louvin payment + editorial workflow + TikTok pipeline

---

## 1. Infrastructure Overview

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   GitHub     │────▶│   Vercel     │────▶│   CDN Edge   │
│  (Source)    │     │  (Build +    │     │  (Global)    │
│              │     │   Host)      │     │              │
└──────────────┘     └──────────────┘     └──────────────┘
       │                    │
       │             ┌──────┴──────┐
       │             │  Supabase   │
       │             │ (DB+Auth+   │
       │             │  Storage)   │
       │             └─────────────┘
       │
       ▼
  PR Preview
  (Vercel Preview URL)
```

---

## 2. Environments

| Environment | URL | Branch | Purpose |
|---|---|---|---|
| Production | tamparananakmuda.com | `main` | Live website |
| Staging | tam-staging.vercel.app | `staging` | Final QA sebelum ke prod |
| Preview | tam-[hash].vercel.app | Setiap PR | Review per pull request |
| Local | localhost:3000 | Feature branch | Development |

### Staging Environment Setup

1. **Vercel project kedua** untuk `staging` (atau environment di project yang sama).
2. **Supabase project terpisah** untuk staging database - jangan pernah test migration langsung di production.
3. **Isi semua env vars** di Vercel staging dengan nilai staging yang berbeda dari production.
4. **Uptime Kuma** juga monitor staging URL untuk detect issue sebelum production.

---

## 3. CI/CD Pipeline

### Flow
```
Developer push ke feature branch
      │
      ▼
GitHub Actions: Lint + Type check + Tests
      │
      ├── ❌ Fail → Blocked, fix dulu
      │
      ▼ ✅ Pass
PR dibuat ke `staging`
      │
      ▼
Vercel auto-deploy Preview URL
      │
      ▼
Review + QA di Preview URL
      │
      ▼
Merge ke `staging` → Deploy ke staging.vercel.app
      │
      ▼
Final check di staging
      │
      ▼
Merge `staging` → `main`
      │
      ▼
Vercel auto-deploy ke production
      │
      ▼
✅ Live di tamparananakmuda.com
```

### GitHub Actions Workflow

```yaml
# .github/workflows/ci.yml
name: CI/CD

on:
  push:
    branches: [main, staging]
  pull_request:

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test
      - run: npm run build

  migrate-staging:
    needs: check
    if: github.ref == 'refs/heads/staging'
    runs-on: ubuntu-latest
    env:
      SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
    steps:
      - uses: actions/checkout@v4
      - uses: supabase/setup-cli@v1
      - run: supabase link --project-ref ${{ secrets.SUPABASE_STAGING_REF }}
      - run: supabase db push

  migrate-production:
    needs: check
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: production
    env:
      SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
    steps:
      - uses: actions/checkout@v4
      - uses: supabase/setup-cli@v1
      - run: supabase link --project-ref ${{ secrets.SUPABASE_PROD_REF }}
      - run: supabase db push
```

### Branch Strategy

```
feature/* → PR → staging → PR → main
```

- Setiap PR ke `staging` harus pass CI check.
- `staging` branch auto-deploy ke `tam-staging.vercel.app`.
- Merge ke `main` harus pass CI + staging migration + smoke test.
- Production deploy terjadi otomatis setelah merge ke `main`.

---

## 4. Vercel Configuration

### `vercel.json`
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "regions": ["sin1"],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" },
        { "key": "Content-Security-Policy", "value": "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' *.umami.is; style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src 'self' fonts.gstatic.com; img-src 'self' data: blob: *.supabase.co *.unsplash.com; connect-src 'self' *.supabase.co api.resend.com *.umami.is; frame-ancestors 'none';" }
      ]
    },
    {
      "source": "/static/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    },
    {
      "source": "/api/og(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=86400" }
      ]
    }
  ],
  "rewrites": [
    { "source": "/sitemap.xml", "destination": "/api/sitemap" },
    { "source": "/rss.xml", "destination": "/api/rss" }
  ]
}
```

**Region: `sin1` (Singapore)** - paling dekat dengan target user Indonesia

---

## 5. Environment Variables di Vercel

Setup di Vercel Dashboard → Project → Settings → Environment Variables:

```
# Production + Staging
POSTGRES_URL                         → postgresql://[connection-string]
POSTGRES_URL_NON_POOLING             → postgresql://[connection-string-non-pooling]
NEXT_PUBLIC_SUPABASE_URL              → [supabase-url]
NEXT_PUBLIC_SUPABASE_ANON_KEY         → [anon-key]
SUPABASE_SERVICE_ROLE_KEY             → [service-role-key] (auth admin only)
R2_ACCESS_KEY_ID                      → [r2-access-key]
R2_SECRET_ACCESS_KEY                  → [r2-secret-key]
R2_ENDPOINT                           → https://[account-id].r2.cloudflarestorage.com
R2_BUCKET_NAME                        → cdn-tam
CDN_BASE_URL                          → https://cdn.tamparananakmuda.com
CRON_SECRET                           → [cron-secret]
RESEND_API_KEY                         → [api-key]
NEXT_PUBLIC_UMAMI_WEBSITE_ID          → [website-id]
NEXT_PUBLIC_UMAMI_URL                 → https://[umami-instance]/script.js
NEXT_PUBLIC_SENTRY_DSN                → [sentry-dsn]
SENTRY_AUTH_TOKEN                     → [sentry-auth-token]
NEXT_PUBLIC_SITE_URL                  → https://tamparananakmuda.com
UPSTASH_REDIS_REST_URL                → [url]
UPSTASH_REDIS_REST_TOKEN              → [token]

# Louvin Payment Gateway (Phase 2)
LOUVIN_API_KEY                        → [lv_...]
LOUVIN_WEBHOOK_SECRET                 → [secret]
LOUVIN_PROJECT_SLUG                   → tamparananakmuda
NEXT_PUBLIC_LOUVIN_ENABLED            → true / false

# Development only (local .env.local)
POSTGRES_URL                         → postgresql://[connection-string]
POSTGRES_URL_NON_POOLING             → postgresql://[connection-string-non-pooling]
NEXT_PUBLIC_SUPABASE_URL              → [supabase-url]
NEXT_PUBLIC_SUPABASE_ANON_KEY         → [anon-key]
SUPABASE_SERVICE_ROLE_KEY             → [service-role-key] (auth admin only)
R2_ACCESS_KEY_ID                      → [r2-access-key]
R2_SECRET_ACCESS_KEY                  → [r2-secret-key]
R2_ENDPOINT                           → https://[account-id].r2.cloudflarestorage.com
R2_BUCKET_NAME                        → cdn-tam
CDN_BASE_URL                          → https://cdn.tamparananakmuda.com
CRON_SECRET                           → [cron-secret]
RESEND_API_KEY                         → [api-key]
NEXT_PUBLIC_SITE_URL                  → http://localhost:3000
```

---

## 6. Domain Configuration

### DNS Setup (di domain registrar - misalnya Niagahoster/Rumahweb)

```
Type    Name    Value                   TTL
────────────────────────────────────────────
A       @       76.76.21.21            Auto
CNAME   www     cname.vercel-dns.com.  Auto
```

### SSL/HTTPS
- Otomatis di-handle oleh Vercel (Let's Encrypt)
- HTTP → HTTPS redirect: enabled di Vercel settings

---

## 7. Supabase Setup

### Project
```
Project: tamparananakmuda
Region: Southeast Asia (Singapore)
Plan: Free tier
```

### Database Migration
```bash
# Setup Drizzle ORM (migrations)
# Pastikan POSTGRES_URL_NON_POOLING sudah di-set di .env.local
npx drizzle-kit generate  # Generate migration dari lib/db/schema.ts
npx drizzle-kit push      # Push schema ke database

# Atau jalankan SQL migration manual:
# psql $POSTGRES_URL_NON_POOLING -f supabase/migrations/000001_initial_schema.sql
# psql $POSTGRES_URL_NON_POOLING -f supabase/migrations/000003_update_categories.sql
# dst.
```

### Storage Bucket Setup (Cloudflare R2)
```bash
# Create R2 bucket via Cloudflare Dashboard → R2 → Create bucket
# Bucket name: cdn-tam
# Public read access: yes (untuk OG images CDN)
# Set env vars: R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_ENDPOINT, R2_BUCKET_NAME
# CDN domain: https://cdn.tamparananakmuda.com (map via Cloudflare DNS CNAME)
```

### Auth Setup
```bash
# Via Supabase Dashboard → Authentication → Users
# Invite Yovie sebagai admin (email-only, no self-registration)
# Settings → Auth → Email: disable "Confirm email" untuk admin invite
```

### Admin Panel
- Admin panel built into Next.js app at `/admin/*`
- Protected by Supabase Auth middleware
- Accessible only to authenticated admin users
- Tidak perlu deployment terpisah (sama dengan main app)

---

## 8. Deployment Checklist

### Pre-Launch (Satu kali)
- [ ] Domain `tamparananakmuda.com` dikonfigurasi ke Vercel
- [ ] SSL aktif dan redirect HTTPS berfungsi
- [ ] Semua env vars di-set di Vercel (Production), termasuk POSTGRES_URL, R2 vars, CRON_SECRET
- [ ] Drizzle ORM migration dijalankan: `npx drizzle-kit push`
- [ ] Cloudflare R2 bucket `cdn-tam` dibuat dengan public read access
- [ ] `CRON_SECRET` di-set di Vercel dashboard DAN GitHub Secrets (nilai sama)
- [ ] GitHub Actions workflow `.github/workflows/publish-scheduled.yml` ter-deploy
- [ ] Supabase Auth admin user di-invite dengan role `admin`
- [ ] Resend API key di-set dan welcome email aktif
- [ ] Umami instance setup dan website ID dikonfigurasi
- [ ] Sentry project setup dan DSN dikonfigurasi
- [ ] Uptime Kuma monitor homepage, subscribe endpoint, dan Umami instance
- [ ] sitemap.xml accessible
- [ ] robots.txt terkonfigurasi
- [ ] Google Search Console: submit sitemap
- [ ] OG image ter-generate untuk homepage dan artikel published (via `scripts/generate-all-og.ts` atau cron job)
- [ ] CSP headers terverifikasi tidak block resources (cek browser console)

### Pre-Launch Payment (Phase 2)
- [ ] `LOUVIN_API_KEY` di-set di Vercel (server-only)
- [ ] Webhook URL di dashboard Louvin: `https://tamparananakmuda.com/api/donation/webhook`
- [ ] `NEXT_PUBLIC_LOUVIN_ENABLED=true` di production
- [ ] Test transaksi QRIS nominal kecil berhasil
- [ ] Webhook update status donation di database
- [ ] Halaman `/dukung/terima-kasih` tampil dengan benar

### Pre-Launch Editorial Workflow (Phase 1 admin, Phase 2 full)
- [ ] Migration `20260101000005_add_editorial_workflow.sql` berhasil dijalankan
- [ ] Kolom `pov_tag`, `human_signature`, `fact_check_status`, `review_status`, `source_references` ada di tabel `posts`
- [ ] DB constraint untuk `pov_tag` (4 nilai valid) active
- [ ] Admin panel `/admin/editorial` accessible
- [ ] Angle test modal muncul saat transisi draft -> review
- [ ] Human signature checkbox wajib diceklis sebelum publish
- [ ] POV tag selector berfungsi
- [ ] Source reference manager berfungsi (add/delete)
- [ ] Fact-check status indicator berfungsi

### Pre-Launch TikTok Pipeline (Phase 2)
- [ ] Migration `20260101000006_add_tiktok_pipeline.sql` berhasil dijalankan
- [ ] Tabel `tiktok_scripts` dan `hook_lines` ada di database
- [ ] Admin panel `/admin/tiktok` accessible
- [ ] Script generation dari artikel published berfungsi
- [ ] Hook line library CRUD berfungsi
- [ ] Analytics events `tiktok_video_published`, `tiktok_video_views`, `tiktok_profile_click` terkirim ke Umami

### Pre-Deploy (Setiap deploy)
- [ ] `npm run lint` - tidak ada error
- [ ] `npm run type-check` - tidak ada TS error
- [ ] `npm run test` - semua test pass
- [ ] `npm run build` - build sukses di local
- [ ] Supabase migration dijalankan di staging dan production
- [ ] Preview URL dicek di mobile dan desktop
- [ ] Newsletter form dicek berfungsi
- [ ] E2E analytics test pass (Umami script loads, events fire)

### Post-Deploy (Setelah deploy ke prod)
- [ ] Jalankan `scripts/smoke-test.sh`
- [ ] Homepage load dengan benar
- [ ] Artikel sample tampil
- [ ] Newsletter form test (gunakan email test)
- [ ] Check Core Web Vitals (PageSpeed Insights)
- [ ] Check Umami menerima data
- [ ] Check Sentry tidak ada error spike
- [ ] Check Uptime Kuma status green

---

## 9. Rollback Strategy

Vercel menyimpan semua deployment history. Untuk rollback:

1. Masuk Vercel Dashboard → Deployments
2. Pilih deployment sebelumnya
3. Klik "Promote to Production"
4. Rollback instan (< 1 menit)

**Catatan:** Jika deployment baru termasuk database migration, rollback code saja mungkin tidak cukup. Jika migration berbahaya, restore database dari backup sebelum rollback.

---

## 10. Monitoring & Alerting

### Uptime Monitoring
- **Tool:** Uptime Kuma (self-hosted) - selaras dengan `Analytics.md` dan `Architecture.md`
- **Check interval:** 60 detik untuk homepage, 5 menit untuk `/api/subscribe`
- **Alert channels:** Email + Telegram/Discord webhook
- **Setup:**
  - Monitor `https://tamparananakmuda.com`
  - Monitor `https://tamparananakmuda.com/api/subscribe` (HEAD request)
  - Monitor Umami instance (`https://analytics.tamparananakmuda.com`)
  - Monitor Louvin webhook endpoint `/api/donation/webhook` (Phase 2)

### Error Monitoring
- **Tool:** Sentry (free tier) - aktif sejak Phase 1
- **Setup:** `NEXT_PUBLIC_SENTRY_DSN` di Vercel, `SENTRY_AUTH_TOKEN` untuk source maps
- **Alert:** Email notif jika error rate > 0.1% atau error kritis muncul

### Performance Monitoring
- **Real-user:** Web Vitals via `web-vitals` library → Umami/Sentry
- **Lab:** PageSpeed Insights check manual setelah deploy besar
- **Core Web Vitals:** Google Search Console (otomatis setelah ada trafik)

### Deployment Notifications
- Setup Vercel webhook atau GitHub Actions notification ke Slack/Telegram
- Notif: deploy start, deploy success, deploy fail

### Post-Deploy Health Check

```bash
#!/bin/bash
# scripts/smoke-test.sh

set -e
URL="https://tamparananakmuda.com"

curl -sf "$URL" > /dev/null && echo "Homepage OK"
curl -sf "$URL/sitemap.xml" > /dev/null && echo "Sitemap OK"
curl -sf "$URL/rss.xml" > /dev/null && echo "RSS OK"
curl -sf "$URL/robots.txt" > /dev/null && echo "robots.txt OK"
curl -sf "$URL/dukung" > /dev/null && echo "Donation page OK"
```

---

## 11. Changelog

| Versi | Tanggal | Perubahan |
|---|---|---|
| 1.0 | Jun 2026 | Draft awal. |
| 1.2 | Jul 2026 | Louvin payment gateway env vars, webhook setup, payment pre-launch checklist, donation page smoke test. |
| 1.3 | Jul 2026 | Added LOUVIN_PROJECT_SLUG env var, editorial workflow pre-launch checklist, TikTok pipeline pre-launch checklist. |
| 1.4 | Jul 2026 | Updated env vars for Drizzle ORM + R2 + GitHub Actions cron. Replaced Supabase Storage with Cloudflare R2. Updated migration workflow. |
| 1.1 | Jul 2026 | Uptime Kuma, Sentry Phase 1, CI/CD migration, staging setup, smoke test, security headers, env vars sync. |
