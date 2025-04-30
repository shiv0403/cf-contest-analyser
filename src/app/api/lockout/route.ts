import { lockoutSerializer } from "@/lib/serializers/lockoutSerializer";
import { getUserLockouts } from "@/lib/utils/lockout";
import { NextRequest } from "next/server";
import { handleError, ValidationError } from "@/lib/utils/errorHandler";
import { getToken } from "next-auth/jwt";

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    const searchParams = request.nextUrl.searchParams;
    const userId = parseInt(searchParams.get("userId") ?? "");

    if (!userId) {
      throw new ValidationError("User ID is required");
    }

    // Verify that the authenticated user is requesting their own data
    if (token?.id !== userId.toString()) {
      throw new ValidationError("You can only request your own lockout data");
    }

    const lockouts = await getUserLockouts(userId);
    const serializedLockouts = lockouts.map((lc) => lockoutSerializer(lc));

    return new Response(JSON.stringify(serializedLockouts), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    const errorResponse = handleError(error);
    return new Response(errorResponse.body, {
      status: errorResponse.statusCode,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
