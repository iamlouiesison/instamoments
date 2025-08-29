-- Migration: 001_initial_schema.sql
-- Description: Complete database schema for InstaMoments application
-- Includes: Core tables, RLS policies, functions, indexes, and storage setup

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_cron";

-- Create updated_at function for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- CORE TABLES
-- ============================================================================

-- profiles table (extends Supabase Auth)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,

  -- User preferences
  language TEXT DEFAULT 'en-PH',
  timezone TEXT DEFAULT 'Asia/Manila',
  email_notifications BOOLEAN DEFAULT true,

  -- Account status
  account_status TEXT CHECK (account_status IN ('active', 'suspended', 'deleted')) DEFAULT 'active',

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ
);

-- events table
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Event Details
  name TEXT NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  event_type TEXT CHECK (event_type IN ('wedding', 'birthday', 'corporate', 'graduation', 'anniversary', 'celebration', 'other')) DEFAULT 'celebration',
  location TEXT,

  -- Event Configuration
  max_photos INTEGER NOT NULL DEFAULT 30,
  max_videos INTEGER NOT NULL DEFAULT 0,
  storage_days INTEGER NOT NULL DEFAULT 3,
  moderation_enabled BOOLEAN DEFAULT false,
  auto_approve_content BOOLEAN DEFAULT true,

  -- QR Code & Access
  qr_code_id TEXT UNIQUE NOT NULL,
  qr_code_expires_at TIMESTAMPTZ,
  access_password TEXT,

  -- Subscription & Payment
  subscription_tier TEXT CHECK (subscription_tier IN ('free', 'basic', 'standard', 'premium', 'pro')) DEFAULT 'free',
  video_addon_enabled BOOLEAN DEFAULT false,
  payment_status TEXT CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')) DEFAULT 'pending',
  amount_paid DECIMAL(10,2) DEFAULT 0,
  payment_reference TEXT,

  -- Event Status
  status TEXT CHECK (status IN ('draft', 'active', 'ended', 'archived')) DEFAULT 'draft',

  -- Owner & Management
  host_user_id UUID REFERENCES profiles(id) NOT NULL,
  co_hosts UUID[] DEFAULT '{}',

  -- Analytics
  total_photos INTEGER DEFAULT 0,
  total_videos INTEGER DEFAULT 0,
  unique_contributors INTEGER DEFAULT 0,
  total_views INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  activated_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,

  -- Soft delete
  deleted_at TIMESTAMPTZ
);

-- event_contributors table
CREATE TABLE event_contributors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,

  -- Contributor Information (no account required)
  name TEXT NOT NULL,
  email TEXT,
  session_id TEXT NOT NULL,

  -- Contribution Limits & Tracking
  photos_uploaded INTEGER DEFAULT 0,
  videos_uploaded INTEGER DEFAULT 0,
  last_upload_at TIMESTAMPTZ,

  -- Status & Moderation
  is_blocked BOOLEAN DEFAULT false,
  blocked_reason TEXT,
  blocked_at TIMESTAMPTZ,
  blocked_by UUID REFERENCES profiles(id),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- photos table
CREATE TABLE photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  contributor_id UUID REFERENCES event_contributors(id) NOT NULL,

  -- File Information
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,

  -- Storage URLs (Supabase Storage)
  storage_path TEXT NOT NULL,
  thumbnail_path TEXT,
  medium_path TEXT,

  -- Image Metadata
  width INTEGER,
  height INTEGER,
  exif_data JSONB,

  -- Content & Messaging
  caption TEXT,
  message TEXT,

  -- Status & Moderation
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected', 'flagged')) DEFAULT 'approved',
  moderation_notes TEXT,
  moderated_by UUID REFERENCES profiles(id),
  moderated_at TIMESTAMPTZ,

  -- Engagement
  views INTEGER DEFAULT 0,
  reports INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- videos table
CREATE TABLE videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  contributor_id UUID REFERENCES event_contributors(id) NOT NULL,

  -- File Information
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  duration INTEGER NOT NULL,

  -- Storage URLs (Supabase Storage)
  storage_path TEXT NOT NULL,
  thumbnail_path TEXT NOT NULL,

  -- Video Metadata
  width INTEGER,
  height INTEGER,
  fps INTEGER,
  bitrate INTEGER,

  -- Content & Messaging
  greeting_message TEXT,

  -- Status & Moderation
  status TEXT CHECK (status IN ('processing', 'pending', 'approved', 'rejected', 'flagged')) DEFAULT 'processing',
  processing_status TEXT CHECK (processing_status IN ('queued', 'processing', 'completed', 'failed')) DEFAULT 'queued',
  moderation_notes TEXT,
  moderated_by UUID REFERENCES profiles(id),
  moderated_at TIMESTAMPTZ,

  -- Engagement
  views INTEGER DEFAULT 0,
  reports INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  processing_completed_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ
);

