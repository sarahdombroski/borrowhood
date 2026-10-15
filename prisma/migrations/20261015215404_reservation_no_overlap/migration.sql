-- AlterTable
ALTER TABLE "Reservation" ALTER COLUMN "startDate" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "endDate" SET DATA TYPE TIMESTAMPTZ(3);

CREATE EXTENSION IF NOT EXISTS btree_gist;

ALTER TABLE "Reservation"
  ADD CONSTRAINT reservation_end_after_start
  CHECK ("endDate" > "startDate");

ALTER TABLE "Reservation"
  ADD CONSTRAINT reservation_no_overlap
  EXCLUDE USING gist (
    "itemId" WITH =,
    tstzrange("startDate", "endDate", '[)') WITH &&
  )
  WHERE (status IN ('PENDING', 'APPROVED', 'PICKED_UP', 'RETURNED', 'CANCELLED', 'DENIED'));