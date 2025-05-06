
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';

const SAMPLE_CSV_CONTENT = `name,value,assetClass,industry,region,ticker,currency
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

export const SampleDataButton = () => {
  const handleDownloadSample = () => {
    // Create blob from sample data
    const blob = new Blob([SAMPLE_CSV_CONTENT], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    
    // Create temporary link and trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Elon Musk.csv';
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Sample data downloaded successfully!');
  };
  
  return (
    <Button 
      variant="outline" 
      onClick={handleDownloadSample}
      className="text-xs"
    >
      Download Sample Data
    </Button>
  );
};
