'use client';

import React from 'react';
import { marked } from 'marked';
import dynamic from 'next/dynamic';
import { InteractiveCalculator } from '@/components/whitepaper/interactive-calculator';
import { ComparisonTable } from '@/components/whitepaper/comparison-table';
import { NerdBox } from '@/components/whitepaper/nerd-box';

const WhitepaperChartRenderer = dynamic(() => import('@/components/charts/chart-renderer').then(m => m.WhitepaperChartRenderer), {
  ssr: false,
  loading: () => <div className="h-48 animate-pulse rounded-lg bg-neutral-900 border border-neutral-800/40 flex items-center justify-center text-xs text-neutral-500">Mempersiapkan grafik...</div>,
});

interface ChartConfig {
  type: 'bar' | 'line' | 'pie' | 'stacked-bar' | 'radar' | 'area' | 'grouped-bar' | 'scatter' | 'funnel' | 'treemap';
  title?: string;
  subtitle?: string;
  source?: string;
  height?: number;
  data: any[];
  yLabel?: string;
  xLabel?: string;
  horizontal?: boolean;
  series?: { key: string; name: string; color?: string }[];
  series1Label?: string;
  series2Label?: string;
  unit?: string;
  donut?: boolean;
}

interface CalculatorConfig {
  type: 'inflation-impact' | 'farmer-share';
  title?: string;
  subtitle?: string;
  source?: string;
}

interface ComparisonRow {
  metric: string;
  values: (string | number)[];
  lowerIsBetter?: boolean;
  unit?: string;
  isText?: boolean;
}

interface ComparisonConfig {
  title?: string;
  subtitle?: string;
  source?: string;
  highlightColumn?: string;
  columns: string[];
  rows: ComparisonRow[];
}

interface NerdBoxConfig {
  title?: string;
  content: string;
}

