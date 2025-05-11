'use client';

import { useSession } from 'next-auth/react';
import { useState } from 'react';

export default function SaveButton({ article }: { article: { url: string; title: string; imageUrl?: string } }) {
  const { data: session } = useSession();
  const [saved, setSaved] = useState(false);

  const toggleSave = async () => {
    if (!session) {
      alert('Please sign in to save articles.');
      return;
    }

    if (!saved) {
      await fetch('/api/saved', {
        method: 'POST',
        body: JSON.stringify(article),
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      await fetch(`/api/saved?url=${encodeURIComponent(article.url)}`, {
        method: 'DELETE',
      });
    }

    setSaved(!saved);
  };

  return (
    <button onClick={toggleSave}>
      {saved ? '★ Saved' : '☆ Save'}
    </button>
  );
}
