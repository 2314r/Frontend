import { useAppContext } from '../context/AppContext';
import { convertCurrency, formatCurrency } from '../utils/performance';

export const useCurrencyConversion = () => {
  const { currency } = useAppContext();

  const convertPrice = (price: number, fromCurrency: string = 'USD'): number => {
    return convertCurrency(price, fromCurrency, currency);
  };

  const formatPrice = (price: number, fromCurrency: string = 'USD'): string => {
    const convertedPrice = convertPrice(price, fromCurrency);
    return formatCurrency(convertedPrice, currency);
  };

  const formatPriceWithSymbol = (price: number, fromCurrency: string = 'USD'): string => {
    const convertedPrice = convertPrice(price, fromCurrency);
    
    // Get currency symbol based on currency code
    const currencySymbols: { [key: string]: string } = {
      USD: '$',
      EUR: '€',
      JPY: '¥',
      CAD: 'C$',
      AUD: 'A$',
      CHF: 'CHF',
      CNY: '¥',
      INR: '₹',
      BRL: 'R$',
      MXN: 'MX$',
      KRW: '₩',
      SGD: 'S$',
      HKD: 'HK$',
      SEK: 'kr',
      NOK: 'kr',
      DKK: 'kr',
      PLN: 'zł',
      CZK: 'Kč',
      HUF: 'Ft',
      RUB: '₽',
      SOM: 'с',
    };

    const symbol = currencySymbols[currency] || currency;
    return `${symbol}${convertedPrice.toFixed(2)}`;
  };

  return {
    currency,
    convertPrice,
    formatPrice,
    formatPriceWithSymbol,
  };
}; 