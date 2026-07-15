import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { checkAdminAuth } from '@/lib/auth/admin-check';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const auth = await checkAdminAuth();
  if (!auth.isAdmin) return auth.response;

  try {
    const supabase = createClient();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const pillar = searchParams.get('pillar');

    let query = supabase
      .from('content_queue')
      .select('*, pillar:subcategories(*)')
      .order('created_at', { ascending: false });

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }
    if (pillar && pillar !== 'all') {
      query = query.eq('pillar_id', pillar);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ items: data || [] });
  } catch (error) {
    console.error('Content queue fetch error:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const auth = await checkAdminAuth();
  if (!auth.isAdmin) return auth.response;

  try {
    const supabase = createClient();
    const body = await request.json();

    const { data, error } = await supabase
      .from('content_queue')
      .insert({
        title: body.title,
        pillar_id: body.pillar_id || null,
        pov_tag: body.pov_tag || null,
        target_keyword: body.target_keyword || null,
        search_intent: body.search_intent || null,
        status: body.status || 'idea',
        due_date: body.due_date || null,
        publish_date: body.publish_date || null,
        cta: body.cta || null,
        target_platforms: body.target_platforms || ['web'],
        notes: body.notes || null,
      })
      .select('*, pillar:subcategories(*)')
      .single();

    if (error) throw error;

    return NextResponse.json({ item: data });
  } catch (error) {
    console.error('Content queue create error:', error);
    return NextResponse.json(
      { error: 'Gagal membuat item' },
      { status: 500 }
    );
  }
}
