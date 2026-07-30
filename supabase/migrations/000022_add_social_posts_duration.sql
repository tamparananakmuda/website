-- Add duration column to social_posts table
ALTER TABLE "social_posts" ADD COLUMN IF NOT EXISTS "duration" integer;

-- Add contentType column for distinguishing video vs carousel vs text
ALTER TABLE "social_posts" ADD COLUMN IF NOT EXISTS "content_type" text DEFAULT 'video'
  CHECK (content_type = ANY (ARRAY['video'::text, 'carousel'::text, 'text'::text, 'image'::text]));
