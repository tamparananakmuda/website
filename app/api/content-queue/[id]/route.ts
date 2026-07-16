import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAuth } from '@/lib/auth/admin-check';
import { updateContentQueueItem, deleteContentQueueItem } from '@/lib/db/queries/content-queue';
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
    const parsed = await parseRequestBody(request, contentQueueUpdateSchema);
    if (!parsed.success) return parsed.errorResponse;

    const body = parsed.data;

    const updateFields: Record<string, unknown> = {};
    const fieldMap: Record<string, string> = {
      title: 'title',
      pillar_id: 'pillarId',
      pov_tag: 'povTag',
      target_keyword: 'targetKeyword',
      search_intent: 'searchIntent',
      status: 'status',
      assigned_to: 'assignedTo',
      due_date: 'dueDate',
      publish_date: 'publishDate',
      cta: 'cta',
      target_platforms: 'targetPlatforms',
      notes: 'notes',
      fact_check_status: 'factCheckStatus',
      review_status: 'reviewStatus',
      scheduled_date: 'scheduledDate',
    };

    for (const [snakeKey, camelKey] of Object.entries(fieldMap)) {
      if (body[snakeKey as keyof typeof body] !== undefined) {
        updateFields[camelKey] = body[snakeKey as keyof typeof body];
      }
    }

    await updateContentQueueItem(params.id, updateFields);

    return NextResponse.json({ success: true });
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
    await deleteContentQueueItem(params.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Content queue delete error:', error);
    return NextResponse.json(
      { error: 'Gagal hapus item' },
      { status: 500 }
    );
  }
}
