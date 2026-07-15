-- Add OG CDN URL columns to posts table
ALTER TABLE posts ADD COLUMN IF NOT EXISTS og_card_url text;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS og_feature_url text;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS og_image_url text;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_posts_og_card_url ON posts(og_card_url) WHERE og_card_url IS NOT NULL;