interface ContentSegment {
  type: 'markdown' | 'chart' | 'calculator' | 'comparison' | 'nerd';
  content: string | ChartConfig | CalculatorConfig | ComparisonConfig | NerdBoxConfig;
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

function parseChartBlock(block: string): ChartConfig | null {
  try {
    const json = JSON.parse(block);
    if (!json.data) return null;
    return json as ChartConfig;
  } catch {
    return null;
  }
}

function splitContent(body: string): ContentSegment[] {
  const segments: ContentSegment[] = [];
  const blockRegex = /```(chart:(?:bar|line|pie|stacked-bar|radar|area|grouped-bar|scatter|funnel|treemap)|calc:(?:inflation-impact|farmer-share)|comparison|nerd)\n([\s\S]*?)```/g;
  let lastIndex = 0;
  let match;

  while ((match = blockRegex.exec(body)) !== null) {
    if (match.index > lastIndex) {
      const md = body.slice(lastIndex, match.index).trim();
      if (md) segments.push({ type: 'markdown', content: md });
    }
    const blockType = match[1];
    const jsonStr = match[2].trim();

    if (blockType.startsWith('chart:')) {
      const chartType = blockType.split(':')[1] as ChartConfig['type'];
      const config = parseChartBlock(jsonStr);
      if (config) {
        config.type = chartType;
        segments.push({ type: 'chart', content: config });
      }
    } else if (blockType.startsWith('calc:')) {
      const calcType = blockType.split(':')[1] as CalculatorConfig['type'];
      try {
        const config = JSON.parse(jsonStr) as CalculatorConfig;
        config.type = calcType;
        segments.push({ type: 'calculator', content: config });
      } catch { /* skip invalid */ }
    } else if (blockType === 'comparison') {
      try {
        const config = JSON.parse(jsonStr) as ComparisonConfig;
        if (config.columns && config.rows) {
          segments.push({ type: 'comparison', content: config });
        }
      } catch { /* skip invalid */ }
    } else if (blockType === 'nerd') {
      try {
        const config = JSON.parse(jsonStr) as NerdBoxConfig;
        if (config.content) {
          segments.push({ type: 'nerd', content: config });
        }
      } catch { /* skip invalid */ }
    }

    lastIndex = blockRegex.lastIndex;
  }

  if (lastIndex < body.length) {
    const md = body.slice(lastIndex).trim();
    if (md) segments.push({ type: 'markdown', content: md });
  }

  return segments;
}

// Custom marked renderer to rewrite/format internal links correctly
const customRenderer = new marked.Renderer();
const originalLink = customRenderer.link.bind(customRenderer);
customRenderer.link = function(token) {
  let href = token.href || '';
  
  // Normalize links by removing absolute protocol/domain prefixes
  try {
    if (href.startsWith('http://') || href.startsWith('https://')) {
      const url = new URL(href);
      // If it is a local link or has our domain, extract the pathname
      if (url.hostname === 'localhost' || url.hostname === '127.0.0.1' || url.hostname.endsWith('tamparananakmuda.com')) {
        href = url.pathname + url.search + url.hash;
      }
    }
  } catch (e) {
    console.error('Failed to parse link URL:', e);
  }

  // Ensure relative internal links to articles or series are properly formatted
  if (href.startsWith('/') && !href.startsWith('/artikel/') && !href.startsWith('/seri/') && !href.startsWith('/whitepaper/') && !href.startsWith('/donasi') && !href.startsWith('/tentang')) {
    const cleanPath = href.replace(/^\//, '');
    // If it's a simple flat path (e.g. /link-artikel), rewrite to /artikel/link-artikel
    if (!cleanPath.includes('/')) {
      href = `/artikel/${cleanPath}`;
    }
  }

  // Handle click on relative links to prevent full page reload
  return `<a href="${href}" class="text-primary hover:underline font-bold" data-internal="true">${token.text}</a>`;
};
marked.use({ renderer: customRenderer });

export const ChatContentRenderer: React.FC<{ content: string }> = ({ content }) => {
  const segments = splitContent(content);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      if (anchor && anchor.getAttribute('data-internal') === 'true') {
        const href = anchor.getAttribute('href');
        if (href && href.startsWith('/')) {
          e.preventDefault();
          // Dispatch a custom event or navigate using window.location if necessary,
          // but since Next.js standard routing is expected, we can push state
          // and dispatch a custom navigation event, or let standard navigation proceed if pushState is enough.
          window.history.pushState({}, '', href);
          // Trigger Next.js router popstate event to notify Next.js of path change
          const popStateEvent = new PopStateEvent('popstate', { state: {} });
          window.dispatchEvent(popStateEvent);
        }
      }
    };

    container.addEventListener('click', handleLinkClick);
    return () => {
      container.removeEventListener('click', handleLinkClick);
    };
  }, []);

  return (
    <div ref={containerRef} className="space-y-4 max-w-none text-xs text-neutral-300 leading-relaxed">
      {segments.map((seg, i) => {
        if (seg.type === 'chart') {
          return (
            <div key={i} className="my-4 overflow-hidden rounded-2xl border border-neutral-900 bg-neutral-950/80 p-2">
              <WhitepaperChartRenderer config={seg.content as ChartConfig} />
            </div>
          );
        }
        if (seg.type === 'calculator') {
          return (
            <div key={i} className="my-4">
              <InteractiveCalculator config={seg.content as CalculatorConfig} />
            </div>
          );
        }
        if (seg.type === 'comparison') {
          return (
            <div key={i} className="my-4">
              <ComparisonTable config={seg.content as ComparisonConfig} />
            </div>
          );
        }
        if (seg.type === 'nerd') {
          return (
            <div key={i} className="my-4">
              <NerdBox config={seg.content as NerdBoxConfig} />
            </div>
          );
        }

        const rawHtml = marked.parse(seg.content as string, { async: false }) as string;
        const cleanHtml = sanitizeHtml(rawHtml);

        return (
          <div
            key={i}
            className="prose prose-stone dark:prose-invert prose-xs max-w-none hover:prose-a:underline prose-a:text-primary prose-blockquote:border-l-primary leading-relaxed"
            dangerouslySetInnerHTML={{ __html: cleanHtml }}
          />
        );
      })}
    </div>
  );
};
