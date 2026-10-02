import { getCurrentUser } from "@/lib/session";
import { createGroup, joinGroup } from "./actions";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function Groups() {
  const user = await getCurrentUser();
  const memberships = await prisma.membership.findMany({
    where: { userId: user!.id },
    include: { group: true },
  });

  return (
    <div className="p-3">
      <h1 className="text-center">Groups</h1>

      <h2>Create a group:</h2>
      <form action={createGroup} className="mb-4">
        <input name="name" placeholder="Group name" required className="mr-3 w-3/4" />
        <button type="submit">Create group</button>
      </form>

      <h2>Join a group:</h2>
      <form action={joinGroup} className="mb-4">
        <input name="joinCode" placeholder="Join code" required className="mr-3 w-3/4" />
        <button type="submit">Join group</button>
      </form>

      <h2>My groups:</h2>
      <ul className='list-["-"] list-inside'>
        {memberships.map((m) => (
          <li key={m.group.id}><Link href={`/groups/${m.group.id}`}> {m.group.name} ({m.role})</Link></li>
        ))}
      </ul>
    </div>
  )
}