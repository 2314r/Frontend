import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Globe } from 'lucide-react';

export const CountrySelector: React.FC = () => {
  const { selectedCountry, setSelectedCountry } = useAppContext();

  const countries = [
    'United States',
    'United Kingdom',
    'Germany',
    'France',
    'Japan',
    'Canada',
    'Australia',
    'India',
    'China',
    'Brazil',
  ];

  return (
    <div className="relative">
      <div className="flex items-center space-x-2">
        <Globe className="h-4 w-4 text-gray-500" />
        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};