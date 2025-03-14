'use client';

import React, { useEffect, useState } from 'react';
import { getNews } from '@/app/lib/api';  // Assuming you have this helper function
import NewsCard from '@/app/components/NewsCard';  // Assuming this is your card component

const Home = () => {
  const [news, setNews] = useState<any[]>([]);  // Define the type of the news items properly
  const [filteredNews, setFilteredNews] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const categories = ['General', 'Technology', 'Sports', 'Business', 'Health'];
  
  // Fetch news by category
  const handleCategoryChange = async (category: string) => {
    try {
      setLoading(true);
      const fetchedNews = await getNews(category.toLowerCase());
      console.log("Fetched news by category:", fetchedNews);
  
      if (!fetchedNews || fetchedNews.length === 0) {
        setError('No data received from API');
        return;
      }
  
      setNews(fetchedNews);
      setFilteredNews(fetchedNews);
    } catch (err) {
      setError('Failed to load news.');
      console.error('Error fetching news:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const fetchedNews = await getNews();
        console.log("Fetched initial news:", fetchedNews);
        if (!fetchedNews) {
          setError('No data received from API');
          return;
        }
        setNews(fetchedNews);
        setFilteredNews(fetchedNews);
      } catch (err) {
        setError('Failed to load news.');
        console.error('Error fetching news:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);  // This will run once when the component mounts

  // Filter news based on search query
  useEffect(() => {
    setFilteredNews(
      news.filter((article) =>
        article.title?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, news]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Top News</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search news..."
        className="border p-2 w-full mb-4 rounded-md"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Category Buttons */}
      <div className="flex gap-2 mb-4">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryChange(category)}
            className="px-4 py-2 border rounded-md hover:bg-gray-200 transition"
          >
            {category}
          </button>
        ))}
      </div>

      {/* Loading & Error Handling */}
      {loading && <p>Loading news...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* News Cards */}
      <div>
        {!loading && !error && filteredNews.length > 0 ? (
          filteredNews.map((article) =>
            article.title ? <NewsCard key={article.title} article={article} /> : null
          )
        ) : (
          !loading && !error && <p>No articles found.</p>
        )}
      </div>
    </div>
  );
};

export default Home;