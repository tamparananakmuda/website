import { NextResponse } from 'next/server';
import { getActiveDonationGoalByPeriod } from '@/lib/db/queries/donations';

export async function GET() {
  try {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const goal = await getActiveDonationGoalByPeriod(month, year);

    if (!goal) {
      return NextResponse.json({
        goal: null,
        progress: 0,
        target: 0,
        current: 0,
      });
    }

    const progress = goal.targetAmount > 0
      ? Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100))
      : 0;

    return NextResponse.json({
      goal,
      progress,
      target: goal.targetAmount,
      current: goal.currentAmount,
    });
  } catch (error) {
    console.error('Donation goal error:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data target donasi' },
      { status: 500 }
    );
  }
}
