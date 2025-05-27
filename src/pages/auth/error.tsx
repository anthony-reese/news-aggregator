'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function AuthErrorPage() {
  const params = useSearchParams();
  const error = params?.get('error');

  let message = 'An unexpected error occurred. Please try again.';

  switch (error) {
    case 'Verification':
      message = 'This login link is no longer valid. Please request a new one.';
      break;
    case 'CredentialsSignin':
      message = 'Invalid credentials. Please check your login details.';
      break;
    case 'Configuration':
      message = 'Server configuration error. Please contact support.';
      break;
    case 'AccessDenied':
      message = 'You do not have access to this page.';
      break;
    case 'Callback':
      message = 'Sign-in failed. Please try again.';
      break;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-2xl font-bold text-red-600 mb-2">Authentication Error</h1>
      <p className="text-gray-700 dark:text-gray-300 mb-4">{message}</p>
      <Link href="/auth/signin" className="text-blue-600 hover:underline">
        ← Go back to sign in
      </Link>
    </div>
  );
}