-- payments table
CREATE TABLE payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) NOT NULL,
  user_id UUID REFERENCES profiles(id) NOT NULL,

  -- Payment Details
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'PHP',
  payment_method TEXT CHECK (payment_method IN ('gcash', 'paymaya', 'paymongo_card', 'paymongo_bank', 'over_counter')) NOT NULL,

  -- External Payment References
  external_payment_id TEXT,
  external_reference TEXT,

  -- Subscription Details
  subscription_tier TEXT NOT NULL,
  video_addon_enabled BOOLEAN DEFAULT false,

  -- Payment Status
  status TEXT CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded')) DEFAULT 'pending',
  failure_reason TEXT,

  -- Webhook & Processing
  webhook_received_at TIMESTAMPTZ,
  webhook_data JSONB,
  processed_at TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- content_reports table
CREATE TABLE content_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,

  -- Content Being Reported
  content_type TEXT CHECK (content_type IN ('photo', 'video')) NOT NULL,
  content_id UUID NOT NULL,

  -- Reporter Information
  reporter_name TEXT,
  reporter_email TEXT,
  reporter_session_id TEXT,

  -- Report Details
  report_reason TEXT CHECK (report_reason IN ('inappropriate', 'spam', 'privacy', 'copyright', 'other')) NOT NULL,
  report_description TEXT,

  -- Status & Resolution
  status TEXT CHECK (status IN ('pending', 'reviewing', 'resolved', 'dismissed')) DEFAULT 'pending',
  resolution_notes TEXT,
  resolved_by UUID REFERENCES profiles(id),
  resolved_at TIMESTAMPTZ,

  -- Actions Taken
  content_removed BOOLEAN DEFAULT false,
  user_warned BOOLEAN DEFAULT false,
  user_blocked BOOLEAN DEFAULT false,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- event_analytics table
CREATE TABLE event_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,

  -- Analytics Date (for daily aggregation)
  analytics_date DATE NOT NULL,

  -- Traffic & Engagement
  qr_scans INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  page_views INTEGER DEFAULT 0,
  avg_session_duration INTERVAL,

  -- Content Metrics
  photos_uploaded INTEGER DEFAULT 0,
  videos_uploaded INTEGER DEFAULT 0,
  captions_added INTEGER DEFAULT 0,

  -- User Engagement
  new_contributors INTEGER DEFAULT 0,
  returning_contributors INTEGER DEFAULT 0,
  blocked_users INTEGER DEFAULT 0,

  -- Content Moderation
  content_flagged INTEGER DEFAULT 0,
  content_approved INTEGER DEFAULT 0,
  content_rejected INTEGER DEFAULT 0,

  -- Device & Browser Stats
  mobile_users INTEGER DEFAULT 0,
  desktop_users INTEGER DEFAULT 0,
  ios_users INTEGER DEFAULT 0,
  android_users INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE OPTIMIZATION
-- ============================================================================

