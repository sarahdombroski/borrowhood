"use client"

import { useRef } from "react";
import { createGroup } from "../actions";

export default function CreateGroupButton() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button type="button" onClick={() => dialogRef.current?.showModal()}>Create Group</button>

      <dialog ref={dialogRef}>
        <h2>Create a group:</h2>
        <form action={createGroup} className="mb-4">
          <input name="name" placeholder="Group name" required className="mr-3 w-3/4" />
          <button type="button" onClick={() => dialogRef.current?.close()}>Cancel</button>
          <button type="submit">Create Group</button>
          {/* TODO: Create some kind of warning when create fails */}
        </form>
      </dialog>
    </>
  );
}