import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin - Import Konten Sosial',
  description: 'Import konten sosial media ke TAM',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-display font-bold text-foreground">TAM Admin</span>
            <nav className="flex gap-4 text-sm">
              <a href="/admin/import" className="text-primary font-medium">Import Sosial</a>
              <a href="/admin/posts" className="text-muted-foreground hover:text-foreground">Kelola Posts</a>
            </nav>
          </div>
          <a href="/" className="text-sm text-muted-foreground hover:text-foreground">Lihat Situs</a>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">{children}</div>
    </div>
  );
}
