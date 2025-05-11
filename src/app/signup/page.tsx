// filepath: :\news-aggregator\src\app\signup\page.tsx

'use client';

import Link from 'next/link';
import { signIn } from "next-auth/react";

export default function SignUpPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Sign Up</h1>
      <p className="mb-4">
        Enter your email to receive a magic link for signing up or logging in.
      </p>
      <button
        className="bg-green-600 text-white px-4 py-2 rounded"
        onClick={() => signIn("email")}
      >
        Continue with Email
      </button>

      <Link href="/">
        <button className="mt-4 text-blue-600 underline">Go Back</button>
      </Link>
    </div>
  );
}