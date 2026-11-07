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
  const notifs = await prisma.notification.findMany({
    where: { 
      recipientId: userId,
      readAt: null
    }
  });
  return notifs;
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
    const owner = await prisma.user.findFirst({
      where: { id: ownerId }
    });
    if (!owner) throw new Error("Cannot find the owner.")

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
          owner: owner.name,
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

export async function informOnwerOfNewReservation(
  ownerId: string,
  reservationId: number,
  message?: string
) {
  await prisma.$transaction(async (tx) => {
    const reservation = await tx.reservation.findUniqueOrThrow({
      where: { id: reservationId },
      include: { item: true, borrower: true },
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
        recipientId: ownerId,
        reservationId: reservation.id,
        type: "RESERVATION_PENDING",
        payload: {
          itemName: reservation.item.name,
          start: reservation.startDate.toISOString(),
          end: reservation.endDate.toISOString(),
          requester: reservation.borrower.name,
          message: message ?? null
        },
        idempotencyKey: `requested:${reservation.id}`,
      },
    ]);
  });
  await dispatchPending();
}

export async function informOfApproved(
  ownerId: string,
  reservationId: number,
  message?: string
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
        type: "RESERVATION_APPROVED",
        payload: {
          itemName: reservation.item.name,
          start: reservation.startDate.toISOString(),
          end: reservation.endDate.toISOString(),
          message: message ?? null
        },
        idempotencyKey: `approved:${reservation.id}`,
      },
    ]);
  });
  await dispatchPending();
}

export async function informOfDenied(
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
        type: "RESERVATION_DENIED",
        payload: {
          itemName: reservation.item.name,
          reason: reason ?? null
        },
        idempotencyKey: `denied:${reservation.id}`,
      },
    ]);
  });
  await dispatchPending();
}

export async function informOfCancelled(
  ownerId: string,
  reservationId: number,
  reason?: string
) {
  await prisma.$transaction(async (tx) => {
    const reservation = await tx.reservation.findUniqueOrThrow({
      where: { id: reservationId },
      include: { item: true, borrower: true },
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
        recipientId: ownerId,
        reservationId: reservation.id,
        type: "RESERVATION_CANCELLED",
        payload: {
          itemName: reservation.item.name,
          originalStart: reservation.startDate,
          originalEnd: reservation.endDate,
          originalBorrower: reservation.borrower.name,
          reason: reason ?? null
        },
        idempotencyKey: `cancelled:${reservation.id}`,
      },
    ]);
  });
  await dispatchPending();
}