import { useState, useEffect } from 'react';
import { Stock, ChartData, TimeRange } from '../types/stock';
import { marketStackAPI } from '../services/marketStackApi';

// Helper function to generate random values for fields not provided by the API
const generateRandomValues = (basePrice: number) => {
  const change = (Math.random() - 0.5) * 20;
  const changePercent = (change / basePrice) * 100;
  
  return {
    change: Number(change.toFixed(2)),
    changePercent: Number(changePercent.toFixed(2)),
    volume: Math.floor(Math.random() * 10000000) + 1000000,
    marketCap: Math.floor(Math.random() * 1000000000000) + 10000000000,
    high: Number((basePrice + Math.random() * 10).toFixed(2)),
    low: Number((basePrice - Math.random() * 10).toFixed(2)),
    open: Number((basePrice + (Math.random() - 0.5) * 5).toFixed(2)),
    previousClose: Number((basePrice - change).toFixed(2)),
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

const sectors: { [key: string]: string } = {
  'AAPL': 'Technology',
  'GOOGL': 'Communication Services',
  'MSFT': 'Technology',
  'AMZN': 'Consumer Cyclical',
  'TSLA': 'Consumer Cyclical',
  'META': 'Communication Services',
  'NVDA': 'Technology',
  'NFLX': 'Communication Services',
  'JNJ': 'Healthcare',
  'PFE': 'Healthcare',
  'JPM': 'Financial Services',
  'BAC': 'Financial Services',
  'XOM': 'Energy',
  'CVX': 'Energy',
  'WMT': 'Consumer Defensive',
  'PG': 'Consumer Defensive',
};

const descriptions: { [key: string]: string } = {
  'AAPL': 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide. The company serves consumers, and small and mid-sized businesses; and the education, enterprise, and government markets.',
  'GOOGL': 'Alphabet Inc. provides various products and platforms in the United States, Europe, the Middle East, Africa, the Asia-Pacific, Canada, and Latin America. It operates through Google Services, Google Cloud, and Other Bets segments.',
  'MSFT': 'Microsoft Corporation develops, licenses, and supports software, services, devices, and solutions worldwide. The company operates in three segments: Productivity and Business Processes, Intelligent Cloud, and More Personal Computing.',
  'AMZN': 'Amazon.com, Inc. engages in the retail sale of consumer products and subscriptions in North America and internationally. The company operates through three segments: North America, International, and Amazon Web Services (AWS).',
  'TSLA': 'Tesla, Inc. designs, develops, manufactures, leases, and sells electric vehicles, and energy generation and storage systems in the United States, China, and internationally.',
  'META': 'Meta Platforms, Inc. develops products that enable people to connect and share with friends and family through mobile devices, personal computers, virtual reality headsets, wearables, and in-home devices worldwide.',
  'NVDA': 'NVIDIA Corporation provides graphics, and compute and networking solutions in the United States, Taiwan, China, and internationally. The company operates in two segments, Graphics and Compute & Networking.',
  'NFLX': 'Netflix, Inc. provides entertainment services. It offers TV series, documentaries, feature films, and mobile games across a wide variety of genres and languages to members in over 190 countries.',
  'JNJ': 'Johnson & Johnson researches, develops, manufactures, and sells various products in the healthcare field worldwide. It operates through Consumer Health, Pharmaceutical, and Medical Devices segments.',
  'PFE': 'Pfizer Inc. discovers, develops, manufactures, markets, distributes, and sells biopharmaceutical products worldwide. It offers medicines and vaccines in various therapeutic areas.',
  'JPM': 'JPMorgan Chase & Co. operates as a financial services company worldwide. It operates through Consumer & Community Banking, Corporate & Investment Bank, Commercial Banking, and Asset & Wealth Management segments.',
  'BAC': 'Bank of America Corporation provides banking and financial products and services for individual consumers, small and middle-market businesses, institutional investors, corporations, and governments worldwide.',
  'XOM': 'Exxon Mobil Corporation explores for and produces crude oil and natural gas in the United States, Canada/South America, Europe, Africa, Asia, and Australia/Oceania. It operates through Upstream, Energy Products, Chemical Products, and Specialty Products segments.',
  'CVX': 'Chevron Corporation engages in integrated energy and chemical operations worldwide. The company operates through Upstream and Downstream segments.',
  'WMT': 'Walmart Inc. engages in the operation of retail, wholesale, and other units in various formats worldwide. It operates through three segments: Walmart U.S., Walmart International, and Sam\'s Club.',
  'PG': 'The Procter & Gamble Company provides branded consumer packaged goods to consumers through mass merchandisers, e-commerce, grocery stores, membership club stores, drug stores, department stores, distributors, wholesalers, hospitals, and other retail establishments.',
};

// Helper function to convert MarketStack data to ChartData format
const convertToChartData = (apiData: any[], timeRange: TimeRange = '1M'): ChartData[] => {
  return apiData
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(item => {
      const date = new Date(item.date);
      return {
        time: timeRange === '1D' ? date.toISOString() : date.toISOString().split('T')[0],
        price: item.close || item.adj_close || 0,
        volume: item.volume || item.adj_volume || 0,
      };
    });
};

// Create realistic 1D data from daily data (since intraday requires premium plan)
const createRealistic1DData = (dailyData: any[], symbol: string): ChartData[] => {
  const data: ChartData[] = [];
  
  if (dailyData.length === 0) return data;
  
  // Get the most recent day's data as base
  const latestDay = dailyData[dailyData.length - 1];
  const basePrice = latestDay.close || 100;
  const baseVolume = latestDay.volume || 1000000;
  
  // Create 24 hourly data points for today based on recent price trends
  const today = new Date();
  const marketOpenHour = 9; // Market opens at 9 AM
  const marketCloseHour = 16; // Market closes at 4 PM
  
  // Calculate recent price trend from daily data
  const recentPrices = dailyData.slice(-5).map(d => d.close || d.adj_close || basePrice);
  const priceTrend = recentPrices.length > 1 ? 
    (recentPrices[recentPrices.length - 1] - recentPrices[0]) / recentPrices.length : 0;
  
  for (let hour = 0; hour < 24; hour++) {
    const date = new Date(today);
    date.setHours(hour, 0, 0, 0);
    
    let price = basePrice;
    let volume = baseVolume;
    
    // Add realistic price variations based on market hours and recent trend
    if (hour >= marketOpenHour && hour <= marketCloseHour) {
      // More volatility during market hours
      const marketVariation = (Math.random() - 0.5) * (basePrice * 0.015); // 1.5% max variation
      const trendComponent = (priceTrend * hour) / 24; // Gradual trend application
      price = basePrice + marketVariation + trendComponent;
      volume = baseVolume * (0.6 + Math.random() * 1.2); // Volume varies between 60% and 180%
    } else {
      // Less volatility outside market hours, but still some movement
      const afterHoursVariation = (Math.random() - 0.5) * (basePrice * 0.003); // 0.3% max variation
      const trendComponent = (priceTrend * hour) / 24;
      price = basePrice + afterHoursVariation + trendComponent;
      volume = baseVolume * 0.05; // Very low volume outside market hours
    }
    
    data.push({
      time: date.toISOString(),
      price: Number(price.toFixed(2)),
      volume: Math.floor(volume),
    });
  }
  
  return data;
};



// Fallback chart data generator (used when API fails)
const generateDetailedChartData = (timeRange: TimeRange): ChartData[] => {
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
      // For 1D, use full ISO string to include time
      data.push({
        time: date.toISOString(),
        price: Number(basePrice.toFixed(2)),
        volume: Math.floor(Math.random() * 5000000) + 1000000,
      });
    } else {
      date.setDate(date.getDate() - i);
      // For other ranges, use date only
      data.push({
        time: date.toISOString().split('T')[0],
        price: Number(basePrice.toFixed(2)),
        volume: Math.floor(Math.random() * 5000000) + 1000000,
      });
    }
    
    basePrice += (Math.random() - 0.5) * (timeRange === '1Y' ? 20 : 10);
  }
  
  return data;
};

