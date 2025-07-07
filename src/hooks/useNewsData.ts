import { useState, useEffect } from 'react';
import { NewsItem } from '../types/stock';

const generateMockNews = (): NewsItem[] => {
  const newsItems: NewsItem[] = [
    {
      id: '1',
      title: 'Tech Stocks Rally as AI Investment Surge Continues',
      summary: 'Major technology companies see significant gains as artificial intelligence investments drive market optimism. Analysts predict continued growth in the sector.',
      url: 'https://example.com/news/1',
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      source: 'Market Watch',
      imageUrl: 'https://images.pexels.com/photos/159888/pexels-photo-159888.jpeg?auto=compress&cs=tinysrgb&w=400',
      relatedSymbols: ['AAPL', 'GOOGL', 'MSFT'],
    },
    {
      id: '2',
      title: 'Federal Reserve Signals Potential Rate Changes',
      summary: 'The Federal Reserve hints at possible interest rate adjustments in response to current economic indicators, affecting market sentiment across sectors.',
      url: 'https://example.com/news/2',
      publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      source: 'Financial Times',
      imageUrl: 'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=400',
      relatedSymbols: ['SPY', 'QQQ'],
    },
    {
      id: '3',
      title: 'Electric Vehicle Market Shows Strong Q4 Performance',
      summary: 'Electric vehicle manufacturers report robust quarterly results, with Tesla leading the charge in both sales and innovation metrics.',
      url: 'https://example.com/news/3',
      publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      source: 'Reuters',
      imageUrl: 'https://images.pexels.com/photos/110844/pexels-photo-110844.jpeg?auto=compress&cs=tinysrgb&w=400',
      relatedSymbols: ['TSLA'],
    },
    {
      id: '4',
      title: 'Healthcare Sector Gains Momentum with New Drug Approvals',
      summary: 'Several pharmaceutical companies receive FDA approvals for breakthrough treatments, boosting investor confidence in the healthcare sector.',
      url: 'https://example.com/news/4',
      publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      source: 'Bloomberg',
      imageUrl: 'https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg?auto=compress&cs=tinysrgb&w=400',
      relatedSymbols: ['JNJ', 'PFE'],
    },
    {
      id: '5',
      title: 'Streaming Wars Heat Up as Competition Intensifies',
      summary: 'Major streaming platforms announce new content strategies and pricing models as they compete for market share in the evolving entertainment landscape.',
      url: 'https://example.com/news/5',
      publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      source: 'CNBC',
      imageUrl: 'https://images.pexels.com/photos/265685/pexels-photo-265685.jpeg?auto=compress&cs=tinysrgb&w=400',
      relatedSymbols: ['NFLX', 'DIS'],
    },
  ];

  return newsItems;
};

export const useNewsData = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const mockNews = generateMockNews();
        setNews(mockNews);
        setError(null);
      } catch (err) {
        setError('Failed to fetch news data');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
    
    // Update news every 5 minutes
    const interval = setInterval(fetchNews, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return { news, loading, error };
};