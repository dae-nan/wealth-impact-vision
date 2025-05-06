
import { HoldingsData, PortfolioImpact, Scenario } from './types';

export const calculatePortfolioImpact = (
  holdingsData: HoldingsData, 
  scenario: Scenario
): PortfolioImpact => {
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
  
  return {
    originalValue,
    impactedValue,
    absoluteChange,
    percentageChange,
    assetClassImpacts,
    assetImpacts,
    vulnerabilityScore: Number(vulnerabilityScore.toFixed(2))
  };
};
