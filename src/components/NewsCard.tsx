import React from 'react';
import { NewsItem } from '../types/stock';
import { ExternalLink, Calendar, User } from 'lucide-react';

interface NewsCardProps {
  news: NewsItem;
  style?: React.CSSProperties;
}

export const NewsCard: React.FC<NewsCardProps> = ({ news, style }) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <article 
      className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in"
      style={style}
    >
      <div className="flex flex-col lg:flex-row lg:space-x-6">
        {news.imageUrl && (
          <div className="lg:w-48 lg:flex-shrink-0 mb-4 lg:mb-0">
            <img
              src={news.imageUrl}
              alt={news.title}
              className="w-full h-48 lg:h-32 object-cover rounded-lg"
            />
          </div>
        )}
        
        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <h2 className="text-xl font-bold text-gray-900 leading-tight hover:text-primary-600 transition-colors">
              <a href={news.url} target="_blank" rel="noopener noreferrer">
                {news.title}
              </a>
            </h2>
            <a
              href={news.url}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 p-1 text-gray-400 hover:text-primary-600 transition-colors flex-shrink-0"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
          
          <p className="text-gray-700 mb-4 leading-relaxed">
            {news.summary}
          </p>
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>{news.source}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(news.publishedAt)}</span>
              </div>
            </div>
            
            {news.relatedSymbols && news.relatedSymbols.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-400">Related:</span>
                <div className="flex space-x-1">
                  {news.relatedSymbols.slice(0, 3).map((symbol) => (
                    <span
                      key={symbol}
                      className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-full font-medium"
                    >
                      {symbol}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};