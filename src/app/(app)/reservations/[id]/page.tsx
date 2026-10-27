import { notFound } from "next/navigation";
import { requireUser } from "@/lib/session";
import { getReservationById, getUserById } from "../actions";
import { getItemById } from "../../items/actions";
import CancelReservationButton from "../components/CancelReservationButton";

export default async function ReservationPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const { id } = await params;
  const reservationId = Number(id);
  if (!Number.isInteger(reservationId)) notFound();

  const reservation = await getReservationById(reservationId);
  if (!reservation) notFound();

  const item = await getItemById(reservation.itemId);
  if (!item) notFound();

  const borrower = await getUserById(reservation.borrowerId);
  if (!borrower) notFound();

  if (user.id !== borrower.id && user.id !== item.ownerId) notFound();

  return (
    <>
      <h1 className="text-center">{item.name}</h1>
      <div className="grid grid-cols-[1fr_1fr]">
        <div className="border rounded m-2 p-2 min-h-[50vh]">
          <h2 className="text-center">Item information:</h2>
          <p>Description: {item.description}</p>
          <p>Category: {item.category}</p>
          <p>Condition Notes: {item.conditionNotes}</p>
          <p>Replacement Value: {item.replacementValue}</p>
        </div>
        <div className="border rounded m-2 p-2">
          <h2 className="text-center">Reservation Information:</h2>
          <p>Reserved date: {reservation.startDate.toLocaleDateString()} - {reservation.endDate.toLocaleDateString()}</p>
          <p>Reserved by: {borrower.name}</p>
          <p>Contact: {borrower.email}</p>
          <p>Reservation created at: {reservation.createdAt.toLocaleDateString()}</p>
        </div>
      </div>
      <CancelReservationButton reservationId={reservation.id} itemName={item.name} />
    </>
  );
}