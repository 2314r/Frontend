import { useState, useEffect } from 'react';
import { Stock } from '../types/stock';
import { marketStackAPI } from '../services/marketStackApi';

// Helper function to generate random values for fields not provided by the API
const generateRandomValues = (basePrice: number) => {
  const change = (Math.random() - 0.5) * 20;
  const changePercent = (change / basePrice) * 100;
  
  return {
    change: Number(change.toFixed(2)),
    changePercent: Number(changePercent.toFixed(2)),
    volume: Math.floor(Math.random() * 10000000) + 1000000,
    marketCap: Math.floor(Math.random() * 1000000000000) + 10000000000,
    high: Number((basePrice + Math.random() * 10).toFixed(2)),
    low: Number((basePrice - Math.random() * 10).toFixed(2)),
    open: Number((basePrice + (Math.random() - 0.5) * 5).toFixed(2)),
    previousClose: Number((basePrice - change).toFixed(2)),
  };
};

// Stock names mapping for better display
const stockNames: { [key: string]: string } = {
  'AAPL': 'Apple Inc.',
  'GOOGL': 'Alphabet Inc.',
  'MSFT': 'Microsoft Corporation',
  'AMZN': 'Amazon.com Inc.',
  'TSLA': 'Tesla Inc.',
  'META': 'Meta Platforms Inc.',
  'NVDA': 'NVIDIA Corporation',
  'NFLX': 'Netflix Inc.',
  'JNJ': 'Johnson & Johnson',
  'PFE': 'Pfizer Inc.',
  'JPM': 'JPMorgan Chase & Co.',
  'BAC': 'Bank of America Corp.',
  'XOM': 'Exxon Mobil Corporation',
  'CVX': 'Chevron Corporation',
  'WMT': 'Walmart Inc.',
  'PG': 'Procter & Gamble Co.',
  'DIS': 'Walt Disney Co.',
  'ADBE': 'Adobe Inc.',
  'CRM': 'Salesforce Inc.',
  'ORCL': 'Oracle Corporation',
  'INTC': 'Intel Corporation',
  'AMD': 'Advanced Micro Devices Inc.',
  'IBM': 'International Business Machines Corp.',
  'CSCO': 'Cisco Systems Inc.',
  'VZ': 'Verizon Communications Inc.',
  'T': 'AT&T Inc.',
  'KO': 'Coca-Cola Co.',
  'PEP': 'PepsiCo Inc.',
  'MCD': 'McDonald\'s Corporation',
  'SBUX': 'Starbucks Corporation',
  'NKE': 'Nike Inc.',
  'HD': 'Home Depot Inc.',
  'LOW': 'Lowe\'s Companies Inc.',
  'COST': 'Costco Wholesale Corporation',
  'TGT': 'Target Corporation',
  'COKE': 'Coca-Cola Consolidated Inc.',
  'F': 'Ford Motor Company',
  'GM': 'General Motors Company',
  'BA': 'Boeing Company',
  'CAT': 'Caterpillar Inc.',
  'DE': 'Deere & Company',
  'MMM': '3M Company',
  'HON': 'Honeywell International Inc.',
  'GE': 'General Electric Company',
  'UNH': 'UnitedHealth Group Incorporated',
  'ANTM': 'Anthem Inc.',
  'CI': 'Cigna Corporation',
  'AET': 'Aetna Inc.',
  'HUM': 'Humana Inc.',
  'ABT': 'Abbott Laboratories',
  'TMO': 'Thermo Fisher Scientific Inc.',
  'DHR': 'Danaher Corporation',
  'LLY': 'Eli Lilly and Company',
  'MRK': 'Merck & Co. Inc.',
  'ABBV': 'AbbVie Inc.',
  'BMY': 'Bristol-Myers Squibb Company',
  'GILD': 'Gilead Sciences Inc.',
  'AMGN': 'Amgen Inc.',
  'REGN': 'Regeneron Pharmaceuticals Inc.',
  'VRTX': 'Vertex Pharmaceuticals Incorporated',
  'BIIB': 'Biogen Inc.',
  'ALXN': 'Alexion Pharmaceuticals Inc.',
  'ILMN': 'Illumina Inc.',
  'ISRG': 'Intuitive Surgical Inc.',
  'DXCM': 'DexCom Inc.',
  'IDXX': 'IDEXX Laboratories Inc.',
  'ALGN': 'Align Technology Inc.',
  'WST': 'West Pharmaceutical Services Inc.',
  'MTD': 'Mettler-Toledo International Inc.',
  'WAT': 'Waters Corporation',
  'PKI': 'PerkinElmer Inc.',
  'BRK.A': 'Berkshire Hathaway Inc.',
  'BRK.B': 'Berkshire Hathaway Inc.',
  'V': 'Visa Inc.',
  'MA': 'Mastercard Incorporated',
  'AXP': 'American Express Company',
  'DFS': 'Discover Financial Services',
  'COF': 'Capital One Financial Corporation',
  'USB': 'U.S. Bancorp',
  'PNC': 'PNC Financial Services Group Inc.',
  'TFC': 'Truist Financial Corporation',
  'WFC': 'Wells Fargo & Company',
  'GS': 'Goldman Sachs Group Inc.',
  'MS': 'Morgan Stanley',
  'BLK': 'BlackRock Inc.',
  'SCHW': 'Charles Schwab Corporation',
  'CME': 'CME Group Inc.',
  'ICE': 'Intercontinental Exchange Inc.',
  'SPGI': 'S&P Global Inc.',
  'MCO': 'Moody\'s Corporation',
  'FIS': 'Fidelity National Information Services Inc.',
  'FISV': 'Fiserv Inc.',
  'GPN': 'Global Payments Inc.',
  'PAYX': 'Paychex Inc.',
  'ADP': 'Automatic Data Processing Inc.',
  'INTU': 'Intuit Inc.',
  'ADSK': 'Autodesk Inc.',
  'ANSS': 'ANSYS Inc.',
  'CDNS': 'Cadence Design Systems Inc.',
  'SNPS': 'Synopsys Inc.',
  'KLAC': 'KLA Corporation',
  'LRCX': 'Lam Research Corporation',
  'AMAT': 'Applied Materials Inc.',
  'ASML': 'ASML Holding N.V.',
  'TSM': 'Taiwan Semiconductor Manufacturing Company Limited',
  'QCOM': 'QUALCOMM Incorporated',
  'AVGO': 'Broadcom Inc.',
  'MU': 'Micron Technology Inc.',
  'TXN': 'Texas Instruments Incorporated',
  'ADI': 'Analog Devices Inc.',
  'MCHP': 'Microchip Technology Incorporated',
  'NXPI': 'NXP Semiconductors N.V.',
  'STM': 'STMicroelectronics N.V.',
  'ON': 'ON Semiconductor Corporation',
  'MPWR': 'Monolithic Power Systems Inc.',
  'POWI': 'Power Integrations Inc.',
  'CRUS': 'Cirrus Logic Inc.',
  'SWKS': 'Skyworks Solutions Inc.',
  'QRVO': 'Qorvo Inc.',
  'TER': 'Teradyne Inc.',
};

