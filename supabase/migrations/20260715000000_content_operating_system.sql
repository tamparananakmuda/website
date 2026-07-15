-- TAM Content Operating System - Fase 2: Database & CMS
-- 1. subcategories table (17 pillars mapped to 6 categories)
-- 2. content_queue table (editorial pipeline)
-- 3. tags + post_tags tables (flexible tagging)
-- 4. Expand pov_tag constraint (4 -> 9 tags)
-- 5. Add subcategory_id to posts

-- ============================================================
-- 1. SUBCATEGORIES (Content Pillars)
-- ============================================================

CREATE TABLE IF NOT EXISTS subcategories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_subcategories_slug ON subcategories(slug);
CREATE INDEX IF NOT EXISTS idx_subcategories_category ON subcategories(category_id);

ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;

-- Public can read subcategories
CREATE POLICY "public_read_subcategories"
  ON subcategories FOR SELECT TO anon USING (true);

-- Admin full CRUD
CREATE POLICY "admin_full_subcategories"
  ON subcategories FOR ALL TO authenticated
  USING (auth.jwt() -> 'user_metadata' ->> 'role' = 'admin');

-- Trigger for updated_at (reuse existing function)
-- subcategories don't have updated_at, skip trigger

-- Add subcategory_id to posts
ALTER TABLE posts ADD COLUMN IF NOT EXISTS subcategory_id uuid REFERENCES subcategories(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_posts_subcategory ON posts(subcategory_id);

-- ============================================================
-- 2. SEED 17 PILLARS (subcategories) mapped to 6 categories
-- ============================================================

-- Get category IDs
-- Mindset: slug = 'mindset'
-- Karier: slug = 'karier'
-- Uang: slug = 'uang'
-- Bisnis: slug = 'bisnis'
-- Teknologi: slug = 'teknologi'
-- Kehidupan: slug = 'kehidupan'

INSERT INTO subcategories (category_id, title, slug, description, sort_order)
SELECT c.id, 'Mindset & Realita', 'mindset-realita', 'Cara pikir yang menentukan cara hidup.', 1
FROM categories c WHERE c.slug = 'mindset'
AND NOT EXISTS (SELECT 1 FROM subcategories s WHERE s.slug = 'mindset-realita');

INSERT INTO subcategories (category_id, title, slug, description, sort_order)
SELECT c.id, 'Psikologi', 'psikologi', 'Psikologi kehidupan sehari-hari, bukan kesehatan mental klinis.', 2
FROM categories c WHERE c.slug = 'mindset'
AND NOT EXISTS (SELECT 1 FROM subcategories s WHERE s.slug = 'psikologi');

INSERT INTO subcategories (category_id, title, slug, description, sort_order)
SELECT c.id, 'Filosofi Hidup', 'filosofi-hidup', 'Stoicism, ikigai, essentialism, dan filosofi praktis lainnya.', 3
FROM categories c WHERE c.slug = 'mindset'
AND NOT EXISTS (SELECT 1 FROM subcategories s WHERE s.slug = 'filosofi-hidup');

INSERT INTO subcategories (category_id, title, slug, description, sort_order)
SELECT c.id, 'Tamparan', 'tamparan', 'Artikel dengan tone tamparan khas TAM. Ciri khas media.', 4
FROM categories c WHERE c.slug = 'mindset'
AND NOT EXISTS (SELECT 1 FROM subcategories s WHERE s.slug = 'tamparan');

INSERT INTO subcategories (category_id, title, slug, description, sort_order)
SELECT c.id, 'Karier & Dunia Kerja', 'karier-dunia-kerja', 'Panduan dunia kerja yang tidak diajarkan sekolah.', 1
FROM categories c WHERE c.slug = 'karier'
AND NOT EXISTS (SELECT 1 FROM subcategories s WHERE s.slug = 'karier-dunia-kerja');

INSERT INTO subcategories (category_id, title, slug, description, sort_order)
SELECT c.id, 'Produktivitas', 'produktivitas', 'Cara fokus dan kelola waktu yang benar-benar bekerja.', 2
FROM categories c WHERE c.slug = 'karier'
AND NOT EXISTS (SELECT 1 FROM subcategories s WHERE s.slug = 'produktivitas');

INSERT INTO subcategories (category_id, title, slug, description, sort_order)
SELECT c.id, 'Komunikasi', 'komunikasi', 'Public speaking, storytelling, negosiasi, presentasi.', 3
FROM categories c WHERE c.slug = 'karier'
AND NOT EXISTS (SELECT 1 FROM subcategories s WHERE s.slug = 'komunikasi');

INSERT INTO subcategories (category_id, title, slug, description, sort_order)
SELECT c.id, 'Pendidikan', 'pendidikan', 'Kuliah, jurusan, skill masa depan, belajar mandiri.', 4
FROM categories c WHERE c.slug = 'karier'
AND NOT EXISTS (SELECT 1 FROM subcategories s WHERE s.slug = 'pendidikan');

INSERT INTO subcategories (category_id, title, slug, description, sort_order)
SELECT c.id, 'Keuangan & Uang', 'keuangan-uang', 'Budgeting, investasi, cara dapat uang online, freelance, affiliate.', 1
FROM categories c WHERE c.slug = 'uang'
AND NOT EXISTS (SELECT 1 FROM subcategories s WHERE s.slug = 'keuangan-uang');

INSERT INTO subcategories (category_id, title, slug, description, sort_order)
SELECT c.id, 'Bisnis', 'bisnis', 'Realita bisnis, bukan motivasi bisnis.', 1
FROM categories c WHERE c.slug = 'bisnis'
AND NOT EXISTS (SELECT 1 FROM subcategories s WHERE s.slug = 'bisnis');

INSERT INTO subcategories (category_id, title, slug, description, sort_order)
SELECT c.id, 'Skill Masa Depan', 'skill-masa-depan', 'Skill yang relevan 5-10 tahun ke depan.', 2
FROM categories c WHERE c.slug = 'bisnis'
AND NOT EXISTS (SELECT 1 FROM subcategories s WHERE s.slug = 'skill-masa-depan');

INSERT INTO subcategories (category_id, title, slug, description, sort_order)
SELECT c.id, 'Teknologi & AI', 'teknologi-ai', 'Tools, bukan hype.', 1
FROM categories c WHERE c.slug = 'teknologi'
AND NOT EXISTS (SELECT 1 FROM subcategories s WHERE s.slug = 'teknologi-ai');

INSERT INTO subcategories (category_id, title, slug, description, sort_order)
SELECT c.id, 'Analisis Fenomena', 'analisis-fenomena', 'Membongkar tren dan fenomena sosial dengan lensa tajam.', 2
FROM categories c WHERE c.slug = 'teknologi'
AND NOT EXISTS (SELECT 1 FROM subcategories s WHERE s.slug = 'analisis-fenomena');

INSERT INTO subcategories (category_id, title, slug, description, sort_order)
SELECT c.id, 'Hubungan Sosial', 'hubungan-sosial', 'Memilih teman, networking, lingkungan, mentor.', 1
FROM categories c WHERE c.slug = 'kehidupan'
AND NOT EXISTS (SELECT 1 FROM subcategories s WHERE s.slug = 'hubungan-sosial');

INSERT INTO subcategories (category_id, title, slug, description, sort_order)
SELECT c.id, 'Lifestyle', 'lifestyle', 'Minimalisme, digital detox, morning routine, traveling produktif.', 2
FROM categories c WHERE c.slug = 'kehidupan'
AND NOT EXISTS (SELECT 1 FROM subcategories s WHERE s.slug = 'lifestyle');

INSERT INTO subcategories (category_id, title, slug, description, sort_order)
SELECT c.id, 'Sejarah Orang Sukses', 'sejarah-orang-sukses', 'Pelajaran dari orang sukses, bukan sekadar biografi.', 3
FROM categories c WHERE c.slug = 'kehidupan'
AND NOT EXISTS (SELECT 1 FROM subcategories s WHERE s.slug = 'sejarah-orang-sukses');

INSERT INTO subcategories (category_id, title, slug, description, sort_order)
SELECT c.id, 'Ulasan Buku', 'ulasan-buku', 'Review buku yang relevan untuk anak muda.', 4
FROM categories c WHERE c.slug = 'kehidupan'
AND NOT EXISTS (SELECT 1 FROM subcategories s WHERE s.slug = 'ulasan-buku');

-- ============================================================
-- 3. EXPAND POV TAGS (4 -> 9)
-- ============================================================

ALTER TABLE posts DROP CONSTRAINT IF EXISTS posts_pov_tag_check;
ALTER TABLE posts ADD CONSTRAINT posts_pov_tag_check
  CHECK (pov_tag IN ('kontra-narasi', 'refleksi', 'data', 'framework', 'tamparan', 'riset', 'opini', 'panduan', 'inspirasi'));

-- ============================================================
-- 4. CONTENT QUEUE (Editorial Pipeline)
-- ============================================================

CREATE TABLE IF NOT EXISTS content_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text,
  pillar_id uuid REFERENCES subcategories(id) ON DELETE SET NULL,
  pov_tag text CHECK (pov_tag IN ('kontra-narasi', 'refleksi', 'data', 'framework', 'tamparan', 'riset', 'opini', 'panduan', 'inspirasi')),
  target_keyword text,
  search_intent text CHECK (search_intent IN ('informational', 'comparison', 'transactional')),
  status text NOT NULL DEFAULT 'idea' CHECK (status IN ('idea', 'research', 'draft', 'review', 'revision', 'fact-check', 'scheduled', 'published')),
  assigned_writer uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  assigned_editor uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  due_date date,
  publish_date date,
  cta text,
  target_platforms text[] DEFAULT ARRAY['web'],
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_content_queue_status ON content_queue(status);
CREATE INDEX IF NOT EXISTS idx_content_queue_pillar ON content_queue(pillar_id);
CREATE INDEX IF NOT EXISTS idx_content_queue_writer ON content_queue(assigned_writer);
CREATE INDEX IF NOT EXISTS idx_content_queue_publish_date ON content_queue(publish_date);

ALTER TABLE content_queue ENABLE ROW LEVEL SECURITY;

-- Admin full CRUD
CREATE POLICY "admin_full_content_queue"
  ON content_queue FOR ALL TO authenticated
  USING (auth.jwt() -> 'user_metadata' ->> 'role' = 'admin');

-- Trigger for updated_at
CREATE TRIGGER trg_content_queue_updated_at
  BEFORE UPDATE ON content_queue
  FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

-- ============================================================
-- 5. TAGS + POST_TAGS (Flexible Tagging)
-- ============================================================

CREATE TABLE IF NOT EXISTS tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tags_slug ON tags(slug);

ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_tags"
  ON tags FOR SELECT TO anon USING (true);

CREATE POLICY "admin_full_tags"
  ON tags FOR ALL TO authenticated
  USING (auth.jwt() -> 'user_metadata' ->> 'role' = 'admin');

CREATE TABLE IF NOT EXISTS post_tags (
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  tag_id uuid REFERENCES tags(id) ON DELETE CASCADE NOT NULL,
  PRIMARY KEY (post_id, tag_id)
);

CREATE INDEX IF NOT EXISTS idx_post_tags_post ON post_tags(post_id);
CREATE INDEX IF NOT EXISTS idx_post_tags_tag ON post_tags(tag_id);

ALTER TABLE post_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_post_tags"
  ON post_tags FOR SELECT TO anon USING (true);

CREATE POLICY "admin_full_post_tags"
  ON post_tags FOR ALL TO authenticated
  USING (auth.jwt() -> 'user_metadata' ->> 'role' = 'admin');
