interface SponsoredBadgeProps {
  sponsorName: string;
  sponsorUrl?: string | null;
  disclosure?: string | null;
}

export function SponsoredBadge({ sponsorName, sponsorUrl, disclosure }: SponsoredBadgeProps) {
  return (
    <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/5 p-4 mb-6">
      <div className="flex items-center gap-2 mb-1">
        <span className="rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-semibold text-yellow-600">
          Konten Sponsored
        </span>
        <span className="text-sm text-muted-foreground">
          Didukung oleh{' '}
          {sponsorUrl ? (
            <a
              href={sponsorUrl}
              target="_blank"
              rel="noopener noreferrer nofollow sponsored"
              className="font-medium text-foreground underline underline-offset-2 hover:text-primary"
            >
              {sponsorName}
            </a>
          ) : (
            <span className="font-medium text-foreground">{sponsorName}</span>
          )}
        </span>
      </div>
      {disclosure && (
        <p className="text-xs text-muted-foreground leading-relaxed">
          {disclosure}
        </p>
      )}
      {!disclosure && (
        <p className="text-xs text-muted-foreground leading-relaxed">
          Konten ini didukung oleh {sponsorName}. TAM tetap menjaga independensi editorial: pemberitahuan sponsored dilakukan transparan, dan opini yang ditulis adalah opini TAM, bukan sponsor.
        </p>
      )}
    </div>
  );
}
