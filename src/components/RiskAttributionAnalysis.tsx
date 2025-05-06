
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
      <Card className="shadow-sm hover:shadow-md transition-all">
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
    <Card className="shadow-sm hover:shadow-md transition-all">
      <CardHeader>
        <CardTitle>Risk Attribution Analysis</CardTitle>
        <CardDescription>
          Assets contributing most to portfolio vulnerability in the {selectedScenario?.name} scenario
        </CardDescription>
      </CardHeader>
      <CardContent>
        {topRiskyAssets.length > 0 ? (
          <>
            <BarChart 
              data={riskData} 
              title="Assets by Risk Impact" 
              height={400}
            />
            <div className="mt-4 max-h-64 overflow-y-auto border rounded-md">
              <table className="w-full">
                <thead className="bg-muted/60 sticky top-0">
                  <tr>
                    <th className="text-left p-2">Asset Name</th>
                    <th className="text-right p-2">Original Value</th>
                    <th className="text-right p-2">Impact</th>
                    <th className="text-right p-2">Change</th>
                  </tr>
                </thead>
                <tbody>
                  {topRiskyAssets.map((asset) => (
                    <tr key={asset.id} className="border-t hover:bg-muted/40">
                      <td className="p-2">
                        <div className="font-medium">{asset.name}</div>
                        <div className="text-xs text-muted-foreground">{asset.assetClass} / {asset.industry}</div>
                      </td>
                      <td className="text-right p-2">${asset.originalValue.toLocaleString()}</td>
                      <td className="text-right p-2 text-red-500">-${Math.abs(asset.absoluteChange).toLocaleString()}</td>
                      <td className="text-right p-2 text-red-500">{asset.percentageChange.toFixed(2)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <p className="text-center text-muted-foreground py-8">
            No negative impacts found in this scenario.
          </p>
        )}
      </CardContent>
    </Card>
  );
};
