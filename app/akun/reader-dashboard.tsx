'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { Bookmark, Clock, Heart, LogOut, User } from 'lucide-react';
import { PushNotificationToggle } from '@/components/push-toggle';

interface PostData {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  categories: { name: string; slug: string }[] | { name: string; slug: string } | null;
}

interface BookmarkItem {
  post_id: number;
  created_at: string;
  posts: PostData | PostData[] | null;
}

interface HistoryItem {
  post_id: number;
  read_at: string;
  progress: number;
  posts: PostData | PostData[] | null;
}

function getPost(posts: PostData | PostData[] | null): PostData | null {
  if (!posts) return null;
  return Array.isArray(posts) ? posts[0] || null : posts;
}

function getCategoryName(post: PostData | null): string {
  if (!post?.categories) return '';
  return Array.isArray(post.categories) ? post.categories[0]?.name || '' : post.categories.name;
}

interface DonationItem {
  transaction_id: string;
  amount: number;
  status: string;
  payment_type: string;
  created_at: string;
}

interface Profile {
  id: string;
  name: string | null;
  preferred_topics: string[];
}

export default function ReaderDashboard({
  profile,
  bookmarks,
  history,
  donations,
  email,
}: {
  profile: Profile | null;
  bookmarks: BookmarkItem[];
  history: HistoryItem[];
  donations: DonationItem[];
  email: string;
}) {
  const [name, setName] = useState(profile?.name || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSaveName() {
    setSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from('reader_profiles')
      .update({ name, updated_at: new Date().toISOString() })
      .eq('user_id', user.id);

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/';
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Akun Saya</h1>
            <p className="text-sm text-muted-foreground mt-1">{email}</p>
          </div>
          <div className="flex items-center gap-3">
            <PushNotificationToggle />
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Keluar
            </button>
          </div>
        </div>

        {/* Profile */}
        <section className="rounded-lg border border-border bg-card p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-foreground">Profil</h2>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama kamu (opsional)"
              className="flex-1 rounded-lg border border-input bg-background px-4 py-2 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
            <button
              onClick={handleSaveName}
              disabled={saving}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {saved ? 'Tersimpan' : saving ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </section>

        {/* Bookmarks */}
        <section className="rounded-lg border border-border bg-card p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Bookmark className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-foreground">Artikel Disimpan</h2>
            <span className="text-sm text-muted-foreground">({bookmarks.length})</span>
          </div>
          {bookmarks.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Belum ada artikel disimpan. Klik tombol &quot;Simpan&quot; di artikel yang kamu suka.
            </p>
          ) : (
            <div className="space-y-3">
              {bookmarks.map((bm) => {
                const post = getPost(bm.posts);
                if (!post) return null;
                return (
                <Link
                  key={bm.post_id}
                  href={`/artikel/${post.slug}`}
                  className="block group"
                >
                  <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                    {post.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {getCategoryName(post)} - Disimpan {new Date(bm.created_at).toLocaleDateString('id-ID')}
                  </p>
                </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* Reading History */}
        <section className="rounded-lg border border-border bg-card p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-foreground">Riwayat Baca</h2>
            <span className="text-sm text-muted-foreground">({history.length})</span>
          </div>
          {history.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Belum ada riwayat. Mulai baca artikel untuk melihatnya di sini.
            </p>
          ) : (
            <div className="space-y-3">
              {history.map((h) => {
                const post = getPost(h.posts);
                if (!post) return null;
                return (
                <Link
                  key={h.post_id}
                  href={`/artikel/${post.slug}`}
                  className="block group"
                >
                  <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                    {post.title}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-muted-foreground">
                      {getCategoryName(post)}
                    </span>
                    {h.progress > 0 && h.progress < 100 && (
                      <span className="text-xs text-primary">
                        Lanjut baca ({h.progress}%)
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">
                      - {new Date(h.read_at).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* Donations */}
        <section className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-foreground">Riwayat Donasi</h2>
            <span className="text-sm text-muted-foreground">({donations.length})</span>
          </div>
          {donations.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Belum ada donasi. {' '}
              <Link href="/donasi" className="text-primary hover:underline">
                Donasi sekarang
              </Link>
            </p>
          ) : (
            <div className="space-y-3">
              {donations.map((d) => (
                <div key={d.transaction_id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">
                      Rp {d.amount.toLocaleString('id-ID')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {d.payment_type} - {new Date(d.created_at).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    d.status === 'settled'
                      ? 'bg-green-500/10 text-green-600'
                      : d.status === 'failed'
                      ? 'bg-red-500/10 text-red-600'
                      : 'bg-yellow-500/10 text-yellow-600'
                  }`}>
                    {d.status === 'settled' ? 'Berhasil' : d.status === 'failed' ? 'Gagal' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
