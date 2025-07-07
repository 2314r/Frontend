import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { PortfolioItem, TimeRange } from '../types/stock';
import { AddStockModal } from '../components/AddStockModal';
import { TimeRangeSelector } from '../components/TimeRangeSelector';
import { StockChart } from '../components/StockChart';
import { 
  Briefcase, 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  BarChart3,
  Calendar,
  Trash2,
  Edit3
} from 'lucide-react';

export const PortfolioPage: React.FC = () => {
  const { user, setUser } = useAppContext();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [timeRange, setTimeRange] = useState<TimeRange>('1M');

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign In Required</h2>
          <p className="text-gray-600 mb-4">Please sign in to view and manage your portfolio.</p>
          <a
            href="/auth"
            className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  const handleAddStock = (stock: PortfolioItem) => {
    const updatedUser = {
      ...user,
      portfolio: [...user.portfolio, stock],
    };
    setUser(updatedUser);
    setIsAddModalOpen(false);
  };

  const handleRemoveStock = (symbol: string) => {
    const updatedUser = {
      ...user,
      portfolio: user.portfolio.filter(item => item.symbol !== symbol),
    };
    setUser(updatedUser);
  };

  const calculatePortfolioValue = () => {
    return user.portfolio.reduce((total, item) => {
      return total + (item.currentPrice * item.shares);
    }, 0);
  };

  const calculateTotalGainLoss = () => {
    return user.portfolio.reduce((total, item) => {
      const gainLoss = (item.currentPrice - item.purchasePrice) * item.shares;
      return total + gainLoss;
    }, 0);
  };

  // Generate portfolio performance chart data
  const generatePortfolioChartData = (): any[] => {
    const data: any[] = [];
    let baseValue = calculatePortfolioValue();
    let dataPoints: number;
    
    switch (timeRange) {
      case '1D':
        dataPoints = 24; // Hourly data for 1 day
        break;
      case '1M':
        dataPoints = 30; // Daily data for 1 month
        break;
      case '3M':
        dataPoints = 90; // Daily data for 3 months
        break;
      case '1Y':
        dataPoints = 365; // Daily data for 1 year
        break;
      default:
        dataPoints = 30;
    }
    
    for (let i = dataPoints; i >= 0; i--) {
      const date = new Date();
      
      if (timeRange === '1D') {
        date.setHours(date.getHours() - i);
      } else {
        date.setDate(date.getDate() - i);
      }
      
      // Simulate portfolio value changes based on market volatility
      const volatility = timeRange === '1Y' ? 0.05 : 0.02;
      baseValue += (Math.random() - 0.5) * baseValue * volatility;
      
      data.push({
        time: date.toISOString().split('T')[0],
        price: Number(baseValue.toFixed(2)),
        volume: Math.floor(Math.random() * 1000000) + 100000,
      });
    }
    
    return data;
  };

  const portfolioValue = calculatePortfolioValue();
  const totalGainLoss = calculateTotalGainLoss();
  const totalGainLossPercent = portfolioValue > 0 ? (totalGainLoss / (portfolioValue - totalGainLoss)) * 100 : 0;
  const portfolioChartData = generatePortfolioChartData();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Portfolio</h1>
            <p className="text-gray-600 mt-2">Track your investments and performance</p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add Stock</span>
          </button>
        </div>

        {/* Portfolio Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  ${portfolioValue.toFixed(2)}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-primary-50">
                <DollarSign className="h-6 w-6 text-primary-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Gain/Loss</p>
                <p className={`text-2xl font-bold mt-1 ${
                  totalGainLoss >= 0 ? 'text-success-600' : 'text-danger-600'
                }`}>
                  {totalGainLoss >= 0 ? '+' : ''}${totalGainLoss.toFixed(2)}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${
                totalGainLoss >= 0 ? 'bg-success-50' : 'bg-danger-50'
              }`}>
                {totalGainLoss >= 0 ? (
                  <TrendingUp className={`h-6 w-6 text-success-600`} />
                ) : (
                  <TrendingDown className={`h-6 w-6 text-danger-600`} />
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Holdings</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {user.portfolio.length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-purple-50">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Portfolio Performance Chart */}
        {user.portfolio.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Portfolio Performance</h2>
              <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
            </div>
            <StockChart 
              data={portfolioChartData} 
              symbol="Portfolio Value" 
              timeRange={timeRange} 
            />
          </div>
        )}

        {/* Portfolio Holdings */}
        {user.portfolio.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
            <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Your portfolio is empty</h3>
            <p className="text-gray-600 mb-6">Start building your portfolio by adding your first stock.</p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center space-x-2 mx-auto"
            >
              <Plus className="h-5 w-5" />
              <span>Add Your First Stock</span>
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Holdings</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Shares
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Purchase Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Current Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Gain/Loss
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {user.portfolio.map((item, index) => {
                    const totalValue = item.currentPrice * item.shares;
                    const gainLoss = (item.currentPrice - item.purchasePrice) * item.shares;
                    const gainLossPercent = ((item.currentPrice - item.purchasePrice) / item.purchasePrice) * 100;
                    
                    return (
                      <tr key={`${item.symbol}-${index}`} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{item.symbol}</div>
                            <div className="text-sm text-gray-500">{item.name}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.shares}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${item.purchasePrice.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${item.currentPrice.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          ${totalValue.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm font-medium ${
                            gainLoss >= 0 ? 'text-success-600' : 'text-danger-600'
                          }`}>
                            {gainLoss >= 0 ? '+' : ''}${gainLoss.toFixed(2)}
                            <div className="text-xs">
                              ({gainLoss >= 0 ? '+' : ''}{gainLossPercent.toFixed(2)}%)
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center space-x-2">
                            <button className="text-gray-400 hover:text-gray-600">
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleRemoveStock(item.symbol)}
                              className="text-gray-400 hover:text-danger-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <AddStockModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddStock}
      />
    </div>
  );
};