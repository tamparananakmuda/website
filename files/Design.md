# Design.md - Visual Identity & Design System
# TAMPARAN ANAK MUDA Website

**Versi:** 1.4  
**Status:** Draft - comprehensive design system + donation UI + editorial UI + TikTok UI + anti-AI slop upgrade

---

## 1. Design Philosophy

TAM bukan blog motivasi biasa. Desainnya harus mencerminkan sesuatu yang **berani, jujur, dan tidak generik** - seperti tamparan yang mengubah perspektif, bukan pelukan yang menenangkan.

**Reading this as:** editorial/content brand website for young Indonesian audience, with a bold-but-clean language, leaning toward native CSS + Tailwind + Motion, high-end typography over decoration.

**Tiga kata kunci desain:**
- **TAJAM** - tipografi dan layout yang assertif, tidak ragu-ragu
- **BERSIH** - whitespace yang bernafas, tidak sesak
- **BERNYAWA** - ada satu elemen signature yang diingat

### Anti-AI Slop Discipline

Desain TAM harus terhindar dari tanda-tanda generic AI:
- **No purple/blue glow gradients.** Gunakan warna brand yang dikalibrasi, bukan gradient neon default.
- **No three equal feature cards in a row.** Variasikan layout: asymmetric grid, split screen, bento, atau scroll-pinned.
- **No Inter as default.** Pilih display font yang punya karakter.
- **No centered hero dengan H1 generic.** Homepage hero boleh center untuk manifesto, tapi interior pages pakai left-aligned atau asymmetric split.
- **No decorative dots / status pills di setiap list.** Gunakan hanya untuk state yang real.
- **No em-dash (`-`) sebagai elemen desain.** Gunakan titik atau garis miring.
- **No fake screenshots built from divs.** Setiap visual harus real: foto, ilustrasi, atau SVG mark yang berarti.
- **No generic stock-photo aesthetic.** Setiap image harus punya seed/descriptive context yang cocok dengan TAM.

---

## 2. Color Palette

```
Nama              Hex        Penggunaan
────────────────────────────────────────────────────
Hitam Dalam       #0A0A0A    Background utama, teks heading
Abu Gelap         #141414     Card background, elevated surface
Abu Tengah        #737373     Teks secondary, metadata
Abu Terang        #E5E5E5     Teks body di atas dark bg
Putih Kertas      #FAF9F6     Background halaman artikel (light)
Merah Tamparan    #D13A3A     Accent utama - CTA, highlight, underline
Merah Hover       #A82E2E     Button hover, active state
Merah Subtle      #D13A3A14   Background tint, focus ring glow
```

