// src/lib/supabase/mock-store.ts
// In-memory / local fallback store when live Supabase credentials are not yet configured.
// Ensures zero-setup development, previewing, and graceful offline resilience.

import { randomUUID } from 'crypto';
import type { Wish, EventType } from '@/types';

interface StoredWish extends Wish {}

interface StoredEvent {
  id: string;
  event_type: EventType;
  session_key_hash: string | null;
  wish_id: string | null;
  campaign_source: string | null;
  created_at: string;
}

// Global singleton to survive HMR in development
declare global {
  // eslint-disable-next-line no-var
  var __asmart_mock_store: {
    wishes: Map<string, StoredWish>;
    events: StoredEvent[];
    campaignConfig: {
      id: string;
      campaign_name: string;
      campaign_status: 'active' | 'inactive' | 'paused';
      main_message: string;
      skit_version: string;
      start_at: string;
      end_at: string | null;
      show_public_counter: boolean;
      announcement: string | null;
      privacy_notice: string;
      retention_days: number;
    };
  } | undefined;
}

if (!globalThis.__asmart_mock_store) {
  const wishes = new Map<string, StoredWish>();
  
  // Seed a demo wish
  const demoWish: StoredWish = {
    id: 'demo-wish-1',
    public_token: 'asmart-welcome',
    display_name: 'ASMART.TEC Family',
    recipient_type: 'everyone',
    personal_message: 'Wishing you peace, great health, and tremendous success in all your studies and life dreams this festive season!',
    template_version: 'v1',
    parent_token: null,
    created_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
  };
  wishes.set(demoWish.public_token, demoWish);

  globalThis.__asmart_mock_store = {
    wishes,
    events: [
      {
        id: 'seed-event-1',
        event_type: 'wish_created',
        session_key_hash: 'seed-hash',
        wish_id: 'asmart-welcome',
        campaign_source: 'direct',
        created_at: new Date().toISOString(),
      },
    ],
    campaignConfig: {
      id: '00000000-0000-0000-0000-000000000001',
      campaign_name: 'ASMART.TEC Christmas Wishes',
      campaign_status: 'active',
      main_message: 'Spreading joy and goodwill across Kagadi and beyond!',
      skit_version: 'v1',
      start_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      end_at: null,
      show_public_counter: true,
      announcement: '🎄 Season Greetings from ASMART.TEC! Create and send your custom wish today.',
      privacy_notice: 'We collect only anonymous usage statistics — no registration required.',
      retention_days: 90,
    },
  };
}

export const mockStore = globalThis.__asmart_mock_store;

/**
 * Creates a Supabase-compatible mock query builder
 */
