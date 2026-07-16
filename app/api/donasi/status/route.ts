import { NextRequest, NextResponse } from 'next/server';
import { updateDonationStatusByLouvinId } from '@/lib/db/queries/donations';
import { donasiStatusQuerySchema } from '@/lib/validations/query-params';
import { rateLimit, rateLimitResponse } from '@/lib/rate-limit';
import { parseQueryParams } from '@/lib/validations/helpers';

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

    const query = parseQueryParams(request, donasiStatusQuerySchema);
    if (!query.success) return query.errorResponse;

    const transactionId = query.data.transaction_id;

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

    if (data.transaction && data.transaction.status) {
      const validStatuses = ['pending', 'settled', 'failed'];
      const status = data.transaction.status;

      if (validStatuses.includes(status)) {
        await updateDonationStatusByLouvinId(transactionId, status);
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
