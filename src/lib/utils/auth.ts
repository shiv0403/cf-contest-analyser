import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import { AuthenticationError } from "./errorHandler";

export async function requireAuth(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    throw new AuthenticationError("Authentication required");
  }

  return token;
}
