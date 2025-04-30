import { lockoutSerializer } from "@/lib/serializers/lockoutSerializer";
import { getUserSubmissionsForLockoutProblem } from "@/lib/utils/codeforces";
import {
  handleError,
  InsufficientParametersError,
  NotFoundError,
} from "@/lib/utils/errorHandler";
import { createLockoutSubmissions, getLockout } from "@/lib/utils/lockout";
import { NextRequest } from "next/server";
import { sendSuccessResponse } from "@/lib/utils/responseHandler";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const lockoutId = parseInt(searchParams.get("lockoutId") ?? "");
    if (!lockoutId) {
      throw new InsufficientParametersError();
    }

    const lockout = await getLockout(lockoutId);
    if (!lockout) {
      throw new NotFoundError();
    }

    if (lockout.status !== "completed") {
      // Lookup for host and invitee submissions for lockout problems
      const problemIdVsSubmissionHost =
        await getUserSubmissionsForLockoutProblem(
          lockout.host.userHandle,
          lockout
        );

      const problemIdVsSubmissionInvitee =
        await getUserSubmissionsForLockoutProblem(
          lockout.invitee.userHandle,
          lockout
        );

      // Create lockout submission entries and submission entries
      await createLockoutSubmissions(
        lockout,
        problemIdVsSubmissionHost,
        problemIdVsSubmissionInvitee
      );
    }

    return sendSuccessResponse(
      lockoutSerializer(lockout),
      "Lockout submissions retrieved successfully"
    );
  } catch (error) {
    const errorResponse = handleError(error);
    return new Response(errorResponse.body, {
      status: errorResponse.statusCode,
    });
  }
}
