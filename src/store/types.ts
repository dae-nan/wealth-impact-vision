
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

export interface ScenarioImpact {
  assetClass: AssetClass;
  percentageChange: number;
}

export interface Scenario {
  id: string;
  name: string;
  description: string;
  impacts: ScenarioImpact[];
  duration: string;
}

export interface PortfolioImpact {
  originalValue: number;
  impactedValue: number;
  absoluteChange: number;
  percentageChange: number;
  assetClassImpacts: Record<string, { 
    originalValue: number; 
    impactedValue: number; 
    absoluteChange: number; 
    percentageChange: number; 
  }>;
  assetImpacts: {
    id: string;
    name: string;
    originalValue: number;
    impactedValue: number;
    absoluteChange: number;
    percentageChange: number;
    assetClass: AssetClass;
    industry: Industry;
  }[];
  vulnerabilityScore: number;
}

export interface PortfolioState {
  holdingsData: HoldingsData | null;
  scenarios: Scenario[];
  selectedScenarioId: string | null;
  portfolioImpact: PortfolioImpact | null;
  isLoading: boolean;
  error: string | null;
  setHoldingsData: (data: HoldingsData) => void;
  clearHoldingsData: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  selectScenario: (scenarioId: string | null) => void;
  calculateImpact: () => void;
  calculateImpactForScenario: (scenarioId: string) => PortfolioImpact | null;
}
