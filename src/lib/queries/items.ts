import { ForbiddenError, NotFoundError } from "../errors";
import { prisma, visibleToUser } from "../prisma";

interface CreateItemInput {
  ownerId: string;
  name: string;
  description?: string;
  conditionNotes?: string;
  replacementValue?: string;
  photoUrl?: string;
  category?: string;
}

interface UpdateItemInput {
  name: string;
  description: string;
}

export async function getItemById(userId: string, itemId: number) {
  return prisma.item.findFirst({
    where: { id: itemId, ...visibleToUser(userId) }
  });
}

export async function getVisibleItems(userId: string, groupId?: number) {
  return prisma.item.findMany({
    where: {
      ...visibleToUser(userId),
      ...(groupId && {
        itemVisibilities: { some: { groupId, group: { memberships: { some: { userId } } } } },
      }),
    },
    include: { itemVisibilities: { select: { groupId: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getMyItems(userId: string) {
  return prisma.item.findMany({
    where: { 
      ownerId: userId, 
      ...visibleToUser(userId)
    },
    orderBy: { createdAt: "desc" }
  });
}

export async function createItem(userId: string, data: CreateItemInput) {
  const item = await prisma.item.create({
    data: {
      ownerId: userId,
      name: data.name,
      description: data.description,
      conditionNotes: data.conditionNotes,
      replacementValue: data.replacementValue,
      photoUrl: data.photoUrl,
      category: data.category
    }
  });
  return item;
}

export async function updateItem(userId: string, itemId: number, data: UpdateItemInput, expectedUpdatedAt: Date) {
  const { count } = await prisma.item.updateMany({
    where: { id: itemId, ownerId: userId, updatedAt: expectedUpdatedAt },
    data: { name: data.name, description: data.description },
  });
  if (count === 0) throw new NotFoundError();
  return getItemById(userId, itemId);
}

export async function setItemVisibility(userId: string, itemId: number, groupIds: number[]) {
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

export async function archiveItem(userId: string, itemId: number) {
  return await prisma.item.update({
    where: { id: itemId, ownerId: userId },
    data: {
      isArchived: true,
      archivedAt: new Date()
    } 
  });
}

export async function unarchiveItem(userId: string, itemId: number) {
  return await prisma.item.update({
    where: { id: itemId, ownerId: userId, isArchived: true },
    data: {
      isArchived: false,
      archivedAt: new Date()
    } 
  });
}

// setItemAvaliability(userId, itemId, avaliable)

// setItemPhotoKey(userId, itemId, key)