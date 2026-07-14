import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { MarkdownContent } from '@/components/markdown-content';
import { TableOfContents } from '@/components/table-of-contents';
import { ShareButtons } from '@/components/share-buttons';
import { BreadcrumbSchema } from '@/components/schema/breadcrumb-schema';
import { FileText, Clock, Download } from 'lucide-react';

interface WhitepaperPageProps {
  params: { slug: string };
}

export const revalidate = 60;

export async function generateMetadata({
  params,
}: WhitepaperPageProps): Promise<Metadata> {
  const supabase = createClient();
  const { data: wp } = await supabase
    .from('whitepapers')
    .select('title, subtitle, summary, slug')
    .eq('slug', params.slug)
    .eq('status', 'published')
    .single();

  if (!wp) {
    return { title: 'Whitepaper Tidak Ditemukan' };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tamparananakmuda.com';
  const url = `${siteUrl}/whitepaper/${wp.slug}`;

  return {
    title: wp.title,
    description: wp.summary || wp.subtitle || undefined,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      locale: 'id_ID',
      url,
      title: wp.title,
      description: wp.summary || wp.subtitle || undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: wp.title,
      description: wp.summary || wp.subtitle || undefined,
    },
  };
}

export default async function WhitepaperDetailPage({ params }: WhitepaperPageProps) {
  const supabase = createClient();

  const { data: wp } = await supabase
    .from('whitepapers')
    .select('*')
    .eq('slug', params.slug)
    .eq('status', 'published')
    .single();

  if (!wp) {
    notFound();
  }

  const { data: related } = await supabase
    .from('whitepapers')
    .select('slug, title, subtitle, summary, reading_time, tags, cover_image_url')
    .eq('status', 'published')
    .neq('id', wp.id)
    .order('published_at', { ascending: false })
    .limit(3);

  return (
    <article className="container mx-auto px-4 py-12">
      <BreadcrumbSchema
        items={[
          { name: 'Home', href: '/' },
          { name: 'Whitepaper', href: '/whitepaper' },
          { name: wp.title, href: `/whitepaper/${wp.slug}` },
        ]}
      />

      <header className="mx-auto max-w-3xl">
        <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
          <FileText className="w-4 h-4" />
          <span>Whitepaper</span>
          <span>&middot;</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {wp.reading_time} menit baca
          </span>
        </div>

        <h1 className="mb-4 text-3xl font-bold leading-tight md:text-4xl">
          {wp.title}
        </h1>

        {wp.subtitle && (
          <p className="mb-6 text-lg text-muted-foreground">{wp.subtitle}</p>
        )}

        {wp.summary && (
          <p className="mb-8 rounded-xl border border-border bg-card p-4 text-sm leading-relaxed text-muted-foreground">
            {wp.summary}
          </p>
        )}

        <div className="mb-8 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {wp.author}
            {wp.published_at && (
              <span className="ml-2">
                &middot; {new Date(wp.published_at).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            )}
          </div>
          {wp.download_url && (
            <a
              href={wp.download_url}
              className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </a>
          )}
        </div>

        {wp.tags && wp.tags.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            {wp.tags.map((tag: string) => (
              <span
                key={tag}
                className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      <div className="mx-auto max-w-3xl">
        <TableOfContents body={wp.body} />
        <MarkdownContent body={wp.body} />
      </div>

      <div className="mx-auto max-w-3xl mt-8 pt-6 border-t border-border">
        <ShareButtons title={wp.title} slug={wp.slug} />
      </div>

      {related && related.length > 0 && (
        <div className="mx-auto max-w-3xl mt-12">
          <h2 className="mb-6 text-xl font-bold text-foreground">
            Whitepaper lainnya
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/whitepaper/${r.slug}`}
                className="group rounded-lg border border-border bg-card p-4 hover:border-primary/50 transition-colors"
              >
                <h3 className="mb-2 text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {r.title}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {r.summary || r.subtitle}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
