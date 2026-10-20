import { useEffect, useRef } from 'react';
import { getOrCreateAnonymousToken } from '../utils/storage';

export function useTracker() {
  const tokenRef = useRef<string>('');

  useEffect(() => {
    tokenRef.current = getOrCreateAnonymousToken();

    // Initial ping
    const sendPing = async () => {
      try {
        await fetch('/api/track/ping', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: tokenRef.current, timestamp: Date.now() }),
        });
      } catch (err) {
        // Silently tolerate if offline or server disconnected
      }
    };

    sendPing();
    const interval = setInterval(sendPing, 30000); // Heartbeat every 30s

    return () => clearInterval(interval);
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
          timestamp: Date.now(),
        }),
      });
    } catch {
      // offline safe
    }
  };

  return { trackApplicationGeneration };
}
