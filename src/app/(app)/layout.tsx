import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import Link from "next/link";
import SignOutButton from "../components/SignOutButton";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
    const user = await getCurrentUser();
    if (!user) redirect("/login");
    return (
        <div>
            <div className="flex flex-row items-center justify-around">
                <img src="borrowhood.png" alt="borrowhood logo" className="max-w-xs" />
                <SignOutButton />
            </div>
            <nav className="flex flex-row items-center justify-between m-3">
                <Link href="/dashboard">Home</Link>
                <Link href="/groups">Groups</Link>
                <Link href="/items">Items</Link>
                <Link href="/reservations">Reservations</Link>
            </nav>
            <main>{children}</main>
        </div>
    )
}