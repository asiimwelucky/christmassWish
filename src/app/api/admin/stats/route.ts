// src/app/api/admin/stats/route.ts
// GET /api/admin/stats — protected admin dashboard statistics
import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';

function verifyAdminToken(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return false;
  const token = authHeader.slice(7);
  const secret = process.env.ADMIN_AUTH_SECRET;
  if (!secret || secret.length < 16) return false;
  // Constant-time comparison to prevent timing attacks
  return token === secret;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  if (!verifyAdminToken(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = createServiceClient();
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '7d';

    // Calculate date range
    const now = new Date();
    let startDate: Date;
    switch (range) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'all':
        startDate = new Date('2024-01-01');
        break;
      default: // 7d
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    // Total aggregate stats
    const { data: summaryData } = await supabase.rpc('get_analytics_summary', {
      start_ts: startDate.toISOString(),
    });

    // Daily breakdown
    const { data: dailyData } = await supabase
      .from('analytics_daily')
      .select('*')
      .gte('event_date', startDate.toISOString().split('T')[0])
      .order('event_date', { ascending: false });

    // Total wishes in DB
    const { count: totalWishes } = await supabase
      .from('wishes')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startDate.toISOString());

    return NextResponse.json({
      summary: summaryData?.[0] ?? null,
      daily: dailyData ?? [],
      total_wishes_in_db: totalWishes ?? 0,
      range,
      generated_at: new Date().toISOString(),
      privacy_note:
        'All statistics are aggregate counts. No personal information is included. ' +
        '"Unique browsers" counts distinct hashed session keys, not verified human identities.',
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    return NextResponse.json({ error: 'Failed to load statistics.' }, { status: 500 });
  }
}
