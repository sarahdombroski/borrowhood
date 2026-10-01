import { getCurrentUser } from "@/lib/session";
import { createGroup } from "./actions";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function Groups() {
  const user = await getCurrentUser();
  const memberships = await prisma.membership.findMany({
    where: { userId: user!.id },
    include: { group: true },
  });

  return (
    <div>
      <h1>Welcome to your full groups view!</h1>
      <h2>Create a group:</h2>
      <form action={createGroup}>
        <input name="name" placeholder="Group name" required />
        <button type="submit">Create group</button>
      </form>
      <h2>My groups:</h2>
      <ul>
        {memberships.map((m) => (
          <li key={m.group.id}><Link href={`/groups/${m.group.id}`}>{m.group.name} ({m.role})</Link></li>
        ))}
      </ul>
    </div>
  )
}