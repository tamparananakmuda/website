# Security.md - Security Architecture
# TAMPARAN ANAK MUDA Website

**Versi:** 1.3  
**Status:** Draft - comprehensive security architecture + Louvin payment security + editorial workflow + TikTok pipeline

---

## 1. Threat Model

Untuk website content/blog seperti TAM, threat utama yang relevan:

| Threat | Likelihood | Impact | Priority |
|---|---|---|---|
| API key exposed (Resend, Supabase service role) | Medium | High | 🔴 Critical |
| Spam/bot subscribe newsletter | High | Medium | 🟠 High |
| XSS via user input / Markdown content | Low | High | 🟠 High |
| CSRF pada form subscribe | Medium | Medium | 🟡 Medium |
| DDoS / rate limit abuse | Low | Medium | 🟡 Medium |
| Data scraping | Low | Low | 🟢 Low |
| Supabase unauthorized write (RLS bypass) | Low | High | 🟠 High |
| Unauthorized admin panel access | Low | High | 🟠 High |

---

## 2. API Key & Secret Management

### Rules
- **Tidak ada secret di client-side code** - pernah, tidak, tidak pernah
- Semua API calls ke Resend, DB operations - hanya dari server (API routes Next.js)
- `POSTGRES_URL` dan `R2_SECRET_ACCESS_KEY` HANYA di server, bukan client
- `SUPABASE_SERVICE_ROLE_KEY` hanya untuk Supabase Auth admin operations, bukan untuk DB queries (DB pakai Drizzle ORM)
- Env vars di Vercel environment, bukan di `.env` yang di-commit

### Env Var Classification

```
# SERVER-ONLY (tidak boleh di prefix NEXT_PUBLIC_)
POSTGRES_URL=                    # PostgreSQL connection string untuk Drizzle ORM
POSTGRES_URL_NON_POOLING=        # Untuk Drizzle Kit migrations
RESEND_API_KEY=
R2_ACCESS_KEY_ID=                # Cloudflare R2 S3 access key
R2_SECRET_ACCESS_KEY=            # Cloudflare R2 S3 secret
R2_ENDPOINT=                     # R2 S3 endpoint
R2_BUCKET_NAME=cdn-tam            # R2 bucket name
CRON_SECRET=                     # Auth untuk GitHub Actions cron
SUPABASE_SERVICE_ROLE_KEY=       # Supabase Auth admin only (bukan untuk DB)
LOUVIN_API_KEY=                  # Payment gateway key, JANGAN expose
LOUVIN_WEBHOOK_SECRET=           # Optional: webhook signature verification
LOUVIN_PROJECT_SLUG=             # Project slug di Louvin (server-only)

# CLIENT-SAFE (boleh NEXT_PUBLIC_)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=   # Auth only, safe for client
NEXT_PUBLIC_UMAMI_URL=
NEXT_PUBLIC_UMAMI_WEBSITE_ID=
NEXT_PUBLIC_SENTRY_DSN=
NEXT_PUBLIC_SITE_URL=
CDN_BASE_URL=                    # CDN domain (public, https://cdn.tamparananakmuda.com)
NEXT_PUBLIC_LOUVIN_ENABLED=      # Feature toggle untuk donation (boolean string)

# SERVER-ONLY (opsional, untuk alerting/logging)
SENTRY_AUTH_TOKEN=               # Hanya saat build/upload source maps
```

### Supabase Keys
- **Anon Key** (`NEXT_PUBLIC_SUPABASE_ANON_KEY`): boleh di client - hanya untuk auth session
- **Service Role Key** (`SUPABASE_SERVICE_ROLE_KEY`): TIDAK BOLEH ke client - hanya untuk Supabase Auth admin operations. DB queries menggunakan Drizzle ORM (server-side, pakai `POSTGRES_URL`)

---

## 3. Newsletter API Security

### Endpoint: `POST /api/subscribe`

**Validasi berlapis:**

```typescript
// Layer 1: Input validation
if (!email || typeof email !== 'string') return 400
if (!isValidEmail(email)) return 400
if (email.length > 254) return 400  // RFC 5321 max

// Layer 2: Rate limiting
// Max 3 requests per IP per 10 menit
// Implementasi via Vercel Edge atau upstash/ratelimit

// Layer 3: Server-side call ke Resend
// API key hanya di server, tidak pernah ke client

// Layer 4: Welcome email via Resend
// Subscriber langsung aktif, welcome email dikirim otomatis
```

