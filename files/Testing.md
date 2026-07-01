# Testing.md - Testing Strategy
# TAMPARAN ANAK MUDA Website

**Versi:** 1.4  
**Status:** Draft - comprehensive testing strategy + donation payment tests + editorial workflow + TikTok pipeline tests

---

## 1. Testing Philosophy

Untuk project lean seperti TAM, prinsipnya:
- **Test apa yang bisa rusak dan menyakiti pengguna** - bukan test untuk kesan lengkap
- **Unit test untuk logic murni** (validasi email, utility functions)
- **Integration test untuk flow kritis** (newsletter subscribe)
- **E2E test untuk happy path utama** (baca artikel, subscribe newsletter)
- **Manual test untuk visual/UI** - otomasi visual terlalu mahal untuk scale ini

---

## 2. Testing Stack

| Layer | Tool | Alasan |
|---|---|---|
| Unit | Vitest | Cepat, API mirip Jest, support TypeScript |
| Integration | Vitest + MSW | Mock server untuk API testing |
| E2E | Playwright | Reliable, cross-browser, gratis |
| API | Vitest | Test route handlers Next.js |
| Type Safety | TypeScript strict | Catch banyak bug di compile time |
| Linting | ESLint + Prettier | Code quality baseline |

---

## 3. Test Structure

```
/
├── __tests__/
│   ├── unit/
│   │   ├── utils/
│   │   │   ├── email-validator.test.ts
│   │   │   ├── reading-time.test.ts
│   │   │   └── slug.test.ts
│   │   └── components/
│   │       └── newsletter-form.test.tsx
│   ├── integration/
│   │   └── api/
│   │       └── subscribe.test.ts
│   └── e2e/
│       ├── homepage.spec.ts
│       ├── article.spec.ts
│       └── newsletter.spec.ts
├── vitest.config.ts
└── playwright.config.ts
```

---

## 4. Unit Tests

### 4.1 Email Validator

```typescript
// __tests__/unit/utils/email-validator.test.ts

describe('validateEmail', () => {
  // Happy path
  it('accepts valid email', () => {
    expect(validateEmail('user@example.com')).toBe(true)
  })

  // Edge cases - semua harus ditest
  it('rejects empty string', () => {
    expect(validateEmail('')).toBe(false)
  })
  it('rejects email without @', () => {
    expect(validateEmail('userexample.com')).toBe(false)
  })
  it('rejects email without domain', () => {
    expect(validateEmail('user@')).toBe(false)
  })
  it('rejects email with spaces', () => {
    expect(validateEmail('user @example.com')).toBe(false)
  })
  it('rejects email over 254 chars', () => {
    expect(validateEmail('a'.repeat(250) + '@x.com')).toBe(false)
  })
  it('accepts email with subdomain', () => {
    expect(validateEmail('user@mail.example.com')).toBe(true)
  })
  it('accepts email with + alias', () => {
    expect(validateEmail('user+tag@example.com')).toBe(true)
  })
  it('rejects null/undefined', () => {
    expect(validateEmail(null as any)).toBe(false)
    expect(validateEmail(undefined as any)).toBe(false)
  })
})
```

### 4.2 Reading Time Calculator

```typescript
// __tests__/unit/utils/reading-time.test.ts

describe('calculateReadingTime', () => {
  it('returns 1 for very short text', () => {
    expect(calculateReadingTime('Hello world')).toBe(1)
  })
  it('calculates correctly for 400-word text (avg 200wpm)', () => {
    const text = 'word '.repeat(400)
    expect(calculateReadingTime(text)).toBe(2)
  })
  it('handles empty string', () => {
    expect(calculateReadingTime('')).toBe(1) // minimum 1 menit
  })
  it('strips HTML tags before counting', () => {
    const html = '<p>Hello</p><strong>world</strong>'
    expect(calculateReadingTime(html)).toBe(1)
  })
})
```

### 4.3 Newsletter Form Component

