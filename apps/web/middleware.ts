import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export default async function middleware(req: NextRequest) {
  const session = await getSession();
  const { pathname } = req.nextUrl;

  // Auth routes that logged in users shouldn't access
  const authRoutes = [
    "/auth/signin",
    "/auth/register",
    "/auth/forgot-password",
  ];

  // Protected routes that require authentication
  const protectedRoutes = [
    "/account",
    "/profile",
    "/posts/new",
    "/posts/edit",
    // Add other protected routes
  ];

  // Role-based routes
  const adminRoutes = ["/admin", "/admin/dashboard"];

  // If user is logged in and trying to access auth pages, redirect to home
  if (session?.user && authRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  // If user is not logged in and trying to access protected routes, redirect to signin
  if (
    (!session?.user &&
      protectedRoutes.some((route) => pathname.startsWith(route))) ||
    adminRoutes.some((route) => pathname.startsWith(route))
  ) {
    // Store the original URL to redirect back after login
    const callbackUrl = encodeURIComponent(pathname);
    return NextResponse.redirect(
      new URL(`/auth/signin?callbackUrl=${callbackUrl}`, req.nextUrl)
    );
  }

  // Role-based access control
  if (
    session?.user &&
    adminRoutes.some((route) => pathname.startsWith(route)) &&
    session.user.role !== "ADMIN"
  ) {
    return NextResponse.redirect(new URL("/unauthorized", req.nextUrl));
  }

  // For all other routes, just continue to the page
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
