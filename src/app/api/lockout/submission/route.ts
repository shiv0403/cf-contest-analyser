import { getUserSubmissionsForLockoutProblem } from "@/lib/utils/codeforces";
import { createLockoutSubmissions, getLockout } from "@/lib/utils/lockout";
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

    const lockout = await getLockout(lockoutId);
    if (!lockout) {
      return new Response("Lockout not found", {
        status: 404,
      });
    }
    // Lookup for host and invitee submissions for lockout problems
    const problemIdVsSubmissionHost = await getUserSubmissionsForLockoutProblem(
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
