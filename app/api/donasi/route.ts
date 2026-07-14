import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { donasiSchema, getMinAmount } from '@/lib/validations/donasi';
import { rateLimit, rateLimitResponse } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

const LOUVIN_API_URL = 'https://api.louvin.dev/create-transaction';

export async function POST(request: NextRequest) {
  try {
    const limit = await rateLimit(request, {
      limit: 5,
      window: 60,
      identifier: 'donasi',
    });
    if (!limit.success) {
      return rateLimitResponse(limit);
    }

    const body = await request.json();

    const parsed = donasiSchema.safeParse(body);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0];
      return NextResponse.json(
        { error: firstError?.message || 'Input tidak valid' },
        { status: 400 }
      );
    }

    const { amount, payment_type, customer_name, customer_email, is_anonymous, message, is_recurring } = parsed.data;

    const minAmount = getMinAmount(payment_type);
    if (amount < minAmount) {
      return NextResponse.json(
        { error: `Nominal donasi minimal Rp ${minAmount.toLocaleString('id-ID')}` },
        { status: 400 }
      );
    }

    const apiKey = process.env.LOUVIN_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Payment gateway belum dikonfigurasi' },
        { status: 500 }
      );
    }

    const louvinRes = await fetch(LOUVIN_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify({
        amount,
        payment_type,
        customer_name,
        customer_email,
        description: 'Donasi TAMPARAN ANAK MUDA',
      }),
    });

    const data = await louvinRes.json();

    if (!louvinRes.ok || !data.success) {
      console.error('Louvin API error:', data);
      return NextResponse.json(
        { error: data.message || 'Gagal membuat transaksi' },
        { status: 500 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    );

    await supabase.from('donations').insert({
      transaction_id: data.transaction.id,
      order_id: data.payment.order_id,
      amount: data.transaction.amount,
      fee: data.transaction.fee,
      net_amount: data.transaction.net_amount,
      payment_type,
      status: 'pending',
      customer_name,
      customer_email,
      description: 'Donasi TAMPARAN ANAK MUDA',
      reference: data.transaction.reference,
      qr_string: data.payment.qr_string || null,
      va_number: data.payment.va_number || null,
      bank: data.payment.bank || null,
      payment_number: data.payment.payment_number || null,
      expired_at: data.payment.expired_at || null,
      is_anonymous,
      message: message || null,
      is_recurring,
    });

    return NextResponse.json({
      success: true,
      transaction_id: data.transaction.id,
      payment: data.payment,
      transaction: data.transaction,
    });
  } catch (error) {
    console.error('Donation create error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan. Coba lagi nanti.' },
      { status: 500 }
    );
  }
}