const sectors: { [key: string]: string } = {
  'AAPL': 'Technology',
  'GOOGL': 'Communication Services',
  'MSFT': 'Technology',
  'AMZN': 'Consumer Cyclical',
  'TSLA': 'Consumer Cyclical',
  'META': 'Communication Services',
  'NVDA': 'Technology',
  'NFLX': 'Communication Services',
  'JNJ': 'Healthcare',
  'PFE': 'Healthcare',
  'JPM': 'Financial Services',
  'BAC': 'Financial Services',
  'XOM': 'Energy',
  'CVX': 'Energy',
  'WMT': 'Consumer Defensive',
  'PG': 'Consumer Defensive',
  'DIS': 'Communication Services',
  'ADBE': 'Technology',
  'CRM': 'Technology',
  'ORCL': 'Technology',
  'INTC': 'Technology',
  'AMD': 'Technology',
  'IBM': 'Technology',
  'CSCO': 'Technology',
  'VZ': 'Communication Services',
  'T': 'Communication Services',
  'KO': 'Consumer Defensive',
  'PEP': 'Consumer Defensive',
  'MCD': 'Consumer Cyclical',
  'SBUX': 'Consumer Cyclical',
  'NKE': 'Consumer Cyclical',
  'HD': 'Consumer Cyclical',
  'LOW': 'Consumer Cyclical',
  'COST': 'Consumer Defensive',
  'TGT': 'Consumer Cyclical',
  'COKE': 'Consumer Defensive',
  'F': 'Consumer Cyclical',
  'GM': 'Consumer Cyclical',
  'BA': 'Industrials',
  'CAT': 'Industrials',
  'DE': 'Industrials',
  'MMM': 'Industrials',
  'HON': 'Industrials',
  'GE': 'Industrials',
  'UNH': 'Healthcare',
  'ANTM': 'Healthcare',
  'CI': 'Healthcare',
  'AET': 'Healthcare',
  'HUM': 'Healthcare',
  'ABT': 'Healthcare',
  'TMO': 'Healthcare',
  'DHR': 'Healthcare',
  'LLY': 'Healthcare',
  'MRK': 'Healthcare',
  'ABBV': 'Healthcare',
  'BMY': 'Healthcare',
  'GILD': 'Healthcare',
  'AMGN': 'Healthcare',
  'REGN': 'Healthcare',
  'VRTX': 'Healthcare',
  'BIIB': 'Healthcare',
  'ALXN': 'Healthcare',
  'ILMN': 'Healthcare',
  'ISRG': 'Healthcare',
  'DXCM': 'Healthcare',
  'IDXX': 'Healthcare',
  'ALGN': 'Healthcare',
  'WST': 'Healthcare',
  'MTD': 'Healthcare',
  'WAT': 'Healthcare',
  'PKI': 'Healthcare',
  'BRK.A': 'Financial Services',
  'BRK.B': 'Financial Services',
  'V': 'Financial Services',
  'MA': 'Financial Services',
  'AXP': 'Financial Services',
  'DFS': 'Financial Services',
  'COF': 'Financial Services',
  'USB': 'Financial Services',
  'PNC': 'Financial Services',
  'TFC': 'Financial Services',
  'WFC': 'Financial Services',
  'GS': 'Financial Services',
  'MS': 'Financial Services',
  'BLK': 'Financial Services',
  'SCHW': 'Financial Services',
  'CME': 'Financial Services',
  'ICE': 'Financial Services',
  'SPGI': 'Financial Services',
  'MCO': 'Financial Services',
  'FIS': 'Technology',
  'FISV': 'Technology',
  'GPN': 'Technology',
  'PAYX': 'Technology',
  'ADP': 'Technology',
  'INTU': 'Technology',
  'ADSK': 'Technology',
  'ANSS': 'Technology',
  'CDNS': 'Technology',
  'SNPS': 'Technology',
  'KLAC': 'Technology',
  'LRCX': 'Technology',
  'AMAT': 'Technology',
  'ASML': 'Technology',
  'TSM': 'Technology',
  'QCOM': 'Technology',
  'AVGO': 'Technology',
  'MU': 'Technology',
  'TXN': 'Technology',
  'ADI': 'Technology',
  'MCHP': 'Technology',
  'NXPI': 'Technology',
  'STM': 'Technology',
  'ON': 'Technology',
  'MPWR': 'Technology',
  'POWI': 'Technology',
  'CRUS': 'Technology',
  'SWKS': 'Technology',
  'QRVO': 'Technology',
  'TER': 'Technology',
};

