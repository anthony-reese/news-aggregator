// components/NewsCard.tsx

import React from 'react';
import { Article } from '@/app/lib/api';

interface NewsCardProps {
  article: Article;
  searchQuery: string;
}

const highlightText = (text: string, query: string) => {
  if (!query) return text;
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
};

const NewsCard: React.FC<NewsCardProps> = ({ article, searchQuery }) => {
  if (!article || !article.title) {
    console.error('Invalid article data:', article);
    return null;
  }

  return (
    <div className="border p-4 rounded-md shadow-md">
      <h2
        className="text-xl font-bold"
        dangerouslySetInnerHTML={{
          __html: highlightText(article.title, searchQuery),
        }}
      />
      <p
        className="text-gray-600"
        dangerouslySetInnerHTML={{
          __html: highlightText(article.description || '', searchQuery),
        }}
      />
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500"
      >
        Read more
      </a>
    </div>
  );
};

export default NewsCard;


  