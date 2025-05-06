
import { Header } from '@/components/Header';
import { FileUploader } from '@/components/FileUploader';
import { PortfolioDashboard } from '@/components/PortfolioDashboard';
import { usePortfolioStore } from '@/store/portfolioStore';
import { SampleDataButton } from '@/components/SampleDataButton';

const Index = () => {
  const { holdingsData, isLoading, error } = usePortfolioStore();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-6">
        {!holdingsData ? (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold">Portfolio Holdings Visualizer</h1>
              <p className="text-muted-foreground">
                Upload a CSV file with portfolio holdings to visualize asset allocation and exposure.
              </p>
              <div className="flex justify-center mt-2">
                <SampleDataButton />
              </div>
            </div>
            
            <FileUploader />
            
            {isLoading && (
              <div className="text-center py-4">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                <p className="mt-2 text-muted-foreground">Parsing portfolio data...</p>
              </div>
            )}
            
            {error && (
              <div className="bg-destructive/10 text-destructive p-4 rounded-md">
                <h3 className="font-medium">Error loading portfolio data</h3>
                <p>{error}</p>
              </div>
            )}
            
            <div className="bg-muted/50 p-6 rounded-lg border">
              <h3 className="font-semibold mb-2">CSV Format Instructions</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Your CSV file should include the following columns:
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="font-medium">name</span>
                  <span className="text-muted-foreground ml-2">Asset name</span>
                </div>
                <div>
                  <span className="font-medium">value</span>
                  <span className="text-muted-foreground ml-2">Numeric value</span>
                </div>
                <div>
                  <span className="font-medium">assetClass</span>
                  <span className="text-muted-foreground ml-2">Asset classification</span>
                </div>
                <div>
                  <span className="font-medium">industry</span>
                  <span className="text-muted-foreground ml-2">Industry sector</span>
                </div>
                <div>
                  <span className="font-medium">region</span>
                  <span className="text-muted-foreground ml-2">Geographic region</span>
                </div>
                <div>
                  <span className="font-medium">ticker</span>
                  <span className="text-muted-foreground ml-2">(Optional) Stock symbol</span>
                </div>
                <div>
                  <span className="font-medium">currency</span>
                  <span className="text-muted-foreground ml-2">Currency code</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <PortfolioDashboard />
        )}
      </main>
    </div>
  );
};

export default Index;
