import "server-only";
import { prisma } from "../prisma";

export async function getReservationsQuery(userId: string) {
  return await prisma.reservation.findMany({
    where: { borrowerId: userId }
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
      }
    }
  });
}

export async function getUserByIdQuery(userId: string) {
  return await prisma.user.findFirst({
    where: { id: userId }
  });
}

export async function getReservationByIdQuery(reservationId: number) {
  return await prisma.reservation.findFirst({
    where: {
      id: reservationId
    }
  })
}

export async function cancelReservationQuery(userId: string, reservationId: number) {
  await prisma.$transaction(async (tx) => {
    await tx.reservation.delete({
      where: { id: reservationId, borrowerId: userId },
    });
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
  
  return await prisma.reservation.update({
    where: { id: requestId, status: "PENDING" },
    data: { status: "APPROVED" }
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
  
  return await prisma.reservation.update({
    where: { id: requestId, status: "DENIED" },
    data: { status: "APPROVED" }
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