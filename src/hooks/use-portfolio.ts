"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { initialData, PortfolioData } from '@/lib/data';

interface PortfolioContextType {
  portfolioData: PortfolioData;
  updatePortfolioData: (data: PortfolioData) => void;
  loading: boolean;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider = ({ children }: { children: ReactNode }) => {
  const [portfolioData, setPortfolioData] = useState<PortfolioData>(initialData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const savedData = localStorage.getItem('portfolioData');
      if (savedData) {
        setPortfolioData(JSON.parse(savedData));
      }
    } catch (error) {
      console.error("Failed to parse portfolio data from localStorage", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePortfolioData = (data: PortfolioData) => {
    setPortfolioData(data);
    try {
      localStorage.setItem('portfolioData', JSON.stringify(data));
    } catch (error) {
      console.error("Failed to save portfolio data to localStorage", error);
    }
  };

  const value = { portfolioData, updatePortfolioData, loading };

  return React.createElement(
    PortfolioContext.Provider,
    { value },
    !loading ? children : null
  );
};

export const usePortfolio = (): PortfolioContextType => {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
