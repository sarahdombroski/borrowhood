import { notFound } from "next/navigation";
import ShareItemButton from "@/app/components/ShareItemButton";
import { requireUser } from "@/lib/session";
import { getMyGroupsQuery } from "@/lib/queries/groups";
import { getItemByIdQuery } from "@/lib/queries/items";
import { getCurrentAvailability, getGroupsItemIsSharedWith, getReservedDays } from "../actions";
import DeleteItemButton from "../components/DeleteItemButton";
import { CheckCheck } from "lucide-react";
import { ReservePicker } from "@/app/components/ReservePicker";

export default async function ItemPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const { id } = await params;
  const itemId = Number(id);
  if (!Number.isInteger(itemId)) notFound();

  const item = await getItemByIdQuery(user.id, itemId);
  if (!item) notFound();

  if(item.isArchived) notFound();

  const groups = await getMyGroupsQuery(user.id);
  const shareableGroups = groups.map(({ id, name }) => ({ id, name }));
  const sharedWith = await getGroupsItemIsSharedWith(item.id);

  const currentAvailability = await getCurrentAvailability(item.id);
  const booked = await getReservedDays(itemId);

  return (
    <>
      <h1 className="text-center">{item.name}</h1>
      <div className="m-3">
        <p>Description: {item.description}</p>
        <p>Category: {item.category}</p>
        <p>Max Loan: {item.maxLoan}</p>
        <p>Condition Notes: {item.conditionNotes}</p>
        <p>Replacement Value: {item.replacementValue}</p>
        <p>Last Updated: {item.updatedAt.toLocaleDateString()}</p>
        <p>Current Status: {currentAvailability?.status}</p>
        {currentAvailability?.status == "PICKED_UP" &&
          <p>Reserved By: {currentAvailability?.borrowerId}</p>
        }
      </div>

      <DeleteItemButton itemId={item.id} itemName={item.name} />

      <div className="grid grid-cols-[1fr_1fr] gap-4 py-2">
        <div className="border rounded m-2 p-2">
          <h2 className="text-center">Groups</h2>
          <ShareItemButton
            itemId={item.id}
            itemName={item.name}
            groups={shareableGroups}
          />
          <ul>
            {groups.map((group) => (
              <li key={group.id} className="flex gap-1">
                <p>{group.name}</p>
                {sharedWith.includes(group.id) && (
                  <CheckCheck />
                )}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="border rounded justify-items-center m-2 p-2">
          <h2>Calendar</h2>
          <ReservePicker itemId={item.id} booked={booked} isOwner={true} />
        </div>
      </div>
    </>
  );
}
