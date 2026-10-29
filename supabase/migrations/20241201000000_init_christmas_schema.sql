-- ============================================================================
-- Paradigm Institute Christmas Wishes & Interactive Skit Campaign Schema
-- Kagadi, Uganda
-- ============================================================================

-- Enable pgcrypto for UUID generation if not already enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. Campaign Configuration Table
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.campaign_config (
    id UUID PRIMARY KEY DEFAULT '00000000-0000-0000-0000-000000000001'::uuid,
    campaign_name TEXT NOT NULL DEFAULT 'Paradigm Institute Christmas Wishes',
    campaign_status TEXT NOT NULL DEFAULT 'active' CHECK (campaign_status IN ('active', 'inactive', 'paused')),
    main_message TEXT NOT NULL DEFAULT 'Merry Christmas & Happy New Year from Paradigm Institute, Kagadi!',
    skit_version TEXT NOT NULL DEFAULT 'v1',
    start_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    end_at TIMESTAMPTZ NULL,
    show_public_counter BOOLEAN NOT NULL DEFAULT true,
    announcement TEXT NULL,
    privacy_notice TEXT NOT NULL DEFAULT 'We collect only anonymous usage statistics — no email, no phone, no registration required. Data is retained for 90 days.',
    retention_days INTEGER NOT NULL DEFAULT 90,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed single campaign record if not present
INSERT INTO public.campaign_config (
    id, campaign_name, campaign_status, main_message, skit_version, show_public_counter
) VALUES (
    '00000000-0000-0000-0000-000000000001'::uuid,
    'Paradigm Institute Christmas Wishes 2024',
    'active',
    'Spreading the joy and spirit of Christmas across Kagadi and beyond!',
    'v1',
    true
) ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 2. Wishes Table (Viral Greeting Tokens)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.wishes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    public_token TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(10), 'hex'),
    display_name TEXT NOT NULL,
    recipient_type TEXT NOT NULL DEFAULT 'everyone' CHECK (recipient_type IN ('friend', 'family', 'student', 'teacher', 'colleague', 'everyone')),
    personal_message TEXT NULL,
    template_version TEXT NOT NULL DEFAULT 'v1',
    parent_token TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '90 days')
);

CREATE INDEX IF NOT EXISTS idx_wishes_public_token ON public.wishes (public_token);
CREATE INDEX IF NOT EXISTS idx_wishes_parent_token ON public.wishes (parent_token);
CREATE INDEX IF NOT EXISTS idx_wishes_created_at ON public.wishes (created_at);

-- ----------------------------------------------------------------------------
-- 3. Privacy-Friendly Analytics Events Table
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL CHECK (event_type IN (
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
        'wish_creation_failed'
    )),
    session_key_hash TEXT NULL,
    wish_id TEXT NULL,
    campaign_source TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON public.analytics_events (event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON public.analytics_events (created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_session_hash ON public.analytics_events (session_key_hash);

-- ----------------------------------------------------------------------------
-- 4. Daily Analytics Aggregates View / Materialized View
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW public.analytics_daily AS
SELECT
    DATE_TRUNC('day', created_at)::DATE AS event_date,
    event_type,
    COUNT(*)::INTEGER AS event_count
FROM public.analytics_events
GROUP BY DATE_TRUNC('day', created_at)::DATE, event_type
ORDER BY event_date DESC;

-- ----------------------------------------------------------------------------
-- 5. Stored Procedure: Analytics Summary
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_analytics_summary(start_ts TIMESTAMPTZ)
RETURNS TABLE (
    total_page_views BIGINT,
    unique_visiting_browsers BIGINT,
    unique_creators BIGINT,
    total_wishes_created BIGINT,
    total_whatsapp_shares BIGINT,
    total_native_shares BIGINT,
    total_link_copies BIGINT,
    total_card_downloads BIGINT,
    total_skit_starts BIGINT,
    total_skit_completions BIGINT,
    total_link_opens BIGINT
) LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(*) FILTER (WHERE event_type = 'page_view') AS total_page_views,
        COUNT(DISTINCT session_key_hash) FILTER (WHERE session_key_hash IS NOT NULL) AS unique_visiting_browsers,
        COUNT(DISTINCT session_key_hash) FILTER (WHERE event_type = 'wish_created' AND session_key_hash IS NOT NULL) AS unique_creators,
        COUNT(*) FILTER (WHERE event_type = 'wish_created') AS total_wishes_created,
        COUNT(*) FILTER (WHERE event_type = 'whatsapp_share_clicked') AS total_whatsapp_shares,
        COUNT(*) FILTER (WHERE event_type = 'native_share_attempted') AS total_native_shares,
        COUNT(*) FILTER (WHERE event_type = 'link_copied') AS total_link_copies,
        COUNT(*) FILTER (WHERE event_type = 'greeting_card_downloaded') AS total_card_downloads,
        COUNT(*) FILTER (WHERE event_type = 'skit_started') AS total_skit_starts,
        COUNT(*) FILTER (WHERE event_type = 'skit_completed') AS total_skit_completions,
        COUNT(*) FILTER (WHERE event_type = 'wish_link_opened') AS total_link_opens
    FROM public.analytics_events
    WHERE created_at >= start_ts;
END;
$$;

-- ----------------------------------------------------------------------------
-- 6. Row Level Security (RLS)
-- ----------------------------------------------------------------------------
ALTER TABLE public.campaign_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Campaign config: Anyone can view public details
CREATE POLICY "Public campaign config read"
    ON public.campaign_config
    FOR SELECT
    USING (true);

-- Wishes: Public can read active wishes by token
CREATE POLICY "Public wishes read"
    ON public.wishes
    FOR SELECT
    USING (expires_at > now());

-- Wishes: Anonymous wish creation allowed
CREATE POLICY "Public wishes insert"
    ON public.wishes
    FOR INSERT
    WITH CHECK (true);

-- Analytics events: Anonymous append-only
CREATE POLICY "Public analytics insert"
    ON public.analytics_events
    FOR INSERT
    WITH CHECK (true);

