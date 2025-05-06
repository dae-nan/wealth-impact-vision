
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
    const parseConfig: Papa.ParseConfig<CSVRow> = {
      header: true,
      skipEmptyLines: true,
      transform: (value: string) => value.trim(),
      dynamicTyping: false, // Keep as string for now
      complete: (results) => {
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
      },
      error: (error) => {
        reject(new Error(`CSV parsing error: ${error.message}`));
      },
    };

    // Handle either File object or string content
    if (typeof fileOrContent === 'string') {
      Papa.parse(fileOrContent, parseConfig);
    } else {
      Papa.parse(fileOrContent, {
        ...parseConfig,
        complete: parseConfig.complete,
        error: parseConfig.error,
      });
    }
  });
};
