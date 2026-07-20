# Analytics & Measurement - TAMPARAN ANAK MUDA Website

**Versi:** 1.4  
**Status:** Draft - siap implementasi, revisi target setelah 30 hari data + donation events + editorial & TikTok events

**Tujuan dokumen:** Panduan implementasi analytics, event tracking, reporting, dan experimentation untuk website TAM seluruh phase (1-3).

---

## 1. Analytics Philosophy

> **Ukur untuk belajar, bukan untuk laporan.**

TAM bukan startup yang harus kasih deck ke investor. Analytics di sini fungsinya satu: **bantu kita bikin konten yang lebih baik dan tumbuhkan audiens yang tepat.**

### Operating Principles

1. **Privacy-first by default.** Tidak track PII, tidak pakai cookie, tidak perlu banner consent.
2. **Actionable metrics only.** No vanity metrics. Setiap data harus bisa mengarah ke keputusan konten atau product.
3. **Single source of truth.** Dokumen ini adalah master spec untuk event names, metrics, dan reporting.
4. **Owner & cadence.** Setiap laporan punya owner dan frekuensi review.
5. **Data-informed, not data-driven.** Kualitas konten dan taste TAM tetap utama; data sebagai second opinion.

---

## 2. Tool Stack

| Tool | Fungsi | Data | Tier | Biaya |
|---|---|---|---|---|
| **Umami** | Web analytics (pageview, visitor, custom events) | Self-hosted PostgreSQL | Self-hosted | Gratis |
| **Brevo** | Email analytics (open, click, unsubscribe, bounce) | Brevo cloud | Free tier | Gratis |
| **Google Search Console** | SEO performance (impressions, clicks, ranking) | Google | Free | Gratis |
| **Google PageSpeed Insights / Chrome UX Report** | Core Web Vitals (LCP, CLS, INP) | Google | Free | Gratis |
| **Sentry** | Error tracking & frontend performance | Sentry cloud | Free tier | Gratis |
| **Uptime Kuma** | Uptime monitoring & alert | Self-hosted | Self-hosted | Gratis |
| **web-vitals (npm)** | Real-user Web Vitals measurement | Umami/Sentry | Library | Gratis |

**Mengapa Umami, bukan Google Analytics?**
- Privacy-first: tidak ada cookie tracking, tidak perlu cookie banner.
- Data dimiliki sendiri (self-hosted di Supabase/Vercel).
- Simpel dan tidak overwhelming untuk tim kecil.
- GDPR/UU PDP compliant by default.

**Batasan tools:**
- Tidak ada heatmap atau session replay di Phase 1. Evaluasi ulang di Phase 2 jika perlu.

---

## 3. Event Catalog

### Web Analytics (Umami) - Automatic

- Pageview per halaman
- Unique visitors
- Session duration
- Referrer (dari mana traffic datang: IG, Google, dll)
- Device type (mobile vs desktop)
- Country/region
- UTM parameters (source, medium, campaign)

### Event Naming Convention

Format: `<category>_<action>`

| Category | Contoh Event |
|---|---|
| `article` | `article_read_half`, `article_read_complete`, `article_share`, `article_related_click` |
| `newsletter` | `newsletter_cta_click`, `newsletter_subscribed`, `newsletter_subscribe_fail` |
| `homepage` | `homepage_featured_article_click`, `homepage_series_click` |
| `category` | `category_article_click` |
| `series` | `series_prev_click`, `series_next_click` |
| `social` | `social_click` |
| `editorial` | `editorial_angle_test_pass`, `editorial_angle_test_fail`, `editorial_human_signature_verified`, `content_pov_tag` |
| `tiktok` | `tiktok_video_published`, `tiktok_video_views`, `tiktok_profile_click` |
| `theme` | `theme_toggle` |
| `search` | `search_query`, `search_result_click`, `search_no_result` |
| `product` | `product_page_view`, `product_cta_click`, `product_purchase_complete` |
| `podcast` | `podcast_play`, `podcast_complete`, `podcast_share` |

**Aturan:**
- Gunakan `snake_case`.
- Tidak ada spasi atau karakter spesial.
- Property event menggunakan `camelCase`.
- Setelah event live, **nama event tidak boleh berubah**. Deprecated event tetap di dokumentasi.

### Phase 1 - MVP Event Catalog

