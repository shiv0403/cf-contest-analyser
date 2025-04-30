import { lockoutSerializer } from "@/lib/serializers/lockoutSerializer";
import {
  handleError,
  InsufficientParametersError,
  NotFoundError,
} from "@/lib/utils/errorHandler";
import { createPendingLockout } from "@/lib/utils/lockout";
import { getUserByUserHandle } from "@/lib/utils/user";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { hostId, opponentHandle } = data;

    if (!hostId || !opponentHandle) {
      throw new InsufficientParametersError();
    }

    const opponent = await getUserByUserHandle(opponentHandle);

    if (!opponent) {
      throw new NotFoundError("Opponent not found");
    }

    // Create Lockout request
    const lockout = await createPendingLockout(parseInt(hostId), opponent.id);

    return new Response(JSON.stringify(lockoutSerializer(lockout)), {
      status: 200,
      statusText: "OK",
    });
  } catch (error) {
    const errorResponse = handleError(error);
    return new Response(errorResponse.body, {
      status: errorResponse.statusCode,
    });
  }
}
