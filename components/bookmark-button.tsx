'use client';

import { useState, useEffect } from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';

export function BookmarkButton({ postId }: { postId: number }) {
  const [bookmarked, setBookmarked] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/bookmarks');
        if (res.ok) {
          const data = await res.json();
          setLoggedIn(true);
          setBookmarked(data.bookmarks?.includes(postId) ?? false);
        }
      } catch {
        // not logged in
      }
    }
    checkAuth();
  }, [postId]);

  async function toggleBookmark() {
    if (!loggedIn) {
      window.location.href = '/masuk?next=' + window.location.pathname;
      return;
    }

    setLoading(true);

    try {
      if (bookmarked) {
        await fetch(`/api/bookmarks?post_id=${postId}`, { method: 'DELETE' });
        setBookmarked(false);
      } else {
        await fetch('/api/bookmarks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ post_id: postId }),
        });
        setBookmarked(true);
      }
    } catch {
      // silent fail
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={toggleBookmark}
      disabled={loading}
      className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      aria-label={bookmarked ? 'Hapus dari simpan' : 'Simpan artikel'}
    >
      {bookmarked ? (
        <BookmarkCheck className="w-4 h-4 text-primary" />
      ) : (
        <Bookmark className="w-4 h-4" />
      )}
      <span>{bookmarked ? 'Tersimpan' : 'Simpan'}</span>
    </button>
  );
}
