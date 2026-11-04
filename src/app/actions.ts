"use server";

import { getNotificaitonsForUser, getUnreadCount } from "@/lib/notify";
import { getCurrentUser } from "@/lib/session";

export async function getNotfications() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  return await getNotificaitonsForUser(user.id);
}

export async function getUnreadAction() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  return await getUnreadCount(user.id);
}