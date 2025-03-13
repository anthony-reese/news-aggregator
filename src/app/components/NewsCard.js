// components/NewsCard.js

import React from 'react';

const NewsCard = ({ article }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4">
      <img src={article.urlToImage} alt={article.title} className="w-full h-48 object-cover rounded-md" />
      <h2 className="text-xl font-semibold mt-4">{article.title}</h2>
      <p className="text-gray-700 mt-2">{article.description}</p>
      <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 mt-4 inline-block">
        Read more
      </a>
    </div>
  );
};

export default NewsCard;

  