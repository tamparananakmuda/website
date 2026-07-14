export type SourceReference = {
  type: 'link' | 'footnote' | 'inline';
  url: string;
  label: string;
};

export type PostStatus = 'draft' | 'review' | 'fact-check' | 'published';
export type PovTag = 'kontra-narasi' | 'refleksi' | 'data' | 'framework';
export type FactCheckStatus = 'pending' | 'verified' | 'flagged';
export type ReviewStatus = 'draft' | 'review' | 'fact-check' | 'publish';

export type Category = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  color: string;
  created_at: string;
};

export type Series = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  created_at: string;
};

export type Author = {
  id: string;
  name: string;
  slug: string;
  bio: string | null;
  avatar_url: string | null;
  social_instagram: string | null;
  social_twitter: string | null;
  social_linkedin: string | null;
  created_at: string;
  updated_at: string;
};

export type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string;
  cover_image_url: string | null;
  cover_image_alt: string | null;
  category_id: string | null;
  series_id: string | null;
  series_order: number | null;
  author_id: string | null;
  status: PostStatus;
  pov_tag: PovTag | null;
  human_signature: boolean;
  fact_check_status: FactCheckStatus;
  review_status: ReviewStatus;
  source_references: SourceReference[] | null;
  reading_time: number;
  published_at: string | null;
  featured: boolean;
  seo_meta_title: string | null;
  seo_meta_description: string | null;
  seo_og_image_url: string | null;
  og_headline: string | null;
  is_sponsored: boolean;
  sponsor_name: string | null;
  sponsor_url: string | null;
  sponsor_disclosure: string | null;
  is_premium: boolean;
  premium_excerpt: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  category?: Category;
  series?: Series;
  author?: Author;
};

export type SiteSettings = {
  id: string;
  title: string;
  description: string | null;
  social_instagram: string | null;
  social_tiktok: string | null;
  social_youtube: string | null;
  newsletter_headline: string | null;
  newsletter_subtext: string | null;
  updated_at: string;
};

export type NewsletterSubscriber = {
  id: string;
  email: string;
  status: 'active' | 'unsubscribed';
  source: string;
  created_at: string;
  updated_at: string;
};