-- Event indexes
CREATE UNIQUE INDEX idx_events_qr_code ON events (qr_code_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_events_host ON events (host_user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_events_status_date ON events (status, event_date) WHERE deleted_at IS NULL;
CREATE INDEX idx_events_qr_active ON events (qr_code_id) WHERE status = 'active' AND deleted_at IS NULL;
CREATE INDEX idx_events_type_popularity ON events (event_type, created_at DESC) WHERE deleted_at IS NULL;

-- Contributor indexes
CREATE UNIQUE INDEX idx_event_contributors_session ON event_contributors (event_id, session_id);
CREATE INDEX idx_event_contributors_email ON event_contributors (event_id, email);

-- Photo indexes
CREATE INDEX idx_photos_event ON photos (event_id, created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_photos_contributor ON photos (contributor_id);
CREATE INDEX idx_photos_status ON photos (status, created_at DESC);
CREATE INDEX idx_photos_moderation ON photos (status, moderated_at) WHERE status = 'pending';
CREATE INDEX idx_photos_event_realtime ON photos (event_id, created_at DESC) WHERE status = 'approved' AND deleted_at IS NULL;
CREATE INDEX idx_photos_contributor_count ON photos (contributor_id, created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_photos_moderation_queue ON photos (status, created_at DESC) WHERE status IN ('pending', 'flagged');

-- Video indexes
CREATE INDEX idx_videos_event ON videos (event_id, created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_videos_contributor ON videos (contributor_id);
CREATE INDEX idx_videos_status ON videos (status, created_at DESC);
CREATE INDEX idx_videos_processing ON videos (processing_status, created_at) WHERE processing_status != 'completed';
CREATE INDEX idx_videos_event_realtime ON videos (event_id, created_at DESC) WHERE status = 'approved' AND deleted_at IS NULL;
CREATE INDEX idx_videos_moderation_queue ON videos (status, created_at DESC) WHERE status IN ('pending', 'flagged');

-- Payment indexes
CREATE INDEX idx_payments_event ON payments (event_id);
CREATE INDEX idx_payments_user ON payments (user_id);
CREATE INDEX idx_payments_external ON payments (external_payment_id);
CREATE INDEX idx_payments_status ON payments (status, created_at DESC);
CREATE INDEX idx_payments_external_lookup ON payments (external_payment_id, status);
CREATE INDEX idx_payments_method_analysis ON payments (payment_method, status, created_at DESC);

-- Content report indexes
CREATE INDEX idx_content_reports_event ON content_reports (event_id, status);
CREATE INDEX idx_content_reports_content ON content_reports (content_type, content_id);
CREATE INDEX idx_content_reports_status ON content_reports (status, created_at DESC);

-- Analytics indexes
CREATE UNIQUE INDEX idx_event_analytics_date ON event_analytics (event_id, analytics_date);
CREATE INDEX idx_event_analytics_recent ON event_analytics (analytics_date DESC, event_id);
CREATE INDEX idx_event_analytics_dashboard ON event_analytics (event_id, analytics_date DESC);

-- ============================================================================
-- TRIGGERS FOR AUTOMATIC TIMESTAMP UPDATES
-- ============================================================================

-- Add updated_at triggers to all tables
CREATE TRIGGER trigger_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_event_contributors_updated_at
  BEFORE UPDATE ON event_contributors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_photos_updated_at
  BEFORE UPDATE ON photos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_videos_updated_at
  BEFORE UPDATE ON videos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_content_reports_updated_at
  BEFORE UPDATE ON content_reports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_event_analytics_updated_at
  BEFORE UPDATE ON event_analytics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- BUSINESS LOGIC FUNCTIONS
-- ============================================================================

-- Function to update event statistics after photo upload
CREATE OR REPLACE FUNCTION update_event_photo_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE events
    SET
      total_photos = total_photos + 1,
      updated_at = NOW()
    WHERE id = NEW.event_id;

    -- Update contributor photo count
    UPDATE event_contributors
    SET
      photos_uploaded = photos_uploaded + 1,
      last_upload_at = NOW(),
      updated_at = NOW()
    WHERE id = NEW.contributor_id;

    RETURN NEW;
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Function to handle video processing status updates
CREATE OR REPLACE FUNCTION handle_video_processing()
RETURNS TRIGGER AS $$
BEGIN
  -- When video processing completes successfully
  IF NEW.processing_status = 'completed' AND OLD.processing_status != 'completed' THEN
    NEW.status = CASE
      WHEN (SELECT moderation_enabled FROM events WHERE id = NEW.event_id) THEN 'pending'
      ELSE 'approved'
    END;
    NEW.processing_completed_at = NOW();

    -- Update event video count
    UPDATE events
    SET
      total_videos = total_videos + 1,
      updated_at = NOW()
    WHERE id = NEW.event_id;

    -- Update contributor video count
    UPDATE event_contributors
    SET
      videos_uploaded = videos_uploaded + 1,
      last_upload_at = NOW(),
      updated_at = NOW()
    WHERE id = NEW.contributor_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to generate unique QR codes for events
CREATE OR REPLACE FUNCTION generate_event_qr_code()
RETURNS TEXT AS $$
DECLARE
  qr_code TEXT;
  exists_check BOOLEAN;
BEGIN
  LOOP
    -- Generate 8-character alphanumeric code (excluding ambiguous characters)
    qr_code := UPPER(
      substr(md5(random()::text || clock_timestamp()::text), 1, 8)
    );

    -- Replace ambiguous characters
    qr_code := translate(qr_code, '0O1IL', 'ABCDE');

    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM events WHERE qr_code_id = qr_code) INTO exists_check;

    -- Exit loop if code is unique
    EXIT WHEN NOT exists_check;
  END LOOP;

  RETURN qr_code;
END;
$$ LANGUAGE plpgsql;

-- Function to handle successful payment processing
CREATE OR REPLACE FUNCTION process_successful_payment()
RETURNS TRIGGER AS $$
BEGIN
  -- When payment status changes to completed
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    -- Update event subscription tier and features
    UPDATE events
    SET
      subscription_tier = NEW.subscription_tier,
      video_addon_enabled = NEW.video_addon_enabled,
      payment_status = 'paid',
      amount_paid = NEW.amount,
      payment_reference = NEW.external_payment_id,

      -- Update limits based on tier
      max_photos = CASE NEW.subscription_tier
        WHEN 'basic' THEN 50
        WHEN 'standard' THEN 100
        WHEN 'premium' THEN 250
        WHEN 'pro' THEN 500
        ELSE 30
      END,

      max_videos = CASE
        WHEN NEW.video_addon_enabled THEN 100
        ELSE 0
      END,

      storage_days = CASE NEW.subscription_tier
        WHEN 'basic' THEN 7
        WHEN 'standard' THEN 14
        WHEN 'premium' THEN 30
        WHEN 'pro' THEN 30
        ELSE 3
      END,

      updated_at = NOW()
    WHERE id = NEW.event_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- TRIGGERS FOR BUSINESS LOGIC
-- ============================================================================

-- Photo stats trigger
CREATE TRIGGER trigger_update_photo_stats
  AFTER INSERT ON photos
  FOR EACH ROW EXECUTE FUNCTION update_event_photo_stats();

-- Video processing trigger
CREATE TRIGGER trigger_video_processing
  BEFORE UPDATE ON videos
  FOR EACH ROW EXECUTE FUNCTION handle_video_processing();

-- Payment processing trigger
CREATE TRIGGER trigger_process_payment
  AFTER UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION process_successful_payment();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_contributors ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_analytics ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Events policies
CREATE POLICY "Hosts can manage own events" ON events
  FOR ALL USING (host_user_id = auth.uid() OR auth.uid() = ANY(co_hosts));

CREATE POLICY "Public can read active events" ON events
  FOR SELECT USING (
    status = 'active'
    AND deleted_at IS NULL
    AND (qr_code_expires_at IS NULL OR qr_code_expires_at > NOW())
  );

-- Event contributors policies
CREATE POLICY "Hosts can see event contributors" ON event_contributors
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_contributors.event_id
      AND (events.host_user_id = auth.uid() OR auth.uid() = ANY(events.co_hosts))
    )
  );

CREATE POLICY "Contributors can see own records" ON event_contributors
  FOR SELECT USING (
    session_id = (SELECT current_setting('request.jwt.claims', true)::json->>'session_id')
  );

CREATE POLICY "Public can register as contributors" ON event_contributors
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_contributors.event_id
      AND events.status = 'active'
      AND events.deleted_at IS NULL
    )
  );