| Event | Trigger | Properties | Priority |
|---|---|---|---|
| `pageview` | Umami automatic | `url`, `referrer`, `utm_*` | P0 |
| `article_read_half` | Marker 50% terlihat | `slug` | P0 |
| `article_read_complete` | Marker 90% terlihat | `slug` | P0 |
| `newsletter_cta_click` | Klik tombol subscribe | `location: 'hero' \| 'inline' \| 'bottom' \| 'footer' \| 'homepage'` | P0 |
| `newsletter_subscribed` | Brevo confirm double opt-in | `location`, `source` | P0 |
| `newsletter_subscribe_fail` | Submit form gagal | `location`, `error` | P1 |
| `social_click` | Klik link sosial | `platform: 'instagram' \| 'tiktok' \| 'twitter' \| 'linkedin'` | P0 |
| `article_share` | Klik share artikel | `slug`, `platform: 'whatsapp' \| 'telegram' \| 'twitter' \| 'facebook' \| 'copy'` | P1 |
| `homepage_featured_article_click` | Klik artikel di homepage | `slug`, `position` | P1 |
| `homepage_series_click` | Klik seri di homepage | `seriesSlug` | P1 |
| `article_related_click` | Klik artikel terkait | `fromSlug`, `toSlug` | P1 |
| `article_category_click` | Klik badge kategori | `category` | P1 |
| `category_article_click` | Klik artikel dari halaman kategori | `category`, `slug` | P1 |
| `series_prev_click` / `series_next_click` | Navigasi prev/next seri | `seriesSlug`, `slug` | P1 |
| `theme_toggle` | Toggle dark/light | `theme: 'dark' \| 'light'` | P2 |
| `editorial_angle_test_pass` | Artikel lolos angle test di admin | `slug` | P1 |
| `editorial_angle_test_fail` | Artikel gagal angle test di admin | `slug`, `reason` | P1 |
| `editorial_human_signature_verified` | Human signature diceklis | `slug` | P1 |
| `content_pov_tag` | POV tag dipilih | `slug`, `povType` | P1 |
| `internal_search` | Deprecated. Gunakan `search_query` di Phase 2 | `query`, `hasResult` | P2 |

### Phase 2 - Growth Event Catalog

| Event | Trigger | Properties | Priority |
|---|---|---|---|
| `search_query` | User submit search | `query`, `resultCount` | P2 |
| `search_result_click` | Klik hasil search | `query`, `slug`, `position` | P2 |
| `search_no_result` | Search tanpa hasil | `query` | P2 |
| `search_filter_used` | Gunakan filter search | `filterType` | P2 |
| `bookmark_add` | Save artikel | `slug` | P2 |
| `bookmark_remove` | Hapus bookmark | `slug` | P2 |
| `reading_list_view` | Buka reading list | - | P2 |
| `author_page_view` | Halaman author | `authorSlug` | P2 |
| `author_article_click` | Klik artikel dari author page | `authorSlug`, `slug` | P2 |
| `pwa_install_prompt` | Browser menampilkan install prompt | - | P2 |
| `pwa_install_accept` | User klik install | - | P2 |
| `pwa_offline_access` | Akses saat offline | `path` | P2 |
| `rss_subscribe` | Server log / UTM | `source` | P2 |
| `dashboard_view` | Internal dashboard dibuka | `dateRange` | P2 |
| `donation_cta_click` | Klik CTA "Dukung TAM" | `location` | P2 |
| `donation_page_view` | View halaman `/dukung` | - | P2 |
| `donation_amount_selected` | Pilih nominal donasi | `amount` | P2 |
| `donation_checkout_initiated` | Klik lanjutkan pembayaran | `amount`, `paymentType` | P2 |
| `donation_checkout_success` | Server create transaction OK | `amount`, `paymentType`, `transactionId` | P2 |
| `donation_checkout_fail` | Server create transaction error | `amount`, `paymentType`, `error` | P2 |
| `donation_success` | Webhook settled | `amount`, `paymentType`, `transactionId` | P2 |
| `donation_failed` | Webhook failed | `amount`, `paymentType`, `transactionId`, `error` | P2 |
| `donation_thankyou_view` | View halaman `/dukung/terima-kasih` | `amount`, `paymentType` | P2 |
| `tiktok_video_published` | Video script di-publish | `scriptId`, `postSlug` | P2 |
| `tiktok_video_views` | Video views tracked | `scriptId`, `views` | P2 |
| `tiktok_profile_click` | Klik link profil TikTok | `location` | P2 |

### Phase 3 - Community & Monetization Event Catalog

