
/**
 * Format currency values in a more readable way
 * Always display in compact notation (millions with $M or billions with $B suffix)
 */
export const formatCurrencyCompact = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
};

/**
 * Format regular currency without compact notation
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
};

/**
 * Standard Chartered color palette for charts
 */
export const scChartColors = {
  primary: '#0F5EAD', // SC Blue
  secondary: '#1E8539', // SC Green
  tertiary: '#CE1126', // SC Red
  neutralLight: '#E5E7EB',
  neutralMid: '#9CA3AF',
  neutralDark: '#374151',
  accent1: '#FF9E1B', // SC Orange
  accent2: '#7F58D3', // Purple
  accent3: '#41B6E6', // Light Blue
  accent4: '#65B06C', // Light Green
  accent5: '#E35F6D', // Light Red
};

/**
 * Returns an array of colors for charts from SC palette
 */
export const getScChartColors = (count: number): string[] => {
  const baseColors = [
    scChartColors.primary,
    scChartColors.secondary,
    scChartColors.tertiary,
    scChartColors.accent1,
    scChartColors.accent2,
    scChartColors.accent3,
    scChartColors.accent4,
    scChartColors.accent5,
  ];
  
  // If we need more colors than we have, repeat the palette
  const colors = [];
  for (let i = 0; i < count; i++) {
    colors.push(baseColors[i % baseColors.length]);
  }
  
  return colors;
};
