import "server-only";
import { ForbiddenError, NotFoundError } from "../errors";
import { prisma, visibleToUser } from "../prisma";
import { CreateItemInput, ReserveInput, ReserveResult, UpdateItemInput } from "../validation/items";
import { z } from "zod";

export async function getItemByIdQuery(userId: string, itemId: number) {
  return prisma.item.findFirst({
    where: { id: itemId, ...visibleToUser(userId) }
  });
}

export async function getVisibleItemsQuery(userId: string, groupId?: number) {
  return prisma.item.findMany({
    where: {
      isArchived: false,
      AND: [
        visibleToUser(userId),
        ...(groupId ? [{
        itemVisibilities: { some: { groupId } } 
      }]: []),
      ],
    },
    include: { itemVisibilities: { select: { groupId: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getMyItems(userId: string) {
  return prisma.item.findMany({
    where: { 
      ownerId: userId
    },
    orderBy: { createdAt: "desc" }
  });
}

export async function createItemQuery(userId: string, data: CreateItemInput) {
  const item = await prisma.item.create({
    data: {
      ownerId: userId,
      name: data.name,
      description: data.description,
      conditionNotes: data.conditionNotes,
      replacementValue: data.replacementValue,
      category: data.category
    }
  });
  return item;
}

export async function updateItemQuery(userId: string, itemId: number, data: UpdateItemInput, expectedUpdatedAt: Date) {
  const { count } = await prisma.item.updateMany({
    where: { id: itemId, ownerId: userId, updatedAt: expectedUpdatedAt },
    data: { name: data.name },
  });
  if (count === 0) throw new NotFoundError();
  return getItemByIdQuery(userId, itemId);
}

export async function setItemVisibilityQuery(userId: string, itemId: number, groupIds: number[]) {
  const wanted = [...new Set(groupIds)];
  await prisma.$transaction(async (tx) => {
    const item = await tx.item.findFirst({ where: { id: itemId, ownerId: userId } });
    if (!item) throw new NotFoundError();

    const memberships = await tx.membership.count({
      where: { userId, groupId: { in: wanted } },
    });
    if (memberships !== wanted.length) throw new ForbiddenError();

    await tx.itemVisibility.deleteMany({
      where: { itemId, groupId: { notIn: wanted }},
    });
    await tx.itemVisibility.createMany({
      data: wanted.map((groupId) => ({ itemId, groupId })),
      skipDuplicates: true
    });
  });
}

export async function archiveItemQuery(userId: string, itemId: number) {
  return await prisma.item.update({
    where: { id: itemId, ownerId: userId },
    data: {
      isArchived: true,
      archivedAt: new Date()
    } 
  });
}

export async function unarchiveItemQuery(userId: string, itemId: number) {
  return await prisma.item.update({
    where: { id: itemId, ownerId: userId, isArchived: true },
    data: {
      isArchived: false,
      archivedAt: null
    } 
  });
}

export async function reserveItemQuery(borrowerId: string, { itemId, startDate, endDate }: z.infer<typeof ReserveInput>): Promise<ReserveResult> {
  const item = await prisma.item.findFirst({
    where: {
      id: itemId,
      itemVisibilities: { some: { group: { memberships: { some: { userId: borrowerId } } } } }
    }
  });
  if (!item) return { ok: false, error: "NOT_FOUND" }
  if (item.ownerId === borrowerId) return { ok: false, error: "OWN_ITEM" }

  if (item.maxLoan) {
    const days = (endDate.getTime() - startDate.getTime()) / 86_400_000;
    if (days > item.maxLoan) return { ok: false, error: "TOO_LONG" }
  }

  try {
    const reservation = await prisma.reservation.create({
      data: { itemId, borrowerId, startDate, endDate },
    });
    return { ok: true, reservation }
  } catch (e) {
    if (e instanceof Error && e.message.includes("23P01")) {
      return { ok: false, error: "ALREADY_BOOKED" };
    } 
    throw e;
  }
}

export async function getReservedDaysQuery(itemId: number, userId: string) {
  const item = await getItemByIdQuery(userId, itemId);
  if (!item) return [];
  
  return await prisma.reservation.findMany({
    where: {
      itemId: itemId,
      status: { in: ["PENDING", "APPROVED", "PICKED_UP"] },
      endDate: { gt: new Date() },
    },
    select: { startDate: true, endDate: true },
    orderBy: { startDate: "asc" },
  });
}

// setItemPhotoKey(userId, itemId, key)