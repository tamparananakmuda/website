'use client';

import { useState } from 'react';
import Image from 'next/image';

interface FeatureImageProps {
  src: string;
  alt: string;
  fallbackSrc?: string;
}

export function FeatureImage({ src, alt, fallbackSrc }: FeatureImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState(src);
  const [usedFallback, setUsedFallback] = useState(false);

  const handleError = () => {
    if (!usedFallback && fallbackSrc) {
      setImgSrc(fallbackSrc);
      setUsedFallback(true);
      setLoaded(false);
    }
  };

  return (
    <div className="relative mx-auto max-w-3xl mb-12 overflow-hidden rounded-xl">
      <div className="relative aspect-[16/9] w-full bg-muted/20">
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/20">
            <div className="flex gap-1.5 animate-pulse">
              <div className="h-10 w-1.5 rounded-full bg-primary" />
              <div className="h-10 w-1.5 rounded-full bg-primary" />
            </div>
          </div>
        )}
        <Image
          src={imgSrc}
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
          onError={handleError}
        />
      </div>
    </div>
  );
}
