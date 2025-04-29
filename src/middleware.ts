import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret:
      process.env.NEXTAUTH_SECRET ||
      "Qr9F5ciQKLYmhPi68rBZSY+93NBHJ0/ZeCuB9Qu2hYY=",
  });
  const isLoggedIn = !!token;
  const isProtectedRoute =
    req.nextUrl.pathname.startsWith("/lockout") ||
    req.nextUrl.pathname.startsWith("/ai-analysis");
  const isAuthRoute = req.nextUrl.pathname.startsWith("/auth");

  if (isProtectedRoute && !isLoggedIn) {
    return Response.redirect(new URL("/auth", req.nextUrl));
  }

  if (isAuthRoute && isLoggedIn) {
    return Response.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next();
}

// Optionally configure middleware to match specific routes
export const config = {
  matcher: ["/lockout/:path*", "/ai-analysis/:path*", "/auth/:path*"],
};
