"use server";

import { prisma } from "@/lib/prisma";
import { canRemoveOwnerFromGroup, createGroupQuery, getGroupByIdQuery, getGroupMemberCountQuery, getGroupMemberQuery, getMyGroupsQuery, joinGroupByCode, leaveGroupQuery } from "@/lib/queries/groups";
import { requireUser } from "@/lib/session";
import { idSchema, joinCodeSchema, nameSchema } from "@/lib/validation/schemas";
import { redirect } from "next/navigation";

export async function createGroup(formData: FormData) {
  const user = await requireUser();

  const name = String(formData.get("name") ?? "").trim();
  if (name.length < 1 || name.length > 60) {
    throw new Error("Group name must be 1-60 characters");
  }
  const validName = nameSchema.parse(name);

  const group = await createGroupQuery(user.id, validName);
  redirect(`/groups/${group.id}`);
}

export async function getMyGroups() {
  const user = await requireUser();
  return await getMyGroupsQuery(user.id);
}

export async function getGroupById(groupId: number) {
  const user = await requireUser();
  const id = idSchema.parse(groupId);
  return await getGroupByIdQuery(user.id, id);
}

export async function joinGroup(formData: FormData) {
  const user = await requireUser();

  const code = joinCodeSchema.parse(Number(formData.get("joinCode") ?? ""));

  const groupId = await joinGroupByCode(user.id, code);
  if (!groupId) return;
  redirect(`/groups/${groupId}`);
}

export async function leaveGroup(groupId: number) {
  const id = idSchema.parse(groupId);
  const user = await requireUser();

  const membership = await prisma.membership.findFirst({
    where: {userId: user.id, groupId: id},
  });
  if (!membership) return;

  if ((membership?.role == "ADMIN") && !(await canRemoveOwnerFromGroup(id))) {
    // TODO: implement a better handler for this when you add in toast messages
    // TODO: catch the possible race of two admins leaving at the same time
    console.log("Cannot leave, you are the admin :(");
    return;
  }

  await leaveGroupQuery(user.id, id);
  redirect(`/groups`);
}

export async function getGroupMemberCount(groupId: number) {
  const id = idSchema.parse(groupId)
  const user = await requireUser();
  return await getGroupMemberCountQuery(user.id, id);
}

export async function getGroupMembers(groupId: number) {
  const id = idSchema.parse(groupId)
  const user = await requireUser();
  return await getGroupMemberQuery(id, user.id);
}