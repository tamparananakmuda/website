-- TAMPARAN ANAK MUDA - Initial Database Schema
-- Phase 1 + Phase 2 tables

-- Table: categories
CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  color text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Seed categories
INSERT INTO categories (title, slug, description, color) VALUES
  ('Mindset', 'mindset', 'Cara pikir yang salah dipercaya, dan cara pikir alternatif yang lebih kuat.', '#D13A3A'),
  ('Karir & Tujuan', 'karir-tujuan', 'Navigasi dunia kerja dan pencarian makna di usia muda.', '#4080D9'),
  ('Relasi', 'relasi', 'Hubungan dengan orang lain, dengan diri sendiri, dengan komunitas.', '#40B880'),
  ('Keuangan', 'keuangan', 'Financial literacy yang realistis untuk anak muda Indonesia.', '#D9A040'),
  ('Identitas', 'identitas', 'Siapa kamu, kenapa kamu seperti ini, dan kamu mau jadi siapa.', '#A040D9');

-- Table: series
CREATE TABLE series (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_series_slug ON series(slug);

-- Table: authors
CREATE TABLE authors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  bio text,
  avatar_url text,
  social_instagram text,
  social_twitter text,
  social_linkedin text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

INSERT INTO authors (name, slug, bio) VALUES
  ('Yovie Setiawan', 'yovie-setiawan', 'Founder TAMPARAN ANAK MUDA.');

CREATE INDEX idx_authors_slug ON authors(slug);

-- Table: posts
CREATE TABLE posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text CHECK (char_length(excerpt) <= 160),
  body text NOT NULL,
  cover_image_url text,
  cover_image_alt text,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  series_id uuid REFERENCES series(id) ON DELETE SET NULL,
  series_order integer,
  author_id uuid REFERENCES authors(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'fact-check', 'published')),
  pov_tag text CHECK (pov_tag IN ('kontra-narasi', 'refleksi', 'data', 'framework')),
  human_signature boolean DEFAULT false,
  fact_check_status text DEFAULT 'pending' CHECK (fact_check_status IN ('pending', 'verified', 'flagged')),
  review_status text DEFAULT 'draft' CHECK (review_status IN ('draft', 'review', 'fact-check', 'publish')),
  source_references jsonb,
  reading_time integer DEFAULT 1,
  published_at timestamptz,
  featured boolean DEFAULT false,
  seo_meta_title text,
  seo_meta_description text CHECK (char_length(seo_meta_description) <= 160),
  seo_og_image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_category ON posts(category_id);
CREATE INDEX idx_posts_series ON posts(series_id);
CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_posts_published_at ON posts(published_at DESC);
CREATE INDEX idx_posts_fact_check ON posts(fact_check_status);
CREATE INDEX idx_posts_review_status ON posts(review_status);
CREATE INDEX idx_posts_search ON posts USING gin(
  to_tsvector('indonesian', coalesce(title, '') || ' ' || coalesce(excerpt, '') || ' ' || coalesce(body, ''))
);

-- Table: site_settings
CREATE TABLE site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT 'TAMPARAN ANAK MUDA',
  description text,
  social_instagram text,
  social_tiktok text,
  social_youtube text,
  newsletter_headline text,
  newsletter_subtext text,
  updated_at timestamptz DEFAULT now()
);

INSERT INTO site_settings (title, description, newsletter_headline, newsletter_subtext)
VALUES (
  'TAMPARAN ANAK MUDA',
  'Perspektif yang mengubah cara anak muda Indonesia melihat hidup.',
  'Jangan Ketinggalan',
  'Satu email per minggu. Tidak ada spam. Hanya tamparan.'
);

-- Table: comments (Phase 3)
CREATE TABLE comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  parent_id uuid REFERENCES comments(id) ON DELETE CASCADE,
  author_name text NOT NULL,
  author_email text NOT NULL,
  body text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_comments_post ON comments(post_id);
CREATE INDEX idx_comments_parent ON comments(parent_id);
CREATE INDEX idx_comments_status ON comments(status);

-- Table: bookmarks (Phase 2)
CREATE TABLE bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE (user_id, post_id)
);

CREATE INDEX idx_bookmarks_user ON bookmarks(user_id);

