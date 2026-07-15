'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Trash2, Loader2, Sparkles, FileText, Search, Repeat, Image as ImageIcon } from 'lucide-react';

interface ContentItem {
  id: string;
  title: string;
  slug: string | null;
  pillar_id: string | null;
  pov_tag: string | null;
  target_keyword: string | null;
  search_intent: string | null;
  status: string;
  assigned_writer: string | null;
  assigned_editor: string | null;
  due_date: string | null;
  publish_date: string | null;
  cta: string | null;
  target_platforms: string[];
  notes: string | null;
  pillar?: { title: string; slug: string } | null;
}

const statusOptions = [
  { value: 'idea', label: 'Idea' },
  { value: 'research', label: 'Research' },
  { value: 'draft', label: 'Draft' },
  { value: 'review', label: 'Review' },
  { value: 'revision', label: 'Revision' },
  { value: 'fact-check', label: 'Fact-Check' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'published', label: 'Published' },
];

const povOptions = [
  'kontra-narasi', 'refleksi', 'data', 'framework',
  'tamparan', 'riset', 'opini', 'panduan', 'inspirasi',
];

const intentOptions = ['informational', 'comparison', 'transactional'];

const ctaOptions = ['newsletter', 'komunitas', 'donasi', 'none'];

const platformOptions = ['web', 'instagram', 'tiktok', 'newsletter', 'youtube', 'x'];

