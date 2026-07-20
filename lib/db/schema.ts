import { pgTable, index, uuid, varchar, integer, timestamp, unique, uniqueIndex, text, foreignKey, check, boolean, jsonb, bigserial, bigint, date, primaryKey } from 'drizzle-orm/pg-core';
import { sql, relations } from 'drizzle-orm';

// Auth users table (Supabase managed, referenced by FKs)
export const usersInAuth = pgTable('users', {
  id: uuid().primaryKey().notNull(),
}, (table) => []);

export const categories = pgTable('categories', {
  id: uuid().defaultRandom().primaryKey().notNull(),
  title: text().notNull(),
  slug: text().notNull(),
  description: text(),
  color: text().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
  unique('categories_slug_key').on(table.slug),
]);

export const subcategories = pgTable('subcategories', {
  id: uuid().defaultRandom().primaryKey().notNull(),
  categoryId: uuid('category_id').notNull(),
  title: text().notNull(),
  slug: text().notNull(),
  description: text(),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
  index('idx_subcategories_category').using('btree', table.categoryId),
  index('idx_subcategories_slug').using('btree', table.slug),
  foreignKey({ columns: [table.categoryId], foreignColumns: [categories.id], name: 'subcategories_category_id_fkey' }).onDelete('cascade'),
  unique('subcategories_slug_key').on(table.slug),
]);

export const authors = pgTable('authors', {
  id: uuid().defaultRandom().primaryKey().notNull(),
  name: text().notNull(),
  slug: text().notNull(),
  bio: text(),
  avatarUrl: text('avatar_url'),
  socialInstagram: text('social_instagram'),
  socialTwitter: text('social_twitter'),
  socialLinkedin: text('social_linkedin'),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
  index('idx_authors_slug').using('btree', table.slug),
  unique('authors_slug_key').on(table.slug),
]);

