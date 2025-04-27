import { createPendingLockout, getUserLockouts } from "@/lib/utils/lockout";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = parseInt(searchParams.get("userId") ?? "");

    if (!userId) {
      return new Response("Insufficient Parameters", {
        status: 400,
      });
    }

    const lockouts = await getUserLockouts(userId);

    return new Response(JSON.stringify(lockouts), {
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

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { hostId, inviteeId } = data;

    if (!hostId) {
      return new Response("Insufficient Parameters", {
        status: 400,
      });
    }

    // Create Lockout request
    const lockout = await createPendingLockout(hostId, inviteeId);

    return new Response(JSON.stringify(lockout), {
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
