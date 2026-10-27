import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { notFound } from "next/navigation";
import { getVisibleItems } from "../../items/actions";
import Link from "next/link";
import LeaveGroupButton from "../components/LeaveGroupButton";
import { getGroupMembers } from "../actions";

export default async function GroupPage({ params }: { params: Promise<{ groupId: string }> }) {
  const { groupId } = await params;
  const user = await getCurrentUser();
  if (!user) notFound();
  
  const membership = await prisma.membership.findFirst({
    where: { userId: user.id, groupId: Number(groupId) },
    include: { group: true }
  });
  if (!membership) notFound();
  const group = await prisma.group.findFirst({
    where: { id: Number(groupId) }
  });
  const items = await getVisibleItems(Number(groupId));
  const members = await getGroupMembers(Number(groupId));

  return (
    <>
      <h1 className="text-center">{membership.group.name}</h1>
      <div className="flex justify-evenly">
        <p>Your role: {membership.role}</p>
        <LeaveGroupButton groupId={membership.group.id} groupName={membership.group.name} isIcon={false} />
      </div>
      {membership.role == "ADMIN" &&
        <p className="text-center">Join code: {group?.joinCode}</p>
      }
      <div className="grid grid-cols-[1fr_1fr] items-center gap-4 py-2">
        <ul className="border rounded p-3">
          <h2 className="text-center">Members</h2>
          {members.map((member) => (
            <li key={member.id} className="grid grid-cols-[2fr_1fr_auto] items_center">
              <p>{member.user.name}</p>
              <p>{member.role}</p>
              <p>{member.user.email}</p>
            </li>
          ))}
        </ul>
        <ul className="border rounded p-3">
          <h2 className="text-center">Items</h2>
          {items.map((item) => (
            <li key={item.id} className="grid grid-cols-[1fr_1fr]">
              <p>{item.name}</p>
              <Link href={`../items/${item.id}/reserve?groupId=${groupId}`}>Reserve</Link>
              </li>
          ))}
        </ul>
      </div>
    </>
  );
}