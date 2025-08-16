import { NextRequest, NextResponse } from "next/server";
import { getJwtToken } from "@/lib/utils/auth";
import { prisma } from "@/lib/db";
import { handleError, ValidationError } from "@/lib/utils/errorHandler";
import { sendSuccessResponse } from "@/lib/utils/responseHandler";

// POST /api/notifications/mark-read - Mark notifications as read
export async function POST(request: NextRequest) {
  try {
    const token = await getJwtToken(request);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { notificationIds } = body;

    if (!Array.isArray(notificationIds)) {
      const errorResponse = handleError(
        new ValidationError("notificationIds must be an array")
      );
      return new Response(errorResponse.body, {
        status: errorResponse.statusCode,
      });
    }

    await prisma.notification.updateMany({
      where: {
        id: {
          in: notificationIds,
        },
        userId: parseInt(token.id as string),
      },
      data: {
        isRead: true,
      },
    });

    return sendSuccessResponse(
      { success: true },
      "Notifications marked as read"
    );
  } catch (error) {
    const errorResponse = handleError(
      new ValidationError(`Failed to mark notifications as read: ${error}`)
    );
    return new Response(errorResponse.body, {
      status: errorResponse.statusCode,
    });
  }
}
