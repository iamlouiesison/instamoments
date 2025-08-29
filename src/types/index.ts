// Export database types
export * from './database.types';

// Event types
export type EventType =
  | 'wedding'
  | 'birthday'
  | 'corporate'
  | 'graduation'
  | 'anniversary'
  | 'celebration'
  | 'other';

export type SubscriptionTier =
  | 'free'
  | 'basic'
  | 'standard'
  | 'premium'
  | 'pro';

export type EventStatus = 'draft' | 'active' | 'ended' | 'archived';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export type ContentStatus = 'pending' | 'approved' | 'rejected' | 'flagged';

// EXIF data interface
export interface ExifData {
  [key: string]: string | number | boolean | undefined;
}

// Event interface
export interface Event {
  id: string;
  name: string;
  description?: string;
  event_date: string;
  event_type: EventType;
  location?: string;
  max_photos: number;
  max_videos: number;
  storage_days: number;
  moderation_enabled: boolean;
  auto_approve_content: boolean;
  qr_code_id: string;
  qr_code_expires_at?: string;
  access_password?: string;
  subscription_tier: SubscriptionTier;
  video_addon_enabled: boolean;
  payment_status: PaymentStatus;
  amount_paid: number;
  payment_reference?: string;
  status: EventStatus;
  host_user_id: string;
  co_hosts: string[];
  total_photos: number;
  total_videos: number;
  unique_contributors: number;
  total_views: number;
  created_at: string;
  updated_at: string;
  activated_at?: string;
  ended_at?: string;
  deleted_at?: string;
}

// Photo interface
export interface Photo {
  id: string;
  event_id: string;
  contributor_id: string;
  filename: string;
  original_filename: string;
  file_size: number;
  mime_type: string;
  storage_path: string;
  thumbnail_path?: string;
  medium_path?: string;
  width?: number;
  height?: number;
  exif_data?: ExifData;
  caption?: string;
  message?: string;
  status: ContentStatus;
  moderation_notes?: string;
  moderated_by?: string;
  moderated_at?: string;
  views: number;
  reports: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

// Video interface
export interface Video {
  id: string;
  event_id: string;
  contributor_id: string;
  filename: string;
  original_filename: string;
  file_size: number;
  mime_type: string;
  duration: number;
  storage_path: string;
  thumbnail_path: string;
  width?: number;
  height?: number;
  fps?: number;
  bitrate?: number;
  greeting_message?: string;
  status: ContentStatus;
  processing_status: 'queued' | 'processing' | 'completed' | 'failed';
  moderation_notes?: string;
  moderated_by?: string;
  moderated_at?: string;
  views: number;
  reports: number;
  created_at: string;
  updated_at: string;
  processing_completed_at?: string;
  deleted_at?: string;
}

// User profile interface
export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  avatar_url?: string;
  language: string;
  timezone: string;
  email_notifications: boolean;
  account_status: 'active' | 'suspended' | 'deleted';
  created_at: string;
  updated_at: string;
  last_login_at?: string;
  deleted_at?: string;
}

// Event contributor interface
export interface EventContributor {
  id: string;
  event_id: string;
  name: string;
  email?: string;
  session_id: string;
  photos_uploaded: number;
  videos_uploaded: number;
  last_upload_at?: string;
  is_blocked: boolean;
  blocked_reason?: string;
  blocked_at?: string;
  blocked_by?: string;
  created_at: string;
  updated_at: string;
}
