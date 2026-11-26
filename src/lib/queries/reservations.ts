import "server-only";
import { prisma, requireVisibleReservation } from "../prisma";
import { informOfApproved, informOfCancelled, informOfDenied, informOfPreempt, requestPreempt } from "../notify";

export async function getReservationsQuery(userId: string) {
  return await prisma.reservation.findMany({
    where: { borrowerId: userId },
    orderBy: { startDate: "asc" }
  });
}

export async function getOthersReservationsQuery(userId: string) {
  const items = await prisma.item.findMany({
    where: { ownerId: userId }
  });

  const itemIds = items.map((item) => item.id);

  return await prisma.reservation.findMany({
    where: {
      itemId: {
        in: itemIds
      },
      status: {
        not: "OWNER_BLACKED_OUT"
      }
    },
    include: { 
      borrower: {
        select: {
          id: true,
          name: true,
          email: true
        }
    }},
    orderBy: { startDate: "asc"}
  });
}

export async function getReservationByIdQuery(userId: string, reservationId: number) {
  await requireVisibleReservation(userId, reservationId);
  return await prisma.reservation.findFirst({
    where: {
      id: reservationId
    },
    include: { 
      borrower: {
        select: {
          id: true,
          name: true,
          email: true
        }
    }}
  });
}

export async function cancelReservationQuery(userId: string, reservationId: number) {
  const reservation = await prisma.reservation.findFirst({
    where: { id: reservationId },
    include: { item: true }
  });
  if (!reservation) throw new Error('No reservation found');
  await prisma.$transaction(async (tx) => {
    await tx.reservation.delete({
      where: { id: reservationId, borrowerId: userId },
    });
    await informOfCancelled(reservation.item.ownerId, reservationId);
  });
}

export async function approveRequestQuery(requestId: number, ownerId: string) {
  const reservation = await prisma.reservation.findFirst({
    where: { id: requestId }
  });
  if (!reservation) throw new Error("There is no reservation with that id.");
  const item = await prisma.item.findFirst({
    where: { id: reservation.itemId }
  });
  if (!item || item.ownerId !== ownerId) throw new Error("There was a problem grabbing the item.");
  
  await prisma.$transaction(async (tx) => {
    await informOfApproved(ownerId, reservation.id);
    await tx.reservation.update({
      where: { id: requestId, status: "PENDING" },
      data: { status: "APPROVED" }
    });
  });
}

export async function declineRequestQuery(requestId: number, ownerId: string) {
  const reservation = await prisma.reservation.findFirst({
    where: { id: requestId }
  });
  if (!reservation) throw new Error("There is no reservation with that id.");
  const item = await prisma.item.findFirst({
    where: { id: reservation.itemId }
  });
  if (!item || item.ownerId !== ownerId) throw new Error("There was a problem grabbing the item.");
  
  await prisma.$transaction(async (tx) => {
    await informOfDenied(ownerId, reservation.id)
    await tx.reservation.update({
      where: { id: requestId, status: "PENDING" },
      data: { status: "DENIED" }
    });
  });
}

export async function markPickedUpQuery(requestId: number, ownerId: string) {
const reservation = await prisma.reservation.findFirst({
    where: { id: requestId }
  });
  if (!reservation) throw new Error("There is no reservation with that id.");
  const item = await prisma.item.findFirst({
    where: { id: reservation.itemId }
  });
  if (!item || item.ownerId !== ownerId) throw new Error("There was a problem grabbing the item.");
  
  return await prisma.reservation.update({
    where: { id: requestId, status: "APPROVED" },
    data: { status: "PICKED_UP" }
  });
}

export async function markReturnedQuery(requestId: number, ownerId: string) {
  const reservation = await prisma.reservation.findFirst({
    where: { id: requestId }
  });
  if (!reservation) throw new Error("There is no reservation with that id.");
  const item = await prisma.item.findFirst({
    where: { id: reservation.itemId }
  });
  if (!item || item.ownerId !== ownerId) throw new Error("There was a problem grabbing the item.");
  
  return await prisma.reservation.update({
    where: { id: requestId, status: "PICKED_UP" },
    data: { status: "RETURNED" }
  });
}

export async function preemptItemQuery(ownerId: string, reservationId: number, preemptionReason: string) {
  const reservation = await prisma.reservation.findFirst({
    where: { id: reservationId, status: { in: ["APPROVED", "PICKED_UP"] } },
    include: { item: true }
  });
  if (!reservation) return;
  if (reservation.item.ownerId != ownerId) throw new Error('You do not own this item.');
  
  const now = new Date();
  const diffInMs = Math.abs(reservation.startDate.getTime() - now.getTime());
  const fortyEightHoursInMs = 48 * 60 * 60 * 1000;
  if (diffInMs < fortyEightHoursInMs || reservation.status === "PICKED_UP") {
    await requestPreempt(ownerId, reservationId);
    return;
  }

  await prisma.reservation.update({
    where: { id: reservationId },
    data: { 
      status: "PREEMPTED", 
      preemptedAt: now, 
      preemptedById: ownerId,
      preemptedReason: preemptionReason
    }
  });

  const newReservation = await prisma.reservation.create({
    data: {
      itemId: reservation.item.id,
      borrowerId: ownerId,
      startDate: reservation.startDate,
      endDate: reservation.endDate,
      status: "OWNER_BLACKED_OUT"
    }
  });

  await informOfPreempt(ownerId, reservationId);
  return newReservation;
}