# Architecture.md - System Architecture
# TAMPARAN ANAK MUDA Website

**Versi:** 1.3  
**Status:** Draft - comprehensive architecture spec + Louvin payment + editorial workflow + TikTok pipeline

---

## 1. Architecture Decision: Static Site + Supabase

### Keputusan
**Next.js (App Router) + Supabase (PostgreSQL + Auth + Storage)**

### Rationale

| Opsi | Pro | Con | Verdict |
|---|---|---|---|
| **WordPress** | Familiar, plugin lengkap | Hosting cost, security burden, slow | ❌ |
| **Next.js + Sanity** | Fast, SEO-friendly, DX bagus | Vendor lock-in, pricing model tidak predictable | ❌ |
| **Next.js + Supabase** | Open-source, gratis generous, PostgreSQL native, Auth built-in, Storage built-in | Perlu setup sendiri | ✅ Recommended |
| **Astro + MDX** | Ultra-fast, file-based | Kurang fleksibel untuk non-dev editor | ⚠️ Alternatif |
| **Webflow** | Visual editor, cepat | Mahal, vendor lock-in | ❌ |

**Alasan Next.js + Supabase:**
- Vercel hosting gratis untuk hobby/small project
- Supabase free tier: 500MB database, 1GB storage, 50k monthly active users auth, 2GB bandwidth
- PostgreSQL native - data kita milik sendiri, bisa migrate kapan saja
- Supabase Auth built-in - siap untuk admin panel dan fitur user di Phase 2-3
- Supabase Storage - upload gambar/cover image dengan CDN bawaan
- Open-source, tidak ada vendor lock-in
- SEO optimal dengan SSG/ISR
- Yovie/tim BHUYA bisa extend sendiri

---

## 2. Tech Stack

```
Layer             Technology              Alasan
──────────────────────────────────────────────────────────────
Frontend          Next.js 15 (App Router) SSG + ISR, SEO, React 19
Styling           Tailwind CSS v4         Utility-first, konsisten
UI Components     shadcn/ui + Radix       Accessible, customizable
Database          Supabase (PostgreSQL)   Open-source, free tier, data milik sendiri
Auth              Supabase Auth           Built-in, cookie-based, siap Phase 2+
Storage           Supabase Storage        Upload gambar, CDN bawaan, 1GB free
CMS               Supabase + Admin Panel  Custom admin route di Next.js
Email/Newsletter  Brevo (ex-Sendinblue)   Free tier 300 email/hari
Payment Gateway   Louvin (louvin.dev)     QRIS, e-wallet, VA - no formal business docs
Analytics         Umami (self-hosted)     Privacy-first, gratis
Error Tracking    Sentry (free tier)      Error monitoring & performance
Web Vitals        web-vitals (npm)        Real-user CWV measurement
Uptime Monitoring Uptime Kuma (self-hosted) Downtime alert
Hosting           Vercel                  Free tier, auto-deploy dari Git
Domain            tamparananakmuda.com    Sudah dikonfigurasi
Search            Algolia (free tier)     Search artikel - Phase 2
OG Images         @vercel/og               Dynamic social preview
```

---

## 3. System Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                           USERS                             │
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTPS
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                        VERCEL CDN                           │
│                 (Edge Network, Global CDN)                  │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      NEXT.JS APP                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────────────┐    │
│  │  Pages   │  │   API    │  │   Static Assets        │    │
│  │ /        │  │  Routes  │  │   (images, fonts)      │    │
│  │ /artikel │  │          │  │                        │    │
│  │ /tentang │  │ /api/    │  │                        │    │
│  │ /seri    │  │ subscribe│  │                        │    │
│  └──────────┘  └──────────┘  └──────────────────────────┘    │
└──────┬──────────────┬────────────────────────────────────────┘
       │              │
       ▼              ▼
┌──────────┐   ┌──────────────┐   ┌──────────────────┐
│ SUPABASE │   │    BREVO     │   │     UMAMI        │
│ (DB+Auth │   │  (Email/     │   │  (Analytics)     │
│ +Storage)│   │  Newsletter) │   │                  │
└──────────┘   └──────────────┘   └──────────────────┘
       │                                              │
       ▼                                              ▼
