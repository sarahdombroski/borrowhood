import Link from "next/link";
import { createItem, getCurrentAvailability, getMyItems, getNextReservation } from "./actions";
import CreateItemButton from "./components/CreateItemButton";
import { Item } from "@/app/generated/prisma/client";

export default async function Items() {
  const items = await getMyItems();
  const itemsInformation = await Promise.all(
    items.map((item) => getItemAvaliability(item))
  );

  async function getItemAvaliability(item: Item) {
    const availability = await getCurrentAvailability(item.id);
    const currentAvailability = availability?.status;
    const nextReservation = await getNextReservation(item.id);
    return {item, currentAvailability, nextReservation};
  }
  
  return (
    <main>
      <div className="text-center">
        <h1>Items</h1>
        <CreateItemButton />
      </div>

      {/* TODO: Implement a search function */}

      <ul className="border rounded m-3 p-3">
        {itemsInformation.map((info) => (
          <li key={info.item.id} className="grid grid-cols-[2fr_1fr_auto] items_center gap-4 py-2">
            <Link href={`/items/${info.item.id}`}>{info.item.name}</Link>
            <p>{info.currentAvailability}</p>
            <p>{String(info.nextReservation)}</p>
          </li>
        ))}
      </ul>
    </main>
  )
}