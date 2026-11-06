"use client"

import { useRef, useTransition } from "react";
import { declineRequest } from "../actions";
import { Reservation } from "@/app/generated/prisma/client";

export default function DenyReservationButton({ reservation, borrowerName, itemName }: { reservation: Reservation, borrowerName: string, itemName?: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isPending, startTransition] = useTransition();

  function confirmDeny() {
    startTransition(async () => {
      await declineRequest(reservation.id);
    });
  }

  return (
    <>
      <button 
        onClick={() => dialogRef.current?.showModal()}
        className="rounded-lg border px-4 py-2"
      >Deny</button>

      <dialog 
        ref={dialogRef}
        className="m-auto w-full max-w-md rounded-xl bg-white p-6 text-gray-900 shadow-xl backdrop:bg-black/50"
      >
        <p>{borrowerName} has requested to borrow {itemName} from {reservation.startDate.toLocaleDateString()} to {reservation.endDate.toLocaleDateString()}</p>
        <p>Deny reservation for {itemName}?</p>
        
        <div className="flex justify-end gap-3">
          <button 
            onClick={() => dialogRef.current?.close()} 
            disabled={isPending}
            className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
          >Back</button>
          <button 
            onClick={confirmDeny} 
            disabled={isPending}
            className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 transition"
          >{isPending ? "Cancelling..." : "Yes, deny"}</button>
        </div>
      </dialog>
    </>
  );
}