import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Test database connection by querying a simple table
    const { error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);

    if (error) {
      // If profiles table doesn't exist, try a different approach
      if (error.code === '42P01') { // Table doesn't exist
        return NextResponse.json({
          status: 'warning',
          message: 'Database connection successful, but profiles table not found',
          details: 'You may need to run database migrations',
          timestamp: new Date().toISOString(),
        });
      }
      
      return NextResponse.json({
        status: 'error',
        message: 'Database connection failed',
        error: error.message,
        code: error.code,
        timestamp: new Date().toISOString(),
      }, { status: 500 });
    }

    // Test auth connection
    const { error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      return NextResponse.json({
        status: 'warning',
        message: 'Database connection successful, but auth service has issues',
        error: authError.message,
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      status: 'success',
      message: 'Supabase connection successful',
      database: 'Connected',
      auth: 'Connected',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Configured' : 'Missing',
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Configured' : 'Missing',
    });

  } catch (error) {
    console.error('Supabase connection test failed:', error);
    
    return NextResponse.json({
      status: 'error',
      message: 'Unexpected error during connection test',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    
          // Test creating a temporary record (for testing purposes)
      if (body.action === 'test-insert') {
        const { error } = await supabase
        .from('profiles')
        .insert([
          {
            id: '00000000-0000-0000-0000-000000000000', // Test UUID
            email: 'test@example.com',
            full_name: 'Test User',
            language: 'en-PH',
            timezone: 'Asia/Manila',
            email_notifications: true,
            account_status: 'active',
          }
        ])
        .select();

      if (error) {
        return NextResponse.json({
          status: 'error',
          message: 'Test insert failed',
          error: error.message,
          timestamp: new Date().toISOString(),
        }, { status: 500 });
      }

      // Clean up test data
      await supabase
        .from('profiles')
        .delete()
        .eq('id', '00000000-0000-0000-0000-000000000000');

      return NextResponse.json({
        status: 'success',
        message: 'Test insert and delete successful',
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      status: 'error',
      message: 'Invalid test action',
      timestamp: new Date().toISOString(),
    }, { status: 400 });

  } catch (error) {
    console.error('Test POST failed:', error);
    
    return NextResponse.json({
      status: 'error',
      message: 'Unexpected error during test',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
