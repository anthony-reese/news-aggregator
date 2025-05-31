import React from 'react';
import SaveButton from './SaveButton';

type ArticleCardProps = {
  article: {
    title: string;
    description?: string;
    urlToImage?: string;
    url: string;
  };
  searchQuery: string;
};

const highlightText = (text: string | undefined | null, query: string): React.ReactNode[] => {
  if (!text) return [];
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
      className={`${sharedClasses} h-full items-center gap-4`}
    >
      {urlToImage ? (
        <img
          src={urlToImage}
          alt={title}
          className="w-42 h-30 object-cover rounded flex-shrink-0"
          loading="lazy"
        />
      ) : (
        <img
          src="/fallback.jpg"
          alt="No image available"
          className="w-42 h-30 object-cover rounded flex-shrink-0"
        />
      )}
      <div className="flex flex-col justify-center flex-1 overflow-visible">
        <div className="flex-1">
          <h2 className="text-lg font-semibold mb-1">
            {highlightText(title, searchQuery)}
          </h2>
          <p className="text-md break-words">
            {highlightText(description, searchQuery)}
          </p>
        </div>
        <div className="mt-2 self-end">
          <SaveButton article={article} />
        </div>
      </div>
    </a>
  );
}