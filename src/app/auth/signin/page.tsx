'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    try {
      const res = await signIn('email', {
        email,
        redirect: false,
        callbackUrl: '/',
      });

      if (res?.ok) {
        setSubmitted(true);
      } else {
        setError('Failed to send login email. Please try again.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto rounded-lg p-6 shadow-md border border-gray-200 dark:border-neutral-700">
      <h1 className="text-2xl font-semibold mb-4">Sign in with Email</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded mb-3"
            required
          />

          {error && <p className="text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50 w-full"
          >
            {loading ? "Sending..." : "Send Magic Link"}
          </button>

          {/* Go Back button */}
          <button
            className="bg-green-600 text-white px-4 py-2 rounded mt-4 w-full"
            onClick={() => router.push('/')}
            type="button"
          >
            Go Back
          </button>
        </form>
        {submitted && (
        <p className="text-green-600 bg-green-100 p-3 rounded-md shadow-sm border border-green-300 mt-4">
          ✅ Check your email for a login link.</p>
      )}
      {error && (
        <p className="text-red-500 text-sm mt-2">❌ {error}</p>
      )}
    </div>
  );
}
