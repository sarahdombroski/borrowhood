/*
  Warnings:

  - Changed the type of `joinCode` on the `Group` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Group" DROP COLUMN "joinCode",
ADD COLUMN     "joinCode" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Group_joinCode_key" ON "Group"("joinCode");