// Predefined list of searchable stocks
const SEARCHABLE_STOCKS = [
  'AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'META', 'NVDA', 'NFLX',
  'JNJ', 'PFE', 'JPM', 'BAC', 'XOM', 'CVX', 'WMT', 'PG', 'DIS',
  'ADBE', 'CRM', 'ORCL', 'INTC', 'AMD', 'IBM', 'CSCO', 'VZ', 'T',
  'KO', 'PEP', 'MCD', 'SBUX', 'NKE', 'HD', 'LOW', 'COST', 'TGT',
  'F', 'GM', 'BA', 'CAT', 'DE', 'MMM', 'HON', 'GE', 'UNH', 'ABT',
  'TMO', 'DHR', 'LLY', 'MRK', 'ABBV', 'BMY', 'GILD', 'AMGN', 'REGN',
  'VRTX', 'BIIB', 'ILMN', 'ISRG', 'DXCM', 'IDXX', 'ALGN', 'WST',
  'V', 'MA', 'AXP', 'DFS', 'COF', 'USB', 'PNC', 'TFC', 'WFC', 'GS',
  'MS', 'BLK', 'SCHW', 'CME', 'ICE', 'SPGI', 'MCO', 'FIS', 'FISV',
  'GPN', 'PAYX', 'ADP', 'INTU', 'ADSK', 'ANSS', 'CDNS', 'SNPS',
  'KLAC', 'LRCX', 'AMAT', 'ASML', 'TSM', 'QCOM', 'AVGO', 'MU',
  'TXN', 'ADI', 'MCHP', 'NXPI', 'STM', 'ON', 'MPWR', 'POWI',
  'CRUS', 'SWKS', 'QRVO', 'TER'
];

