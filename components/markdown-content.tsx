import { marked } from 'marked';

interface MarkdownContentProps {
  body: string;
}

export function MarkdownContent({ body }: MarkdownContentProps) {
  const html = marked.parse(body, { async: false }) as string;

  return (
    <div
      className="prose prose-stone max-w-none dark:prose-invert prose-headings:font-serif prose-a:text-primary hover:prose-a:underline prose-blockquote:border-l-primary"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
