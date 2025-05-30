'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn('email', {
      email,
      callbackUrl: '/',
    });
  };

  return (
    <div className="max-w-md mx-auto rounded-lg p-6 shadow-md border border-gray-200 dark:border-neutral-700">
      <h1 className="text-2xl font-semibold mb-4">Sign Up</h1>
      <p className="mb-4">
        Enter your email to receive a magic link for signing up or logging in.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border px-3 py-2 rounded-md dark:bg-neutral-800 dark:text-white"
        />

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Continue with Email
        </button>

        <button
          type="button"
          onClick={() => router.push('/')}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Go Back
        </button>
      </form>
    </div>
  );
}
