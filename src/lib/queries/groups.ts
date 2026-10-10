import "server-only";
import { prisma } from "../prisma";

export async function getMyGroups(userId: string) {
  const memberships = await prisma.membership.findMany({
    where: { userId: userId },
    include: { group: true },
    orderBy: { joinedAt: "desc" }
  });
 return memberships.map((m) => ({
  ...m.group,
  joinedAt: m.joinedAt,
  role: m.role
 }));
}

export async function getMembership(userId: string, groupId: number) {
  return await prisma.membership.findFirst({
    where: { userId: userId, groupId: groupId }
  });
}

export async function leaveGroupQuery(userId: string, groupId: number) {
  await prisma.$transaction(async (tx) => {
    await tx.itemVisibility.deleteMany({
      where: { groupId, item: { ownerId: userId }},
    });
    await tx.membership.delete({
      where: { userId_groupId: { userId, groupId } },
    });
  });
}

export async function canRemoveOwnerFromGroup(groupId: number) {
  const admins = await prisma.membership.findMany({
    where: { groupId: groupId, role: "ADMIN" }
  });
  if (admins.length > 1) return true;
  else {
    return false;
  }
}

export async function createGroupQuery(userId: string, name: string) {
  return await prisma.$transaction(async (tx) => {
    const g = await tx.group.create({ data: { name, joinCode: generateJoinCode() } });
    await tx.membership.create({ data: { role: "ADMIN", groupId: g.id, userId } });
    return g;
  });
}

export async function joinGroupByCode(userId: string, code: string) {
  const group = await prisma.group.findFirst({
    where: { joinCode: code }
  });
  if (!group) throw new Error("Join code doesn't link to a group");
  
  await prisma.$transaction(async (tx) => {
    await tx.membership.create({ 
      data: { 
        role: "MEMBER", 
        groupId: Number(group.id), 
        userId: userId
    }})
  });
  return group;
}

function generateJoinCode(length = 6) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    code += chars[randomIndex];
  }
  return code;
}