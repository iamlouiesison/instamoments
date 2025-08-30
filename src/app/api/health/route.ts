import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const startTime = Date.now();
  
  try {
    // Check Supabase connection
    const supabase = await createClient();
    const { error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" which is fine
      throw new Error(`Database connection failed: ${error.message}`);
    }

    // Check response time
    const responseTime = Date.now() - startTime;

    // Determine health status
    const isHealthy = responseTime < 5000; // 5 second threshold
    const status = isHealthy ? 'healthy' : 'degraded';

    return NextResponse.json({
      status,
      timestamp: new Date().toISOString(),
      responseTime,
      checks: {
        database: true,
        api: true,
        timestamp: new Date().toISOString(),
      },
      version: process.env.APP_VERSION || '0.1.0',
      environment: process.env.NODE_ENV,
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
      error: error instanceof Error ? error.message : 'Unknown error',
      checks: {
        database: false,
        api: false,
        timestamp: new Date().toISOString(),
      },
      version: process.env.APP_VERSION || '0.1.0',
      environment: process.env.NODE_ENV,
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
