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

interface PortfolioState {
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
}

// Predefined scenarios
const predefinedScenarios: Scenario[] = [
  {
    id: 'gfc-crisis',
    name: 'Global Financial Crisis',
    description: 'A severe worldwide economic crisis similar to the 2008 financial crisis. Characterized by sharp declines in most asset classes except safe havens.',
    impacts: [
      { assetClass: 'Stocks', percentageChange: -45 },
      { assetClass: 'Bonds', percentageChange: 5 },
      { assetClass: 'Real Estate', percentageChange: -30 },
      { assetClass: 'Cash', percentageChange: 0 },
      { assetClass: 'Private Equity', percentageChange: -35 },
      { assetClass: 'Commodities', percentageChange: -20 },
      { assetClass: 'Cryptocurrency', percentageChange: -60 },
      { assetClass: 'Other', percentageChange: -25 },
    ],
    duration: '18-24 months with 36-month recovery timeline',
  },
  {
    id: 'trump-put',
    name: 'Trump Put',
    description: 'Market scenario based on Trump administration policies favoring deregulation, tax cuts, and pro-business measures, particularly for domestic companies.',
    impacts: [
      { assetClass: 'Stocks', percentageChange: 15 },
      { assetClass: 'Bonds', percentageChange: -5 },
      { assetClass: 'Real Estate', percentageChange: 10 },
      { assetClass: 'Cash', percentageChange: -2 },
      { assetClass: 'Private Equity', percentageChange: 8 },
      { assetClass: 'Commodities', percentageChange: 12 },
      { assetClass: 'Cryptocurrency', percentageChange: -10 },
      { assetClass: 'Other', percentageChange: 5 },
    ],
    duration: '12-18 months',
  },
  {
    id: 'tech-bubble',
    name: 'Tech Bubble Burst',
    description: 'A scenario similar to the dot-com crash of 2000, with significant technology sector collapse and flight to traditional value assets.',
    impacts: [
      { assetClass: 'Stocks', percentageChange: -30 },
      { assetClass: 'Bonds', percentageChange: 8 },
      { assetClass: 'Real Estate', percentageChange: -5 },
      { assetClass: 'Cash', percentageChange: 0 },
      { assetClass: 'Private Equity', percentageChange: -25 },
      { assetClass: 'Commodities', percentageChange: 10 },
      { assetClass: 'Cryptocurrency', percentageChange: -70 },
      { assetClass: 'Other', percentageChange: -10 },
    ],
    duration: '12-24 months with 24-month recovery timeline',
  },
  {
    id: 'stagflation',
    name: 'Stagflation Environment',
    description: 'Persistent high inflation combined with high unemployment and stagnant demand, similar to the 1970s economic situation.',
    impacts: [
      { assetClass: 'Stocks', percentageChange: -15 },
      { assetClass: 'Bonds', percentageChange: -10 },
      { assetClass: 'Real Estate', percentageChange: 5 },
      { assetClass: 'Cash', percentageChange: -8 },
      { assetClass: 'Private Equity', percentageChange: -12 },
      { assetClass: 'Commodities', percentageChange: 25 },
      { assetClass: 'Cryptocurrency', percentageChange: -5 },
      { assetClass: 'Other', percentageChange: 0 },
    ],
    duration: '24-36 months',
  },
  {
    id: 'energy-shock',
    name: 'Energy Price Shock',
    description: 'Sudden and significant increase in energy prices due to geopolitical events, supply disruptions, or policy changes affecting energy markets.',
    impacts: [
      { assetClass: 'Stocks', percentageChange: -10 },
      { assetClass: 'Bonds', percentageChange: -5 },
      { assetClass: 'Real Estate', percentageChange: -5 },
      { assetClass: 'Cash', percentageChange: -3 },
      { assetClass: 'Private Equity', percentageChange: -8 },
      { assetClass: 'Commodities', percentageChange: 40 },
      { assetClass: 'Cryptocurrency', percentageChange: 5 },
      { assetClass: 'Other', percentageChange: -5 },
    ],
    duration: '6-12 months',
  },
];

