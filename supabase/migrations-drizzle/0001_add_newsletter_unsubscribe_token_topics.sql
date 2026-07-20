-- Add unsubscribe_token and topics columns to newsletter_subscribers
ALTER TABLE "newsletter_subscribers" ADD COLUMN "unsubscribe_token" text;
ALTER TABLE "newsletter_subscribers" ADD COLUMN "topics" text[] DEFAULT '{}'::text[];

-- Update check constraint to allow 'pending' status
ALTER TABLE "newsletter_subscribers" DROP CONSTRAINT IF EXISTS "newsletter_subscribers_status_check";
ALTER TABLE "newsletter_subscribers" ADD CONSTRAINT "newsletter_subscribers_status_check" CHECK (status = ANY (ARRAY['active'::text, 'unsubscribed'::text, 'pending'::text]));

-- Add unique constraint on unsubscribe_token
ALTER TABLE "newsletter_subscribers" ADD CONSTRAINT "newsletter_subscribers_unsubscribe_token_key" UNIQUE ("unsubscribe_token");