export function createMockServiceClient() {
  return {
    from(table: string) {
      const filters: Array<(row: any) => boolean> = [];
      let isHead = false;
      let isExactCount = false;
      let orderField: string | null = null;
      let orderAscending = true;

      const builder = {
        select(fields = '*', options?: { count?: string; head?: boolean }) {
          if (options?.head) isHead = true;
          if (options?.count === 'exact') isExactCount = true;
          return builder;
        },
        eq(field: string, value: any) {
          filters.push((row) => row[field] === value);
          return builder;
        },
        gte(field: string, value: any) {
          filters.push((row) => row[field] >= value);
          return builder;
        },
        order(field: string, options?: { ascending?: boolean }) {
          orderField = field;
          orderAscending = options?.ascending ?? true;
          return builder;
        },
        async single() {
          const res = await builder.then();
          if (res.error) return { data: null, error: res.error };
          return { data: res.data?.[0] ?? null, error: null };
        },
        insert(payload: any) {
          let insertedData: any = null;

          if (table === 'wishes') {
            const token = payload.public_token || 'xmas_' + Math.random().toString(36).substring(2, 12);
            const newWish: StoredWish = {
              id: randomUUID(),
              public_token: token,
              display_name: payload.display_name,
              recipient_type: payload.recipient_type || 'everyone',
              personal_message: payload.personal_message || null,
              template_version: payload.template_version || 'v1',
              parent_token: payload.parent_token || null,
              created_at: new Date().toISOString(),
              expires_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
            };
            mockStore.wishes.set(token, newWish);
            insertedData = newWish;
          } else if (table === 'analytics_events') {
            const newEvent: StoredEvent = {
              id: randomUUID(),
              event_type: payload.event_type,
              session_key_hash: payload.session_key_hash || null,
              wish_id: payload.wish_id || null,
              campaign_source: payload.campaign_source || null,
              created_at: new Date().toISOString(),
            };
            mockStore.events.push(newEvent);
            insertedData = newEvent;
          } else {
            insertedData = payload;
          }

          const insertChain = {
            select(fields?: string) {
              return {
                single: async () => ({
                  data: insertedData ? (fields === 'public_token' ? { public_token: insertedData.public_token } : insertedData) : null,
                  error: null,
                }),
                then(resolve?: (val: any) => any) {
                  const res = { data: insertedData ? [insertedData] : [], error: null };
                  return resolve ? resolve(res) : Promise.resolve(res);
                },
              };
            },
            single: async () => ({
              data: insertedData,
              error: null,
            }),
            then(resolve?: (val: any) => any) {
              const res = { data: insertedData ? [insertedData] : [], error: null };
              return resolve ? resolve(res) : Promise.resolve(res);
            },
          };

          return insertChain;
        },
        then(resolve?: (val: any) => any) {
          let rows: any[] = [];
          if (table === 'campaign_config') {
            rows = [mockStore.campaignConfig];
          } else if (table === 'wishes') {
            rows = Array.from(mockStore.wishes.values());
          } else if (table === 'analytics_events') {
            rows = [...mockStore.events];
          } else if (table === 'analytics_daily') {
            const dateMap = new Map<string, { event_date: string; event_type: EventType; event_count: number }>();
            for (const ev of mockStore.events) {
              const day = ev.created_at.split('T')[0];
              const key = `${day}_${ev.event_type}`;
              const curr = dateMap.get(key) || { event_date: day, event_type: ev.event_type, event_count: 0 };
              curr.event_count++;
              dateMap.set(key, curr);
            }
            rows = Array.from(dateMap.values());
          }

          for (const fn of filters) {
            rows = rows.filter(fn);
          }

          if (orderField) {
            rows.sort((a, b) => {
              if (a[orderField!] < b[orderField!]) return orderAscending ? -1 : 1;
              if (a[orderField!] > b[orderField!]) return orderAscending ? 1 : -1;
              return 0;
            });
          }

          const count = isExactCount ? rows.length : undefined;
          const result = {
            data: isHead ? null : rows,
            count,
            error: null,
          };
          return resolve ? resolve(result) : Promise.resolve(result);
        },
      };

      return builder;
    },
    async rpc(funcName: string, args?: any) {
      if (funcName === 'get_analytics_summary') {
        const events = mockStore.events;
        const total = (type: EventType) => events.filter((e) => e.event_type === type).length;
        const uniqueSessions = new Set(events.map((e) => e.session_key_hash).filter(Boolean)).size;
        const uniqueCreators = new Set(
          events.filter((e) => e.event_type === 'wish_created').map((e) => e.session_key_hash).filter(Boolean)
        ).size;

        return {
          data: [
            {
              total_page_views: total('page_view'),
              unique_visiting_browsers: uniqueSessions,
              unique_creators: uniqueCreators,
              total_wishes_created: mockStore.wishes.size,
              total_whatsapp_shares: total('whatsapp_share_clicked'),
              total_native_shares: total('native_share_attempted'),
              total_link_copies: total('link_copied'),
              total_card_downloads: total('greeting_card_downloaded'),
              total_skit_starts: total('skit_started'),
              total_skit_completions: total('skit_completed'),
              total_link_opens: total('wish_link_opened'),
            },
          ],
          error: null,
        };
      }
      return { data: null, error: null };
    },
  };
}
