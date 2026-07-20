import { NextRequest, NextResponse } from 'next/server';
import { getDonationByLouvinIdAndEmail } from '@/lib/db/queries/donations';
import { rateLimit, rateLimitResponse } from '@/lib/rate-limit';
import { donasiReceiptSchema } from '@/lib/validations/donasi-extra';
import { parseRequestBody } from '@/lib/validations/helpers';
import { sendEmail } from '@/lib/email/client';
import { renderDonationReceiptEmail } from '@/lib/email/templates/donation-receipt';

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

    const donation = await getDonationByLouvinIdAndEmail(transaction_id, email);

    if (!donation) {
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

    const { subject, html } = renderDonationReceiptEmail({
      customerName: donation.customerName,
      louvinTransactionId: donation.louvinTransactionId,
      amount: donation.amount,
      fee: donation.fee,
      netAmount: donation.netAmount,
      createdAt: donation.createdAt,
    });

    const result = await sendEmail({
      to: email,
      subject,
      htmlContent: html,
      tags: ['donation-receipt'],
    });

    if (!result.success) {
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
