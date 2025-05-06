
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { Import } from 'lucide-react';
import { usePortfolioStore } from '@/store/portfolioStore';
import { parsePortfolioCsv } from '@/utils/csvParser';

// Warren Buffett's portfolio
const WARREN_BUFFETT_CSV = `name,value,assetClass,industry,region,ticker,currency
Apple,115000000000,Stocks,Technology,North America,AAPL,USD
Bank of America,35000000000,Stocks,Finance,North America,BAC,USD
Coca-Cola,21000000000,Stocks,Consumer Goods,North America,KO,USD
American Express,20000000000,Stocks,Finance,North America,AXP,USD
Chevron,18000000000,Stocks,Energy,North America,CVX,USD
Occidental Petroleum,10000000000,Stocks,Energy,North America,OXY,USD
Kraft Heinz,11000000000,Stocks,Consumer Goods,North America,KHC,USD
Moody's Corporation,8000000000,Stocks,Finance,North America,MCO,USD
BYD Company,5000000000,Stocks,Industrials,Asia Pacific,BYDDF,USD
Verizon,5000000000,Stocks,Telecommunications,North America,VZ,USD
Cash and Equivalents,35000000000,Cash,Finance,Global,,USD`;

// Li Ka Shing's portfolio
const LI_KA_SHING_CSV = `name,value,assetClass,industry,region,ticker,currency
CK Hutchison Holdings,15000000000,Stocks,Industrials,Asia Pacific,0001.HK,HKD
CK Asset Holdings,12000000000,Stocks,Real Estate,Asia Pacific,1113.HK,HKD
Husky Energy,8000000000,Stocks,Energy,North America,,CAD
Cheung Kong Infrastructure,7000000000,Stocks,Utilities,Asia Pacific,1038.HK,HKD
Power Assets Holdings,5000000000,Stocks,Utilities,Asia Pacific,0006.HK,HKD
Facebook/Meta,3000000000,Stocks,Technology,North America,META,USD
Spotify,2000000000,Stocks,Technology,Europe,SPOT,USD
Zoom,1500000000,Stocks,Technology,North America,ZM,USD
Real Estate Portfolio,20000000000,Real Estate,Real Estate,Asia Pacific,,HKD
Private Equity Investments,10000000000,Private Equity,Finance,Global,,USD
Cash and Equivalents,8000000000,Cash,Finance,Global,,USD`;

// Bill Gates's portfolio
const BILL_GATES_CSV = `name,value,assetClass,industry,region,ticker,currency
Microsoft,50000000000,Stocks,Technology,North America,MSFT,USD
Berkshire Hathaway,10000000000,Stocks,Finance,North America,BRK.B,USD
Canadian National Railway,7000000000,Stocks,Industrials,North America,CNI,USD
Waste Management,6000000000,Stocks,Industrials,North America,WM,USD
Caterpillar Inc.,5000000000,Stocks,Industrials,North America,CAT,USD
Ecolab,4000000000,Stocks,Materials,North America,ECL,USD
Walmart,3500000000,Stocks,Consumer Goods,North America,WMT,USD
FedEx,3000000000,Stocks,Industrials,North America,FDX,USD
Bill & Melinda Gates Foundation,50000000000,Private Equity,Other,Global,,USD
Real Estate Portfolio,15000000000,Real Estate,Real Estate,North America,,USD
Farmland Investments,10000000000,Commodities,Other,North America,,USD
Cash and Equivalents,5000000000,Cash,Finance,Global,,USD`;

// Elon Musk's portfolio
const ELON_MUSK_CSV = `name,value,assetClass,industry,region,ticker,currency
Tesla,120000000000,Stocks,Technology,North America,TSLA,USD
SpaceX,50000000000,Private Equity,Technology,North America,,USD
Twitter / X,30000000000,Private Equity,Technology,North America,,USD
Bitcoin,15000000000,Cryptocurrency,Finance,Global,BTC,USD
Real Estate Portfolio,10000000000,Real Estate,Other,North America,,USD
Boring Company,5000000000,Private Equity,Industrials,North America,,USD
Neuralink,3000000000,Private Equity,Healthcare,North America,,USD
US Treasury Bonds,2000000000,Bonds,Finance,North America,,USD
Cash and Equivalents,5000000000,Cash,Finance,Global,,USD
Artwork Collection,1000000000,Other,Other,Global,,USD
Solar City,4000000000,Stocks,Energy,North America,,USD`;

// Function to load sample data directly into the app
const loadSampleData = async (csvContent: string, individualName: string) => {
  try {
    const holdingsData = await parsePortfolioCsv(csvContent, individualName);
    const { setHoldingsData, setLoading, setError } = usePortfolioStore.getState();
    
    setLoading(true);
    setHoldingsData(holdingsData);
    setLoading(false);
    
    toast.success(`Loaded ${individualName}'s portfolio successfully!`);
  } catch (error) {
    const { setError, setLoading } = usePortfolioStore.getState();
    setLoading(false);
    setError((error as Error).message);
    toast.error(`Error loading sample data: ${(error as Error).message}`);
  }
};

export const SampleDataButton = () => {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      <Button 
        variant="outline" 
        onClick={() => loadSampleData(WARREN_BUFFETT_CSV, 'Warren Buffett')}
        className="text-xs"
        size="sm"
      >
        <Import className="mr-1 h-3 w-3" />
        Warren Buffett
      </Button>
      
      <Button 
        variant="outline" 
        onClick={() => loadSampleData(LI_KA_SHING_CSV, 'Li Ka Shing')}
        className="text-xs"
        size="sm"
      >
        <Import className="mr-1 h-3 w-3" />
        Li Ka Shing
      </Button>
      
      <Button 
        variant="outline" 
        onClick={() => loadSampleData(BILL_GATES_CSV, 'Bill Gates')}
        className="text-xs"
        size="sm"
      >
        <Import className="mr-1 h-3 w-3" />
        Bill Gates
      </Button>
      
      <Button 
        variant="outline" 
        onClick={() => loadSampleData(ELON_MUSK_CSV, 'Elon Musk')}
        className="text-xs"
        size="sm"
      >
        <Import className="mr-1 h-3 w-3" />
        Elon Musk
      </Button>
    </div>
  );
};
