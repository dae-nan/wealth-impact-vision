
import Papa from 'papaparse';
import { Asset, HoldingsData } from '@/store/types';

interface CSVRow {
  name: string;
  value: string;
  assetClass: string;
  industry: string;
  region: string;
  ticker?: string;
  currency: string;
}

// Helper function to generate chart colors
export const generateChartColors = (count: number): string[] => {
  // Base colors palette
  const baseColors = [
    '#2563EB', // Blue
    '#16A34A', // Green
    '#EF4444', // Red
    '#F59E0B', // Amber
    '#6D28D9', // Purple
    '#EC4899', // Pink
    '#0EA5E9', // Sky
    '#84CC16', // Lime
    '#14B8A6', // Teal
    '#F97316', // Orange
  ];
  
  // If we need more colors than are in the base palette, generate variations
  if (count <= baseColors.length) {
    return baseColors.slice(0, count);
  }
  
  const colors = [...baseColors];
  
  // Generate additional colors by adjusting lightness/saturation of base colors
  while (colors.length < count) {
    const baseIndex = colors.length % baseColors.length;
    const baseColor = baseColors[baseIndex];
    
    // Convert hex to HSL, adjust, and convert back to hex
    const r = parseInt(baseColor.slice(1, 3), 16);
    const g = parseInt(baseColor.slice(3, 5), 16);
    const b = parseInt(baseColor.slice(5, 7), 16);
    
    // Simple variation - slightly adjust RGB values
    const variation = colors.length / baseColors.length;
    const newR = Math.max(0, Math.min(255, r - Math.floor(variation * 30)));
    const newG = Math.max(0, Math.min(255, g - Math.floor(variation * 20)));
    const newB = Math.max(0, Math.min(255, b + Math.floor(variation * 40)));
    
    const newColor = `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
    colors.push(newColor);
  }
  
  return colors;
};

// Helper function to group assets by a property
export const groupAssetsByProperty = (
  assets: Asset[], 
  property: keyof Pick<Asset, 'assetClass' | 'industry' | 'region'>
) => {
  return assets.reduce((acc, asset) => {
    const key = asset[property];
    if (!acc[key]) {
      acc[key] = 0;
    }
    acc[key] += asset.value;
    return acc;
  }, {} as Record<string, number>);
};

// Function to parse a CSV file containing portfolio data
export const parsePortfolioCsv = async (
  fileOrContent: File | string,
  customName?: string
): Promise<HoldingsData> => {
  return new Promise((resolve, reject) => {
    const parseConfig = {
      header: true,
      skipEmptyLines: true,
      transform: (value: string) => value.trim(),
      dynamicTyping: false, // Keep as string for now
      complete: (results: Papa.ParseResult<CSVRow>) => {
        try {
          if (results.errors && results.errors.length > 0) {
            reject(new Error(`CSV parsing error: ${results.errors[0].message}`));
            return;
          }

          const data = results.data;
          if (!data || data.length === 0) {
            reject(new Error('No data found in the CSV file'));
            return;
          }

          // Validate required fields
          const requiredFields = ['name', 'value', 'assetClass', 'industry', 'region', 'currency'];
          const firstRow = data[0];
          
          for (const field of requiredFields) {
            if (!(field in firstRow)) {
              reject(new Error(`CSV is missing required field: ${field}`));
              return;
            }
          }

          // Parse and transform the data
          const assets: Asset[] = data.map((row, index) => {
            if (!row.name || !row.value) {
              throw new Error(`Row ${index + 1} is missing name or value`);
            }

            const value = parseFloat(row.value);
            if (isNaN(value)) {
              throw new Error(`Invalid value for ${row.name}: ${row.value}`);
            }

            return {
              id: `asset-${index}`,
              name: row.name,
              value,
              assetClass: row.assetClass as Asset['assetClass'],
              industry: row.industry as Asset['industry'],
              region: row.region as Asset['region'],
              ticker: row.ticker,
              currency: row.currency,
            };
          });

          // Calculate total value
          const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);

          // Determine individual name from file name or first asset
          const individualName = customName || 'Portfolio Owner';

          // Create holdings data
          const holdingsData: HoldingsData = {
            individualName,
            totalValue,
            assets,
            lastUpdated: new Date(),
          };

          resolve(holdingsData);
        } catch (error) {
          reject(error);
        }
      }
    };

    // Handle either File object or string content
    if (typeof fileOrContent === 'string') {
      Papa.parse(fileOrContent, parseConfig);
    } else {
      // For File objects, we need to use the correct overload
      Papa.parse(fileOrContent as File, parseConfig);
    }
  });
};
