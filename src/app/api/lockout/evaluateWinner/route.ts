import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { handleError, NotFoundError } from "@/lib/utils/errorHandler";
import { sendSuccessResponse } from "@/lib/utils/responseHandler";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { lockoutId } = data;
    let status = false;

    const lockout = await prisma.lockout.findFirst({
      where: {
        id: lockoutId,
      },
      include: {
        host: true,
        invitee: true,
        LockoutSubmissions: {
          include: {
            submission: true,
          },
        },
      },
    });

    if (!lockout) {
      throw new NotFoundError(`Lockout with id: ${lockoutId} not found`);
    }

    const lockoutSubmissions = lockout.LockoutSubmissions;
    if (lockoutSubmissions.length > 0) {
      const hostSubmissions = lockoutSubmissions.filter(
        (sb) => sb.submission.userHandle === lockout.host.userHandle
      );
      const inviteeSubmissions = lockoutSubmissions.filter(
        (sb) => sb.submission.userHandle === lockout.invitee.userHandle
      );

      // No winner
      if (hostSubmissions.length === 0 && inviteeSubmissions.length === 0) {
        status = false;
      }

      let winnerId = -1;
      if (hostSubmissions.length === inviteeSubmissions.length) {
        // find the fastest completion time
        const hostMaxTime = Math.max(
          ...hostSubmissions.map((sb) => sb.submission.creationTimeSeconds)
        );
        const inviteeMaxTime = Math.max(
          ...inviteeSubmissions.map((sb) => sb.submission.creationTimeSeconds)
        );

        if (hostMaxTime > inviteeMaxTime) {
          winnerId = lockout.inviteeId;
        } else if (hostMaxTime < inviteeMaxTime) {
          winnerId = lockout.hostId;
        }
      } else if (hostSubmissions.length > inviteeSubmissions.length) {
        winnerId = lockout.hostId;
      } else if (hostSubmissions.length < inviteeSubmissions.length) {
        winnerId = lockout.inviteeId;
      }

      if (winnerId !== -1) {
        await prisma.lockout.update({
          where: {
            id: lockoutId,
          },
          data: {
            winnerId,
            status: "completed",
          },
        });
        status = true;
      } else {
        await prisma.lockout.update({
          where: {
            id: lockoutId,
          },
          data: {
            status: "completed",
          },
        });
        status = false;
      }
    } else {
      await prisma.lockout.update({
        where: {
          id: lockoutId,
        },
        data: {
          status: "completed",
        },
      });
      status = false;
    }

    return sendSuccessResponse({ isEvaluated: status });
  } catch (error) {
    const errorResponse = handleError(error);
    return new Response(errorResponse.body, {
      status: errorResponse.statusCode,
    });
  }
}