┌──────────────┐   ┌──────────────────┐     ┌──────────────────┐
│  UPSTASH     │   │     SENTRY       │     │     LOUVIN       │
│  (Redis)     │   │  (Error/Perf)    │     │  (Payment GW)    │
│  (P1: rate   │   │                  │     │  (Phase 2)     │
│  limit, P2:  │   │                  │     │                  │
│  cache)      │   │                  │     │                  │
└──────────────┘   └──────────────────┘     └──────────────────┘

External Monitoring: Uptime Kuma (self-hosted) → pings tamparananakmuda.com
```

---

## 4. Content Model (Supabase Tables)

### Table: `categories` (Kategori)


```sql
create table categories (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  description text,
  color text not null,                   -- Hex color, e.g. '#D13A3A'
  created_at timestamptz default now()
);

-- Seed data kategori awal
insert into categories (title, slug, description, color) values
  ('Mindset', 'mindset', 'Cara pikir yang salah dipercaya, dan cara pikir alternatif yang lebih kuat.', '#D13A3A'),
  ('Karir & Tujuan', 'karir-tujuan', 'Navigasi dunia kerja dan pencarian makna di usia muda.', '#4080D9'),
  ('Relasi', 'relasi', 'Hubungan dengan orang lain, dengan diri sendiri, dengan komunitas.', '#40B880'),
  ('Keuangan', 'keuangan', 'Financial literacy yang realistis untuk anak muda Indonesia.', '#D9A040'),
  ('Identitas', 'identitas', 'Siapa kamu, kenapa kamu seperti ini, dan kamu mau jadi siapa.', '#A040D9');
```

### Table: `series` (Seri Konten)

```sql
create table series (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  description text,
  created_at timestamptz default now()
);

-- Index
create index idx_series_slug on series(slug);
```

### Table: `authors` (Penulis - Phase 2+)

```sql
create table authors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  bio text,
  avatar_url text,                       -- URL from Supabase Storage
  social_instagram text,
  social_twitter text,
  social_linkedin text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Default author: Yovie Setiawan (bisa di-insert via seed)
insert into authors (name, slug, bio) values
  ('Yovie Setiawan', 'yovie-setiawan', 'Founder TAMPARAN ANAK MUDA.');

-- Index
create index idx_authors_slug on authors(slug);
```

### Table: `posts` (Artikel)

```sql
create table posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  excerpt text check (char_length(excerpt) <= 160),
  body text not null,                    -- Markdown content
  cover_image_url text,                  -- URL from Supabase Storage
  cover_image_alt text,
  category_id uuid references categories(id) on delete set null,
  series_id uuid references series(id) on delete set null,
  series_order integer,                 -- Urutan dalam seri (nullable)
  author_id uuid references authors(id) on delete set null,  -- Phase 2+ multi-author
  status text not null default 'draft' check (status in ('draft', 'review', 'fact-check', 'published')),
  pov_tag text check (pov_tag in ('kontra-narasi', 'refleksi', 'data', 'framework')),  -- Required before publish (lihat ContentStrategy.md Section 5)
  human_signature boolean default false,           -- Wajib true sebelum publish (lihat ContentStrategy.md Section 11)
  fact_check_status text default 'pending' check (fact_check_status in ('pending', 'verified', 'flagged')),
  review_status text default 'draft' check (review_status in ('draft', 'review', 'fact-check', 'publish')),
  source_references jsonb,                        -- Array of {type, url, label} untuk source references
  reading_time integer default 1,        -- Auto-calculated dari word count
  published_at timestamptz,
  featured boolean default false,       -- Pin ke homepage
  seo_meta_title text,
  seo_meta_description text check (char_length(seo_meta_description) <= 160),
  seo_og_image_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes untuk query performa
create index idx_posts_slug on posts(slug);
create index idx_posts_status on posts(status);
create index idx_posts_category on posts(category_id);
create index idx_posts_series on posts(series_id);
create index idx_posts_author on posts(author_id);
create index idx_posts_published_at on posts(published_at desc);
create index idx_posts_fact_check on posts(fact_check_status);
create index idx_posts_review_status on posts(review_status);

