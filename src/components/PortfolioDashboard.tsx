
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePortfolioStore } from '@/store/portfolioStore';
import { PieChart } from './visualizations/PieChart';
import { BarChart } from './visualizations/BarChart';
import { groupAssetsByProperty } from '@/utils/csvParser';
import { Button } from './ui/button';

export const PortfolioDashboard = () => {
  const { holdingsData, clearHoldingsData } = usePortfolioStore();
  
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{holdingsData.individualName}'s Portfolio</h2>
          <p className="text-muted-foreground">
            Total Value: ${holdingsData.totalValue.toLocaleString()} • 
            Last Updated: {holdingsData.lastUpdated.toLocaleDateString()}
          </p>
        </div>
        <Button variant="outline" onClick={clearHoldingsData}>
          Clear Data
        </Button>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="assetClass">Asset Classes</TabsTrigger>
          <TabsTrigger value="industry">Industries</TabsTrigger>
          <TabsTrigger value="geography">Geography</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
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
          <div className="grid grid-cols-1 gap-4">
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
          </div>
        </TabsContent>
        
        <TabsContent value="industry">
          <div className="grid grid-cols-1 gap-4">
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
          </div>
        </TabsContent>
        
        <TabsContent value="geography">
          <div className="grid grid-cols-1 gap-4">
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
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
