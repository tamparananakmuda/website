import { NextRequest, NextResponse } from 'next/server';
import slidesData from '@/files/slides-data.json';
import { ensureSlideSocialPosts } from '@/lib/db/queries/social-posts';
import type { SlideSet } from '@/components/slide-grid';

const allSlides = slidesData as SlideSet[];

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const idsParam = request.nextUrl.searchParams.get('ids');
    if (!idsParam) {
      return NextResponse.json({ counts: {} });
    }

    const ids = idsParam.split(',').filter(Boolean);
    const slides = ids.map((id) => {
      const idx = allSlides.findIndex((s) => s.id === id);
      const set = allSlides[idx];
      if (!set) {
        return {
          id,
          index: 0,
          caption: '',
          slides: [] as string[],
          date: '',
        };
      }
      return {
        id: set.id,
        index: idx,
        caption: set.caption,
        slides: set.slides,
        date: set.date,
      };
    });

    const counts = await ensureSlideSocialPosts(slides);
    return NextResponse.json({ counts });
  } catch (error) {
    console.error('GET /api/slides/views error:', error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ counts: {}, error: message }, { status: 500 });
  }
}
