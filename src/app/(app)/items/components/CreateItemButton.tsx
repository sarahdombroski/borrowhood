"use client"

import { useRef } from "react";
import { createItem } from "../actions";

export default function CreateItemButton() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button type="button" onClick={() => dialogRef.current?.showModal()}>Create Item</button>

      <dialog ref={dialogRef}>
        <h2>Create an item:</h2>
        <form action={createItem} className="mb-4">
          <input name="name" placeholder="Item name" required className="mr-3 w-3/4" />
          <button type="button" onClick={() => dialogRef.current?.close()}>Cancel</button>
          <button type="submit">Create Item</button>
          {/* TODO: Create some kind of warning when create fails */}
        </form>
      </dialog>
    </>
  );
}