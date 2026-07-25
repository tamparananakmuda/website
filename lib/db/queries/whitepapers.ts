import {
  getPublishedWhitepapers,
  getWhitepaperBySlug,
  getPublishedWhitepaperBySlug,
  getRelatedWhitepapers,
  getPublishedWhitepapersForSitemap,
} from '@/lib/whitepaper/loader';
import type { WhitepaperPost } from '@/lib/whitepaper/loader';

export type Whitepaper = WhitepaperPost;

export {
  getPublishedWhitepapers,
  getWhitepaperBySlug,
  getPublishedWhitepaperBySlug,
  getRelatedWhitepapers,
  getPublishedWhitepapersForSitemap,
};
