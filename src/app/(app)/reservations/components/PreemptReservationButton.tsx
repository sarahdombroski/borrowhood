"use client"

import { useRef, useTransition } from "react";
import { preemptItem } from "../actions";

export default function PreemptReservationButton({ reservationId, itemName }: { reservationId: number, itemName: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isPending, startTransition] = useTransition();

  function confirmPreempt() {
    startTransition(async () => {
      await preemptItem(reservationId, "preempted bc i said so");
    });
  }

  return (
    <>
      <button 
        onClick={() => dialogRef.current?.showModal()}
        className="rounded-lg border px-4 py-2"
      >Preempt Reservation</button>

      <dialog 
        ref={dialogRef}
        className="m-auto w-full max-w-md rounded-xl bg-white p-6 text-gray-900 shadow-xl backdrop:bg-black/50"
      >
        <p>Cancel the reservation on {itemName}? The borrower will get a notification informing them of the change.</p>
        
        <div className="flex justify-end gap-3">
          <button 
            onClick={() => dialogRef.current?.close()} 
            disabled={isPending}
            className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
          >Back</button>
          <button 
            onClick={confirmPreempt} 
            disabled={isPending}
            className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 transition"
          >{isPending ? "Cancelling..." : "Yes, preempt"}</button>
        </div>
      </dialog>
    </>
  );
}