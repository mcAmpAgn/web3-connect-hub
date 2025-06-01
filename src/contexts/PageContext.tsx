"use client";
import { createContext, useContext, ReactNode, useState, useEffect } from "react";

// SOL Price API URL
const SOL_PRICE_API = "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd";

interface PageContextType {
  solPrice: number;
  isLoading: boolean;
  error: string | null;
  refreshPrice: () => void;
}

export const PageContext = createContext<PageContextType | undefined>(
  undefined
);

export function useData() {
  const context = useContext(PageContext);
  if (!context) {
    throw new Error("useData must be used within a PageProvider");
  }
  return context;
}

interface PageProviderProps {
  children: ReactNode;
}

export function PageProvider({ children }: PageProviderProps) {
  const [solPrice, setSolPrice] = useState<number>(57.5); // Default fallback price
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSolPrice = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(SOL_PRICE_API);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const price = data?.solana?.usd;
      
      if (price && typeof price === 'number') {
        setSolPrice(price);
      } else {
        throw new Error('Invalid price data received');
      }
    } catch (err) {
      console.warn('Failed to fetch SOL price, using fallback:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      // Keep default price of 57.5 as fallback
    } finally {
      setIsLoading(false);
    }
  };

  const refreshPrice = () => {
    fetchSolPrice();
  };

  useEffect(() => {
    // Initial fetch
    fetchSolPrice();

    // Refresh price every 5 minutes
    const interval = setInterval(fetchSolPrice, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const pageContextValue: PageContextType = {
    solPrice,
    isLoading,
    error,
    refreshPrice,
  };

  return (
    <PageContext.Provider value={pageContextValue}>
      {children}
    </PageContext.Provider>
  );
}