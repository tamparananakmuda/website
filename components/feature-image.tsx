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
      <div className="relative aspect-[16/9] w-full bg-muted/20">
        {!loaded && (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-muted/40 via-muted/20 to-muted/40" />
        )}
        <Image
          src={src}
          alt={alt}
          fill
          unoptimized
          priority
          loading="eager"
          className={`
            object-cover transition-all duration-700
            ${loaded ? 'opacity-100 blur-0 scale-100' : 'opacity-0 blur-sm scale-105'}
          `}
          sizes="(max-width: 1200px) 100vw, 1024px"
          onLoad={() => setLoaded(true)}
        />
      </div>
    </div>
  );
}
