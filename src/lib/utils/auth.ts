import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export async function getJwtToken(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    cookieName:
      process.env.NODE_ENV === "production"
        ? "__Secure-authjs.session-token"
        : "authjs.session-token",
  });

  return token;
}
