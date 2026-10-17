import { notFound } from "next/navigation";
import { requireUser } from "@/lib/session";
import { getReservationById } from "../actions";
import { getItemById } from "../../items/actions";
import CancelReservationButton from "@/app/components/CancelReservationButton";

export default async function ReservationPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const { id } = await params;
  const reservationId = Number(id);
  if (!Number.isInteger(reservationId)) notFound();

  const reservation = await getReservationById(reservationId);
  if (!reservation) notFound();

  const item = await getItemById(reservation.itemId);
  if (!item) return;

  return (
    <>
      <h1>{item.name}</h1>
      <p>Reserved date: {reservation.startDate.toLocaleDateString()} - {reservation.endDate.toLocaleDateString()}</p>
      <CancelReservationButton reservationId={reservation.id} itemName={item.name} />
    </>
  );
}