const generateSearchResults = (query: string, country: string, sector: string): Stock[] => {
  let filteredStocks = SEARCHABLE_STOCKS;

  // Filter by search query
  if (query.trim()) {
    const searchTerm = query.toLowerCase();
    filteredStocks = filteredStocks.filter(stock =>
      stock.toLowerCase().includes(searchTerm) ||
      (stockNames[stock] && stockNames[stock].toLowerCase().includes(searchTerm))
    );
  }

  // Filter by sector
  if (sector && sector !== 'All Sectors') {
    filteredStocks = filteredStocks.filter(stock => sectors[stock] === sector);
  }

  // Limit results to top 20 matches
  filteredStocks = filteredStocks.slice(0, 20);

  // Generate full stock data
  return filteredStocks.map(stock => {
    const basePrice = Math.random() * 500 + 50;
    const randomValues = generateRandomValues(basePrice);

    return {
      symbol: stock,
      name: stockNames[stock] || `${stock} Corporation`,
      price: Number(basePrice.toFixed(2)),
      change: randomValues.change,
      changePercent: randomValues.changePercent,
      volume: randomValues.volume,
      marketCap: randomValues.marketCap,
      high: randomValues.high,
      low: randomValues.low,
      open: randomValues.open,
      previousClose: randomValues.previousClose,
      country,
      sector: sectors[stock] || 'Technology',
    };
  });
};

export const useStockSearch = (query: string, country: string, sector: string) => {
  const [results, setResults] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const searchStocks = async () => {
      if (!query.trim() && !sector) {
        setResults([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        let searchResults: Stock[] = [];
        
        // If we have a specific query, try to fetch real data for matching stocks
        if (query.trim()) {
          const searchTerm = query.toLowerCase();
          const matchingStocks = SEARCHABLE_STOCKS.filter(stock =>
            stock.toLowerCase().includes(searchTerm) ||
            (stockNames[stock] && stockNames[stock].toLowerCase().includes(searchTerm))
          ).slice(0, 10); // Limit to 10 for API calls

          if (matchingStocks.length > 0) {
            try {
              const apiData = await marketStackAPI.getStockData(matchingStocks);
              
              searchResults = apiData.map(apiStock => {
                const currentPrice = apiStock.close || 100;
                const openPrice = apiStock.open || currentPrice;
                const change = currentPrice - openPrice;
                const changePercent = openPrice > 0 ? ((change / openPrice) * 100) : 0;
                const randomValues = generateRandomValues(currentPrice);
                
                return {
                  symbol: apiStock.symbol,
                  name: apiStock.name || stockNames[apiStock.symbol] || `${apiStock.symbol} Corporation`,
                  price: currentPrice,
                  change: change,
                  changePercent: changePercent,
                  volume: apiStock.volume || randomValues.volume,
                  marketCap: randomValues.marketCap,
                  high: apiStock.high || randomValues.high,
                  low: apiStock.low || randomValues.low,
                  open: apiStock.open || randomValues.open,
                  previousClose: openPrice,
                  country,
                  sector: sectors[apiStock.symbol] || 'Technology',
                };
              });
            } catch (apiError) {
              console.warn('Failed to fetch from MarketStack API, using fallback data:', apiError);
              searchResults = generateSearchResults(query, country, sector);
            }
          } else {
            searchResults = generateSearchResults(query, country, sector);
          }
        } else {
          // If only sector filter is applied, use fallback data
          searchResults = generateSearchResults(query, country, sector);
        }

        // Apply sector filter if specified
        if (sector && sector !== 'All Sectors') {
          searchResults = searchResults.filter(stock => stock.sector === sector);
        }

        setResults(searchResults);
      } catch (err) {
        setError('Failed to search stocks');
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchStocks, 300);
    return () => clearTimeout(debounceTimer);
  }, [query, country, sector]);

  return { results, loading, error };
};