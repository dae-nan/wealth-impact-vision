
import { usePortfolioStore } from '@/store/portfolioStore';
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const ScenarioSelector = () => {
  const { scenarios, selectedScenarioId, selectScenario } = usePortfolioStore();
  
  const selectedScenario = scenarios.find(s => s.id === selectedScenarioId);
  
  const handleScenarioChange = (value: string) => {
    selectScenario(value);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Scenario Selection</CardTitle>
        <CardDescription>
          Choose a market scenario to analyze portfolio impact
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select onValueChange={handleScenarioChange} value={selectedScenarioId || ''}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a scenario" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Market Scenarios</SelectLabel>
              {scenarios.map(scenario => (
                <SelectItem key={scenario.id} value={scenario.id}>
                  {scenario.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        
        {selectedScenario && (
          <div className="space-y-3 mt-4">
            <div>
              <h4 className="font-medium">Description</h4>
              <p className="text-sm text-muted-foreground">{selectedScenario.description}</p>
            </div>
            <div>
              <h4 className="font-medium">Duration</h4>
              <p className="text-sm text-muted-foreground">{selectedScenario.duration}</p>
            </div>
            <div>
              <h4 className="font-medium">Asset Class Impacts</h4>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {selectedScenario.impacts.map(impact => (
                  <div 
                    key={impact.assetClass} 
                    className="flex justify-between border p-2 rounded-md"
                  >
                    <span className="text-sm">{impact.assetClass}</span>
                    <span 
                      className={`text-sm font-medium ${
                        impact.percentageChange > 0 
                          ? 'text-green-500' 
                          : impact.percentageChange < 0 
                            ? 'text-red-500' 
                            : ''
                      }`}
                    >
                      {impact.percentageChange > 0 ? '+' : ''}{impact.percentageChange}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
