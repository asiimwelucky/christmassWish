// src/app/api/analytics/route.ts
// POST /api/analytics — record a privacy-friendly analytics event
import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { checkRateLimit, getAnonymousId } from '@/lib/rate-limit';
import type { EventType } from '@/types';

const ALLOWED_EVENTS: EventType[] = [
  'page_view',
  'wish_creation_started',
  'wish_created',
  'wish_link_opened',
  'whatsapp_share_clicked',
  'native_share_attempted',
  'link_copied',
  'greeting_card_downloaded',
  'skit_started',
  'skit_completed',
  'wish_creation_failed',
];

async function hashSessionKey(key: string): Promise<string> {
  if (!key) return '';
  const salt = process.env.ADMIN_AUTH_SECRET || 'xmas-salt';
  const encoder = new TextEncoder();
  const data = encoder.encode(key + salt);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, 32);
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Rate limiting per anonymous IP hash
    const anonymousId = await getAnonymousId(request);
    const rateLimit = checkRateLimit(`analytics:${anonymousId}`);
    if (!rateLimit.allowed) {
      // Silently discard throttled events — don't reveal rate limit details
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    let body: {
      event_type?: string;
      session_key?: string;
      wish_id?: string;
      campaign_source?: string;
    };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    // Validate event type against strict taxonomy
    if (!body.event_type || !ALLOWED_EVENTS.includes(body.event_type as EventType)) {
      return NextResponse.json({ ok: false, error: 'Invalid event type' }, { status: 400 });
    }

    // Hash the session key server-side — never store raw key
    const sessionKeyHash = body.session_key
      ? await hashSessionKey(body.session_key)
      : null;

    // Validate wish_id if provided (basic UUID-ish check, not exposing internals)
    const wishId =
      typeof body.wish_id === 'string' && body.wish_id.length < 100
        ? body.wish_id
        : null;

    // Only allow controlled campaign_source values
    const ALLOWED_SOURCES = ['direct', 'shared_link', 'whatsapp', 'native_share', 'unknown'];
    const campaignSource =
      typeof body.campaign_source === 'string' &&
      ALLOWED_SOURCES.includes(body.campaign_source)
        ? body.campaign_source
        : null;

    // Insert event via service-role client (clients cannot read analytics_events)
    const supabase = createServiceClient();
    const { error } = await supabase.from('analytics_events').insert({
      event_type: body.event_type,
      session_key_hash: sessionKeyHash,
      wish_id: wishId,
      campaign_source: campaignSource,
    });

    if (error) {
      // Log server-side but return generic OK to client
      console.error('Analytics insert error:', error);
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error('Analytics route error:', err);
    return NextResponse.json({ ok: true }, { status: 200 }); // Silently succeed
  }
}
