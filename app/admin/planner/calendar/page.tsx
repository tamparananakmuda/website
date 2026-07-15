'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

interface ContentItem {
  id: string;
  title: string;
  status: string;
  pov_tag: string | null;
  publish_date: string | null;
  pillar?: { title: string; slug: string } | null;
}

const statusColors: Record<string, string> = {
  'idea': 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  'research': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'draft': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  'review': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'revision': 'bg-red-500/20 text-red-400 border-red-500/30',
  'fact-check': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'scheduled': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  'published': 'bg-green-500/20 text-green-400 border-green-500/30',
};

const monthNames = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

export default function CalendarPage() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  const fetchItems = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/content-queue');
    const data = await res.json();
    setItems(data.items || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const itemsByDate = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return items.filter((i) => i.publish_date === dateStr);
  };

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Kalender Publikasi</h1>
          <p className="text-sm text-muted-foreground mt-1">Jadwal artikel per bulan</p>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={prevMonth} className="rounded-lg border border-border p-2 hover:bg-accent">
            <ChevronLeft size={18} />
          </button>
          <span className="text-lg font-semibold min-w-[180px] text-center">
            {monthNames[month]} {year}
          </span>
          <button onClick={nextMonth} className="rounded-lg border border-border p-2 hover:bg-accent">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map((day) => (
              <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, i) => {
              if (day === null) return <div key={i} />;
              const dayItems = itemsByDate(day);
              const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();
              return (
                <div
                  key={i}
                  className={`min-h-[100px] rounded-md border p-2 ${
                    isToday ? 'border-primary bg-primary/5' : 'border-border bg-background'
                  }`}
                >
                  <span className={`text-xs ${isToday ? 'font-bold text-primary' : 'text-muted-foreground'}`}>
                    {day}
                  </span>
                  <div className="mt-1 space-y-1">
                    {dayItems.map((item) => (
                      <Link
                        key={item.id}
                        href={`/admin/planner/${item.id}`}
                        className={`block rounded px-1.5 py-1 text-xs border ${statusColors[item.status] || statusColors['idea']} hover:opacity-80 transition-opacity`}
                      >
                        <p className="truncate font-medium">{item.title}</p>
                        {item.pillar && (
                          <p className="truncate opacity-70">{item.pillar.title}</p>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