export const usePortfolioStore = create<PortfolioState>((set, get) => ({
  holdingsData: null,
  scenarios: predefinedScenarios,
  selectedScenarioId: null,
  portfolioImpact: null,
  isLoading: false,
  error: null,
  
  setHoldingsData: (data) => set({ holdingsData: data, error: null }),
  clearHoldingsData: () => set({ holdingsData: null, selectedScenarioId: null, portfolioImpact: null }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error, isLoading: false }),
  
  selectScenario: (scenarioId) => {
    set({ selectedScenarioId: scenarioId, portfolioImpact: null });
    if (scenarioId) {
      get().calculateImpact();
    }
  },
  
  calculateImpact: () => {
    const { holdingsData, scenarios, selectedScenarioId } = get();
    
    if (!holdingsData || !selectedScenarioId) {
      set({ portfolioImpact: null });
      return;
    }
    
    const scenario = scenarios.find(s => s.id === selectedScenarioId);
    if (!scenario) {
      set({ portfolioImpact: null });
      return;
    }
    
    // Calculate impact for each asset class
    const assetClassImpacts: Record<string, { 
      originalValue: number; 
      impactedValue: number; 
      absoluteChange: number; 
      percentageChange: number; 
    }> = {};
    
    // Group assets by asset class
    holdingsData.assets.forEach(asset => {
      if (!assetClassImpacts[asset.assetClass]) {
        assetClassImpacts[asset.assetClass] = {
          originalValue: 0,
          impactedValue: 0,
          absoluteChange: 0,
          percentageChange: 0
        };
      }
      assetClassImpacts[asset.assetClass].originalValue += asset.value;
    });
    
    // Apply impact percentages to each asset class
    scenario.impacts.forEach(impact => {
      if (assetClassImpacts[impact.assetClass]) {
        const original = assetClassImpacts[impact.assetClass].originalValue;
        const change = (original * impact.percentageChange) / 100;
        const impacted = original + change;
        
        assetClassImpacts[impact.assetClass].impactedValue = impacted;
        assetClassImpacts[impact.assetClass].absoluteChange = change;
        assetClassImpacts[impact.assetClass].percentageChange = impact.percentageChange;
      }
    });
    
    // Calculate individual asset impacts
    const assetImpacts = holdingsData.assets.map(asset => {
      const impactPercentage = scenario.impacts.find(
        impact => impact.assetClass === asset.assetClass
      )?.percentageChange || 0;
      
      const absoluteChange = (asset.value * impactPercentage) / 100;
      const impactedValue = asset.value + absoluteChange;
      
      return {
        id: asset.id,
        name: asset.name,
        originalValue: asset.value,
        impactedValue,
        absoluteChange,
        percentageChange: impactPercentage,
        assetClass: asset.assetClass,
        industry: asset.industry
      };
    });
    
    // Sort assets by absolute impact (from most negative to most positive)
    assetImpacts.sort((a, b) => a.absoluteChange - b.absoluteChange);
    
    // Calculate total portfolio impact
    const originalValue = holdingsData.totalValue;
    let impactedValue = 0;
    
    Object.values(assetClassImpacts).forEach(impact => {
      impactedValue += impact.impactedValue;
    });
    
    const absoluteChange = impactedValue - originalValue;
    const percentageChange = (absoluteChange / originalValue) * 100;
    
    // Calculate a vulnerability score - higher is more vulnerable
    // Based on: volatility (magnitude of change regardless of direction) and downside risk
    const volatility = Math.abs(percentageChange);
    const downsideExposure = assetImpacts.filter(a => a.absoluteChange < 0)
      .reduce((sum, asset) => sum + Math.abs(asset.absoluteChange), 0) / originalValue * 100;
    
    const vulnerabilityScore = (volatility * 0.4) + (downsideExposure * 0.6);
    
    set({
      portfolioImpact: {
        originalValue,
        impactedValue,
        absoluteChange,
        percentageChange,
        assetClassImpacts,
        assetImpacts,
        vulnerabilityScore: Number(vulnerabilityScore.toFixed(2))
      }
    });
  }
}));
