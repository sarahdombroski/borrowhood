import { getCurrentUser } from "@/lib/session"

export default async function Dashboard() {
  const user = await getCurrentUser();
  return (
    <main>
      <p>Welcome to the dashboard!</p>
      <p>Signed in as {user?.name}</p>
    </main>
  )
}