import Link from "next/link";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <nav className="flex flex-col">
                <Link href="/dashboard">Home</Link>
                <Link href="/groups">Groups</Link>
                <Link href="/items">Items</Link>
                <Link href="/reservations">Reservations</Link>
            </nav>
            <main>{children}</main>
        </div>
    )
}