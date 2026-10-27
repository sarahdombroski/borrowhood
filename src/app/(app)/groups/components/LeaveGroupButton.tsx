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

      <dialog 
        ref={dialogRef}
        className="m-auto w-full max-w-md rounded-xl bg-white p-6 text-gray-900 shadow-xl backdrop:bg-black/50"
      >
        <p>Leave {groupName}? You'll need a new invite to rejoin.</p>
        <div className="flex justify-end gap-3">
          <button 
            onClick={() => dialogRef.current?.close()} 
            disabled={isPending}
            className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
          >Cancel</button>
          <button 
            onClick={confirmLeave} 
            disabled={isPending}
            className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 transition"
          >{isPending ? "Leaving..." : "Yes, leave"}</button>
        </div>
      </dialog>
    </>
  );
}