-- Add post_slug to bookmarks and comments for file-based article references
-- Drop FK constraints that reference posts table (posts will move to files)

-- Bookmarks: add post_slug, copy data, drop FK
ALTER TABLE bookmarks ADD COLUMN IF NOT EXISTS post_slug text;
UPDATE bookmarks SET post_slug = p.slug FROM posts p WHERE bookmarks.post_id = p.id;
ALTER TABLE bookmarks DROP CONSTRAINT IF EXISTS bookmarks_post_id_fkey;

-- Comments: add post_slug, copy data, drop FK  
ALTER TABLE comments ADD COLUMN IF NOT EXISTS post_slug text;
UPDATE comments SET post_slug = p.slug FROM posts p WHERE comments.post_id = p.id;
ALTER TABLE comments DROP CONSTRAINT IF EXISTS comments_post_id_fkey;

-- Reading history: add post_slug, copy data, drop FK
ALTER TABLE reading_history ADD COLUMN IF NOT EXISTS post_slug text;
UPDATE reading_history SET post_slug = p.slug FROM posts p WHERE reading_history.post_id = p.id;
ALTER TABLE reading_history DROP CONSTRAINT IF EXISTS reading_history_post_id_fkey;

-- Premium unlocks: add post_slug, copy data, drop FK
ALTER TABLE premium_unlocks ADD COLUMN IF NOT EXISTS post_slug text;
UPDATE premium_unlocks SET post_slug = p.slug FROM posts p WHERE premium_unlocks.post_id = p.id;
ALTER TABLE premium_unlocks DROP CONSTRAINT IF EXISTS premium_unlocks_post_id_fkey;

-- Create post_metadata table for OG URLs (since posts move to files, can't store in posts table)
CREATE TABLE IF NOT EXISTS post_metadata (
  slug text PRIMARY KEY,
  og_card_url text,
  og_feature_url text,
  og_image_url text,
  updated_at timestamp with time zone DEFAULT now()
);

-- Migrate existing OG URLs from posts to post_metadata
INSERT INTO post_metadata (slug, og_card_url, og_feature_url, og_image_url, updated_at)
SELECT p.slug, p.og_card_url, p.og_feature_url, p.og_image_url, p.updated_at
FROM posts p
WHERE p.og_card_url IS NOT NULL OR p.og_feature_url IS NOT NULL OR p.og_image_url IS NOT NULL
ON CONFLICT (slug) DO UPDATE SET
  og_card_url = EXCLUDED.og_card_url,
  og_feature_url = EXCLUDED.og_feature_url,
  og_image_url = EXCLUDED.og_image_url,
  updated_at = EXCLUDED.updated_at;
