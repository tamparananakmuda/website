'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Eye, EyeOff, ExternalLink, Loader2 } from 'lucide-react';

interface SocialPost {
  id: number;
  platform: string;
  source_url: string;
  author_name: string | null;
  title: string | null;
  excerpt: string | null;
  thumbnail_url: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

const platformLabels: Record<string, string> = {
  x: 'X',
  instagram: 'IG',
  tiktok: 'TT',
  youtube: 'YT',
};

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchPosts();
  }, [filter]);

  async function fetchPosts() {
    setLoading(true);
    const res = await fetch(`/api/social/posts?status=${filter}&limit=50`);
    const data = await res.json();
    setPosts(data.posts || []);
    setLoading(false);
  }

  async function updateStatus(id: number, status: string) {
    await fetch('/api/social/posts', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    fetchPosts();
  }

  async function deletePost(id: number) {
    if (!confirm('Hapus konten ini?')) return;
    await fetch(`/api/social/posts?id=${id}`, { method: 'DELETE' });
    fetchPosts();
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Kelola Konten Sosial</h1>
        <a
          href="/admin/import"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Import Baru
        </a>
      </div>

      <div className="flex gap-2 mb-6">
        {['all', 'draft', 'published', 'archived'].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
              filter === s
                ? 'bg-primary text-primary-foreground'
                : 'border border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            {s === 'all' ? 'Semua' : s === 'draft' ? 'Draft' : s === 'published' ? 'Published' : 'Archived'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : posts.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">Belum ada konten.</p>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <motion.div
              key={post.id}
              layout
              className="flex items-center gap-4 rounded-lg border border-border bg-card p-4"
            >
              {post.thumbnail_url ? (
                <img
                  src={post.thumbnail_url}
                  alt=""
                  className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-secondary flex items-center justify-center text-xs font-bold text-muted-foreground flex-shrink-0">
                  {platformLabels[post.platform] || post.platform}
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs rounded bg-secondary px-1.5 py-0.5 font-medium">
                    {platformLabels[post.platform] || post.platform}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    post.status === 'published'
                      ? 'bg-green-500/10 text-green-600'
                      : post.status === 'archived'
                      ? 'bg-gray-500/10 text-gray-500'
                      : 'bg-yellow-500/10 text-yellow-600'
                  }`}>
                    {post.status}
                  </span>
                </div>
                <p className="font-medium text-foreground truncate">
                  {post.title || post.excerpt || 'Tanpa judul'}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {post.author_name || 'Unknown'} - {new Date(post.created_at).toLocaleDateString('id-ID')}
                </p>
              </div>

              <div className="flex gap-1 flex-shrink-0">
                {post.status !== 'published' ? (
                  <button
                    onClick={() => updateStatus(post.id, 'published')}
                    className="p-2 rounded-md hover:bg-secondary text-muted-foreground hover:text-green-600"
                    title="Publish"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => updateStatus(post.id, 'draft')}
                    className="p-2 rounded-md hover:bg-secondary text-muted-foreground hover:text-yellow-600"
                    title="Unpublish"
                  >
                    <EyeOff className="w-4 h-4" />
                  </button>
                )}
                <a
                  href={post.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-md hover:bg-secondary text-muted-foreground"
                  title="Lihat asli"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  onClick={() => deletePost(post.id)}
                  className="p-2 rounded-md hover:bg-secondary text-muted-foreground hover:text-destructive"
                  title="Hapus"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
