'use client';

import { lazy, Suspense, createElement, type ComponentType, type ReactNode } from 'react';

function withLoading<P = any>(
  loader: () => Promise<{ [K: string]: ComponentType<P> }>,
  key: string,
  fallback: ReactNode
): ComponentType<P> {
  const LazyComp = lazy(() => loader().then(m => ({ default: m[key] as ComponentType<P> })));
  return function SuspendedComponent(props: P) {
    return (
      <Suspense fallback={fallback}>
        {createElement(LazyComp as any, props as any)}
      </Suspense>
    );
  };
}

export const CommentsSection = withLoading(
  () => import('@/components/comments-section'),
  'CommentsSection',
  <div className="mx-auto max-w-3xl mt-8 h-48 animate-pulse rounded-xl bg-muted/20" />
);

export const ReadingTracker = withLoading(
  () => import('@/components/reading-tracker'),
  'ReadingTracker',
  null
);

export const PremiumGate = withLoading(
  () => import('@/components/premium-gate'),
  'PremiumGate',
  <div className="mx-auto max-w-3xl mt-8 h-32 animate-pulse rounded-xl bg-muted/20" />
);

export const BookmarkButton = withLoading(
  () => import('@/components/bookmark-button'),
  'BookmarkButton',
  null
);

export const ShareButtons = withLoading(
  () => import('@/components/share-buttons'),
  'ShareButtons',
  <div className="mx-auto max-w-3xl mt-8 h-10 animate-pulse rounded-lg bg-muted/20" />
);
