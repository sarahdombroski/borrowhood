import Link from "next/link";
import { getOthersReservations, getReservations } from "./actions";
import { getItemById } from "../items/actions";
import ApproveReservationButton from "./components/ApproveReservationButton";
import DenyReservationButton from "./components/DenyReservationButton";

export default async function Reservations() {
  const reservations = await getReservations();
  const reservedItems = await Promise.all(
    reservations.map(async (r) => {
      const item = await getItemById(r.itemId);
      return {
        reservation: r,
        item
      };
    }),
  );
  
  const othersReservations = await getOthersReservations();
  const othersReservedItems = await Promise.all(
    othersReservations.map(async (r) => {
      const item = await getItemById(r.itemId);
      return {
        reservation: r,
        borrower: r.borrower,
        item: item
      };
    }),
  );

  return (
    <main>
      <h1 className="text-center">Reservations</h1>
      <div className="md:grid grid-cols-[1fr_1fr] items_center gap-4 py-2 m-2">
        <ul className="border rounded p-2 min-h-[50vh] mb-3 md:mb-0">
          <h2 className="text-center">Reservations on my Items:</h2>
          {othersReservedItems.map((r) => (
            <li key={r.reservation.id} className="md:flex justify-between items-center">
              <Link href={`/reservations/${r.reservation.id}`}>
                {r.item?.name} - {r.reservation.status}
              </Link>
              {r.reservation.status === "PENDING" && (
                <div className="flex justify-end">
                  <ApproveReservationButton reservation={r.reservation} borrowerName={r.borrower.name} itemName={r.item?.name} />
                  <DenyReservationButton reservation={r.reservation} borrowerName={r.borrower.name} itemName={r.item?.name} />
                </div>
              )}
              <div className="text-right">
                <p>{r.reservation.startDate.toLocaleDateString()} - {r.reservation.endDate.toLocaleDateString()}</p>
              </div>
            </li>
          ))}
        </ul>
        <ul className="border rounded p-2">
          <h2 className="text-center">My reservations:</h2>
          {reservedItems.map((r) => (
              <li key={r.reservation.id} className="md:flex justify-between items-center">
                <Link href={`/reservations/${r.reservation.id}`}>
                  {r.item?.name} - {r.reservation.status}
                </Link>
                <div>
                  <p className="text-right">{r.reservation.startDate.toLocaleDateString()} - {r.reservation.endDate.toLocaleDateString()}</p>
                </div>
              </li>
          ))}
        </ul>
      </div>
    </main>
  )
}