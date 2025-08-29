# Supabase Setup Guide for InstaMoments

This guide will help you set up Supabase for the InstaMoments application.

## Prerequisites

- Node.js 18+ installed
- Supabase account (free tier available)
- Git repository set up

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `instamoments` (or your preferred name)
   - **Database Password**: Generate a strong password
   - **Region**: Choose closest to your target users (Asia Pacific for Philippines)
5. Click "Create new project"
6. Wait for project setup to complete (2-3 minutes)

## Step 2: Get Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (e.g., `https://your-project.supabase.co`)
   - **anon public** key
   - **service_role** key (keep this secret!)

## Step 3: Configure Environment Variables

1. In your project root, create `.env.local` file (already created)
2. Update the values with your actual Supabase credentials:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=InstaMoments
```

## Step 4: Set Up Database Schema

### Option A: Using Supabase Dashboard (Recommended for beginners)

1. Go to **SQL Editor** in your Supabase dashboard
2. Run the following SQL commands to create tables:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  language TEXT DEFAULT 'en-PH',
  timezone TEXT DEFAULT 'Asia/Manila',
  email_notifications BOOLEAN DEFAULT true,
  account_status TEXT CHECK (account_status IN ('active', 'suspended', 'deleted')) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ
);

-- Create events table
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  event_type TEXT CHECK (event_type IN ('wedding', 'birthday', 'corporate', 'graduation', 'anniversary', 'celebration', 'other')) DEFAULT 'celebration',
  location TEXT,
  max_photos INTEGER NOT NULL DEFAULT 30,
  max_videos INTEGER NOT NULL DEFAULT 0,
  storage_days INTEGER NOT NULL DEFAULT 3,
  moderation_enabled BOOLEAN DEFAULT false,
  auto_approve_content BOOLEAN DEFAULT true,
  qr_code_id TEXT UNIQUE NOT NULL,
  qr_code_expires_at TIMESTAMPTZ,
  access_password TEXT,
  subscription_tier TEXT CHECK (subscription_tier IN ('free', 'basic', 'standard', 'premium', 'pro')) DEFAULT 'free',
  video_addon_enabled BOOLEAN DEFAULT false,
  payment_status TEXT CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')) DEFAULT 'pending',
  amount_paid DECIMAL(10,2) DEFAULT 0,
  payment_reference TEXT,
  status TEXT CHECK (status IN ('draft', 'active', 'ended', 'archived')) DEFAULT 'draft',
  host_user_id UUID REFERENCES auth.users(id) NOT NULL,
  co_hosts TEXT[],
  total_photos INTEGER DEFAULT 0,
  total_videos INTEGER DEFAULT 0,
  unique_contributors INTEGER DEFAULT 0,
  total_views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  activated_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ
);

-- Create photos table
CREATE TABLE photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) NOT NULL,
  contributor_id TEXT NOT NULL,
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  thumbnail_path TEXT,
  medium_path TEXT,
  width INTEGER,
  height INTEGER,
  exif_data JSONB,
  caption TEXT,
  message TEXT,
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected', 'flagged')) DEFAULT 'pending',
  moderation_notes TEXT,
  moderated_by UUID REFERENCES auth.users(id),
  moderated_at TIMESTAMPTZ,
  views INTEGER DEFAULT 0,
  reports INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Create videos table
CREATE TABLE videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) NOT NULL,
  contributor_id TEXT NOT NULL,
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  duration INTEGER NOT NULL,
  storage_path TEXT NOT NULL,
  thumbnail_path TEXT NOT NULL,
  width INTEGER,
  height INTEGER,
  fps INTEGER,
  bitrate INTEGER,
  greeting_message TEXT,
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected', 'flagged')) DEFAULT 'pending',
  processing_status TEXT CHECK (processing_status IN ('queued', 'processing', 'completed', 'failed')) DEFAULT 'queued',
  moderation_notes TEXT,
  moderated_by UUID REFERENCES auth.users(id),
  moderated_at TIMESTAMPTZ,
  views INTEGER DEFAULT 0,
  reports INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  processing_completed_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ
);

-- Create event_contributors table
CREATE TABLE event_contributors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  session_id TEXT NOT NULL,
  photos_uploaded INTEGER DEFAULT 0,
  videos_uploaded INTEGER DEFAULT 0,
  last_upload_at TIMESTAMPTZ,
  is_blocked BOOLEAN DEFAULT false,
  blocked_reason TEXT,
  blocked_at TIMESTAMPTZ,
  blocked_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Option B: Using Supabase CLI (Advanced)

1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Initialize Supabase in your project:
   ```bash
   supabase init
   ```

3. Link to your remote project:
   ```bash
   supabase link --project-ref your-project-ref
   ```

4. Create and apply migrations:
   ```bash
   supabase migration new create_initial_schema
   # Edit the generated migration file with the SQL above
   supabase db push
   ```

## Step 5: Set Up Row Level Security (RLS)

Enable RLS and create policies for data security:

```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_contributors ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Events policies
CREATE POLICY "Users can view events they host" ON events
  FOR SELECT USING (auth.uid() = host_user_id);

