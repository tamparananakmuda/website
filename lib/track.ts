declare global {
  interface Window {
    umami?: {
      track: (event: string, properties?: Record<string, unknown>) => void;
    };
  }
}

export function trackEvent(event: string, properties?: Record<string, string | number | boolean | null>) {
  try {
    if (typeof window !== 'undefined' && window.umami?.track) {
      window.umami.track(event, properties);
    }
  } catch {
    // silent fail
  }

  try {
    import('@vercel/analytics').then(({ track }) => {
      track(event, properties);
    });
  } catch {
    // silent fail
  }
}
