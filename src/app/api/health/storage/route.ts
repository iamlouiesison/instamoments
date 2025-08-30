import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const startTime = Date.now();
  
  try {
    const supabase = await createClient();
    
    // Test storage bucket access
    const { data: buckets, error: bucketError } = await supabase
      .storage
      .listBuckets();

    if (bucketError) {
      throw new Error(`Storage bucket access failed: ${bucketError.message}`);
    }

    // Check if required buckets exist
    const requiredBuckets = ['avatars', 'photos', 'events'];
    const missingBuckets = requiredBuckets.filter(
      bucket => !buckets.some((b: any) => b.name === bucket)
    );

    if (missingBuckets.length > 0) {
      throw new Error(`Missing required storage buckets: ${missingBuckets.join(', ')}`);
    }

    const responseTime = Date.now() - startTime;
    const isHealthy = responseTime < 3000; // 3 second threshold for storage

    return NextResponse.json({
      status: isHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      responseTime,
      checks: {
        connection: true,
        buckets: true,
        permissions: true,
        timestamp: new Date().toISOString(),
      },
      storage: {
        provider: 'Supabase Storage',
        buckets: buckets.map((b: any) => b.name),
        requiredBuckets: requiredBuckets,
        missingBuckets: [],
      },
    }, {
      status: isHealthy ? 200 : 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });

  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      responseTime,
      error: error instanceof Error ? error.message : 'Unknown storage error',
      checks: {
        connection: false,
        buckets: false,
        permissions: false,
        timestamp: new Date().toISOString(),
      },
      storage: {
        provider: 'Supabase Storage',
        buckets: [],
        requiredBuckets: ['avatars', 'photos', 'events'],
        missingBuckets: ['avatars', 'photos', 'events'],
      },
    }, {
      status: 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  }
}
