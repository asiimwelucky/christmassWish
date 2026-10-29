// src/lib/supabase/server.ts
// SERVER ONLY — uses service-role key. Never import this in client components.
import { createClient } from '@supabase/supabase-js';
import { createMockServiceClient } from './mock-store';

export function createServiceClient(): any {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const isConfigured =
    url &&
    key &&
    !url.includes('your-project') &&
    url.startsWith('https://');

  if (!isConfigured) {
    return createMockServiceClient();
  }

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
