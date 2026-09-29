/*
  Warnings:

  - You are about to drop the column `created_at` on the `Group` table. All the data in the column will be lost.
  - You are about to drop the column `join_code` on the `Group` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Group` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `owner_id` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `photo_url` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `group_id` on the `ItemVisibility` table. All the data in the column will be lost.
  - You are about to drop the column `item_id` on the `ItemVisibility` table. All the data in the column will be lost.
  - You are about to drop the column `group_id` on the `Membership` table. All the data in the column will be lost.
  - You are about to drop the column `joined_at` on the `Membership` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Membership` table. All the data in the column will be lost.
  - You are about to drop the column `borrower_id` on the `Reservation` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Reservation` table. All the data in the column will be lost.
  - You are about to drop the column `item_id` on the `Reservation` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Reservation` table. All the data in the column will be lost.
  - You are about to drop the column `photo_url` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[joinCode]` on the table `Group` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[itemId,groupId]` on the table `ItemVisibility` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,groupId]` on the table `Membership` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `joinCode` to the `Group` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Group` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ownerId` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `groupId` to the `ItemVisibility` table without a default value. This is not possible if the table is not empty.
  - Added the required column `itemId` to the `ItemVisibility` table without a default value. This is not possible if the table is not empty.
  - Added the required column `groupId` to the `Membership` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Membership` table without a default value. This is not possible if the table is not empty.
  - Added the required column `borrowerId` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `itemId` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_owner_id_fkey";

-- DropForeignKey
ALTER TABLE "ItemVisibility" DROP CONSTRAINT "ItemVisibility_group_id_fkey";

-- DropForeignKey
ALTER TABLE "ItemVisibility" DROP CONSTRAINT "ItemVisibility_item_id_fkey";

-- DropForeignKey
ALTER TABLE "Membership" DROP CONSTRAINT "Membership_group_id_fkey";

-- DropForeignKey
ALTER TABLE "Membership" DROP CONSTRAINT "Membership_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Reservation" DROP CONSTRAINT "Reservation_borrower_id_fkey";

-- DropForeignKey
ALTER TABLE "Reservation" DROP CONSTRAINT "Reservation_item_id_fkey";

-- DropIndex
DROP INDEX "Group_join_code_key";

-- DropIndex
DROP INDEX "ItemVisibility_item_id_group_id_key";

-- DropIndex
DROP INDEX "Membership_user_id_group_id_key";

-- AlterTable
ALTER TABLE "Group" DROP COLUMN "created_at",
DROP COLUMN "join_code",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "joinCode" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "created_at",
DROP COLUMN "owner_id",
DROP COLUMN "photo_url",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "ownerId" INTEGER NOT NULL,
ADD COLUMN     "photoUrl" TEXT;

-- AlterTable
ALTER TABLE "ItemVisibility" DROP COLUMN "group_id",
DROP COLUMN "item_id",
ADD COLUMN     "groupId" INTEGER NOT NULL,
ADD COLUMN     "itemId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Membership" DROP COLUMN "group_id",
DROP COLUMN "joined_at",
DROP COLUMN "user_id",
ADD COLUMN     "groupId" INTEGER NOT NULL,
ADD COLUMN     "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Reservation" DROP COLUMN "borrower_id",
DROP COLUMN "created_at",
DROP COLUMN "item_id",
DROP COLUMN "updated_at",
ADD COLUMN     "borrowerId" INTEGER NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "itemId" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "photo_url",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "emailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "Session" (
    "id" SERIAL NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Verification" (
    "id" SERIAL NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Verification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Session_token_key" ON "Session"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Group_joinCode_key" ON "Group"("joinCode");

-- CreateIndex
CREATE UNIQUE INDEX "ItemVisibility_itemId_groupId_key" ON "ItemVisibility"("itemId", "groupId");

-- CreateIndex
CREATE UNIQUE INDEX "Membership_userId_groupId_key" ON "Membership"("userId", "groupId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemVisibility" ADD CONSTRAINT "ItemVisibility_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemVisibility" ADD CONSTRAINT "ItemVisibility_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_borrowerId_fkey" FOREIGN KEY ("borrowerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
