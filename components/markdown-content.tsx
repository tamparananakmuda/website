import { marked } from 'marked';

interface MarkdownContentProps {
  body: string;
}

function slugify(text: string): string {
  return text
    .replace(/[*_`~]/g, '')
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function MarkdownContent({ body }: MarkdownContentProps) {
  const renderer = new marked.Renderer();
  const originalHeading = renderer.heading.bind(renderer);
  renderer.heading = function ({ text, depth }) {
    const id = slugify(text);
    if (depth === 1) {
      return `<h1>${text}</h1>`;
    }
    return `<h${depth} id="${id}">${text}</h${depth}>`;
  };

  marked.use({ renderer });

  const html = marked.parse(body, { async: false }) as string;

  return (
    <div
      className="prose prose-stone max-w-none dark:prose-invert prose-headings:font-display prose-a:text-primary hover:prose-a:underline prose-blockquote:border-l-primary prose-headings:scroll-mt-20"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
