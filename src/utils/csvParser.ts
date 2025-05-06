
import Papa from 'papaparse';
import { Asset, AssetClass, Industry, Region, HoldingsData } from '@/store/portfolioStore';

// Expected CSV columns
const EXPECTED_HEADERS = [
  'name', 'value', 'assetClass', 'industry', 'region', 'ticker', 'currency'
];

// Validate if the parsed CSV has the expected structure
const validateCsvStructure = (results: Papa.ParseResult<any>): string | null => {
  if (!results.data || results.data.length === 0) {
    return 'The file appears to be empty';
  }

  const headers = Object.keys(results.data[0]);
  const missingHeaders = EXPECTED_HEADERS.filter(header => 
    !headers.includes(header) && header !== 'ticker' // ticker is optional
  );

  if (missingHeaders.length > 0) {
    return `Missing required columns: ${missingHeaders.join(', ')}`;
  }

  return null;
};

// Validate if value for each asset is a number
const validateAssetValues = (results: Papa.ParseResult<any>): string | null => {
  for (let i = 0; i < results.data.length; i++) {
    const asset = results.data[i];
    const value = parseFloat(asset.value);
    
    if (isNaN(value)) {
      return `Invalid value for asset "${asset.name}" at row ${i + 1}`;
    }
  }
  
  return null;
};

// Parse CSV data to HoldingsData format - accepts either File or string content
export const parsePortfolioCsv = (input: File | string, fileName?: string): Promise<HoldingsData> => {
  return new Promise((resolve, reject) => {
    const parseConfig: Papa.ParseConfig = {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        // Validate CSV structure
        const structureError = validateCsvStructure(results);
        if (structureError) {
          reject(new Error(structureError));
          return;
        }

        // Validate asset values
        const valueError = validateAssetValues(results);
        if (valueError) {
          reject(new Error(valueError));
          return;
        }

        try {
          // Extract individual name from filename (remove extension)
          let individualName: string;
          
          if (typeof input === 'string' && fileName) {
            individualName = fileName;
          } else if (input instanceof File) {
            individualName = input.name.replace(/\.[^/.]+$/, "");
          } else {
            individualName = "Portfolio";
          }
          
          // Parse assets
          const assets: Asset[] = results.data.map((row: any, index) => ({
            id: `asset-${index}`,
            name: row.name,
            value: parseFloat(row.value),
            assetClass: row.assetClass as AssetClass,
            industry: row.industry as Industry,
            region: row.region as Region,
            ticker: row.ticker || undefined,
            currency: row.currency || 'USD',
          }));

          // Calculate total value
          const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);

          resolve({
            individualName,
            totalValue,
            assets,
            lastUpdated: new Date(),
          });
        } catch (error) {
          reject(new Error('Failed to parse CSV data. Please check the file format.'));
        }
      },
      error: (error: Error) => {
        reject(new Error(`CSV parsing error: ${error.message}`));
      }
    };
    
    // Parse either a file or a string
    if (typeof input === 'string') {
      Papa.parse(input, parseConfig);
    } else if (input instanceof File) {
      Papa.parse(input, parseConfig);
    }
  });
};

// Helper function to group assets by a specific property
export const groupAssetsByProperty = <T extends keyof Asset>(
  assets: Asset[],
  property: T
): Record<string, number> => {
  return assets.reduce((acc, asset) => {
    const key = asset[property] as string;
    acc[key] = (acc[key] || 0) + asset.value;
    return acc;
  }, {} as Record<string, number>);
};

// Generate color scheme for charts
export const generateChartColors = (count: number): string[] => {
  const colors = [
    '#3b82f6', // blue
    '#10b981', // green
    '#f97316', // orange
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#14b8a6', // teal
    '#f43f5e', // rose
    '#f59e0b', // amber
    '#06b6d4', // cyan
    '#6366f1', // indigo
  ];
  
  // If we need more colors than predefined, generate them
  if (count > colors.length) {
    for (let i = colors.length; i < count; i++) {
      const hue = (i * 137.5) % 360; // Use golden angle approximation
      colors.push(`hsl(${hue}, 70%, 60%)`);
    }
  }
  
  return colors.slice(0, count);
};
