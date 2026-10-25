import { notFound } from "next/navigation";
import { requireUser } from "@/lib/session";
import { getItemByIdQuery } from "@/lib/queries/items";
import { ReservePicker } from "@/app/components/ReservePicker";
import { getReservedDays } from "../../actions";

export default async function ReserveItem({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const { id } = await params;
  const itemId = Number(id);
  if (!Number.isInteger(itemId)) notFound();

  const item = await getItemByIdQuery(user.id, itemId);
  if (!item) notFound();
  if(item.isArchived) notFound();

  const booked = await getReservedDays(itemId);

  return (
    <>
      <h1>{item.name}</h1>
      <p>{item.description}</p>
      <p>{item.category}</p>
      <p>{item.conditionNotes}</p>
      <p>{item.maxLoan}</p>

        <h2>Reserve:</h2>
        <ReservePicker itemId={item.id} booked={booked} isOwner={false} />
    </>
  );
}
