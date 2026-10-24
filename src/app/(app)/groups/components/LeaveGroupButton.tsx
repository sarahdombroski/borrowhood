"use client"

import { useRef, useTransition } from "react";
import { leaveGroup } from "../actions";
import { X } from "lucide-react";

export default function LeaveGroupButton({ groupId, groupName, isIcon }: { groupId: number, groupName: string, isIcon: boolean }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isPending, startTransition] = useTransition();

  function confirmLeave() {
    startTransition(async () => {
      await leaveGroup(groupId);
    });
  }

  return (
    <>
      <button onClick={() => dialogRef.current?.showModal()}>{isIcon ? <X size={20} strokeWidth={3} /> : "Leave Group"}</button>

      <dialog ref={dialogRef}>
        <p>Leave {groupName}? You'll need a new invite to rejoin.</p>
        <button onClick={() => dialogRef.current?.close()} disabled={isPending}>Cancel</button>
        <button onClick={confirmLeave} disabled={isPending}>{isPending ? "Leaving..." : "Yes, leave"}</button>
      </dialog>
    </>
  );
}