import { cn } from '@/lib/utils';

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-muted/50', className)}
      {...props}
    />
  );
}

function ArticleCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border p-4">
      <Skeleton className="aspect-video w-full rounded-lg" />
      <Skeleton className="h-3 w-20 rounded" />
      <Skeleton className="h-5 w-full rounded" />
      <Skeleton className="h-5 w-3/4 rounded" />
      <Skeleton className="h-3 w-full rounded" />
      <Skeleton className="h-3 w-5/6 rounded" />
      <div className="mt-2 flex items-center gap-2">
        <Skeleton className="h-3 w-16 rounded" />
        <Skeleton className="h-3 w-12 rounded" />
      </div>
    </div>
  );
}

function ArticleCardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <ArticleCardSkeleton key={i} />
      ))}
    </div>
  );
}

function ArticlePageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Skeleton className="mb-6 aspect-video w-full max-w-4xl rounded-xl" />
      <div className="mx-auto max-w-3xl">
        <Skeleton className="mb-3 h-3 w-24 rounded" />
        <Skeleton className="mb-3 h-10 w-full rounded" />
        <Skeleton className="mb-2 h-10 w-5/6 rounded" />
        <Skeleton className="mb-8 h-5 w-full rounded" />
        <Skeleton className="mb-2 h-5 w-full rounded" />
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className={`h-4 rounded ${i % 4 === 3 ? 'w-2/3' : 'w-full'}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

function SeriesCardSkeleton() {
  return (
    <div className="rounded-xl border border-border p-5">
      <Skeleton className="mb-3 h-5 w-3/4 rounded" />
      <Skeleton className="mb-2 h-3 w-full rounded" />
      <Skeleton className="mb-4 h-3 w-4/5 rounded" />
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <Skeleton className="h-3 w-3 rounded-full" />
            <Skeleton className="h-3 flex-1 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

function TableRowSkeleton({ cols = 4 }: { cols?: number }) {
  return (
    <div className="flex items-center gap-4 border-b border-border py-3">
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton
          key={i}
          className={`h-4 rounded ${i === 0 ? 'flex-1' : i === cols - 1 ? 'w-16' : 'w-24'}`}
        />
      ))}
    </div>
  );
}

function AdminTableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div>
      {Array.from({ length: rows }).map((_, i) => (
        <TableRowSkeleton key={i} cols={cols} />
      ))}
    </div>
  );
}

function StatCardSkeleton() {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <Skeleton className="mb-3 h-3 w-20 rounded" />
      <Skeleton className="h-8 w-16 rounded" />
    </div>
  );
}

function StatCardGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <StatCardSkeleton key={i} />
      ))}
    </div>
  );
}

export {
  Skeleton,
  ArticleCardSkeleton,
  ArticleCardGridSkeleton,
  ArticlePageSkeleton,
  SeriesCardSkeleton,
  TableRowSkeleton,
  AdminTableSkeleton,
  StatCardSkeleton,
  StatCardGridSkeleton,
};
