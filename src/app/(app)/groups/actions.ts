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

  const code = Number(formData.get("joinCode") ?? "");
  if (code.toString().length != 6) {
    throw new Error("Group join code must be 6 numbers");
  }

  const group = await joinGroupByCode(user.id, code);
  if (!group) return;
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
    // TODO: catch the possible race of two admins leaving at the same time
    console.log("Cannot leave, you are the admin :(");
    return;
  }

  await leaveGroupQuery(user.id, groupId);
  redirect(`/groups`);
}