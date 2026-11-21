"use server";

import { approveRequestQuery, cancelReservationQuery, declineRequestQuery, getOthersReservationsQuery, getReservationByIdQuery, getReservationsQuery, markPickedUpQuery, markReturnedQuery, preemptItemQuery } from "@/lib/queries/reservations";
import { requireUser } from "@/lib/session";
import { idSchema, preemptReasonSchema } from "@/lib/validation/schemas";
import { redirect } from "next/navigation";

export async function getReservations() {
  const user = await requireUser();
  return await getReservationsQuery(user.id);
}

export async function getOthersReservations() {
  const user = await requireUser();
  return await getOthersReservationsQuery(user.id);
}

export async function getReservationById(reservationId: number) {
  const id = idSchema.parse(reservationId);
  const user = await requireUser();
  return await getReservationByIdQuery(user.id, id);
}

export async function cancelReservation(reservationId: number) {
  const id = idSchema.parse(reservationId);
  const user = await requireUser();
  await cancelReservationQuery(user.id, id);
  redirect('/reservations');
}

export async function approveRequest(reservationId: number) {
  const id = idSchema.parse(reservationId);
  const owner = await requireUser();
  await approveRequestQuery(id, owner.id);
  redirect(`/reservations`);
}

export async function declineRequest(reservationId: number) {
  const id = idSchema.parse(reservationId);
  const owner = await requireUser();
  await declineRequestQuery(id, owner.id);
  redirect(`/reservations`);
}

export async function markPickedUp(reservationId: number) {
  const id = idSchema.parse(reservationId);
  const owner = await requireUser();
  await markPickedUpQuery(id, owner.id);
  redirect(`/reservations`);
}

export async function markReturned(reservationId: number) {
  const id = idSchema.parse(reservationId);
  const owner = await requireUser();
  await markReturnedQuery(id, owner.id);
  redirect(`/reservations`);
}

export async function preemptItem(reservationId: number, preemptionReason: string) {
  const id = idSchema.parse(reservationId);
  const reason = preemptReasonSchema.parse(preemptionReason);
  const owner = await requireUser();
  await preemptItemQuery(owner.id, id, reason);
  redirect(`/reservations`);
}