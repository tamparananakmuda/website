import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const transactionId = searchParams.get('transaction_id');

    if (!transactionId) {
      return NextResponse.json(
        { error: 'Transaction ID wajib diisi' },
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

    const louvinRes = await fetch(
      `https://api.louvin.dev/check-status?id=${transactionId}`,
      {
        headers: { 'x-api-key': apiKey },
      }
    );

    const data = await louvinRes.json();

    if (!louvinRes.ok) {
      console.error('Louvin status check error:', data);
      return NextResponse.json(
        { error: 'Gagal mengecek status' },
        { status: 500 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    );

    if (data.transaction && data.transaction.status) {
      await supabase
        .from('donations')
        .update({
          status: data.transaction.status,
          updated_at: new Date().toISOString(),
        })
        .eq('transaction_id', transactionId);
    }

    return NextResponse.json({
      success: true,
      status: data.transaction?.status || 'pending',
      transaction: data.transaction,
    });
  } catch (error) {
    console.error('Donation status check error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan. Coba lagi nanti.' },
      { status: 500 }
    );
  }
}
