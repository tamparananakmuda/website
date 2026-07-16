import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { checkAdminAuth } from '@/lib/auth/admin-check';
import { contentQueueUpdateSchema } from '@/lib/validations/content-queue';
import { parseRequestBody } from '@/lib/validations/helpers';

export const dynamic = 'force-dynamic';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await checkAdminAuth();
  if (!auth.isAdmin) return auth.response;

  try {
    const supabase = createClient();
    const parsed = await parseRequestBody(request, contentQueueUpdateSchema);
    if (!parsed.success) return parsed.errorResponse;

    const body = parsed.data;

    const updateFields: Record<string, unknown> = {};
    const allowedFields = [
      'title', 'pillar_id', 'pov_tag', 'target_keyword',
      'search_intent', 'status', 'assigned_to',
      'due_date', 'publish_date', 'cta', 'target_platforms', 'notes',
      'fact_check_status', 'review_status', 'scheduled_date',
    ];

    for (const field of allowedFields) {
      if (body[field as keyof typeof body] !== undefined) {
        updateFields[field] = body[field as keyof typeof body];
      }
    }

    const { data, error } = await supabase
      .from('content_queue')
      .update(updateFields)
      .eq('id', params.id)
      .select('*, pillar:subcategories(*)')
      .single();

    if (error) throw error;

    return NextResponse.json({ item: data });
  } catch (error) {
    console.error('Content queue update error:', error);
    return NextResponse.json(
      { error: 'Gagal update item' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await checkAdminAuth();
  if (!auth.isAdmin) return auth.response;

  try {
    const supabase = createClient();
    const { error } = await supabase
      .from('content_queue')
      .delete()
      .eq('id', params.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Content queue delete error:', error);
    return NextResponse.json(
      { error: 'Gagal hapus item' },
      { status: 500 }
    );
  }
}
