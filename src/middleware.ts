import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'travel-hault-super-secret-key-2026'
);

const COOKIE_NAME = 'th_admin_session';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only run middleware for /manage paths
  if (!pathname.startsWith('/manage')) {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;
  let isAuthenticated = false;

  if (token) {
    try {
      await jwtVerify(token, JWT_SECRET);
      isAuthenticated = true;
    } catch {
      isAuthenticated = false;
    }
  }

  // If on login page and authenticated, redirect to /manage
  if (pathname === '/manage/login') {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/manage', request.url));
    }
    return NextResponse.next();
  }

  // If on protected manage route and NOT authenticated, redirect to /manage/login
  if (!isAuthenticated) {
    const loginUrl = new URL('/manage/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/manage/:path*'],
};
