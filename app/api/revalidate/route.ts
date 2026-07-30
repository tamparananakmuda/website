import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

export const dynamic = 'force-dynamic';

/**
 * On-demand ISR revalidation endpoint.
 * Gunakan ketika artikel diperbarui dan perlu cache di-clear tanpa menunggu 86400s.
 *
 * Usage:
 *   POST /api/revalidate
 *   Header: Authorization: Bearer <REVALIDATE_SECRET>
 *   Body: { "path": "/artikel/slug-artikel" }
 *     OR: { "tag": "posts" }
 *
 * Environment variable: REVALIDATE_SECRET (wajib)
 */

export async function POST(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;

  if (!secret) {
    console.error('[revalidate] REVALIDATE_SECRET not set');
    return NextResponse.json({ error: 'Revalidation not configured' }, { status: 500 });
  }

  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (token !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: { path?: string; tag?: string; paths?: string[] };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Body request tidak valid' }, { status: 400 });
  }

  const { path, tag, paths } = body;

  if (!path && !tag && !paths) {
    return NextResponse.json(
      { error: 'Sertakan salah satu dari: path, paths, atau tag' },
      { status: 400 }
    );
  }

  try {
    const revalidated: string[] = [];

    if (tag) {
      revalidateTag(tag);
      revalidated.push(`tag:${tag}`);
    }

    if (path) {
      revalidatePath(path);
      revalidated.push(`path:${path}`);
    }

    if (paths && Array.isArray(paths)) {
      for (const p of paths) {
        revalidatePath(p);
        revalidated.push(`path:${p}`);
      }
    }

    console.log('[revalidate] Revalidated:', revalidated.join(', '));

    return NextResponse.json({
      success: true,
      revalidated,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[revalidate] Error:', err);
    return NextResponse.json({ error: 'Revalidation gagal' }, { status: 500 });
  }
}
