import { NextRequest, NextResponse } from "next/server";
import { getJwtToken } from "@/lib/utils/auth";
import { prisma } from "@/lib/db";
import { handleError, ValidationError } from "@/lib/utils/errorHandler";
import { sendSuccessResponse } from "@/lib/utils/responseHandler";

// GET /api/notifications - Get user's notifications with pagination
export async function GET(request: NextRequest) {
  try {
    const token = await getJwtToken(request);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;
    console.log({ token });
    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where: {
          userId: parseInt(token.id as string),
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.notification.count({
        where: {
          userId: parseInt(token.id as string),
        },
      }),
    ]);

    return sendSuccessResponse(
      {
        notifications,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
      "Notifications fetched successfully"
    );
  } catch (error) {
    console.log({ error });
    const errorResponse = handleError(
      new ValidationError(`Failed to fetch notifications: ${error}`)
    );
    return new Response(errorResponse.body, {
      status: errorResponse.statusCode,
    });
  }
}

// POST /api/notifications - Create a new notification
export async function POST(request: NextRequest) {
  try {
    const token = await getJwtToken(request);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { userId, type, entityType, entityId, title, message, deeplinkUrl } =
      body;

    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        entityType,
        entityId,
        title,
        message,
        deeplinkUrl,
      },
    });

    return sendSuccessResponse(
      notification,
      "Notification created successfully"
    );
  } catch (error) {
    const errorResponse = handleError(
      new ValidationError(`Failed to create notification: ${error}`)
    );
    return new Response(errorResponse.body, {
      status: errorResponse.statusCode,
    });
  }
}
