# TAMPARAN ANAK MUDA — Website

Editorial media digital untuk anak muda Indonesia.  
**Tagline:** Menyadarkan generasi muda akan kenyataan.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Database | PostgreSQL via Drizzle ORM |
| Auth | Supabase Auth |
| Storage | Cloudflare R2 (CDN) |
| Email | Brevo (newsletter) + Nodemailer |
| Analytics | Umami (self-hosted) |
| Hosting | Vercel |
| Cron | GitHub Actions |

---

## Prerequisites

- Node.js 20+
- [pnpm](https://pnpm.io/) (`npm install -g pnpm`)
- PostgreSQL database (Supabase project)
- Cloudflare R2 bucket (`cdn-tam`)

---

## Local Setup

```bash
# 1. Clone repo
git clone https://github.com/tamparananakmuda/website.git
cd website

# 2. Install dependencies
pnpm install

# 3. Setup environment variables
cp .env.local.example .env.local
# Edit .env.local dengan nilai yang benar (lihat bagian Environment Variables di bawah)

# 4. Run development server
pnpm dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

---

## Environment Variables

Buat file `.env.local` di root project. Semua variabel yang tidak diawali `NEXT_PUBLIC_` bersifat server-only dan TIDAK BOLEH di-expose ke client.

```env
# Database (Drizzle ORM)
POSTGRES_URL=postgresql://...?pgbouncer=true      # Pooled connection (untuk app runtime)
POSTGRES_URL_NON_POOLING=postgresql://...          # Non-pooled (untuk migrations: drizzle-kit)

# Supabase (Auth only)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...                   # Server-only

# Cloudflare R2 (OG images CDN)
R2_ACCESS_KEY_ID=                                  # Server-only
R2_SECRET_ACCESS_KEY=                              # Server-only
R2_ENDPOINT=https://xxx.r2.cloudflarestorage.com   # Server-only
R2_BUCKET_NAME=cdn-tam
CDN_BASE_URL=https://cdn.tamparananakmuda.com

# App
NEXT_PUBLIC_SITE_URL=http://localhost:3000          # Production: https://tamparananakmuda.com

# Cron (GitHub Actions)
CRON_SECRET=                                        # Wajib untuk /api/cron/* endpoints

# Brevo (Newsletter)
BREVO_API_KEY=                                      # Server-only
BREVO_LIST_ID=                                      # Server-only

# Umami Analytics
NEXT_PUBLIC_UMAMI_URL=https://analytics.tamparananakmuda.com
NEXT_PUBLIC_UMAMI_WEBSITE_ID=                       # UUID website di Umami

# Cloudflare Turnstile (bot protection)
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=                               # Server-only

# On-demand ISR revalidation
REVALIDATE_SECRET=                              # Server-only. Bearer token untuk POST /api/revalidate

# Optional: Upstash Redis (rate limiting distributed)
# Jika tidak diset, rate limiting pakai in-memory fallback (tidak shared across instances)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Optional: Louvin Payment Gateway (Phase 2)
LOUVIN_API_KEY=lv_...                               # Server-only. Harus dimulai dengan lv_
LOUVIN_WEBHOOK_SECRET=                              # Server-only
LOUVIN_PROJECT_SLUG=tamparananakmuda
NEXT_PUBLIC_LOUVIN_ENABLED=false                    # Set true saat fitur donasi siap live

# Optional: Sentry
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_AUTH_TOKEN=                                  # Server-only
```

> **POSTGRES_URL vs POSTGRES_URL_NON_POOLING:**
> - `POSTGRES_URL` — Gunakan untuk semua query di runtime app (pooled via pgBouncer).
> - `POSTGRES_URL_NON_POOLING` — Gunakan hanya untuk database migrations (`pnpm drizzle-kit push` atau `drizzle-kit generate`). Direct connection diperlukan untuk DDL statements.

---

## Common Commands

```bash
# Development
pnpm dev                    # Start dev server (http://localhost:3000)
pnpm build                  # Build production
pnpm start                  # Start production server
pnpm lint                   # Run ESLint
pnpm typecheck              # TypeScript type check

# Testing
pnpm test                   # Run unit tests (Vitest)
pnpm test:watch             # Run tests in watch mode

# Database
pnpm drizzle-kit generate   # Generate migration file dari schema changes
pnpm drizzle-kit push       # Push schema ke database (uses NON_POOLING connection)
pnpm drizzle-kit studio     # Buka Drizzle Studio (DB GUI)

# Scripts
pnpm tsx scripts/generate-all-og.ts    # Regenerate semua OG images
```

---

## Project Structure

```
├── app/                    # Next.js App Router pages & API routes
│   ├── admin/              # Admin panel (protected, role=admin)
│   ├── api/                # API route handlers
│   ├── artikel/[slug]/     # Article detail page
│   ├── error.tsx           # Error boundary (per-segment)
│   ├── global-error.tsx    # Global error boundary (root-level)
│   └── not-found.tsx       # 404 page
├── components/             # Shared React components
│   └── schema/             # JSON-LD schema components
├── content/                # Markdown content (whitepaper, seri)
├── lib/                    # Business logic & utilities
│   ├── db/                 # Drizzle ORM schema, queries, migrations
│   ├── og/                 # OG image template
│   ├── cdn/                # Cloudflare R2 helpers
│   └── rate-limit.ts       # Rate limiting (Redis + in-memory fallback)
├── scripts/                # One-off admin scripts (OG generation, etc.)
├── supabase/               # SQL migration history (legacy reference)
└── files/                  # Strategy & documentation docs
```

---

## Content Publishing

Artikel di-publish via admin panel di `/admin` atau via script insert. Untuk artikel scheduled:

1. Set `status='scheduled'` dan `published_at` ke waktu UTC di masa depan
2. GitHub Actions cron (setiap 5 menit) otomatis publish saat `published_at <= now()`
3. Cron juga otomatis generate OG images setelah publish

**Jam posting ideal (WIB):**
- Pagi: 08:00 WIB (01:00 UTC)
- Siang: 12:00 WIB (05:00 UTC)  
- Sore: 17:00 WIB (10:00 UTC)

---

## Security Notes

- Semua API routes mutating (POST/PUT/PATCH/DELETE) dilindungi origin check di middleware
- Cron routes dikecualikan dari origin check, tapi dilindungi `CRON_SECRET` header
- Rate limiting aktif untuk semua public API endpoints (Redis jika tersedia, in-memory sebagai fallback)
- Newsletter subscribe dilindungi Cloudflare Turnstile bot protection

---

## License

Private. All rights reserved. TAMPARAN ANAK MUDA © 2026.