| Event | Trigger | Properties | Priority |
|---|---|---|---|
| `comment_view` | Section komentar terlihat | `slug` | P3 |
| `comment_submit` | Submit komentar | `slug` | P3 |
| `comment_upvote` | Upvote komentar | `commentId` | P3 |
| `comment_share` | Share komentar | `commentId`, `platform` | P3 |
| `account_created` | User registrasi | `method` | P3 |
| `login` / `logout` | Auth event | `method` | P3 |
| `profile_update` | Update profil | `field` | P3 |
| `product_page_view` | Lihat product page | `productId` | P3 |
| `product_cta_click` | Klik CTA product | `productId`, `location` | P3 |
| `product_purchase_start` | Mulai checkout | `productId`, `value` | P3 |
| `product_purchase_complete` | Checkout selesai | `productId`, `value`, `currency` | P3 |
| `product_download` | Download digital product | `productId` | P3 |
| `podcast_play` | Play podcast | `episodeId` | P3 |
| `podcast_pause` | Pause podcast | `episodeId`, `currentTime` | P3 |
| `podcast_complete` | Selesai 90% | `episodeId` | P3 |
| `podcast_share` | Share episode | `episodeId`, `platform` | P3 |
| `submission_start` | Mulai guest submission | `type` | P3 |
| `submission_submit` | Submit guest submission | `type` | P3 |
| `premium_cta_click` | Klik premium newsletter CTA | `location` | P3 |
| `premium_subscribe` | Subscribe premium | `plan` | P3 |
| `premium_cancel` | Cancel premium | `reason` | P3 |

### Email Analytics (Brevo)

- Open rate per newsletter
- Click rate per newsletter
- Unsubscribe rate
- List growth (net new subscriber per bulan)
- Best performing subject lines
- Bounce rate & spam complaint rate
- Double opt-in completion rate

**Setup Brevo:**
- Aktifkan **double opt-in** untuk deliverability dan compliance.
- Hapus subscriber tidak aktif (>6 bulan tidak open) secara berkala.
- Pastikan link unsubscribe 1-klik ada di setiap newsletter.

### SEO Analytics (Google Search Console)

- Total impressions
- Total clicks
- Average position per keyword
- Pages dengan CTR rendah (perlu perbaikan meta)
- Keyword baru yang mulai rank

### Performance & Error Tracking

- **Core Web Vitals:** LCP, CLS, INP (via `web-vitals` library + PageSpeed Insights)
- **Sentry:** JS errors, failed API calls, performance transactions
- **Uptime Kuma:** downtime alert dan response time

---

## 4. Key Metrics & Targets

### North Star Metric
**Email Subscriber Growth** - ini satu-satunya metric yang paling menunjukkan "apakah orang cukup percaya untuk kasih email mereka."

### Metrics Dashboard

**Catatan target:** Target berikut adalah hipotesis awal. Revisi setelah 30 hari data pertama.

| Category | Metric | Target (6 bulan) | Data Source |
|---|---|---|---|
| **Traffic** | Monthly unique visitors | 2.000 | Umami |
| **Traffic** | Organic search share | > 30% | Umami + GSC |
| **Traffic** | Returning visitor rate | > 25% | Umami |
| **Content** | Artikel published | 20+ | CMS/Database |
| **Engagement** | Avg. time on page | > 3 menit | Umami |
| **Engagement** | Artikel read complete rate | > 40% | Umami (custom event) |
| **Email** | Total subscribers | 500 | Brevo |
| **Email** | Monthly net new subscribers | 50+ | Brevo |
| **Email** | Newsletter open rate | > 35% | Brevo |
| **Email** | Newsletter click rate | > 5% | Brevo |
| **Email** | Monthly unsubscribe rate | < 1% | Brevo |
| **SEO** | Pages ranking page 1 Google | 5+ | Google Search Console |
| **SEO** | Organic traffic growth | 20% MoM | Google Search Console |
| **Performance** | LCP | < 2.5s | PageSpeed Insights / RUM |
| **Performance** | CLS | < 0.1 | PageSpeed Insights / RUM |
| **Performance** | INP | < 200ms | PageSpeed Insights / RUM |
| **Reliability** | Uptime | > 99.9% | Uptime Kuma |
| **Quality** | JS error rate | < 0.1% | Sentry |
| **Support** | Donasi settled (bulan) | 5+ | Louvin + Database |
| **Support** | Donation CTA click rate | > 0.5% | Umami |
| **Support** | Donation checkout conversion | > 10% | Umami + Database |

### Funnel Conversion

| Stage | Event | Target Conversion |
|---|---|---|
| Visitor lands | pageview | - |
| Reads > 50% | `article_read_half` | > 50% |
| Reads > 90% | `article_read_complete` | > 40% |
| Clicks subscribe CTA | `newsletter_cta_click` | > 3% |
| Subscribes | `newsletter_subscribed` | > 1% |
| Confirms double opt-in | (Brevo) | > 80% |
| Views donation page | `donation_page_view` | > 1% |
| Initiates checkout | `donation_checkout_initiated` | > 0.5% |
| Completes donation | `donation_success` | > 0.1% |

### Content-Specific Metrics

