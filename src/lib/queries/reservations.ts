import "server-only";
import { prisma } from "../prisma";

export async function getReservationsQuery(userId: string) {
  return await prisma.reservation.findMany({
    where: { borrowerId: userId }
  });
}

export async function getReservationByIdQuery(userId: string, reservationId: number) {
  return await prisma.reservation.findFirst({
    where: {
      borrowerId: userId,
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