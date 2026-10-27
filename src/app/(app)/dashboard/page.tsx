import { getCurrentUser } from "@/lib/session"
import { getCurrentAvailability, getItemById, getMyItems } from "../items/actions";
import { notFound } from "next/navigation";
import { Item } from "@/app/generated/prisma/client";
import { getMyGroups } from "../groups/actions";
import { getOthersReservations } from "../reservations/actions";

export default async function Dashboard() {
  const user = await getCurrentUser();
  if (!user) notFound();
  
  const items = await getMyItems();
  const itemsInformation = await Promise.all(
    items.map((item) => getItemAvaliability(item))
  );
  async function getItemAvaliability(item: Item) {
    const availability = await getCurrentAvailability(item.id);
    const status = availability ? availability.status ?? availability : "AVAILABLE";
    return {item, status};
  }

  const groups = await getMyGroups();

  const reservations = await getOthersReservations();
  const reservationsAndNames = await Promise.all(
    reservations.map(async (reservation) => {
      const item = await getItemById(reservation.itemId);
      return {reservation, item}
    })
  )

  return (
    <main>
      <h1 className="text-center">Welcome {user.name}!</h1>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 grid grid-cols-6 gap-6 ml-6">
          <div className="border rounded col-span-4 col-start-1 min-h-[25vh]">
            <h2 className="text-center">New Requests</h2>
            <ul>
              {reservationsAndNames.map((reservation) => (
                <li key={reservation.reservation.id} className="grid grid-cols-2 justify-items-center">
                  <p>{reservation.item?.name}</p>
                  <p>{reservation.reservation.status}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="border rounded col-span-4 col-start-3 min-h-[25vh]">
            <h2 className="text-center">Groups</h2>
            <ul>
              {groups.map((group) => (
                <li key={group.id} className="grid grid-cols-2 justify-items-center">
                  <p>{group.name}</p>
                  <p>{group.role}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

      <div className="border rounded mr-6 max-w-[25vw]">
        <h2 className="text-center">Items</h2>
        <ul>
          {itemsInformation.map((item) => (
            <li key={item.item.id} className="grid grid-cols-2 justify-items-center">
              <p>{item.item.name}</p>
              <p>{item.status}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
    </main>
  )
}