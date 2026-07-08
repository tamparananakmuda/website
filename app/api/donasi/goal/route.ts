import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: false } }
    );

    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const { data: goal } = await supabase
      .from('donation_goals')
      .select('*')
      .eq('is_active', true)
      .eq('period_month', month)
      .eq('period_year', year)
      .single();

    if (!goal) {
      return NextResponse.json({
        goal: null,
        progress: 0,
        target: 0,
        current: 0,
      });
    }

    const progress = goal.target_amount > 0
      ? Math.min(100, Math.round((goal.current_amount / goal.target_amount) * 100))
      : 0;

    return NextResponse.json({
      goal,
      progress,
      target: goal.target_amount,
      current: goal.current_amount,
    });
  } catch (error) {
    console.error('Donation goal error:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data target donasi' },
      { status: 500 }
    );
  }
}
