'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link2, Loader2, CheckCircle2, AlertCircle, Trash2, Edit3, Eye } from 'lucide-react';

interface Preview {
  platform: string;
  source_url: string;
  source_id: string | null;
  author_handle: string | null;
  author_name: string | null;
  content_text: string | null;
  media_urls: string[];
  video_url: string | null;
  thumbnail_url: string | null;
  title: string | null;
  excerpt: string | null;
}

interface ImportResult {
  success: boolean;
  preview: Preview;
  id?: number;
  existing_id?: number;
  existing_status?: string;
  message?: string;
  error?: string;
}

const platformLabels: Record<string, string> = {
  x: 'X / Twitter',
  instagram: 'Instagram',
  tiktok: 'TikTok',
  youtube: 'YouTube',
};

const platformColors: Record<string, string> = {
  x: 'bg-gray-900 text-white',
  instagram: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
  tiktok: 'bg-black text-white',
  youtube: 'bg-red-600 text-white',
};

export default function ImportPage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleImport(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/social/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  }

  async function handlePublish(id: number) {
    const res = await fetch('/api/social/posts', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: 'published' }),
    });
    if (res.ok) {
      setResult((prev) => prev ? { ...prev, preview: { ...prev.preview } } : prev);
      window.location.reload();
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Hapus konten ini?')) return;
    const res = await fetch(`/api/social/posts?id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      setResult(null);
      setUrl('');
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground mb-2">Import Konten Sosial</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Tempel URL dari X, Instagram, TikTok, atau YouTube. Sistem akan auto-preview konten.
      </p>

      <form onSubmit={handleImport} className="space-y-3 mb-8">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              placeholder="https://x.com/tamparananakmuda/status/..."
              className="w-full rounded-lg border border-input bg-background pl-10 pr-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            {loading ? 'Mengambil...' : 'Import'}
          </button>
        </div>
        <p className="text-xs text-muted-foreground">
          Didukung: X/Twitter threads, Instagram posts/reels, TikTok videos, YouTube videos/shorts
        </p>
      </form>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive mb-6">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <AnimatePresence>
        {result && result.preview && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-lg border border-border bg-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${platformColors[result.preview.platform] || 'bg-gray-500 text-white'}`}>
                  {platformLabels[result.preview.platform] || result.preview.platform}
                </span>
                {result.existing_id && (
                  <span className="text-xs text-yellow-600">
                    Sudah ada (status: {result.existing_status})
                  </span>
                )}
                {result.id && !result.existing_id && (
                  <span className="text-xs text-green-600">Tersimpan sebagai draft</span>
                )}
              </div>
              {result.id && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePublish(result.id!)}
                    className="flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
                  >
                    <Eye className="w-3 h-3" /> Publish
                  </button>
                  <button
                    onClick={() => handleDelete(result.id!)}
                    className="flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-3 h-3" /> Hapus
                  </button>
                </div>
              )}
            </div>

            {/* Preview content */}
            <div className="space-y-4">
              {result.preview.thumbnail_url && (
                <img
                  src={result.preview.thumbnail_url}
                  alt={result.preview.title || 'Preview'}
                  className="w-full max-h-80 object-cover rounded-lg"
                />
              )}

              {result.preview.video_url && (
                <div className="rounded-lg overflow-hidden bg-black aspect-video flex items-center justify-center">
                  {result.preview.platform === 'youtube' && (
                    <iframe
                      src={result.preview.video_url}
                      className="w-full h-full"
                      allowFullScreen
                    />
                  )}
                  {result.preview.platform === 'tiktok' && (
                    <iframe
                      src={result.preview.video_url}
                      className="w-full h-full"
                      allowFullScreen
                    />
                  )}
                </div>
              )}

              {result.preview.author_name && (
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-medium">
                    {result.preview.author_name[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{result.preview.author_name}</p>
                    {result.preview.author_handle && (
                      <p className="text-xs text-muted-foreground">@{result.preview.author_handle}</p>
                    )}
                  </div>
                </div>
              )}

              {result.preview.title && (
                <h3 className="font-semibold text-foreground">{result.preview.title}</h3>
              )}

              {result.preview.content_text && (
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{result.preview.content_text}</p>
              )}

              {result.preview.excerpt && !result.preview.content_text && (
                <p className="text-sm text-muted-foreground">{result.preview.excerpt}</p>
              )}

              {result.preview.media_urls.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {result.preview.media_urls.slice(0, 4).map((img, i) => (
                    <img key={i} src={img} alt="" className="rounded-lg w-full h-40 object-cover" />
                  ))}
                </div>
              )}

              <a
                href={result.preview.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
              >
                <Link2 className="w-3 h-3" /> Lihat post asli
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
