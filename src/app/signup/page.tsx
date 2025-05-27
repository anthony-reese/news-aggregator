'use client';

import Link from 'next/link';
import { signIn } from "next-auth/react";
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const router = useRouter();
  return (
    <div className="max-w-md mx-auto rounded-lg p-6 shadow-md border border-gray-200 dark:border-neutral-700">
      <h1 className="text-2xl font-semibold mb-4">Sign Up</h1>
      <p className="mb-4">
        Enter your email to receive a magic link for signing up or logging in.
      </p>
      <div className="flex gap-4">
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={() => signIn("email")}
      >
        Continue with Email
      </button>

      <button
        className="bg-green-600 text-white px-4 py-2 rounded"
        onClick={() => router.push('/')}
        type="button"
      >
        Go Back
      </button>
      </div>
    </div>
  );
}