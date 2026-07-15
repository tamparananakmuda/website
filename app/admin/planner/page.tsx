'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Plus, Loader2, Calendar } from 'lucide-react';

interface ContentItem {
  id: string;
  title: string;
  status: string;
  pov_tag: string | null;
  target_keyword: string | null;
  due_date: string | null;
  publish_date: string | null;
  pillar?: { title: string; slug: string } | null;
}

const statusColumns = [
  { key: 'idea', label: 'Idea', color: 'border-slate-500' },
  { key: 'research', label: 'Research', color: 'border-blue-500' },
  { key: 'draft', label: 'Draft', color: 'border-amber-500' },
  { key: 'review', label: 'Review', color: 'border-orange-500' },
  { key: 'revision', label: 'Revision', color: 'border-red-500' },
  { key: 'fact-check', label: 'Fact-Check', color: 'border-purple-500' },
  { key: 'scheduled', label: 'Scheduled', color: 'border-cyan-500' },
  { key: 'published', label: 'Published', color: 'border-green-500' },
];

const povColors: Record<string, string> = {
  'kontra-narasi': 'bg-red-500/10 text-red-500',
  'refleksi': 'bg-blue-500/10 text-blue-500',
  'data': 'bg-green-500/10 text-green-500',
  'framework': 'bg-purple-500/10 text-purple-500',
  'tamparan': 'bg-rose-500/10 text-rose-500',
  'riset': 'bg-indigo-500/10 text-indigo-500',
  'opini': 'bg-amber-500/10 text-amber-500',
  'panduan': 'bg-cyan-500/10 text-cyan-500',
  'inspirasi': 'bg-pink-500/10 text-pink-500',
};

export default function PlannerDashboard() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPillar, setNewPillar] = useState('');
  const [newPov, setNewPov] = useState('');
  const [pillars, setPillars] = useState<{ id: string; title: string; category_title?: string }[]>([]);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/content-queue');
    const data = await res.json();
    setItems(data.items || []);
    setLoading(false);
  }, []);

  const fetchPillars = useCallback(async () => {
    const res = await fetch('/api/content-queue/pillars');
    const data = await res.json();
    setPillars(data.pillars || []);
  }, []);

  useEffect(() => {
    fetchItems();
    fetchPillars();
  }, [fetchItems, fetchPillars]);

  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    await fetch('/api/content-queue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: newTitle,
        pillar_id: newPillar || null,
        pov_tag: newPov || null,
        status: 'idea',
      }),
    });
    setNewTitle('');
    setNewPillar('');
    setNewPov('');
    setShowCreate(false);
    fetchItems();
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    await fetch(`/api/content-queue/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    fetchItems();
  };

  const itemsByStatus = (status: string) => items.filter((i) => i.status === status);

  const stats = {
    total: items.length,
    published: items.filter((i) => i.status === 'published').length,
    inPipeline: items.filter((i) => i.status !== 'published' && i.status !== 'idea').length,
    ideas: items.filter((i) => i.status === 'idea').length,
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Content Planner</h1>
          <p className="text-sm text-muted-foreground mt-1">Pipeline editorial TAM</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/planner/calendar"
            className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-accent"
          >
            <Calendar size={16} />
            Kalender
          </Link>
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Plus size={16} />
            Ide Baru
          </button>
        </div>
      </div>

      {showCreate && (
        <div className="mb-6 rounded-lg border border-border bg-card p-4">
          <h3 className="mb-3 font-medium">Tambah Ide Artikel</h3>
          <div className="grid gap-3 sm:grid-cols-3">
            <input
              type="text"
              placeholder="Judul artikel"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="col-span-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
            <select
              value={newPillar}
              onChange={(e) => setNewPillar(e.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
            >
              <option value="">Pilih pillar...</option>
              {pillars.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.category_title ? `${p.category_title} > ` : ''}{p.title}
                </option>
              ))}
            </select>
            <select
              value={newPov}
              onChange={(e) => setNewPov(e.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
            >
              <option value="">Pilih POV...</option>
              <option value="kontra-narasi">Kontra-narasi</option>
              <option value="refleksi">Refleksi</option>
              <option value="data">Data</option>
              <option value="framework">Framework</option>
              <option value="tamparan">Tamparan</option>
              <option value="riset">Riset</option>
              <option value="opini">Opini</option>
              <option value="panduan">Panduan</option>
              <option value="inspirasi">Inspirasi</option>
            </select>
            <button
              onClick={handleCreate}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Simpan
            </button>
          </div>
        </div>
      )}

      <div className="mb-6 grid grid-cols-4 gap-4">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-2xl font-bold">{stats.total}</p>
          <p className="text-xs text-muted-foreground">Total</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-2xl font-bold text-green-500">{stats.published}</p>
          <p className="text-xs text-muted-foreground">Published</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-2xl font-bold text-amber-500">{stats.inPipeline}</p>
          <p className="text-xs text-muted-foreground">In Pipeline</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-2xl font-bold text-blue-500">{stats.ideas}</p>
          <p className="text-xs text-muted-foreground">Ideas</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-4 xl:grid-cols-8 overflow-x-auto">
          {statusColumns.map((col) => {
            const colItems = itemsByStatus(col.key);
            return (
              <div key={col.key} className={`min-w-[200px] rounded-lg border-t-2 ${col.color} bg-card p-3`}>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold">{col.label}</h3>
                  <span className="text-xs text-muted-foreground">{colItems.length}</span>
                </div>
                <div className="space-y-2">
                  {colItems.map((item) => (
                    <Link
                      key={item.id}
                      href={`/admin/planner/${item.id}`}
                      className="block rounded-md border border-border bg-background p-3 text-sm hover:border-primary transition-colors"
                    >
                      <p className="font-medium leading-snug">{item.title}</p>
                      {item.pillar && (
                        <p className="mt-1 text-xs text-muted-foreground">{item.pillar.title}</p>
                      )}
                      {item.pov_tag && (
                        <span className={`mt-2 inline-block rounded-full px-2 py-0.5 text-xs ${povColors[item.pov_tag] || 'bg-gray-500/10 text-gray-500'}`}>
                          {item.pov_tag}
                        </span>
                      )}
                      {item.publish_date && (
                        <p className="mt-2 text-xs text-cyan-500">
                          {new Date(item.publish_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                        </p>
                      )}
                    </Link>
                  ))}
                  {colItems.length === 0 && (
                    <p className="text-xs text-muted-foreground py-4 text-center">Kosong</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
