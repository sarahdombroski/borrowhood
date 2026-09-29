/*
  Warnings:

  - A unique constraint covering the columns `[join_code]` on the table `Group` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `join_code` to the `Group` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "join_code" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Group_join_code_key" ON "Group"("join_code");
