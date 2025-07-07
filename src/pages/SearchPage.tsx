import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useStockSearch } from '../hooks/useStockSearch';
import { StockCard } from '../components/StockCard';
import { CurrencySelector } from '../components/CurrencySelector';
import { Search, Filter, TrendingUp } from 'lucide-react';

export const SearchPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('');
  const { selectedCountry } = useAppContext();
  const { results, loading, error } = useStockSearch(searchQuery, selectedCountry, selectedSector);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by the useStockSearch hook automatically
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Stocks</h1>
          <p className="text-gray-600">Find stocks by company name, symbol, or browse by country and sector</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8 shadow-sm">
          <form onSubmit={handleSearch} className="space-y-6">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by company name or stock symbol (e.g., Apple, AAPL)"
                className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <TrendingUp className="inline h-4 w-4 mr-1" />
                  Currency
                </label>
                <CurrencySelector />
              </div>
            </div>
          </form>
        </div>

        {/* Search Results */}
        <div>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Searching stocks...</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-danger-50 border border-danger-200 rounded-lg p-6 text-center">
              <p className="text-danger-700">{error}</p>
            </div>
          ) : results.length === 0 && searchQuery ? (
            <div className="bg-gray-50 rounded-lg p-12 text-center">
              <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600">
                Try searching with different keywords or check the spelling of the company name or symbol.
              </p>
            </div>
          ) : results.length === 0 ? (
            <div className="bg-gradient-to-br from-primary-50 to-purple-50 rounded-lg p-12 text-center border border-primary-100">
              <Search className="h-16 w-16 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Start Your Search</h3>
              <p className="text-gray-600 mb-6">
                Enter a company name or stock symbol to find detailed information about stocks from around the world.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto text-sm text-gray-700">
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Search Results ({results.length} found)
                </h2>
                {searchQuery && (
                  <p className="text-gray-600">
                    Results for "{searchQuery}" in {selectedCountry}
                  </p>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {results.map((stock, index) => (
                  <div
                    key={stock.symbol}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <StockCard 
                      stock={stock} 
                      onClick={() => window.location.href = `/stock/${stock.symbol}`}
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};