| Metric | Question | Action |
|---|---|---|
| Top artikel (pageview + read complete) | Apa yang paling resonan? | Double-down tema & format. |
| Bottom artikel | Apa yang tidak works? | Audit judul, hook, SEO, atau hapus. |
| Pillar performance | Pilar mana yang paling diminati? | Prioritaskan pilar dengan engagement tinggi. |
| Series completion rate | Seberapa banyak user lanjut baca seri? | Perbaiki navigasi seri jika rendah. |
| Newsletter → website traffic | Seberapa banyak subscriber balik ke web? | Optimalkan link dan CTA di newsletter. |

---

## 5. Reporting Cadence

### Weekly (5 menit, mental check)
**Owner:** Content lead
- Berapa subscriber baru minggu ini?
- Artikel mana yang paling banyak dibaca?
- Ada lonjakan traffic dari mana?
- Ada error spikes di Sentry?

### Monthly (30 menit, review serius)
**Owner:** Content lead + Operator
- Total traffic vs bulan sebelumnya (MoM growth)
- Top 5 artikel (pageview + avg time on page + read complete rate)
- Bottom 5 artikel (perlu audit: judul, hook, SEO)
- Newsletter performance (open rate, click rate, unsubscribe)
- Net new subscribers dan funnel conversion
- Keyword baru yang mulai rank (Search Console)
- Core Web Vitals trend (LCP, CLS, INP)
- **Action item:** konten apa yang perlu dibuat bulan depan?

### Quarterly (1-2 jam, strategic review)
**Owner:** Founder + Content lead
- Progress toward 6-month targets
- Content yang perform vs tidak perform
- Revisi content strategy jika perlu
- Evaluasi tech/tool jika ada yang perlu ganti
- Review data retention & privacy compliance

### Reporting Template

Simpan di Notion/Google Sheets dengan kolom:

```markdown
| Periode | Metric | Nilai | Target | MoM | Notes | Action Item |
```

### Weekly Report (Slack/Notion, 5 menit)

**Output:** 3 bullet points.
```markdown
**Week of [date]** - Owner: Content Lead
- Subscriber: +X (total: Y)
- Top artikel: [slug] (+Z views)
- Anomaly: [jika ada] / Action: [jika ada]
```

### Monthly Report (Notion, 30 menit)

**Output:** 1 halaman dengan:
1. Executive summary (3 kalimat).
2. Metrics table (vs target vs MoM).
3. Top 5 & bottom 5 artikel.
4. Newsletter performance.
5. SEO highlights.
6. Action items bulan depan.

### Quarterly Report (Deck/Notion, 1-2 jam)

**Output:** Strategic review slide/page:
1. Progress vs 6-month targets.
2. Content performance analysis (pillar & series).
3. Funnel conversion trends.
4. Tech/tool evaluation.
5. Strategy adjustments for next quarter.
6. Data retention & privacy review.

---

## 6. Implementation Code

### Umami Setup

#### Install (Self-hosted di Vercel/Railway)

```bash
# Clone Umami
git clone https://github.com/umami-software/umami
cd umami

# Setup database (PostgreSQL via Supabase free tier)
DATABASE_URL=postgresql://...

# Deploy ke Vercel/Railway
vercel deploy
```

#### Script di Next.js

```typescript
// app/layout.tsx
import Script from 'next/script'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Script
          defer
          src={process.env.NEXT_PUBLIC_UMAMI_URL}
          data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
          strategy="lazyOnload"
        />
      </body>
    </html>
  )
}
```

**Environment variables:**
```env
NEXT_PUBLIC_UMAMI_URL=https://analytics.tamparananakmuda.com/script.js
NEXT_PUBLIC_UMAMI_WEBSITE_ID=<uuid-website-id>
```

### Custom Event Tracking Hook

```typescript
// hooks/useAnalytics.ts
import { useCallback } from 'react'

declare global {
  interface Window {
    umami?: {
      track: (event: string, data?: Record<string, string>) => void
    }
  }
}

export type TrackData = Record<string, string | number | boolean>

function serializeData(data?: TrackData): Record<string, string> | undefined {
  if (!data) return undefined
  return Object.entries(data).reduce((acc, [key, value]) => {
    acc[key] = String(value)
    return acc
  }, {} as Record<string, string>)
}

export function useAnalytics() {
  const track = useCallback((event: string, data?: TrackData) => {
    if (typeof window !== 'undefined' && window.umami) {
      window.umami.track(event, serializeData(data))
    }
  }, [])

  return { track }
}
```

### Trackable Component Helper

```typescript
// components/Trackable.tsx
'use client'
import { useAnalytics } from '@/hooks/useAnalytics'

export function TrackableButton({
  event,
  data,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  event: string
  data?: Record<string, string | number | boolean>
}) {
  const { track } = useAnalytics()

  return (
    <button
      {...props}
      onClick={(e) => {
        track(event, data)
        props.onClick?.(e)
      }}
    >
      {children}
    </button>
  )
}
```

