import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

export default async function middleware(req: NextRequest) {
    const session = await getSession();
    const { pathname } = req.nextUrl;

    // Auth routes that logged in users shouldn't access
    const authRoutes = [
        '/auth/signin',
        '/auth/register',
        '/auth/forgot-password'
    ];
    
    // Protected routes that require authentication
    const protectedRoutes = [
        '/posts/new',
        '/account',
        '/settings',
        // Add other protected routes
    ];

    // Role-based routes
    const adminRoutes = [
        '/admin',
        '/dashboard'
    ];

    // If user is logged in and trying to access auth pages, redirect to home
    if (session?.user && authRoutes.includes(pathname)) {
        return NextResponse.redirect(new URL('/', req.nextUrl));
    }
    
    // If user is not logged in and trying to access protected routes, redirect to signin
    if (!session?.user && protectedRoutes.some(route => pathname.startsWith(route))) {
        // Store the original URL to redirect back after login
        const callbackUrl = encodeURIComponent(pathname);
        return NextResponse.redirect(new URL(`/auth/signin?callbackUrl=${callbackUrl}`, req.nextUrl));
    }

    // Role-based access control
    if (session?.user && adminRoutes.some(route => pathname.startsWith(route)) && session.user.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/unauthorized', req.nextUrl));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        // Protected routes
        '/posts/new',
        '/account/:path*',
        '/settings/:path*',
        '/admin/:path*',
        '/dashboard/:path*',
        // Auth routes
        '/auth/:path*'
    ],
}