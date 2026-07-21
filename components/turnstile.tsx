'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: Record<string, unknown>) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
    __turnstileScriptPromise?: Promise<void>;
  }
}

interface TurnstileProps {
  onVerify: (token: string) => void;
  onExpire?: () => void;
  className?: string;
}

function loadTurnstileScript(): Promise<void> {
  if (window.__turnstileScriptPromise) {
    return window.__turnstileScriptPromise;
  }

  window.__turnstileScriptPromise = new Promise<void>((resolve, reject) => {
    if (window.turnstile) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.onload = () => {
      if (window.turnstile) {
        resolve();
      } else {
        const interval = setInterval(() => {
          if (window.turnstile) {
            clearInterval(interval);
            resolve();
          }
        }, 100);
        setTimeout(() => {
          clearInterval(interval);
          if (!window.turnstile) reject(new Error('Turnstile API timeout'));
        }, 5000);
      }
    };
    script.onerror = () => reject(new Error('Failed to load Turnstile script'));
    document.head.appendChild(script);
  });

  return window.__turnstileScriptPromise;
}

export function Turnstile({ onVerify, onExpire, className }: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const onVerifyRef = useRef(onVerify);
  const onExpireRef = useRef(onExpire);
  const isMountedRef = useRef(true);

  useEffect(() => {
    onVerifyRef.current = onVerify;
    onExpireRef.current = onExpire;
  }, [onVerify, onExpire]);

  useEffect(() => {
    isMountedRef.current = true;

    const renderWidget = () => {
      if (!isMountedRef.current || !containerRef.current || !window.turnstile) return;
      const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
      const siteKey = isLocalhost
        ? '1x00000000000000000000AA'
        : process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
      if (!siteKey) {
        console.error('[Turnstile] NEXT_PUBLIC_TURNSTILE_SITE_KEY not set');
        return;
      }

      if (widgetIdRef.current) {
        try { window.turnstile.remove(widgetIdRef.current); } catch {}
        widgetIdRef.current = null;
      }

      try {
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          theme: 'auto',
          callback: (token: string) => onVerifyRef.current(token),
          'expired-callback': () => onExpireRef.current?.(),
          'error-callback': (errorCode: string | number) => {
            console.error('[Turnstile] error:', errorCode);
            return true;
          },
        });
      } catch (err) {
        console.error('[Turnstile] render failed:', err);
      }
    };

    let cancelled = false;

    loadTurnstileScript()
      .then(() => {
        if (!cancelled) renderWidget();
      })
      .catch((err) => {
        console.error('[Turnstile] script load failed:', err);
      });

    return () => {
      isMountedRef.current = false;
      cancelled = true;
      if (widgetIdRef.current && window.turnstile) {
        try { window.turnstile.remove(widgetIdRef.current); } catch {}
        widgetIdRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ minHeight: '65px' }}
    />
  );
}
