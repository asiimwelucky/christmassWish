// src/lib/analytics.ts
// Client-side analytics event tracking — privacy-friendly first-party
// Never sends personal information; uses server-side hashed session keys.

'use client';

import type { EventType } from '@/types';

const SESSION_KEY = 'pi_xmas_sk';
const SESSION_DURATION_MS = 30 * 60 * 1000; // 30 minutes

interface StoredSession {
  key: string;
  expires: number;
}

/**
 * Returns a short-lived random session key stored in sessionStorage.
 * This key is sent to the server where it is hashed before storage.
 * It is NOT used for cross-site tracking; it only helps deduplicate
 * events within a single browser tab session.
 */
function getSessionKey(): string {
  try {
    const stored = sessionStorage.getItem(SESSION_KEY);
    if (stored) {
      const parsed: StoredSession = JSON.parse(stored);
      if (Date.now() < parsed.expires) {
        return parsed.key;
      }
    }
    // Generate new session key
    const key = Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
    const session: StoredSession = { key, expires: Date.now() + SESSION_DURATION_MS };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return key;
  } catch {
    // sessionStorage unavailable (e.g., private mode) — return empty string
    return '';
  }
}

interface TrackEventOptions {
  wish_id?: string;
  campaign_source?: string;
}

/**
 * Send an analytics event to the server-side endpoint.
 * Failures are silent to avoid disrupting the user experience.
 */
export async function trackEvent(
  event_type: EventType,
  options: TrackEventOptions = {}
): Promise<void> {
  try {
    const session_key = getSessionKey();
    await fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_type,
        session_key,
        ...options,
      }),
      // Best-effort — do not await or retry on failure
      keepalive: true,
    });
  } catch {
    // Silently ignore analytics errors
  }
}
