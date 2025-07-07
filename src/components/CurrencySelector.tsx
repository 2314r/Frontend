import React from 'react';
import { useAppContext } from '../context/AppContext';
import { useCurrencies } from '../hooks/useCurrencies';
import { DollarSign } from 'lucide-react';

export const CurrencySelector: React.FC = () => {
  const { currency, setCurrency } = useAppContext();
  const { currencies, loading } = useCurrencies();

  if (loading) {
    return (
      <div className="relative">
        <div className="flex items-center space-x-2">
          <DollarSign className="h-4 w-4 text-gray-500" />
          <div className="w-24 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="flex items-center space-x-2">
        <DollarSign className="h-4 w-4 text-gray-500" />
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          {currencies.map((curr) => (
            <option key={curr.code} value={curr.code}>
              {curr.symbol} {curr.code}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};