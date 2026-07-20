import { marked } from 'marked';
import { slugify } from '@/lib/utils/slugify';

interface MarkdownContentProps {
  body: string;
}

const renderer = new marked.Renderer();
renderer.heading = function ({ text, depth }) {
  const id = slugify(text);
  if (depth === 1) {
    return '';
  }
  return `<h${depth} id="${id}">${text}</h${depth}>`;
};

marked.use({ renderer });

function sanitizeHtml(html: string): string {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '')
    .replace(/javascript:/gi, '');
}

export function MarkdownContent({ body }: MarkdownContentProps) {
  const rawHtml = marked.parse(body, { async: false }) as string;
  const cleanHtml = sanitizeHtml(rawHtml);

  return (
    <div
      className="prose prose-stone max-w-none dark:prose-invert prose-headings:font-display prose-a:text-primary hover:prose-a:underline prose-blockquote:border-l-primary prose-headings:scroll-mt-20"
      dangerouslySetInnerHTML={{ __html: cleanHtml }}
    />
  );
}