export const series = pgTable('series', {
  id: uuid().defaultRandom().primaryKey().notNull(),
  title: text().notNull(),
  slug: text().notNull(),
  description: text(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
  index('idx_series_slug').using('btree', table.slug),
  unique('series_slug_key').on(table.slug),
]);

export const posts = pgTable('posts', {
  id: uuid().defaultRandom().primaryKey().notNull(),
  title: text().notNull(),
  slug: text().notNull(),
  excerpt: text(),
  body: text().notNull(),
  coverImageUrl: text('cover_image_url'),
  coverImageAlt: text('cover_image_alt'),
  categoryId: uuid('category_id'),
  seriesId: uuid('series_id'),
  seriesOrder: integer('series_order'),
  authorId: uuid('author_id'),
  status: text().default('draft').notNull(),
  povTag: text('pov_tag'),
  humanSignature: boolean('human_signature').default(false),
  factCheckStatus: text('fact_check_status').default('pending'),
  reviewStatus: text('review_status').default('draft'),
  sourceReferences: jsonb('source_references'),
  readingTime: integer('reading_time').default(1),
  publishedAt: timestamp('published_at', { withTimezone: true, mode: 'string' }),
  featured: boolean().default(false),
  seoMetaTitle: text('seo_meta_title'),
  seoMetaDescription: text('seo_meta_description'),
  seoOgImageUrl: text('seo_og_image_url'),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow(),
  isSponsored: boolean('is_sponsored').default(false),
  sponsorName: text('sponsor_name'),
  sponsorUrl: text('sponsor_url'),
  sponsorDisclosure: text('sponsor_disclosure'),
  isPremium: boolean('is_premium').default(false),
  premiumExcerpt: text('premium_excerpt'),
  ogHeadline: text('og_headline'),
  subcategoryId: uuid('subcategory_id'),
  ogCardUrl: text('og_card_url'),
  ogFeatureUrl: text('og_feature_url'),
  ogImageUrl: text('og_image_url'),
  seoKeywords: text('seo_keywords').array(),
}, (table) => [
  index('idx_posts_author').using('btree', table.authorId),
  index('idx_posts_category').using('btree', table.categoryId),
  index('idx_posts_fact_check').using('btree', table.factCheckStatus),
  index('idx_posts_og_card_url').using('btree', table.ogCardUrl).where(sql`(og_card_url IS NOT NULL)`),
  index('idx_posts_published_at').using('btree', table.publishedAt.desc()),
  index('idx_posts_review_status').using('btree', table.reviewStatus),
  index('idx_posts_search').using('gin', sql`to_tsvector('indonesian'::regconfig, ((((COALESCE(title, ''::text) || ' '::text) || COALESCE(excerpt, ''::text)) || ' '::text) || COALESCE(body, ''::text))))`),
  index('idx_posts_series').using('btree', table.seriesId),
  index('idx_posts_slug').using('btree', table.slug),
  index('idx_posts_status').using('btree', table.status),
  index('idx_posts_subcategory').using('btree', table.subcategoryId),
  foreignKey({ columns: [table.authorId], foreignColumns: [authors.id], name: 'posts_author_id_fkey' }).onDelete('set null'),
  foreignKey({ columns: [table.categoryId], foreignColumns: [categories.id], name: 'posts_category_id_fkey' }).onDelete('set null'),
  foreignKey({ columns: [table.seriesId], foreignColumns: [series.id], name: 'posts_series_id_fkey' }).onDelete('set null'),
  foreignKey({ columns: [table.subcategoryId], foreignColumns: [subcategories.id], name: 'posts_subcategory_id_fkey' }).onDelete('set null'),
  unique('posts_slug_key').on(table.slug),
  check('posts_excerpt_check', sql`char_length(excerpt) <= 160`),
  check('posts_fact_check_status_check', sql`fact_check_status = ANY (ARRAY['pending'::text, 'verified'::text, 'flagged'::text])`),
  check('posts_pov_tag_check', sql`pov_tag = ANY (ARRAY['kontra-narasi'::text, 'refleksi'::text, 'data'::text, 'framework'::text, 'tamparan'::text, 'riset'::text, 'opini'::text, 'panduan'::text, 'inspirasi'::text])`),
  check('posts_review_status_check', sql`review_status = ANY (ARRAY['draft'::text, 'review'::text, 'fact-check'::text, 'publish'::text])`),
  check('posts_seo_meta_description_check', sql`char_length(seo_meta_description) <= 160`),
  check('posts_status_check', sql`status = ANY (ARRAY['draft'::text, 'review'::text, 'fact-check'::text, 'scheduled'::text, 'published'::text])`),
]);

export const siteSettings = pgTable('site_settings', {
  id: uuid().defaultRandom().primaryKey().notNull(),
  title: text().default('TAMPARAN ANAK MUDA').notNull(),
  description: text(),
  socialInstagram: text('social_instagram'),
  socialTiktok: text('social_tiktok'),
  socialYoutube: text('social_youtube'),
  newsletterHeadline: text('newsletter_headline'),
  newsletterSubtext: text('newsletter_subtext'),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow(),
});

export const bookmarks = pgTable('bookmarks', {
  id: uuid().defaultRandom().primaryKey().notNull(),
  userId: uuid('user_id').notNull(),
  postId: uuid('post_id').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
  index('idx_bookmarks_user').using('btree', table.userId),
  foreignKey({ columns: [table.postId], foreignColumns: [posts.id], name: 'bookmarks_post_id_fkey' }).onDelete('cascade'),
  foreignKey({ columns: [table.userId], foreignColumns: [usersInAuth.id], name: 'bookmarks_user_id_fkey' }).onDelete('cascade'),
  unique('bookmarks_user_id_post_id_key').on(table.userId, table.postId),
]);

export const comments = pgTable('comments', {
  id: uuid().defaultRandom().primaryKey().notNull(),
  postId: uuid('post_id').notNull(),
  parentId: uuid('parent_id'),
  authorName: text('author_name').notNull(),
  authorEmail: text('author_email').notNull(),
  body: text().notNull(),
  status: text().default('pending').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow(),
  readerId: uuid('reader_id'),
  likesCount: integer('likes_count').default(0),
}, (table) => [
  index('idx_comments_created_at').using('btree', table.createdAt.desc()),
  index('idx_comments_parent').using('btree', table.parentId),
  index('idx_comments_post').using('btree', table.postId),
  index('idx_comments_reader_id').using('btree', table.readerId),
  index('idx_comments_status').using('btree', table.status),
  foreignKey({ columns: [table.parentId], foreignColumns: [table.id], name: 'comments_parent_id_fkey' }).onDelete('cascade'),
  foreignKey({ columns: [table.postId], foreignColumns: [posts.id], name: 'comments_post_id_fkey' }).onDelete('cascade'),
  foreignKey({ columns: [table.readerId], foreignColumns: [usersInAuth.id], name: 'comments_reader_id_fkey' }).onDelete('set null'),
  check('comments_status_check', sql`status = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text, 'spam'::text, 'deleted'::text])`),
]);

export const commentLikes = pgTable('comment_likes', {
  id: uuid().defaultRandom().primaryKey().notNull(),
  commentId: uuid('comment_id').notNull(),
  readerId: uuid('reader_id').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
  foreignKey({ columns: [table.commentId], foreignColumns: [comments.id], name: 'comment_likes_comment_id_fkey' }).onDelete('cascade'),
  foreignKey({ columns: [table.readerId], foreignColumns: [usersInAuth.id], name: 'comment_likes_reader_id_fkey' }).onDelete('cascade'),
  unique('comment_likes_comment_id_reader_id_key').on(table.commentId, table.readerId),
]);

export const tiktokScripts = pgTable('tiktok_scripts', {
  id: uuid().defaultRandom().primaryKey().notNull(),
  postId: uuid('post_id').notNull(),
  title: text().notNull(),
  hookLine: text('hook_line').notNull(),
  body: text().notNull(),
  status: text().default('draft').notNull(),
  publishedAt: timestamp('published_at', { withTimezone: true, mode: 'string' }),
  videoUrl: text('video_url'),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
  index('idx_tiktok_scripts_post').using('btree', table.postId),
  index('idx_tiktok_scripts_status').using('btree', table.status),
  foreignKey({ columns: [table.postId], foreignColumns: [posts.id], name: 'tiktok_scripts_post_id_fkey' }).onDelete('cascade'),
  check('tiktok_scripts_status_check', sql`status = ANY (ARRAY['draft'::text, 'approved'::text, 'published'::text])`),
]);

export const hookLines = pgTable('hook_lines', {
  id: uuid().defaultRandom().primaryKey().notNull(),
  text: text().notNull(),
  formula: text(),
  category: text(),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
});

export const newsletterSubscribers = pgTable('newsletter_subscribers', {
  id: uuid().defaultRandom().primaryKey().notNull(),
  email: text().notNull(),
  status: text().default('active').notNull(),
  source: text().default('website').notNull(),
  unsubscribeToken: text('unsubscribe_token'),
  topics: text('topics').array().default([]),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
  index('idx_newsletter_subscribers_email').using('btree', table.email),
  index('idx_newsletter_subscribers_status').using('btree', table.status),
  unique('newsletter_subscribers_email_key').on(table.email),
  unique('newsletter_subscribers_unsubscribe_token_key').on(table.unsubscribeToken),
  check('newsletter_subscribers_status_check', sql`status = ANY (ARRAY['active'::text, 'unsubscribed'::text, 'pending'::text])`),
]);

export const newsletterIssues = pgTable('newsletter_issues', {
  id: bigserial({ mode: 'bigint' }).primaryKey().notNull(),
  issueNumber: integer('issue_number').notNull(),
  title: text().notNull(),
  subject: text().notNull(),
  body: text().notNull(),
  excerpt: text(),
  sentAt: timestamp('sent_at', { withTimezone: true, mode: 'string' }),
  isPublished: boolean('is_published').default(false),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
  index('idx_newsletter_issues_published').using('btree', table.isPublished, table.sentAt.desc()),
  unique('newsletter_issues_issue_number_key').on(table.issueNumber),
]);

export const donations = pgTable('donations', {
  id: uuid().defaultRandom().primaryKey().notNull(),
  louvinTransactionId: uuid('louvin_transaction_id').notNull(),
  reference: text().notNull(),
  amount: integer().notNull(),
  fee: integer().notNull(),
  netAmount: integer('net_amount').notNull(),
  paymentType: text('payment_type').notNull(),
  status: text().default('pending').notNull(),
  customerName: text('customer_name'),
  customerEmail: text('customer_email'),
  message: text(),
  paymentData: jsonb('payment_data'),
  settledAt: timestamp('settled_at', { withTimezone: true, mode: 'string' }),
  failedAt: timestamp('failed_at', { withTimezone: true, mode: 'string' }),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow(),
  isAnonymous: boolean('is_anonymous').default(false),
  isRecurring: boolean('is_recurring').default(false),
  recurringInterval: text('recurring_interval'),
}, (table) => [
  index('idx_donations_created_at').using('btree', table.createdAt.desc()),
  index('idx_donations_reference').using('btree', table.reference),
  index('idx_donations_status').using('btree', table.status),
  unique('donations_louvin_transaction_id_key').on(table.louvinTransactionId),
  unique('donations_reference_key').on(table.reference),
  check('donations_recurring_interval_check', sql`recurring_interval = ANY (ARRAY['monthly'::text, 'quarterly'::text, 'yearly'::text])`),
  check('donations_status_check', sql`status = ANY (ARRAY['pending'::text, 'settled'::text, 'failed'::text])`),
]);

export const donationGoals = pgTable('donation_goals', {
  id: bigserial({ mode: 'bigint' }).primaryKey().notNull(),
  label: text().default('Donasi Bulanan').notNull(),
  targetAmount: bigint('target_amount', { mode: 'number' }).notNull(),
  currentAmount: bigint('current_amount', { mode: 'number' }).default(0).notNull(),
  periodMonth: integer('period_month').notNull(),
  periodYear: integer('period_year').notNull(),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
  uniqueIndex('idx_donation_goals_period').using('btree', table.periodMonth, table.periodYear).where(sql`(is_active = true)`),
]);

export const premiumUnlocks = pgTable('premium_unlocks', {
  id: uuid().defaultRandom().primaryKey().notNull(),
  readerId: uuid('reader_id').notNull(),
  postId: uuid('post_id').notNull(),
  unlockedAt: timestamp('unlocked_at', { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
  index('idx_premium_unlocks_post').using('btree', table.postId),
  index('idx_premium_unlocks_reader').using('btree', table.readerId),
  foreignKey({ columns: [table.postId], foreignColumns: [posts.id], name: 'premium_unlocks_post_id_fkey' }).onDelete('cascade'),
  foreignKey({ columns: [table.readerId], foreignColumns: [usersInAuth.id], name: 'premium_unlocks_reader_id_fkey' }).onDelete('cascade'),
  unique('premium_unlocks_reader_id_post_id_key').on(table.readerId, table.postId),
]);

export const pushSubscriptions = pgTable('push_subscriptions', {
  id: uuid().defaultRandom().primaryKey().notNull(),
  userId: uuid('user_id').notNull(),
  subscription: jsonb().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
  foreignKey({ columns: [table.userId], foreignColumns: [usersInAuth.id], name: 'push_subscriptions_user_id_fkey' }).onDelete('cascade'),
  unique('push_subscriptions_user_id_key').on(table.userId),
]);

export const whitepapers = pgTable('whitepapers', {
  id: uuid().defaultRandom().primaryKey().notNull(),
  slug: text().notNull(),
  title: text().notNull(),
  subtitle: text(),
  summary: text(),
  body: text().notNull(),
  coverImageUrl: text('cover_image_url'),
  author: text().default('TAMPARAN ANAK MUDA'),
  downloadUrl: text('download_url'),
  readingTime: integer('reading_time').default(10),
  tags: text().array().default(['']),
  status: text().default('draft'),
  publishedAt: timestamp('published_at', { withTimezone: true, mode: 'string' }),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
  index('idx_whitepapers_published').using('btree', table.publishedAt.desc()),
  index('idx_whitepapers_slug').using('btree', table.slug),
  index('idx_whitepapers_status').using('btree', table.status),
  unique('whitepapers_slug_key').on(table.slug),
]);

export const contentQueue = pgTable('content_queue', {
  id: uuid().defaultRandom().primaryKey().notNull(),
  title: text().notNull(),
  slug: text(),
  pillarId: uuid('pillar_id'),
  povTag: text('pov_tag'),
  targetKeyword: text('target_keyword'),
  searchIntent: text('search_intent'),
  status: text().default('idea').notNull(),
  assignedWriter: uuid('assigned_writer'),
  assignedEditor: uuid('assigned_editor'),
  dueDate: date('due_date'),
  publishDate: date('publish_date'),
  cta: text(),
  targetPlatforms: text('target_platforms').array().default(['web']),
  notes: text(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
  index('idx_content_queue_pillar').using('btree', table.pillarId),
  index('idx_content_queue_publish_date').using('btree', table.publishDate),
  index('idx_content_queue_status').using('btree', table.status),
  index('idx_content_queue_writer').using('btree', table.assignedWriter),
  foreignKey({ columns: [table.assignedEditor], foreignColumns: [usersInAuth.id], name: 'content_queue_assigned_editor_fkey' }).onDelete('set null'),
  foreignKey({ columns: [table.assignedWriter], foreignColumns: [usersInAuth.id], name: 'content_queue_assigned_writer_fkey' }).onDelete('set null'),
  foreignKey({ columns: [table.pillarId], foreignColumns: [subcategories.id], name: 'content_queue_pillar_id_fkey' }).onDelete('set null'),
  check('content_queue_pov_tag_check', sql`pov_tag = ANY (ARRAY['kontra-narasi'::text, 'refleksi'::text, 'data'::text, 'framework'::text, 'tamparan'::text, 'riset'::text, 'opini'::text, 'panduan'::text, 'inspirasi'::text])`),
  check('content_queue_search_intent_check', sql`search_intent = ANY (ARRAY['informational'::text, 'comparison'::text, 'transactional'::text])`),
  check('content_queue_status_check', sql`status = ANY (ARRAY['idea'::text, 'research'::text, 'draft'::text, 'review'::text, 'revision'::text, 'fact-check'::text, 'scheduled'::text, 'published'::text])`),
]);

export const tags = pgTable('tags', {
  id: uuid().defaultRandom().primaryKey().notNull(),
  name: text().notNull(),
  slug: text().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
  index('idx_tags_slug').using('btree', table.slug),
  unique('tags_slug_key').on(table.slug),
]);

export const postTags = pgTable('post_tags', {
  postId: uuid('post_id').notNull(),
  tagId: uuid('tag_id').notNull(),
}, (table) => [
  index('idx_post_tags_post').using('btree', table.postId),
  index('idx_post_tags_tag').using('btree', table.tagId),
  foreignKey({ columns: [table.postId], foreignColumns: [posts.id], name: 'post_tags_post_id_fkey' }).onDelete('cascade'),
  foreignKey({ columns: [table.tagId], foreignColumns: [tags.id], name: 'post_tags_tag_id_fkey' }).onDelete('cascade'),
  primaryKey({ columns: [table.postId, table.tagId], name: 'post_tags_pkey' }),
]);

// Tables defined in migrations but not yet in live DB
export const readerProfiles = pgTable('reader_profiles', {
  id: uuid().defaultRandom().primaryKey().notNull(),
  userId: uuid('user_id').notNull(),
  email: text().notNull(),
  name: text(),
  preferredTopics: text('preferred_topics').array().default([]),
  isAdmin: boolean('is_admin').default(false),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow(),
  lastActiveAt: timestamp('last_active_at', { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
  foreignKey({ columns: [table.userId], foreignColumns: [usersInAuth.id], name: 'reader_profiles_user_id_fkey' }).onDelete('cascade'),
  unique('reader_profiles_user_id_key').on(table.userId),
]);

export const readingHistory = pgTable('reading_history', {
  id: uuid().defaultRandom().primaryKey().notNull(),
  readerId: uuid('reader_id').notNull(),
  postId: uuid('post_id').notNull(),
  readAt: timestamp('read_at', { withTimezone: true, mode: 'string' }).defaultNow(),
  progress: integer().default(0),
}, (table) => [
  foreignKey({ columns: [table.readerId], foreignColumns: [usersInAuth.id], name: 'reading_history_reader_id_fkey' }).onDelete('cascade'),
  foreignKey({ columns: [table.postId], foreignColumns: [posts.id], name: 'reading_history_post_id_fkey' }).onDelete('cascade'),
  unique('reading_history_reader_id_post_id_key').on(table.readerId, table.postId),
]);

export const socialPosts = pgTable('social_posts', {
  id: bigserial({ mode: 'bigint' }).primaryKey().notNull(),
  platform: text().notNull(),
  sourceUrl: text('source_url').notNull(),
  sourceId: text('source_id'),
  authorHandle: text('author_handle'),
  authorName: text('author_name'),
  authorAvatarUrl: text('author_avatar_url'),
  contentText: text('content_text'),
  mediaUrls: text('media_urls').array().default([]),
  videoUrl: text('video_url'),
  thumbnailUrl: text('thumbnail_url'),
  transcript: text(),
  publishedAt: timestamp('published_at', { withTimezone: true, mode: 'string' }),
  importedAt: timestamp('imported_at', { withTimezone: true, mode: 'string' }).defaultNow(),
  status: text().default('draft').notNull(),
  title: text(),
  excerpt: text(),
  tags: text().array().default([]),
  viewCount: integer('view_count').default(0),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
  check('social_posts_platform_check', sql`platform = ANY (ARRAY['x'::text, 'instagram'::text, 'tiktok'::text, 'youtube'::text])`),
  check('social_posts_status_check', sql`status = ANY (ARRAY['draft'::text, 'published'::text, 'archived'::text])`),
]);

// Relations
export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(authors, { fields: [posts.authorId], references: [authors.id] }),
  category: one(categories, { fields: [posts.categoryId], references: [categories.id] }),
  series: one(series, { fields: [posts.seriesId], references: [series.id] }),
  subcategory: one(subcategories, { fields: [posts.subcategoryId], references: [subcategories.id] }),
  bookmarks: many(bookmarks),
  comments: many(comments),
  tiktokScripts: many(tiktokScripts),
  premiumUnlocks: many(premiumUnlocks),
  postTags: many(postTags),
}));

export const authorsRelations = relations(authors, ({ many }) => ({ posts: many(posts) }));
export const categoriesRelations = relations(categories, ({ many }) => ({ posts: many(posts), subcategories: many(subcategories) }));
export const seriesRelations = relations(series, ({ many }) => ({ posts: many(posts) }));

export const subcategoriesRelations = relations(subcategories, ({ one, many }) => ({
  posts: many(posts),
  category: one(categories, { fields: [subcategories.categoryId], references: [categories.id] }),
  contentQueues: many(contentQueue),
}));

export const bookmarksRelations = relations(bookmarks, ({ one }) => ({
  post: one(posts, { fields: [bookmarks.postId], references: [posts.id] }),
  user: one(usersInAuth, { fields: [bookmarks.userId], references: [usersInAuth.id] }),
}));

export const commentsRelations = relations(comments, ({ one, many }) => ({
  parent: one(comments, { fields: [comments.parentId], references: [comments.id], relationName: 'comments_parent' }),
  replies: many(comments, { relationName: 'comments_parent' }),
  post: one(posts, { fields: [comments.postId], references: [posts.id] }),
  reader: one(usersInAuth, { fields: [comments.readerId], references: [usersInAuth.id] }),
  commentLikes: many(commentLikes),
}));

export const tiktokScriptsRelations = relations(tiktokScripts, ({ one }) => ({
  post: one(posts, { fields: [tiktokScripts.postId], references: [posts.id] }),
}));

export const commentLikesRelations = relations(commentLikes, ({ one }) => ({
  comment: one(comments, { fields: [commentLikes.commentId], references: [comments.id] }),
  reader: one(usersInAuth, { fields: [commentLikes.readerId], references: [usersInAuth.id] }),
}));

export const premiumUnlocksRelations = relations(premiumUnlocks, ({ one }) => ({
  post: one(posts, { fields: [premiumUnlocks.postId], references: [posts.id] }),
  reader: one(usersInAuth, { fields: [premiumUnlocks.readerId], references: [usersInAuth.id] }),
}));

export const pushSubscriptionsRelations = relations(pushSubscriptions, ({ one }) => ({
  user: one(usersInAuth, { fields: [pushSubscriptions.userId], references: [usersInAuth.id] }),
}));

export const contentQueueRelations = relations(contentQueue, ({ one }) => ({
  assignedEditor: one(usersInAuth, { fields: [contentQueue.assignedEditor], references: [usersInAuth.id], relationName: 'contentQueue_assignedEditor' }),
  assignedWriter: one(usersInAuth, { fields: [contentQueue.assignedWriter], references: [usersInAuth.id], relationName: 'contentQueue_assignedWriter' }),
  pillar: one(subcategories, { fields: [contentQueue.pillarId], references: [subcategories.id] }),
}));

export const postTagsRelations = relations(postTags, ({ one }) => ({
  post: one(posts, { fields: [postTags.postId], references: [posts.id] }),
  tag: one(tags, { fields: [postTags.tagId], references: [tags.id] }),
}));

export const tagsRelations = relations(tags, ({ many }) => ({ postTags: many(postTags) }));
export const readerProfilesRelations = relations(readerProfiles, ({ one }) => ({ user: one(usersInAuth, { fields: [readerProfiles.userId], references: [usersInAuth.id] }) }));
export const readingHistoryRelations = relations(readingHistory, ({ one }) => ({
  reader: one(usersInAuth, { fields: [readingHistory.readerId], references: [usersInAuth.id] }),
  post: one(posts, { fields: [readingHistory.postId], references: [posts.id] }),
}));

// Inferred types (replaces types/database.ts)
export type Post = typeof posts.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type Subcategory = typeof subcategories.$inferSelect;
export type Series = typeof series.$inferSelect;
export type Author = typeof authors.$inferSelect;
export type Comment = typeof comments.$inferSelect;
export type Bookmark = typeof bookmarks.$inferSelect;
export type Tag = typeof tags.$inferSelect;
export type PostTag = typeof postTags.$inferSelect;
export type ContentQueue = typeof contentQueue.$inferSelect;
export type SiteSettings = typeof siteSettings.$inferSelect;
export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;
export type NewsletterIssue = typeof newsletterIssues.$inferSelect;
export type Donation = typeof donations.$inferSelect;
export type DonationGoal = typeof donationGoals.$inferSelect;
export type TiktokScript = typeof tiktokScripts.$inferSelect;
export type HookLine = typeof hookLines.$inferSelect;
export type CommentLike = typeof commentLikes.$inferSelect;
export type PremiumUnlock = typeof premiumUnlocks.$inferSelect;
export type PushSubscription = typeof pushSubscriptions.$inferSelect;
export type Whitepaper = typeof whitepapers.$inferSelect;
export type ReaderProfile = typeof readerProfiles.$inferSelect;
export type ReadingHistory = typeof readingHistory.$inferSelect;
export type SocialPost = typeof socialPosts.$inferSelect;

// Joined types for components (replaces joined fields in types/database.ts)
export type PostWithRelations = Post & {
  category?: Category;
  subcategory?: Subcategory;
  series?: Series;
  author?: Author;
  tags?: Tag[];
};

export type CategoryWithSubcategories = Category & {
  subcategories?: Subcategory[];
};

export type ContentQueueWithPillar = ContentQueue & {
  pillar?: Subcategory;
};
