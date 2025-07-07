import React from 'react';
import { TrendingUp, TrendingDown, Activity, DollarSign, BarChart3, Users } from 'lucide-react';
import { Stock } from '../types/stock';

interface MarketOverviewProps {
  stocks: Stock[];
}

export const MarketOverview: React.FC<MarketOverviewProps> = ({ stocks }) => {
  const totalMarketCap = stocks.reduce((sum, stock) => sum + (stock.marketCap || 0), 0);
  const totalVolume = stocks.reduce((sum, stock) => sum + stock.volume, 0);
  const gainers = stocks.filter(stock => stock.change > 0).length;
  const losers = stocks.filter(stock => stock.change < 0).length;
  const totalChange = stocks.reduce((sum, stock) => sum + stock.change, 0);
  const avgChangePercent = stocks.reduce((sum, stock) => sum + stock.changePercent, 0) / stocks.length;

  const formatNumber = (num: number) => {
    if (num >= 1e12) return `${(num / 1e12).toFixed(1)}T`;
    if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
    return num.toString();
  };

  const stats = [
    {
      label: 'Total Market Cap',
      value: `$${formatNumber(totalMarketCap)}`,
      icon: DollarSign,
      gradient: 'from-green-500 to-emerald-500',
      bg: 'bg-gradient-to-br from-green-50 to-emerald-50',
      border: 'border-green-200',
    },
    {
      label: 'Total Volume',
      value: formatNumber(totalVolume),
      icon: Activity,
      gradient: 'from-blue-500 to-cyan-500',
      bg: 'bg-gradient-to-br from-blue-50 to-cyan-50',
      border: 'border-blue-200',
    },
    {
      label: 'Gainers',
      value: gainers.toString(),
      icon: TrendingUp,
      gradient: 'from-emerald-500 to-green-500',
      bg: 'bg-gradient-to-br from-emerald-50 to-green-50',
      border: 'border-emerald-200',
    },
    {
      label: 'Losers',
      value: losers.toString(),
      icon: TrendingDown,
      gradient: 'from-red-500 to-rose-500',
      bg: 'bg-gradient-to-br from-red-50 to-rose-50',
      border: 'border-red-200',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div 
            key={stat.label}
            className={`${stat.bg} rounded-2xl border-2 ${stat.border} p-6 shadow-sm hover:shadow-xl transition-all duration-300 animate-fade-in card-hover`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.gradient}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
            </div>
            
            {/* Progress bar for visual appeal */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full bg-gradient-to-r ${stat.gradient}`}
                style={{ width: `${Math.min(100, (index + 1) * 25)}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Market Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm card-hover">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Market Sentiment</p>
              <p className="text-lg font-bold text-gray-900">
                {gainers > losers ? 'Bullish' : gainers < losers ? 'Bearish' : 'Neutral'}
              </p>
            </div>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-green-600 font-medium">+{gainers} Gainers</span>
            <span className="text-red-600 font-medium">-{losers} Losers</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm card-hover">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Change</p>
              <p className={`text-lg font-bold ${totalChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {totalChange >= 0 ? '+' : ''}${totalChange.toFixed(2)}
              </p>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Avg: {avgChangePercent >= 0 ? '+' : ''}{avgChangePercent.toFixed(2)}%
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm card-hover">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-lg">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Active Stocks</p>
              <p className="text-lg font-bold text-gray-900">{stocks.length}</p>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            {stocks.length} companies tracked
          </div>
        </div>
      </div>
    </div>
  );
};