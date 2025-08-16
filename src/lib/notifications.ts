import { prisma } from "@/lib/db";

export type NotificationType = "CONTEST" | "LOCKOUT" | "SYSTEM";
export type EntityType = "Contest" | "Lockout" | "User";

interface CreateNotificationParams {
  userId: number;
  type: NotificationType;
  entityType: EntityType;
  entityId: number;
  title: string;
  message: string;
  deeplinkUrl?: string;
}

export async function createNotification({
  userId,
  type,
  entityType,
  entityId,
  title,
  message,
  deeplinkUrl,
}: CreateNotificationParams) {
  try {
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
    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
}

// Example usage:
// await createNotification({
//   userId: 1,
//   type: 'CONTEST',
//   entityType: 'Contest',
//   entityId: 123,
//   title: 'New Contest Available',
//   message: 'A new contest has been added to the platform',
//   deeplinkUrl: '/contests/123',
// });
