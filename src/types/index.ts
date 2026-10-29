// src/types/index.ts
export interface Wish {
  id: string;
  public_token: string;
  display_name: string;
  recipient_type: RecipientType;
  personal_message: string | null;
  template_version: string;
  parent_token: string | null;
  created_at: string;
  expires_at: string;
}

export type RecipientType = 'friend' | 'family' | 'student' | 'teacher' | 'colleague' | 'everyone';

export type EventType =
  | 'page_view'
  | 'wish_creation_started'
  | 'wish_created'
  | 'wish_link_opened'
  | 'whatsapp_share_clicked'
  | 'native_share_attempted'
  | 'link_copied'
  | 'greeting_card_downloaded'
  | 'skit_started'
  | 'skit_completed'
  | 'wish_creation_failed';

export interface AnalyticsEvent {
  event_type: EventType;
  wish_id?: string;
  campaign_source?: string;
}

export interface CampaignConfig {
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
  created_at: string;
  updated_at: string;
}

export interface PublicStats {
  total_wishes_created: number;
  show_public_counter: boolean;
}

export interface AdminStats {
  total_page_views: number;
  unique_visiting_browsers: number;
  unique_creators: number;
  total_wishes_created: number;
  total_whatsapp_shares: number;
  total_native_shares: number;
  total_link_copies: number;
  total_card_downloads: number;
  total_skit_starts: number;
  total_skit_completions: number;
  total_link_opens: number;
}

export interface DailyStats {
  event_date: string;
  event_type: EventType;
  event_count: number;
}

export interface CreateWishInput {
  display_name: string;
  recipient_type?: RecipientType;
  personal_message?: string;
  parent_token?: string;
}

export interface CreateWishResponse {
  success: boolean;
  public_token?: string;
  error?: string;
}
