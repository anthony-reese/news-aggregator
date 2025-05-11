// filepath: d:\news-aggregator\src\app\page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { getNews } from '@/app/lib/api';  // Assuming you have this helper function
import NewsCard from '@/app/components/NewsCard';  // Assuming this is your card component
import SaveButton from '@/app/components/SaveButton';
import { debounce } from 'lodash';
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';

type Article = {
  title: string;
  description: string;
  url: string;
  // add any other expected fields
};

const Home = () => {
  const { data: session } = useSession();
  const [news, setNews] = useState<any[]>([]);  // Define the type of the news items properly
  const [filteredNews, setFilteredNews] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('General');
  const router = useRouter();

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

  const debouncedSearch = debounce((query: string, news: any[], setFilteredNews: Function) => {
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
    return () => {
      debouncedSearch.cancel();
    };
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Top News</h1>

      {/* Sign Up and Log In Buttons */}
      <div className="mb-4 flex gap-4">
        {session ? (
          <div>
            <p>Welcome, {session.user?.name}!</p>
            <button onClick={() => signOut()} className="button button-red">
              Logout
            </button>
          </div>
        ) : (
          <div className="flex gap-4">
            <button onClick={() => signIn("email", { email: "user@example.com" })} className="button button-blue">
              Login
            </button>
            <button onClick={() => router.push('/signup')} className="button button-green">
              Sign Up
            </button>
          </div>
        )}
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

      {/* News Cards */}
      <div>
      {!loading && !error && filteredNews.length > 0 ? (
          filteredNews.map((article) =>
            article.title ? (
              <div key={article.title}>
                <NewsCard article={article} searchQuery={searchQuery} />
                <SaveButton article={article} />
              </div>
            ) : null
          )
        ) : (
          !loading && !error && <p>No articles found.</p>
        )}
      </div>
    </div>
  );
};

export default Home;