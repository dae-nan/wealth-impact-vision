
import { create } from 'zustand';
import { predefinedScenarios } from './predefinedScenarios';
import { calculatePortfolioImpact } from './calculations';
import { PortfolioState, HoldingsData } from './types';

export * from './types';
export { predefinedScenarios } from './predefinedScenarios';

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
    
    const portfolioImpact = calculatePortfolioImpact(holdingsData, scenario);
    set({ portfolioImpact });
  }
}));
