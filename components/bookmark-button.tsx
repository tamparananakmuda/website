'use client';

import { useState, useEffect } from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export function BookmarkButton({ postId }: { postId: number }) {
  const [bookmarked, setBookmarked] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      setLoggedIn(true);
      supabase
        .from('bookmarks')
        .select('post_id')
        .eq('reader_id', user.id)
        .eq('post_id', postId)
        .single()
        .then(({ data }) => {
          setBookmarked(!!data);
        });
    });
  }, [postId]);

  async function toggleBookmark() {
    if (!loggedIn) {
      window.location.href = '/masuk?next=' + window.location.pathname;
      return;
    }

    setLoading(true);
    const supabase = createClient();

    if (bookmarked) {
      await supabase
        .from('bookmarks')
        .delete()
        .eq('reader_id', (await supabase.auth.getUser()).data.user?.id)
        .eq('post_id', postId);
      setBookmarked(false);
    } else {
      const { data: { user } } = await supabase.auth.getUser();
      await supabase
        .from('bookmarks')
        .insert({ reader_id: user!.id, post_id: postId });
      setBookmarked(true);
    }
    setLoading(false);
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