```typescript
// __tests__/unit/components/newsletter-form.test.tsx

describe('NewsletterForm', () => {
  it('renders email input and submit button', () => {
    render(<NewsletterForm />)
    expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /subscribe/i })).toBeInTheDocument()
  })

  it('shows validation error for invalid email', async () => {
    render(<NewsletterForm />)
    await userEvent.type(screen.getByRole('textbox'), 'invalid')
    await userEvent.click(screen.getByRole('button'))
    expect(screen.getByText(/email tidak valid/i)).toBeInTheDocument()
  })

  it('shows loading state while submitting', async () => {
    // Mock fetch
    global.fetch = vi.fn(() => new Promise(() => {})) // never resolves
    render(<NewsletterForm />)
    await userEvent.type(screen.getByRole('textbox'), 'test@example.com')
    await userEvent.click(screen.getByRole('button'))
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('shows success message after successful submission', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true })
    })
    render(<NewsletterForm />)
    await userEvent.type(screen.getByRole('textbox'), 'test@example.com')
    await userEvent.click(screen.getByRole('button'))
    await waitFor(() => {
      expect(screen.getByText(/cek email kamu/i)).toBeInTheDocument()
    })
  })

  it('shows error message on server error', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: 'Server error' })
    })
    render(<NewsletterForm />)
    await userEvent.type(screen.getByRole('textbox'), 'test@example.com')
    await userEvent.click(screen.getByRole('button'))
    await waitFor(() => {
      expect(screen.getByText(/gagal mendaftar/i)).toBeInTheDocument()
    })
  })
})
```

---

## 5. Integration Tests

### 5.1 Subscribe API Route

```typescript
// __tests__/integration/api/subscribe.test.ts

describe('POST /api/subscribe', () => {
  beforeEach(() => {
    // Mock Brevo API
    server.use(
      http.post('https://api.brevo.com/v3/contacts', () => {
        return HttpResponse.json({ id: 1 }, { status: 201 })
      })
    )
  })

  // Happy path
  it('returns 200 for valid email', async () => {
    const req = new Request('http://localhost/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com' })
    })
    const res = await POST(req)
    expect(res.status).toBe(200)
  })

  // Validation
  it('returns 400 for missing email', async () => {
    const req = new Request('http://localhost/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('returns 400 for invalid email format', async () => {
    const req = new Request('http://localhost/api/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email: 'not-an-email' })
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  // Brevo errors
  it('returns 409 if email already subscribed', async () => {
    server.use(
      http.post('https://api.brevo.com/v3/contacts', () => {
        return HttpResponse.json({ code: 'duplicate_parameter' }, { status: 400 })
      })
    )
    const req = new Request('http://localhost/api/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email: 'existing@example.com' })
    })
    const res = await POST(req)
    expect(res.status).toBe(409)
  })

  it('returns 500 if Brevo is down', async () => {
    server.use(
      http.post('https://api.brevo.com/v3/contacts', () => {
        return HttpResponse.error()
      })
    )
    const req = new Request('http://localhost/api/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@example.com' })
    })
    const res = await POST(req)
    expect(res.status).toBe(500)
  })

  // Rate limiting
  it('returns 429 after exceeding rate limit', async () => {
    // 3 requests berhasil, ke-4 harus 429
    for (let i = 0; i < 3; i++) {
      await POST(makeRequest(`test${i}@example.com`))
    }
    const res = await POST(makeRequest('extra@example.com'))
    expect(res.status).toBe(429)
  })
})
```

---

## 6. E2E Tests (Playwright)

### 6.1 Homepage

```typescript
// __tests__/e2e/homepage.spec.ts

test.describe('Homepage', () => {
  test('loads and shows brand headline', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Tamparan Anak Muda/)
    await expect(page.locator('h1')).toBeVisible()
  })

  test('shows artikel terbaru', async ({ page }) => {
    await page.goto('/')
    const cards = page.locator('[data-testid="article-card"]')
    await expect(cards).toHaveCount(3)
  })

  test('newsletter form submits successfully', async ({ page }) => {
    await page.route('/api/subscribe', route => {
      route.fulfill({ json: { success: true } })
    })
    await page.goto('/')
    await page.fill('[data-testid="newsletter-email"]', 'test@example.com')
    await page.click('[data-testid="newsletter-submit"]')
    await expect(page.locator('[data-testid="newsletter-success"]')).toBeVisible()
  })
})
```

### 6.2 Article Page

```typescript
// __tests__/e2e/article.spec.ts

test.describe('Article Page', () => {
  test('loads article with correct content', async ({ page }) => {
    await page.goto('/artikel/[test-slug]')
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator('[data-testid="article-body"]')).toBeVisible()
    await expect(page.locator('[data-testid="reading-time"]')).toBeVisible()
  })

  test('shows inline newsletter CTA mid-article', async ({ page }) => {
    await page.goto('/artikel/[test-slug]')
    await expect(page.locator('[data-testid="inline-newsletter"]')).toBeVisible()
  })

  test('404 for non-existent article', async ({ page }) => {
    const response = await page.goto('/artikel/artikel-yang-tidak-ada')
    expect(response?.status()).toBe(404)
    await expect(page.locator('[data-testid="not-found"]')).toBeVisible()
  })

  test('shows related articles', async ({ page }) => {
    await page.goto('/artikel/[test-slug]')
    const related = page.locator('[data-testid="related-articles"]')
    await expect(related).toBeVisible()
  })

  test('fires article_read_complete on scroll to bottom', async ({ page }) => {
    await page.goto('/artikel/[test-slug]')
    const trackedEvents: string[] = []
    await page.evaluate(() => {
      window.umami = { track: (event: string) => {
        (window as any).__trackedEvents = (window as any).__trackedEvents || []
        ;(window as any).__trackedEvents.push(event)
      }}
    })
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(500)
    const events = await page.evaluate(() => (window as any).__trackedEvents)
    expect(events).toContain('article_read_complete')
  })
})
```