### Web Vitals Tracking

```typescript
// components/WebVitals.tsx
'use client'
import { useEffect } from 'react'
import { onLCP, onCLS, onINP } from 'web-vitals'
import { useAnalytics } from '@/hooks/useAnalytics'

export function WebVitals() {
  const { track } = useAnalytics()

  useEffect(() => {
    onLCP((metric) => track('web_vital_lcp', { value: metric.value, rating: metric.rating }))
    onCLS((metric) => track('web_vital_cls', { value: metric.value, rating: metric.rating }))
    onINP((metric) => track('web_vital_inp', { value: metric.value, rating: metric.rating }))
  }, [track])

  return null
}
```

Tambahkan di `app/layout.tsx` setelah Umami script:
```tsx
<WebVitals />
```

### Sentry Setup

```typescript
// instrumentation.ts (Next.js 15+)
import * as Sentry from '@sentry/nextjs'

export function register() {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0,
  })
}
```

---

## 7. Scroll Depth Tracking (Artikel)

Gunakan `IntersectionObserver` dengan marker. Marker harus tidak interaktif dan tidak mengganggu layout.

```typescript
// components/ArticleTracker.tsx
'use client'
import { useEffect, useRef } from 'react'
import { useAnalytics } from '@/hooks/useAnalytics'

export function ArticleTracker({ slug }: { slug: string }) {
  const { track } = useAnalytics()
  const tracked50 = useRef(false)
  const tracked90 = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return

          if (entry.target.id === 'article-marker-50' && !tracked50.current) {
            track('article_read_half', { slug })
            tracked50.current = true
          }

          if (entry.target.id === 'article-marker-90' && !tracked90.current) {
            track('article_read_complete', { slug })
            tracked90.current = true
          }
        })
      },
      { threshold: 0.1 }
    )

    const marker50 = document.getElementById('article-marker-50')
    const marker90 = document.getElementById('article-marker-90')

    if (marker50) observer.observe(marker50)
    if (marker90) observer.observe(marker90)

    return () => observer.disconnect()
  }, [slug])

  return (
    <>
      <span
        id="article-marker-50"
        aria-hidden="true"
        className="pointer-events-none absolute h-0 w-0"
        style={{ top: '50%' }}
      />
      <span
        id="article-marker-90"
        aria-hidden="true"
        className="pointer-events-none absolute h-0 w-0"
        style={{ top: '90%' }}
      />
    </>
  )
}
```

**Usage di artikel:**
```tsx
// app/artikel/[slug]/page.tsx
<article className="relative">
  <ArticleTracker slug={slug} />
  {/* content */}
</article>
```

---

## 8. Attribution Tracking

Untuk tahu dari mana subscriber email berasal:

### Contoh UTM Link

```typescript
// Link di IG bio
https://tamparananakmuda.com?utm_source=instagram&utm_medium=bio&utm_campaign=organic

// Link di Story Instagram (swipe up/link sticker)
https://tamparananakmuda.com?utm_source=instagram&utm_medium=story&utm_campaign=organic

// Link di WhatsApp/Telegram share
https://tamparananakmuda.com?utm_source=whatsapp&utm_medium=share&utm_campaign=organic

// Link di newsletter
https://tamparananakmuda.com/artikel/judul?utm_source=newsletter&utm_medium=email&utm_campaign=2026-07-01

// Umami otomatis capture referrer dan UTM params
// Lihat di Umami dashboard → UTM
```

**UTM Convention TAM:**
- `utm_source`: `instagram`, `google`, `newsletter`, `whatsapp`, `telegram`, `tiktok`, `direct`, `referral`
- `utm_medium`: `bio`, `story`, `post`, `reel`, `share`, `organic`, `email`, `qr`
- `utm_campaign`: nama campaign atau `organic`

### Dark Social Tracking

Traffic dari WhatsApp, Telegram, dan copy-paste link biasanya muncul sebagai `direct`. Tangkap dengan:
1. **Custom share buttons** dengan UTM auto-generated.
2. **Track event `article_share`** setiap kali user klik share.
3. **Shortlink** (opsional): `tam.id/ig-bio` redirect ke link dengan UTM.

### UTM Builder Helper

```typescript
// lib/utm.ts
export function buildUtmUrl(
  base: string,
  params: {
    source: string
    medium: string
    campaign?: string
    content?: string
  }
): string {
  const url = new URL(base)
  url.searchParams.set('utm_source', params.source)
  url.searchParams.set('utm_medium', params.medium)
  if (params.campaign) url.searchParams.set('utm_campaign', params.campaign)
  if (params.content) url.searchParams.set('utm_content', params.content)
  return url.toString()
}
```

