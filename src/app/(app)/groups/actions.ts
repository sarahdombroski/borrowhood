"use server";

import { prisma } from "@/lib/prisma";
import { canRemoveOwnerFromGroup, createGroupQuery, joinGroupByCode, leaveGroupQuery } from "@/lib/queries/groups";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";

export async function createGroup(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const name = String(formData.get("name") ?? "").trim();
  if (name.length < 1 || name.length > 60) {
    throw new Error("Group name must be 1-60 characters");
  }

  const group = await createGroupQuery(user.id, name);
  redirect(`/groups/${group.id}`);
}

export async function joinGroup(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const code = String(formData.get("joinCode") ?? "").trim();
  if (code.length != 6) {
    throw new Error("Group join code must be 6 characters");
  }

  const group = await joinGroupByCode(user.id, code);
  redirect(`/groups/${group.id}`);
}

export async function leaveGroup(groupId: number) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const membership = await prisma.membership.findFirst({
    where: {userId: user.id, groupId: groupId},
  });
  if (!membership) return;

  if ((membership?.role == "ADMIN") && !(await canRemoveOwnerFromGroup(groupId))) {
    // TODO: implement a better handler for this when you add in toast messages
    console.log("Cannot leave, you are the admin :(");
    return;
  }

  await leaveGroupQuery(user.id, groupId);
  redirect(`/groups`);
}