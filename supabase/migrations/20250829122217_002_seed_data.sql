-- Migration: 002_seed_data.sql
-- Description: Seed data for development and testing
-- Includes: Sample users, events, contributors, and analytics data

-- ============================================================================
-- DEVELOPMENT SEED DATA
-- ============================================================================

-- Create test user profiles (using UUIDs that match the system user pattern)
INSERT INTO profiles (id, email, full_name, phone, language, timezone) VALUES
('11111111-1111-1111-1111-111111111111', 'maria.santos@test.com', 'Maria Santos', '+639171234567', 'en-PH', 'Asia/Manila'),
('22222222-2222-2222-2222-222222222222', 'juan.cruz@test.com', 'Juan Cruz', '+639171234568', 'en-PH', 'Asia/Manila'),
('33333333-3333-3333-3333-333333333333', 'carmen.garcia@test.com', 'Tita Carmen Garcia', '+639171234569', 'en-PH', 'Asia/Manila'),
('44444444-4444-4444-4444-444444444444', 'mike.rodriguez@test.com', 'Kuya Mike Rodriguez', '+639171234570', 'en-PH', 'Asia/Manila'),
('55555555-5555-5555-5555-555555555555', 'ana.martinez@test.com', 'Ana Martinez', '+639171234571', 'en-PH', 'Asia/Manila');

-- Create sample events
INSERT INTO events (
  id, 
  name, 
  description, 
  event_date, 
  event_type, 
  location,
  max_photos, 
  subscription_tier, 
  qr_code_id, 
  host_user_id, 
  status,
  video_addon_enabled,
  payment_status,
  amount_paid
) VALUES
(
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'Maria & Juan Wedding',
  'Celebration of love in Tagaytay Highlands',
  '2024-12-25',
  'wedding',
  'Tagaytay Highlands, Cavite',
  100,
  'standard',
  'WEDDING1',
  '11111111-1111-1111-1111-111111111111',
  'active',
  true,
  'paid',
  1500.00
),
(
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'Company Christmas Party 2024',
  'Annual holiday celebration for all employees',
  '2024-12-20',
  'corporate',
  'Makati Business District, Metro Manila',
  250,
  'premium',
  'XMASPTY',
  '22222222-2222-2222-2222-222222222222',
  'active',
  true,
  'paid',
  2500.00
),
(
  'cccccccc-cccc-cccc-cccc-cccccccccccc',
  'Tita Carmen Birthday',
  '70th birthday celebration with family',
  '2024-12-28',
  'birthday',
  'Quezon City, Metro Manila',
  50,
  'basic',
  'BDAY70',
  '33333333-3333-3333-3333-333333333333',
  'active',
  false,
  'paid',
  500.00
),
(
  'dddddddd-dddd-dddd-dddd-dddddddddddd',
  'Graduation Ceremony 2024',
  'High school graduation celebration',
  '2024-12-30',
  'graduation',
  'Manila University, Metro Manila',
  75,
  'standard',
  'GRAD24',
  '44444444-4444-4444-4444-444444444444',
  'active',
  false,
  'paid',
  1000.00
),
(
  'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
  'New Year Celebration',
  'Welcome 2025 with family and friends',
  '2025-01-01',
  'celebration',
  'BGC, Taguig City',
  200,
  'premium',
  'NY2025',
  '55555555-5555-5555-5555-555555555555',
  'draft',
  true,
  'pending',
  0.00
);

-- Create sample event contributors
INSERT INTO event_contributors (id, event_id, name, email, session_id, photos_uploaded, videos_uploaded) VALUES
-- Wedding contributors
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Tita Carmen', 'carmen@family.com', 'session_wedding_001', 15, 2),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Kuya Mike', 'mike@friends.com', 'session_wedding_002', 8, 1),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Lola Nena', 'nena@family.com', 'session_wedding_003', 12, 0),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Tito Boy', 'boy@family.com', 'session_wedding_004', 6, 1),

