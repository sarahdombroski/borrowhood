"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";

function generateJoinCode(length = 6) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    code += chars[randomIndex];
  }
  return code;
}

export async function createGroup(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const name = String(formData.get("name") ?? "").trim();
  if (name.length < 1 || name.length > 60) {
    throw new Error("Group name must be 1-60 characters");
  }

  const group = await prisma.$transaction(async (tx) => {
    const g = await tx.group.create({ data: { name, joinCode: generateJoinCode() } });
    await tx.membership.create({ data: { role: "ADMIN", groupId: g.id, userId: user.id } });
    return g;
  });

  redirect(`/groups/${group.id}`);
}

export async function joinGroup(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const code = String(formData.get("joinCode") ?? "").trim();
  if (code.length != 6) {
    throw new Error("Group join code must be 6 characters");
  }

  const group = await prisma.group.findFirst({
    where: { joinCode: code }
  });

  if (!group) throw new Error("Join code doesn't link to a group");

  await prisma.$transaction(async (tx) => {
    await tx.membership.create({ 
      data: { 
        role: "MEMBER", 
        groupId: Number(group.id), 
        userId: user.id 
    }})
  });

  redirect(`/groups/${group.id}`);
}