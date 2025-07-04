import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Protect the /admin route
  if (path.startsWith('/admin')) {
    const isLoggedIn = request.cookies.get('is_logged_in')?.value === 'true';

    if (!isLoggedIn) {
      // Redirect to login page if not logged in
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

// Match '/admin' and all paths under it
export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
