'use client';

import { useState, useEffect } from 'react';
import { Bell, BellOff, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export function PushNotificationToggle() {
  const [supported, setSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window) {
      setSupported(true);
      setPermission(Notification.permission);
    }
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setLoggedIn(!!user);
    });
  }, []);

  async function handleToggle() {
    if (!loggedIn) {
      window.location.href = '/masuk';
      return;
    }

    setLoading(true);
    try {
      if (subscribed) {
        await fetch('/api/push/subscribe', { method: 'DELETE' });
        setSubscribed(false);
      } else {
        const permission = await Notification.requestPermission();
        setPermission(permission);
        if (permission !== 'granted') return;

        const reg = await navigator.serviceWorker.ready;
        const sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
        });

        await fetch('/api/push/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subscription: sub }),
        });
        setSubscribed(true);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }

  if (!supported) return null;

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : subscribed ? (
        <Bell className="w-4 h-4" />
      ) : (
        <BellOff className="w-4 h-4" />
      )}
      {subscribed ? 'Notifikasi aktif' : 'Aktifkan notifikasi'}
    </button>
  );
}
