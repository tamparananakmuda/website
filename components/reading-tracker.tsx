'use client';

import { useEffect, useRef } from 'react';

export function ReadingTracker({ postId }: { postId: string }) {
  const lastReported = useRef(0);
  const userId = useRef<string | null>(null);

  useEffect(() => {
    let active = true;

    async function checkAuth() {
      try {
        const res = await fetch('/api/bookmarks', { method: 'GET' });
        if (res.ok) {
          userId.current = 'authenticated';
          await fetch('/api/reading-history', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ post_id: postId, progress: 0 }),
          });
        }
      } catch {
        // not logged in
      }
    }
    checkAuth();

    let debounceTimer: ReturnType<typeof setTimeout>;

    function handleScroll() {
      if (!userId.current || !active) return;

      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        if (!active) return;

        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? Math.min(100, Math.round((scrollTop / docHeight) * 100)) : 100;

        if (Math.abs(progress - lastReported.current) >= 25) {
          lastReported.current = progress;
          fetch('/api/reading-history', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ post_id: postId, progress }),
          }).catch(() => {});
        }
      }, 200);
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      active = false;
      clearTimeout(debounceTimer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [postId]);

  return null;
}