-- Table: donations (Phase 2)
CREATE TABLE donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  louvin_transaction_id uuid UNIQUE NOT NULL,
  reference text UNIQUE NOT NULL,
  amount integer NOT NULL,
  fee integer NOT NULL,
  net_amount integer NOT NULL,
  payment_type text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'settled', 'failed')),
  customer_name text,
  customer_email text,
  message text,
  payment_data jsonb,
  settled_at timestamptz,
  failed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_donations_status ON donations(status);
CREATE INDEX idx_donations_reference ON donations(reference);
CREATE INDEX idx_donations_created_at ON donations(created_at DESC);

-- Table: tiktok_scripts (Phase 2)
CREATE TABLE tiktok_scripts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  hook_line text NOT NULL,
  body text NOT NULL,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'approved', 'published')),
  published_at timestamptz,
  video_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_tiktok_scripts_post ON tiktok_scripts(post_id);
CREATE INDEX idx_tiktok_scripts_status ON tiktok_scripts(status);

-- Table: hook_lines (Phase 2)
CREATE TABLE hook_lines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  text text NOT NULL,
  formula text,
  category text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Functions and triggers
CREATE OR REPLACE FUNCTION update_post_metadata()
RETURNS trigger AS $$
BEGIN
  NEW.reading_time := GREATEST(
    1,
    CEIL(
      COALESCE(
        array_length(
          string_to_array(
            regexp_replace(COALESCE(NEW.body, ''), '<[^>]+>', '', 'g'),
            ' '
          ),
          1
        ),
        0
      ) / 200.0
    )
  );
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_posts_metadata
  BEFORE INSERT OR UPDATE ON posts
  FOR EACH ROW EXECUTE PROCEDURE update_post_metadata();

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

CREATE TRIGGER trg_authors_updated_at BEFORE UPDATE ON authors
  FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

CREATE TRIGGER trg_series_updated_at BEFORE UPDATE ON series
  FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

CREATE TRIGGER trg_comments_updated_at BEFORE UPDATE ON comments
  FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

CREATE TRIGGER trg_settings_updated_at BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

-- RLS Policies
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE series ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE tiktok_scripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE hook_lines ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "public_read_published_posts"
  ON posts FOR SELECT TO anon
  USING (status = 'published');

CREATE POLICY "public_read_categories"
  ON categories FOR SELECT TO anon USING (true);

CREATE POLICY "public_read_series"
  ON series FOR SELECT TO anon USING (true);

CREATE POLICY "public_read_authors"
  ON authors FOR SELECT TO anon USING (true);

CREATE POLICY "public_read_settings"
  ON site_settings FOR SELECT TO anon USING (true);

CREATE POLICY "public_read_approved_comments"
  ON comments FOR SELECT TO anon USING (status = 'approved');

-- Admin policies (requires user_metadata.role = 'admin')
CREATE POLICY "admin_full_posts"
  ON posts FOR ALL TO authenticated
  USING (auth.jwt() -> 'user_metadata' ->> 'role' = 'admin');

CREATE POLICY "admin_full_categories"
  ON categories FOR ALL TO authenticated
  USING (auth.jwt() -> 'user_metadata' ->> 'role' = 'admin');

CREATE POLICY "admin_full_authors"
  ON authors FOR ALL TO authenticated
  USING (auth.jwt() -> 'user_metadata' ->> 'role' = 'admin');

CREATE POLICY "admin_full_series"
  ON series FOR ALL TO authenticated
  USING (auth.jwt() -> 'user_metadata' ->> 'role' = 'admin');

CREATE POLICY "admin_full_settings"
  ON site_settings FOR ALL TO authenticated
  USING (auth.jwt() -> 'user_metadata' ->> 'role' = 'admin');

CREATE POLICY "admin_full_comments"
  ON comments FOR ALL TO authenticated
  USING (auth.jwt() -> 'user_metadata' ->> 'role' = 'admin');

CREATE POLICY "user_own_bookmarks"
  ON bookmarks FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "admin_read_donations"
  ON donations FOR SELECT TO authenticated
  USING (auth.jwt() -> 'user_metadata' ->> 'role' = 'admin');

CREATE POLICY "admin_full_tiktok_scripts"
  ON tiktok_scripts FOR ALL TO authenticated
  USING (auth.jwt() -> 'user_metadata' ->> 'role' = 'admin');

CREATE POLICY "admin_full_hook_lines"
  ON hook_lines FOR ALL TO authenticated
  USING (auth.jwt() -> 'user_metadata' ->> 'role' = 'admin');
