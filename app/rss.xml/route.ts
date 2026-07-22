import { getPublishedPostsWithRelations } from '@/lib/db/queries/posts';

export const dynamic = 'force-static';
export const revalidate = 3600;

export async function GET() {
  const posts = await getPublishedPostsWithRelations(20);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tamparananakmuda.com';

  const items = (posts || [])
    .map((post) => {
      const url = `${siteUrl}/artikel/${post.slug}`;
      const pubDate = new Date(post.publishedAt || post.createdAt || new Date()).toUTCString();
      const description = post.excerpt || '';
      const ogImage = post.ogFeatureUrl || post.ogImageUrl || `${siteUrl}/artikel/${post.slug}/opengraph-image`;

      const category = post.category;
      const author = post.author;

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
    })
    .join('\n');

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
