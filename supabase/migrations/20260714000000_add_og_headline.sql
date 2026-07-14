ALTER TABLE posts ADD COLUMN IF NOT EXISTS og_headline text;
COMMENT ON COLUMN posts.og_headline IS 'Custom hook headline for OG image. Falls back to title if empty.';
