// app/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { getNews, Article } from '@/app/lib/api';
import NewsCard from '@/app/components/NewsCard';

const Home = () => {
  const [news, setNews] = useState<Article[]>([]);
  const [filteredNews, setFilteredNews] = useState<Article[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const categories = ['General', 'Technology', 'Sports', 'Business', 'Health'];

  const handleCategoryChange = async (category: string) => {
    const fetchedNews = await getNews(category.toLowerCase());
    setNews(fetchedNews);
    setFilteredNews(fetchedNews);
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const fetchedNews = await getNews();
        console.log(fetchedNews);
        setNews(fetchedNews);
        setFilteredNews(fetchedNews);
      } catch (err) {
        console.error('Error fetching news:', err);
        setError('Failed to load news.');
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  useEffect(() => {
    setFilteredNews(
      news.filter(article =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, news]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Top News</h1>

      {/* Search Bar */}
      <input
        type='text'
        placeholder='Search news...'
        className='border p-2 w-full mb-4 rounded-md'
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Category Buttons */}
      <div className='flex gap-2 mb-4'>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryChange(category)}
            className='px-4 py-2 border rounded-md hover:bg-gray-200'
          >
            {category}
          </button>
        ))}
      </div>

      {loading && <p>Loading news...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* News Cards */}
      <div>
        {!loading && !error && filteredNews.length > 0 ? (
          filteredNews.map((article, index) => 
            <NewsCard key={index} article={article} />)
        ) : (
          !loading && !error && <p>No articles found.</p>
        )}
      </div>
    </div>
  );
};

export default Home;
