import Link from "next/link";
import { getReservations } from "./actions";
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

  return (
    <main>
      <p>Welcome to your reservations!</p>
      <ul>
        {reservedItems.map((r) => (
          <li key={r.reservation.id}><Link href={`reservations/${r.reservation.id}`}>{r.item?.name}</Link></li>
        ))}
      </ul>
    </main>
  )
}