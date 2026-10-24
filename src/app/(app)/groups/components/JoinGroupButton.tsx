"use client"

import { useRef } from "react";
import { joinGroup } from "../actions";

export default function JoinGroupButton() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button type="button" onClick={() => dialogRef.current?.showModal()}>Join Group</button>

      <dialog ref={dialogRef}>
        <h2>Join a group:</h2>
        <form action={joinGroup} className="mb-4">
          <input name="joinCode" placeholder="Join code" required className="mr-3 w-3/4" />
          <button type="button" onClick={() => dialogRef.current?.close()}>Cancel</button>
          <button type="submit">Join Group</button>
          {/* TODO: Create some kind of warning when join fails */}
        </form>
      </dialog>
    </>
  );
}