-- Photos policies
CREATE POLICY "Public can view approved photos" ON photos
  FOR SELECT USING (
    status = 'approved'
    AND deleted_at IS NULL
    AND EXISTS (
      SELECT 1 FROM events
      WHERE events.id = photos.event_id
      AND events.status IN ('active', 'ended')
      AND events.deleted_at IS NULL
    )
  );

CREATE POLICY "Contributors can upload photos" ON photos
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM event_contributors
      WHERE event_contributors.event_id = photos.event_id
      AND event_contributors.id = photos.contributor_id
      AND NOT event_contributors.is_blocked
    )
  );

CREATE POLICY "Hosts can manage event photos" ON photos
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = photos.event_id
      AND (events.host_user_id = auth.uid() OR auth.uid() = ANY(events.co_hosts))
    )
  );

-- Videos policies
CREATE POLICY "Public can view approved videos" ON videos
  FOR SELECT USING (
    status = 'approved'
    AND deleted_at IS NULL
    AND EXISTS (
      SELECT 1 FROM events
      WHERE events.id = videos.event_id
      AND events.status IN ('active', 'ended')
      AND events.video_addon_enabled = true
      AND events.deleted_at IS NULL
    )
  );

CREATE POLICY "Contributors can upload videos" ON videos
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM event_contributors ec
      JOIN events e ON e.id = ec.event_id
      WHERE ec.event_id = videos.event_id
      AND ec.id = videos.contributor_id
      AND NOT ec.is_blocked
      AND e.video_addon_enabled = true
    )
  );

