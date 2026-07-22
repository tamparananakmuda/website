function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export interface DonationReceiptEmailData {
  customerName: string | null;
  louvinTransactionId: string;
  amount: number;
  fee: number;
  netAmount: number;
  createdAt: string | null;
}

const formatRupiah = (v: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v);

export function renderDonationReceiptEmail(data: DonationReceiptEmailData): { subject: string; html: string } {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tamparananakmuda.com';
  const dateStr = new Date(data.createdAt || new Date()).toLocaleString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  const safeName = escapeHtml(data.customerName || 'Teman TAM');
  const safeTxId = escapeHtml(data.louvinTransactionId);

  return {
    subject: 'Terima kasih atas dukunganmu',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="border-left: 4px solid #e11d48; padding-left: 16px; margin-bottom: 24px;">
          <p style="font-size: 12px; letter-spacing: 0.15em; text-transform: uppercase; color: #e11d48; margin: 0 0 4px 0; font-weight: 600;">TAMPARAN ANAK MUDA</p>
        </div>

        <h2 style="color: #1a1a1a; font-size: 24px; margin-bottom: 16px;">Terima kasih atas dukunganmu</h2>

        <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 16px;">
          Halo ${safeName},
        </p>

        <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
          Donasi kamu telah diterima. Berikut rincian transaksinya:
        </p>

        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; color: #666; font-size: 14px;">ID Transaksi</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-family: monospace; font-size: 13px; color: #333;">${safeTxId}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; color: #666; font-size: 14px;">Nominal</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; color: #333;">${formatRupiah(data.amount)}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; color: #666; font-size: 14px;">Fee</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; color: #333;">${formatRupiah(data.fee)}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; color: #666; font-size: 14px;">Net diterima</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; color: #1a1a1a;">${formatRupiah(data.netAmount)}</td>
          </tr>
          <tr>
            <td style="padding: 10px; color: #666; font-size: 14px;">Tanggal</td>
            <td style="padding: 10px; color: #333;">${dateStr}</td>
          </tr>
        </table>

        <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
          Setiap rupiah membantu TAM tetap independen dan terus menulis tanpa kompromi.
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
