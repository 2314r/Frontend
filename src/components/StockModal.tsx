import React from 'react';
import { X, ExternalLink, TrendingUp, TrendingDown } from 'lucide-react';
import { Stock } from '../types/stock';

interface StockModalProps {
  stock: Stock | null;
  isOpen: boolean;
  onClose: () => void;
}

export const StockModal: React.FC<StockModalProps> = ({ stock, isOpen, onClose }) => {
  if (!isOpen || !stock) return null;

  const isPositive = stock.change >= 0;
  const changeColor = isPositive ? 'text-success-600' : 'text-danger-600';

  const openTradingView = () => {
    window.open(`https://www.tradingview.com/symbols/${stock.symbol}/`, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{stock.symbol}</h2>
            <p className="text-gray-600">{stock.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-4xl font-bold text-gray-900">
                ${stock.price.toFixed(2)}
              </div>
              <div className={`flex items-center space-x-2 mt-2 ${changeColor}`}>
                {isPositive ? (
                  <TrendingUp className="h-5 w-5" />
                ) : (
                  <TrendingDown className="h-5 w-5" />
                )}
                <span className="text-lg font-semibold">
                  {isPositive ? '+' : ''}${stock.change.toFixed(2)} ({isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Price Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Open</span>
                  <span className="font-medium">${stock.open.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Previous Close</span>
                  <span className="font-medium">${stock.previousClose.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Day High</span>
                  <span className="font-medium">${stock.high.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Day Low</span>
                  <span className="font-medium">${stock.low.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Market Data</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Volume</span>
                  <span className="font-medium">{stock.volume.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Market Cap</span>
                  <span className="font-medium">
                    ${stock.marketCap ? (stock.marketCap / 1e9).toFixed(1) + 'B' : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200">
            <button
              onClick={openTradingView}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <ExternalLink className="h-5 w-5" />
              <span>View Detailed Charts on TradingView</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};