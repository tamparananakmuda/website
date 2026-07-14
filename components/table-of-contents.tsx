'use client';

import { useState, useEffect } from 'react';
import { List, ChevronDown, ChevronUp } from 'lucide-react';
import { slugify } from '@/lib/utils/slugify';
import { cn } from '@/lib/utils';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents({ body }: { body: string }) {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const headingRegex = /^(#{2,3})\s+(.+)$/gm;
    const items: TocItem[] = [];
    let match;

    while ((match = headingRegex.exec(body)) !== null) {
      const level = match[1].length;
      const text = match[2].replace(/[*_`~]/g, '').trim();
      const id = slugify(text);
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

  // Track the count for primary headings (h2)
  let h2Count = 0;

  return (
    <div className="mb-16 overflow-hidden rounded-xl border border-black/5 dark:border-white/[0.08] bg-card dark:bg-[#0A0A0A] shadow-xl dark:shadow-2xl transition-colors duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded border border-black/10 dark:border-white/[0.1] bg-black/[0.02] dark:bg-white/[0.02]">
            <List className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-[0.25em] text-foreground dark:text-foreground uppercase">
              Daftar Isi
            </h3>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1 opacity-60">
              Navigasi Pembahasan
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:block h-px w-12 bg-black/10 dark:bg-white/[0.1]" />
          <div className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full transition-transform duration-300",
            isOpen ? "rotate-180 bg-black/[0.05] dark:bg-white/[0.05]" : "bg-primary/10"
          )}>
            <ChevronDown className={cn("h-4 w-4", isOpen ? "text-muted-foreground" : "text-primary")} />
          </div>
        </div>
      </button>

      <div
        className={cn(
          "grid transition-all duration-500 ease-in-out",
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <nav className="relative flex flex-col px-6 pb-8 pt-2">
            {/* The vertical track line */}
            <div className="absolute left-[39px] top-0 bottom-8 w-px bg-black/5 dark:bg-white/[0.05]" />
            
            {headings.map((heading) => {
              const isActive = activeId === heading.id;
              const isH2 = heading.level === 2;
              if (isH2) h2Count++;
              
              return (
                <a
                  key={heading.id}
                  href={`#${heading.id}`}
                  className={cn(
                    "group relative flex items-start gap-4 py-3 transition-all duration-300",
                    !isH2 && "pl-8 opacity-80",
                    isActive && "opacity-100"
                  )}
                >
                  {/* Indicator Section */}
                  <div className="relative z-10 flex h-7 w-7 shrink-0 items-center justify-center">
                    {isH2 ? (
                      <div className={cn(
                        "flex h-full w-full items-center justify-center rounded-sm border transition-all duration-300 text-[10px] font-bold tabular-nums",
                        isActive 
                          ? "bg-primary border-primary text-white scale-110 shadow-[0_0_15px_rgba(209,58,58,0.3)]" 
                          : "bg-background dark:bg-[#0A0A0A] border-black/10 dark:border-white/[0.1] text-muted-foreground group-hover:border-primary/50 group-hover:text-primary"
                      )}>
                        {h2Count.toString().padStart(2, '0')}
                      </div>
                    ) : (
                      <div className={cn(
                        "h-1.5 w-1.5 rounded-full transition-all duration-300",
                        isActive ? "bg-primary scale-125" : "bg-black/[0.2] dark:bg-white/[0.2] group-hover:bg-primary/50"
                      )} />
                    )}
                  </div>

                  {/* Text Section */}
                  <div className="flex flex-col pt-0.5">
                    <span className={cn(
                      "text-sm transition-all duration-300 leading-snug",
                      isActive 
                        ? "text-foreground dark:text-foreground font-bold translate-x-1" 
                        : "text-muted-foreground group-hover:text-foreground"
                    )}>
                      {heading.text}
                    </span>
                    {isActive && (
                      <div className="mt-1 h-0.5 w-8 bg-primary/30" />
                    )}
                  </div>
                  
                  {/* Subtle background highlight on hover/active */}
                  <div className={cn(
                    "absolute -inset-x-2 inset-y-1 -z-0 rounded-lg transition-colors duration-300",
                    isActive ? "bg-black/[0.02] dark:bg-white/[0.03]" : "group-hover:bg-black/[0.01] dark:group-hover:bg-white/[0.01]"
                  )} />
                </a>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
