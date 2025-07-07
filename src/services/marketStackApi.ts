const API_KEY = import.meta.env.VITE_MARKETSTACK_API_KEY || "1d0f1ba08c5ce7d9dd81fb9bb5fab52d";
const BASE_URL = 'https://api.marketstack.com/v2';

interface MarketStackStockData {
  symbol: string;
  name: string;
  close: number;
  adj_close: number;
  high: number;
  adj_high: number;
  low: number;
  adj_low: number;
  open: number;
  adj_open: number;
  volume: number;
  adj_volume: number;
  exchange: string;
  exchange_code: string;
  date: string;
  asset_type: string;
  price_currency: string;
  dividend: number;
  split_factor: number;
}

interface MarketStackIntradayData {
  date: string;
  close: number;
  high: number;
  low: number;
  open: number;
  volume: number;
}

interface MarketStackCurrency {
  code: string;
  name: string;
  symbol: string;
  symbol_native: string;
}

interface MarketStackResponse<T> {
  data: T;
  pagination?: {
    limit: number;
    offset: number;
    count: number;
    total: number;
  };
}

class MarketStackAPI {
  private apiKey: string;

  constructor() {
    this.apiKey = API_KEY || '';
    if (!this.apiKey) {
      console.warn('MarketStack API key not found. Please add VITE_MARKETSTACK_API_KEY to your environment variables.');
    }
  }

  private async makeRequest<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    if (!this.apiKey) {
      throw new Error('API key is required for MarketStack API');
    }

    const url = new URL(`${BASE_URL}${endpoint}`);
    url.searchParams.append('access_key', this.apiKey);
    
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    try {
      const response = await fetch(url.toString());
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Invalid API key. Please check your MarketStack API key.');
        } else if (response.status === 429) {
          throw new Error('API rate limit exceeded. Please try again later.');
        } else if (response.status === 403) {
          throw new Error('Access forbidden. This endpoint may require a premium subscription.');
        } else {
          throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message || 'API error occurred');
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  async getStockData(symbols: string[]): Promise<MarketStackStockData[]> {
    if (symbols.length === 0) return [];
    
    const symbolsParam = symbols.join(',');
    const response = await this.makeRequest<MarketStackResponse<MarketStackStockData[]>>('/eod/latest', {
      symbols: symbolsParam
    });
    
    return Array.isArray(response.data) ? response.data : [response.data];
  }

  async getIntradayData(symbol: string, interval: string = '1hour', limit: number = 24): Promise<MarketStackIntradayData[]> {
    const response = await this.makeRequest<MarketStackResponse<MarketStackIntradayData[]>>('/intraday/latest', {
      symbols: symbol,
      interval,
      limit: limit.toString()
    });
    
    return Array.isArray(response.data) ? response.data : [response.data];
  }

  async getHistoricalIntradayData(symbol: string, dateFrom: string, dateTo: string, interval: string = '1hour'): Promise<MarketStackIntradayData[]> {
    const response = await this.makeRequest<MarketStackResponse<MarketStackIntradayData[]>>('/intraday', {
      symbols: symbol,
      date_from: dateFrom,
      date_to: dateTo,
      interval
    });
    
    return Array.isArray(response.data) ? response.data : [response.data];
  }

  async getHistoricalData(symbol: string, dateFrom: string, dateTo: string): Promise<MarketStackIntradayData[]> {
    const response = await this.makeRequest<MarketStackResponse<MarketStackIntradayData[]>>('/eod', {
      symbols: symbol,
      date_from: dateFrom,
      date_to: dateTo
    });
    
    return Array.isArray(response.data) ? response.data : [response.data];
  }

  async getCurrencies(limit: number = 100): Promise<MarketStackCurrency[]> {
    const response = await this.makeRequest<MarketStackResponse<MarketStackCurrency[]>>('/currencies', {
      limit: limit.toString()
    });
    
    return Array.isArray(response.data) ? response.data : [response.data];
  }

  // Helper method to get date range for different time periods
  getDateRange(timeRange: string): { dateFrom: string; dateTo: string } {
    const now = new Date();
    const dateTo = now.toISOString().split('T')[0];
    let dateFrom: string;

    switch (timeRange) {
      case '1D':
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        dateFrom = yesterday.toISOString().split('T')[0];
        break;
      case '1M':
        const oneMonthAgo = new Date(now);
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        dateFrom = oneMonthAgo.toISOString().split('T')[0];
        break;
      case '3M':
        const threeMonthsAgo = new Date(now);
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        dateFrom = threeMonthsAgo.toISOString().split('T')[0];
        break;
      case '1Y':
        const oneYearAgo = new Date(now);
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        dateFrom = oneYearAgo.toISOString().split('T')[0];
        break;
      default:
        const defaultDate = new Date(now);
        defaultDate.setMonth(defaultDate.getMonth() - 1);
        dateFrom = defaultDate.toISOString().split('T')[0];
    }

    return { dateFrom, dateTo };
  }
}

export const marketStackAPI = new MarketStackAPI(); 