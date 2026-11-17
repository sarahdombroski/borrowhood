import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Prisma } from "@/app/generated/prisma/client";
import { NotFoundError } from "./errors";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export function visibleToUser(userId: string): Prisma.ItemWhereInput {
  return {
    OR: [
      { ownerId: userId },
      {
        isArchived: false,
        itemVisibilities: {
          some: { group: { memberships: { some: { userId } } } },
        },
      },
    ],
  };
}

export async function requireMember(userId: string, groupId: number) {  
  const membership = await prisma.membership.findFirst({
    where: { userId: userId, groupId: groupId }
  });
  if (!membership) throw new NotFoundError();
  return membership;
}

export async function requireVisibleItem(userId: string, itemId: number) {
  const item = await prisma.item.findFirst({
    where: { AND: [{ id: itemId }, visibleToUser(userId)] }
  });
  if (!item) throw new NotFoundError();
  return item;
}

export async function requireItemOwner(userId: string, itemId: number) {
  const item = await prisma.item.findFirst({
    where: { id: itemId, ownerId: userId },
  });
  if (!item) throw new NotFoundError();
  return item;
}

export async function requireAdmin(userId: string, groupId: number) {
  const membership = await requireMember(userId, groupId);
  if (membership.role !== "ADMIN") throw new NotFoundError();
  return membership;
}