-- Full-text search (Phase 2 preparation)
create index idx_posts_search on posts using gin(
  to_tsvector('indonesian', coalesce(title, '') || ' ' || coalesce(excerpt, '') || ' ' || coalesce(body, ''))
);

-- Trigger: auto-update reading_time dan updated_at
-- Fires on INSERT dan UPDATE
-- Menggunakan function di bawah (setelah semua table dibuat)
```

### Table: `site_settings` (Singleton)

```sql
create table site_settings (
  id uuid primary key default gen_random_uuid(),
  title text not null default 'TAMPARAN ANAK MUDA',
  description text,
  social_instagram text,
  social_tiktok text,
  social_youtube text,
  newsletter_headline text,
  newsletter_subtext text,
  updated_at timestamptz default now()
);

-- Insert default settings
insert into site_settings (title, description, newsletter_headline, newsletter_subtext)
values (
  'TAMPARAN ANAK MUDA',
  'Perspektif yang mengubah cara anak muda Indonesia melihat hidup.',
  'Jangan Ketinggalan',
  'Satu email per minggu. Tidak ada spam. Hanya tamparan.'
);
```

### Table: `comments` (Komentar - Phase 3)

```sql
create table comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references posts(id) on delete cascade not null,
  parent_id uuid references comments(id) on delete cascade,  -- Threaded replies
  author_name text not null,
  author_email text not null,
  body text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes
create index idx_comments_post on comments(post_id);
create index idx_comments_parent on comments(parent_id);
create index idx_comments_status on comments(status);
```

### Table: `bookmarks` (Bookmark - Phase 2, opsional)

Jika bookmark disinkronkan dengan akun (bukan hanya local storage):

```sql
create table bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  post_id uuid references posts(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique (user_id, post_id)
);

