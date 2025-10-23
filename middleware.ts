// MIDDLEWARE COMPLETELY DISABLED FOR BOLT.NEW COMPATIBILITY
// bolt.new does not support Next.js middleware due to lack of Node.js AsyncLocalStorage
// To re-enable for production deployment, uncomment all code below

/*
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth_token')?.value;

  // If the path is under /auth/*
  if (pathname.startsWith('/auth')) {
    // If user is authenticated, redirect to dashboard
    if (token) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    // Allow access to auth pages if not authenticated
    return NextResponse.next();
  }

  // For all other app routes, require authentication
  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Allow access
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next|static|favicon.ico|api).*)',
  ],
};
*/

export function middleware(request: NextRequest) {}