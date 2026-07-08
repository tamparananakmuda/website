-- Social Content Hub: store imported social media content
CREATE TABLE IF NOT EXISTS social_posts (
  id BIGSERIAL PRIMARY KEY,
  platform TEXT NOT NULL CHECK (platform IN ('x', 'instagram', 'tiktok', 'youtube')),
  source_url TEXT NOT NULL,
  source_id TEXT,
  author_handle TEXT,
  author_name TEXT,
  author_avatar_url TEXT,
  content_text TEXT,
  media_urls TEXT[] DEFAULT '{}',
  video_url TEXT,
  thumbnail_url TEXT,
  transcript TEXT,
  published_at TIMESTAMPTZ,
  imported_at TIMESTAMPTZ DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  title TEXT,
  excerpt TEXT,
  tags TEXT[] DEFAULT '{}',
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE social_posts ENABLE ROW LEVEL SECURITY;

-- Anyone can read published social posts
CREATE POLICY "anon_select_published_social" ON social_posts
  FOR SELECT TO anon, authenticated
  USING (status = 'published');

-- Only service role can insert/update/delete (admin panel uses service role)
CREATE POLICY "service_insert_social" ON social_posts
  FOR INSERT TO service_role
  WITH CHECK (true);

CREATE POLICY "service_update_social" ON social_posts
  FOR UPDATE TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "service_delete_social" ON social_posts
  FOR DELETE TO service_role
  USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_social_posts_platform ON social_posts(platform);
CREATE INDEX IF NOT EXISTS idx_social_posts_status ON social_posts(status);
CREATE INDEX IF NOT EXISTS idx_social_posts_published_at ON social_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_social_posts_tags ON social_posts USING GIN (tags);
