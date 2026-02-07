
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Only protect admin routes
    if (request.nextUrl.pathname.startsWith('/admin')) {

        // Ignore login page itself
        if (request.nextUrl.pathname === '/admin/login') {
            return NextResponse.next();
        }

        // Check for auth token in cookies
        const authToken = request.cookies.get('auth_token');

        if (!authToken || authToken.value !== 'admin-token') {
            // Redirect to login if not authenticated
            const loginUrl = new URL('/admin/login', request.url);
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/admin/:path*',
};
