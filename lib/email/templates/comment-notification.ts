export interface CommentNotificationEmailData {
  postTitle: string;
  postSlug: string;
  authorName: string;
  commentBody: string;
}

export function renderCommentNotificationEmail(data: CommentNotificationEmailData): { subject: string; html: string } {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tamparananakmuda.com';
  const postUrl = `${siteUrl}/artikel/${data.postSlug}`;

  const truncatedBody = data.commentBody.length > 300
    ? data.commentBody.substring(0, 300) + '...'
    : data.commentBody;

  return {
    subject: `Komentar baru di: ${data.postTitle}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="border-left: 4px solid #e11d48; padding-left: 16px; margin-bottom: 24px;">
          <p style="font-size: 12px; letter-spacing: 0.15em; text-transform: uppercase; color: #e11d48; margin: 0 0 4px 0; font-weight: 600;">TAMPARAN ANAK MUDA</p>
        </div>

        <h2 style="color: #1a1a1a; font-size: 20px; margin-bottom: 16px;">Komentar baru</h2>

        <p style="color: #666; font-size: 14px; margin-bottom: 8px;">Artikel:</p>
        <p style="color: #1a1a1a; font-size: 16px; font-weight: 600; margin-bottom: 20px;">
          <a href="${postUrl}" style="color: #1a1a1a; text-decoration: none;">${data.postTitle}</a>
        </p>

        <p style="color: #666; font-size: 14px; margin-bottom: 8px;">Dari:</p>
        <p style="color: #333; font-size: 15px; font-weight: 600; margin-bottom: 20px;">${data.authorName}</p>

        <p style="color: #666; font-size: 14px; margin-bottom: 8px;">Komentar:</p>
        <div style="background: #f8f8f8; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
          <p style="color: #333; font-size: 14px; line-height: 1.6; margin: 0;">${truncatedBody}</p>
        </div>

        <p style="margin-bottom: 32px;">
          <a href="${postUrl}" style="display: inline-block; background: #e11d48; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-size: 14px; font-weight: 600;">Lihat artikel</a>
        </p>

        <p style="color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
          TAMPARAN ANAK MUDA<br>
          Menyadarkan generasi muda akan kenyataan<br>
          <a href="${siteUrl}" style="color: #999; text-decoration: none;">tamparananakmuda.com</a>
        </p>
      </div>
    `,
  };
}
