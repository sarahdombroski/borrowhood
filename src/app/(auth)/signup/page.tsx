"use client";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Signup() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const { error } = await authClient.signUp.email({
      name: String(form.get("name")),
      email: String(form.get("email")),
      password: String(form.get("password")),
    });
    if (error) return setError(error.message ?? "Sign up failed");
    router.push("/dashboard");
  }

  return (
    <>
      <img src="borrowhood.png" alt="borrowhood logo" className="max-w-sm m-auto" />
      <form onSubmit={onSubmit} className="border-2 border-black rounded-lg p-2 m-4 flex flex-col gap-3">
        <p>Enter your information to sign up:</p>
        <input name="name" placeholder="Name" required />
        <input name="email" type="email" placeholder="Email" required />
        <input name="password" type="password" placeholder="Password" required />
        <button type="submit">Sign up</button>
        {error &&
          <p>{error}</p>
        }
      </form>      
    </>
  );
}