---

## 9. Privacy Compliance

### Privacy by Design

- **Minimal data collection.** Hanya data yang benar-benar dibutuhkan untuk keputusan konten.
- **No PII in analytics.** Umami tidak track IP, email, atau identitas personal.
- **Email isolation.** Email hanya ada di Brevo, tidak di analytics database.
- **Transparency.** Privacy policy jelas menyebutkan semua tools.

Karena Umami cookieless dan tidak track PII secara default:
- Tidak perlu cookie consent banner.
- Tidak perlu tambah Umami ke privacy policy (optional tapi recommended).
- Brevo: perlu disebutkan di privacy policy bahwa email disimpan di Brevo.

### Data Retention

| Data | Retention | Tool |
|---|---|---|
| Umami analytics | 12 bulan (default) | PostgreSQL (Supabase host) |
| Brevo contacts | Selama subscriber aktif | Brevo |
| Search Console | 16 bulan | Google Search Console |
| Sentry errors | 30 hari (free tier) | Sentry |

### Privacy Policy Checklist

- [ ] Sebutkan Umami sebagai analytics tool (cookieless).
- [ ] Sebutkan Brevo sebagai email service provider.
- [ ] Jelaskan data apa yang dikumpulkan (email, behavior anonim, UTM).
- [ ] Jelaskan cara unsubscribe dan hapus data.
- [ ] Cantumkan kontak untuk data subject request (UU PDP).

### Consent untuk Email

- Form subscribe harus pakai **opt-in eksplisit** (tidak pre-checked).
- Aktifkan **double opt-in** di Brevo.
- Simpan timestamp dan IP consent untuk compliance.

---

## 10. Testing & QA Checklist

Sebelum launch, verifikasi:

- [ ] Umami script ter-load tanpa error (cek Network tab & console).
- [ ] `pageview` muncul di Umami dashboard.
- [ ] Custom event `article_read_half` dan `article_read_complete` fire dengan benar.
- [ ] UTM params terekam di Umami.
- [ ] Brevo double opt-in email terkirim.
- [ ] Sentry error tracking aktif.
- [ ] PageSpeed LCP < 2.5s, CLS < 0.1, INP < 200ms.
- [ ] Privacy policy sudah update dengan Umami & Brevo.

### Quick Debug

```typescript
// Cek di browser console
window.umami && window.umami.track('test_event', { debug: true })
```

---

## 11. Experimentation Loop

Analytics tidak berguna tanpa action. Gunakan loop sederhana:

1. **Observe:** Lihat monthly report.
2. **Hypothesis:** "Artikel dengan hook pertanyaan memiliki read complete rate lebih tinggi."
3. **Experiment:** Buat 2 artikel dengan hook pertanyaan vs statement.
4. **Measure:** Bandingkan read complete rate dan subscribe conversion.
5. **Decide:** Adopsi format yang menang, dokumentasi learnings.

Dokumentasi learning disimpan di Notion dengan format:
| Tanggal | Hypothesis | Experiment | Result | Decision |

---

## 12. Data Dictionary

Definisi setiap property yang digunakan di event. Property selalu `camelCase`.

| Property | Type | Contoh | Keterangan |
|---|---|---|---|
| `slug` | string | `judul-artikel` | Slug unik artikel/halaman. |
| `category` | string | `mindset` | Nama kategori/pilar konten. |
| `seriesSlug` | string | `dari-0-sampai-kerja` | Slug unik seri. |
| `authorSlug` | string | `yovie-setiawan` | Slug author/kontributor. |
| `location` | string | `inline`, `bottom`, `hero` | Lokasi elemen yang di-interact. |
| `platform` | string | `instagram`, `whatsapp` | Platform sosial atau share. |
| `position` | number | `1`, `2`, `3` | Posisi item dalam list (1-based). |
| `query` | string | `quarter life crisis` | Query search internal. |
| `hasResult` | boolean | `true`, `false` | Apakah search menghasilkan result. |
| `resultCount` | number | `12` | Jumlah hasil search. |
| `productId` | string | `ebook-1` | ID digital product. |
| `episodeId` | string | `podcast-ep-1` | ID episode podcast. |
| `value` | number | `99000` | Nilai transaksi atau metric. |
| `currency` | string | `IDR` | Mata uang transaksi. |
| `theme` | string | `dark`, `light` | Theme preference. |
| `rating` | string | `good`, `needs-improvement`, `poor` | Web Vital rating. |
| `error` | string | `invalid_email` | Error code untuk failure event. |
| `fromSlug` | string | `judul-artikel-a` | Slug artikel asal (related click). |
| `toSlug` | string | `judul-artikel-b` | Slug artikel tujuan (related click). |
| `commentId` | string | `comment-123` | ID unik komentar. |
| `currentTime` | number | `125` | Waktu playback (detik). |
| `filterType` | string | `category`, `date` | Tipe filter yang digunakan. |
| `dateRange` | string | `7d`, `30d`, `90d` | Rentang waktu dashboard. |
| `povType` | string | `kontra-narasi`, `refleksi`, `data`, `framework` | POV tag artikel (lihat ContentStrategy.md Section 5). |
| `factCheckStatus` | string | `pending`, `verified`, `flagged` | Status fact-check artikel. |
| `reviewStatus` | string | `draft`, `review`, `fact-check`, `publish` | Status review pipeline artikel. |
| `scriptId` | string | `tiktok-script-001` | ID unik TikTok video script. |
| `hookLine` | string | `Kenapa kamu...` | Hook line yang dipakai untuk video script. |
| `views` | number | `1500` | Jumlah views video TikTok. |
| `reason` | string | `generic_content`, `no_pov` | Alasan angle test gagal. |