export default function ContentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [item, setItem] = useState<ContentItem | null>(null);
  const [pillars, setPillars] = useState<{ id: string; title: string; category_title?: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState<'edit' | 'ai'>('edit');
  const [aiLoading, setAiLoading] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState<Record<string, unknown> | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: '',
    pillar_id: '',
    pov_tag: '',
    target_keyword: '',
    search_intent: '',
    status: 'idea',
    due_date: '',
    publish_date: '',
    cta: '',
    notes: '',
    target_platforms: ['web'],
  });

  const fetchItem = useCallback(async () => {
    const res = await fetch('/api/content-queue');
    const data = await res.json();
    const found = (data.items || []).find((i: ContentItem) => i.id === id);
    if (found) {
      setItem(found);
      setForm({
        title: found.title || '',
        pillar_id: found.pillar_id || '',
        pov_tag: found.pov_tag || '',
        target_keyword: found.target_keyword || '',
        search_intent: found.search_intent || '',
        status: found.status || 'idea',
        due_date: found.due_date || '',
        publish_date: found.publish_date || '',
        cta: found.cta || '',
        notes: found.notes || '',
        target_platforms: found.target_platforms || ['web'],
      });
    }
    setLoading(false);
  }, [id]);

  const fetchPillars = useCallback(async () => {
    const res = await fetch('/api/content-queue/pillars');
    const data = await res.json();
    setPillars(data.pillars || []);
  }, []);

  useEffect(() => {
    fetchItem();
    fetchPillars();
  }, [fetchItem, fetchPillars]);

  const handleSave = async () => {
    setSaving(true);
    await fetch(`/api/content-queue/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        pillar_id: form.pillar_id || null,
        pov_tag: form.pov_tag || null,
        search_intent: form.search_intent || null,
        cta: form.cta || null,
        due_date: form.due_date || null,
        publish_date: form.publish_date || null,
      }),
    });
    setSaving(false);
    router.push('/admin/planner');
  };

  const handleDelete = async () => {
    if (!confirm('Hapus item ini?')) return;
    setDeleting(true);
    await fetch(`/api/content-queue/${id}`, { method: 'DELETE' });
    setDeleting(false);
    router.push('/admin/planner');
  };

  const togglePlatform = (platform: string) => {
    setForm((f) => ({
      ...f,
      target_platforms: f.target_platforms.includes(platform)
        ? f.target_platforms.filter((p) => p !== platform)
        : [...f.target_platforms, platform],
    }));
  };

  const callAiTool = async (tool: string, payload: Record<string, unknown>) => {
    setAiLoading(tool);
    setAiError(null);
    setAiResult(null);
    try {
      const res = await fetch(`/api/ai/${tool}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setAiError(data.error || 'Gagal memproses AI');
      } else {
        setAiResult(data);
      }
    } catch {
      setAiError('Gagal terhubung ke AI API');
    }
    setAiLoading(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!item) {
    return <p className="text-muted-foreground">Item tidak ditemukan.</p>;
  }

  return (
    <div className="max-w-2xl">
      <Link href="/admin/planner" className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft size={16} />
        Kembali ke Planner
      </Link>

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Edit Content</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('edit')}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${activeTab === 'edit' ? 'bg-primary text-primary-foreground' : 'border border-border hover:bg-accent'}`}
          >
            Edit
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium ${activeTab === 'ai' ? 'bg-primary text-primary-foreground' : 'border border-border hover:bg-accent'}`}
          >
            <Sparkles size={16} />
            AI Tools
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-2 rounded-lg border border-red-500/30 px-3 py-2 text-sm text-red-500 hover:bg-red-500/10"
          >
            <Trash2 size={16} />
            Hapus
          </button>
        </div>
      </div>

      {activeTab === 'ai' ? (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <button
              onClick={() => callAiTool('ideas', { pillar: item.pillar?.title, count: 5 })}
              disabled={aiLoading !== null}
              className="flex flex-col items-start gap-2 rounded-lg border border-border bg-card p-4 text-left hover:border-primary transition-colors disabled:opacity-50"
            >
              <Sparkles size={18} className="text-primary" />
              <span className="text-sm font-medium">Generate Ideas</span>
              <span className="text-xs text-muted-foreground">5 ide artikel dari pillar ini</span>
            </button>
            <button
              onClick={() => callAiTool('outline', { title: form.title, pillar: item.pillar?.title, pov_tag: form.pov_tag, target_keyword: form.target_keyword })}
              disabled={aiLoading !== null || !form.title}
              className="flex flex-col items-start gap-2 rounded-lg border border-border bg-card p-4 text-left hover:border-primary transition-colors disabled:opacity-50"
            >
              <FileText size={18} className="text-primary" />
              <span className="text-sm font-medium">Generate Outline</span>
              <span className="text-xs text-muted-foreground">Outline + SEO meta dari judul</span>
            </button>
            <button
              onClick={() => callAiTool('keywords', { topic: form.title || form.target_keyword, pillar: item.pillar?.title })}
              disabled={aiLoading !== null || !form.title}
              className="flex flex-col items-start gap-2 rounded-lg border border-border bg-card p-4 text-left hover:border-primary transition-colors disabled:opacity-50"
            >
              <Search size={18} className="text-primary" />
              <span className="text-sm font-medium">Keyword Research</span>
              <span className="text-xs text-muted-foreground">10 keyword suggestions</span>
            </button>
            <button
              onClick={() => callAiTool('repurpose', { post_id: item.id, platforms: form.target_platforms })}
              disabled={aiLoading !== null}
              className="flex flex-col items-start gap-2 rounded-lg border border-border bg-card p-4 text-left hover:border-primary transition-colors disabled:opacity-50"
            >
              <Repeat size={18} className="text-primary" />
              <span className="text-sm font-medium">Repurpose</span>
              <span className="text-xs text-muted-foreground">Ubah artikel jadi multi-platform</span>
            </button>
            <button
              onClick={() => callAiTool('og/generate', { slug: item.slug })}
              disabled={aiLoading !== null || !item.slug}
              className="flex flex-col items-start gap-2 rounded-lg border border-border bg-card p-4 text-left hover:border-primary transition-colors disabled:opacity-50"
            >
              <ImageIcon size={18} className="text-primary" />
              <span className="text-sm font-medium">Regenerate OG Images</span>
              <span className="text-xs text-muted-foreground">Generate & upload ke CDN R2</span>
            </button>
          </div>

          {aiLoading && (
            <div className="flex items-center gap-2 rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
              <Loader2 size={16} className="animate-spin" />
              Memproses {aiLoading}...
            </div>
          )}

          {aiError && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4 text-sm text-red-500">
              {aiError}
            </div>
          )}

          {aiResult && (
            <div className="rounded-lg border border-border bg-card p-4">
              <h3 className="mb-3 text-sm font-semibold">Hasil AI</h3>
              <pre className="max-h-[500px] overflow-auto rounded-md bg-background p-3 text-xs">
                {JSON.stringify(aiResult, null, 2)}
              </pre>
            </div>
          )}

          <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 text-xs text-amber-600">
            <strong>Catatan:</strong> Output AI adalah draft awal. Editor wajib review dan edit sebelum publish.
            Pastikan human signature, fact-check, dan formula Tamparan-Penjelasan-Solusi tetap terpenuhi.
          </div>
        </div>
      ) : (
      <div className="space-y-4 rounded-lg border border-border bg-card p-6">
        <div>
          <label className="mb-1 block text-sm font-medium">Judul</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Pillar</label>
            <select
              value={form.pillar_id}
              onChange={(e) => setForm({ ...form, pillar_id: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            >
              <option value="">Pilih pillar...</option>
              {pillars.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.category_title ? `${p.category_title} > ` : ''}{p.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">POV Tag</label>
            <select
              value={form.pov_tag}
              onChange={(e) => setForm({ ...form, pov_tag: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            >
              <option value="">Pilih POV...</option>
              {povOptions.map((pov) => (
                <option key={pov} value={pov}>{pov}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Target Keyword</label>
            <input
              type="text"
              value={form.target_keyword}
              onChange={(e) => setForm({ ...form, target_keyword: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              placeholder="keyword utama"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Search Intent</label>
            <select
              value={form.search_intent}
              onChange={(e) => setForm({ ...form, search_intent: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            >
              <option value="">Pilih intent...</option>
              {intentOptions.map((intent) => (
                <option key={intent} value={intent}>{intent}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            >
              {statusOptions.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">CTA</label>
            <select
              value={form.cta}
              onChange={(e) => setForm({ ...form, cta: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            >
              <option value="">Pilih CTA...</option>
              {ctaOptions.map((cta) => (
                <option key={cta} value={cta}>{cta}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Due Date</label>
            <input
              type="date"
              value={form.due_date}
              onChange={(e) => setForm({ ...form, due_date: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Publish Date</label>
            <input
              type="date"
              value={form.publish_date}
              onChange={(e) => setForm({ ...form, publish_date: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Target Platforms</label>
          <div className="flex flex-wrap gap-2">
            {platformOptions.map((platform) => (
              <button
                key={platform}
                onClick={() => togglePlatform(platform)}
                className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                  form.target_platforms.includes(platform)
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border text-muted-foreground hover:border-primary'
                }`}
              >
                {platform}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Notes / Brief</label>
          <textarea
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            rows={4}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            placeholder="Brief untuk writer, angle, konteks..."
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Simpan
          </button>
        </div>
      </div>
      )}
    </div>
  );
}