export const useStockDetail = (symbol: string, timeRange: TimeRange) => {
  const [stock, setStock] = useState<Stock | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStockDetail = async () => {
      if (!symbol) return;
      
      setLoading(true);
      try {
        let stockDetail: Stock;
        let historicalChartData: ChartData[] = [];
        
        try {
          // Try to fetch real data from MarketStack API
          const apiData = await marketStackAPI.getStockData([symbol]);
          
          if (apiData.length > 0) {
            const apiStock = apiData[0];
            const currentPrice = apiStock.close || 100;
            const openPrice = apiStock.open || currentPrice;
            const change = currentPrice - openPrice;
            const changePercent = openPrice > 0 ? ((change / openPrice) * 100) : 0;
            const randomValues = generateRandomValues(currentPrice);
            
            stockDetail = {
              symbol: apiStock.symbol,
              name: apiStock.name || stockNames[apiStock.symbol] || `${apiStock.symbol} Corporation`,
              price: currentPrice,
              change: change,
              changePercent: changePercent,
              volume: apiStock.volume || randomValues.volume,
              marketCap: randomValues.marketCap,
              high: apiStock.high || randomValues.high,
              low: apiStock.low || randomValues.low,
              open: apiStock.open || randomValues.open,
              previousClose: openPrice,
              country: 'United States',
              sector: sectors[apiStock.symbol] || 'Technology',
              description: descriptions[apiStock.symbol] || `${apiStock.name || stockNames[apiStock.symbol] || apiStock.symbol} is a leading company in its sector with a strong market presence and innovative products and services.`,
            };

            // Fetch historical data for the selected time range
            try {
              if (timeRange === '1D') {
                // For 1D, since intraday data requires premium plan, use recent daily data
                // Get the last 7 days of daily data to create a more realistic 1D view
                const { dateFrom, dateTo } = marketStackAPI.getDateRange('1M'); // Get 1 month of data
                const historicalData = await marketStackAPI.getHistoricalData(symbol, dateFrom, dateTo);
                
                if (historicalData && historicalData.length > 0) {
                  // Take the most recent 7 days and create a realistic 1D visualization
                  const recentData = historicalData.slice(-7);
                  historicalChartData = createRealistic1DData(recentData, symbol);
                } else {
                  console.warn('No historical data received for 1D, using fallback');
                  historicalChartData = generateDetailedChartData(timeRange);
                }
              } else {
                // Use daily data for longer time ranges
                const { dateFrom, dateTo } = marketStackAPI.getDateRange(timeRange);
                const historicalData = await marketStackAPI.getHistoricalData(symbol, dateFrom, dateTo);
                historicalChartData = convertToChartData(historicalData, timeRange);
              }
            } catch (historicalError) {
              console.warn('Failed to fetch historical data, using fallback:', historicalError);
              historicalChartData = generateDetailedChartData(timeRange);
            }
          } else {
            throw new Error('Stock not found in API response');
          }
        } catch (apiError) {
          console.warn('Failed to fetch from MarketStack API, using fallback data:', apiError);
          
          // Fallback to mock data if API fails
          const basePrice = Math.random() * 500 + 50;
          const randomValues = generateRandomValues(basePrice);
          
          stockDetail = {
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
            sector: sectors[symbol] || 'Technology',
            description: descriptions[symbol] || `${stockNames[symbol] || symbol} is a leading company in its sector with a strong market presence and innovative products and services.`,
          };
          
          historicalChartData = generateDetailedChartData(timeRange);
        }
        
        setStock(stockDetail);
        setChartData(historicalChartData);
        setError(null);
      } catch (err) {
        setError('Failed to fetch stock details');
      } finally {
        setLoading(false);
      }
    };

    fetchStockDetail();
  }, [symbol, timeRange]);

  return { stock, chartData, loading, error };
};