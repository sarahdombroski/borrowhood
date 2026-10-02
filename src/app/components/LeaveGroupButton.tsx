"use client"

import { useRef, useTransition } from "react";
import { leaveGroup } from "../(app)/groups/actions";

export default function LeaveGroupButton({ groupId, groupName }: { groupId: number, groupName: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isPending, startTransition] = useTransition();

  function confirmLeave() {
    startTransition(async () => {
      await leaveGroup(groupId);
    });
  }

  return (
    <>
      <button onClick={() => dialogRef.current?.showModal()}>Leave Group</button>

      <dialog ref={dialogRef}>
        <p>Leave {groupName}? You'll need a new invite to rejoin.</p>
        <button onClick={() => dialogRef.current?.close()} disabled={isPending}>Cancel</button>
        <button onClick={confirmLeave} disabled={isPending}>{isPending ? "Leaving..." : "Yes, leave"}</button>
      </dialog>
    </>
  );
}