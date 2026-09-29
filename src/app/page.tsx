import Link from 'next/link';

export default function Home() {
  return (
    <main>
      <p>Hello world</p>
      <Link href="/login">Sign In</Link><br/>       
      <Link href="/signup">Sign Up</Link> 
    </main>
  );
}
