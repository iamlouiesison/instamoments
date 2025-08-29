# Database Implementation Guide for InstaMoments

This guide covers the complete implementation of the database schema, including setup, migrations, and usage in the application.

## 🚀 Quick Start

### 1. Prerequisites
- Supabase CLI installed (`brew install supabase/tap/supabase`)
- Node.js 18+ with npm
- Supabase project created at [supabase.com](https://supabase.com)

### 2. Environment Setup
Create `.env.local` file in your project root:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=InstaMoments
```

### 3. Initialize Database
```bash
# Start local Supabase (optional, for development)
npm run db:start

# Apply migrations to your remote Supabase project
npm run db:push

# Generate TypeScript types from the schema
npm run generate-types
```

## 📊 Database Schema Overview

### Core Tables

| Table | Purpose | Key Features |
|-------|---------|--------------|
| `profiles` | User profiles extending Supabase Auth | Preferences, account status, timestamps |
| `events` | Event management | QR codes, subscription tiers, content limits |
| `event_contributors` | Anonymous contributors | Session-based access, upload tracking |
| `photos` | Photo storage and management | Moderation, metadata, analytics |
| `videos` | Video storage with processing | Video greetings, processing status |
| `payments` | Payment tracking | Philippine payment methods, subscriptions |
| `content_reports` | Content moderation | Reporting system, resolution tracking |
| `event_analytics` | Analytics aggregation | Daily metrics, engagement tracking |

### Key Features

- **Row Level Security (RLS)**: Comprehensive security policies for all tables
- **Real-time Updates**: Optimized indexes for live gallery functionality
- **Content Moderation**: Built-in reporting and approval workflows
- **Analytics**: Daily aggregation for business intelligence
- **Storage Integration**: Supabase Storage buckets with proper policies
- **Philippine Market**: Localized payment methods and data handling

## 🔧 Database Operations

### Event Management

```typescript
import { db } from '@/lib/database';

// Create a new event
const event = await db.events.createEvent({
  name: 'Maria & Juan Wedding',
  description: 'Celebration of love in Tagaytay',
  event_date: '2024-12-25',
  event_type: 'wedding',
  location: 'Tagaytay Highlands, Cavite',
  max_photos: 100,
  subscription_tier: 'standard',
  qr_code_id: 'WEDDING1',
  host_user_id: userId
});

// Get event by QR code
const event = await db.events.getEventByQRCode('WEDDING1');

// Get user's events
const userEvents = await db.events.getUserEvents(userId);
```

### Content Management

```typescript
// Upload a photo
const photo = await db.photos.uploadPhoto({
  event_id: eventId,
  contributor_id: contributorId,
  filename: 'wedding_001.jpg',
  original_filename: 'IMG_001.jpg',
  file_size: 2048576,
  mime_type: 'image/jpeg',
  storage_path: 'event-photos/wedding_001.jpg',
  thumbnail_path: 'thumbnails/wedding_001_thumb.jpg',
  width: 4032,
  height: 3024,
  caption: 'Beautiful ceremony',
  message: 'Congratulations to the happy couple!'
});

// Get event photos
const photos = await db.photos.getEventPhotos(eventId, 'approved');

// Upload a video
const video = await db.videos.uploadVideo({
  event_id: eventId,
  contributor_id: contributorId,
  filename: 'greeting_001.mp4',
  original_filename: 'VID_001.mp4',
  file_size: 52428800,
  mime_type: 'video/mp4',
  duration: 15,
  storage_path: 'event-videos/greeting_001.mp4',
  thumbnail_path: 'thumbnails/greeting_001_thumb.jpg',
  width: 1920,
  height: 1080,
  greeting_message: 'Congratulations on your special day!'
});
```

### Contributor Management

```typescript
// Register a contributor
const contributor = await db.contributors.registerContributor({
  event_id: eventId,
  name: 'Tita Carmen',
  email: 'carmen@family.com',
  session_id: generateSessionId()
});

// Get event contributors
const contributors = await db.contributors.getEventContributors(eventId);

// Block a contributor
await db.contributors.blockContributor(
  contributorId,
  'Inappropriate content',
  moderatorId
);
```

### Payment Processing

```typescript
// Create a payment
const payment = await db.payments.createPayment({
  event_id: eventId,
  user_id: userId,
  amount: 1500.00,
  currency: 'PHP',
  payment_method: 'gcash',
  subscription_tier: 'standard',
  video_addon_enabled: true
});

// Update payment status (webhook)
await db.payments.updatePaymentStatus(
  paymentId,
  'completed',
  webhookData
);
```

### Analytics and Moderation

```typescript
// Record QR code scan
await db.analytics.recordQRScan(eventId, sessionId);

// Get event analytics
const analytics = await db.analytics.getEventAnalytics(eventId, 30);

// Report content
await db.moderation.reportContent({
  event_id: eventId,
  content_type: 'photo',
  content_id: photoId,
  reporter_name: 'Anonymous',
  report_reason: 'inappropriate',
  report_description: 'This photo seems inappropriate'
});

// Get content reports
const reports = await db.moderation.getEventReports(eventId, 'pending');
```

## 🗄️ Storage Operations

### File Upload

```typescript
import { db } from '@/lib/database';

// Upload photo to storage
const { data: uploadData } = await db.storage.uploadFile(
  'event-photos',
  `event_${eventId}/photo_${Date.now()}.jpg`,
  photoFile
);

// Get public URL
const publicUrl = db.storage.getPublicUrl('event-photos', uploadData.path);

// Delete file
await db.storage.deleteFile('event-photos', filePath);
```

### Storage Buckets

The application uses four storage buckets:

- **`event-photos`**: High-resolution event photos (10MB limit)
- **`event-videos`**: Event videos (100MB limit)
- **`thumbnails`**: Compressed thumbnails (2MB limit)
- **`user-avatars`**: User profile pictures (5MB limit)

## 🔒 Security and Access Control

### Row Level Security (RLS)

All tables have RLS enabled with comprehensive policies:

- **Profiles**: Users can only access their own profile
- **Events**: Hosts manage their events, public can view active events
- **Photos/Videos**: Public can view approved content, hosts have full access
- **Contributors**: Public can register, hosts can see all contributors
- **Payments**: Users can only see their own payments
- **Analytics**: Hosts can see their event analytics

### Access Control Functions

```typescript
import { db } from '@/lib/database';

// Check if user can access event content
const canAccess = db.utils.canAccessEventContent(event, userId);

// Check if user can upload to event
const canUpload = db.utils.canUploadToEvent(event, contributorId);

// Check if videos are allowed
const canUploadVideos = db.utils.canUploadVideosToEvent(event);
```

## 📈 Performance Optimization

### Database Indexes

The schema includes strategic indexes for:

- **QR Code Lookups**: Most critical for PWA performance
- **Real-time Gallery**: Optimized for live photo/video updates
- **Moderation Queue**: Efficient content review workflows
- **Analytics Queries**: Fast dashboard performance
- **Payment Processing**: Quick webhook handling

### Query Optimization

```typescript
// Use specific status filters for better performance
const pendingPhotos = await db.photos.getEventPhotos(eventId, 'pending');

// Leverage indexes for real-time updates
const recentPhotos = await db.photos.getEventPhotos(eventId, 'approved');

// Use analytics for aggregated data instead of counting
const analytics = await db.analytics.getEventAnalytics(eventId, 7);
```

## 🧪 Testing and Development

### Local Development

```bash
# Start local Supabase
npm run db:start

# Reset database (applies migrations + seed data)
npm run db:reset

# Apply new migrations
npm run db:push

# Generate types from local database
npm run generate-types
```

### Seed Data

The database includes comprehensive seed data for development:

- **5 Sample Users**: Different profiles and preferences
- **5 Sample Events**: Various types and subscription tiers
- **11 Contributors**: Realistic upload patterns
- **9 Photos**: Sample content with metadata
- **4 Videos**: Different processing statuses
- **5 Payments**: Various Philippine payment methods
- **2 Content Reports**: Moderation testing
- **Multi-day Analytics**: Realistic engagement data

### Testing Patterns

```typescript
// Test event creation
describe('Event Operations', () => {
  it('should create a new event', async () => {
    const event = await db.events.createEvent({
      name: 'Test Event',
      event_date: '2024-12-25',
      host_user_id: testUserId,
      qr_code_id: 'TEST123'
    });
    
    expect(event.name).toBe('Test Event');
    expect(event.status).toBe('draft');
  });
});

// Test content moderation
describe('Moderation Operations', () => {
  it('should report inappropriate content', async () => {
    const report = await db.moderation.reportContent({
      event_id: testEventId,
      content_type: 'photo',
      content_id: testPhotoId,
      report_reason: 'inappropriate'
    });
    
    expect(report.status).toBe('pending');
  });
});
```

## 🚀 Production Deployment

### Migration Strategy

1. **Development**: Use local Supabase for testing
2. **Staging**: Apply migrations to staging project
3. **Production**: Apply migrations to production project

```bash
# Link to staging project
supabase link --project-ref staging-ref

# Apply migrations
supabase db push

# Link to production project
supabase link --project-ref production-ref

# Apply migrations
supabase db push
```

### Environment Variables

Ensure all environment variables are set in your deployment platform:

- **Vercel**: Add in project settings
- **Supabase**: Update redirect URLs and allowed origins
- **Payment Providers**: Configure webhook endpoints

### Monitoring

- **Supabase Dashboard**: Monitor database performance and usage
- **Vercel Analytics**: Track application performance
- **Error Tracking**: Use Sentry or similar for error monitoring

## 🔧 Maintenance and Updates

### Schema Evolution

When adding new features:

1. Create new migration: `supabase migration new feature_name`
2. Update schema in migration file
3. Test locally: `npm run db:reset`
4. Deploy to staging: `supabase db push`
5. Deploy to production: `supabase db push`
6. Regenerate types: `npm run generate-types`

### Performance Monitoring

```sql
-- Monitor table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Monitor slow queries
SELECT 
  query,
  calls,
  total_time,
  mean_time
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;
```

### Backup Strategy

- **Automatic Backups**: Supabase handles daily backups
- **Manual Exports**: Use Supabase dashboard for data exports
- **Migration History**: All schema changes are version controlled

## 📚 Additional Resources

### Documentation
- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

### Community
- [Supabase Discord](https://discord.supabase.com)
- [Supabase GitHub](https://github.com/supabase/supabase)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/supabase)

### Tools
- **pgAdmin**: Database administration
- **DBeaver**: Universal database tool
- **Supabase CLI**: Command-line interface

## 🎯 Next Steps

After implementing the database:

1. **Frontend Integration**: Connect React components to database operations
2. **Real-time Features**: Implement live updates using Supabase subscriptions
3. **Payment Integration**: Connect to Philippine payment providers
4. **Content Moderation**: Build admin interface for content review
5. **Analytics Dashboard**: Create business intelligence views
6. **Performance Testing**: Load test with realistic data volumes
7. **Security Audit**: Review RLS policies and access controls

---

**Need Help?** Check the troubleshooting section or reach out to the development team. The database is designed to be robust, scalable, and secure for production use in the Philippine market.
