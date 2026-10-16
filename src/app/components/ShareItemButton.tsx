"use client"

import { useRef, useTransition } from "react";
import { setItemVisibility } from "../(app)/items/actions";

type ShareableGroup = {
  id: number;
  name: string;
};

export default function ShareItemButton({
  itemId,
  itemName,
  groups,
}: {
  itemId: number;
  itemName: string;
  groups: ShareableGroup[];
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      await setItemVisibility(itemId, formData);
      dialogRef.current?.close();
    });
  }

  return (
    <>
      <button onClick={() => dialogRef.current?.showModal()}>Share to group</button>

      <dialog ref={dialogRef}>
        <p>Share {itemName} with the following groups:</p>
        <form onSubmit={handleSubmit}>
          {groups.map((g) => (
            <label key={g.id}>
              <input type="checkbox" name="groupIds" value={g.id} />
              {g.name}
            </label>
          ))}
          <button onClick={() => dialogRef.current?.close()} disabled={isPending}>Cancel</button>
          <button type="submit" disabled={isPending}>{isPending ? "Leaving..." : "Share"}</button>
        </form>
      </dialog>
    </>
  );
}
