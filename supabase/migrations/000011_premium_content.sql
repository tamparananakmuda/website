-- Sprint 8: Revenue Depth
-- Premium content gating (pay-what-you-want for certain articles)

ALTER TABLE posts
  ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS premium_excerpt TEXT;

-- Track which readers have unlocked premium content
CREATE TABLE IF NOT EXISTS premium_unlocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reader_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(reader_id, post_id)
);

ALTER TABLE premium_unlocks ENABLE ROW LEVEL SECURITY;

-- Readers can see their own unlocks
CREATE POLICY "reader_read_own_unlocks" ON premium_unlocks
  FOR SELECT TO authenticated
  USING (auth.uid() = reader_id);

-- Readers can insert their own unlocks
CREATE POLICY "reader_insert_own_unlock" ON premium_unlocks
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = reader_id);

-- Service role can manage all
CREATE POLICY "service_manage_unlocks" ON premium_unlocks
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_premium_unlocks_reader ON premium_unlocks(reader_id);
CREATE INDEX IF NOT EXISTS idx_premium_unlocks_post ON premium_unlocks(post_id);
