'use client';

import React, { useEffect, useState } from 'react';
import ArticleCard from '../app/components/ArticleCard';
import SaveButton from '../app/components/SaveButton';
import { debounce } from 'lodash';
import { signOut, useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { LayoutGrid, List, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';

type Article = {
  title: string;
  description: string;
  url: string;
  urlToImage?: string;
};

const Home = () => {
  const { data: session } = useSession();
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredNews, setFilteredNews] = useState<Article[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState('general');
  const [view, setView] = useState<'grid' | 'list'>('list');
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const categories = ['General', 'Technology', 'Sports', 'Business', 'Health', 'Entertainment', 'Science'];
  const categoryLabel = `${category.charAt(0).toUpperCase()}${category.slice(1)} News`;

  const debouncedSearch = debounce((query: string, news: Article[]) => {
    const filtered = news.filter((article) =>
      article.title?.toLowerCase().includes(query.toLowerCase()) ||
      article.description?.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredNews(filtered);
  }, 300);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`/api/news?category=${category}`);
        const data = await res.json();
        if (!res.ok || !Array.isArray(data)) throw new Error('Invalid API response');
        setArticles(data);
        setFilteredNews(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load news.');
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [category]);

  useEffect(() => {
    debouncedSearch(searchQuery, articles);
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchQuery, articles]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-2">{categoryLabel}</h1>

      <div className="mb-4 flex items-center justify-between">
        
        {/* View and Theme Toggle Buttons */}
        <div className="flex gap-2 items-center">
          {/* View Toggle */}
          <button
            onClick={() => setView('list')}
            title="List View"
            aria-label="List View"
            className={`p-2 rounded ${view === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-neutral-800 text-gray-800 dark:text-gray-200'}`}
          >
            <List />
          </button>

          <button
            onClick={() => setView('grid')}
            title="Grid View"
            aria-label="Grid View"
            className={`p-2 rounded ${view === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-neutral-800 text-gray-800 dark:text-gray-200'}`}
          >
            <LayoutGrid />
          </button>
        </div>

        {/* Auth Buttons */}
        <div className="flex gap-4">
          {session?.user?.name ? (
            <div>
              <p>Welcome, {session.user.name ?? session.user.email?.split('@')[0]}!</p>
              <button onClick={() => signOut()} className="button button-red">
                Logout
              </button>
            </div>
          ) : (
            <>
              <button onClick={() => router.push('/auth')} className="button button-blue">
                Login
              </button>
              <button onClick={() => router.push('/auth')} className="button button-green">
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search news..."
        className="border p-2 w-full mb-4 rounded-md"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Categories */}
      <div className="mb-6 flex flex-wrap gap-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat.toLowerCase())}
            className={`px-4 py-2 border rounded-md transition ${
              category === cat.toLowerCase() ? 'button-highlighted' : 'button-hover'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Error and Loading */}
      {loading && <p>Loading news...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Articles */}
      <div className={
        view === 'grid'
          ? 'grid grid-cols-1 sm:grid-cols-2 gap-4'
          : 'flex flex-col gap-4'
      }>
        {!loading && !error && filteredNews.length > 0 ? (
          filteredNews.map((article) => (
            <div key={article.title}>
              <ArticleCard article={article} searchQuery={searchQuery} />
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
