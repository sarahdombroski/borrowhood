import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import Link from "next/link";
import SignOutButton from "../components/SignOutButton";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
    const user = await getCurrentUser();
    if (!user) redirect("/login");
    return (
        <div>
            <nav className="flex flex-col">
                <Link href="/dashboard">Home</Link>
                <Link href="/groups">Groups</Link>
                <Link href="/items">Items</Link>
                <Link href="/reservations">Reservations</Link>
                <SignOutButton />
            </nav>
            <main>{children}</main>
        </div>
    )
}