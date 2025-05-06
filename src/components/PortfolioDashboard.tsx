
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePortfolioStore } from '@/store/portfolioStore';
import { PieChart } from './visualizations/PieChart';
import { BarChart } from './visualizations/BarChart';
import { groupAssetsByProperty } from '@/utils/csvParser';
import { Button } from './ui/button';
import { ScenarioSelector } from './ScenarioSelector';
import { PortfolioImpactDisplay } from './PortfolioImpactDisplay';
import { RiskAttributionAnalysis } from './RiskAttributionAnalysis';
import { VulnerabilityComparison } from './VulnerabilityComparison';
import { VulnerabilityRankings } from './vulnerability/VulnerabilityRankings';
import { PDFReportGenerator } from './PDFReportGenerator';
import { ArrowLeft } from 'lucide-react';

export const PortfolioDashboard = () => {
  const { holdingsData, clearHoldingsData, selectedScenarioId } = usePortfolioStore();
  
  if (!holdingsData) return null;
  
  // Prepare the data for visualizations
  const assetClassData = groupAssetsByProperty(holdingsData.assets, 'assetClass');
  const industryData = groupAssetsByProperty(holdingsData.assets, 'industry');
  const regionData = groupAssetsByProperty(holdingsData.assets, 'region');
  
  // Create a new data structure for top holdings
  const topHoldings = [...holdingsData.assets]
    .sort((a, b) => b.value - a.value)
    .slice(0, 10)
    .reduce((acc, asset) => {
      acc[asset.name] = asset.value;
      return acc;
    }, {} as Record<string, number>);
  
  return (
    <div className="space-y-6">
      {/* Dashboard Header with Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-secondary/10 p-4 rounded-lg">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{holdingsData.individualName}'s Portfolio</h2>
          <p className="text-muted-foreground">
            Total Value: ${holdingsData.totalValue.toLocaleString()} • 
            Last Updated: {holdingsData.lastUpdated.toLocaleDateString()}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {selectedScenarioId && <PDFReportGenerator />}
          <Button variant="outline" className="flex items-center gap-2" onClick={clearHoldingsData}>
            <ArrowLeft className="h-4 w-4" />
            Clear Data
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="w-full sm:w-auto flex overflow-x-auto justify-start sm:justify-center p-1 mb-4">
          <TabsTrigger value="overview" className="px-4">Overview</TabsTrigger>
          <TabsTrigger value="assetClass" className="px-4">Asset Classes</TabsTrigger>
          <TabsTrigger value="industry" className="px-4">Industries</TabsTrigger>
          <TabsTrigger value="geography" className="px-4">Geography</TabsTrigger>
          <TabsTrigger value="scenarios" className="px-4">Scenario Analysis</TabsTrigger>
          <TabsTrigger value="vulnerability" className="px-4">Vulnerability</TabsTrigger>
          <TabsTrigger value="rankings" className="px-4">Rankings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="shadow-sm hover:shadow transition-shadow duration-200">
              <CardHeader>
                <CardTitle>Portfolio Summary</CardTitle>
                <CardDescription>
                  Breakdown of {holdingsData.individualName}'s investment portfolio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Assets:</span>
                    <span className="font-medium">{holdingsData.assets.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Asset Classes:</span>
                    <span className="font-medium">{Object.keys(assetClassData).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Industries:</span>
                    <span className="font-medium">{Object.keys(industryData).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Regions:</span>
                    <span className="font-medium">{Object.keys(regionData).length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <BarChart 
              data={topHoldings} 
              title="Top 10 Holdings" 
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <PieChart 
              data={assetClassData} 
              title="Asset Allocation" 
            />
            <PieChart 
              data={industryData} 
              title="Industry Exposure" 
            />
            <PieChart 
              data={regionData} 
              title="Geographic Distribution" 
            />
          </div>
        </TabsContent>
        
        <TabsContent value="assetClass">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            <BarChart 
              data={assetClassData} 
              title="Asset Class Allocation" 
              height={400}
            />
            <PieChart 
              data={assetClassData} 
              title="Asset Class Allocation" 
              height={400} 
            />
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Asset Class Breakdown</CardTitle>
                <CardDescription>Detailed view of asset classes in your portfolio</CardDescription>
              </CardHeader>
              <CardContent className="overflow-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Asset Class</th>
                      <th className="text-right py-2">Value</th>
                      <th className="text-right py-2">Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(assetClassData).map(([assetClass, value]) => (
                      <tr key={assetClass} className="border-b">
                        <td className="py-2">{assetClass}</td>
                        <td className="text-right py-2">${value.toLocaleString()}</td>
                        <td className="text-right py-2">
                          {((value / holdingsData.totalValue) * 100).toFixed(2)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="industry">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            <BarChart 
              data={industryData} 
              title="Industry Exposure" 
              height={400}
            />
            <PieChart 
              data={industryData} 
              title="Industry Exposure" 
              height={400}
            />
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Industry Breakdown</CardTitle>
                <CardDescription>Detailed view of industry sectors in your portfolio</CardDescription>
              </CardHeader>
              <CardContent className="overflow-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Industry</th>
                      <th className="text-right py-2">Value</th>
                      <th className="text-right py-2">Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(industryData).map(([industry, value]) => (
                      <tr key={industry} className="border-b">
                        <td className="py-2">{industry}</td>
                        <td className="text-right py-2">${value.toLocaleString()}</td>
                        <td className="text-right py-2">
                          {((value / holdingsData.totalValue) * 100).toFixed(2)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="geography">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            <BarChart 
              data={regionData} 
              title="Geographic Distribution" 
              height={400}
            />
            <PieChart 
              data={regionData} 
              title="Geographic Distribution" 
              height={400}
            />
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Regional Breakdown</CardTitle>
                <CardDescription>Detailed view of geographic regions in your portfolio</CardDescription>
              </CardHeader>
              <CardContent className="overflow-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Region</th>
                      <th className="text-right py-2">Value</th>
                      <th className="text-right py-2">Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(regionData).map(([region, value]) => (
                      <tr key={region} className="border-b">
                        <td className="py-2">{region}</td>
                        <td className="text-right py-2">${value.toLocaleString()}</td>
                        <td className="text-right py-2">
                          {((value / holdingsData.totalValue) * 100).toFixed(2)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="scenarios" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ScenarioSelector />
            {selectedScenarioId && <PortfolioImpactDisplay />}
          </div>
          
          {selectedScenarioId && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <RiskAttributionAnalysis />
              </div>
              
              <div className="flex justify-end mt-4">
                <PDFReportGenerator />
              </div>
            </>
          )}
        </TabsContent>
        
        <TabsContent value="vulnerability" className="space-y-6">
          <VulnerabilityComparison />
        </TabsContent>
        
        <TabsContent value="rankings" className="space-y-6">
          <VulnerabilityRankings />
        </TabsContent>
      </Tabs>
    </div>
  );
};
