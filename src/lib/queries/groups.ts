import { NotFoundError } from "../errors";
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

export async function canRemoveOwnerFromGroup(groupId: number) {
  const admins = await prisma.membership.findMany({
    where: { groupId: groupId, role: "ADMIN" }
  });
  if (admins.length > 1) return true;
  else {
    return false;
  }
}