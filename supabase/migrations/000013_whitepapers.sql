-- Sprint 10+: Whitepapers table
CREATE TABLE IF NOT EXISTS whitepapers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  summary TEXT,
  body TEXT NOT NULL,
  cover_image_url TEXT,
  author TEXT DEFAULT 'TAMPARAN ANAK MUDA',
  download_url TEXT,
  reading_time INT DEFAULT 10,
  tags TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE whitepapers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_published_whitepapers" ON whitepapers
  FOR SELECT USING (status = 'published' OR auth.role() = 'service_role');

CREATE POLICY "service_manage_whitepapers" ON whitepapers
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_whitepapers_slug ON whitepapers(slug);
CREATE INDEX IF NOT EXISTS idx_whitepapers_status ON whitepapers(status);
CREATE INDEX IF NOT EXISTS idx_whitepapers_published ON whitepapers(published_at DESC);
