import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    message: 'PWA test endpoint working',
    timestamp: new Date().toISOString(),
    status: 'online'
  });
}

export async function HEAD() {
  return new NextResponse(null, { status: 200 });
}
