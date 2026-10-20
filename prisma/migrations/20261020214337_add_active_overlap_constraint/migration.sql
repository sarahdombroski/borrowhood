ALTER TABLE "Reservation" DROP CONSTRAINT reservation_no_overlap;

ALTER TABLE "Reservation"
  ADD CONSTRAINT reservation_no_overlap
  EXCLUDE USING gist (
    "itemId" WITH =,
    tstzrange("startDate", "endDate", '[)') WITH &&
  )
  WHERE (status IN ('PENDING', 'APPROVED', 'PICKED_UP'));