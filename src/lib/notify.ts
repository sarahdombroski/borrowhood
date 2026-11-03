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

export async function requestPreempt(
  ownerId: string,
  reservationId: number,
  message?: string
) {
  await prisma.$transaction(async (tx) => {
    const reservation = await tx.reservation.findUniqueOrThrow({
      where: { id: reservationId },
      include: { item: true },
    });

    if (reservation.item.ownerId !== ownerId) {
      throw new Error("Not the item owner");
    }

    await createNotifications(tx, [
      {
        recipientId: reservation.borrowerId,
        reservationId: reservation.id,
        type: "EARLY_RETURN_REQUESTED",
        payload: {
          itemName: reservation.item.name,
          originalEnd: reservation.endDate.toISOString(),
          message: message ?? null,
        },
        idempotencyKey: `preempt-request:${reservation.id}`,
      },
    ]);
  });
  await dispatchPending();
}

export async function informOfPreempt(
  ownerId: string,
  reservationId: number,
  reason?: string
) {
  await prisma.$transaction(async (tx) => {
    const reservation = await tx.reservation.findUniqueOrThrow({
      where: { id: reservationId },
      include: { item: true },
    });

    const owner = await tx.user.findFirst({
      where: { id: ownerId }
    });
    if (!owner) throw new Error("Could not find user record.")

    if (reservation.item.ownerId !== ownerId) {
      throw new Error("Not the item owner");
    }

    await createNotifications(tx, [
      {
        recipientId: reservation.borrowerId,
        reservationId: reservation.id,
        type: "RESERVATION_PREEMPTED",
        payload: {
          itemName: reservation.item.name,
          originalStart: reservation.startDate.toISOString(),
          originalEnd: reservation.endDate.toISOString(),
          preemptedBy: owner.name,
          reason: reason ?? null,
        },
        idempotencyKey: `preempted:${reservation.id}`,
      },
    ]);
  });
  await dispatchPending();
}