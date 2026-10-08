-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "archivedAt" TIMESTAMP(3),
ADD COLUMN     "category" TEXT,
ADD COLUMN     "conditionNotes" TEXT,
ADD COLUMN     "isArchived" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "replacementValue" TEXT;

-- AlterTable
ALTER TABLE "Reservation" ADD COLUMN     "maxLoan" INTEGER;
