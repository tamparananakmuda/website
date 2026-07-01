export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} TAMPARAN ANAK MUDA. Tamparan yang kamu butuhkan.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="/newsletter" className="hover:text-foreground">
              Newsletter
            </a>
            <a href="https://instagram.com/tamparananakmuda" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
              Instagram
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
