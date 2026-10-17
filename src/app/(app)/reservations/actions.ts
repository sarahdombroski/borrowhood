"use server";

import { cancelReservationQuery, getReservationByIdQuery, getReservationsQuery } from "@/lib/queries/reservations";
import { requireUser } from "@/lib/session";
import { redirect } from "next/navigation";

export async function getReservations() {
  const user = await requireUser();
  return await getReservationsQuery(user.id);
}

export async function getReservationById(reservationId: number) {
  const user = await requireUser();
  return await getReservationByIdQuery(user.id, reservationId);
}

export async function cancelReservation(reservationId: number) {
  const user = await requireUser();
  await cancelReservationQuery(user.id, reservationId);
  redirect('/reservations');
}