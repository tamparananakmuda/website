'use client';

import { useEffect } from 'react';

type DeviceType = 'mobile' | 'tablet' | 'desktop';

function getDeviceType(): DeviceType {
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

function trackToUmami(eventName: string, data: Record<string, string>) {
  const w = window as typeof window & {
    umami?: { track: (event: string, data?: Record<string, unknown>) => void };
  };
  w.umami?.track(eventName, data);
}

/**
 * Tracks Core Web Vitals to Umami with device type segmentation.
 * Supplements Vercel SpeedInsights with per-device breakdown in Umami.
 * Requires `web-vitals` package: pnpm add web-vitals
 *
 * Events fired:
 *   - web_vital_lcp  { value, rating, device }
 *   - web_vital_cls  { value, rating, device }
 *   - web_vital_inp  { value, rating, device }
 */
export function WebVitals() {
  useEffect(() => {
    let mounted = true;

    import('web-vitals').then((mod) => {
      if (!mounted) return;

      const device = getDeviceType();

      const track = (name: string) =>
        (metric: { value: number; rating?: string }) => {
          trackToUmami(`web_vital_${name}`, {
            value: String(Math.round(metric.value)),
            rating: String(metric.rating ?? 'unknown'),
            device,
          });
        };

      (mod.onLCP as ((cb: ReturnType<typeof track>) => void) | undefined)?.(track('lcp'));
      (mod.onCLS as ((cb: ReturnType<typeof track>) => void) | undefined)?.(track('cls'));
      (mod.onINP as ((cb: ReturnType<typeof track>) => void) | undefined)?.(track('inp'));
    }).catch(() => {
      // web-vitals not installed — silently skip tracking
    });

    return () => {
      mounted = false;
    };
  }, []);

  return null;
}
