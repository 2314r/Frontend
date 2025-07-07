import { Link } from 'react-router-dom';
import { useStockData } from '../hooks/useStockData';
import { useNewsData } from '../hooks/useNewsData';
import { useAppContext } from '../context/AppContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { NewsCard } from '../components/NewsCard';

import { TrendingUp, Newspaper, ExternalLink } from 'lucide-react';

export const NewsPage: React.FC = () => {
  const { selectedCountry } = useAppContext();
  const { marketData, loading: stockLoading } = useStockData(selectedCountry);
  const { news, loading: newsLoading } = useNewsData();

  if (stockLoading || newsLoading) {
    return <LoadingSpinner />;
  }

  const featuredStocks = marketData?.stocks.slice(0, 6) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Market News & Prices</h1>
              <p className="text-gray-600 mt-2">Stay updated with the latest market trends and stock prices</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* News Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <Newspaper className="h-6 w-6 text-primary-600" />
              <h2 className="text-2xl font-bold text-gray-900">Latest Market News</h2>
            </div>
            
            <div className="space-y-6">
              {news.map((article, index) => (
                <NewsCard 
                  key={article.id} 
                  news={article}
                  style={{ animationDelay: `${index * 0.1}s` }}
                />
              ))}
            </div>
          </div>

          {/* Stock Prices Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="flex items-center space-x-2 mb-6">
                <TrendingUp className="h-6 w-6 text-primary-600" />
                <h2 className="text-xl font-bold text-gray-900">Featured Stocks</h2>
              </div>
              
              <div className="space-y-4">
                {featuredStocks.map((stock, index) => (
                  <Link 
                    key={stock.symbol}
                    to={`/stock/${stock.symbol}`}
                    className="block transform hover:scale-105 transition-transform duration-200"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-bold text-gray-900">{stock.symbol}</h3>
                          <p className="text-sm text-gray-600 truncate">{stock.name}</p>
                        </div>
                        <ExternalLink className="h-4 w-4 text-gray-400" />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-gray-900">
                          ${stock.price.toFixed(2)}
                        </span>
                        <div className={`text-sm font-medium ${
                          stock.change >= 0 ? 'text-success-600' : 'text-danger-600'
                        }`}>
                          {stock.change >= 0 ? '+' : ''}${stock.change.toFixed(2)}
                          <span className="ml-1">
                            ({stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Market Summary */}
              <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Summary</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Market Status</span>
                    <span className={`font-medium ${
                      marketData?.marketStatus === 'open' ? 'text-success-600' : 'text-gray-600'
                    }`}>
                      {marketData?.marketStatus === 'open' ? 'Open' : 'Closed'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Gainers</span>
                    <span className="font-medium text-success-600">
                      {marketData?.stocks.filter(s => s.change > 0).length || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Losers</span>
                    <span className="font-medium text-danger-600">
                      {marketData?.stocks.filter(s => s.change < 0).length || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Last Updated</span>
                    <span className="font-medium text-sm">
                      {marketData ? new Date(marketData.lastUpdated).toLocaleTimeString() : '--:--'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};