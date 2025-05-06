
import { HoldingsData, PortfolioImpact, Scenario } from './types';

export const calculatePortfolioImpact = (
  holdingsData: HoldingsData, 
  scenario: Scenario
): PortfolioImpact => {
  // Initialize empty object for asset class impacts
  const assetClassImpacts: Record<string, { 
    originalValue: number; 
    impactedValue: number; 
    absoluteChange: number; 
    percentageChange: number; 
  }> = {};
  
  // First, collect all unique asset classes from the portfolio
  const uniqueAssetClasses = new Set<string>();
  holdingsData.assets.forEach(asset => {
    uniqueAssetClasses.add(asset.assetClass);
  });
  
  // Initialize the assetClassImpacts for all unique asset classes
  uniqueAssetClasses.forEach(assetClass => {
    assetClassImpacts[assetClass] = {
      originalValue: 0,
      impactedValue: 0,
      absoluteChange: 0,
      percentageChange: 0
    };
  });
  
  // Calculate the original value for each asset class
  holdingsData.assets.forEach(asset => {
    assetClassImpacts[asset.assetClass].originalValue += asset.value;
  });
  
  // Create a map of asset class to impact percentage for faster lookups
  const impactMap = new Map<string, number>();
  scenario.impacts.forEach(impact => {
    impactMap.set(impact.assetClass, impact.percentageChange);
  });
  
  // Apply impact percentages to each asset class
  Object.entries(assetClassImpacts).forEach(([assetClass, impact]) => {
    const impactPercentage = impactMap.get(assetClass) ?? 0;
    const original = impact.originalValue;
    const change = (original * impactPercentage) / 100;
    
    assetClassImpacts[assetClass].impactedValue = original + change;
    assetClassImpacts[assetClass].absoluteChange = change;
    assetClassImpacts[assetClass].percentageChange = impactPercentage;
  });
  
  // Calculate individual asset impacts
  const assetImpacts = holdingsData.assets.map(asset => {
    const impactPercentage = impactMap.get(asset.assetClass) ?? 0;
    
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
