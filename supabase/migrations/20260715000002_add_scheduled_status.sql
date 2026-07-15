-- Add 'scheduled' to posts status check constraint
-- Needed by cron job: /api/cron/publish-scheduled
-- TypeScript type already includes 'scheduled' in PostStatus
-- Admin UI already expects 'scheduled' in planner/analytics

ALTER TABLE posts DROP CONSTRAINT IF EXISTS posts_status_check;
ALTER TABLE posts ADD CONSTRAINT posts_status_check
  CHECK (status IN ('draft', 'review', 'fact-check', 'scheduled', 'published'));
