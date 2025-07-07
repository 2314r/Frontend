import React from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { ChartData, TimeRange } from '../types/stock';
import { useCurrencyConversion } from '../hooks/useCurrencyConversion';

interface StockChartProps {
  data: ChartData[];
  symbol?: string;
  timeRange?: TimeRange;
}

export const StockChart: React.FC<StockChartProps> = ({ data, symbol = 'Market', timeRange = '1M' }) => {
  const { formatPriceWithSymbol } = useCurrencyConversion();
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    if (timeRange === '1D') {
      // For 1D, show time (hour)
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        hour12: true 
      });
    } else {
      // For other ranges, show date
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const formatPrice = (value: number) => formatPriceWithSymbol(value);

  const getTimeRangeLabel = (range: TimeRange): string => {
    switch (range) {
      case '1D':
        return 'Last 24 hours';
      case '1M':
        return 'Last 30 days';
      case '3M':
        return 'Last 3 months';
      case '1Y':
        return 'Last year';
      default:
        return 'Last 30 days';
    }
  };

  const isPositiveTrend = data.length > 1 && data[data.length - 1].price > data[0].price;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{symbol} Price Chart</h3>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span>{getTimeRangeLabel(timeRange)}</span>
        </div>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop 
                  offset="5%" 
                  stopColor={isPositiveTrend ? "#22c55e" : "#ef4444"} 
                  stopOpacity={0.3}
                />
                <stop 
                  offset="95%" 
                  stopColor={isPositiveTrend ? "#22c55e" : "#ef4444"} 
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis 
              dataKey="time" 
              tickFormatter={formatDate}
              stroke="#64748b"
              fontSize={12}
            />
            <YAxis 
              tickFormatter={formatPrice}
              stroke="#64748b"
              fontSize={12}
            />
            <Tooltip 
              formatter={(value: any) => [formatPrice(value), 'Price']}
              labelFormatter={(label) => {
                const date = new Date(label);
                if (timeRange === '1D') {
                  return `Time: ${date.toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    minute: '2-digit',
                    hour12: true 
                  })}`;
                } else {
                  return `Date: ${date.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric'
                  })}`;
                }
              }}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke={isPositiveTrend ? "#22c55e" : "#ef4444"}
              strokeWidth={2}
              fill="url(#colorPrice)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};