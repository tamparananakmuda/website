import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { checkAdminAuth } from '@/lib/auth/admin-check';
import { contentQueueCreateSchema } from '@/lib/validations/content-queue';
import { contentQueueQuerySchema } from '@/lib/validations/query-params';
import { parseRequestBody, parseQueryParams } from '@/lib/validations/helpers';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const auth = await checkAdminAuth();
  if (!auth.isAdmin) return auth.response;

  try {
    const supabase = createClient();
    const query = parseQueryParams(request, contentQueueQuerySchema);
    if (!query.success) return query.errorResponse;

    let supaQuery = supabase
      .from('content_queue')
      .select('*, pillar:subcategories(*)')
      .order('created_at', { ascending: false });

    if (query.data.status && query.data.status !== 'all') {
      supaQuery = supaQuery.eq('status', query.data.status);
    }
    if (query.data.pillar && query.data.pillar !== 'all') {
      supaQuery = supaQuery.eq('pillar_id', query.data.pillar);
    }

    const { data, error } = await supaQuery;

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
    const parsed = await parseRequestBody(request, contentQueueCreateSchema);
    if (!parsed.success) return parsed.errorResponse;

    const body = parsed.data;

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
