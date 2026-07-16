import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { rateLimit, rateLimitResponse } from '@/lib/rate-limit';
import { donasiReceiptSchema } from '@/lib/validations/donasi-extra';
import { parseRequestBody } from '@/lib/validations/helpers';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const limit = await rateLimit(request, {
      limit: 3,
      window: 300,
      identifier: 'donation-receipt',
    });
    if (!limit.success) {
      return rateLimitResponse(limit);
    }

    const parsed = await parseRequestBody(request, donasiReceiptSchema);
    if (!parsed.success) return parsed.errorResponse;

    const { transaction_id, email } = parsed.data;

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    );

    const { data: donation, error } = await supabase
      .from('donations')
      .select('transaction_id, amount, fee, net_amount, payment_type, status, customer_name, created_at')
      .eq('transaction_id', transaction_id)
      .eq('customer_email', email)
      .single();

    if (error || !donation) {
      return NextResponse.json(
        { error: 'Transaksi tidak ditemukan' },
        { status: 404 }
      );
    }

    if (donation.status !== 'settled') {
      return NextResponse.json(
        { error: 'Transaksi belum selesai' },
        { status: 400 }
      );
    }

    const brevoApiKey = process.env.BREVO_API_KEY;
    if (!brevoApiKey) {
      return NextResponse.json(
        { error: 'Email service belum dikonfigurasi' },
        { status: 500 }
      );
    }

    const formatRupiah = (v: number) =>
      new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v);

    const emailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #e11d48;">Terima kasih atas dukunganmu</h2>
        <p>Halo ${donation.customer_name},</p>
        <p>Donasi kamu telah diterima. Berikut rincian transaksinya:</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">ID Transaksi</td><td style="padding: 8px; border-bottom: 1px solid #eee; font-family: monospace;">${donation.transaction_id}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">Nominal</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${formatRupiah(donation.amount)}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">Fee</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${formatRupiah(donation.fee)}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">Net diterima</td><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">${formatRupiah(donation.net_amount)}</td></tr>
          <tr><td style="padding: 8px; color: #666;">Tanggal</td><td style="padding: 8px;">${new Date(donation.created_at).toLocaleString('id-ID')}</td></tr>
        </table>
        <p>Setiap rupiah membantu TAM tetap independen dan terus menulis tanpa kompromi.</p>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">TAMPARAN ANAK MUDA<br>Menyadarkan generasi muda akan kenyataan</p>
      </div>
    `;

    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'api-key': brevoApiKey,
      },
      body: JSON.stringify({
        sender: { name: 'TAMPARAN ANAK MUDA', email: 'noreply@tamparananakmuda.com' },
        to: [{ email }],
        subject: 'Terima kasih atas dukunganmu',
        htmlContent: emailHtml,
      }),
    });

    if (!res.ok) {
      console.error('Brevo receipt email error:', await res.text());
      return NextResponse.json(
        { error: 'Gagal mengirim email' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Donation receipt error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan' },
      { status: 500 }
    );
  }
}
