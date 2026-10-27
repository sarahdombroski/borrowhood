"use server";

import { approveRequestQuery, cancelReservationQuery, declineRequestQuery, getOthersReservationsQuery, getReservationByIdQuery, getReservationsQuery, getUserByIdQuery, markPickedUpQuery, markReturnedQuery } from "@/lib/queries/reservations";
import { requireUser } from "@/lib/session";
import { redirect } from "next/navigation";

export async function getReservations() {
  const user = await requireUser();
  return await getReservationsQuery(user.id);
}

export async function getOthersReservations() {
  const user = await requireUser();
  return await getOthersReservationsQuery(user.id);
}

export async function getUserById(userId: string) {
  const user = await requireUser();
  return await getUserByIdQuery(userId);
}

export async function getReservationById(reservationId: number) {
  const user = await requireUser();
  return await getReservationByIdQuery(reservationId);
}

export async function cancelReservation(reservationId: number) {
  const user = await requireUser();
  await cancelReservationQuery(user.id, reservationId);
  redirect('/reservations');
}

export async function approveRequest(requestId: number) {
  const owner = await requireUser();
  return await approveRequestQuery(requestId, owner.id);
}

export async function declineRequest(requestId: number) {
  const owner = await requireUser();
  return await declineRequestQuery(requestId, owner.id);
}

export async function markPickedUp(requestId: number) {
  const owner = await requireUser();
  return await markPickedUpQuery(requestId, owner.id);
}

export async function markReturned(requestId: number) {
  const owner = await requireUser();
  return await markReturnedQuery(requestId, owner.id);
}