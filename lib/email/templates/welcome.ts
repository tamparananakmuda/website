export interface WelcomeEmailData {
  email: string;
  unsubscribeToken: string;
  topics?: string[];
}

const TOPIC_LABELS: Record<string, string> = {
  uang: 'Uang',
  karier: 'Karier',
  bisnis: 'Bisnis',
  teknologi: 'Teknologi',
  kehidupan: 'Kehidupan',
  mindset: 'Mindset',
};

export function renderWelcomeEmail(data: WelcomeEmailData): { subject: string; html: string } {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tamparananakmuda.com';
  const unsubscribeUrl = `${siteUrl}/newsletter/unsubscribe?token=${data.unsubscribeToken}`;

  const topicsHtml = data.topics && data.topics.length > 0
    ? `<p style="color: #666; font-size: 14px; margin-bottom: 16px;">
         Kamu memilih topik: <strong>${data.topics.map((t) => TOPIC_LABELS[t] || t).join(', ')}</strong>
       </p>`
    : '';

  return {
    subject: 'Selamat datang di TAM Newsletter',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="border-left: 4px solid #e11d48; padding-left: 16px; margin-bottom: 24px;">
          <p style="font-size: 12px; letter-spacing: 0.15em; text-transform: uppercase; color: #e11d48; margin: 0 0 4px 0; font-weight: 600;">TAMPARAN ANAK MUDA</p>
        </div>

        <h2 style="color: #1a1a1a; font-size: 24px; margin-bottom: 16px;">Selamat datang.</h2>

        <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 16px;">
          Kamu sudah masuk. Satu email per minggu, langsung ke inbox kamu. Bukan konten acak, bukan link-link yang tidak penting. Hanya sudut pandang yang layak kamu baca pelan-pelan.
        </p>

        ${topicsHtml}

        <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
          Tidak ada spam, tidak ada clickbait. Kalau kami nggak punya yang layak dikatakan minggu ini, kami nggak akan kirim apa-apa.
        </p>

        <div style="background: #f8f8f8; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <p style="margin: 0 0 8px 0; font-weight: 600; color: #1a1a1a; font-size: 14px;">Yang akan kamu dapat:</p>
          <ul style="margin: 0; padding-left: 20px; color: #555; font-size: 14px; line-height: 1.8;">
            <li>Satu sudut pandang baru setiap minggu</li>
            <li>Tidak ada fluff, tidak ada filler</li>
            <li>Dibaca dalam 5 menit, dipikirkan selama seminggu</li>
          </ul>
        </div>

        <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 32px;">
          Kalau kamu merasa ini bukan untuk kamu, kamu bisa berhenti kapan saja. Tidak ada pertanyaan, tidak ada drama.
        </p>

        <p style="margin-bottom: 32px;">
          <a href="${unsubscribeUrl}" style="color: #999; font-size: 13px; text-decoration: underline;">Berhenti berlangganan</a>
        </p>

        <p style="color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
          TAMPARAN ANAK MUDA<br>
          Menyadarkan Generasi Muda akan Kenyataan<br>
          <a href="${siteUrl}" style="color: #999; text-decoration: none;">tamparananakmuda.com</a>
        </p>
      </div>
    `,
  };
}
