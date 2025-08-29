import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const supabase = createClient();
    
    // Test database connection with a simple query
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);

    if (error) {
      throw new Error(`Database query failed: ${error.message}`);
    }

    const responseTime = Date.now() - startTime;
    const isHealthy = responseTime < 3000; // 3 second threshold for DB

    return NextResponse.json({
      status: isHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      responseTime,
      checks: {
        connection: true,
        query: true,
        timestamp: new Date().toISOString(),
      },
      database: {
        type: 'PostgreSQL',
        provider: 'Supabase',
        connectionPool: 'active',
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
      error: error instanceof Error ? error.message : 'Unknown database error',
      checks: {
        connection: false,
        query: false,
        timestamp: new Date().toISOString(),
      },
      database: {
        type: 'PostgreSQL',
        provider: 'Supabase',
        connectionPool: 'inactive',
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
