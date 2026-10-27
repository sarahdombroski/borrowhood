import { notFound } from "next/navigation";
import { requireUser } from "@/lib/session";
import { getItemByIdQuery } from "@/lib/queries/items";
import { ReservePicker } from "@/app/components/ReservePicker";
import { getReservedDays } from "../../actions";
import Link from "next/link";
import { ArrowBigLeft } from "lucide-react";

export default async function ReserveItem({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ id: string }>;
  searchParams: Promise<{ groupId?: string }>; 
}) {
  const user = await requireUser();
  const { id } = await params;
  const { groupId } = await searchParams;
  const itemId = Number(id);
  if (!Number.isInteger(itemId)) notFound();

  const item = await getItemByIdQuery(user.id, itemId);
  if (!item) notFound();
  if(item.isArchived) notFound();

  const booked = await getReservedDays(itemId);

  return (
    <>
      <h1 className="text-center">Reserve: {item.name}</h1>
      <Link href={`/groups/${groupId}`} className="flex justify-center"><ArrowBigLeft />Back to group</Link>
      <div className="m-4">
        <p>Description: {item.description}</p>
        <p>Category: {item.category}</p>
        <p>Condition Notes: {item.conditionNotes}</p>
        <p>Max Loan: {item.maxLoan}</p>
      </div>
      <div className="flex justify-center">
        <ReservePicker itemId={item.id} booked={booked} isOwner={false} />
      </div>
    </>
  );
}
