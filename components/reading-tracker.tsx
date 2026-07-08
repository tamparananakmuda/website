'use client';

import { useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';

export function ReadingTracker({ postId }: { postId: number }) {
  const lastReported = useRef(0);

  useEffect(() => {
    const supabase = createClient();
    let userId: string | null = null;

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      userId = user.id;

      supabase
        .from('reading_history')
        .upsert(
          {
            reader_id: user.id,
            post_id: postId,
            read_at: new Date().toISOString(),
            progress: 0,
          },
          { onConflict: 'reader_id,post_id' }
        );
    });

    function handleScroll() {
      if (!userId) return;

      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(100, Math.round((scrollTop / docHeight) * 100)) : 100;

      if (Math.abs(progress - lastReported.current) >= 25) {
        lastReported.current = progress;
        supabase
          .from('reading_history')
          .upsert(
            {
              reader_id: userId,
              post_id: postId,
              read_at: new Date().toISOString(),
              progress,
            },
            { onConflict: 'reader_id,post_id' }
          );
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [postId]);

  return null;
}