CREATE POLICY "Hosts can manage event videos" ON videos
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = videos.event_id
      AND (events.host_user_id = auth.uid() OR auth.uid() = ANY(events.co_hosts))
    )
  );

-- Payments policies
CREATE POLICY "Users can see own payments" ON payments
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create own payments" ON payments
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Content reports policies
CREATE POLICY "Hosts can see event reports" ON content_reports
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = content_reports.event_id
      AND (events.host_user_id = auth.uid() OR auth.uid() = ANY(events.co_hosts))
    )
  );

CREATE POLICY "Public can create content reports" ON content_reports
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = content_reports.event_id
      AND events.status = 'active'
      AND events.deleted_at IS NULL
    )
  );

-- Event analytics policies
CREATE POLICY "Hosts can see event analytics" ON event_analytics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_analytics.event_id
      AND (events.host_user_id = auth.uid() OR auth.uid() = ANY(events.co_hosts))
    )
  );

-- ============================================================================
-- STORAGE BUCKET SETUP
-- ============================================================================

-- Create storage buckets for media files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('event-photos', 'event-photos', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('event-videos', 'event-videos', true, 104857600, ARRAY['video/mp4', 'video/mov', 'video/avi']),
  ('thumbnails', 'thumbnails', true, 2097152, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('user-avatars', 'user-avatars', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']);

-- Storage policies for event-photos bucket
CREATE POLICY "Public can view event photos" ON storage.objects
  FOR SELECT USING (bucket_id = 'event-photos');

CREATE POLICY "Authenticated users can upload photos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'event-photos'
    AND auth.role() = 'authenticated'
  );

-- Storage policies for event-videos bucket
CREATE POLICY "Public can view event videos" ON storage.objects
  FOR SELECT USING (bucket_id = 'event-videos');

CREATE POLICY "Authenticated users can upload videos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'event-videos'
    AND auth.role() = 'authenticated'
  );

-- Storage policies for thumbnails bucket
CREATE POLICY "Public can view thumbnails" ON storage.objects
  FOR SELECT USING (bucket_id = 'thumbnails');

CREATE POLICY "Authenticated users can upload thumbnails" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'thumbnails'
    AND auth.role() = 'authenticated'
  );

-- Storage policies for user-avatars bucket
CREATE POLICY "Public can view user avatars" ON storage.objects
  FOR SELECT USING (bucket_id = 'user-avatars');

CREATE POLICY "Users can upload own avatar" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'user-avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- ============================================================================
-- INITIAL DATA AND CONFIGURATION
-- ============================================================================

-- Create a default system user for admin operations
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'system@instamoments.ph',
  crypt('system_password_placeholder', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  false,
  '',
  '',
  '',
  ''
);

-- Create system profile
INSERT INTO profiles (id, email, full_name, account_status)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'system@instamoments.ph',
  'System Administrator',
  'active'
);

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE profiles IS 'User profiles extending Supabase Auth with additional user data and preferences';
COMMENT ON TABLE events IS 'Event management with QR code access, subscription tiers, and content limits';
COMMENT ON TABLE event_contributors IS 'Anonymous contributors to events without requiring user accounts';
COMMENT ON TABLE photos IS 'Photo storage and management with moderation and analytics tracking';
COMMENT ON TABLE videos IS 'Video storage with processing status and greeting message support';
COMMENT ON TABLE payments IS 'Payment tracking for subscription upgrades and Philippine payment methods';
COMMENT ON TABLE content_reports IS 'Content moderation system for inappropriate or flagged content';
COMMENT ON TABLE event_analytics IS 'Daily analytics aggregation for event performance and user engagement';

COMMENT ON FUNCTION generate_event_qr_code() IS 'Generates unique 8-character QR codes for event access';
COMMENT ON FUNCTION update_event_photo_stats() IS 'Updates event and contributor statistics after photo uploads';
COMMENT ON FUNCTION handle_video_processing() IS 'Manages video processing workflow and status updates';
COMMENT ON FUNCTION process_successful_payment() IS 'Handles successful payment processing and subscription upgrades';
