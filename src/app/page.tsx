// filepath: d:\news-aggregator\src\app\page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { getNews } from '../app/lib/api'; // Assuming you have this helper function
import ArticleCard from '../app/components/ArticleCard'; // Assuming this is your card component
import SaveButton from '../app/components/SaveButton';
import { debounce } from 'lodash';
import { signOut, useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';

type Article = {
  title: string;
  description: string;
  url: string;
  urlToImage?: string; // Optional field for the article image
};

const Home = () => {
  const { data: session } = useSession();
  const [news, setNews] = useState<Article[]>([]); // Use the Article type
  const [filteredNews, setFilteredNews] = useState<Article[]>([]); // Use the Article type
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('General');
  const [view, setView] = useState<'grid' | 'list'>('list');
  const router = useRouter();

  const categories = ['General', 'Technology', 'Sports', 'Business', 'Health', 'Entertainment', 'Science'];

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

      setNews(fetchedNews); // Keep the full list of news
      setFilteredNews(fetchedNews); // Update the filtered list
    } catch (err) {
      setError('Failed to load news.');
      console.error('Error fetching news:', err);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = debounce((query: string, news: Article[], setFilteredNews: Function) => {
    setFilteredNews(
      news.filter((article) =>
        article.title?.toLowerCase().includes(query.toLowerCase()) ||
        article.description?.toLowerCase().includes(query.toLowerCase())
      )
    );
  }, 300); // 300ms delay

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
        setNews(fetchedNews); // Keep the full list of news
        setFilteredNews(fetchedNews); // Update the filtered list
      } catch (err) {
        setError('Failed to load news.');
        console.error('Error fetching news:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []); // This will run once when the component mounts

  // Filter news based on search query
  useEffect(() => {
    debouncedSearch(searchQuery, news, setFilteredNews);
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchQuery, news]); // Re-run when searchQuery or news changes

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-2">Top News</h1>

        <div className="mb-4 flex items-center justify-between">
        {/* View Toggle Buttons (left) */}
        <div className="flex gap-4">
          <button
            onClick={() => setView('list')}
            className={`px-4 py-2 rounded transition ${
              view === 'list'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-neutral-800 text-gray-800 dark:text-gray-200'
            }`}
            style={{ minWidth: 110 }}
          >
            List View
          </button>
          <button
            onClick={() => setView('grid')}
            className={`px-4 py-2 rounded transition ${
              view === 'grid'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-neutral-800 text-gray-800 dark:text-gray-200'
            }`}
            style={{ minWidth: 110 }}
          >
            Grid View
          </button>
        </div>

        {/* Sign Up and Log In Buttons (right) */}
        <div className="flex gap-4">
          {session?.user?.name ? (
            <div>
              <p>Welcome, {session.user.name}!</p>
              <button onClick={() => signOut()} className="button button-red">
                Logout
              </button>
            </div>
          ) : (
            <>
              <button onClick={() => router.push('/auth/signin')} className="button button-blue">
                Login
              </button>
              <button onClick={() => router.push('/signup')} className="button button-green">
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>

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
            onClick={() => {
              setSelectedCategory(category);
              handleCategoryChange(category);
            }}
            className={`px-4 py-2 border rounded-md transition ${
              selectedCategory === category 
                ? 'button-highlighted' 
                : 'button-hover'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Loading & Error Handling */}
      {loading && <p>Loading news...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* View Toggle */}
      <div className={
        view === 'grid'
          ? 'grid grid-cols-1 sm:grid-cols-2 gap-4'
          : 'flex flex-col gap-4'
      }>
        {!loading && !error && filteredNews.length > 0 ? (
          filteredNews.map((article: Article) => (
            <div key={article.title}>
              <ArticleCard article={article} searchQuery={searchQuery} />
              <SaveButton article={article} />
            </div>
          ))
        ) : (
          !loading && !error && <p>No articles found.</p>
        )}
      </div>
    </div>
  );
};

export default Home;