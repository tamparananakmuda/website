import { getPublishedPostsWithRelations } from '@/lib/db/queries/posts';
import { getPublishedWhitepapers } from '@/lib/db/queries/whitepapers';

export const dynamic = 'force-static';
export const revalidate = 3600;

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tamparananakmuda.com';

  const [posts, whitepapers] = await Promise.all([
    getPublishedPostsWithRelations(30),
    getPublishedWhitepapers(5),
  ]);

  const articleItems = (posts || []).map((post) => {
    const url = `${siteUrl}/artikel/${post.slug}`;
    const pubDate = new Date(post.publishedAt || post.createdAt || new Date()).toUTCString();
    const description = post.excerpt || '';
    const ogImage = (post as { ogFeatureUrl?: string; ogImageUrl?: string }).ogFeatureUrl ||
      (post as { ogFeatureUrl?: string; ogImageUrl?: string }).ogImageUrl ||
      `${siteUrl}/artikel/${post.slug}/opengraph-image`;
    const category = (post as { category?: { title: string } }).category;
    const author = (post as { author?: { name: string } }).author;

    return `    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description><![CDATA[${description}]]></description>
      <pubDate>${pubDate}</pubDate>
      <enclosure url="${ogImage}" type="image/webp" length="0" />
      ${category ? `<category><![CDATA[${category.title}]]></category>` : ''}
      ${author ? `<author><![CDATA[${author.name}]]></author>` : ''}
    </item>`;
  });

  const whitepaperItems = (whitepapers || []).map((wp) => {
    const url = `${siteUrl}/whitepaper/${wp.slug}`;
    const pubDate = new Date(wp.publishedAt || new Date()).toUTCString();
    const description = wp.summary || wp.subtitle || '';

    return `    <item>
      <title><![CDATA[${wp.title} [Whitepaper]]]></title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description><![CDATA[${description}]]></description>
      <pubDate>${pubDate}</pubDate>
      <category><![CDATA[Whitepaper]]></category>
    </item>`;
  });

  const items = [...articleItems, ...whitepaperItems].join('\n');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>TAMPARAN ANAK MUDA</title>
    <link>${siteUrl}</link>
    <description>Menyadarkan Generasi Muda akan Kenyataan. Tulisan tentang uang, karier, bisnis, teknologi, kehidupan, dan mindset.</description>
    <language>id-ID</language>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
