'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Lock, Loader2, CheckCircle2 } from 'lucide-react';

interface PremiumGateProps {
  postId: number;
  excerpt?: string;
}

export function PremiumGate({ postId, excerpt }: PremiumGateProps) {
  const [unlocked, setUnlocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [unlocking, setUnlocking] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setLoggedIn(!!user);
      if (user) {
        fetch(`/api/premium?post_id=${postId}`)
          .then((r) => r.json())
          .then((data) => setUnlocked(data.unlocked))
          .catch(() => {})
          .finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });
  }, [postId]);

  async function handleUnlock() {
    if (!loggedIn) {
      window.location.href = '/masuk';
      return;
    }

    setUnlocking(true);
    try {
      const res = await fetch('/api/premium', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post_id: postId }),
      });
      const data = await res.json();
      if (res.ok && data.unlocked) {
        setUnlocked(true);
      }
    } catch {
      // silent
    } finally {
      setUnlocking(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (unlocked) {
    return null;
  }

  return (
    <div className="relative">
      {excerpt && (
        <div className="prose prose-invert max-w-none opacity-60">
          <p>{excerpt}</p>
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />

      <div className="relative mt-8 rounded-2xl border border-border bg-card p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Lock className="w-6 h-6 text-primary" />
        </div>
        <h3 className="mb-2 text-lg font-bold text-foreground">
          Artikel Premium
        </h3>
        <p className="mb-6 max-w-md mx-auto text-sm text-muted-foreground">
          Artikel ini gratis untuk dibaca. Login untuk membuka konten penuh dan menyimpan progres baca.
        </p>
        <button
          onClick={handleUnlock}
          disabled={unlocking}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {unlocking ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Membuka...
            </>
          ) : loggedIn ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              Buka Artikel
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              Login untuk Baca
            </>
          )}
        </button>
      </div>
    </div>
  );
}
