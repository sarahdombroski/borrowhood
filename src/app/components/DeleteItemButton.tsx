"use client"

import { useRef, useTransition } from "react";
import { leaveGroup } from "../(app)/groups/actions";
import { archiveItem } from "../(app)/items/actions";

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
      <button onClick={() => dialogRef.current?.showModal()}>Delete Item</button>

      <dialog ref={dialogRef}>
        <p>Delete {itemName}? You will be able to unarchive this later.</p>
        <button onClick={() => dialogRef.current?.close()} disabled={isPending}>Cancel</button>
        <button onClick={confirmArchive} disabled={isPending}>{isPending ? "Leaving..." : "Yes, delete"}</button>
      </dialog>
    </>
  );
}