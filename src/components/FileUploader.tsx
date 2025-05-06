
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { parsePortfolioCsv } from '@/utils/csvParser';
import { usePortfolioStore } from '@/store/portfolioStore';
import { toast } from '@/components/ui/sonner';

export const FileUploader = () => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { setHoldingsData, setLoading, setError } = usePortfolioStore();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files[0]) {
      await handleFile(e.target.files[0]);
    }
  };

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  const handleFile = async (file: File) => {
    // Check file extension
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    if (fileExt !== 'csv') {
      toast.error('Please upload a CSV file');
      return;
    }

    setLoading(true);
    try {
      const data = await parsePortfolioCsv(file);
      setHoldingsData(data);
      toast.success(`Portfolio for ${data.individualName} loaded successfully!`);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
        toast.error(error.message);
      } else {
        setError('An unknown error occurred');
        toast.error('Failed to parse file. Please check the format.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <form 
          className="flex flex-col items-center justify-center w-full"
          onDragEnter={handleDrag}
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".csv"
            onChange={handleChange}
            className="hidden"
          />
          
          <div 
            className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer ${
              dragActive ? 'border-primary bg-secondary/30' : 'border-border'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={handleButtonClick}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg 
                className="w-10 h-10 mb-3 text-muted-foreground" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
                />
              </svg>
              <p className="mb-2 text-sm text-muted-foreground">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-muted-foreground">CSV file with asset holdings</p>
            </div>
          </div>
          
          <div className="mt-4">
            <Button 
              type="button"
              onClick={handleButtonClick}
              className="px-4"
            >
              Upload Holdings CSV
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
