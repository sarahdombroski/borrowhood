"use server";

import { archiveItemQuery, createItemQuery, getItemByIdQuery, getVisibleItemsQuery, setItemVisibilityQuery, unarchiveItemQuery, updateItemQuery } from "@/lib/queries/items";
import { getCurrentUser } from "@/lib/session";
import { CreateItemInput, UpdateItemInput } from "@/lib/validation/items";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getItemById(itemId: number) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return await getItemByIdQuery(user.id, itemId)
}

export async function getVisibleItems(groupId?: number) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return await getVisibleItemsQuery(user.id, groupId);
}

export async function createItem(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const name = String(formData.get("name") ?? "").trim();
  if (name.length < 1 || name.length > 60) {
    throw new Error("Item name must be 1-60 characters");
  }
  const data: CreateItemInput = {ownerId: user.id, name: name}
  const item = await createItemQuery(user.id, data);
  redirect(`/items/${item.id}`);
}

export async function updateItem(itemId: number, formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const name = String(formData.get("name") ?? "").trim();
  if (name.length < 1 || name.length > 60) {
    throw new Error("Item name must be 1-60 characters");
  }
  const description = String(formData.get("description") ?? "").trim();
  if (description.length < 1 || description.length > 250) {
    throw new Error("Item description must be 1-250 characters");
  }
  const data: UpdateItemInput = {name: name}

  const expectedUpdatedAt = new Date(String(formData.get("expectedUpdatedAt")));
  if (isNaN(expectedUpdatedAt.getTime())) throw new Error("Missing version");

  return await updateItemQuery(user.id, itemId, data, expectedUpdatedAt);
}

export async function setItemVisibility(itemId: number, formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const groupIds = formData.getAll("groupIds").map(Number);
  if (groupIds.some((id) => !Number.isInteger(id))) {
    throw new Error("Invalid group selection");
  }
  await setItemVisibilityQuery(user.id, itemId, groupIds);
  revalidatePath(`/items/${itemId}`);
  revalidatePath("/items");
}

export async function archiveItem(itemId: number) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  await archiveItemQuery(user.id, itemId);
  redirect('/items');
}

export async function unArchiveItem(itemId: number) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  await unarchiveItemQuery(user.id, itemId);
  redirect('/items');
}

// toggleAvailabilityAction

// requestPhotoUploadAction(itemId)
  // owner check, returns signed upload url and key

// confirmPhotoUploadAction(itemId, key)
  // verifies upload, saves photo_key, deletes old photo