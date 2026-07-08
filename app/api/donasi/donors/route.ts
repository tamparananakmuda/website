import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: false } }
    );

    const { data: donors } = await supabase
      .from('donations')
      .select('customer_name, amount, net_amount, message, is_recurring, updated_at')
      .eq('status', 'settled')
      .eq('is_anonymous', false)
      .order('updated_at', { ascending: false })
      .limit(20);

    return NextResponse.json({ donors: donors || [] });
  } catch (error) {
    console.error('Donor wall error:', error);
    return NextResponse.json(
      { donors: [] },
      { status: 200 }
    );
  }
}
