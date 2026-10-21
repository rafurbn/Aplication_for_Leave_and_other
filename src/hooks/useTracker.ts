import { useEffect, useRef } from 'react';
import { io, type Socket } from 'socket.io-client';
import { getOrCreateAnonymousToken } from '../utils/storage';

export function useTracker() {
  const tokenRef = useRef<string>('');

  useEffect(() => {
    const token = getOrCreateAnonymousToken();
    tokenRef.current = token;
    let socket: Socket | undefined;
    let disposed = false;

    const ping = () => {
      fetch('/api/track/ping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      }).catch(() => undefined);
    };

    // Registration must succeed before a presence socket is opened, so anonymous
    // visitors are counted by the server rather than by a self-declared id.
    fetch('/api/track/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then(async (response) => {
        if (!response.ok || disposed) return;
        const data = (await response.json()) as { counted?: boolean };
        if (data.counted === false) return;
        socket = io({ auth: { token }, reconnectionAttempts: 5, reconnectionDelayMax: 20000 });
        ping();
      })
      .catch(() => undefined);

    const interval = window.setInterval(ping, 30000);

    return () => {
      disposed = true;
      socket?.close();
      window.clearInterval(interval);
    };
  }, []);

  const trackApplicationGeneration = async (formatId: string, formatTitle: string) => {
    try {
      await fetch('/api/track/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: tokenRef.current || getOrCreateAnonymousToken(),
          formatId,
          formatTitle,
        }),
      });
    } catch {
      // offline safe
    }
  };

  return { trackApplicationGeneration };
}
