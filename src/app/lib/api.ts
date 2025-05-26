// lib/api.ts

export interface Article {
  title: string;
  description: string;
  url: string;
  urlToImage?: string;
}

export const getNews = async (category = 'general', country = 'us') => {
  const apiKey = process.env.NEWS_API_KEY!;
    if (!apiKey) {
      console.error("❌ Missing NEWS_API_KEY in environment variables");
      return null;
    }
  const apiUrl = `https://newsapi.org/v2/top-headlines?category=${category}&country=${country}`;
  console.log('Fetching news from:', apiUrl);

  try {
    const response = await fetch(apiUrl, {
      headers: {
        'X-Api-Key': apiKey!,
        "Content-Type": "application/json",
      },
    });
    console.log('API response status:', response.status);
    if (!response.ok) {
      const errorText = await response.text(); // log raw response for debugging
      console.error("Raw error body:", errorText);
      throw new Error(`API responded with status: ${response.status}`);
    }
    const data = await response.json();
    console.log('API response data:', data);
    if (!data || !data.articles) {
      throw new Error('Invalid data received from API');
    }
    return data.articles;
  } catch (error) {
    console.error('Error fetching news:', error);
    return null;
  }
};
