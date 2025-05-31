'use client';

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    const result = await signIn("email", {
      email,
      redirect: false,
      callbackUrl: "/"
    });

    if (!result?.error) {
      setSent(true);
    } else {
      alert("Something went wrong. Try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 border p-6 rounded-lg shadow-md dark:border-neutral-700">
      <h1 className="text-2xl font-semibold mb-4">Welcome</h1>
      {!sent ? (
        <>
          <p className="mb-4">Enter your email. We'll send a magic link to sign in or create your account.</p>
          <input
            type="email"
            className="border p-2 w-full mb-4 rounded-md"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="flex gap-4">
            <button
              onClick={handleLogin}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Send Magic Link
            </button>
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded"
              onClick={() => router.push('/')}
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <p className="text-green-600">✅ Magic link sent to {email}. Check your inbox.</p>
      )}
    </div>
  );
}
