'use client';

import { useState } from 'react';
import { ChevronRight, FlaskConical } from 'lucide-react';
import { marked } from 'marked';

interface NerdBoxConfig {
  title?: string;
  content: string;
}

function sanitizeHtml(html: string): string {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '')
    .replace(/javascript:/gi, '');
}

export function NerdBox({ config }: { config: NerdBoxConfig }) {
  const [open, setOpen] = useState(false);
  const title = config.title || 'Nerd Box';
  const rawHtml = marked.parse(config.content, { async: false }) as string;
  const cleanHtml = sanitizeHtml(rawHtml);

  return (
    <div className="my-6 overflow-hidden rounded-xl border border-border bg-card">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-background/30 md:px-6"
        aria-expanded={open}
      >
        <FlaskConical size={16} className="flex-shrink-0 text-amber-500/70" />
        <span className="flex-1 font-display text-sm font-bold uppercase tracking-wider text-muted-foreground">
          {title}
        </span>
        <ChevronRight
          size={16}
          className={`flex-shrink-0 text-muted-foreground transition-transform duration-200 ${
            open ? 'rotate-90' : ''
          }`}
        />
      </button>
      {open && (
        <div className="border-t border-border px-5 py-4 md:px-6 md:py-5">
          <div
            className="prose prose-sm prose-stone max-w-none dark:prose-invert prose-headings:font-display prose-a:text-primary prose-blockquote:border-l-primary/50"
            dangerouslySetInnerHTML={{ __html: cleanHtml }}
          />
        </div>
      )}
    </div>
  );
}
