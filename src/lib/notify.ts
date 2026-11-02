import { Notification, NotificationType, Prisma } from "@/app/generated/prisma/client";
import { prisma } from "./prisma";

export async function createNotifications(
  tx: Prisma.TransactionClient,
  rows: {
    recipientId: string;
    reservationId: number;
    type: NotificationType;
    payload: Prisma.InputJsonValue;
    idempotencyKey: string;
  }[]
) {
  await tx.notification.createMany({
    data: rows,
    skipDuplicates: true
  });
}

export async function notify(notification: Notification): Promise<void> {
  console.log(
    `[STUB] Would notify user ${notification.recipientId}:`,
    notification.type,
    notification.payload
  );

  await prisma.notification.update({
    where: { id: notification.id },
    data: { status: "SENT", sentAt: new Date() },
  });
}

export async function dispatchPending() {
  const pending = await prisma.notification.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "asc" },
    take: 50,
  });

  for (const n of pending) {
    try {
      await notify(n);
    } catch (e) {
      await prisma.notification.update({
        where: { id: n.id },
        data: {
          status: "FAILED",
          attempts: { increment: 1 },
          lastError: String(e)
        },
      });
    }
  }
}

export async function getNotificaitonsForUser(userId: string) {
  return await prisma.notification.findMany({
    where: { recipientId: userId }
  });
}

export async function getUnreadCount(userId: string) {
  return await prisma.notification.count({
    where: { 
      recipientId: userId,
      readAt: null
    }
  });
}

export async function markAsRead(userId: string, notificationId: number) {
  const now = new Date();
  return await prisma.notification.update({
    where: { id: notificationId, recipientId: userId },
    data: { readAt: now }
  });
}

export async function deleteNotification(userId: string, notificationId: number) {
  return await prisma.notification.delete({
    where: { id: notificationId, recipientId: userId }
  });
}