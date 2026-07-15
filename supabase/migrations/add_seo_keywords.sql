-- Add seo_keywords column to posts table
-- Run this in Supabase Dashboard > SQL Editor

ALTER TABLE posts ADD COLUMN IF NOT EXISTS seo_keywords text[] DEFAULT null;

-- Optional: add comment for documentation
COMMENT ON COLUMN posts.seo_keywords IS 'Array of 3-8 target SEO keywords (long-tail, Bahasa Indonesia)';
