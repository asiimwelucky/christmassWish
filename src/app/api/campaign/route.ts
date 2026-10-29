// src/app/api/campaign/route.ts
// GET /api/campaign — return public campaign stats (show_public_counter + wish count)
import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';


export async function GET(): Promise<NextResponse> {
  try {
    const supabase = createServiceClient();

    // Get campaign config
    const { data: config } = await supabase
      .from('campaign_config')
      .select('campaign_name, show_public_counter, campaign_status')
      .eq('id', '00000000-0000-0000-0000-000000000001')
      .single();

    const showCounter = config?.show_public_counter ?? true;
    const isActive = config?.campaign_status === 'active';

    if (!showCounter) {
      return NextResponse.json({
        show_public_counter: false,
        total_wishes_created: null,
        campaign_name: config?.campaign_name ?? 'Paradigm Institute Christmas Wishes',
        is_active: isActive,
      });
    }

    // Count total wishes
    const { count } = await supabase
      .from('analytics_events')
      .select('*', { count: 'exact', head: true })
      .eq('event_type', 'wish_created');

    return NextResponse.json({
      show_public_counter: true,
      total_wishes_created: count ?? 0,
      campaign_name: config?.campaign_name ?? 'Paradigm Institute Christmas Wishes',
      is_active: isActive,
    });
  } catch (err) {
    console.error('Campaign stats error:', err);
    return NextResponse.json({
      show_public_counter: false,
      total_wishes_created: null,
      campaign_name: 'Paradigm Institute Christmas Wishes',
      is_active: true,
    });
  }
}
