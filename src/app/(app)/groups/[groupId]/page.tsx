import { requireMember } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { notFound } from "next/navigation";
import { getVisibleItems } from "../../items/actions";
import Link from "next/link";
import LeaveGroupButton from "../components/LeaveGroupButton";
import { getGroupById, getGroupMembers } from "../actions";
import { NotFoundError } from "@/lib/errors";
import { idParamSchema } from "@/lib/validation/schemas";

export default async function GroupPage({ params }: { params: Promise<{ groupId: string }> }) {
  const { groupId: rawGroupId } = await params;
  const groupId = Number(idParamSchema.parse(rawGroupId));
  const user = await getCurrentUser();
  if (!user) notFound();
  
  const group = await getGroupById(groupId);
  if (!group) throw new NotFoundError();
  const membership = await requireMember(user.id, groupId);
  const items = await getVisibleItems(group.id);
  const members = await getGroupMembers(groupId);

  return (
    <>
      <h1 className="text-center">{group.name}</h1>
      <div className="flex justify-evenly">
        <p>Your role: {membership.role}</p>
        <LeaveGroupButton groupId={group.id} groupName={group.name} isIcon={false} />
      </div>
      {membership.role == "ADMIN" &&
        <p className="text-center">Join code: {group?.joinCode}</p>
      }
      <div className="md:grid grid-cols-[1fr_1fr] items-center gap-4 py-2 m-2">
        <ul className="border rounded p-3 min-h-[50vh] mb-3 md:mb-0">
          <h2 className="text-center">Members</h2>
          {members.map((member) => (
            <li key={member.id} className="md:grid grid-cols-[1fr_1fr] items_center">
              <div className="flex justify-between">
                <p>{member.user.name}</p>
                <p>{member.role}</p>
              </div>
              <p className="text-right">{member.user.email}</p>
            </li>
          ))}
        </ul>
        <ul className="border rounded p-3 min-h-[50vh]">
          <h2 className="text-center">Items</h2>
          {items.map((item) => (
            <li key={item.id} className="grid grid-cols-[1fr_auto]">
              <p>{item.name}</p>
              <Link href={`../items/${item.id}/reserve?groupId=${groupId}`}>Reserve</Link>
              </li>
          ))}
        </ul>
      </div>
    </>
  );
}