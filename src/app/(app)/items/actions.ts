"use server";

import { archiveItemQuery, createItemQuery, getCurrentAvailabilityQuery, getGroupsItemIsSharedWithQuery, getItemByIdQuery, getMyItemsQuery, getNextReservationQuery, getReservedDaysQuery, getVisibleItemsQuery, reserveItemQuery, setItemVisibilityQuery, unarchiveItemQuery, updateItemQuery } from "@/lib/queries/items";
import { requireUser } from "@/lib/session";
import { createItemSchema, ReserveInput, ReserveResult, updateItemSchema } from "@/lib/validation/items";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getItemById(itemId: number) {
  const user = await requireUser();
  return await getItemByIdQuery(user.id, itemId)
}

export async function getMyItems() {
  const user = await requireUser();
  return await getMyItemsQuery(user.id);
}

export async function getVisibleItems(groupId?: number) {
  const user = await requireUser();
  return await getVisibleItemsQuery(user.id, groupId);
}

export async function createItem(formData: FormData) {
  const user = await requireUser();

  const parsed = createItemSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);

  const item = await createItemQuery(user.id, parsed.data);
  redirect(`/items/${item.id}`);
}

export async function updateItem(itemId: number, formData: FormData) {
  const user = await requireUser();

  const parsed = updateItemSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);

  return await updateItemQuery(user.id, itemId, parsed.data, parsed.data.expectedUpdatedAt);
}

export async function setItemVisibility(itemId: number, formData: FormData) {
  const user = await requireUser();

  const groupIds = formData.getAll("groupIds").map(Number);
  if (groupIds.some((id) => !Number.isInteger(id))) {
    throw new Error("Invalid group selection");
  }
  await setItemVisibilityQuery(user.id, itemId, groupIds);
  revalidatePath(`/items/${itemId}`);
  revalidatePath("/items");
}

export async function getGroupsItemIsSharedWith(itemId: number) {
  const user = await requireUser();
  return await getGroupsItemIsSharedWithQuery(itemId);
}

export async function archiveItem(itemId: number) {
  const user = await requireUser();
  await archiveItemQuery(user.id, itemId);
  redirect('/items');
}

export async function unArchiveItem(itemId: number) {
  const user = await requireUser();
  await unarchiveItemQuery(user.id, itemId);
  redirect('/items');
}

export async function reserveItem(input: unknown): Promise<ReserveResult> {
  const user = await requireUser();
  const parsed = ReserveInput.safeParse(input);
  if (!parsed.success) return { ok: false, error: "INVALID_INPUT" }
  return await reserveItemQuery(user.id, parsed.data);
}

export async function getReservedDays(itemId: number) {
  const user = await requireUser();
  return await getReservedDaysQuery(itemId, user.id);
}

export async function getCurrentAvailability(itemId: number) {
  const user = await requireUser();
  return await getCurrentAvailabilityQuery(itemId);
}

export async function getNextReservation(itemId: number) {
  const user = await requireUser();
  return await getNextReservationQuery(itemId);
}

// requestPhotoUploadAction(itemId)
  // owner check, returns signed upload url and key

// confirmPhotoUploadAction(itemId, key)
  // verifies upload, saves photo_key, deletes old photo