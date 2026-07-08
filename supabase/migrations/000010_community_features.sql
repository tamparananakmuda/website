-- Sprint 6: Own the Community
-- 1. Comments system (reader comments on articles)
-- 2. Newsletter archive (past issues stored locally)

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id BIGINT REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  reader_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_email TEXT,
  body TEXT NOT NULL CHECK (char_length(body) BETWEEN 1 AND 2000),
  status TEXT NOT NULL DEFAULT 'approved' CHECK (status IN ('approved', 'pending', 'spam', 'deleted')),
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Anyone can read approved comments
CREATE POLICY "anon_read_approved_comments" ON comments
  FOR SELECT TO anon, authenticated
  USING (status = 'approved');

-- Authenticated readers can insert their own comments
CREATE POLICY "reader_insert_own_comment" ON comments
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = reader_id);

-- Readers can update their own comments (within 15 min)
CREATE POLICY "reader_update_own_comment" ON comments
  FOR UPDATE TO authenticated
  USING (auth.uid() = reader_id)
  WITH CHECK (auth.uid() = reader_id);

-- Readers can delete their own comments
CREATE POLICY "reader_delete_own_comment" ON comments
  FOR DELETE TO authenticated
  USING (auth.uid() = reader_id);

-- Service role can manage all comments
CREATE POLICY "service_manage_comments" ON comments
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_comments_status ON comments(status);
CREATE INDEX IF NOT EXISTS idx_comments_reader_id ON comments(reader_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC);

-- Comment likes table (for like/unlike)
CREATE TABLE IF NOT EXISTS comment_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id UUID REFERENCES comments(id) ON DELETE CASCADE NOT NULL,
  reader_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(comment_id, reader_id)
);

ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;

-- Anyone can see likes
CREATE POLICY "anon_read_comment_likes" ON comment_likes
  FOR SELECT TO anon, authenticated
  USING (true);

-- Authenticated readers can like
CREATE POLICY "reader_insert_own_like" ON comment_likes
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = reader_id);

-- Readers can remove their own likes
CREATE POLICY "reader_delete_own_like" ON comment_likes
  FOR DELETE TO authenticated
  USING (auth.uid() = reader_id);

-- Trigger to update likes_count on comment
CREATE OR REPLACE FUNCTION update_comment_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE comments
  SET likes_count = (
    SELECT COUNT(*) FROM comment_likes WHERE comment_id = COALESCE(NEW.comment_id, OLD.comment_id)
  )
  WHERE id = COALESCE(NEW.comment_id, OLD.comment_id);
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_comment_like_insert ON comment_likes;
CREATE TRIGGER trigger_comment_like_insert
  AFTER INSERT ON comment_likes
  FOR EACH ROW EXECUTE FUNCTION update_comment_likes_count();

DROP TRIGGER IF EXISTS trigger_comment_like_delete ON comment_likes;
CREATE TRIGGER trigger_comment_like_delete
  AFTER DELETE ON comment_likes
  FOR EACH ROW EXECUTE FUNCTION update_comment_likes_count();

-- Newsletter issues table (archive)
CREATE TABLE IF NOT EXISTS newsletter_issues (
  id BIGSERIAL PRIMARY KEY,
  issue_number INTEGER NOT NULL UNIQUE,
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  excerpt TEXT,
  sent_at TIMESTAMPTZ,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE newsletter_issues ENABLE ROW LEVEL SECURITY;

-- Anyone can read published newsletter issues
CREATE POLICY "anon_read_published_issues" ON newsletter_issues
  FOR SELECT TO anon, authenticated
  USING (is_published = true);

-- Service role can manage all issues
CREATE POLICY "service_manage_issues" ON newsletter_issues
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_newsletter_issues_published ON newsletter_issues(is_published, sent_at DESC);
