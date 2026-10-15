import { notFound } from "next/navigation";
import { getItemById } from "../actions";
import DeleteItemButton from "@/app/components/DeleteItemButton";

export default async function ItemPage({ params }: { params: Promise<{ itemId: number }> }) {
  const { itemId } = await params;
  const item = await getItemById(itemId);
  if (!item) notFound();

  if(item.isArchived) notFound();

  return (
    <>
      <h1>{item.name}</h1>

      <DeleteItemButton itemId={item.id} itemName={item.name} />
    </>
  );
}