
import { usePortfolioStore } from '@/store/portfolioStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart } from './visualizations/BarChart';

export const RiskAttributionAnalysis = () => {
  const { portfolioImpact, scenarios, selectedScenarioId } = usePortfolioStore();
  
  if (!portfolioImpact || !selectedScenarioId) {
    return null;
  }
  
  const selectedScenario = scenarios.find(s => s.id === selectedScenarioId);
  
  // Get the top 10 most impacted assets (by absolute negative impact)
  const topRiskyAssets = [...portfolioImpact.assetImpacts]
    .filter(asset => asset.absoluteChange < 0)
    .sort((a, b) => a.absoluteChange - b.absoluteChange)
    .slice(0, 10);
    
  if (topRiskyAssets.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Risk Attribution Analysis</CardTitle>
          <CardDescription>
            No negative impacts found in this scenario
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            The selected scenario doesn't have any assets with negative impact.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  // Format data for bar chart - take absolute values for better visualization
  const riskData = topRiskyAssets.reduce((acc, asset) => {
    acc[asset.name] = Math.abs(asset.absoluteChange);
    return acc;
  }, {} as Record<string, number>);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Risk Attribution Analysis</CardTitle>
        <CardDescription>
          Assets contributing most to portfolio vulnerability in the {selectedScenario?.name} scenario
        </CardDescription>
      </CardHeader>
      <CardContent>
        {topRiskyAssets.length > 0 ? (
          <BarChart 
            data={riskData} 
            title="Assets by Risk Impact" 
            height={400}
          />
        ) : (
          <p className="text-center text-muted-foreground py-8">
            No negative impacts found in this scenario.
          </p>
        )}
      </CardContent>
    </Card>
  );
};
