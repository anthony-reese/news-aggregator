// lib/api.ts

export interface Article {
  title: string;
  description: string;
  url: string;
  urlToImage?: string;
}

export const getNews = async (category = ''): Promise<Article[]> => {
  try {
    const res = await fetch(`https://newsapi.org/v2/top-headlines?country=us&category=${category}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_NEWS_API_KEY}`,
      },
    });

    if (!res.ok) {
      throw new Error(`Error fetching news: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    return Array.isArray(data.articles) ? data.articles : [];
  } catch (error) {
    console.error('Failed to fetch news:', error);
    return []; // Return an empty array on failure to prevent crashing the app
  }
};
