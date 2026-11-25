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
      <ul className="border rounded p-3 min-h-[50vh]">
        {memberships.map((m) => (
          <li key={m.group.id} className="md:grid md:grid-cols-[1fr_1fr] gap-4 py-2">
            <div className="flex justify-between lg:grid md: grid-cols-[1fr_1fr]">
              <Link href={`/groups/${m.group.id}`}> 
                <p className="text-center md:text-left">{m.group.name}</p>
              </Link>
              <p>{m.role}</p>
            </div>
            <div className="flex justify-between">
              <div className="flex gap-1">
                <UsersRound size={24} />
                <p>{getGroupMemberCount(m.group.id)} Members</p>
              </div>
              <div className="flex gap-2">
                <Link href={`/groups/${m.group.id}`}><House size={24} /></Link>
                <LeaveGroupButton groupId={m.group.id} groupName={m.group.name} isIcon={true} />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}