### 6.3 Analytics Testing

```typescript
// __tests__/e2e/analytics.spec.ts

test.describe('Analytics', () => {
  test('Umami script loads', async ({ page }) => {
    await page.goto('/')
    const umami = await page.evaluate(() => typeof window.umami !== 'undefined')
    expect(umami).toBe(true)
  })

  test('newsletter_cta_click fires on subscribe button click', async ({ page }) => {
    await page.goto('/')
    const events: string[] = []
    await page.evaluate(() => {
      window.umami = { track: (event: string) => {
        (window as any).__trackedEvents = (window as any).__trackedEvents || []
        ;(window as any).__trackedEvents.push(event)
      }}
    })
    await page.click('[data-testid="newsletter-submit"]')
    const fired = await page.evaluate(() => (window as any).__trackedEvents)
    expect(fired).toContain('newsletter_cta_click')
  })

  test('UTM params are preserved in links', async ({ page }) => {
    await page.goto('/?utm_source=instagram&utm_medium=bio')
    // Verify Umami captures or links preserve UTM
    await expect(page).toHaveURL(/utm_source=instagram/)
  })
})
```

### 6.4 Donation / Payment Testing (Phase 2)

```typescript
// __tests__/e2e/donation.spec.ts

test.describe('Donation Flow', () => {
  test('donation page loads when feature enabled', async ({ page }) => {
    await page.goto('/dukung')
    await expect(page.locator('h1')).toContainText('Dukung TAM')
    await expect(page.locator('[data-testid="amount-25000"]')).toBeVisible()
  })

  test('select amount and payment method', async ({ page }) => {
    await page.goto('/dukung')
    await page.click('[data-testid="amount-50000"]')
    await page.click('[data-testid="payment-qris"]')
    await page.click('[data-testid="donation-submit"]')
    await expect(page.locator('[data-testid="payment-loading"]')).toBeVisible()
  })

  test('shows QR code after successful create transaction', async ({ page }) => {
    await page.goto('/dukung')
    await page.click('[data-testid="amount-25000"]')
    await page.click('[data-testid="payment-qris"]')
    await page.click('[data-testid="donation-submit"]')
    await expect(page.locator('[data-testid="qr-code"]')).toBeVisible()
    await expect(page.locator('[data-testid="payment-expiry"]')).toBeVisible()
  })

  test('webhook updates donation status to settled', async ({ request }) => {
    const webhook = await request.post('/api/donation/webhook', {
      data: {
        event: 'payment.settled',
        data: {
          transaction_id: 'test-transaction-id',
          order_id: 'test-order-id',
          status: 'settled',
          amount: 50750,
          net_amount: 50000,
          payment_type: 'qris'
        }
      }
    })
    expect(webhook.status()).toBe(200)
    // Verify database record updated
  })

  test('webhook returns 200 even on invalid payload', async ({ request }) => {
    const webhook = await request.post('/api/donation/webhook', {
      data: { invalid: true }
    })
    expect(webhook.status()).toBe(200)
  })

  test('invalid amount rejected', async ({ page }) => {
    await page.goto('/dukung')
    await page.fill('[data-testid="amount-custom"]', '100')
    await page.click('[data-testid="payment-qris"]')
    await page.click('[data-testid="donation-submit"]')
    await expect(page.locator('[data-testid="amount-error"]')).toBeVisible()
  })

  test('rate limit blocks excessive create requests', async ({ request }) => {
    for (let i = 0; i < 6; i++) {
      await request.post('/api/donation/create', {
        data: { amount: 25000, payment_type: 'qris' }
      })
    }
    const response = await request.post('/api/donation/create', {
      data: { amount: 25000, payment_type: 'qris' }
    })
    expect(response.status()).toBe(429)
  })
})
```

### 6.5 Editorial Workflow Testing (Phase 2)

