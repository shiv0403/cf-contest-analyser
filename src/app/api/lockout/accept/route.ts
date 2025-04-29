import { enqueueLockoutWinnerEval } from "@/lib/queues/lockoutQueue";
import { lockoutSerializer } from "@/lib/serializers/lockoutSerializer";
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

    return new Response(
      JSON.stringify({ lockout: lockoutSerializer(lockout), problems }),
      {
        status: 200,
        statusText: "OK",
      }
    );
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

    if (!lockout.endTime) {
      return new Response("Missing lockout end time", { status: 400 });
    }

    // Schedule a worker which will run at the end time of the lockout and evaluate the winner of the contest. Use bullmq for this.
    enqueueLockoutWinnerEval(lockout.id);

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
