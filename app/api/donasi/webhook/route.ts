import { NextRequest, NextResponse } from 'next/server';
import { updateDonationStatusByLouvinId } from '@/lib/db/queries/donations';
import { createHmac, timingSafeEqual } from 'crypto';

export const dynamic = 'force-dynamic';

function verifySignature(rawBody: string, signature: string | null): boolean {
  const secret = process.env.LOUVIN_WEBHOOK_SECRET;
  if (!secret) {
    console.error('LOUVIN_WEBHOOK_SECRET not configured');
    return false;
  }
  if (!signature) return false;

  const expected = createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex');

  const sigBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  if (sigBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(sigBuffer, expectedBuffer);
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-louvin-signature');

    if (!verifySignature(rawBody, signature)) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const body = JSON.parse(rawBody);
    const { event, data } = body;

    if (!event || !data) {
      return NextResponse.json(
        { error: 'Invalid webhook payload' },
        { status: 400 }
      );
    }

    if (event === 'payment.settled' || event === 'payment.failed') {
      await updateDonationStatusByLouvinId(data.transaction_id, data.status);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Donation webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
