import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStockDetail } from '../hooks/useStockDetail';
import { useNewsData } from '../hooks/useNewsData';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { StockChart } from '../components/StockChart';
import { TimeRangeSelector } from '../components/TimeRangeSelector';
import { TimeRange } from '../types/stock';
import { useCurrencyConversion } from '../hooks/useCurrencyConversion';
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown, 
  ExternalLink, 
  Bookmark,
  Share2,
  BarChart3,
  DollarSign,
  Calendar,
  Globe
} from 'lucide-react';

export const StockDetailPage: React.FC = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const [timeRange, setTimeRange] = useState<TimeRange>('1D');
  const { stock, chartData, loading } = useStockDetail(symbol || '', timeRange);
  const { news } = useNewsData();
  const { formatPriceWithSymbol } = useCurrencyConversion();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!stock) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Stock Not Found</h2>
          <p className="text-gray-600 mb-4">The stock symbol "{symbol}" could not be found.</p>
          <Link 
            to="/"
            className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const isPositive = stock.change >= 0;
  const changeColor = isPositive ? 'text-success-600' : 'text-danger-600';
  const relatedNews = news.filter(article => 
    article.relatedSymbols?.includes(stock.symbol) || 
    article.title.toLowerCase().includes(stock.name.toLowerCase())
  ).slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/news"
            className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to News & Prices</span>
          </Link>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">{stock.symbol}</h1>
              <p className="text-xl text-gray-600 mt-1">{stock.name}</p>
              <div className="flex items-center space-x-4 mt-2">
                <span className="text-sm text-gray-500 flex items-center space-x-1">
                  <Globe className="h-4 w-4" />
                  <span>{stock.country || 'United States'}</span>
                </span>
                <span className="text-sm text-gray-500">{stock.sector || 'Technology'}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 mt-4 lg:mt-0">
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Bookmark className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Share2 className="h-5 w-5" />
              </button>
              <a
                href={`https://www.tradingview.com/symbols/${stock.symbol}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                <span>TradingView</span>
              </a>
            </div>
          </div>
        </div>

        {/* Price Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="text-5xl font-bold text-gray-900 mb-2">
                {formatPriceWithSymbol(stock.price)}
              </div>
              <div className={`flex items-center space-x-2 ${changeColor}`}>
                {isPositive ? (
                  <TrendingUp className="h-6 w-6" />
                ) : (
                  <TrendingDown className="h-6 w-6" />
                )}
                <span className="text-2xl font-semibold">
                  {isPositive ? '+' : ''}{formatPriceWithSymbol(stock.change)}
                </span>
                <span className="text-xl">
                  ({isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                </span>
              </div>
            </div>
            
            <div className="mt-4 lg:mt-0">
              <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chart and Key Stats */}
          <div className="lg:col-span-2 space-y-8">
            {/* Chart */}
            <StockChart data={chartData} symbol={stock.symbol} timeRange={timeRange} />
            
            {/* Key Information */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Key Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Open</span>
                    <span className="font-medium">{formatPriceWithSymbol(stock.open)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Previous Close</span>
                    <span className="font-medium">{formatPriceWithSymbol(stock.previousClose)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Day High</span>
                    <span className="font-medium">{formatPriceWithSymbol(stock.high)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Day Low</span>
                    <span className="font-medium">{formatPriceWithSymbol(stock.low)}</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Volume</span>
                    <span className="font-medium">{stock.volume.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Market Cap</span>
                    <span className="font-medium">
                      ${stock.marketCap ? (stock.marketCap / 1e9).toFixed(1) + 'B' : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Sector</span>
                    <span className="font-medium">{stock.sector || 'Technology'}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Country</span>
                    <span className="font-medium">{stock.country || 'United States'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Company Description */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">About {stock.name}</h3>
              <p className="text-gray-700 leading-relaxed">
                {stock.description || `${stock.name} is a leading company in the ${stock.sector || 'technology'} sector. The company has shown consistent performance in the market and continues to be a significant player in its industry. For more detailed information about the company's business model, financial performance, and future prospects, please refer to their official investor relations page or financial reports.`}
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Quick Stats */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary-50 rounded-lg">
                      <BarChart3 className="h-5 w-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Volume</p>
                      <p className="font-semibold">{(stock.volume / 1e6).toFixed(1)}M</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-success-50 rounded-lg">
                      <DollarSign className="h-5 w-5 text-success-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Market Cap</p>
                      <p className="font-semibold">
                        ${stock.marketCap ? (stock.marketCap / 1e9).toFixed(1) + 'B' : 'N/A'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-50 rounded-lg">
                      <Calendar className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Range (Day)</p>
                      <p className="font-semibold">{formatPriceWithSymbol(stock.low)} - {formatPriceWithSymbol(stock.high)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Related News */}
              {relatedNews.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Related News</h3>
                  <div className="space-y-4">
                    {relatedNews.map((article) => (
                      <div key={article.id} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                        <h4 className="font-medium text-gray-900 text-sm leading-tight mb-2">
                          {article.title}
                        </h4>
                        <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                          {article.summary}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">{article.source}</span>
                          <a
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary-600 hover:text-primary-700 flex items-center space-x-1"
                          >
                            <span>Read more</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};