import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import {
  posts,
  categories,
  subcategories,
  authors,
  series,
  tags,
  comments,
  bookmarks,
  contentQueue,
  donations,
  donationGoals,
  newsletterSubscribers,
  newsletterIssues,
  socialPosts,
  whitepapers,
  readerProfiles,
  readingHistory,
  premiumUnlocks,
  pushSubscriptions,
  postTags,
  commentLikes,
  tiktokScripts,
  siteSettings,
} from './schema';

export const postInsertSchema = createInsertSchema(posts);
export const postSelectSchema = createSelectSchema(posts);

export const categoryInsertSchema = createInsertSchema(categories);
export const categorySelectSchema = createSelectSchema(categories);

export const subcategoryInsertSchema = createInsertSchema(subcategories);
export const subcategorySelectSchema = createSelectSchema(subcategories);

export const authorInsertSchema = createInsertSchema(authors);
export const authorSelectSchema = createSelectSchema(authors);

export const seriesInsertSchema = createInsertSchema(series);
export const seriesSelectSchema = createSelectSchema(series);

export const tagInsertSchema = createInsertSchema(tags);
export const tagSelectSchema = createSelectSchema(tags);

export const commentInsertSchema = createInsertSchema(comments);
export const commentSelectSchema = createSelectSchema(comments);

export const bookmarkInsertSchema = createInsertSchema(bookmarks);
export const bookmarkSelectSchema = createSelectSchema(bookmarks);

export const contentQueueInsertSchema = createInsertSchema(contentQueue);
export const contentQueueSelectSchema = createSelectSchema(contentQueue);

export const donationInsertSchema = createInsertSchema(donations);
export const donationSelectSchema = createSelectSchema(donations);

export const donationGoalInsertSchema = createInsertSchema(donationGoals);
export const donationGoalSelectSchema = createSelectSchema(donationGoals);

export const newsletterSubscriberInsertSchema = createInsertSchema(newsletterSubscribers);
export const newsletterSubscriberSelectSchema = createSelectSchema(newsletterSubscribers);

export const newsletterIssueInsertSchema = createInsertSchema(newsletterIssues);
export const newsletterIssueSelectSchema = createSelectSchema(newsletterIssues);

export const socialPostInsertSchema = createInsertSchema(socialPosts);
export const socialPostSelectSchema = createSelectSchema(socialPosts);

export const whitepaperInsertSchema = createInsertSchema(whitepapers);
export const whitepaperSelectSchema = createSelectSchema(whitepapers);

export const readerProfileInsertSchema = createInsertSchema(readerProfiles);
export const readerProfileSelectSchema = createSelectSchema(readerProfiles);

export const readingHistoryInsertSchema = createInsertSchema(readingHistory);
export const readingHistorySelectSchema = createSelectSchema(readingHistory);

export const premiumUnlockInsertSchema = createInsertSchema(premiumUnlocks);
export const premiumUnlockSelectSchema = createSelectSchema(premiumUnlocks);

export const pushSubscriptionInsertSchema = createInsertSchema(pushSubscriptions);
export const pushSubscriptionSelectSchema = createSelectSchema(pushSubscriptions);

export const postTagInsertSchema = createInsertSchema(postTags);
export const postTagSelectSchema = createSelectSchema(postTags);

export const commentLikeInsertSchema = createInsertSchema(commentLikes);
export const commentLikeSelectSchema = createSelectSchema(commentLikes);

export const tiktokScriptInsertSchema = createInsertSchema(tiktokScripts);
export const tiktokScriptSelectSchema = createSelectSchema(tiktokScripts);

export const siteSettingsInsertSchema = createInsertSchema(siteSettings);
export const siteSettingsSelectSchema = createSelectSchema(siteSettings);