---

## 13. Feature-to-Event Mapping

Mapping setiap fitur ke event yang harus di-track.

### Phase 1

| Feature | File | Events | Status |
|---|---|---|---|
| Homepage | `app/page.tsx` | `homepage_featured_article_click`, `homepage_series_click` | P1 |
| Artikel | `app/artikel/[slug]/page.tsx` | `article_read_half`, `article_read_complete`, `article_share` | P0 |
| Inline CTA | `components/InlineNewsletterCta.tsx` | `newsletter_cta_click` | P0 |
| Bottom CTA | `components/ArticleNewsletterCta.tsx` | `newsletter_cta_click` | P0 |
| Footer CTA | `components/Footer.tsx` | `newsletter_cta_click` | P1 |
| Kategori | `app/topik/[category]/page.tsx` | `category_article_click`, `article_category_click` | P1 |
| Seri | `app/seri/[slug]/page.tsx`, `components/SeriesNav.tsx` | `series_prev_click`, `series_next_click` | P1 |
| Sosial | `components/SocialLinks.tsx` | `social_click` | P0 |
| Subscribe API | `app/api/subscribe/route.ts` | `newsletter_subscribed`, `newsletter_subscribe_fail` | P0 |
| Editorial Workflow | `app/admin/editorial/page.tsx` | `editorial_angle_test_pass`, `editorial_angle_test_fail`, `editorial_human_signature_verified`, `content_pov_tag` | P1 |

### Phase 2

| Feature | File | Events | Status |
|---|---|---|---|
| Search | `components/Search.tsx` | `search_query`, `search_result_click`, `search_no_result` | P2 |
| Bookmark | `components/BookmarkButton.tsx` | `bookmark_add`, `bookmark_remove` | P2 |
| Reading List | `app/reading-list/page.tsx` | `reading_list_view` | P2 |
| Author Profile | `app/author/[slug]/page.tsx` | `author_page_view`, `author_article_click` | P2 |
| PWA | `components/PwaProvider.tsx` | `pwa_install_prompt`, `pwa_install_accept` | P2 |
| Internal Dashboard | `app/admin/dashboard/page.tsx` | `dashboard_view` | P2 |
| Donation | `app/dukung/page.tsx`, `components/DonationCta.tsx` | `donation_cta_click`, `donation_page_view`, `donation_amount_selected`, `donation_checkout_initiated`, `donation_checkout_success`, `donation_checkout_fail`, `donation_success`, `donation_failed`, `donation_thankyou_view` | P2 |
| TikTok Pipeline | `app/admin/tiktok/page.tsx` | `tiktok_video_published`, `tiktok_video_views`, `tiktok_profile_click` | P2 |

### Phase 3

| Feature | File | Events | Status |
|---|---|---|---|
| Komentar | `components/Comments.tsx` | `comment_view`, `comment_submit`, `comment_upvote` | P3 |
| User Account | `app/account/*` | `account_created`, `login`, `logout` | P3 |
| Digital Product | `app/product/[id]/page.tsx` | `product_page_view`, `product_cta_click`, `product_purchase_complete` | P3 |
| Podcast | `components/PodcastPlayer.tsx` | `podcast_play`, `podcast_complete`, `podcast_share` | P3 |
| Guest Submission | `app/submit/page.tsx` | `submission_start`, `submission_submit` | P3 |
| Premium Newsletter | `components/PremiumCta.tsx` | `premium_cta_click`, `premium_subscribe`, `premium_cancel` | P3 |

---

## 14. Implementation Order

Urutan implementasi analytics untuk mengurangi rework dan memastikan event P0 berfungsi sebelum launch.

