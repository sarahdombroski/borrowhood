import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { notFound } from "next/navigation";
import LeaveGroupButton from "@/app/components/LeaveGroupButton";

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

  return (
    <>
      <h1>{membership.group.name}</h1>
      <p>Your role: {membership.role}</p>
      {membership.role == "ADMIN" &&
        <p>Join code: {group?.joinCode}</p>
      }
      <LeaveGroupButton groupId={membership.group.id} groupName={membership.group.name} />
    </>
  );
}