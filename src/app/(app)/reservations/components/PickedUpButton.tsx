"use client"

import { useRef, useTransition } from "react";
import { Reservation } from "@/app/generated/prisma/client";
import { markPickedUp } from "../actions";

export default function PickedUpButton({ reservation, borrowerName, itemName }: { reservation: Reservation, borrowerName: string, itemName?: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isPending, startTransition] = useTransition();

  function confirmPickedUp() {
    startTransition(async () => {
      await markPickedUp(reservation.id)
    });
  }

  return (
    <>
      <button 
        onClick={() => dialogRef.current?.showModal()}
        className="rounded-lg border px-4 py-2"
      >Mark Picked Up</button>

      <dialog 
        ref={dialogRef}
        className="m-auto w-full max-w-md rounded-xl bg-white p-6 text-gray-900 shadow-xl backdrop:bg-black/50"
      >
        <p>Has {borrowerName} picked up {itemName}?</p>
        <p className="text-xs mb-2">This will update their reservation to PICKED_UP status, which helps track the item so you and {borrowerName} can know who is in possession of it.</p>
        
        <div className="flex justify-end gap-3">
          <button 
            onClick={() => dialogRef.current?.close()} 
            disabled={isPending}
            className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
          >Back</button>
          <button 
            onClick={confirmPickedUp} 
            disabled={isPending}
            className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 transition"
          >{isPending ? "Confirming..." : "Yes, confirm"}</button>
        </div>
      </dialog>
    </>
  );
}