-- Index
create index idx_bookmarks_user on bookmarks(user_id);
```

### Table: `donations` (Donasi - Phase 2)

```sql
create table donations (
  id uuid primary key default gen_random_uuid(),
  louvin_transaction_id uuid unique not null,
  reference text unique not null,
  amount integer not null,               -- Total customer bayar (termasuk fee)
  fee integer not null,
  net_amount integer not null,           -- Yang diterima TAM
  payment_type text not null,
  status text not null default 'pending' check (status in ('pending', 'settled', 'failed')),
  customer_name text,
  customer_email text,
  message text,                          -- Pesan dari donor (opsional)
  payment_data jsonb,                    -- QR string / VA number / deeplink
  settled_at timestamptz,
  failed_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes
create index idx_donations_status on donations(status);
create index idx_donations_reference on donations(reference);
create index idx_donations_created_at on donations(created_at desc);
```

### Table: `tiktok_scripts` (Video Script - Phase 2)

```sql
create table tiktok_scripts (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references posts(id) on delete cascade not null,
  title text not null,
  hook_line text not null,                  -- Opening hook (lihat ContentStrategy.md Section 9)
  body text not null,                       -- Script body (30-60 detik)
  status text not null default 'draft' check (status in ('draft', 'approved', 'published')),
  published_at timestamptz,
  video_url text,                           -- Link ke video yang sudah di-upload
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes
create index idx_tiktok_scripts_post on tiktok_scripts(post_id);
create index idx_tiktok_scripts_status on tiktok_scripts(status);
```

### Table: `hook_lines` (Hook Line Library - Phase 2)

```sql
create table hook_lines (
  id uuid primary key default gen_random_uuid(),
  text text not null,                       -- Hook line text
  formula text,                             -- Formula type (lihat ContentStrategy.md Section 9)
  category text,                            -- Tag/kategori hook
  is_active boolean default true,
  created_at timestamptz default now()
);
```

### Functions & Triggers

```sql
-- Auto-calculate reading_time dan update updated_at
-- Fires on INSERT dan UPDATE

create or replace function update_post_metadata()
returns trigger as $$
begin
  new.reading_time := greatest(
    1,
    ceil(
      coalesce(
        array_length(
          string_to_array(
            regexp_replace(coalesce(new.body, ''), '<[^>]+>', '', 'g'),
            ' '
          ),
          1
        ),
        0
      ) / 200.0
    )
  );
  new.updated_at := now();
  return new;
end;
$$ language plpgsql;

create trigger trg_posts_metadata
  before insert or update on posts
  for each row execute procedure update_post_metadata();

-- Update updated_at untuk categories, authors, series, comments

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at := now();
  return new;
end;
$$ language plpgsql;

create trigger trg_categories_updated_at before update on categories
  for each row execute procedure set_updated_at();

create trigger trg_authors_updated_at before update on authors
  for each row execute procedure set_updated_at();

create trigger trg_series_updated_at before update on series
  for each row execute procedure set_updated_at();

create trigger trg_comments_updated_at before update on comments
  for each row execute procedure set_updated_at();

create trigger trg_settings_updated_at before update on site_settings
  for each row execute procedure set_updated_at();
```

### RLS Policies (Row Level Security)

```sql
-- Enable RLS
alter table posts enable row level security;
alter table categories enable row level security;
alter table authors enable row level security;
alter table series enable row level security;
alter table site_settings enable row level security;
alter table comments enable row level security;
alter table bookmarks enable row level security;
alter table donations enable row level security;
alter table tiktok_scripts enable row level security;
alter table hook_lines enable row level security;

-- PUBLIC: bisa baca artikel published saja
create policy "public_read_published_posts"
  on posts for select to anon
  using (status = 'published');

-- PUBLIC: bisa baca kategori, seri, author (read-only)
create policy "public_read_categories"
  on categories for select to anon using (true);

create policy "public_read_series"
  on series for select to anon using (true);

create policy "public_read_authors"
  on authors for select to anon using (true);

create policy "public_read_settings"
  on site_settings for select to anon using (true);

-- PUBLIC: bisa baca approved comments
create policy "public_read_approved_comments"
  on comments for select to anon using (status = 'approved');

-- ADMIN: full CRUD (dengan role check - lebih aman dari sekadar authenticated)
-- Pastikan admin user memiliki raw_user_meta_data -> { "role": "admin" }

create policy "admin_full_posts"
  on posts for all to authenticated
  using (auth.jwt() -> 'user_metadata' ->> 'role' = 'admin');

create policy "admin_full_categories"
  on categories for all to authenticated
  using (auth.jwt() -> 'user_metadata' ->> 'role' = 'admin');

create policy "admin_full_authors"
  on authors for all to authenticated
  using (auth.jwt() -> 'user_metadata' ->> 'role' = 'admin');

create policy "admin_full_series"
  on series for all to authenticated
  using (auth.jwt() -> 'user_metadata' ->> 'role' = 'admin');

create policy "admin_full_settings"
  on site_settings for all to authenticated
  using (auth.jwt() -> 'user_metadata' ->> 'role' = 'admin');

create policy "admin_full_comments"
  on comments for all to authenticated
  using (auth.jwt() -> 'user_metadata' ->> 'role' = 'admin');

-- USER: bisa manage bookmarks sendiri (Phase 2+)
create policy "user_own_bookmarks"
  on bookmarks for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ADMIN: read-only donations (Phase 2)
create policy "admin_read_donations"
  on donations for select to authenticated
  using (auth.jwt() -> 'user_metadata' ->> 'role' = 'admin');

-- ADMIN: full CRUD tiktok_scripts (Phase 2)
create policy "admin_full_tiktok_scripts"
  on tiktok_scripts for all to authenticated
  using (auth.jwt() -> 'user_metadata' ->> 'role' = 'admin');

-- ADMIN: full CRUD hook_lines (Phase 2)
create policy "admin_full_hook_lines"
  on hook_lines for all to authenticated
  using (auth.jwt() -> 'user_metadata' ->> 'role' = 'admin');
```

### Type Mapping (TypeScript)

```typescript
// types/database.ts
export type Post = {
  id: string
  title: string
  slug: string
  excerpt: string
  body: string               // Markdown
  cover_image_url: string | null
  cover_image_alt: string | null
  category_id: string | null
  series_id: string | null
  series_order: number | null
  author_id: string | null
  status: 'draft' | 'review' | 'fact-check' | 'published'
  pov_tag: 'kontra-narasi' | 'refleksi' | 'data' | 'framework' | null
  human_signature: boolean
  fact_check_status: 'pending' | 'verified' | 'flagged'
  review_status: 'draft' | 'review' | 'fact-check' | 'publish'
  source_references: SourceReference[] | null
  reading_time: number
  published_at: string | null
  featured: boolean
  seo_meta_title: string | null
  seo_meta_description: string | null
  seo_og_image_url: string | null
  created_at: string
  updated_at: string
  // Joined fields
  category?: Category
  series?: Series
  author?: Author
}

export type SourceReference = {
  type: 'link' | 'footnote' | 'inline'
  url: string
  label: string
}

export type Category = {
  id: string
  title: string
  slug: string
  description: string | null
  color: string
}

export type Series = {
  id: string
  title: string
  slug: string
  description: string | null
}

export type Author = {
  id: string
  name: string
  slug: string
  bio: string | null
  avatar_url: string | null
  social_instagram: string | null
  social_twitter: string | null
  social_linkedin: string | null
  created_at: string
  updated_at: string
}

export type SiteSettings = {
  id: string
  title: string
  description: string | null
  social_instagram: string | null
  social_tiktok: string | null
  social_youtube: string | null
  newsletter_headline: string | null
  newsletter_subtext: string | null
}

export type Comment = {
  id: string
  post_id: string
  parent_id: string | null
  author_name: string
  author_email: string
  body: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  updated_at: string
}

export type Bookmark = {
  id: string
  user_id: string
  post_id: string
  created_at: string
}

export type TiktokScript = {
  id: string
  post_id: string
  title: string
  hook_line: string
  body: string
  status: 'draft' | 'approved' | 'published'
  published_at: string | null
  video_url: string | null
  created_at: string
  updated_at: string
}

export type HookLine = {
  id: string
  text: string
  formula: string | null
  category: string | null
  is_active: boolean
  created_at: string
}

export type Donation = {
  id: string
  louvin_transaction_id: string
  reference: string
  amount: number
  fee: number
  net_amount: number
  payment_type: string
  status: 'pending' | 'settled' | 'failed'
  customer_name: string | null
  customer_email: string | null
  message: string | null
  payment_data: Record<string, unknown> | null
  settled_at: string | null
  failed_at: string | null
  created_at: string
  updated_at: string
}

/**
 * Di app layer, snake_case dari database dipetakan ke camelCase.
 * Contoh: `cover_image_url` -> `coverImageUrl`.
 * Gunakan helper di `lib/mapPost.ts` untuk konsistensi.
 */
export type PostPublic = {
  id: string
  title: string
  slug: string
  excerpt: string
  body: string
  coverImageUrl: string | null
  coverImageAlt: string | null
  categoryId: string | null
  seriesId: string | null
  seriesOrder: number | null
  authorId: string | null
  status: 'draft' | 'review' | 'fact-check' | 'published'
  povTag: 'kontra-narasi' | 'refleksi' | 'data' | 'framework' | null
  humanSignature: boolean
  factCheckStatus: 'pending' | 'verified' | 'flagged'
  reviewStatus: 'draft' | 'review' | 'fact-check' | 'publish'
  sourceReferences: SourceReference[] | null
  readingTime: number
  publishedAt: string | null
  featured: boolean
  seoMetaTitle: string | null
  seoMetaDescription: string | null
  seoOgImageUrl: string | null
  createdAt: string
  updatedAt: string
  category?: Category
  series?: Series
  author?: Author
}
```

---

## 5. Rendering Strategy

| Page | Strategy | Revalidate | Alasan |
|---|---|---|---|
| `/` (Homepage) | ISR | 3600s (1 jam) | Konten berubah tidak sering |
| `/artikel` (Listing) | ISR | 3600s | Sama |
| `/artikel/[slug]` | SSG + ISR | 86400s (1 hari) | SEO kritis, konten jarang berubah |
| `/seri/[slug]` | ISR | 86400s | Sama |
| `/topik/[category]` | ISR | 3600s | Sama |
| `/tentang` | SSG | Static | Tidak pernah berubah |
| `/admin/*` | Dynamic (SSR) | - | Protected route, admin only |
| `/api/subscribe` | Dynamic | - | Server action |
| `/api/og` | Dynamic | - | Generate OG image on-demand |

---

## 6. URL Structure

```
tamparananakmuda.com/
tamparananakmuda.com/artikel/
tamparananakmuda.com/artikel/[slug]/
tamparananakmuda.com/seri/
tamparananakmuda.com/seri/[slug]/
tamparananakmuda.com/topik/[category]/
tamparananakmuda.com/tentang/
tamparananakmuda.com/newsletter/         ← thank you page
tamparananakmuda.com/sitemap.xml         ← auto-generated
tamparananakmuda.com/rss.xml             ← auto-generated
tamparananakmuda.com/admin               ← admin panel (protected)
tamparananakmuda.com/admin/posts         ← CRUD artikel
tamparananakmuda.com/admin/categories    ← Manage kategori
tamparananakmuda.com/admin/series        ← Manage seri
tamparananakmuda.com/admin/settings     ← Site settings
tamparananakmuda.com/admin/donations    ← Donation records (Phase 2)
tamparananakmuda.com/admin/editorial    ← Editorial workflow dashboard (Phase 2)
tamparananakmuda.com/admin/tiktok       ← TikTok script manager (Phase 2)
tamparananakmuda.com/dukung              ← Support / donation page (Phase 2)
tamparananakmuda.com/dukung/terima-kasih ← Thank you page (Phase 2)
tamparananakmuda.com/api/donation/create  ← Create transaction proxy
tamparananakmuda.com/api/donation/webhook ← Webhook receiver
tamparananakmuda.com/api/donation/status  ← Check transaction status
tamparananakmuda.com/api/posts/[id]/fact-check    ← Update fact-check status (Phase 2)
tamparananakmuda.com/api/posts/[id]/review-status ← Update review pipeline status (Phase 2)
tamparananakmuda.com/api/posts/[id]/source-references ← Manage source references (Phase 2)
tamparananakmuda.com/api/tiktok/generate-script    ← Generate video script from article (Phase 2)
tamparananakmuda.com/api/tiktok/scripts            ← List/manage video scripts (Phase 2)
```

---

## 7. Third-Party Integrations

### Brevo (Newsletter)
- Subscribe via API endpoint `/api/subscribe`
- Server-side call ke Brevo API (API key disimpan di env var)
- Double opt-in enabled
- List segmentation: "TAM Website Subscribers"

### Umami Analytics
- Script di `<body>` dengan `strategy="lazyOnload"` - no cookie, GDPR compliant
- Track: pageview, article reads, newsletter events, custom events (lihat `Analytics.md`)
- Self-hosted di Vercel atau Railway (gratis tier)

### Sentry
- Error tracking dan performance monitoring
- DSN client-safe (`NEXT_PUBLIC_SENTRY_DSN`), auth token server-only
- Integrasi via `@sentry/nextjs` atau `instrumentation.ts`

### Web Vitals
- Library `web-vitals` untuk real-user CWV measurement
- Kirim ke Umami atau Sentry untuk monitoring

### Uptime Kuma
- Self-hosted uptime monitoring
- Pings homepage dan `/api/subscribe`
- Alert via email/Telegram/Discord

### Vercel OG
- Dynamic OG image per artikel: judul + kategori + branding TAM
- Generated di `/api/og?title=...`

### Louvin Payment Gateway (Phase 2)
- Backend proxy: `/api/donation/create` dan `/api/donation/webhook`
- API key `LOUVIN_API_KEY` server-only
- Support QRIS, GoPay, ShopeePay, BNI/BRI/Permata/CIMB VA
- Webhook URL harus di-set di dashboard Louvin setelah production deploy
- Tabel `donations` menyimpan record transaksi
- `LOUVIN_PROJECT_SLUG` untuk identifikasi project di Louvin

### Editorial Workflow (Phase 1 admin, Phase 2 full)
- Admin API routes: `/api/posts/[id]/fact-check`, `/api/posts/[id]/review-status`, `/api/posts/[id]/source-references`
- Editorial workflow dashboard di `/admin/editorial`
- POV tag, human signature, fact-check status, review pipeline stored di tabel `posts`
- Source references stored sebagai jsonb array di `posts.source_references`
- Lihat `ContentStrategy.md` Section 5 (angle test) dan Section 11 (AI policy)

### TikTok Pipeline (Phase 2)
- Admin API routes: `/api/tiktok/generate-script`, `/api/tiktok/scripts`
- TikTok script manager di `/admin/tiktok`
- Tabel `tiktok_scripts` untuk video script drafts
- Tabel `hook_lines` untuk hook line library
- Lihat `ContentStrategy.md` Section 9 untuk strategy

---

## 8. Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=           # Public URL (safe for client)
NEXT_PUBLIC_SUPABASE_ANON_KEY=      # Public anon key (safe for client)
SUPABASE_SERVICE_ROLE_KEY=            # Server-only, full admin access

# Supabase Storage
NEXT_PUBLIC_SUPABASE_STORAGE_URL=   # Public storage URL

# Brevo
BREVO_API_KEY=                        # Server-only
BREVO_LIST_ID=                        # Server-only, ID list subscriber

# Umami
NEXT_PUBLIC_UMAMI_WEBSITE_ID=         # UUID website di Umami
NEXT_PUBLIC_UMAMI_URL=                # https://analytics.tamparananakmuda.com/script.js

# Sentry
NEXT_PUBLIC_SENTRY_DSN=               # Client-safe DSN
SENTRY_AUTH_TOKEN=                    # Server-only, untuk source maps

# Louvin Payment Gateway (Phase 2)
LOUVIN_API_KEY=                       # Server-only. Dimulai dengan lv_. JANGAN expose ke client.
LOUVIN_WEBHOOK_SECRET=                # Optional: untuk webhook signature verification
LOUVIN_PROJECT_SLUG=tamparananakmuda  # Project slug di Louvin
NEXT_PUBLIC_LOUVIN_ENABLED=false      # Toggle fitur donasi (true saat siap production)

# App
NEXT_PUBLIC_SITE_URL=https://tamparananakmuda.com

# Optional: Redis cache (Phase 2)
UPSTASH_REDIS_REST_URL=               # Server-only
UPSTASH_REDIS_REST_TOKEN=             # Server-only
```

**⚠️ KEAMANAN:** `SUPABASE_SERVICE_ROLE_KEY`, `BREVO_API_KEY`, `SENTRY_AUTH_TOKEN`, `LOUVIN_API_KEY`, dan `UPSTASH_REDIS_REST_TOKEN` TIDAK BOLEH di-prefix `NEXT_PUBLIC_` - hanya digunakan di server-side (API routes, Server Components).

---

## 9. Database Migrations & Seeding

### Workflow

1. **Local development:** edit schema di `supabase/migrations/*.sql`.
2. **Test locally:** `supabase db start` → `supabase db reset`.
3. **Deploy to staging:** `supabase db push --linked` (staging project).
4. **Deploy to production:** `supabase db push --linked` (prod project) setelah staging OK.

### Directory Structure

```
supabase/
├── migrations/
│   ├── 20260101000000_initial_schema.sql
│   ├── 20260101000001_seed_categories.sql
│   ├── 20260101000002_add_authors.sql
│   ├── 20260101000003_add_comments.sql
│   ├── 20260101000004_add_donations.sql
│   ├── 20260101000005_add_editorial_workflow.sql
│   └── 20260101000006_add_tiktok_pipeline.sql
├── seed.sql                          # Data awal untuk local dev
└── config.toml
```

### Best Practices

- Setiap perubahan schema = 1 migration file dengan timestamp.
- Jangan pernah edit migration file yang sudah di-push ke production.
- Backup production sebelum menjalankan migration berisiko.
- Seed data hanya untuk local/staging, tidak untuk production.

---

## 10. Caching Strategy

### Next.js Caching

| Layer | Mechanism | Use Case |
|---|---|---|
| Static Generation | `generateStaticParams` + `revalidate` | Artikel, halaman statis |
| ISR | `revalidate` di page config | Homepage, listing, kategori, seri |
| Data Cache | `fetch` dengan `next.tags` | Supabase query |
| Route Cache | `unstable_cache` | Expensive queries (homepage aggregation) |
| Client Cache | SWR / React Query | Admin panel data |

### Phase 2: Redis Cache (Upstash)

Gunakan untuk:
- Homepage aggregation (top artikel, featured, series)
- Search index cache
- Rate limiting data

```typescript
// lib/redis.ts
import { Redis } from '@upstash/redis'

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})
```

### Cache Invalidation

- On publish/update artikel: revalidate tag `posts`.
- On update settings: revalidate tag `settings`.
- On publish series: revalidate tag `series`.

---

## 11. Backup & Disaster Recovery

### Database (Supabase)

- Supabase free tier: daily backups otomatis (7 hari retention).
- Supabase Pro: point-in-time recovery (PITR) 7 hari.
- Manual export: `supabase db dump` sebelum migration besar.

### Storage (Supabase Storage)

- Cover images dan assets di-storage di Supabase.
- Pertimbangkan backup ke S3-compatible storage (Backblaze B2) untuk critical assets.
- Local development: jangan hapus production bucket.

### Umami Analytics

- Backup PostgreSQL database Umami secara berkala.
- Gunakan Supabase backups atau `pg_dump` manual.

### Rollback

- Database: restore dari Supabase backup jika migration gagal.
- Code: Vercel deployment rollback via dashboard.
- DNS: A record pointing ke Vercel, bisa di-switch cepat.

---

## 12. Scaling Considerations

**Phase 1 (0-10k monthly visitors):**
- Vercel free tier cukup
- Supabase free tier cukup (500MB DB, 1GB storage, 50k auth MAU)
- Brevo free tier cukup (300 email/hari, 9k/bulan)
- Uptime Kuma self-hosted gratis
- Sentry free tier cukup

**Phase 2 (10k-50k monthly visitors):**
- Kemungkinan perlu Vercel Pro (~$20/bulan)
- Supabase Pro jika konten banyak ($25/bulan - 8GB DB, 100GB storage)
- Upstash Redis untuk cache dan rate limiting
- Sentry paid tier jika error volume tinggi

**Phase 3 (50k+):**
- Review arsitektur, kemungkinan perlu edge caching agresif
- Supabase Pro bisa handle scale ini
- Pertimbangkan CDN image optimization lebih agresif
- Load test sebelum campaign besar

---

## 13. Markdown → HTML Pipeline

Artikel disimpan sebagai **Markdown** di Supabase. Rendering pipeline:

```
Supabase (Markdown) → server.tsx (marked/rehype) → Sanitized HTML → React
```

**Pendekatan:**
- Gunakan `marked` + `rehype-sanitize` (server-side) untuk convert Markdown → safe HTML
- Gunakan `rehype-raw` untuk handle HTML embed yang aman
- Syntax highlighting untuk code blocks via `highlight.js` atau `shiki`
- Tidak ada `dangerouslySetInnerHTML` - semua HTML di-sanitize dulu
- Future upgrade: bisa migrasi ke rich text editor (Tiptap) tanpa ubah schema, cukup ubah format body

---

## 14. Architecture Decision Log

| Tanggal | Keputusan | Alasan | Status |
|---|---|---|---|
| Jun 2026 | Next.js 15 + Supabase | Open-source, gratis, SEO-friendly | Active |
| Jul 2026 | ISR + SSG hybrid | Balance SEO dan update fleksibel | Active |
| Jul 2026 | Self-hosted Umami + Sentry | Privacy-first error & analytics | Active |
| Jul 2026 | RLS dengan role-based admin | Lebih aman dari sekadar authenticated | Active |
| Jul 2026 | Editorial workflow columns di posts table | POV tag, human signature, fact-check, review pipeline, source references | Active |
| Jul 2026 | TikTok pipeline tables | tiktok_scripts dan hook_lines untuk video script generation | Active |

---

## 15. Changelog

| Versi | Tanggal | Perubahan |
|---|---|---|
| 1.0 | Jun 2026 | Draft awal. |
| 1.3 | Jul 2026 | Editorial workflow columns in posts table, TikTok pipeline tables (tiktok_scripts, hook_lines), editorial/TikTok API routes, URL structure, LOUVIN_PROJECT_SLUG env var, Upstash phase fix, decision log entries. |
| 1.2 | Jul 2026 | Louvin payment gateway integration, `donations` table, API endpoints, env vars, URL structure. |
| 1.1 | Jul 2026 | Next.js 15, authors/comments/bookmarks tables, role-based RLS, Sentry/Uptime Kuma, migrations, caching, backup, decision log. |