```typescript
// __tests__/e2e/editorial.spec.ts

test.describe('Editorial Workflow', () => {
  test('cannot publish without POV tag', async ({ page }) => {
    await page.goto('/admin/articles/new')
    await page.fill('[data-testid="article-title"]', 'Test Article')
    await page.fill('[data-testid="article-body"]', 'Test body content')
    // Do not select any POV tag
    await page.click('[data-testid="publish-button"]')
    await expect(page.locator('[data-testid="pov-required-error"]')).toBeVisible()
  })

  test('cannot publish without human signature checkbox', async ({ page }) => {
    await page.goto('/admin/articles/new')
    await page.fill('[data-testid="article-title"]', 'Test Article')
    await page.fill('[data-testid="article-body"]', 'Test body content')
    await page.click('[data-testid="pov-tag-kontra-narasi"]')
    // Do not check human signature
    await page.click('[data-testid="publish-button"]')
    await expect(page.locator('[data-testid="human-signature-required-error"]')).toBeVisible()
  })

  test('angle test checklist appears before publish', async ({ page }) => {
    await page.goto('/admin/articles/new')
    await page.fill('[data-testid="article-title"]', 'Test Article')
    await page.fill('[data-testid="article-body"]', 'Test body content')
    await page.click('[data-testid="pov-tag-refleksi"]')
    await page.check('[data-testid="human-signature-checkbox"]')
    await page.click('[data-testid="publish-button"]')
    await expect(page.locator('[data-testid="angle-test-modal"]')).toBeVisible()
  })

  test('fact-check status can be updated', async ({ page }) => {
    await page.goto('/admin/articles/test-article')
    await page.selectOption('[data-testid="fact-check-status"]', 'verified')
    await page.click('[data-testid="save-button"]')
    await expect(page.locator('[data-testid="fact-check-status"]')).toHaveValue('verified')
  })
})
```

### Editorial Workflow Unit Tests

```typescript
// tests/unit/editorial.test.ts
import { describe, test, expect } from 'vitest'
import { validatePovTag, validateReviewTransition, validateSourceReference } from '@/lib/editorial'

describe('POV Tag Validation', () => {
  test('accepts valid POV tags', () => {
    expect(validatePovTag('kontra-narasi')).toBe(true)
    expect(validatePovTag('refleksi')).toBe(true)
    expect(validatePovTag('data')).toBe(true)
    expect(validatePovTag('framework')).toBe(true)
  })

  test('rejects invalid POV tags', () => {
    expect(validatePovTag('')).toBe(false)
    expect(validatePovTag('invalid')).toBe(false)
    expect(validatePovTag(null)).toBe(false)
  })
})

describe('Review Pipeline Transition', () => {
  test('draft -> review is valid', () => {
    expect(validateReviewTransition('draft', 'review')).toBe(true)
  })

  test('review -> fact-check is valid', () => {
    expect(validateReviewTransition('review', 'fact-check')).toBe(true)
  })

  test('fact-check -> published is valid with human signature', () => {
    expect(validateReviewTransition('fact-check', 'published', { humanSignature: true })).toBe(true)
  })

  test('fact-check -> published is invalid without human signature', () => {
    expect(validateReviewTransition('fact-check', 'published', { humanSignature: false })).toBe(false)
  })

  test('draft -> published is invalid (must go through pipeline)', () => {
    expect(validateReviewTransition('draft', 'published')).toBe(false)
  })
})

describe('Source Reference Validation', () => {
  test('valid link reference', () => {
    expect(validateSourceReference({ type: 'link', url: 'https://example.com', label: 'Example' })).toBe(true)
  })

  test('invalid URL for link type', () => {
    expect(validateSourceReference({ type: 'link', url: 'not-a-url', label: 'Bad' })).toBe(false)
  })

  test('footnote does not require URL', () => {
    expect(validateSourceReference({ type: 'footnote', url: '', label: 'BPS 2024' })).toBe(true)
  })

  test('empty label is invalid', () => {
    expect(validateSourceReference({ type: 'link', url: 'https://example.com', label: '' })).toBe(false)
  })
})
```

### TikTok Pipeline E2E Tests

```typescript
// tests/e2e/tiktok-pipeline.spec.ts
import { test, expect } from '@playwright/test'

test.describe('TikTok Pipeline', () => {
  test('admin can generate script from published article', async ({ page }) => {
    await page.goto('/admin/tiktok')
    await page.click('[data-testid="generate-script-btn"]')
    await page.selectOption('[data-testid="article-select"]', 'test-article-slug')
    await page.click('[data-testid="confirm-generate"]')
    await expect(page.locator('[data-testid="script-draft"]')).toBeVisible()
  })

  test('hook line library CRUD', async ({ page }) => {
    await page.goto('/admin/tiktok/hook-lines')
    await page.click('[data-testid="add-hook-line"]')
    await page.fill('[data-testid="hook-text"]', 'Kenapa kamu selalu...')
    await page.fill('[data-testid="hook-formula"]', 'Kontra-narasi')
    await page.click('[data-testid="save-hook"]')
    await expect(page.locator('text=Kenapa kamu selalu...')).toBeVisible()
  })

  test('script status transitions', async ({ page }) => {
    await page.goto('/admin/tiktok')
    await page.click('[data-testid="script-1"]')
    await page.click('[data-testid="approve-btn"]')
    await expect(page.locator('[data-testid="status-badge"]')).toHaveText('Approved')
  })
})
```

