import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const startTime = Date.now();
  
  try {
    const supabase = await createClient();
    
    // Test auth service by checking session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      throw new Error(`Auth session check failed: ${sessionError.message}`);
    }

    // Test auth configuration by checking if we can access auth settings
    const { error: settingsError } = await supabase.auth.admin.listUsers();

    // Note: This might fail in production if service role key is not set, which is fine
    const hasAdminAccess = !settingsError;

    const responseTime = Date.now() - startTime;
    const isHealthy = responseTime < 3000; // 3 second threshold for auth

    return NextResponse.json({
      status: isHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      responseTime,
      checks: {
        connection: true,
        session: true,
        admin: hasAdminAccess,
        timestamp: new Date().toISOString(),
      },
      auth: {
        provider: 'Supabase Auth',
        sessionActive: !!session,
        adminAccess: hasAdminAccess,
        features: ['email', 'password', 'oauth'],
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
      error: error instanceof Error ? error.message : 'Unknown auth error',
      checks: {
        connection: false,
        session: false,
        admin: false,
        timestamp: new Date().toISOString(),
      },
      auth: {
        provider: 'Supabase Auth',
        sessionActive: false,
        adminAccess: false,
        features: ['email', 'password', 'oauth'],
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
