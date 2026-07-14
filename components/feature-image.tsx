'use client';

import { useState } from 'react';
import Image from 'next/image';

interface FeatureImageProps {
  src: string;
  alt: string;
}

export function FeatureImage({ src, alt }: FeatureImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative mx-auto max-w-4xl mb-12 overflow-hidden rounded-xl">
      <div className="relative aspect-[16/9] w-full bg-muted/30 animate-pulse">
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted-foreground/20 border-t-primary" />
              <span className="text-xs text-muted-foreground/60">Memuat gambar...</span>
            </div>
          </div>
        )}
        <Image
          src={src}
          alt={alt}
          fill
          unoptimized
          priority
          loading="eager"
          className={`
            object-cover transition-opacity duration-500
            ${loaded ? 'opacity-100' : 'opacity-0'}
          `}
          sizes="(max-width: 1200px) 100vw, 1024px"
          onLoad={() => setLoaded(true)}
        />
      </div>
    </div>
  );
}
