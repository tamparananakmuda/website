'use client';

import { useState, useEffect } from 'react';
import { List } from 'lucide-react';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents({ body }: { body: string }) {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const headingRegex = /^(#{2,3})\s+(.+)$/gm;
    const items: TocItem[] = [];
    let match;

    while ((match = headingRegex.exec(body)) !== null) {
      const level = match[1].length;
      const text = match[2].replace(/[*_`~]/g, '').trim();
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      items.push({ id, text, level });
    }

    setHeadings(items);

    if (items.length > 0) {
      const content = document.querySelector('.prose');
      if (content) {
        const hElements = content.querySelectorAll('h2, h3');
        hElements.forEach((h) => {
          const text = h.textContent?.replace(/[*_`~]/g, '').trim() || '';
          const id = text
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
          h.id = id;
        });
      }
    }
  }, [body]);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0px -80% 0px' }
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 3) return null;

  return (
    <div className="mb-8 rounded-lg border border-border bg-card/50 p-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center gap-2 text-sm font-medium text-foreground"
      >
        <List className="w-4 h-4 text-primary" />
        Daftar Isi
        <span className="ml-auto text-xs text-muted-foreground">
          {isOpen ? 'Tutup' : 'Buka'}
        </span>
      </button>
      {isOpen && (
        <nav className="mt-3 space-y-1">
          {headings.map((heading) => (
            <a
              key={heading.id}
              href={`#${heading.id}`}
              onClick={() => setIsOpen(false)}
              className={`block text-sm transition-colors ${
                heading.level === 3 ? 'ml-4' : ''
              } ${
                activeId === heading.id
                  ? 'text-primary font-medium'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {heading.text}
            </a>
          ))}
        </nav>
      )}
    </div>
  );
}
