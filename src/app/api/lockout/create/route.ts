import { lockoutSerializer } from "@/lib/serializers/lockoutSerializer";
import { createPendingLockout } from "@/lib/utils/lockout";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { hostId, inviteeId } = data;

    if (!hostId || !inviteeId) {
      return new Response("Insufficient Parameters", {
        status: 400,
      });
    }

    // Create Lockout request
    const lockout = await createPendingLockout(hostId, inviteeId);

    return new Response(JSON.stringify(lockoutSerializer(lockout)), {
      status: 200,
      statusText: "OK",
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in lockout route:", error.message);
    } else {
      console.log(error);
    }
    return new Response("Internal Server Error", {
      status: 500,
      statusText: "Internal Server Error",
    });
  }
}
