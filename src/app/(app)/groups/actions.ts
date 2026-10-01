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

  // redirect(`/groups/${group.id}`);
}