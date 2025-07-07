import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types/stock';

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  currency: string;
  setCurrency: (currency: string) => void;
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [currency, setCurrency] = useState<string>('USD');
  const [selectedCountry, setSelectedCountry] = useState<string>('United States');

  return (
    <AppContext.Provider value={{
      user,
      setUser,
      currency,
      setCurrency,
      selectedCountry,
      setSelectedCountry,
    }}>
      {children}
    </AppContext.Provider>
  );
};