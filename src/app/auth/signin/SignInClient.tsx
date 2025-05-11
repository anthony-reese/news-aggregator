// app/auth/signin/SignInClient.tsx

'use client';

import { signIn } from 'next-auth/react';

export default function SignInClient({ providers }: { providers: any }) {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Sign in</h1>
      {providers &&
        Object.values(providers).map((provider: any) => (
          <div key={provider.name}>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded"
              onClick={() => signIn(provider.id)}
            >
              Sign in with {provider.name}
            </button>
          </div>
        ))}
    </div>
  );
}
