export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  country?: string;
  sector?: string;
  description?: string;
}

export interface ChartData {
  time: string;
  price: number;
  volume: number;
}

export interface MarketData {
  stocks: Stock[];
  lastUpdated: string;
  marketStatus: 'open' | 'closed' | 'pre-market' | 'after-hours';
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  url: string;
  publishedAt: string;
  source: string;
  imageUrl?: string;
  relatedSymbols?: string[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  isPro: boolean;
  portfolio: PortfolioItem[];
}

export interface PortfolioItem {
  symbol: string;
  name: string;
  shares: number;
  purchasePrice: number;
  currentPrice: number;
  purchaseDate: string;
}

export type TimeRange = '1D' | '1M' | '3M' | '1Y';
export type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY';