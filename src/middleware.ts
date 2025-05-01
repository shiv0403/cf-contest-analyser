import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { handleError, AuthorizationError } from "@/lib/utils/errorHandler";

export async function middleware(req: NextRequest) {
  try {
    // Get the actual host from headers
    const host = req.headers.get("host") || "";
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
    const baseUrl = `${protocol}://${host}`;

    // Create a new URL object with the correct base URL
    const url = new URL(req.url, baseUrl);

    // Create a new request with the correct URL
    const correctedReq = new NextRequest(url.toString(), {
      headers: req.headers,
      method: req.method,
      body: req.body,
    });

    const token = await getToken({
      req: correctedReq,
      secret: process.env.NEXTAUTH_SECRET,
      secureCookie: true,
      cookieName: "__Secure-next-auth.session-token",
    });

    const isLoggedIn = !!token;
    const isProtectedRoute =
      req.nextUrl.pathname.startsWith("/lockout") ||
      req.nextUrl.pathname.startsWith("/ai-analysis");
    const isAuthRoute = req.nextUrl.pathname.startsWith("/auth");
    const isApiRoute = req.nextUrl.pathname.startsWith("/api");

    console.log({
      token,
      isLoggedIn,
      isProtectedRoute,
      isAuthRoute,
      isApiRoute,
      secret: process.env.NEXTAUTH_SECRET,
      cookies: req.cookies.getAll().map((cookie) => ({
        name: cookie.name,
        value: cookie.value,
      })),
      headers: {
        host: req.headers.get("host"),
        cookie: req.headers.get("cookie"),
        "x-forwarded-proto": req.headers.get("x-forwarded-proto"),
        "x-forwarded-host": req.headers.get("x-forwarded-host"),
      },
      nextAuthUrl: process.env.NEXTAUTH_URL,
      nodeEnv: process.env.NODE_ENV,
      originalRequestUrl: req.url,
      correctedRequestUrl: correctedReq.url,
      baseUrl,
      protocol,
    });

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
  } catch (error) {
    console.error("Error in middleware:", error);
    const errorResponse = handleError(error);
    return new NextResponse(errorResponse.body, {
      status: errorResponse.statusCode,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
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
