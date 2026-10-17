"use client"

import { useRef, useTransition } from "react";
import { cancelReservation } from "../(app)/reservations/actions";

export default function CancelReservationButton({ reservationId, itemName }: { reservationId: number, itemName: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isPending, startTransition] = useTransition();

  function confirmCancel() {
    startTransition(async () => {
      await cancelReservation(reservationId);
    });
  }

  return (
    <>
      <button onClick={() => dialogRef.current?.showModal()}>Cancel Reservation</button>

      <dialog ref={dialogRef}>
        <p>Cancel reservation for {itemName}? This action cannot be undone.</p>
        <button onClick={() => dialogRef.current?.close()} disabled={isPending}>Back</button>
        <button onClick={confirmCancel} disabled={isPending}>{isPending ? "Leaving..." : "Yes, cancel"}</button>
      </dialog>
    </>
  );
}