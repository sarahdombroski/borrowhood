"use client"

import { useRef, useState } from "react";
import { unstable_rethrow } from "next/navigation";
import { createItem } from "../actions";

export default function CreateItemButton() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate(formData: FormData) {
    setError(null);
    try {
      await createItem(formData);
    } catch (error) {
      unstable_rethrow(error);
      setError("Unable to create the item. Please try again.");
    }
  }

  return (
    <>
      <button 
        type="button" 
        onClick={() => dialogRef.current?.showModal()}
        className="rounded-lg border px-4 py-2">
          Create Item
      </button>

      <dialog 
        ref={dialogRef}
        className="m-auto w-full max-w-md rounded-xl bg-white p-6 text-gray-900 shadow-xl backdrop:bg-black/50"
      >
        <h2 className="mb-4 text-xl font-semibold">Create an item:</h2>
        <form action={handleCreate} className="space-y-5">
          <input 
            name="name" 
            placeholder="Item name" 
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
            >Create Item</button>
          </div>
          {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
        </form>
      </dialog>
    </>
  );
}
