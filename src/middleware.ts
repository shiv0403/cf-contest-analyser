import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { handleError, AuthorizationError } from "@/lib/utils/errorHandler";

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isLoggedIn = !!token;
  const isProtectedRoute =
    req.nextUrl.pathname.startsWith("/lockout") ||
    req.nextUrl.pathname.startsWith("/ai-analysis");
  const isAuthRoute = req.nextUrl.pathname.startsWith("/auth");
  const isApiRoute = req.nextUrl.pathname.startsWith("/api");

  // Handle API routes
  if (isApiRoute && !isLoggedIn) {
    const error = new AuthorizationError();
    const errorResponse = handleError(error);
    return new NextResponse(errorResponse.body, {
      status: errorResponse.statusCode,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  // Handle page routes
  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/auth", req.nextUrl));
  }

  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next();
}

// Configure middleware to match specific routes
export const config = {
  matcher: [
    "/api/lockout/:path*",
    "/api/ai-analysis/:path*",
    "/lockout/:path*",
    "/ai-analysis/:path*",
    "/auth/:path*",
  ],
};
