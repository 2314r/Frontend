import { useState, useEffect } from 'react';
import { marketStackAPI } from '../services/marketStackApi';

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  symbol_native: string;
}

// Mock exchange rates (in a real app, you'd fetch these from a currency API)
const EXCHANGE_RATES: { [key: string]: number } = {
  USD: 1,
  EUR: 0.85,
  JPY: 110.5,
  CAD: 1.25,
  AUD: 1.35,
  CHF: 0.92,
  CNY: 6.45,
  INR: 74.5,
  BRL: 5.2,
  MXN: 20.1,
  KRW: 1150,
  SGD: 1.35,
  HKD: 7.8,
  SEK: 8.5,
  NOK: 8.7,
  DKK: 6.3,
  PLN: 3.8,
  CZK: 21.5,
  RUB: 75,
  SOM: 87,
};

export const useCurrencies = () => {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        setLoading(true);
        const currencyData = await marketStackAPI.getCurrencies(5);
        setCurrencies(currencyData);
        setError(null);
      } catch (err) {
        console.warn('Failed to fetch currencies from API, using fallback data:', err);
        // Fallback to 5 major currencies if API fails
        const fallbackCurrencies: Currency[] = [
          { code: 'USD', name: 'US Dollar', symbol: '$', symbol_native: '$' },
          { code: 'EUR', name: 'Euro', symbol: '€', symbol_native: '€' },
          { code: 'GBP', name: 'British Pound', symbol: '£', symbol_native: '£' },
          { code: 'JPY', name: 'Japanese Yen', symbol: '¥', symbol_native: '¥' },
          { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', symbol_native: 'C$' },
        ];
        setCurrencies(fallbackCurrencies);
        setError('Failed to fetch currencies from API');
      } finally {
        setLoading(false);
      }
    };

    fetchCurrencies();
  }, []);

  const convertCurrency = (amount: number, fromCurrency: string, toCurrency: string): number => {
    if (fromCurrency === toCurrency) return amount;
    
    const fromRate = EXCHANGE_RATES[fromCurrency] || 1;
    const toRate = EXCHANGE_RATES[toCurrency] || 1;
    
    // Convert to USD first, then to target currency
    const usdAmount = amount / fromRate;
    return usdAmount * toRate;
  };

  const formatCurrency = (amount: number, currencyCode: string): string => {
    const currency = currencies.find(c => c.code === currencyCode);
    const symbol = currency?.symbol || currencyCode;
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return {
    currencies,
    loading,
    error,
    convertCurrency,
    formatCurrency,
  };
}; 