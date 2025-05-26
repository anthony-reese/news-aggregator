// /src/app/components/NewsList.tsx

'use client';
import { useState } from 'react';
import NewsList from '../components/NewsList';

const articles = [
  {
    title: 'Sample Article',
    description: 'This is a sample article description.',
    urlToImage: 'https://example.com/image.jpg',
    url: 'https://example.com/article',
  },
  // Add more articles here
];

export default function NewsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Latest News</h1>
      
      <input
        type="text"
        placeholder="Search articles..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-6 p-2 border border-gray-300 rounded w-full"
      />
      
      <NewsList articles={filteredArticles} searchQuery={searchQuery} />
    </div>
  );
}
