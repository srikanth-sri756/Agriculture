import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

// Server-side route protection. Replaces relying on client-side redirects
// in /dashboard, /wizard and /admin pages.
//
// In Next.js 16 the `middleware` file convention was renamed to `proxy`.
export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET || "ocf-spin-secret-key-change-in-production",
  });

  // Not signed in → bounce to /login
  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Admin-only area
  if (pathname.startsWith("/admin") && token.role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Farmer-only areas
  if (
    (pathname.startsWith("/dashboard") || pathname.startsWith("/wizard")) &&
    token.role === "admin"
  ) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/wizard/:path*", "/admin/:path*"],
};
