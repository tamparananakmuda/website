import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { event, data } = body;

    if (!event || !data) {
      return NextResponse.json(
        { error: 'Invalid webhook payload' },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    );

    if (event === 'payment.settled' || event === 'payment.failed') {
      await supabase
        .from('donations')
        .update({
          status: data.status,
          updated_at: new Date().toISOString(),
        })
        .eq('transaction_id', data.transaction_id);
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
