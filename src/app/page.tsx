import { getCurrentUser } from '@/lib/session';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function Home() {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  return (
    <div className='p-4 flex flex-col items-center'>
      <img src="borrowhood.png" alt="borrowhood logo" className="max-w-md" />
      <h1>Welcome to Borrowhood</h1>
      <p>The hub for lending and borrowing.</p>
      <div className="flex gap-5 justify-center">
        <Link href="/login" className='text-lg'>Sign In</Link>
        <Link href="/signup" className='text-lg'>Sign Up</Link> 
      </div>
    </div>
  );
}
