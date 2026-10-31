import 'server-only';

import { createServiceClient } from '@/lib/supabase/server';
import type { Wish } from '@/types';

export async function getWishByToken(token: string): Promise<Wish | null> {
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from('wishes')
      .select(
        'id, public_token, display_name, recipient_type, personal_message, template_version, parent_token, created_at, expires_at',
      )
      .eq('public_token', token)
      .single();

    if (error || !data) return null;
    return data;
  } catch (error) {
    console.error('Failed to load wish server-side:', error);
    return null;
  }
}