-- Christmas party contributors
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Sarah Johnson', 'sarah@company.com', 'session_xmas_001', 25, 3),
('ffffffff-ffff-ffff-ffff-ffffffffffff', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Mark Santos', 'mark@company.com', 'session_xmas_002', 18, 2),
('gggggggg-gggg-gggg-gggg-gggggggggggg', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Lisa Cruz', 'lisa@company.com', 'session_xmas_003', 22, 1),

-- Birthday contributors
('hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Nina Garcia', 'nina@family.com', 'session_bday_001', 8, 0),
('iiiiiiii-iiii-iiii-iiii-iiiiiiiiiiii', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Pedro Garcia', 'pedro@family.com', 'session_bday_002', 5, 0),

-- Graduation contributors
('jjjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Maria Rodriguez', 'maria@family.com', 'session_grad_001', 12, 0),
('kkkkkkkk-kkkk-kkkk-kkkk-kkkkkkkkkkkk', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Carlos Rodriguez', 'carlos@family.com', 'session_grad_002', 9, 0);

-- Create sample photos (simulating uploaded content)
INSERT INTO photos (
  id,
  event_id,
  contributor_id,
  filename,
  original_filename,
  file_size,
  mime_type,
  storage_path,
  thumbnail_path,
  width,
  height,
  caption,
  message,
  status,
  views
) VALUES
-- Wedding photos
('photo_001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'wedding_001.jpg', 'IMG_001.jpg', 2048576, 'image/jpeg', 'event-photos/wedding_001.jpg', 'thumbnails/wedding_001_thumb.jpg', 4032, 3024, 'Beautiful ceremony', 'Congratulations to the happy couple!', 'approved', 45),
('photo_002', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'wedding_002.jpg', 'IMG_002.jpg', 1876543, 'image/jpeg', 'event-photos/wedding_002.jpg', 'thumbnails/wedding_002_thumb.jpg', 4032, 3024, 'First dance', 'The first dance was magical!', 'approved', 38),
('photo_003', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'wedding_003.jpg', 'IMG_003.jpg', 2154321, 'image/jpeg', 'event-photos/wedding_003.jpg', 'thumbnails/wedding_003_thumb.jpg', 4032, 3024, 'Cutting the cake', 'Sweet moments shared together', 'approved', 42),

-- Christmas party photos
('photo_004', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'xmas_001.jpg', 'IMG_004.jpg', 1987654, 'image/jpeg', 'event-photos/xmas_001.jpg', 'thumbnails/xmas_001_thumb.jpg', 4032, 3024, 'Team photo', 'Great team, great party!', 'approved', 67),
('photo_005', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'xmas_002.jpg', 'IMG_005.jpg', 1876543, 'image/jpeg', 'event-photos/xmas_002.jpg', 'thumbnails/xmas_002_thumb.jpg', 4032, 3024, 'Secret Santa', 'Secret Santa surprises!', 'approved', 54),

-- Birthday photos
('photo_006', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', 'bday_001.jpg', 'IMG_006.jpg', 1654321, 'image/jpeg', 'event-photos/bday_001.jpg', 'thumbnails/bday_001_thumb.jpg', 4032, 3024, 'Birthday cake', 'Happy 70th birthday!', 'approved', 23),
('photo_007', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'iiiiiiii-iiii-iiii-iiii-iiiiiiiiiiii', 'bday_002.jpg', 'IMG_007.jpg', 1432567, 'image/jpeg', 'event-photos/bday_002.jpg', 'thumbnails/bday_002_thumb.jpg', 4032, 3024, 'Family photo', 'Family celebration time', 'approved', 19),

-- Graduation photos
('photo_008', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'jjjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj', 'grad_001.jpg', 'IMG_008.jpg', 1987654, 'image/jpeg', 'event-photos/grad_001.jpg', 'thumbnails/grad_001_thumb.jpg', 4032, 3024, 'Graduation ceremony', 'Proud moment for the family', 'approved', 34),
('photo_009', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'kkkkkkkk-kkkk-kkkk-kkkk-kkkkkkkkkkkk', 'grad_002.jpg', 'IMG_009.jpg', 1876543, 'image/jpeg', 'event-photos/grad_002.jpg', 'thumbnails/grad_002_thumb.jpg', 4032, 3024, 'Cap and gown', 'Academic achievement unlocked!', 'approved', 28);

-- Create sample videos (simulating uploaded content)
INSERT INTO videos (
  id,
  event_id,
  contributor_id,
  filename,
  original_filename,
  file_size,
  mime_type,
  duration,
  storage_path,
  thumbnail_path,
  width,
  height,
  fps,
  bitrate,
  greeting_message,
  status,
  processing_status,
  views
) VALUES
-- Wedding videos
('video_001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'wedding_greeting_001.mp4', 'VID_001.mp4', 52428800, 'video/mp4', 15, 'event-videos/wedding_greeting_001.mp4', 'thumbnails/wedding_greeting_001_thumb.jpg', 1920, 1080, 30, 5000000, 'Congratulations on your special day!', 'approved', 'completed', 23),
('video_002', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'wedding_greeting_002.mp4', 'VID_002.mp4', 41943040, 'video/mp4', 12, 'event-videos/wedding_greeting_002.mp4', 'thumbnails/wedding_greeting_002_thumb.jpg', 1920, 1080, 30, 4000000, 'Wishing you a lifetime of happiness!', 'approved', 'completed', 18),

-- Christmas party videos
('video_003', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'xmas_greeting_001.mp4', 'VID_003.mp4', 62914560, 'video/mp4', 18, 'event-videos/xmas_greeting_001.mp4', 'thumbnails/xmas_greeting_001_thumb.jpg', 1920, 1080, 30, 6000000, 'Merry Christmas to the best team!', 'approved', 'completed', 45),
('video_004', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'xmas_greeting_002.mp4', 'VID_004.mp4', 52428800, 'video/mp4', 14, 'event-videos/xmas_greeting_002.mp4', 'thumbnails/xmas_greeting_002_thumb.jpg', 1920, 1080, 30, 5000000, 'Happy holidays everyone!', 'approved', 'completed', 32);

-- Create sample payments
INSERT INTO payments (
  id,
  event_id,
  user_id,
  amount,
  currency,
  payment_method,
  external_payment_id,
  subscription_tier,
  video_addon_enabled,
  status,
  processed_at
) VALUES
('payment_001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 1500.00, 'PHP', 'gcash', 'gcash_txn_001', 'standard', true, 'completed', NOW()),
('payment_002', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 2500.00, 'PHP', 'paymaya', 'paymaya_txn_001', 'premium', true, 'completed', NOW()),
('payment_003', 'cccccccc-cccc-cccc-cccc-cccccccccccc', '33333333-3333-3333-3333-333333333333', 500.00, 'PHP', 'gcash', 'gcash_txn_002', 'basic', false, 'completed', NOW()),
('payment_004', 'dddddddd-dddd-dddd-dddd-dddddddddddd', '44444444-4444-4444-4444-444444444444', 1000.00, 'PHP', 'paymongo_card', 'paymongo_txn_001', 'standard', false, 'completed', NOW()),
('payment_005', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '55555555-5555-5555-5555-555555555555', 2000.00, 'PHP', 'paymongo_bank', 'paymongo_txn_002', 'premium', true, 'pending', NULL);

-- Create sample content reports
INSERT INTO content_reports (
  id,
  event_id,
  content_type,
  content_id,
  reporter_name,
  reporter_email,
  report_reason,
  report_description,
  status
) VALUES
('report_001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'photo', 'photo_001', 'Anonymous', 'anonymous@example.com', 'inappropriate', 'This photo seems inappropriate for a wedding event', 'resolved'),
('report_002', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'video', 'video_003', 'John Doe', 'john@company.com', 'spam', 'This video appears to be promotional content', 'pending');

-- Create sample analytics data
INSERT INTO event_analytics (
  event_id,
  analytics_date,
  qr_scans,
  unique_visitors,
  page_views,
  photos_uploaded,
  videos_uploaded,
  new_contributors,
  returning_contributors,
  mobile_users,
  desktop_users
) VALUES
-- Wedding analytics (multiple days)
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', CURRENT_DATE - INTERVAL '2 days', 45, 32, 156, 12, 1, 8, 0, 28, 4),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', CURRENT_DATE - INTERVAL '1 day', 67, 45, 234, 15, 2, 12, 8, 38, 7),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', CURRENT_DATE, 89, 67, 345, 18, 2, 15, 12, 52, 15),

-- Christmas party analytics
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', CURRENT_DATE - INTERVAL '1 day', 123, 89, 456, 25, 3, 23, 0, 67, 22),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', CURRENT_DATE, 156, 112, 567, 28, 3, 25, 23, 78, 34),

-- Birthday analytics
('cccccccc-cccc-cccc-cccc-cccccccccccc', CURRENT_DATE, 34, 28, 123, 8, 0, 6, 0, 22, 6),

-- Graduation analytics
('dddddddd-dddd-dddd-dddd-dddddddddddd', CURRENT_DATE, 56, 42, 189, 12, 0, 9, 0, 35, 7);

-- ============================================================================
-- UPDATE EVENT COUNTERS BASED ON SEED DATA
-- ============================================================================

-- Update event photo and video counts based on seed data
UPDATE events SET
  total_photos = (
    SELECT COUNT(*) FROM photos 
    WHERE event_id = events.id AND deleted_at IS NULL
  ),
  total_videos = (
    SELECT COUNT(*) FROM videos 
    WHERE event_id = events.id AND deleted_at IS NULL
  ),
  unique_contributors = (
    SELECT COUNT(DISTINCT contributor_id) FROM photos 
    WHERE event_id = events.id AND deleted_at IS NULL
    UNION
    SELECT COUNT(DISTINCT contributor_id) FROM videos 
    WHERE event_id = events.id AND deleted_at IS NULL
  )
WHERE id IN (
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'cccccccc-cccc-cccc-cccc-cccccccccccc',
  'dddddddd-dddd-dddd-dddd-dddddddddddd',
  'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee'
);

-- Update contributor photo and video counts
UPDATE event_contributors SET
  photos_uploaded = (
    SELECT COUNT(*) FROM photos 
    WHERE contributor_id = event_contributors.id AND deleted_at IS NULL
  ),
  videos_uploaded = (
    SELECT COUNT(*) FROM videos 
    WHERE contributor_id = event_contributors.id AND deleted_at IS NULL
  )
WHERE id IN (
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'cccccccc-cccc-cccc-cccc-cccccccccccc',
  'dddddddd-dddd-dddd-dddd-dddddddddddd',
  'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
  'ffffffff-ffff-ffff-ffff-ffffffffffff',
  'gggggggg-gggg-gggg-gggg-gggggggggggg',
  'hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh',
  'iiiiiiii-iiii-iiii-iiii-iiiiiiiiiiii',
  'jjjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj',
  'kkkkkkkk-kkkk-kkkk-kkkk-kkkkkkkkkkkk'
);

-- ============================================================================
-- COMMENTS FOR SEED DATA
-- ============================================================================

COMMENT ON TABLE profiles IS 'Sample user profiles for development and testing';
COMMENT ON TABLE events IS 'Sample events covering different types and subscription tiers';
COMMENT ON TABLE event_contributors IS 'Sample contributors with realistic upload counts';
COMMENT ON TABLE photos IS 'Sample photos with metadata for testing gallery functionality';
COMMENT ON TABLE videos IS 'Sample videos with processing status for testing video features';
COMMENT ON TABLE payments IS 'Sample payments covering different Philippine payment methods';
COMMENT ON TABLE content_reports IS 'Sample content reports for testing moderation system';
COMMENT ON TABLE event_analytics IS 'Sample analytics data for testing dashboard functionality';
