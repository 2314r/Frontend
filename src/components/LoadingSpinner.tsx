import React from 'react';
import { TrendingUp, BarChart3, Activity } from 'lucide-react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="relative mb-8">
          {/* Main spinner */}
          <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
          
          {/* Inner spinner */}
          <div className="w-12 h-12 border-4 border-transparent border-t-blue-400 rounded-full animate-spin absolute top-4 left-4"></div>
          
          {/* Icons rotating around */}
          <div className="absolute inset-0 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-blue-500 animate-pulse" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-3 text-gradient">
          Loading Market Data
        </h2>
        <p className="text-gray-600 mb-6">Fetching real-time stock information...</p>
        
        {/* Progress indicators */}
        <div className="flex justify-center space-x-2 mb-6">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
        
        {/* Feature icons */}
        <div className="flex justify-center space-x-6 text-gray-400">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span className="text-sm">Charts</span>
          </div>
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4" />
            <span className="text-sm">Live Data</span>
          </div>
        </div>
      </div>
    </div>
  );
};