-- Add topics column to newsletter_subscribers for topic preferences
ALTER TABLE newsletter_subscribers
  ADD COLUMN IF NOT EXISTS topics TEXT[] DEFAULT NULL;

-- Add index for topic-based queries
CREATE INDEX IF NOT EXISTS idx_newsletter_topics ON newsletter_subscribers USING GIN (topics);
