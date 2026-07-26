export interface ConfirmationEmailData {
  email: string;
  confirmToken: string;
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

export function renderConfirmationEmail(data: ConfirmationEmailData): { subject: string; html: string } {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tamparananakmuda.com';
  const confirmUrl = `${siteUrl}/api/newsletter/confirm?token=${data.confirmToken}`;

  const topicsHtml = data.topics && data.topics.length > 0
    ? `<p style="color: #666; font-size: 14px; margin-bottom: 16px;">
         Kamu memilih topik: <strong>${data.topics.map((t) => TOPIC_LABELS[t] || t).join(', ')}</strong>
       </p>`
    : '';

  return {
    subject: 'Konfirmasi langganan newsletter TAM',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="border-left: 4px solid #e11d48; padding-left: 16px; margin-bottom: 24px;">
          <p style="font-size: 12px; letter-spacing: 0.15em; text-transform: uppercase; color: #e11d48; margin: 0 0 4px 0; font-weight: 600;">TAMPARAN ANAK MUDA</p>
        </div>

        <h2 style="color: #1a1a1a; font-size: 24px; margin-bottom: 16px;">Konfirmasi langganan kamu.</h2>

        <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 16px;">
          Kamu hampir masuk. Tinggal satu langkah lagi: klik tombol di bawah untuk mengkonfirmasi langganan newsletter TAM.
        </p>

        ${topicsHtml}

        <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 32px;">
          Tanpa konfirmasi, kamu tidak akan menerima email apa-apa dari kami. Ini untuk memastikan tidak ada orang lain yang mendaftarkan email kamu tanpa izin.
        </p>

        <p style="margin-bottom: 32px;">
          <a href="${confirmUrl}" style="display: inline-block; background: #e11d48; color: #fff; font-size: 16px; font-weight: 600; padding: 14px 32px; border-radius: 8px; text-decoration: none;">
            Konfirmasi Langganan
          </a>
        </p>

        <p style="color: #999; font-size: 13px; margin-bottom: 32px;">
          Atau salin link ini ke browser: <br>
          <a href="${confirmUrl}" style="color: #999; word-break: break-all;">${confirmUrl}</a>
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
