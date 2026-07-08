import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-static';
export const revalidate = 3600;

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );

  const { data: posts } = await supabase
    .from('posts')
    .select('id, title, slug, excerpt, created_at, updated_at')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(20);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tamparananakmuda.com';

  const items = (posts || [])
    .map((post) => {
      const url = `${siteUrl}/artikel/${post.slug}`;
      const pubDate = new Date(post.created_at).toUTCString();
      const description = post.excerpt || '';
      return `    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description><![CDATA[${description}]]></description>
      <pubDate>${pubDate}</pubDate>
    </item>`;
    })
    .join('\n');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>TAMPARAN ANAK MUDA</title>
    <link>${siteUrl}</link>
    <description>Menyadarkan generasi muda akan kenyataan. Tulisan tentang uang, karier, bisnis, teknologi, kehidupan, dan mindset.</description>
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
