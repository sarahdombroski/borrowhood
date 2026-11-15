import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { prisma } from "./prisma";
import { createNotifications, dispatchPending } from "./notify";

export async function tick(now: Date) {
  await expireUnclaimed(now);
  await createPickupReminders(now);
  await createOverdueNudges(now);
}

async function expireUnclaimed(now: Date) {
  const cutoff = new Date(now.getTime() - 2 * 60 * 60 * 1000);
  const toExpire = await prisma.reservation.findMany({
    where: {
      status: "APPROVED",
      startDate: { lt: cutoff }
    },
    include: { item: true }
  });

  for (const r of toExpire) {
    try {
      await prisma.$transaction(async (tx) => {
        await tx.reservation.update({
          where: { id: r.id, status: "APPROVED"},
          data: { status: "EXPIRED"},
        });
        await createNotifications(tx, [
          {
            recipientId: r.borrowerId,
            reservationId: r.id, 
            type: "RESERVATION_EXPIRED",
            payload: { 
              itemName: r.item.name,
              originalStart: r.startDate,
              originalEnd: r.endDate
            },
            idempotencyKey: `reservation-expired:${r.id}`,
          }
        ]);
      });
      await dispatchPending();
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError && e.code === "P2025") continue;
      throw e;
    }
  }
}

async function createPickupReminders(now: Date) {
  const pickupTime = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const toPickup = await prisma.reservation.findMany({
    where: { status: "APPROVED", startDate: { gte: now, lte: pickupTime }},
    include: { item: true },
  });
  if (toPickup.length === 0) return;

  await createNotifications(
    prisma,
    toPickup.map((r) => ({
      recipientId: r.borrowerId,
      reservationId: r.id,
      type: "PICKUP_REMINDER",
      payload: {
        itemName: r.item.name,
        originalStart: r.startDate.toISOString(),
        originalEnd: r.endDate.toISOString(),
      },
      idempotencyKey: `pickup-reminder:${r.id}`,
    }))
  );
  await dispatchPending();
}

async function createOverdueNudges(now: Date) {
  const overdueItems = await prisma.reservation.findMany({
    where: { status: "PICKED_UP", endDate: { lt: now }},
    include: { item: true },
  });
  if (overdueItems.length === 0) return;

  await createNotifications(
    prisma,
    overdueItems.map((r) => ({
      recipientId: r.borrowerId,
      reservationId: r.id,
      type: "OVERDUE_NUDGE",
      payload: {
        itemName: r.item.name,
        originalEnd: r.endDate.toISOString(),
      },
      idempotencyKey: `overdue-nudge:${r.id}`,
    }))
  );
  await dispatchPending();
}