---

## 7. Manual Testing Checklist

### Visual / UI (sebelum setiap deploy besar)

**Desktop (1440px)**
- [ ] Homepage tampil sesuai design
- [ ] Artikel readable, font size dan line-height benar
- [ ] Newsletter form aligned
- [ ] Footer lengkap

**Mobile (375px - iPhone SE)**
- [ ] Nav hamburger berfungsi
- [ ] Artikel readable tanpa horizontal scroll
- [ ] Newsletter form mudah diisi
- [ ] Cards stack dengan benar

**Tablet (768px)**
- [ ] Layout transisi dengan smooth
- [ ] Tidak ada elemen yang overlap

### Browser Testing
- [ ] Chrome (terbaru)
- [ ] Firefox (terbaru)
- [ ] Safari (iOS) - kritis untuk user Indonesia
- [ ] Samsung Internet - kritis untuk Android mid-range

### Payment Testing (Phase 2)
- [ ] Donation page `/dukung` tampil dengan benar
- [ ] Pilih nominal dan metode pembayaran berfungsi
- [ ] QRIS generate QR code
- [ ] VA generate nomor VA
- [ ] Webhook update status di database
- [ ] Halaman terima kasih muncul setelah settled
- [ ] Rate limit aktif
- [ ] API key Louvin tidak terlihat di browser network tab
- [ ] Invalid amount ditolak
- [ ] Expired payment handling OK

### Editorial Workflow Testing (Phase 2)
- [ ] Editorial checklist muncul di admin panel sebelum publish
- [ ] Angle test prompt muncul sebelum publish button
- [ ] Artikel tidak bisa publish tanpa minimal 1 POV tag
- [ ] Human signature checkbox wajib diceklis sebelum publish
- [ ] Fact-check status bisa di-update (pending -> verified)
- [ ] Source reference bisa ditambahkan per artikel
- [ ] Review pipeline status terlihat di admin dashboard

---

## 8. Performance Testing

### Core Web Vitals Targets
| Metric | Target | Tool |
|---|---|---|
| LCP (Largest Contentful Paint) | < 2.5s | PageSpeed Insights |
| FID / INP | < 100ms | PageSpeed Insights |
| CLS (Cumulative Layout Shift) | < 0.1 | PageSpeed Insights |
| Time to First Byte | < 800ms | WebPageTest |

### Test command
```bash
# Lighthouse CI (tambahkan ke GitHub Actions)
npm install -g @lhci/cli
lhci autorun
```

---

## 9. Running Tests

```bash
# Unit + Integration tests
npm run test

# Watch mode (development)
npm run test:watch

# Coverage report
npm run test:coverage

# E2E tests (butuh running server)
npm run build && npm run start
npx playwright test

# E2E specific file
npx playwright test homepage.spec.ts

# E2E dengan UI
npx playwright test --ui
```

---

## 10. Coverage Target

| Area | Target Coverage |
|---|---|
| Utility functions | 90%+ |
| API route handlers | 85%+ |
| React components (logic) | 70%+ |
| E2E happy paths | 100% dari flow kritis |

> **Catatan:** Coverage angka bukan tujuan utama. Test yang bermakna > coverage tinggi. Jangan test implementation detail, test behavior.

---

## 11. Changelog

| Versi | Tanggal | Perubahan |
|---|---|---|
| 1.0 | Jun 2026 | Draft awal. |
| 1.3 | Jul 2026 | Added editorial workflow E2E tests (POV tag, human signature, angle test modal, fact-check status) and manual editorial checklist. |
| 1.4 | Jul 2026 | Added editorial unit tests (POV tag validation, review pipeline transitions, source reference validation), TikTok pipeline E2E tests (script generation, hook line CRUD, status transitions). |
| 1.2 | Jul 2026 | Added donation/payment E2E tests, webhook tests, rate limit tests, manual payment checklist. |
| 1.1 | Jul 2026 | Added E2E analytics testing (article_read_complete, Umami load, event fire, UTM). |
