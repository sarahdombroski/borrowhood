import { notFound } from "next/navigation";
import DeleteItemButton from "@/app/components/DeleteItemButton";
import ShareItemButton from "@/app/components/ShareItemButton";
import { requireUser } from "@/lib/session";
import { getMyGroupsQuery } from "@/lib/queries/groups";
import { getItemByIdQuery } from "@/lib/queries/items";

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

  return (
    <>
      <h1>{item.name}</h1>
      <ShareItemButton
        itemId={item.id}
        itemName={item.name}
        groups={shareableGroups}
      />

      <DeleteItemButton itemId={item.id} itemName={item.name} />
    </>
  );
}
