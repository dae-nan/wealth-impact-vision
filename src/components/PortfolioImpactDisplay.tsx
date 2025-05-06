
import { usePortfolioStore } from '@/store/portfolioStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingDown, TrendingUp } from 'lucide-react';

export const PortfolioImpactDisplay = () => {
  const { portfolioImpact, selectedScenarioId, scenarios } = usePortfolioStore();
  
  const selectedScenario = scenarios.find(s => s.id === selectedScenarioId);
  
  if (!portfolioImpact || !selectedScenario) {
    return null;
  }
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };
  
  const isPositive = portfolioImpact.percentageChange >= 0;
  
  return (
    <Card className="shadow-sm hover:shadow-md transition-all">
      <CardHeader>
        <CardTitle>Portfolio Impact Analysis</CardTitle>
        <CardDescription>
          Impact of {selectedScenario.name} scenario on portfolio value
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-muted/60 p-4 rounded-lg">
            <div className="text-sm text-muted-foreground">Original Value</div>
            <div className="text-2xl font-bold">{formatCurrency(portfolioImpact.originalValue)}</div>
          </div>
          <div className="bg-muted/60 p-4 rounded-lg">
            <div className="text-sm text-muted-foreground">Projected Value</div>
            <div className="text-2xl font-bold">{formatCurrency(portfolioImpact.impactedValue)}</div>
          </div>
        </div>
        
        <div className="flex items-center justify-between p-6 bg-muted/60 rounded-lg border-l-4 border-r-4 border-solid border-transparent" style={{
          borderLeftColor: isPositive ? 'rgb(22, 163, 74)' : 'rgb(220, 38, 38)',
          borderRightColor: isPositive ? 'rgb(22, 163, 74)' : 'rgb(220, 38, 38)'
        }}>
          <div>
            <div className="text-sm text-muted-foreground">Net Impact</div>
            <div className="text-2xl font-bold">
              {formatCurrency(Math.abs(portfolioImpact.absoluteChange))}
              <span className={isPositive ? 'text-green-500' : 'text-red-500'}>
                {' '}({isPositive ? '+' : ''}{portfolioImpact.percentageChange.toFixed(2)}%)
              </span>
            </div>
          </div>
          <div className={`p-3 rounded-full ${isPositive ? 'bg-green-100' : 'bg-red-100'}`}>
            {isPositive ? (
              <TrendingUp className="h-6 w-6 text-green-500" />
            ) : (
              <TrendingDown className="h-6 w-6 text-red-500" />
            )}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-3">Asset Class Breakdown</h3>
          <div className="space-y-3">
            {Object.entries(portfolioImpact.assetClassImpacts || {}).map(([assetClass, impact]) => (
              <div key={assetClass} className="flex justify-between border-b pb-2">
                <div>
                  <div className="font-medium">{assetClass}</div>
                  <div className="text-sm text-muted-foreground">
                    {formatCurrency(impact.originalValue)} → {formatCurrency(impact.impactedValue)}
                  </div>
                </div>
                <div className={`font-semibold ${impact.percentageChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {impact.percentageChange >= 0 ? '+' : ''}{impact.percentageChange.toFixed(2)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
