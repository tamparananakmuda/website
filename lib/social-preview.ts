interface SocialPreview {
  platform: 'x' | 'instagram' | 'tiktok' | 'youtube';
  source_url: string;
  source_id: string | null;
  author_handle: string | null;
  author_name: string | null;
  author_avatar_url: string | null;
  content_text: string | null;
  media_urls: string[];
  video_url: string | null;
  thumbnail_url: string | null;
  title: string | null;
  excerpt: string | null;
  published_at: string | null;
}

function detectPlatform(url: string): 'x' | 'instagram' | 'tiktok' | 'youtube' {
  const u = new URL(url);
  const host = u.hostname.replace('www.', '');
  if (host.includes('x.com') || host.includes('twitter.com')) return 'x';
  if (host.includes('instagram.com')) return 'instagram';
  if (host.includes('tiktok.com')) return 'tiktok';
  return 'youtube';
}

function extractSourceId(url: string, platform: string): string | null {
  const u = new URL(url);
  if (platform === 'x') {
    const match = u.pathname.match(/\/status\/(\d+)/);
    return match ? match[1] : null;
  }
  if (platform === 'instagram') {
    const match = u.pathname.match(/\/(p|reel)\/([^/]+)/);
    return match ? match[2] : null;
  }
  if (platform === 'tiktok') {
    const match = u.pathname.match(/\/video\/(\d+)/);
    return match ? match[1] : null;
  }
  if (platform === 'youtube') {
    if (u.hostname === 'youtu.be') return u.pathname.slice(1) || null;
    const v = u.searchParams.get('v');
    if (v) return v;
    const match = u.pathname.match(/\/shorts\/([^/]+)/);
    return match ? match[1] : null;
  }
  return null;
}

async function fetchOEmbed(url: string, oembedEndpoint: string): Promise<Record<string, unknown> | null> {
  try {
    const res = await fetch(`${oembedEndpoint}?url=${encodeURIComponent(url)}`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; TAM-Bot/1.0)' },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function fetchMetaTags(url: string): Promise<Record<string, string>> {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; TAM-Bot/1.0)',
        'Accept': 'text/html',
      },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return {};
    const html = await res.text();

    const metas: Record<string, string> = {};
    const metaRegex = /<meta\s+(?:property|name)=["']([^"']+)["']\s+content=["']([^"']*)["']/gi;
    let match;
    while ((match = metaRegex.exec(html)) !== null) {
      const key = match[1];
      const value = match[2];
      if (!metas[key]) metas[key] = value;
    }

    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    if (titleMatch && !metas['og:title']) {
      metas['og:title'] = titleMatch[1].trim();
    }

    return metas;
  } catch {
    return {};
  }
}

export async function previewSocialContent(url: string): Promise<SocialPreview> {
  const platform = detectPlatform(url);
  const sourceId = extractSourceId(url, platform);

  const oembedEndpoints: Record<string, string> = {
    x: 'https://publish.twitter.com/oembed',
    instagram: 'https://graph.instagram.com/oembed',
    tiktok: 'https://www.tiktok.com/oembed',
    youtube: 'https://www.youtube.com/oembed',
  };

  const [oembed, metas] = await Promise.all([
    fetchOEmbed(url, oembedEndpoints[platform]),
    fetchMetaTags(url),
  ]);

  let authorHandle: string | null = null;
  let authorName: string | null = null;
  let authorAvatarUrl: string | null = null;
  let contentText: string | null = null;
  let mediaUrls: string[] = [];
  let videoUrl: string | null = null;
  let thumbnailUrl: string | null = null;
  let title: string | null = null;
  let excerpt: string | null = null;

  if (oembed) {
    if (platform === 'x') {
      contentText = (oembed.html as string)?.replace(/<[^>]*>/g, '').trim() || null;
      authorName = (oembed.author_name as string) || null;
      authorHandle = (oembed.author_name as string) || null;
    } else if (platform === 'instagram') {
      title = (oembed.title as string) || null;
      authorName = (oembed.author_name as string) || null;
      authorHandle = (oembed.author_name as string) || null;
      thumbnailUrl = (oembed.thumbnail_url as string) || null;
    } else if (platform === 'tiktok') {
      title = (oembed.title as string) || null;
      authorName = (oembed.author_name as string) || null;
      authorHandle = (oembed.author_name as string) || null;
      thumbnailUrl = (oembed.thumbnail_url as string) || null;
    } else if (platform === 'youtube') {
      title = (oembed.title as string) || null;
      authorName = (oembed.author_name as string) || null;
      thumbnailUrl = (oembed.thumbnail_url as string) || null;
    }
  }

  if (metas['og:title'] && !title) title = metas['og:title'];
  if (metas['og:description'] && !excerpt) excerpt = metas['og:description'];
  if (metas['og:image'] && !thumbnailUrl) thumbnailUrl = metas['og:image'];
  if (metas['og:video']) videoUrl = metas['og:video'];
  if (metas['og:video:url']) videoUrl = metas['og:video:url'];
  if (metas['twitter:image'] && !thumbnailUrl) thumbnailUrl = metas['twitter:image'];
  if (metas['twitter:title'] && !title) title = metas['twitter:title'];
  if (metas['twitter:description'] && !excerpt) excerpt = metas['twitter:description'];

  if (metas['og:image:url']) mediaUrls.push(metas['og:image:url']);
  if (metas['og:image'] && !mediaUrls.includes(metas['og:image'])) mediaUrls.push(metas['og:image']);

  if (platform === 'youtube' && sourceId) {
    if (!thumbnailUrl) thumbnailUrl = `https://img.youtube.com/vi/${sourceId}/maxresdefault.jpg`;
    videoUrl = `https://www.youtube.com/embed/${sourceId}`;
  }

  if (platform === 'tiktok' && sourceId) {
    videoUrl = `https://www.tiktok.com/embed/v2/${sourceId}`;
  }

  return {
    platform,
    source_url: url,
    source_id: sourceId,
    author_handle: authorHandle,
    author_name: authorName,
    author_avatar_url: authorAvatarUrl,
    content_text: contentText,
    media_urls: mediaUrls,
    video_url: videoUrl,
    thumbnail_url: thumbnailUrl,
    title,
    excerpt,
    published_at: null,
  };
}
