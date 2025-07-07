import React from 'react';
import { TrendingUp, Globe, Clock, Wifi } from 'lucide-react';

interface HeaderProps {
  country: string;
  city: string;
  marketStatus: 'open' | 'closed' | 'pre-market' | 'after-hours';
  lastUpdated: string;
}

export const Header: React.FC<HeaderProps> = ({ country, city, marketStatus, lastUpdated }) => {
  const getStatusColor = () => {
    switch (marketStatus) {
      case 'open': return 'text-success-500';
      case 'pre-market': return 'text-yellow-500';
      case 'after-hours': return 'text-orange-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusText = () => {
    switch (marketStatus) {
      case 'open': return 'Market Open';
      case 'pre-market': return 'Pre-Market';
      case 'after-hours': return 'After Hours';
      default: return 'Market Closed';
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-primary-600" />
              <h1 className="text-2xl font-bold text-gray-900">StockFlow</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Globe className="h-4 w-4" />
              <span>{city}, {country}</span>
            </div>
            
            <div className={`flex items-center space-x-2 text-sm font-medium ${getStatusColor()}`}>
              <Wifi className="h-4 w-4" />
              <span>{getStatusText()}</span>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Updated {new Date(lastUpdated).toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};