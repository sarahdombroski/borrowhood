import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { notFound } from "next/navigation";

export default async function GroupPage({ params }: { params: Promise<{ groupId: string }> }) {
  const { groupId } = await params;
  const user = await getCurrentUser();
  if (!user) notFound();
  
  const membership = await prisma.membership.findFirst({
    where: { userId: user.id, groupId: Number(groupId) },
    include: { group: true }
  });
  if (!membership) notFound();

  return (
    <>
      <h1>{membership.group.name}</h1>
      <p>Your role: {membership.role}</p>
    </>
  );
}