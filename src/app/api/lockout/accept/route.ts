import { acceptLockout, getAcceptedLockout } from "@/lib/utils/lockout";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const lockoutId = parseInt(searchParams.get("lockoutId") ?? "");
    if (!lockoutId) {
      return new Response("Insufficient Parameters", {
        status: 400,
      });
    }
    const { lockout, problems } = await getAcceptedLockout(lockoutId);
    return new Response(JSON.stringify({ lockout, problems }), {
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
    const { lockoutId } = data;
    if (!lockoutId) {
      return new Response("Insufficient Parameters", {
        status: 400,
      });
    }

    const lockout = await acceptLockout(lockoutId);
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
