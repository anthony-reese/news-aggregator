// components/NewsCard.tsx

import React from 'react';
import { Article } from '@/app/lib/api';

interface NewsCardProps {
  article: Article;
}

const NewsCard: React.FC<NewsCardProps> = ({ article }) => {
  if (!article || !article.title) {
    console.error('Invalid article data:', article);
    return null; // Prevents rendering an invalid NewsCard
  }

  return (
    <div className="border p-4 rounded-md shadow-md">
      <h2 className="text-xl font-bold">{article.title}</h2>
      <p className="text-gray-600">{article.description}</p>
      <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-blue-500">
        Read more
      </a>
    </div>
  );
};

export default NewsCard;


  