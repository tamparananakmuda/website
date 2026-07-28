import { marked } from 'marked';
import { slugify } from '@/lib/utils/slugify';
import { WhitepaperChartRenderer } from '@/components/charts/chart-renderer';

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

interface ContentSegment {
  type: 'markdown' | 'chart';
  content: string | ChartConfig;
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
  const chartBlockRegex = /```chart:(bar|line|pie|stacked-bar|radar|area|grouped-bar|scatter|funnel|treemap)\n([\s\S]*?)```/g;
  let lastIndex = 0;
  let match;

  while ((match = chartBlockRegex.exec(body)) !== null) {
    if (match.index > lastIndex) {
      const md = body.slice(lastIndex, match.index).trim();
      if (md) segments.push({ type: 'markdown', content: md });
    }
    const chartType = match[1] as ChartConfig['type'];
    const jsonStr = match[2].trim();
    const config = parseChartBlock(jsonStr);
    if (config) {
      config.type = chartType;
      segments.push({ type: 'chart', content: config });
    }
    lastIndex = chartBlockRegex.lastIndex;
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
        const rawHtml = marked.parse(seg.content as string, { async: false }) as string;
        const cleanHtml = sanitizeHtml(rawHtml);
        return <div key={i} dangerouslySetInnerHTML={{ __html: cleanHtml }} />;
      })}
    </div>
  );
}
