import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';
import { slugify } from '@/lib/utils/slugify';

interface MarkdownContentProps {
  body: string;
}

const renderer = new marked.Renderer();
renderer.heading = function ({ text, depth }) {
  const id = slugify(text);
  if (depth === 1) {
    return `<h1>${text}</h1>`;
  }
  return `<h${depth} id="${id}">${text}</h${depth}>`;
};

marked.use({ renderer });

export function MarkdownContent({ body }: MarkdownContentProps) {
  const rawHtml = marked.parse(body, { async: false }) as string;
  const cleanHtml = DOMPurify.sanitize(rawHtml, {
    ALLOWED_TAGS: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'br', 'hr', 'strong', 'em', 'del', 'mark',
      'a', 'ul', 'ol', 'li',
      'blockquote', 'code', 'pre',
      'img', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'div', 'span',
    ],
    ALLOWED_ATTR: ['href', 'title', 'src', 'alt', 'id', 'class', 'target', 'rel'],
  });

  return (
    <div
      className="prose prose-stone max-w-none dark:prose-invert prose-headings:font-display prose-a:text-primary hover:prose-a:underline prose-blockquote:border-l-primary prose-headings:scroll-mt-20"
      dangerouslySetInnerHTML={{ __html: cleanHtml }}
    />
  );
}
