"use client"

import { useRef } from "react";
import { createGroup } from "../actions";

export default function CreateGroupButton() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button 
        type="button" 
        onClick={() => dialogRef.current?.showModal()}
        className="rounded-lg border px-4 py-2"
      >Create Group</button>

      <dialog 
        ref={dialogRef}
        className="m-auto w-full max-w-md rounded-xl bg-white p-6 text-gray-900 shadow-xl backdrop:bg-black/50"
      >
        <h2 className="mb-4 text-xl font-semibold">Create a group:</h2>
        <form action={createGroup} className="space-y-5">
          <input 
            name="name" 
            placeholder="Group name" 
            required 
            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200" />
          <div className="flex justify-end gap-3">
            <button 
              type="button" 
              onClick={() => dialogRef.current?.close()}
              className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
            >Cancel</button>
            <button 
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 transition"
            >Create Group</button>
          </div>
          {/* TODO: Create some kind of warning when create fails */}
        </form>
      </dialog>
    </>
  );
}