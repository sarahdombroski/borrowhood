"use server";

import { deleteNotification, getNotificaitonsForUser, getUnreadCount } from "@/lib/notify";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

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

export async function markAsReadAction(notificationIds: number[]) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  await prisma.notification.updateMany({
    where: {
      id: { in: notificationIds },
      recipientId: user.id,
      readAt: null
    },
    data: {
      readAt: new Date()
    }
  });
}

export async function deleteNotificationAction(notificationId: number) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  await deleteNotification(user.id, notificationId);
}