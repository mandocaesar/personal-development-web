import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

// Define which roles can access which routes
const ROLE_ROUTE_ACCESS: Record<string, string[]> = {
  '/admin':  ['ADMIN'],
  '/users':  ['ADMIN', 'MANAGER'],
};

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    if (!token) {
      return NextResponse.redirect(new URL('/auth/signin', req.url));
    }

    const userRole = (token.role as string) || '';

    // Check role-based access
    for (const [route, allowedRoles] of Object.entries(ROLE_ROUTE_ACCESS)) {
      if (pathname.startsWith(route) && !allowedRoles.includes(userRole)) {
        return NextResponse.redirect(new URL('/unauthorized', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: '/auth/signin',
    },
  }
);

export const config = {
  matcher: [
    '/',
    '/admin/:path*',
    '/team/:path*',
    '/users/:path*',
    '/assessment/:path*',
    '/projects/:path*',
    '/learning/:path*',
    '/calendar/:path*',
    '/results/:path*',
  ],
};
