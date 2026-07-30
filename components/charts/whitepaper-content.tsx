import { marked } from 'marked';
import { slugify } from '@/lib/utils/slugify';
import dynamic from 'next/dynamic';
import { InteractiveCalculator } from '@/components/whitepaper/interactive-calculator';
import { ComparisonTable } from '@/components/whitepaper/comparison-table';
import { NerdBox } from '@/components/whitepaper/nerd-box';

const WhitepaperChartRenderer = dynamic(() => import('@/components/charts/chart-renderer').then(m => m.WhitepaperChartRenderer), {
  loading: () => <div className="h-64 animate-pulse rounded-lg bg-muted/30" />,
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

const renderer = new marked.Renderer();
renderer.heading = function ({ text, depth }) {
  const id = slugify(text);
  if (depth === 1) return '';
  return `<h${depth} id="${id}">${text}</h${depth}>`;
};
marked.use({ renderer });

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

export function WhitepaperContent({ body }: { body: string }) {
  const segments = splitContent(body);

  return (
    <div className="prose prose-stone max-w-none dark:prose-invert prose-headings:font-display prose-a:text-primary hover:prose-a:underline prose-blockquote:border-l-primary prose-headings:scroll-mt-20">
      {segments.map((seg, i) => {
        if (seg.type === 'chart') {
          return <WhitepaperChartRenderer key={i} config={seg.content as ChartConfig} />;
        }
        if (seg.type === 'calculator') {
          return <InteractiveCalculator key={i} config={seg.content as CalculatorConfig} />;
        }
        if (seg.type === 'comparison') {
          return <ComparisonTable key={i} config={seg.content as ComparisonConfig} />;
        }
        if (seg.type === 'nerd') {
          return <NerdBox key={i} config={seg.content as NerdBoxConfig} />;
        }
        const rawHtml = marked.parse(seg.content as string, { async: false }) as string;
        const cleanHtml = sanitizeHtml(rawHtml);
        return <div key={i} dangerouslySetInnerHTML={{ __html: cleanHtml }} />;
      })}
    </div>
  );
}
