import { enqueueLockoutWinnerEval } from "@/lib/queues/lockoutQueue";
import { lockoutSerializer } from "@/lib/serializers/lockoutSerializer";
import {
  handleError,
  InsufficientParametersError,
} from "@/lib/utils/errorHandler";
import { acceptLockout, getAcceptedLockout } from "@/lib/utils/lockout";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const lockoutId = parseInt(searchParams.get("lockoutId") ?? "");
    if (!lockoutId) {
      throw new InsufficientParametersError();
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
    const errorResponse = handleError(error);
    return new Response(errorResponse.body, {
      status: errorResponse.statusCode,
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { lockoutId } = data;
    if (!lockoutId) {
      throw new InsufficientParametersError();
    }

    const lockout = await acceptLockout(lockoutId);

    if (!lockout.endTime) {
      throw new Error("Missing lockout end time");
    }

    // Schedule a worker which will run at the end time of the lockout and evaluate the winner of the contest. Use bullmq for this.
    await enqueueLockoutWinnerEval(lockout.id);

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
