import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import CreateGroupButton from "./components/CreateGroupButton";
import JoinGroupButton from "./components/JoinGroupButton";
import LeaveGroupButton from "@/app/(app)/groups/components/LeaveGroupButton";
import { getGroupMemberCount } from "./actions";
import { House, UsersRound } from "lucide-react";

export default async function Groups() {
  const user = await getCurrentUser();
  const memberships = await prisma.membership.findMany({
    where: { userId: user!.id },
    include: { group: true },
  });

  return (
    <div className="p-3">
      <h1 className="text-center">Groups</h1>

      <div className="flex justify-evenly mb-3">
        <CreateGroupButton />
        <JoinGroupButton />
      </div>

      <h2 className="text-center">My groups:</h2>
      <ul className="border rounded p-3">
        {memberships.map((m) => (
          <li key={m.group.id} className="grid grid-cols-[2fr_1fr_1fr_auto] items_center gap-4 py-2">
            <Link href={`/groups/${m.group.id}`}> 
              <p>{m.group.name}</p>
            </Link>
            <p>{m.role}</p>
            <div className="flex gap-1">
              <UsersRound size={24} />
              <p>{getGroupMemberCount(m.group.id)} Members</p>
            </div>
            <div className="flex items-center gap-2">
              <Link href={`/groups/${m.group.id}`}><House size={24} /></Link>
              <LeaveGroupButton groupId={m.group.id} groupName={m.group.name} isIcon={true} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}