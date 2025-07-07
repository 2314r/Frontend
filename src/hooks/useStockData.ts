import { useState, useEffect } from 'react';
import { Stock, MarketData, ChartData, TimeRange } from '../types/stock';
import { marketStackAPI } from '../services/marketStackApi';

// Helper function to generate random values for fields not provided by the API
const generateRandomValues = (basePrice: number) => {
  // Ensure basePrice is a valid number
  const safeBasePrice = typeof basePrice === 'number' && !isNaN(basePrice) ? basePrice : 100;
  
  const change = (Math.random() - 0.5) * 20;
  const changePercent = safeBasePrice > 0 ? (change / safeBasePrice) * 100 : 0;
  
  return {
    change: Number(change.toFixed(2)),
    changePercent: Number(changePercent.toFixed(2)),
    volume: Math.floor(Math.random() * 10000000) + 1000000,
    marketCap: Math.floor(Math.random() * 1000000000000) + 10000000000,
    high: Number((safeBasePrice + Math.random() * 10).toFixed(2)),
    low: Number((safeBasePrice - Math.random() * 10).toFixed(2)),
    open: Number((safeBasePrice + (Math.random() - 0.5) * 5).toFixed(2)),
    previousClose: Number((safeBasePrice - change).toFixed(2)),
  };
};

// Stock names mapping for better display
const stockNames: { [key: string]: string } = {
  'AAPL': 'Apple Inc.',
  'GOOGL': 'Alphabet Inc.',
  'MSFT': 'Microsoft Corporation',
  'AMZN': 'Amazon.com Inc.',
  'TSLA': 'Tesla Inc.',
  'META': 'Meta Platforms Inc.',
  'NVDA': 'NVIDIA Corporation',
  'NFLX': 'Netflix Inc.',
  'JNJ': 'Johnson & Johnson',
  'PFE': 'Pfizer Inc.',
  'JPM': 'JPMorgan Chase & Co.',
  'BAC': 'Bank of America Corp.',
  'XOM': 'Exxon Mobil Corporation',
  'CVX': 'Chevron Corporation',
  'WMT': 'Walmart Inc.',
  'PG': 'Procter & Gamble Co.',
};

// Default stock symbols to fetch
const DEFAULT_STOCKS = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'META', 'NVDA', 'NFLX'];

// Helper function to convert MarketStack data to ChartData format
const convertToChartData = (apiData: any[]): ChartData[] => {
  return apiData
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(item => ({
      time: new Date(item.date).toISOString().split('T')[0],
      price: item.close || item.adj_close || 0,
      volume: item.volume || item.adj_volume || 0,
    }));
};

const generateChartData = (timeRange: TimeRange = '1M'): ChartData[] => {
  const data: ChartData[] = [];
  let basePrice = 150 + Math.random() * 100;
  let dataPoints: number;
  
  switch (timeRange) {
    case '1D':
      dataPoints = 24; // Hourly data for 1 day
      break;
    case '1M':
      dataPoints = 30; // Daily data for 1 month
      break;
    case '3M':
      dataPoints = 90; // Daily data for 3 months
      break;
    case '1Y':
      dataPoints = 365; // Daily data for 1 year
      break;
    default:
      dataPoints = 30;
  }
  
  for (let i = dataPoints; i >= 0; i--) {
    const date = new Date();
    
    if (timeRange === '1D') {
      date.setHours(date.getHours() - i);
    } else {
      date.setDate(date.getDate() - i);
    }
    
    basePrice += (Math.random() - 0.5) * (timeRange === '1Y' ? 20 : 10);
    data.push({
      time: date.toISOString().split('T')[0],
      price: Number(basePrice.toFixed(2)),
      volume: Math.floor(Math.random() * 5000000) + 1000000,
    });
  }
  
  return data;
};

export const useStockData = (country: string, timeRange: TimeRange = '1M') => {
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchStockData = async () => {
      if (!isMounted) return;
      
      try {
        setLoading(true);
        
        // Try to fetch real data from MarketStack API
        let stocks: Stock[] = [];
        
        try {
          const apiData = await marketStackAPI.getStockData(DEFAULT_STOCKS);
          console.log('API Response:', apiData);
          
          stocks = apiData.map(apiStock => {
            console.log('Processing stock:', apiStock);
            const currentPrice = apiStock.close || 100;
            const openPrice = apiStock.open || currentPrice;
            const change = currentPrice - openPrice;
            const changePercent = openPrice > 0 ? ((change / openPrice) * 100) : 0;
            const randomValues = generateRandomValues(currentPrice);
            
            return {
              symbol: apiStock.symbol || 'UNKNOWN',
              name: apiStock.name || stockNames[apiStock.symbol] || `${apiStock.symbol || 'UNKNOWN'} Corporation`,
              price: currentPrice,
              change: change,
              changePercent: changePercent,
              volume: apiStock.volume || randomValues.volume,
              marketCap: randomValues.marketCap,
              high: apiStock.high || randomValues.high,
              low: apiStock.low || randomValues.low,
              open: apiStock.open || randomValues.open,
              previousClose: openPrice, // Using open as previous close for now
              country: 'United States',
            };
          });
        } catch (apiError) {
          console.warn('Failed to fetch from MarketStack API, using fallback data:', apiError);
          
          // Fallback to mock data if API fails
          stocks = DEFAULT_STOCKS.map(symbol => {
            const basePrice = Math.random() * 500 + 50;
            const randomValues = generateRandomValues(basePrice);
            
            return {
              symbol,
              name: stockNames[symbol] || `${symbol} Corporation`,
              price: Number(basePrice.toFixed(2)),
              change: randomValues.change,
              changePercent: randomValues.changePercent,
              volume: randomValues.volume,
              marketCap: randomValues.marketCap,
              high: randomValues.high,
              low: randomValues.low,
              open: randomValues.open,
              previousClose: randomValues.previousClose,
              country: 'United States',
            };
          });
        }

        const currentHour = new Date().getHours();
        let marketStatus: 'open' | 'closed' | 'pre-market' | 'after-hours' = 'closed';
        
        if (currentHour >= 9 && currentHour < 16) {
          marketStatus = 'open';
        } else if (currentHour >= 4 && currentHour < 9) {
          marketStatus = 'pre-market';
        } else if (currentHour >= 16 && currentHour < 20) {
          marketStatus = 'after-hours';
        }

        if (isMounted) {
          setMarketData({
            stocks,
            lastUpdated: new Date().toISOString(),
            marketStatus,
          });
          setChartData(generateChartData(timeRange));
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to fetch stock data';
          setError(errorMessage);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchStockData();
    
    // Update data every 5 minutes (reduced frequency to respect API limits)
    const interval = setInterval(fetchStockData, 5 * 60 * 1000);
    
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [country, timeRange]);

  const retry = () => {
    setLoading(true);
    setError(null);
  };

  return { marketData, chartData, loading, error, retry };
};