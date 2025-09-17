import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for API routes, static files, and public assets
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }
  
  // Check if user has a session cookie
  const sessionCookie = request.cookies.get('session')?.value;
  
  // Define public routes that don't require authentication
  const publicRoutes = ['/', '/sign-in', '/sign-up'];
  const isPublicRoute = publicRoutes.includes(pathname);
  const isAuthPage = pathname === '/sign-in' || pathname === '/sign-up';
  
  // If user is trying to access a protected route without session, redirect to sign-in
  if (!isPublicRoute && !sessionCookie) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }
  
  // If user is on an auth page (sign-in/sign-up) but already has session, redirect to home
  if (isAuthPage && sessionCookie) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
