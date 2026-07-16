-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "heatmap_event" (
	"heatmap_event_id" uuid PRIMARY KEY NOT NULL,
	"website_id" uuid NOT NULL,
	"session_id" uuid NOT NULL,
	"visit_id" uuid NOT NULL,
	"url_path" varchar(500) NOT NULL,
	"event_type" integer NOT NULL,
	"x" integer,
	"y" integer,
	"page_x" integer,
	"page_y" integer,
	"page_w" integer,
	"viewport_w" integer,
	"viewport_h" integer,
	"page_h" integer,
	"scroll_pct" integer,
	"created_at" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"color" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "categories_slug_key" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "categories" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "authors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"bio" text,
	"avatar_url" text,
	"social_instagram" text,
	"social_twitter" text,
	"social_linkedin" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "authors_slug_key" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "authors" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"excerpt" text,
	"body" text NOT NULL,
	"cover_image_url" text,
	"cover_image_alt" text,
	"category_id" uuid,
	"series_id" uuid,
	"series_order" integer,
	"author_id" uuid,
	"status" text DEFAULT 'draft' NOT NULL,
	"pov_tag" text,
	"human_signature" boolean DEFAULT false,
	"fact_check_status" text DEFAULT 'pending',
	"review_status" text DEFAULT 'draft',
	"source_references" jsonb,
	"reading_time" integer DEFAULT 1,
	"published_at" timestamp with time zone,
	"featured" boolean DEFAULT false,
	"seo_meta_title" text,
	"seo_meta_description" text,
	"seo_og_image_url" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"is_sponsored" boolean DEFAULT false,
	"sponsor_name" text,
	"sponsor_url" text,
	"sponsor_disclosure" text,
	"is_premium" boolean DEFAULT false,
	"premium_excerpt" text,
	"og_headline" text,
	"subcategory_id" uuid,
	"og_card_url" text,
	"og_feature_url" text,
	"og_image_url" text,
	"seo_keywords" text[],
	CONSTRAINT "posts_slug_key" UNIQUE("slug"),
	CONSTRAINT "posts_excerpt_check" CHECK (char_length(excerpt) <= 160),
	CONSTRAINT "posts_fact_check_status_check" CHECK (fact_check_status = ANY (ARRAY['pending'::text, 'verified'::text, 'flagged'::text])),
	CONSTRAINT "posts_pov_tag_check" CHECK (pov_tag = ANY (ARRAY['kontra-narasi'::text, 'refleksi'::text, 'data'::text, 'framework'::text, 'tamparan'::text, 'riset'::text, 'opini'::text, 'panduan'::text, 'inspirasi'::text])),
	CONSTRAINT "posts_review_status_check" CHECK (review_status = ANY (ARRAY['draft'::text, 'review'::text, 'fact-check'::text, 'publish'::text])),
	CONSTRAINT "posts_seo_meta_description_check" CHECK (char_length(seo_meta_description) <= 160),
	CONSTRAINT "posts_status_check" CHECK (status = ANY (ARRAY['draft'::text, 'review'::text, 'fact-check'::text, 'scheduled'::text, 'published'::text]))
);
--> statement-breakpoint
ALTER TABLE "posts" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "series" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "series_slug_key" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "series" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "site_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text DEFAULT 'TAMPARAN ANAK MUDA' NOT NULL,
	"description" text,
	"social_instagram" text,
	"social_tiktok" text,
	"social_youtube" text,
	"newsletter_headline" text,
	"newsletter_subtext" text,
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "site_settings" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "bookmarks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"post_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "bookmarks_user_id_post_id_key" UNIQUE("user_id","post_id")
);
--> statement-breakpoint
ALTER TABLE "bookmarks" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "session" (
	"session_id" uuid PRIMARY KEY NOT NULL,
	"website_id" uuid NOT NULL,
	"browser" varchar(20),
	"os" varchar(20),
	"device" varchar(20),
	"screen" varchar(11),
	"language" varchar(35),
	"country" char(2),
	"region" varchar(20),
	"city" varchar(50),
	"created_at" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP,
	"distinct_id" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "_prisma_migrations" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"checksum" varchar(64) NOT NULL,
	"finished_at" timestamp with time zone,
	"migration_name" varchar(255) NOT NULL,
	"logs" text,
	"rolled_back_at" timestamp with time zone,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"applied_steps_count" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "comments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"post_id" uuid NOT NULL,
	"parent_id" uuid,
	"author_name" text NOT NULL,
	"author_email" text NOT NULL,
	"body" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"reader_id" uuid,
	"likes_count" integer DEFAULT 0,
	CONSTRAINT "comments_status_check" CHECK (status = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text]))
);
--> statement-breakpoint
ALTER TABLE "comments" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "event_data" (
	"event_data_id" uuid PRIMARY KEY NOT NULL,
	"website_id" uuid NOT NULL,
	"website_event_id" uuid NOT NULL,
	"data_key" varchar(500) NOT NULL,
	"string_value" varchar(500),
	"number_value" numeric(19, 4),
	"date_value" timestamp(6) with time zone,
	"data_type" integer NOT NULL,
	"created_at" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE "team_user" (
	"team_user_id" uuid PRIMARY KEY NOT NULL,
	"team_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"role" varchar(50) NOT NULL,
	"created_at" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp(6) with time zone
);
--> statement-breakpoint
CREATE TABLE "website" (
	"website_id" uuid PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"domain" varchar(500),
	"reset_at" timestamp(6) with time zone,
	"user_id" uuid,
	"created_at" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp(6) with time zone,
	"deleted_at" timestamp(6) with time zone,
	"created_by" uuid,
	"team_id" uuid,
	"recorder_enabled" boolean DEFAULT false NOT NULL,
	"replay_config" jsonb
);
--> statement-breakpoint
CREATE TABLE "tiktok_scripts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"post_id" uuid NOT NULL,
	"title" text NOT NULL,
	"hook_line" text NOT NULL,
	"body" text NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"published_at" timestamp with time zone,
	"video_url" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "tiktok_scripts_status_check" CHECK (status = ANY (ARRAY['draft'::text, 'approved'::text, 'published'::text]))
);
--> statement-breakpoint
ALTER TABLE "tiktok_scripts" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "hook_lines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"text" text NOT NULL,
	"formula" text,
	"category" text,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "hook_lines" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "report" (
	"report_id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"website_id" uuid NOT NULL,
	"type" varchar(50) NOT NULL,
	"name" varchar(200) NOT NULL,
	"description" varchar(500) NOT NULL,
	"parameters" jsonb NOT NULL,
	"created_at" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp(6) with time zone
);
--> statement-breakpoint
CREATE TABLE "session_data" (
	"session_data_id" uuid PRIMARY KEY NOT NULL,
	"website_id" uuid NOT NULL,
	"session_id" uuid NOT NULL,
	"data_key" varchar(500) NOT NULL,
	"string_value" varchar(500),
	"number_value" numeric(19, 4),
	"date_value" timestamp(6) with time zone,
	"data_type" integer NOT NULL,
	"created_at" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP,
	"distinct_id" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "team" (
	"team_id" uuid PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL,
	"access_code" varchar(50),
	"created_at" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp(6) with time zone,
	"deleted_at" timestamp(6) with time zone,
	"logo_url" varchar(2183)
);
--> statement-breakpoint
CREATE TABLE "user" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"username" varchar(255) NOT NULL,
	"password" varchar(60) NOT NULL,
	"role" varchar(50) NOT NULL,
	"created_at" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp(6) with time zone,
	"deleted_at" timestamp(6) with time zone,
	"display_name" varchar(255),
	"logo_url" varchar(2183)
);
--> statement-breakpoint
CREATE TABLE "segment" (
	"segment_id" uuid PRIMARY KEY NOT NULL,
	"website_id" uuid NOT NULL,
	"type" varchar(50) NOT NULL,
	"name" varchar(200) NOT NULL,
	"parameters" jsonb NOT NULL,
	"created_at" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp(6) with time zone
);
--> statement-breakpoint
CREATE TABLE "website_event" (
	"event_id" uuid PRIMARY KEY NOT NULL,
	"website_id" uuid NOT NULL,
	"session_id" uuid NOT NULL,
	"created_at" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP,
	"url_path" varchar(500) NOT NULL,
	"url_query" varchar(500),
	"referrer_path" varchar(500),
	"referrer_query" varchar(500),
	"referrer_domain" varchar(500),
	"page_title" varchar(500),
	"event_type" integer DEFAULT 1 NOT NULL,
	"event_name" varchar(50),
	"visit_id" uuid NOT NULL,
	"tag" varchar(50),
	"fbclid" varchar(255),
	"gclid" varchar(255),
	"li_fat_id" varchar(255),
	"msclkid" varchar(255),
	"ttclid" varchar(255),
	"twclid" varchar(255),
	"utm_campaign" varchar(255),
	"utm_content" varchar(255),
	"utm_medium" varchar(255),
	"utm_source" varchar(255),
	"utm_term" varchar(255),
	"hostname" varchar(100),
	"cls" numeric(10, 4),
	"fcp" numeric(10, 1),
	"inp" numeric(10, 1),
	"lcp" numeric(10, 1),
	"ttfb" numeric(10, 1)
);
--> statement-breakpoint
CREATE TABLE "newsletter_subscribers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"source" text DEFAULT 'website' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "newsletter_subscribers_email_key" UNIQUE("email"),
	CONSTRAINT "newsletter_subscribers_status_check" CHECK (status = ANY (ARRAY['active'::text, 'unsubscribed'::text]))
);
--> statement-breakpoint
ALTER TABLE "newsletter_subscribers" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "revenue" (
	"revenue_id" uuid PRIMARY KEY NOT NULL,
	"website_id" uuid NOT NULL,
	"session_id" uuid NOT NULL,
	"event_id" uuid NOT NULL,
	"event_name" varchar(50) NOT NULL,
	"currency" varchar(10) NOT NULL,
	"revenue" numeric(19, 4),
	"created_at" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE "link" (
	"link_id" uuid PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"url" varchar(500) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"user_id" uuid,
	"team_id" uuid,
	"created_at" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp(6) with time zone,
	"deleted_at" timestamp(6) with time zone
);
--> statement-breakpoint
CREATE TABLE "pixel" (
	"pixel_id" uuid PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"user_id" uuid,
	"team_id" uuid,
	"created_at" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp(6) with time zone,
	"deleted_at" timestamp(6) with time zone
);
--> statement-breakpoint
CREATE TABLE "share" (
	"share_id" uuid PRIMARY KEY NOT NULL,
	"entity_id" uuid NOT NULL,
	"name" varchar(200) NOT NULL,
	"share_type" integer NOT NULL,
	"slug" varchar(100) NOT NULL,
	"parameters" jsonb NOT NULL,
	"created_at" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp(6) with time zone
);
--> statement-breakpoint
CREATE TABLE "board" (
	"board_id" uuid PRIMARY KEY NOT NULL,
	"type" varchar(50) NOT NULL,
	"name" varchar(200) NOT NULL,
	"description" varchar(500) NOT NULL,
	"parameters" jsonb NOT NULL,
	"user_id" uuid,
	"team_id" uuid,
	"created_at" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp(6) with time zone
);
--> statement-breakpoint
CREATE TABLE "session_replay" (
	"replay_id" uuid PRIMARY KEY NOT NULL,
	"website_id" uuid NOT NULL,
	"session_id" uuid NOT NULL,
	"visit_id" uuid NOT NULL,
	"chunk_index" integer NOT NULL,
	"events" "bytea" NOT NULL,
	"event_count" integer NOT NULL,
	"started_at" timestamp(6) with time zone NOT NULL,
	"ended_at" timestamp(6) with time zone NOT NULL,
	"created_at" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE "session_replay_saved" (
	"saved_replay_id" uuid PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"website_id" uuid NOT NULL,
	"visit_id" uuid NOT NULL,
	"created_at" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp(6) with time zone,
	CONSTRAINT "session_replay_saved_website_id_visit_id_key" UNIQUE("website_id","visit_id")
);
--> statement-breakpoint
CREATE TABLE "donation_goals" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"label" text DEFAULT 'Donasi Bulanan' NOT NULL,
	"target_amount" bigint NOT NULL,
	"current_amount" bigint DEFAULT 0 NOT NULL,
	"period_month" integer NOT NULL,
	"period_year" integer NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "donation_goals" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "donations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"louvin_transaction_id" uuid NOT NULL,
	"reference" text NOT NULL,
	"amount" integer NOT NULL,
	"fee" integer NOT NULL,
	"net_amount" integer NOT NULL,
	"payment_type" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"customer_name" text,
	"customer_email" text,
	"message" text,
	"payment_data" jsonb,
	"settled_at" timestamp with time zone,
	"failed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"is_anonymous" boolean DEFAULT false,
	"is_recurring" boolean DEFAULT false,
	"recurring_interval" text,
	CONSTRAINT "donations_louvin_transaction_id_key" UNIQUE("louvin_transaction_id"),
	CONSTRAINT "donations_reference_key" UNIQUE("reference"),
	CONSTRAINT "donations_recurring_interval_check" CHECK (recurring_interval = ANY (ARRAY['monthly'::text, 'quarterly'::text, 'yearly'::text])),
	CONSTRAINT "donations_status_check" CHECK (status = ANY (ARRAY['pending'::text, 'settled'::text, 'failed'::text]))
);
--> statement-breakpoint
ALTER TABLE "donations" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "comment_likes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"comment_id" uuid NOT NULL,
	"reader_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "comment_likes_comment_id_reader_id_key" UNIQUE("comment_id","reader_id")
);
--> statement-breakpoint
ALTER TABLE "comment_likes" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "premium_unlocks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"reader_id" uuid NOT NULL,
	"post_id" uuid NOT NULL,
	"unlocked_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "premium_unlocks_reader_id_post_id_key" UNIQUE("reader_id","post_id")
);
--> statement-breakpoint
ALTER TABLE "premium_unlocks" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "newsletter_issues" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"issue_number" integer NOT NULL,
	"title" text NOT NULL,
	"subject" text NOT NULL,
	"body" text NOT NULL,
	"excerpt" text,
	"sent_at" timestamp with time zone,
	"is_published" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "newsletter_issues_issue_number_key" UNIQUE("issue_number")
);
--> statement-breakpoint
ALTER TABLE "newsletter_issues" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "push_subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"subscription" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "push_subscriptions_user_id_key" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "push_subscriptions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "whitepapers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"subtitle" text,
	"summary" text,
	"body" text NOT NULL,
	"cover_image_url" text,
	"author" text DEFAULT 'TAMPARAN ANAK MUDA',
	"download_url" text,
	"reading_time" integer DEFAULT 10,
	"tags" text[] DEFAULT '{""}',
	"status" text DEFAULT 'draft',
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "whitepapers_slug_key" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "whitepapers" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "subcategories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category_id" uuid NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "subcategories_slug_key" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "subcategories" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "content_queue" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"slug" text,
	"pillar_id" uuid,
	"pov_tag" text,
	"target_keyword" text,
	"search_intent" text,
	"status" text DEFAULT 'idea' NOT NULL,
	"assigned_writer" uuid,
	"assigned_editor" uuid,
	"due_date" date,
	"publish_date" date,
	"cta" text,
	"target_platforms" text[] DEFAULT '{"RAY['web'::tex"}',
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "content_queue_pov_tag_check" CHECK (pov_tag = ANY (ARRAY['kontra-narasi'::text, 'refleksi'::text, 'data'::text, 'framework'::text, 'tamparan'::text, 'riset'::text, 'opini'::text, 'panduan'::text, 'inspirasi'::text])),
	CONSTRAINT "content_queue_search_intent_check" CHECK (search_intent = ANY (ARRAY['informational'::text, 'comparison'::text, 'transactional'::text])),
	CONSTRAINT "content_queue_status_check" CHECK (status = ANY (ARRAY['idea'::text, 'research'::text, 'draft'::text, 'review'::text, 'revision'::text, 'fact-check'::text, 'scheduled'::text, 'published'::text]))
);
--> statement-breakpoint
ALTER TABLE "content_queue" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "tags_slug_key" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "tags" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "post_tags" (
	"post_id" uuid NOT NULL,
	"tag_id" uuid NOT NULL,
	CONSTRAINT "post_tags_pkey" PRIMARY KEY("post_id","tag_id")
);
--> statement-breakpoint
ALTER TABLE "post_tags" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "public"."authors"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_series_id_fkey" FOREIGN KEY ("series_id") REFERENCES "public"."series"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_subcategory_id_fkey" FOREIGN KEY ("subcategory_id") REFERENCES "public"."subcategories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."comments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_reader_id_fkey" FOREIGN KEY ("reader_id") REFERENCES "auth"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tiktok_scripts" ADD CONSTRAINT "tiktok_scripts_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comment_likes" ADD CONSTRAINT "comment_likes_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "public"."comments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comment_likes" ADD CONSTRAINT "comment_likes_reader_id_fkey" FOREIGN KEY ("reader_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "premium_unlocks" ADD CONSTRAINT "premium_unlocks_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "premium_unlocks" ADD CONSTRAINT "premium_unlocks_reader_id_fkey" FOREIGN KEY ("reader_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "push_subscriptions" ADD CONSTRAINT "push_subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subcategories" ADD CONSTRAINT "subcategories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_queue" ADD CONSTRAINT "content_queue_assigned_editor_fkey" FOREIGN KEY ("assigned_editor") REFERENCES "auth"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_queue" ADD CONSTRAINT "content_queue_assigned_writer_fkey" FOREIGN KEY ("assigned_writer") REFERENCES "auth"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_queue" ADD CONSTRAINT "content_queue_pillar_id_fkey" FOREIGN KEY ("pillar_id") REFERENCES "public"."subcategories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_tags" ADD CONSTRAINT "post_tags_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_tags" ADD CONSTRAINT "post_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "heatmap_event_visit_id_idx" ON "heatmap_event" USING btree ("visit_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "heatmap_event_website_id_created_at_idx" ON "heatmap_event" USING btree ("website_id" uuid_ops,"created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "heatmap_event_website_id_idx" ON "heatmap_event" USING btree ("website_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "heatmap_event_website_id_url_path_event_type_created_at_idx" ON "heatmap_event" USING btree ("website_id" uuid_ops,"url_path" int4_ops,"event_type" int4_ops,"created_at" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_authors_slug" ON "authors" USING btree ("slug" text_ops);--> statement-breakpoint
CREATE INDEX "idx_posts_author" ON "posts" USING btree ("author_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_posts_category" ON "posts" USING btree ("category_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_posts_fact_check" ON "posts" USING btree ("fact_check_status" text_ops);--> statement-breakpoint
CREATE INDEX "idx_posts_og_card_url" ON "posts" USING btree ("og_card_url" text_ops) WHERE (og_card_url IS NOT NULL);--> statement-breakpoint
CREATE INDEX "idx_posts_published_at" ON "posts" USING btree ("published_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "idx_posts_review_status" ON "posts" USING btree ("review_status" text_ops);--> statement-breakpoint
CREATE INDEX "idx_posts_search" ON "posts" USING gin (to_tsvector('indonesian'::regconfig, ((((COALESCE(title, ''::te tsvector_ops);--> statement-breakpoint
CREATE INDEX "idx_posts_series" ON "posts" USING btree ("series_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_posts_slug" ON "posts" USING btree ("slug" text_ops);--> statement-breakpoint
CREATE INDEX "idx_posts_status" ON "posts" USING btree ("status" text_ops);--> statement-breakpoint
CREATE INDEX "idx_posts_subcategory" ON "posts" USING btree ("subcategory_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_series_slug" ON "series" USING btree ("slug" text_ops);--> statement-breakpoint
CREATE INDEX "idx_bookmarks_user" ON "bookmarks" USING btree ("user_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "session_created_at_idx" ON "session" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "session_website_id_created_at_browser_idx" ON "session" USING btree ("website_id" text_ops,"created_at" text_ops,"browser" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "session_website_id_created_at_city_idx" ON "session" USING btree ("website_id" uuid_ops,"created_at" uuid_ops,"city" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "session_website_id_created_at_country_idx" ON "session" USING btree ("website_id" bpchar_ops,"created_at" timestamptz_ops,"country" uuid_ops);--> statement-breakpoint
CREATE INDEX "session_website_id_created_at_device_idx" ON "session" USING btree ("website_id" timestamptz_ops,"created_at" timestamptz_ops,"device" uuid_ops);--> statement-breakpoint
CREATE INDEX "session_website_id_created_at_idx" ON "session" USING btree ("website_id" uuid_ops,"created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "session_website_id_created_at_language_idx" ON "session" USING btree ("website_id" text_ops,"created_at" uuid_ops,"language" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "session_website_id_created_at_os_idx" ON "session" USING btree ("website_id" text_ops,"created_at" timestamptz_ops,"os" uuid_ops);--> statement-breakpoint
CREATE INDEX "session_website_id_created_at_region_idx" ON "session" USING btree ("website_id" uuid_ops,"created_at" uuid_ops,"region" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "session_website_id_created_at_screen_idx" ON "session" USING btree ("website_id" uuid_ops,"created_at" uuid_ops,"screen" text_ops);--> statement-breakpoint
CREATE INDEX "session_website_id_idx" ON "session" USING btree ("website_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_comments_created_at" ON "comments" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "idx_comments_parent" ON "comments" USING btree ("parent_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_comments_parent_id" ON "comments" USING btree ("parent_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_comments_post" ON "comments" USING btree ("post_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_comments_post_id" ON "comments" USING btree ("post_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_comments_reader_id" ON "comments" USING btree ("reader_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_comments_status" ON "comments" USING btree ("status" text_ops);--> statement-breakpoint
CREATE INDEX "event_data_created_at_idx" ON "event_data" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "event_data_website_event_id_idx" ON "event_data" USING btree ("website_event_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "event_data_website_id_created_at_data_key_idx" ON "event_data" USING btree ("website_id" text_ops,"created_at" timestamptz_ops,"data_key" text_ops);--> statement-breakpoint
CREATE INDEX "event_data_website_id_created_at_idx" ON "event_data" USING btree ("website_id" uuid_ops,"created_at" uuid_ops);--> statement-breakpoint
CREATE INDEX "event_data_website_id_idx" ON "event_data" USING btree ("website_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "team_user_team_id_idx" ON "team_user" USING btree ("team_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "team_user_user_id_idx" ON "team_user" USING btree ("user_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "website_created_at_idx" ON "website" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "website_created_by_idx" ON "website" USING btree ("created_by" uuid_ops);--> statement-breakpoint
CREATE INDEX "website_team_id_idx" ON "website" USING btree ("team_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "website_user_id_idx" ON "website" USING btree ("user_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_tiktok_scripts_post" ON "tiktok_scripts" USING btree ("post_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_tiktok_scripts_status" ON "tiktok_scripts" USING btree ("status" text_ops);--> statement-breakpoint
CREATE INDEX "report_name_idx" ON "report" USING btree ("name" text_ops);--> statement-breakpoint
CREATE INDEX "report_type_idx" ON "report" USING btree ("type" text_ops);--> statement-breakpoint
CREATE INDEX "report_user_id_idx" ON "report" USING btree ("user_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "report_website_id_idx" ON "report" USING btree ("website_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "session_data_created_at_idx" ON "session_data" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "session_data_session_id_created_at_idx" ON "session_data" USING btree ("session_id" timestamptz_ops,"created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "session_data_session_id_idx" ON "session_data" USING btree ("session_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "session_data_website_id_created_at_data_key_idx" ON "session_data" USING btree ("website_id" text_ops,"created_at" uuid_ops,"data_key" uuid_ops);--> statement-breakpoint
CREATE INDEX "session_data_website_id_idx" ON "session_data" USING btree ("website_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "team_access_code_idx" ON "team" USING btree ("access_code" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "team_access_code_key" ON "team" USING btree ("access_code" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "user_username_key" ON "user" USING btree ("username" text_ops);--> statement-breakpoint
CREATE INDEX "segment_website_id_idx" ON "segment" USING btree ("website_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "website_event_created_at_idx" ON "website_event" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "website_event_session_id_idx" ON "website_event" USING btree ("session_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "website_event_visit_id_idx" ON "website_event" USING btree ("visit_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "website_event_website_id_created_at_event_name_idx" ON "website_event" USING btree ("website_id" uuid_ops,"created_at" text_ops,"event_name" text_ops);--> statement-breakpoint
CREATE INDEX "website_event_website_id_created_at_hostname_idx" ON "website_event" USING btree ("website_id" uuid_ops,"created_at" text_ops,"hostname" uuid_ops);--> statement-breakpoint
CREATE INDEX "website_event_website_id_created_at_idx" ON "website_event" USING btree ("website_id" uuid_ops,"created_at" uuid_ops);--> statement-breakpoint
CREATE INDEX "website_event_website_id_created_at_page_title_idx" ON "website_event" USING btree ("website_id" uuid_ops,"created_at" timestamptz_ops,"page_title" text_ops);--> statement-breakpoint
CREATE INDEX "website_event_website_id_created_at_referrer_domain_idx" ON "website_event" USING btree ("website_id" uuid_ops,"created_at" uuid_ops,"referrer_domain" text_ops);--> statement-breakpoint
CREATE INDEX "website_event_website_id_created_at_tag_idx" ON "website_event" USING btree ("website_id" uuid_ops,"created_at" text_ops,"tag" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "website_event_website_id_created_at_url_path_idx" ON "website_event" USING btree ("website_id" text_ops,"created_at" uuid_ops,"url_path" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "website_event_website_id_created_at_url_query_idx" ON "website_event" USING btree ("website_id" uuid_ops,"created_at" text_ops,"url_query" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "website_event_website_id_idx" ON "website_event" USING btree ("website_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "website_event_website_id_session_id_created_at_idx" ON "website_event" USING btree ("website_id" uuid_ops,"session_id" timestamptz_ops,"created_at" uuid_ops);--> statement-breakpoint
CREATE INDEX "website_event_website_id_visit_id_created_at_idx" ON "website_event" USING btree ("website_id" timestamptz_ops,"visit_id" uuid_ops,"created_at" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_newsletter_subscribers_email" ON "newsletter_subscribers" USING btree ("email" text_ops);--> statement-breakpoint
CREATE INDEX "idx_newsletter_subscribers_status" ON "newsletter_subscribers" USING btree ("status" text_ops);--> statement-breakpoint
CREATE INDEX "revenue_session_id_idx" ON "revenue" USING btree ("session_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "revenue_website_id_created_at_idx" ON "revenue" USING btree ("website_id" uuid_ops,"created_at" uuid_ops);--> statement-breakpoint
CREATE INDEX "revenue_website_id_idx" ON "revenue" USING btree ("website_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "revenue_website_id_session_id_created_at_idx" ON "revenue" USING btree ("website_id" timestamptz_ops,"session_id" timestamptz_ops,"created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "link_created_at_idx" ON "link" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "link_slug_idx" ON "link" USING btree ("slug" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "link_slug_key" ON "link" USING btree ("slug" text_ops);--> statement-breakpoint
CREATE INDEX "link_team_id_idx" ON "link" USING btree ("team_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "link_user_id_idx" ON "link" USING btree ("user_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "pixel_created_at_idx" ON "pixel" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "pixel_slug_idx" ON "pixel" USING btree ("slug" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "pixel_slug_key" ON "pixel" USING btree ("slug" text_ops);--> statement-breakpoint
CREATE INDEX "pixel_team_id_idx" ON "pixel" USING btree ("team_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "pixel_user_id_idx" ON "pixel" USING btree ("user_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "share_entity_id_idx" ON "share" USING btree ("entity_id" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "share_slug_key" ON "share" USING btree ("slug" text_ops);--> statement-breakpoint
CREATE INDEX "board_created_at_idx" ON "board" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "board_team_id_idx" ON "board" USING btree ("team_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "board_user_id_idx" ON "board" USING btree ("user_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "session_replay_session_id_chunk_index_idx" ON "session_replay" USING btree ("session_id" int4_ops,"chunk_index" uuid_ops);--> statement-breakpoint
CREATE INDEX "session_replay_session_id_idx" ON "session_replay" USING btree ("session_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "session_replay_website_id_created_at_idx" ON "session_replay" USING btree ("website_id" timestamptz_ops,"created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "session_replay_website_id_idx" ON "session_replay" USING btree ("website_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "session_replay_website_id_session_id_idx" ON "session_replay" USING btree ("website_id" uuid_ops,"session_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "session_replay_website_id_visit_id_idx" ON "session_replay" USING btree ("website_id" uuid_ops,"visit_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "session_replay_saved_visit_id_idx" ON "session_replay_saved" USING btree ("visit_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "session_replay_saved_website_id_created_at_idx" ON "session_replay_saved" USING btree ("website_id" timestamptz_ops,"created_at" uuid_ops);--> statement-breakpoint
CREATE INDEX "session_replay_saved_website_id_idx" ON "session_replay_saved" USING btree ("website_id" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "idx_donation_goals_period" ON "donation_goals" USING btree ("period_month" int4_ops,"period_year" int4_ops) WHERE (is_active = true);--> statement-breakpoint
CREATE INDEX "idx_donations_created_at" ON "donations" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "idx_donations_reference" ON "donations" USING btree ("reference" text_ops);--> statement-breakpoint
CREATE INDEX "idx_donations_status" ON "donations" USING btree ("status" text_ops);--> statement-breakpoint
CREATE INDEX "idx_premium_unlocks_post" ON "premium_unlocks" USING btree ("post_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_premium_unlocks_reader" ON "premium_unlocks" USING btree ("reader_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_newsletter_issues_published" ON "newsletter_issues" USING btree ("is_published" timestamptz_ops,"sent_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "idx_whitepapers_published" ON "whitepapers" USING btree ("published_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "idx_whitepapers_slug" ON "whitepapers" USING btree ("slug" text_ops);--> statement-breakpoint
CREATE INDEX "idx_whitepapers_status" ON "whitepapers" USING btree ("status" text_ops);--> statement-breakpoint
CREATE INDEX "idx_subcategories_category" ON "subcategories" USING btree ("category_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_subcategories_slug" ON "subcategories" USING btree ("slug" text_ops);--> statement-breakpoint
CREATE INDEX "idx_content_queue_pillar" ON "content_queue" USING btree ("pillar_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_content_queue_publish_date" ON "content_queue" USING btree ("publish_date" date_ops);--> statement-breakpoint
CREATE INDEX "idx_content_queue_status" ON "content_queue" USING btree ("status" text_ops);--> statement-breakpoint
CREATE INDEX "idx_content_queue_writer" ON "content_queue" USING btree ("assigned_writer" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_tags_slug" ON "tags" USING btree ("slug" text_ops);--> statement-breakpoint
CREATE INDEX "idx_post_tags_post" ON "post_tags" USING btree ("post_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_post_tags_tag" ON "post_tags" USING btree ("tag_id" uuid_ops);--> statement-breakpoint
CREATE POLICY "public_read_categories" ON "categories" AS PERMISSIVE FOR SELECT TO "anon" USING (true);--> statement-breakpoint
CREATE POLICY "admin_full_categories" ON "categories" AS PERMISSIVE FOR ALL TO "authenticated";--> statement-breakpoint
CREATE POLICY "public_read_authors" ON "authors" AS PERMISSIVE FOR SELECT TO "anon" USING (true);--> statement-breakpoint
CREATE POLICY "admin_full_authors" ON "authors" AS PERMISSIVE FOR ALL TO "authenticated";--> statement-breakpoint
CREATE POLICY "public_read_published_posts" ON "posts" AS PERMISSIVE FOR SELECT TO "anon" USING ((status = 'published'::text));--> statement-breakpoint
CREATE POLICY "admin_full_posts" ON "posts" AS PERMISSIVE FOR ALL TO "authenticated";--> statement-breakpoint
CREATE POLICY "public_read_series" ON "series" AS PERMISSIVE FOR SELECT TO "anon" USING (true);--> statement-breakpoint
CREATE POLICY "admin_full_series" ON "series" AS PERMISSIVE FOR ALL TO "authenticated";--> statement-breakpoint
CREATE POLICY "public_read_settings" ON "site_settings" AS PERMISSIVE FOR SELECT TO "anon" USING (true);--> statement-breakpoint
CREATE POLICY "admin_full_settings" ON "site_settings" AS PERMISSIVE FOR ALL TO "authenticated";--> statement-breakpoint
CREATE POLICY "user_own_bookmarks" ON "bookmarks" AS PERMISSIVE FOR ALL TO "authenticated" USING ((user_id = auth.uid())) WITH CHECK ((user_id = auth.uid()));--> statement-breakpoint
CREATE POLICY "public_read_approved_comments" ON "comments" AS PERMISSIVE FOR SELECT TO "anon" USING ((status = 'approved'::text));--> statement-breakpoint
CREATE POLICY "admin_full_comments" ON "comments" AS PERMISSIVE FOR ALL TO "authenticated";--> statement-breakpoint
CREATE POLICY "admin_full_tiktok_scripts" ON "tiktok_scripts" AS PERMISSIVE FOR ALL TO "authenticated" USING ((((auth.jwt() -> 'user_metadata'::text) ->> 'role'::text) = 'admin'::text));--> statement-breakpoint
CREATE POLICY "admin_full_hook_lines" ON "hook_lines" AS PERMISSIVE FOR ALL TO "authenticated" USING ((((auth.jwt() -> 'user_metadata'::text) ->> 'role'::text) = 'admin'::text));--> statement-breakpoint
CREATE POLICY "admin_read_newsletter_subscribers" ON "newsletter_subscribers" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((((auth.jwt() -> 'user_metadata'::text) ->> 'role'::text) = 'admin'::text));--> statement-breakpoint
CREATE POLICY "anon_read_donation_goals" ON "donation_goals" AS PERMISSIVE FOR SELECT TO "anon", "authenticated" USING ((is_active = true));--> statement-breakpoint
CREATE POLICY "service_manage_donation_goals" ON "donation_goals" AS PERMISSIVE FOR ALL TO "service_role";--> statement-breakpoint
CREATE POLICY "admin_read_donations" ON "donations" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((((auth.jwt() -> 'user_metadata'::text) ->> 'role'::text) = 'admin'::text));--> statement-breakpoint
CREATE POLICY "anon_read_donor_wall" ON "donations" AS PERMISSIVE FOR SELECT TO "anon", "authenticated";--> statement-breakpoint
CREATE POLICY "anon_read_comment_likes" ON "comment_likes" AS PERMISSIVE FOR SELECT TO "anon", "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "reader_insert_own_like" ON "comment_likes" AS PERMISSIVE FOR INSERT TO "authenticated";--> statement-breakpoint
CREATE POLICY "reader_delete_own_like" ON "comment_likes" AS PERMISSIVE FOR DELETE TO "authenticated";--> statement-breakpoint
CREATE POLICY "reader_read_own_unlocks" ON "premium_unlocks" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((auth.uid() = reader_id));--> statement-breakpoint
CREATE POLICY "reader_insert_own_unlock" ON "premium_unlocks" AS PERMISSIVE FOR INSERT TO "authenticated";--> statement-breakpoint
CREATE POLICY "service_manage_unlocks" ON "premium_unlocks" AS PERMISSIVE FOR ALL TO "service_role";--> statement-breakpoint
CREATE POLICY "anon_read_published_issues" ON "newsletter_issues" AS PERMISSIVE FOR SELECT TO "anon", "authenticated" USING ((is_published = true));--> statement-breakpoint
CREATE POLICY "service_manage_issues" ON "newsletter_issues" AS PERMISSIVE FOR ALL TO "service_role";--> statement-breakpoint
CREATE POLICY "service_manage_subs" ON "push_subscriptions" AS PERMISSIVE FOR ALL TO "service_role" USING (true) WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "user_read_own_sub" ON "push_subscriptions" AS PERMISSIVE FOR SELECT TO "authenticated";--> statement-breakpoint
CREATE POLICY "user_insert_own_sub" ON "push_subscriptions" AS PERMISSIVE FOR INSERT TO "authenticated";--> statement-breakpoint
CREATE POLICY "user_update_own_sub" ON "push_subscriptions" AS PERMISSIVE FOR UPDATE TO "authenticated";--> statement-breakpoint
CREATE POLICY "user_delete_own_sub" ON "push_subscriptions" AS PERMISSIVE FOR DELETE TO "authenticated";--> statement-breakpoint
CREATE POLICY "public_read_published_whitepapers" ON "whitepapers" AS PERMISSIVE FOR SELECT TO public USING (((status = 'published'::text) OR (auth.role() = 'service_role'::text)));--> statement-breakpoint
CREATE POLICY "service_manage_whitepapers" ON "whitepapers" AS PERMISSIVE FOR ALL TO "service_role";--> statement-breakpoint
CREATE POLICY "public_read_subcategories" ON "subcategories" AS PERMISSIVE FOR SELECT TO "anon" USING (true);--> statement-breakpoint
CREATE POLICY "admin_full_subcategories" ON "subcategories" AS PERMISSIVE FOR ALL TO "authenticated";--> statement-breakpoint
CREATE POLICY "admin_full_content_queue" ON "content_queue" AS PERMISSIVE FOR ALL TO "authenticated" USING ((((auth.jwt() -> 'user_metadata'::text) ->> 'role'::text) = 'admin'::text));--> statement-breakpoint
CREATE POLICY "public_read_tags" ON "tags" AS PERMISSIVE FOR SELECT TO "anon" USING (true);--> statement-breakpoint
CREATE POLICY "admin_full_tags" ON "tags" AS PERMISSIVE FOR ALL TO "authenticated";--> statement-breakpoint
CREATE POLICY "public_read_post_tags" ON "post_tags" AS PERMISSIVE FOR SELECT TO "anon" USING (true);--> statement-breakpoint
CREATE POLICY "admin_full_post_tags" ON "post_tags" AS PERMISSIVE FOR ALL TO "authenticated";
*/