import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = createClient();

    const { data: issues, error } = await supabase
      .from('newsletter_issues')
      .select('id, issue_number, title, subject, excerpt, sent_at, created_at')
      .eq('is_published', true)
      .order('issue_number', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ issues: issues || [] });
  } catch (error) {
    console.error('Newsletter issues fetch error:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil arsip newsletter' },
      { status: 500 }
    );
  }
}
