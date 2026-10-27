import Link from "next/link";
import { getOthersReservations, getReservations } from "./actions";
import { getItemById } from "../items/actions";

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
    reservations.map(async (r) => {
      const item = await getItemById(r.itemId);
      return {
        reservation: r,
        item
      };
    }),
  );

  return (
    <main>
      <h1 className="text-center">Reservations</h1>
      <div className="grid grid-cols-[1fr_1fr] items_center gap-4 py-2 m-2">
        <ul className="border rounded p-2 min-h-[50vh]">
          <h2 className="text-center">Reservations on my Items:</h2>
          {othersReservedItems.map((r) => (
              <li key={r.reservation.id}>
                <Link href={`reservations/${r.reservation.id}`}>
                  {r.item?.name} - {r.reservation.status}
                </Link>
              </li>
          ))}
        </ul>
        <ul className="border rounded p-2">
          <h2 className="text-center">My reservations:</h2>
          {reservedItems.map((r) => (
              <li key={r.reservation.id}>
                <Link href={`reservations/${r.reservation.id}`}>
                  {r.item?.name} - {r.reservation.status}
                </Link>
              </li>
          ))}
        </ul>
      </div>
    </main>
  )
}