**Rationale:**
- Dark-first palette dengan **off-black** (#0A0A0A), bukan pure black (#000000) - memberikan depth dan lebih premium.
- **Saturation terkontrol**: merah tidak meledak, cukup bold untuk CTA tanpa terlihat "warning".
- **Light mode hanya untuk artikel**: Putih Kertas sedikit warm agar nyaman di mata untuk long-form reading.
- **Tidak ada gradient generik**: jika pakai gradient, hanya subtle directional tint dari brand red (contoh: `linear-gradient(135deg, #0A0A0A 0%, #141414 100%)`).

**Color Consistency Lock:**
- **Main accent = Merah Tamparan.** CTA, focus states, hover, link, dan elemen interaksi utama selalu merah.
- **Category colors** (lihat `Architecture.md` seed) boleh berbeda untuk category badge/label - tapi hanya sebagai label, bukan sebagai accent utama page.
- Gray family tunggal: warm-neutral atau cool-neutral, tidak dicampur.

---

## 3. Design Tokens

### CSS Variables

```css
:root {
  /* Colors */
  --color-black-deep: #0A0A0A;
  --color-black-card: #141414;
  --color-gray-mid: #737373;
  --color-gray-light: #E5E5E5;
  --color-white-paper: #FAF9F6;
  --color-red-slap: #D13A3A;
  --color-red-slap-hover: #A82E2E;
  --color-red-slap-subtle: rgba(209, 58, 58, 0.08);

  /* Typography */
  --font-display: 'Clash Display', 'Syne', sans-serif;
  --font-body: 'Plus Jakarta Sans', 'Inter', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Spacing (4px base, 1.5x scale for larger steps) */
  --space-0: 0px;
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
  --space-7: 48px;
  --space-8: 64px;
  --space-9: 96px;
  --space-10: 128px;

  /* Border Radius */
  --radius-none: 0px;
  --radius-sm: 2px;
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-pill: 999px;

  /* Shadows (tinted to background) */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.24);
  --shadow-card: 0 4px 24px rgba(0, 0, 0, 0.24);
  --shadow-elevated: 0 8px 40px rgba(0, 0, 0, 0.32);
  --shadow-red-glow: 0 0 0 3px rgba(209, 58, 58, 0.15);

  /* Motion */
  --duration-instant: 100ms;
  --duration-fast: 150ms;
  --duration-base: 250ms;
  --duration-slow: 400ms;
  --duration-slower: 600ms;
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);

  /* Z-index scale */
  --z-base: 0;
  --z-above: 10;
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-drawer: 250;
  --z-modal: 300;
  --z-toast: 400;
  --z-grain: 500;
}
```

### Token Usage Rules

- Selalu gunakan tokens, bukan raw values.
- Jangan hardcode hex, font-size, spacing, atau z-index di komponen.
- Extend tokens via Tailwind config, bukan override one-off.
- Gunakan `--ease-spring` untuk micro-interactions (hover, toggle), bukan linear atau ease-in-out biasa.
- Gunakan `--duration-slow` atau lebih untuk scroll-reveal; `--duration-fast` untuk hover/active states.

---

## 4. Typography

### Display Face - **Clash Display** (primary), **Syne** (fallback)
- Digunakan untuk: Headline besar, nama brand, hero text
- Weight: 600-700
- Karakter: Geometric tapi punya kepribadian, terasa muda dan tegas
- Sumber: Google Fonts / Fontshare (gratis)

### Body Face - **Plus Jakarta Sans**
- Digunakan untuk: Artikel, paragraf, UI elements
- Weight: 400 (body), 500 (label), 600 (subheading)
- Karakter: Buatan Indonesia, sangat readable, sedikit karakter
- Sumber: Google Fonts

### Utility Face - **JetBrains Mono**
- Digunakan untuk: Statistik, quote callout, code/technical snippets
- Digunakan sparingly untuk efek kontras

### Type Scale

```
Token         Desktop  Tablet  Mobile  Weight  Line-Height  Usage
────────────────────────────────────────────────────────────────────
display-xl    80px     56px    40px    700     1.0          Hero headline (max 6-8 words)
display-lg    56px     44px    32px    700     1.05         Page title
heading-lg    40px     32px    28px    600     1.15         Section heading
heading-md    28px     24px    20px    600     1.25         Card title, artikel heading
body-lg       18px     18px    17px    400     1.65         Artikel body text
body-md       16px     16px    15px    400     1.6          UI text, description
body-sm       14px     14px    13px    400     1.5          Metadata, tag, caption
label         12px     12px    11px    500     1.4          Uppercase label, eyebrow
```

### Typography Rules

- **Hero headline max 2 lines** di desktop. Jika lebih panjang, turunkan font-size atau potong copy.
- **Display italic clearance:** jika italic digunakan di display dan ada descender (y, g, j, p, q), gunakan `line-height: 1.1` minimum + `padding-bottom: 2px`.
- **No mixed-family emphasis:** jika ingin menekankan kata dalam headline, gunakan italic atau bold dari font yang sama. Jangan injek serif ke dalam sans headline atau sebaliknya.
- **Body width cap:** max-width 65ch untuk paragraf artikel agar readable.
- **Uppercase label restraint:** maksimal 1 eyebrow per 3 section. Jangan taruh eyebrow di setiap heading.

### Letter Spacing

- **Display:** -0.03em (tight, premium)
- **Body:** 0 (normal)
- **Label:** 0.08em (uppercase label, sedikit wide)

### Font Loading

- Self-host via `next/font/local` atau `next/font/google` dengan `font-display: swap`.
- Jangan pakai `<link>` Google Fonts langsung di production.

---

## 5. Signature Element

**The Slash Mark - `//`**

Digunakan sebagai visual signature TAM di seluruh site:
- Sebelum eyebrow label: `// PERSPEKTIF`
- Sebagai divider section
- Di hero sebagai aksen dekoratif

Ini bukan angka urut (yang generik), ini adalah karakter yang punya makna: "potong asumsimu."

---

## 6. Layout System

### Grid
- **Desktop:** 12-column, max-width **1400px**, gutter 24px
- **Tablet:** 8-column, max-width 1000px
- **Mobile:** 4-column, padding 16px (20px pada phablet)

### Layout Variance
- **Anti-center bias:** interior pages (artikel, kategori, tentang) default **left-aligned** content. Hero homepage boleh center untuk manifesto.
- **Asymmetric split:** 2-column layouts menggunakan rasio `7:5` atau `2:1`, bukan 50:50.
- **Bento grids:** gunakan tile sizes bervariasi - jangan 3 atau 4 kartu identik.
- **Section layout repetition ban:** 8 sections di page minimal harus pakai 4 layout family berbeda.

### Spacing Scale (4px base, 1.5x scale)
```
4px    - 1  (tight detail)
8px    - 2
12px   - 3
16px   - 4
24px   - 5
32px   - 6
48px   - 7
64px   - 8
96px   - 9  (section gap)
128px  - 10 (hero/major section)
```

### Vertical Rhythm
- **Section gap:** 96px-128px di desktop, 64px-96px di mobile.
- **Hero top padding:** maksimal `pt-24` (96px) di desktop. Jangan biarkan hero content melayang di tengah viewport.
- **Hero min-height:** gunakan `min-h-[100dvh]`, bukan `h-screen`.

### Border Radius (Shape Consistency Lock)
- **Cards:** `4px` (sedikit saja, kesan sharp)
- **Badge/tag:** `2px`
- **Button:** `4px`
- **Pill buttons (CTA secondary):** `999px` - hanya untuk secondary/outline CTAs
- **Rule:** satu page harus konsisten. Jangan mix square cards dengan pill buttons tanpa aturan yang jelas.

---

## 7. Component Patterns

### Article Card (Bento / Asymmetric)
```
┌─────────────────────────────────────────┐
│  // MINDSET                             │
│                                         │
│  Judul Artikel Yang Berani dan Tajam    │
│  3 menit baca · 12 Jun 2026             │
│                                         │
│  ────────────────────────               │
└─────────────────────────────────────────┘
```
- Background: `--color-black-card`
- Hover: border-left 3px merah, subtle shadow, `translateY(-2px)` dengan spring ease
- No decorative border-bottom atau hairline di setiap card - gunakan satu subtle divider atau negative space

### Newsletter CTA
```
┌─────────────────────────────────────────┐
│  // LANGGANAN                           │
│                                         │
│  Satu email per minggu.                 │
│  Tidak ada spam. Hanya tamparan.        │
│                                         │
│  [email@kamu.com          ] [SUBSCRIBE] │
│  Kami tidak akan spam.                  │
└─────────────────────────────────────────┘
```
- Helper text di bawah input, bukan placeholder-as-label
- Button primary full-width di mobile, auto di desktop
- Success state: inline text hijau, bukan modal

### Quote Callout (dalam artikel)
```
  ┌────────────────────────────────────┐
  │  "Kalimat yang perlu diingat       │
  │   dari artikel ini."               │
  └────────────────────────────────────┘
```
- Background: `--color-red-slap`
- Teks: putih, body-lg italic
- Padding besar, tanpa shadow - flat dan bold

### Donation CTA (Inline & Footer)
```
┌─────────────────────────────────────────┐
│  // DUKUNG TAM                          │
│                                         │
│  Semua konten tetap gratis.             │
│  Dukungan kamu membantu kami terus      │
│  berkarya.                              │
│                                         │
│  [Dukung TAM]                           │
└─────────────────────────────────────────┘
```
- CTA copy personal: "Dukung TAM", bukan "Donasi"
- Secondary outline pill di footer, primary red di inline article

### Donation Page `/dukung`
```
┌─────────────────────────────────────────┐
│  // DUKUNG TAM                          │
│                                         │
│  Pilih nominal:                         │
│  [25rb] [50rb] [100rb] [200rb] [custom] │
│                                         │
│  Pilih metode pembayaran:               │
│  [QRIS] [GoPay] [ShopeePay]             │
│  [BNI VA] [BRI VA] [Permata] [CIMB]     │
│                                         │
│  [Nama (opsional)]                     │
│  [Email (opsional)]                    │
│                                         │
│  Total: Rp 50.750 (termasuk fee Rp 750) │
│                                         │
│  [Lanjutkan Pembayaran]                 │
└─────────────────────────────────────────┘
```
- Amount buttons: toggle-style, selected state border red, fill subtle
- Payment method: icon + label, selected state red border
- Total transparan: amount + fee + total
- Loading state: skeleton shimmer saat create transaction

### Payment Display (QRIS)
```
┌─────────────────────────────────────────┐
│  Scan QRIS untuk membayar               │
│  [QR CODE]                              │
│  Berlaku s/d 10:45 (15 menit)           │
│  [Unduh QR] [Copy Nominal]              │
└─────────────────────────────────────────┘
```
- QR area: border 1px abu tengah, padding 24px
- Countdown bar progress yang menyusut

### Payment Display (VA)
```
┌─────────────────────────────────────────┐
│  Transfer ke Virtual Account            │
│  Bank: BNI                              │
│  Nomor VA: 8810 1234 5678 9012          │
│  [Copy Nomor VA]                        │
│  Berlaku s/d besok 10:30                │
└─────────────────────────────────────────┘
```
- VA number: font mono, large, copy button di samping
- Countdown timer

### Hero (Homepage - Manifesto)
```
┌─────────────────────────────────────────┐
│                                         │
│  TAMPARAN ANAK MUDA                     │
│                                         │
│  Perspektif yang tidak nyaman,          │
│  tapi yang kamu butuhkan.               │
│                                         │
│  [Jelajahi Artikel]                     │
│                                         │
└─────────────────────────────────────────┘
```
- Max 4 text elements: brand mark, headline, subtext, CTA
- No tagline below CTA, no logo wall, no trust strip
- Subtext max 20 words, headline max 2 lines

### Navigation
```
┌─────────────────────────────────────────┐
│  TAM    Artikel · Seri · Tentang   [Menu]│
└─────────────────────────────────────────┘
```
- Height: 64px desktop, 56px mobile
- Single line di desktop - jika tidak muat, drop items ke hamburger
- Sticky dengan backdrop blur minimal (glassmorphism tipis)

### Editorial Workflow UI Patterns (Phase 1 admin, Phase 2 full)

**Angle Test Modal:**
```
┌───────────────────────────────────────┐
│  ANGLE TEST                           │
│  // Apakah artikel ini punya angle?   │
├───────────────────────────────────────┤
│  [ ] Artikel punya POV yang jelas     │
│  [ ] Angle tidak bisa ditemukan di    │
│      3 artikel pertama Google         │
│  [ ] Ada human signature (pengalaman/ │
│      observasi/opini spesifik)        │
│  [ ] Headline deliver what it promises│
├───────────────────────────────────────┤
│  [Lolos]              [Revisi]        │
└───────────────────────────────────────┘
```
- Modal muncul saat transisi draft -> review
- Jika gagal: tampilkan alasan dan tombol "Revisi"
- Jika lolos: status berubah ke review, modal close dengan animasi subtle

**POV Tag Selector:**
```
┌───────────────────────────────────────┐
│  POV TAG (wajib sebelum review)       │
│  ┌─────────────┐ ┌─────────────┐      │
│  │ Kontra-     │ │ Refleksi    │      │
│  │ narasi      │ │             │      │
│  └─────────────┘ └─────────────┘      │
│  ┌─────────────┐ ┌─────────────┐      │
│  │ Data        │ │ Framework   │      │
│  └─────────────┘ └─────────────┘      │
└───────────────────────────────────────┘
```
- 4 kartu dalam grid 2x2
- Selected state: border accent + checkmark
- Tidak bisa kirim ke review tanpa pilih minimal 1

**Fact-Check Status Indicator:**
```
┌───────────────────────────────────────┐
│  FACT-CHECK STATUS                    │
│  ● Pending    ○ Verified    ○ Flagged │
└───────────────────────────────────────┘
```
- 3 state dengan color coding: pending (abu), verified (hijau), flagged (merah)
- Klik state untuk update via PUT /api/posts/[id]/fact-check

**Source Reference Manager:**
```
┌───────────────────────────────────────┐
│  SOURCE REFERENCES                    │
├───────────────────────────────────────┤
│  [Link]    https://...    [Hapus]     │
│  [Footnote] BPS 2024       [Hapus]     │
│  [Inline]  “...”           [Hapus]     │
├───────────────────────────────────────┤
│  Type: [Link v]                       │
│  URL/Label: [_______________]         │
│  [Tambah]                             │
└───────────────────────────────────────┘
```
- List source references yang sudah ditambahkan
- Form untuk tambah reference baru
- Type selector: link, footnote, inline

**Review Pipeline Status Bar:**
```
┌───────────────────────────────────────┐
│  DRAFT ──> REVIEW ──> FACT-CHECK ──> PUBLISH │
│   ●         ○           ○              ○    │
└───────────────────────────────────────┘
```
- Horizontal progress bar dengan 4 state
- Current state: filled circle (accent color)
- Completed states: filled circle (muted accent)
- Future states: empty circle (border only)

### TikTok Pipeline UI Patterns (Phase 2)

**Script Generation Interface:**
```
┌───────────────────────────────────────┐
│  TIKTOK SCRIPT MANAGER                │
├───────────────────────────────────────┤
│  [+ Generate dari Artikel]            │
├───────────────────────────────────────┤
│  Script #1  | Draft   | "Kenapa..."   │
│  Script #2  | Approved| “Gaji pertama” │
│  Script #3  | Published| [video url]   │
└───────────────────────────────────────┘
```
- List semua scripts dengan status badge
- Button generate script dari artikel published
- Klik script untuk edit detail

**Hook Line Library:**
```
┌───────────────────────────────────────┐
│  HOOK LINE LIBRARY                    │
├───────────────────────────────────────┤
│  “Kenapa kamu...”    | Formula A      │
│  “Semua bilang...”   | Kontra-narasi  │
│  “Saya habis...”     | Refleksi       │
├───────────────────────────────────────┤
│  [+ Tambah Hook Line]                 │
└───────────────────────────────────────┘
```
- Tabel hook_lines dengan text, formula, category
- CRUD via admin panel
- Search/filter by category

### Donation QR Code Display Spec

**QRIS Display:**
```
┌───────────────────────────────────────┐
│  QRIS PAYMENT                         │
│  ┌─────────────────────┐              │
│  │                     │              │
│  │     [QR CODE]       │              │
│  │     200x200px       │              │
│  │                     │              │
│  └─────────────────────┘              │
│  Scan untuk bayar                     │
│  Berlaku: 14:59                       │
│  Rp 50.000                            │
└───────────────────────────────────────┘
```
- QR code min 200x200px (mobile), 240x240px (desktop)
- Alt text: "QR code untuk pembayaran Rp [amount] via QRIS"
- Countdown timer dengan `aria-live="polite"`
- QR code bisa di-screenshot
- Expired state: QR code blur + pesan "QR expired, silakan buat transaksi baru"

**VA Number Display:**
```
┌───────────────────────────────────────┐
│  BNI VIRTUAL ACCOUNT                  │
│  ┌─────────────────────────────────┐  │
│  │  9801 2345 6789 0              │  │
│  │                       [Copy]   │  │
│  └─────────────────────────────────┘  │
│  Berlaku: 23:59:59                    │
│  Rp 50.000                            │
└───────────────────────────────────────┘
```
- VA number auto-format dengan spasi (4 digit groups)
- Copy button dengan `aria-label` dan `aria-live` feedback
- Copy success: checkmark animation 1.5s
- Countdown timer untuk expired
- Bank logo/name prominent di atas

---

## 8. Motion & Animation

**Prinsip: Motion harus motivated. Setiap animasi menjawab: hierarchy, storytelling, feedback, atau state transition.**

### Motion Intensity
- **Default:** 6/10 - fluid, smooth, tidak berlebihan.
- **Hero:** 7/10 - page load reveal + stagger.
- **Article pages:** 3/10 - minimal, fokus reading.
- **Donation flow:** 5/10 - feedback states, countdown, loading.

### Motion Patterns

| Interaction | Animation | Easing | Duration |
|---|---|---|---|
| Hero headline load | Per-word fade + slide-up (y: 24px) | `--ease-out` | 0.6s, stagger 0.08s |
| Article cards scroll reveal | y: 40px → 0, opacity 0 → 1 | `--ease-out` | 0.5s, stagger 0.06s |
| Card hover | border-left grow 0 → 3px, `translateY(-2px)` | `--ease-spring` | 0.25s |
| Button hover | background darken, `translateY(-1px)` | `--ease-out` | 0.15s |
| Button active | `scale(0.98)` | `--ease-out` | 0.1s |
| Input focus | border red + shadow-glow | `--ease-out` | 0.2s |
| Page transition | Cross-fade (Next.js App Router) | `--ease-in-out` | 0.3s |
| Donation countdown | Linear progress bar shrink | `linear` | remaining seconds |
| Skeleton shimmer | x-position gradient sweep | `linear` | 1.5s infinite |

### What to Avoid
- **NO parallax berlebihan** - membuat motion sickness.
- **NO cursor custom** - accessibility-hostile dan terasa dated.
- **NO background video/animated gradient** - mengganggu fokus reading.
- **NO infinite loop animation** kecuali benar-benar perlu (misal: countdown, loading).
- **NO `window.addEventListener('scroll')` untuk animasi** - gunakan `IntersectionObserver`, Motion `whileInView`, atau CSS `scroll-driven animations`.

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```
- Jika user prefers reduced motion, semua entrance animation di-disable.
- Hover state tetap ada (color change) tapi tanpa movement.
- Countdown tetap berjalan (functional) tapi tanpa animasi visual tambahan.

### Implementation
- Gunakan **Motion (`motion/react`)** untuk UI motion: card hover, button press, stagger reveal.
- Gunakan **GSAP + ScrollTrigger** hanya untuk scroll-pinned sections (jika ada di Phase 3+).
- Gunakan **CSS `scroll-driven animations`** untuk reveal sederhana jika browser support.
- Semua animasi berat di-isolate dalam Client Component leaf dengan `'use client'`.

---

## 9. Dark/Light Mode

### Strategy

- **Default:** Dark mode (homepage, listing page, tentang, dukung).
- **Article pages:** Light mode otomatis (Putih Kertas background) untuk reading comfort.
- **Phase 1:** No manual toggle - deliberate choice untuk mengurangi friction.
- **Phase 2+:** Tambahkan manual toggle di footer/navbar. Saat itu, `theme_toggle` event di `Analytics.md` aktif.

### Token Strategy

Gunakan **Tailwind `dark:` variant** untuk utility-first, dengan semantic tokens di CSS variables:

```css
:root {
  --surface: #0A0A0A;
  --surface-elevated: #141414;
  --surface-paper: #FAF9F6;
  --text-primary: #E5E5E5;
  --text-secondary: #737373;
  --text-primary-inverse: #0A0A0A;
  --accent: #D13A3A;
  --accent-hover: #A82E2E;
  --border: rgba(229, 229, 229, 0.1);
}

[data-theme="light"] {
  --surface: #FAF9F6;
  --surface-elevated: #FFFFFF;
  --surface-paper: #FFFFFF;
  --text-primary: #0A0A0A;
  --text-secondary: #737373;
  --text-primary-inverse: #FAF9F6;
  --accent: #D13A3A;
  --accent-hover: #A82E2E;
  --border: rgba(10, 10, 10, 0.1);
}
```

### Rules
- **Page Theme Lock:** satu page satu tema. Tidak boleh dark section di tengah light page atau sebaliknya.
- **Dark mode jangan pure #000:** gunakan off-black `#0A0A0A`.
- **Light mode jangan pure #FFF:** gunakan off-white `#FAF9F6`.
- **Accent tetap merah** di kedua mode untuk brand consistency.

---

## 10. Responsive Design

### Breakpoints

```
sm  : 640px
md  : 768px
lg  : 1024px
xl  : 1280px
2xl : 1536px
```

### Mobile-First Defaults

- **Container:** `max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12`.
- **Typography:** Semua heading scale down sesuai Type Scale. Jangan pakai `clamp()` tanpa fallback.
- **Hero min-height:** `min-h-[100dvh]` - never `h-screen` karena iOS address bar.
- **Touch targets:** minimum 44x44px untuk semua interactive elements.

### Responsive Patterns

| Desktop | Mobile |
|---|---|
| 12-column grid | 4-column stack |
| Asymmetric split (7:5) | Single column, full-width |
| Article card grid (2-3 kolom) | Single column, full-width cards |
| Newsletter form inline | Stacked: input full-width, button full-width below |
| Donation amount row (5 buttons) | 2-column grid + custom full-width |
| Payment method grid | 2-column grid |

### Image Handling
- Gunakan `next/image` dengan `sizes` prop yang benar.
- Hero image: `priority` + `preload`.
- Artikel cover: responsive `srcSet`/`sizes` untuk 400w/800w/1200w.
- Jangan pakai image yang hardcoded width/height tanpa aspect ratio.

### Viewport Stability
- Reserve space untuk images dengan `aspect-ratio` container.
- Reserve space untuk dynamic content (dropdown, search results, donation payment display).
- Jangan memunculkan content yang menyebabkan layout shift setelah load.

---

## 11. Accessibility

### Contrast Requirements

- Body text di atas dark background: minimal ratio 7:1 (WCAG AAA).
- Merah `#D13A3A` untuk text/icon di atas hitam: verifikasi ratio ≥ 4.5:1 (AA). Jika tidak cukup, gunakan background merah dengan teks putih.
- Button primary text: selalu putih di atas merah, ratio ≥ 4.5:1.
- Ghost/outline button di atas dark bg: border dan text harus ≥ 4.5:1.

### Focus States

- Semua interactive elements (link, button, input) harus punya visible focus ring.
- Focus ring: `outline: 2px solid var(--color-red-slap)` dengan `outline-offset: 2px`.
- Jangan menghilangkan focus outline tanpa pengganti yang jelas.
- Focus ring tidak boleh tertutup oleh elemen lain (z-index awareness).

### Motion & Reduced Motion

- Animasi di Section 8 wajib respect `prefers-reduced-motion`.
- Jika user prefers reduced motion, semua entrance animation di-disable, hover tetap ada tapi tanpa movement.
- Reduced motion tidak mematikan functional animation (countdown, progress bar, loading).

### Screen Reader

- Logo/home link: `aria-label="TAMPARAN ANAK MUDA - Home"`.
- Newsletter form: label visible atau `sr-only`, error message via `aria-describedby`.
- Article cards: semantic heading structure (h1 hero, h2 cards, h1 artikel page).
- Donation payment display: `aria-live="polite"` untuk status update (pending/settled/failed).
- Copy button: `aria-label="Copy nomor VA"` dan feedback `aria-live`.

### Skip Links & Keyboard

- Skip to main content link pertama di DOM.
- Mobile menu: focus trap saat terbuka, escape untuk menutup.
- Tab order logical: tidak ada keyboard trap.

---

## 12. Component States

### Button States

| State | Style |
|---|---|
| Default | Background `--color-red-slap` (#D13A3A), teks putih, radius 4px |
| Hover | Background `--color-red-slap-hover` (#A82E2E), `translateY(-1px)`, shadow-subtle |
| Active/Pressed | Background lebih gelap, `scale(0.98)`, transition 100ms |
| Disabled | Opacity 0.5, cursor not-allowed, no hover effect |
| Loading | Spinner menggantikan teks, disabled, spinner red/white |
| Focus | Outline red slap, offset 2px |

### Input States

| State | Style |
|---|---|
| Default | Border 1px `--color-gray-mid`, background transparent |
| Focus | Border `--color-red-slap`, `--shadow-red-glow` |
| Error | Border `--color-red-slap`, icon error + pesan merah |
| Disabled | Opacity 0.5, background `--color-black-card` |
| Filled | Border `--color-gray-light` |

### Card States

| State | Style |
|---|---|
| Default | Background `--color-black-card`, border-left 0px |
| Hover | Border-left 3px `--color-red-slap`, shadow elevated, `translateY(-2px)` |
| Focus | Outline red slap, offset 2px |

### Amount Button (Donation)

| State | Style |
|---|---|
| Default | Border 1px `--color-gray-mid`, background transparent |
| Hover | Border `--color-red-slap`, background `--color-red-slap-subtle` |
| Selected | Border `--color-red-slap`, background `--color-red-slap-subtle`, teks putih |
| Disabled | Opacity 0.5 |

### Payment Method Button

| State | Style |
|---|---|
| Default | Border 1px `--color-gray-mid`, icon + label |
| Hover | Border `--color-red-slap` |
| Selected | Border `--color-red-slap`, background `--color-red-slap-subtle` |

---

## 13. Form & Input Patterns

### Newsletter Form

```
┌─────────────────────────────────────────┐
│  Label: Email                           │
│  [email@kamu.com          ]             │
│  Helper: Kami tidak akan spam.          │
│  [SUBSCRIBE]                            │
└─────────────────────────────────────────┘
```

- Input type: `email`
- Label: visible atau `sr-only` - jangan pakai placeholder sebagai label.
- Submit button: full width di mobile, auto di desktop
- Error: inline, border merah, pesan di bawah input
- Success: inline teks hijau "Cek email kamu untuk konfirmasi."
- Loading: button disabled dengan spinner, input tetap visible

### Donation Form

```
┌─────────────────────────────────────────┐
│  Label: Nominal Donasi                  │
│  [25rb] [50rb] [100rb] [200rb] [custom] │
│                                         │
│  Label: Metode Pembayaran               │
│  [QRIS] [GoPay] [ShopeePay] ...         │
│                                         │
│  Label: Nama (opsional)                 │
│  [Nama kamu]                            │
│                                         │
│  Label: Email (opsional)                │
│  [email@kamu.com]                       │
│                                         │
│  Total: Rp 50.750 (termasuk fee Rp 750) │
│  [Lanjutkan Pembayaran]                 │
└─────────────────────────────────────────┘
```

- Amount: toggle button group, custom input muncul saat "custom" dipilih.
- Payment method: icon + label, single select.
- Validation: amount > 0, payment_type valid, email valid jika diisi.
- Loading: shimmer skeleton atau spinner overlay di area payment display.

### Search Input (Phase 2)

- Input dengan icon search di kiri
- Clear button muncul saat ada text
- Submit on Enter
- Results: dropdown list dengan keyboard navigation
- Mobile: search modal fullscreen

---

## 14. Loading & Empty States

### Loading Skeletons

- Gunakan skeleton untuk article cards saat data fetching di client.
- Skeleton: rounded 4px, background `--color-black-card`, shimmer animation horizontal sweep.
- Jangan gunakan skeleton untuk SSG/ISR pages - gunakan instant render atau spinner minimal.
- Donation payment display: skeleton card yang menyerupai final layout (QR area, countdown bar, button).
- Never pakai generic circular spinner sebagai primary loading state - selalu prefer layout-matching skeleton.

### Empty States

| Situasi | Tampilan |
|---|---|
| 0 artikel | "Belum ada artikel. Ikuti IG untuk update." + link IG |
| 0 search result | "Tidak ada hasil untuk '[query]'. Coba kata kunci lain." |
| 404 | Pesan khas TAM + link ke /artikel |
| Error load | "Gagal memuat. Coba muat ulang." + button retry |
| Newsletter sudah subscribe | "Email ini sudah terdaftar. Selamat datang kembali." |
| Payment expired | "QR/VA sudah expired. Coba buat transaksi baru." |
| Payment pending | "Menunggu pembayaran..." + countdown timer + progress bar |
| Payment settled | "Terima kasih. Dukungan kamu sudah kami terima." |
| Payment failed | "Pembayaran gagal. Coba metode lain atau coba lagi." |

### Copy Principles for Empty/Error States
- Jangan salahkan user. Gunakan bahasa yang actionable.
- Hindari jargon teknis: "500 Internal Server Error" → "Gagal memuat. Coba muat ulang."
- Berikan next step yang jelas: link, button, atau instruksi.

---

## 15. Favicon & Icons

### Favicon Set

- `favicon.ico` - 32x32
- `favicon-16x16.png`
- `favicon-32x32.png`
- `apple-touch-icon.png` - 180x180
- `android-chrome-192x192.png`
- `android-chrome-512x512.png`
- `site.webmanifest` untuk PWA

### Icon Library

- Gunakan **Phosphor React** (`@phosphor-icons/react`) untuk UI icons - konsisten, modern, lightweight.
- Fallback: **HugeIcons** (`hugeicons-react`) atau **Tabler** (`@tabler/icons-react`) jika Phosphor tidak punya glyph yang dibutuhkan.
- Hindari emoji untuk icon penting - gunakan icon library.
- Brand icon: TAM monogram atau wordmark SVG.
- Standardize `strokeWidth` global: `1.5` untuk UI, `2` untuk emphasis.

---

## 16. Referensi Visual

Inspirasi yang relevan (bukan untuk ditiru, tapi untuk kalibrasi):
- **Are.na** - editorial, tidak mainstream, whitespace yang bernafas
- **The Pudding** - berani secara visual, substantif secara konten
- **Readymag / Cargo** - portfolio/editorial layout, asymmetric grids
- **Linear** - motion, typography, dan dark UI yang refined
- **Kumparan** (layout saja, bukan desainnya) - familiar untuk pembaca Indonesia

---

## 17. Anti-AI Slop Pre-Flight Checklist

Sebelum declare desain siap, jalankan checklist ini:

- [ ] Tidak ada gradient ungu/biru glow tanpa justifikasi brand.
- [ ] Tidak ada 3 kartu feature identik horizontal di page.
- [ ] Tidak ada Inter sebagai default font (kecuali brief meminta neutral standard).
- [ ] Tidak ada hero yang overflow sehingga CTA tidak terlihat tanpa scroll.
- [ ] Tidak ada eyebrow di setiap section - maksimal 1 per 3 section.
- [ ] Tidak ada em-dash (long dash) atau en-dash sebagai elemen desain atau copy.
- [ ] Tidak ada fake screenshot dari div rectangles.
- [ ] Tidak ada decorative dots/pills di setiap list item.
- [ ] Tidak ada section layout yang diulang lebih dari 2x berturut-turut.
- [ ] Tidak ada button CTA yang wrap ke 2 baris di desktop.
- [ ] Tidak ada border-top + border-bottom di setiap row list/table.
- [ ] Tidak ada center hero di interior pages tanpa alasan komposisi.
- [ ] Tidak ada pure black (#000) atau pure white (#FFF) sebagai background utama.
- [ ] Tidak ada icon library mix (Phosphor + Lucide dalam satu tree).
- [ ] Semua motion punya alasan: hierarchy, storytelling, feedback, atau state transition.
- [ ] Reduced motion diterapkan untuk semua non-essential animation.
- [ ] Contrast WCAG AA/AAA diterapkan untuk semua text dan interactive elements.

---

## 18. Changelog

| Versi | Tanggal | Perubahan |
|---|---|---|
| 1.0 | Jun 2026 | Draft awal. |
| 1.3 | Jul 2026 | Major design upgrade: anti-AI slop rules, modern typography, responsive design, motion system, semantic color tokens, Phosphor icons, pre-flight checklist. |
| 1.4 | Jul 2026 | Added editorial workflow UI patterns (angle test modal, POV tag selector, fact-check status indicator, source reference manager, review pipeline status bar), TikTok pipeline UI patterns (script generation interface, hook line library), donation QR code display spec, VA number display spec. |
| 1.2 | Jul 2026 | Added donation UI patterns (CTA, page, QRIS/VA display), payment states. |
| 1.1 | Jul 2026 | Design tokens, responsive type scale, accessibility, component states, forms, loading/empty states, favicon, changelog. |
