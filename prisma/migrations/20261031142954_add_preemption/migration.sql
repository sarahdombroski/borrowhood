-- AlterEnum
ALTER TYPE "Status" ADD VALUE 'PREEMPTED';

-- AlterTable
ALTER TABLE "Reservation" ADD COLUMN     "preemptedAt" TIMESTAMP(3),
ADD COLUMN     "preemptedById" TEXT,
ADD COLUMN     "preemptedReason" TEXT;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_preemptedById_fkey" FOREIGN KEY ("preemptedById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Needed so a GiST index can combine equality (itemId) with range overlap.
-- Safe to run even if you already created it earlier.
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- Drop the old constraint that applied to ALL rows.
-- Check the real name first (see below).
ALTER TABLE "Reservation"
  DROP CONSTRAINT IF EXISTS reservation_no_overlap;

-- Recreate it so only active reservations block each other.
ALTER TABLE "Reservation"
  ADD CONSTRAINT reservation_no_overlap
  EXCLUDE USING gist (
    "itemId" WITH =,
    tstzrange("startDate", "endDate", '[)') WITH &&
  )
  WHERE ("status" IN ('PENDING', 'APPROVED', 'PICKED_UP'));