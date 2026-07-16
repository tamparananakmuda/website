import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAuth } from '@/lib/auth/admin-check';
import { getContentQueueFiltered, createContentQueueItem } from '@/lib/db/queries/content-queue';
import { contentQueueCreateSchema } from '@/lib/validations/content-queue';
import { contentQueueQuerySchema } from '@/lib/validations/query-params';
import { parseRequestBody, parseQueryParams } from '@/lib/validations/helpers';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const auth = await checkAdminAuth();
  if (!auth.isAdmin) return auth.response;

  try {
    const query = parseQueryParams(request, contentQueueQuerySchema);
    if (!query.success) return query.errorResponse;

    const items = await getContentQueueFiltered({
      status: query.data.status,
      pillarId: query.data.pillar,
    });

    return NextResponse.json({ items });
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
    const parsed = await parseRequestBody(request, contentQueueCreateSchema);
    if (!parsed.success) return parsed.errorResponse;

    const body = parsed.data;

    const item = await createContentQueueItem({
      title: body.title,
      pillarId: body.pillar_id || null,
      povTag: body.pov_tag || null,
      targetKeyword: body.target_keyword || null,
      searchIntent: body.search_intent || null,
      status: body.status || 'idea',
      dueDate: body.due_date || null,
      publishDate: body.publish_date || null,
      cta: body.cta || null,
      targetPlatforms: body.target_platforms || ['web'],
      notes: body.notes || null,
    });

    return NextResponse.json({ item });
  } catch (error) {
    console.error('Content queue create error:', error);
    return NextResponse.json(
      { error: 'Gagal membuat item' },
      { status: 500 }
    );
  }
}
