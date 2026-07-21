function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export interface DigestArticle {
  title: string;
  slug: string;
  excerpt: string;
  categoryTitle?: string;
  categoryColor?: string;
  categorySlug?: string;
  authorName?: string;
  readingTime?: number;
  isPremium?: boolean;
  isSponsored?: boolean;
}

export interface DigestEmailData {
  articles: DigestArticle[];
  unsubscribeToken: string;
}

export function renderDigestEmail(data: DigestEmailData): { subject: string; html: string } {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tamparananakmuda.com';
  const unsubscribeUrl = `${siteUrl}/newsletter/unsubscribe?token=${data.unsubscribeToken}`;
  const articles = data.articles;
  const count = articles.length;

  const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const subject = count === 1
    ? `Artikel baru hari ini: ${articles[0].title}`
    : `${count} artikel baru hari ini dari TAM`;

  const preheader = articles.map(a => escapeHtml(a.title)).join(' | ').substring(0, 120);

  const articleItems = articles.map((article) => {
    const postUrl = `${siteUrl}/artikel/${article.slug}`;
    const safeTitle = escapeHtml(article.title);
    const safeExcerpt = escapeHtml(article.excerpt);
    const safeAuthor = article.authorName ? escapeHtml(article.authorName) : undefined;
    const safeCat = article.categoryTitle ? escapeHtml(article.categoryTitle) : undefined;
    const meta: string[] = [];
    if (safeAuthor) meta.push(safeAuthor);
    if (article.readingTime) meta.push(`${article.readingTime} menit baca`);
    const metaStr = meta.length > 0 ? ` · ${meta.join(' • ')}` : '';
    const badge = article.isPremium ? ' [PREMIUM]' : article.isSponsored ? ' [SPONSORED]' : '';
    const cat = safeCat ? `<span style="color:${article.categoryColor || '#e11d48'};font-weight:700;">${safeCat}</span> • ` : '';

    return `<p style="margin:0 0 4px 0;font-size:12px;color:#a1a1aa;">${cat}${badge}</p>
<p style="margin:0 0 4px 0;"><a href="${postUrl}" style="font-size:18px;font-weight:700;color:#0a0a0a;text-decoration:none;">${safeTitle}</a></p>
<p style="margin:0 0 4px 0;font-size:13px;color:#a1a1aa;">${metaStr}</p>
<p style="margin:0 0 16px 0;font-size:15px;color:#52525b;line-height:1.6;">${safeExcerpt}</p>
<p style="margin:0 0 24px 0;"><a href="${postUrl}" style="color:#e11d48;font-size:14px;font-weight:700;text-decoration:none;">Baca artikel →</a></p>`;
  }).join('<hr style="border:none;border-top:1px solid #f4f4f5;margin:0 0 24px 0;">');

  return {
    subject,
    html: `<!DOCTYPE html>
<html lang="id">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">

<div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">${preheader}</div>

<div style="max-width:560px;margin:0 auto;padding:24px 16px;">

<p style="text-align:center;margin:0 0 4px 0;"><a href="${siteUrl}" style="color:#e11d48;font-size:13px;font-weight:700;letter-spacing:0.16em;text-decoration:none;text-transform:uppercase;">TAMPARAN ANAK MUDA</a></p>
<p style="text-align:center;margin:0 0 24px 0;color:#a1a1aa;font-size:13px;">${today}</p>

<div style="background:#fff;border-radius:12px;padding:32px;">
<h1 style="margin:0 0 8px 0;font-size:22px;font-weight:800;color:#0a0a0a;">Update artikel baru hari ini</h1>
<p style="margin:0 0 24px 0;color:#71717a;font-size:14px;">Rekapan artikel yang publish hari ini.</p>

${articleItems}

<p style="text-align:center;margin:24px 0 0 0;">
<a href="${siteUrl}" style="display:inline-block;background:#e11d48;color:#fff;padding:10px 24px;border-radius:6px;font-size:13px;font-weight:700;text-decoration:none;">Lihat semua artikel</a>
</p>
</div>

<p style="text-align:center;margin:24px 0 0 0;color:#a1a1aa;font-size:12px;line-height:1.6;">
Kamu menerima email ini karena berlangganan newsletter TAM.<br>
<a href="${unsubscribeUrl}" style="color:#a1a1aa;text-decoration:underline;">Berhenti berlangganan</a> •
<a href="${siteUrl}/privacy" style="color:#a1a1aa;text-decoration:underline;">Kebijakan privasi</a><br>
© 2026 TAMPARAN ANAK MUDA. Menyadarkan generasi muda akan kenyataan.
</p>

</div>
</body>
</html>`,
  };
}
