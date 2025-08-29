import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            });
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Refresh session if expired
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Define protected routes
  const protectedRoutes = [
    '/dashboard',
    '/profile',
    '/events/create',
    '/events/edit',
    '/admin',
  ];

  // Define auth routes (login, signup, etc.)
  const authRoutes = ['/auth/login', '/auth/signup', '/auth/reset-password'];

  const { pathname } = request.nextUrl;

  // Check if user is trying to access protected routes
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  );

  // Check if user is trying to access auth routes
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  // If accessing protected route without session, redirect to login
  if (isProtectedRoute && !session) {
    const redirectUrl = new URL('/auth/login', request.url);
    redirectUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // If accessing auth routes with active session, redirect to dashboard
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Add user info to headers for server components
  if (session?.user) {
    response.headers.set('x-user-id', session.user.id);
    response.headers.set('x-user-email', session.user.email || '');
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes that don't require auth
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api/(?!auth|test)).*)',
  ],
};
