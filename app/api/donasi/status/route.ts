import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { donasiStatusSchema } from '@/lib/validations/donasi';
import { rateLimit, rateLimitResponse } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const limit = await rateLimit(request, {
      limit: 10,
      window: 60,
      identifier: 'donasi-status',
    });
    if (!limit.success) {
      return rateLimitResponse(limit);
    }

    const { searchParams } = new URL(request.url);
    const transactionId = searchParams.get('transaction_id');

    const parsed = donasiStatusSchema.safeParse({
      transaction_id: transactionId,
    });
    if (!parsed.success) {
      const firstError = parsed.error.issues[0];
      return NextResponse.json(
        { error: firstError?.message || 'Input tidak valid' },
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
      `https://api.louvin.dev/check-status?id=${parsed.data.transaction_id}`,
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
      const validStatuses = ['pending', 'settled', 'failed'];
      const status = data.transaction.status;

      if (validStatuses.includes(status)) {
        await supabase
          .from('donations')
          .update({
            status,
            updated_at: new Date().toISOString(),
          })
          .eq('transaction_id', parsed.data.transaction_id);
      } else {
        console.warn('Unknown donation status from Louvin:', status);
      }
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
