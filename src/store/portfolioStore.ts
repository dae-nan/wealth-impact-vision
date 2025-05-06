
import { create } from 'zustand';

export type AssetClass = 
  | 'Stocks' 
  | 'Bonds' 
  | 'Real Estate' 
  | 'Cash' 
  | 'Private Equity' 
  | 'Commodities' 
  | 'Cryptocurrency'
  | 'Other';

export type Industry = 
  | 'Technology' 
  | 'Finance' 
  | 'Healthcare' 
  | 'Energy' 
  | 'Consumer Goods' 
  | 'Industrials'
  | 'Utilities'
  | 'Materials'
  | 'Telecommunications'
  | 'Other';

export type Region = 
  | 'North America' 
  | 'Europe' 
  | 'Asia Pacific' 
  | 'Latin America' 
  | 'Middle East & Africa'
  | 'Global';

export interface Asset {
  id: string;
  name: string;
  value: number;
  assetClass: AssetClass;
  industry: Industry;
  region: Region;
  ticker?: string;
  currency: string;
}

export interface HoldingsData {
  individualName: string;
  totalValue: number;
  assets: Asset[];
  lastUpdated: Date;
}

interface PortfolioState {
  holdingsData: HoldingsData | null;
  isLoading: boolean;
  error: string | null;
  setHoldingsData: (data: HoldingsData) => void;
  clearHoldingsData: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const usePortfolioStore = create<PortfolioState>((set) => ({
  holdingsData: null,
  isLoading: false,
  error: null,
  setHoldingsData: (data) => set({ holdingsData: data, error: null }),
  clearHoldingsData: () => set({ holdingsData: null }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error, isLoading: false }),
}));
