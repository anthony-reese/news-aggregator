// lib/api.ts

export interface Article {
  title: string;
  description: string;
  url: string;
  urlToImage?: string;
}

export const getNews = async (category = 'general', country = 'us') => {
  const apiKey = '33d0333d7a3a4108a122c4a23287928a'; // Replace with your actual API key
  const apiUrl = `https://newsapi.org/v2/top-headlines?category=${category}&country=${country}&apiKey=${apiKey}`;
  console.log('Fetching news from:', apiUrl);

  try {
    const response = await fetch(apiUrl);
    console.log('API response status:', response.status);
    if (!response.ok) {
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