CREATE POLICY "Users can view public events" ON events
  FOR SELECT USING (status = 'active');

CREATE POLICY "Users can create events" ON events
  FOR INSERT WITH CHECK (auth.uid() = host_user_id);

CREATE POLICY "Users can update events they host" ON events
  FOR UPDATE USING (auth.uid() = host_user_id);

-- Photos policies
CREATE POLICY "Anyone can view approved photos" ON photos
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Event hosts can view all photos" ON photos
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM events 
      WHERE events.id = photos.event_id 
      AND events.host_user_id = auth.uid()
    )
  );

CREATE POLICY "Contributors can insert photos" ON photos
  FOR INSERT WITH CHECK (true); -- Will be validated by application logic

-- Videos policies (similar to photos)
CREATE POLICY "Anyone can view approved videos" ON videos
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Event hosts can view all videos" ON videos
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM events 
      WHERE events.id = videos.event_id 
      AND events.host_user_id = auth.uid()
    )
  );

CREATE POLICY "Contributors can insert videos" ON videos
  FOR INSERT WITH CHECK (true);
```

## Step 6: Set Up Storage Buckets

1. Go to **Storage** in your Supabase dashboard
2. Create the following buckets:

   - **event-photos**: For storing event photos
   - **event-videos**: For storing event videos  
   - **thumbnails**: For storing photo/video thumbnails
   - **user-avatars**: For storing user profile pictures

3. Set bucket policies:

```sql
-- Allow authenticated users to upload photos
CREATE POLICY "Users can upload photos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'event-photos' 
    AND auth.role() = 'authenticated'
  );

-- Allow public access to view photos
CREATE POLICY "Public can view photos" ON storage.objects
  FOR SELECT USING (bucket_id = 'event-photos');

-- Similar policies for other buckets...
```

## Step 7: Configure Authentication

1. Go to **Authentication** → **Settings** in your Supabase dashboard
2. Configure email templates:
   - **Confirm signup**: Customize welcome message
   - **Reset password**: Customize password reset email
3. Set up redirect URLs:
   - Add `http://localhost:3000/auth/callback` for development
   - Add your production domain when ready

## Step 8: Test the Connection

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Visit `http://localhost:3000/api/test` to test the connection
3. You should see a success response with database and auth status

## Step 9: Verify Setup

1. Check that all tables are created in **Table Editor**
2. Verify RLS policies are active
3. Test authentication flow:
   - Try to sign up a new user
   - Check that profile is created automatically
   - Test sign in/sign out

## Troubleshooting

### Common Issues

1. **Environment variables not loading**:
   - Restart your development server
   - Check `.env.local` file exists and has correct values

2. **Database connection errors**:
   - Verify Supabase URL and keys are correct
   - Check if your IP is allowed (if using IP restrictions)

3. **RLS blocking queries**:
   - Ensure user is authenticated
   - Check RLS policies are correctly configured
   - Verify user has proper permissions

4. **Storage upload failures**:
   - Check bucket policies
   - Verify file size limits
   - Check MIME type restrictions

### Getting Help

- Check [Supabase documentation](https://supabase.com/docs)
- Visit [Supabase Discord](https://discord.supabase.com)
- Review [Supabase GitHub issues](https://github.com/supabase/supabase/issues)

## Next Steps

After completing this setup:

1. Implement authentication UI components
2. Create event management features
3. Add photo/video upload functionality
4. Implement real-time updates
5. Add payment integration

Your Supabase backend is now ready for development! 🎉