### Sprint 1 - Foundation
1. Setup Umami self-hosted dan environment variables.
2. Install `web-vitals` dan setup Sentry.
3. Implement `useAnalytics` hook.
4. Tambahkan Umami script + `WebVitals` component di layout.

### Sprint 2 - Pageview & Core Events
1. Verifikasi `pageview` terekam.
2. Implement `ArticleTracker` di halaman artikel.
3. Track `article_read_half` dan `article_read_complete`.
4. Track `newsletter_cta_click` di semua lokasi form.
5. Track `social_click` di footer/header.

### Sprint 3 - Content & Navigation
1. Track `homepage_featured_article_click` dan `homepage_series_click`.
2. Track `article_related_click`, `article_category_click`, `category_article_click`.
3. Track `series_prev_click` / `series_next_click`.
4. Track `article_share` di share buttons.
5. Track editorial events: `editorial_angle_test_pass/fail`, `editorial_human_signature_verified`, `content_pov_tag`.
6. Implement UTM builder helper.

### Sprint 4 - Email & QA
1. Integrate Brevo double opt-in.
2. Track `newsletter_subscribed` dan `newsletter_subscribe_fail`.
3. Jalankan QA checklist.
4. Setup weekly/monthly reporting template.

### Phase 2+ Prep
1. Tambahkan placeholder event untuk search, bookmark, author profile.
2. Siapkan data dictionary untuk product dan podcast.
3. Document analytics dashboard internal.
4. Implement TikTok pipeline events: `tiktok_video_published`, `tiktok_video_views`, `tiktok_profile_click`.
5. Implement donation events: `donation_cta_click` sampai `donation_thankyou_view`.

---

## 15. Analytics Roadmap

Roadmap ini selaras dengan `Roadmap.md` dan menentukan kapan tracking baru diaktifkan.

### Phase 0 - Foundation (Bulan 1-2)
- Semua dokumen analytics final (ini).
- Setup Umami, Sentry, Brevo, Uptime Kuma.
- Implementasi tracking foundation.

### Phase 1 - MVP Launch (Bulan 3-4)
- Aktifkan semua P0/P1 events (termasuk editorial events).
- Weekly dan monthly reporting berjalan.
- Target: 100 subscriber, 500 visitors, 10 artikel.

### Phase 2 - Growth (Bulan 5-8)
- Aktifkan P2 events (search, bookmark, author, PWA, donation events, TikTok events).
- Dashboard analytics internal untuk tim (termasuk donation dashboard dan TikTok pipeline).
- Refine target berdasarkan 30-day baseline.
- Target: 500 subscriber, 2.000 organic visitors, 30+ artikel, 5+ donasi settled, 10+ TikTok video published.

### Phase 3 - Community & Monetization (Bulan 9-18)
- Aktifkan P3 events (komentar, product, podcast, premium).
- Tracking revenue dan conversion funnel.
- Advanced segmentation (jika user account aktif).
- Target: 2.000 subscriber, 10.000 visitors, revenue pertama.

---

## 16. Cross-Document Alignment

Status konsistensi dengan dokumen lain:

- **PRD.md:** Success metrics aligned (500 subscriber, 2.000 organic visitors, 20 artikel, >3 menit, >35% open rate).
- **ContentStrategy.md:** Content metrics (pillar performance, series completion) referensi ke dokumen ini.
- **Roadmap.md:** Phase deliverables `Umami analytics setup` dan `Dashboard analytics lebih detail` dijabarkan di sini.
- **Features.md:** F08 event names sudah di-update agar sesuai dengan Event Catalog. F19 donation events tercakup di Phase 2 event catalog. F20 TikTok events dan F21 editorial events tercakup di Phase 1/2 event catalog.
- **Testing.md:** QA checklist analytics perlu ditambahkan/diupdate untuk mencakup event-event baru, termasuk donation, editorial, dan TikTok events.
- **Security.md:** Pastikan Brevo API key server-side, tidak ada PII leak di analytics. Louvin donation events tidak boleh mengandung PII di properties.

---

## 17. Changelog

| Versi | Tanggal | Perubahan |
|---|---|---|
| 1.0 | Juni 2026 | Draft awal. |
| 1.1 | Jul 2026 | Perbaikan code, tambah funnel, privacy, reporting, QA. |
| 1.2 | Jul 2026 | Event Catalog all phases, Data Dictionary, Feature-to-Event Mapping, Implementation Order, Analytics Roadmap. |
| 1.3 | Jul 2026 | Added Louvin donation event catalog and support metrics. |
| 1.4 | Jul 2026 | Added editorial events (angle test, human signature, POV tag) to Phase 1, TikTok events to Phase 2, fixed search event conflict (deprecated `internal_search`), updated feature-to-event mapping, data dictionary, implementation order, analytics roadmap, cross-document alignment. |
