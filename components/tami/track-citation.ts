'use client';

/**
 * Track citation clicks from TAMI responses.
 * Uses navigator.sendBeacon for fire-and-forget (works even if page navigates).
 */

interface CitationClickEvent {
  slug: string;
  type: 'article' | 'series' | 'whitepaper';
  messageId: string;
  timestamp: string;
}

const TRACKING_ENDPOINT = '/api/tami/track-click';

/**
 * Track when user clicks a citation link in TAMI response.
 */
export function trackCitationClick(slug: string, type: 'article' | 'series' | 'whitepaper', messageId: string = ''): void {
  const event: CitationClickEvent = {
    slug,
    type,
    messageId,
    timestamp: new Date().toISOString(),
  };

  try {
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(event)], { type: 'application/json' });
      navigator.sendBeacon(TRACKING_ENDPOINT, blob);
    } else {
      fetch(TRACKING_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    // Silent fail — tracking is best-effort
  }
}
