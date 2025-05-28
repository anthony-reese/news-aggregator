'use client';

import React, { useEffect, useState } from 'react';
import ArticleCard from '../app/components/ArticleCard';
import SaveButton from '../app/components/SaveButton';
import { debounce } from 'lodash';
import { signOut, useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';

type Article = {
  title: string;
  description: string;
  url: string;
  urlToImage?: string;
};

const Home = () => {
  const { data: session } = useSession();
  const [news, setNews] = useState<Article[]>([]); 
  const [filteredNews, setFilteredNews] = useState<Article[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState('general');
  const [view, setView] = useState<'grid' | 'list'>('list');
  const router = useRouter();

  const categories = ['general', 'technology', 'sports', 'business', 'health', 'entertainment', 'science'];

  const handleCategoryChange = async (category: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/news?category=${category.toLowerCase()}`);
      if (!res.ok) throw new Error(`❌ Failed to fetch: ${res.status}`);
      const data = await res.json();
      setArticles(data);
    } catch (err) {
      console.error("❌ Error loading news by category:", err);
      setError("No data received from API");
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
  }, 300);

  useEffect(() => {
  const fetchNews = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/news?category=${category}`);
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();

      if (!data || !Array.isArray(data)) {
          throw new Error('No valid news received.');
        }

      if (!data || data.length === 0) {
        setError('No data received from API');
        return;
      }

      setArticles(data);
      setNews(data);
      setFilteredNews(data);
      console.log("Fetched initial news:", data);
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
    debouncedSearch(searchQuery, news, setFilteredNews);
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchQuery, news]); 

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-2">{category} News</h1>

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
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setCategory(cat);
              handleCategoryChange(cat);
            }}
            className={`px-4 py-2 border rounded-md transition ${
              category === cat 
                ? 'button-highlighted' 
                : 'button-hover'
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
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

      {/* Articles */}
      {articles.map((article, i) => (
        <div key={i} className="mb-4 border-b pb-2">
          <h2 className="font-semibold">{article.title}</h2>
          <p>{article.description || 'No description.'}</p>
        </div>
      ))}
    </div>
  );
};

export default Home;