### Rate Limiting
- Package: `@upstash/ratelimit` + `@upstash/redis` (free tier)
- Config: 3 requests per 10 menit per IP
- Response pada limit: `429 Too Many Requests`

### CSRF Protection
- Next.js App Router API routes tidak rentan CSRF jika tidak pakai cookies untuk auth
- Subscribe form tidak butuh session/auth, so CSRF risk minimal
- Namun: validasi `Content-Type: application/json` header

---

## 4. Content Security Policy (CSP)

```typescript
// next.config.js
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' 
    *.umami.is 
    ${process.env.NEXT_PUBLIC_SUPABASE_URL};
  style-src 'self' 'unsafe-inline' fonts.googleapis.com;
  font-src 'self' fonts.gstatic.com;
  img-src 'self' data: blob: ${process.env.NEXT_PUBLIC_SUPABASE_URL} *.unsplash.com;
  connect-src 'self' ${process.env.NEXT_PUBLIC_SUPABASE_URL} api.resend.com *.umami.is;
  frame-ancestors 'none';
`;
```

**Security Headers (via next.config.js):**
```typescript
headers: [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
]
```

---

## 5. Input Sanitization

### Newsletter Form
- Email: validasi regex + max length, tidak ada output ke DOM
- Tidak ada field lain di Phase 1

### Markdown Content
- Markdown di-parse via `marked` + regex sanitizer di server-side (lihat `components/markdown-content.tsx`)
- Tidak ada `dangerouslySetInnerHTML` dengan unsanitized content
- Tidak menggunakan `isomorphic-dompurify` (crash di Vercel, sudah diganti regex sanitizer)
- Image src hanya dari `self` dan R2 CDN URL (whitelist di CSP)

---

## 6. Database & Auth Security

### Database (Drizzle ORM)
- Semua DB operations menggunakan Drizzle ORM (server-side only, via `POSTGRES_URL`)
- Tidak ada Supabase REST API calls di app code (sudah fully migrated)
- Drizzle ORM queries hanya di Server Components dan API routes
- Tidak ada DB query dari client-side

### Row Level Security (RLS)
**Note:** App code menggunakan Drizzle ORM (server-side only), sehingga RLS tidak relevan untuk app queries. RLS masih aktif di database level sebagai defense-in-depth.
- Semua tabel mengaktifkan RLS (`enable row level security`)
- Public (anon): hanya bisa SELECT pada data `status = 'published'`
- Admin (authenticated): full CRUD
- `SUPABASE_SERVICE_ROLE_KEY` hanya untuk Supabase Auth admin operations, bukan untuk DB queries
- Jangan pernah call Supabase dengan service role dari client-side

### Supabase Auth - Admin Access
- Admin panel (`/admin/*`) protected via middleware
- Middleware cek Supabase session via cookie-based auth
- Hanya email Yovie yang terdaftar sebagai admin di Phase 1
- Supabase dashboard → Authentication → Users → add admin email
- Tidak ada self-registration untuk admin - invite only

```typescript
// middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function middleware(request) {
  let supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll, setAll } }
  )

  const { data: { session } } = await supabase.auth.getSession()

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    // Optionally: check admin role/metadata
  }

  return NextResponse.next()
}
```

### Storage Security (Cloudflare R2)
- R2 bucket `cdn-tam` dibuat dengan public read access
- Upload hanya bisa dari server-side (API routes, cron job, scripts)
- R2 credentials (`R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`) server-only
- CDN domain: `https://cdn.tamparananakmuda.com`
- Allowed types: `image/webp` (OG images), `image/jpeg`, `image/png`, `image/gif`

### CORS Configuration
- Di Supabase dashboard → Settings → API → CORS
- Whitelist: `https://tamparananakmuda.com`, `http://localhost:3000`
- Tidak ada wildcard `*` di CORS config

---

## 7. Dependency Security

```bash
# Audit rutin
npm audit

# Check outdated packages
npm outdated

# Gunakan Dependabot di GitHub untuk auto-alert
```

**Kebijakan:**
- Audit setiap sebelum deploy besar
- Update dependencies minor: bulanan
- Update major: evaluasi per case

---

## 8. Privacy & Data

### Data yang Dikumpulkan
| Data | Cara | Tujuan | Disimpan di |
|---|---|---|---|
| Email subscriber | Form subscribe | Newsletter | Database (Supabase) + Resend |
| Pageview anonymized | Umami | Analytics | Umami (self-hosted) |
| Custom events (click, scroll, share) | Umami | Content optimization | Umami (self-hosted) |
| UTM parameters | URL query | Attribution | Umami (self-hosted) |
| Web Vitals metrics | web-vitals library | Performance monitoring | Umami / Sentry |
| JS errors & performance | Sentry | Debugging & reliability | Sentry |
| IP address (rate limit) | Server | Abuse prevention | Memory only, tidak persistent |
| Artikel content | Admin panel | Website content | PostgreSQL via Drizzle ORM |
| OG images | Cron job / scripts | Website display + social | Cloudflare R2 (cdn-tam) |
| Admin session | Supabase Auth | Admin access | Supabase Auth |

**Analytics-specific notes:**
- Umami tidak menyimpan IP address atau fingerprint user.
- Custom event property tidak boleh mengandung email, nama, atau PII.
- Sentry error data bisa mengandung URL tapi tidak mengandung email atau form input.

### Privacy Policy
- Diperlukan sebelum launch: `/privasi` page
- Minimal harus explain: apa yang dikumpulkan, untuk apa, bagaimana hapus data
- Resend adalah processor data untuk transactional email - perlu disebutkan

### GDPR / UU PDP Indonesia
- Karena target utama Indonesia: fokus ke UU PDP (Undang-Undang Perlindungan Data Pribadi)
- Double opt-in untuk email = consent yang jelas
- Sediakan cara untuk unsubscribe (link unsubscribe di setiap email)

---

## 9. Incident Response (Sederhana)

Jika terjadi security incident:

1. **Rotasi semua API keys** di Vercel environment vars (POSTGRES_URL, R2 keys, CRON_SECRET, Resend, dll)
2. **Audit subscriber list di database** - cek apakah ada anomali
3. **Check Supabase Auth logs** dan Drizzle ORM query patterns
4. **Redeploy** setelah keys dirotasi
5. **Notify** jika data user terdampak (sesuai UU PDP: max 14 hari)

---

## 10. Payment Security (Louvin)

### API Key Protection
- `LOUVIN_API_KEY` hanya di server (API routes). Tidak boleh di frontend, tidak boleh di-commit, tidak boleh di-log.
- Rotate key jika ada indikasi exposure.
- Simpan di Vercel server-only environment variables.

### Webhook Security
- Endpoint `/api/donation/webhook` selalu return HTTP 200, bahkan saat error internal.
- Jika Louvin support webhook secret/signature verification, gunakan `LOUVIN_WEBHOOK_SECRET` untuk verify payload.
- Implement idempotency: jangan proses transaksi yang sama lebih dari sekali (cek `transaction_id`/`reference`).
- Log webhook payload tanpa menyertakan secret atau API key.

### Input Validation
- `amount`: integer > 0, QRIS min Rp 1.500.
- `payment_type`: whitelist dari daftar yang valid (`qris`, `gopay`, `shopeepay`, `bni_va`, `bri_va`, `permata_va`, `cimb_niaga_va`).
- `customer_email`: valid email format jika diisi.
- `customer_name`: max 100 chars, sanitize.
- `message`: max 500 chars, sanitize.

### Rate Limiting & Abuse Prevention
- Max 5 create-transaction per IP per jam.
- Amount cap: max Rp 10.000.000 per transaksi (configurable).
- Monitoring anomalous patterns via Sentry/Umami.

### Data Privacy
- Jangan simpan payment credentials (PIN, OTP, etc.) - Louvin tidak meminta ini.
- Simpan hanya data yang perlu: transaction ID, reference, amount, fee, status, payment method, customer name/email, message.
- Customer name/email opsional - jangan wajibkan.

### Admin Access
- Donation records hanya readable oleh admin via server-side Drizzle ORM queries.
- Jangan expose record donation ke public.

---

## 11. Security Checklist Pre-Launch

- [ ] Semua env vars ada di Vercel, tidak ada di codebase
- [ ] `.env.local` di `.gitignore`
- [ ] Tidak ada `console.log` yang print secrets
- [ ] Rate limiting pada `/api/subscribe` aktif
- [ ] Supabase RLS policies aktif sebagai defense-in-depth (app code pakai Drizzle ORM server-side)
- [ ] `POSTGRES_URL` dan R2 credentials server-only dan tidak di-log
- [ ] Supabase Auth admin hanya untuk email Yovie
- [ ] CORS Supabase hanya whitelist domain yang benar
- [ ] Security headers aktif (verifikasi via securityheaders.com)
- [ ] `npm audit` tidak ada high/critical vulnerability
- [ ] Welcome email via Resend aktif
- [ ] Privacy policy halaman ada
- [ ] HTTPS enforced (Vercel default)
- [ ] Analytics events tidak mengandung PII
- [ ] Sentry DSN client-safe, tidak ada secret di frontend
- [ ] Umami `data-website-id` hanya UUID, tidak sensitive
- [ ] Rate limiting pada tracking endpoint (jika ada custom endpoint)
- [ ] `LOUVIN_API_KEY` server-only dan tidak di-log
- [ ] `/api/donation/create` memiliki rate limiting
- [ ] `/api/donation/webhook` return HTTP 200 selalu
- [ ] Webhook idempotency diimplementasikan
- [ ] Input validation amount & payment_type di create-transaction
- [ ] Donation records tidak di-expose ke public
- [ ] Editorial API routes hanya accessible oleh admin (Supabase Auth + server-side Drizzle queries)
- [ ] Source reference URL validation (no javascript:, data: protocols)
- [ ] POV tag DB constraint active dan tested
- [ ] Human signature enforcement tested (cannot publish without)
- [ ] TikTok API routes hanya accessible oleh admin (Supabase Auth + server-side Drizzle queries)
- [ ] Script content sanitized before storage
- [ ] Video URL validation (https only)
- [ ] `LOUVIN_PROJECT_SLUG` server-only dan tidak di-log

### Editorial Workflow Security
- Admin-only access untuk fact-check status update (`PUT /api/posts/[id]/fact-check`). Admin auth via Supabase Auth + server-side Drizzle query.
- Admin-only access untuk review pipeline status update (`PUT /api/posts/[id]/review-status`). Admin auth via Supabase Auth + server-side Drizzle query.
- Source reference URL validation: hanya URL valid (http/https), tidak boleh `javascript:`, `data:`, atau protocol lain.
- POV tag integrity: hanya 4 nilai valid yang bisa di-set (`kontra-narasi`, `refleksi`, `data`, `framework`). DB constraint sudah ada.
- Human signature tidak bisa di-bypass: publish button disabled jika `human_signature = false`.
- Source references disimpan sebagai jsonb, validasi schema di API route sebelum insert.

### TikTok Pipeline Security
- Admin-only access untuk script generation dan management. Admin auth via Supabase Auth + server-side Drizzle query.
- Script content sanitization: hook line dan body di-sanitize sebelum disimpan (anti-XSS).
- Video URL validation: hanya URL valid (https), tidak boleh `javascript:` atau `data:`.
- Hook line library: admin-only CRUD, tidak ada public access.
- Analytics tracking via Umami custom events, tidak ada TikTok API key di frontend.

---

## 12. Changelog

| Versi | Tanggal | Perubahan |
|---|---|---|
| 1.0 | Jun 2026 | Draft awal. |
| 1.2 | Jul 2026 | Added Louvin payment security: API key protection, webhook security, input validation, rate limiting, payment checklist. |
| 1.4 | Jul 2026 | Updated for Drizzle ORM migration (DB security context), R2 storage security, removed DOMPurify ref, updated env vars. |
| 1.3 | Jul 2026 | Added editorial workflow security (admin-only API access, source reference URL validation, POV tag integrity, human signature enforcement), TikTok pipeline security (admin-only access, content sanitization, video URL validation), LOUVIN_PROJECT_SLUG env var classification. |
| 1.1 | Jul 2026 | Added Sentry, Umami, Uptime Kuma env vars and analytics data collection; analytics-specific security checklist. |
