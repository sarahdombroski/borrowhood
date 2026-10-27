"use client"

import { useRef, useTransition } from "react";
import { archiveItem } from "../actions";

export default function DeleteItemButton({ itemId, itemName }: { itemId: number, itemName: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isPending, startTransition] = useTransition();

  function confirmArchive() {
    startTransition(async () => {
      await archiveItem(itemId);
    });
  }

  return (
    <>
      <button 
        onClick={() => dialogRef.current?.showModal()}
        className="rounded-lg border px-4 py-2"
      >Delete Item</button>

      <dialog 
        ref={dialogRef}
        className="m-auto w-full max-w-md rounded-xl bg-white p-6 text-gray-900 shadow-xl backdrop:bg-black/50"
      >
        <p>Delete {itemName}? You will be able to unarchive this later.</p>
        
        <div className="flex justify-end gap-3">
          <button 
            onClick={() => dialogRef.current?.close()} 
            disabled={isPending}
            className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
          >Cancel</button>
          <button 
            onClick={confirmArchive} 
            disabled={isPending}
            className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 transition"
          >{isPending ? "Leaving..." : "Yes, delete"}</button>
        </div>
      </dialog>
    </>
  );
}
