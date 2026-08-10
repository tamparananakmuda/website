import { NextRequest, NextResponse } from 'next/server';
import slidesData from '@/files/slides-data.json';
import { incrementSlideView } from '@/lib/db/queries/social-posts';
import type { SlideSet } from '@/components/slide-grid';

const allSlides = slidesData as SlideSet[];

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { id?: string };
    const id = body?.id;

    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid id' }, { status: 400 });
    }

    const idx = allSlides.findIndex((s) => s.id === id);
    if (idx === -1) {
      return NextResponse.json({ error: 'Slide not found' }, { status: 404 });
    }

    const set = allSlides[idx];
    const count = await incrementSlideView({
      id: set.id,
      index: idx,
      caption: set.caption,
      slides: set.slides,
      date: set.date,
    });

    return NextResponse.json({ count });
  } catch (error) {
    console.error('POST /api/slides/view error:', error);
    return NextResponse.json({ count: 0 }, { status: 500 });
  }
}
