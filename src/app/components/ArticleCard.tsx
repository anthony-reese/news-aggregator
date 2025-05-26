// components/ArticleCard.tsx

import React from 'react';

type ArticleCardProps = {
  article: {
    title: string;
    description?: string;
    urlToImage?: string;
    url: string;
  };
  searchQuery: string;
};

const highlightText = (text: string, query: string): React.ReactNode[] => {
  if (!query) return [text];

  const parts = text.split(new RegExp(`(${query})`, 'gi'));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={i} className="bg-yellow-200 dark:bg-yellow-600 text-black px-1">
        {part}
      </mark>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    )
  );
};

const sharedClasses = "flex gap-4 rounded-xl shadow p-4 mb-4 transition border border-1 border-gray-300 dark:border-gray-600";

export default function ArticleCard({ article, searchQuery }: ArticleCardProps) {
  const {
    title,
    description = 'No description available.',
    urlToImage,
    url = '#',
  } = article;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`${sharedClasses}`}
    >
      {urlToImage ? (
        <img
          src={urlToImage}
          alt={title}
          className="w-32 h-20 object-cover rounded flex-shrink-0"
        />
      ) : (
        <img
          src="/fallback.jpg"
          alt="No image available"
          className="w-32 h-20 object-cover rounded flex-shrink-0"
        />
      )}
      <div>
        <h2 className="text-lg font-semibold">
          {highlightText(title, searchQuery)}
        </h2>
        <p className="text-sm">
          {highlightText(description, searchQuery)}
        </p>
      </div>
    </a>
  );
}