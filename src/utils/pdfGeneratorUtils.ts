
import { AutoTableJsPDF } from './pdfTypes';
import { PortfolioImpact, HoldingsData, Scenario } from '@/store/types';
import autoTable from 'jspdf-autotable';
import { groupAssetsByProperty } from './csvParser';

export function addHeader(pdf: AutoTableJsPDF, title: string): void {
  const pageWidth = pdf.internal.pageSize.width;
  
  pdf.setFontSize(22);
  pdf.setTextColor(33, 33, 33);
  pdf.text(title, pageWidth / 2, 20, { align: 'center' });
  
  pdf.setFontSize(12);
  pdf.setTextColor(100, 100, 100);
  pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, 28, { align: 'center' });
}

export function addPortfolioSummary(pdf: AutoTableJsPDF, holdingsData: HoldingsData): void {
  pdf.setFontSize(18);
  pdf.setTextColor(33, 33, 33);
  pdf.text('Portfolio Summary', 14, 40);
  
  pdf.setFontSize(11);
  pdf.setTextColor(60, 60, 60);
  pdf.text(`Portfolio Owner: ${holdingsData.individualName}`, 14, 50);
  pdf.text(`Total Portfolio Value: $${holdingsData.totalValue.toLocaleString()}`, 14, 56);
  pdf.text(`Last Updated: ${holdingsData.lastUpdated.toLocaleDateString()}`, 14, 62);
  pdf.text(`Total Assets: ${holdingsData.assets.length}`, 14, 68);
}

export function addScenarioDetails(pdf: AutoTableJsPDF, scenario: Scenario): void {
  pdf.setFontSize(18);
  pdf.setTextColor(33, 33, 33);
  pdf.text('Scenario Analysis', 14, 82);
  
  pdf.setFontSize(11);
  pdf.setTextColor(60, 60, 60);
  pdf.text(`Scenario: ${scenario?.name}`, 14, 92);
  pdf.text(`Description: ${scenario?.description}`, 14, 98);
  pdf.text(`Duration: ${scenario?.duration}`, 14, 104);
}

export function addImpactSummary(pdf: AutoTableJsPDF, portfolioImpact: PortfolioImpact): void {
  pdf.setFontSize(16);
  pdf.setTextColor(33, 33, 33);
  pdf.text('Impact Summary', 14, 118);
  
  pdf.setFontSize(11);
  const originalValue = `Original Value: $${portfolioImpact.originalValue.toLocaleString()}`;
  const impactedValue = `Projected Value: $${portfolioImpact.impactedValue.toLocaleString()}`;
  pdf.text(originalValue, 14, 128);
  pdf.text(impactedValue, 14, 134);
  
  const netChangeText = `Net Change: ${portfolioImpact.percentageChange >= 0 ? '+' : ''}${portfolioImpact.percentageChange.toFixed(2)}%`;
  const absChangeText = `Absolute Change: ${portfolioImpact.absoluteChange >= 0 ? '+' : ''}$${Math.abs(portfolioImpact.absoluteChange).toLocaleString()}`;
  
  if (portfolioImpact.percentageChange >= 0) {
    pdf.setTextColor(16, 163, 74); // Green for positive impact
  } else {
    pdf.setTextColor(220, 38, 38); // Red for negative impact
  }
  pdf.text(netChangeText, 14, 140);
  pdf.text(absChangeText, 14, 146);
  
  // Reset text color
  pdf.setTextColor(60, 60, 60);
}

export function addAssetClassTable(pdf: AutoTableJsPDF, portfolioImpact: PortfolioImpact): void {
  pdf.setFontSize(16);
  pdf.setTextColor(33, 33, 33);
  pdf.text('Asset Class Impact Breakdown', 14, 160);
  
  const assetClassHeaders = [['Asset Class', 'Original Value', 'New Value', 'Change %']];
  const assetClassData = Object.entries(portfolioImpact.assetClassImpacts).map(([assetClass, impact]) => [
    assetClass,
    `$${impact.originalValue.toLocaleString()}`,
    `$${impact.impactedValue.toLocaleString()}`,
    `${impact.percentageChange >= 0 ? '+' : ''}${impact.percentageChange.toFixed(2)}%`
  ]);
  
  autoTable(pdf, {
    head: assetClassHeaders,
    body: assetClassData,
    startY: 165,
    styles: { fontSize: 10 },
    headStyles: { fillColor: [37, 99, 235], textColor: 255 },
    columnStyles: {
      0: { cellWidth: 60 },
      3: { halign: 'right' }
    },
    didDrawCell: (data) => {
      // Color the percentage change cells based on value
      if (data.column.index === 3 && data.section === 'body') {
        const text = data.cell.text[0];
        if (text.startsWith('+')) {
          pdf.setTextColor(16, 163, 74); // Green for positive
          pdf.text(text, data.cell.x + data.cell.width - 5, data.cell.y + 5, { align: 'right' });
          return false; // Don't draw the original cell text
        } else if (text.startsWith('-')) {
          pdf.setTextColor(220, 38, 38); // Red for negative
          pdf.text(text, data.cell.x + data.cell.width - 5, data.cell.y + 5, { align: 'right' });
          return false; // Don't draw the original cell text
        }
      }
    }
  });
}

export function addMostImpactedAssetsTable(pdf: AutoTableJsPDF, portfolioImpact: PortfolioImpact): void {
  pdf.addPage();
  
  pdf.setFontSize(18);
  pdf.setTextColor(33, 33, 33);
  pdf.text('Most Impacted Assets', 14, 20);
  
  // Get top 10 most impacted assets (both positive and negative)
  const sortedAssets = [...portfolioImpact.assetImpacts]
    .sort((a, b) => Math.abs(b.absoluteChange) - Math.abs(a.absoluteChange))
    .slice(0, 10);
  
  const assetHeaders = [['Asset Name', 'Asset Class', 'Original Value', 'New Value', 'Change %']];
  const assetData = sortedAssets.map(asset => [
    asset.name,
    asset.assetClass,
    `$${asset.originalValue.toLocaleString()}`,
    `$${asset.impactedValue.toLocaleString()}`,
    `${asset.percentageChange >= 0 ? '+' : ''}${asset.percentageChange.toFixed(2)}%`
  ]);
  
  autoTable(pdf, {
    head: assetHeaders,
    body: assetData,
    startY: 25,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [37, 99, 235], textColor: 255 },
    columnStyles: {
      0: { cellWidth: 50 },
      4: { halign: 'right' }
    },
    didDrawCell: (data) => {
      if (data.column.index === 4 && data.section === 'body') {
        const text = data.cell.text[0];
        if (text.startsWith('+')) {
          pdf.setTextColor(16, 163, 74);
          pdf.text(text, data.cell.x + data.cell.width - 5, data.cell.y + 5, { align: 'right' });
          return false;
        } else if (text.startsWith('-')) {
          pdf.setTextColor(220, 38, 38);
          pdf.text(text, data.cell.x + data.cell.width - 5, data.cell.y + 5, { align: 'right' });
          return false;
        }
      }
    }
  });
}

export function addPortfolioComposition(pdf: AutoTableJsPDF, holdingsData: HoldingsData): void {
  pdf.setFontSize(16);
  pdf.setTextColor(33, 33, 33);
  
  // Use a fixed Y position
  const nextSectionY = 170;
  pdf.text('Portfolio Composition', 14, nextSectionY);
  
  const assetClassData = groupAssetsByProperty(holdingsData.assets, 'assetClass');
  const allocationHeaders = [['Asset Class', 'Allocation', 'Percentage']];
  const allocationData = Object.entries(assetClassData).map(([assetClass, value]) => [
    assetClass,
    `$${value.toLocaleString()}`,
    `${((value / holdingsData.totalValue) * 100).toFixed(2)}%`
  ]);
  
  autoTable(pdf, {
    head: allocationHeaders,
    body: allocationData,
    startY: nextSectionY + 5,
    styles: { fontSize: 10 },
    headStyles: { fillColor: [37, 99, 235], textColor: 255 }
  });
}

export function addFooter(pdf: AutoTableJsPDF): void {
  const pageCount = pdf.internal.getNumberOfPages();
  const pageWidth = pdf.internal.pageSize.width;
  
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    pdf.text(`Generated by Portfolio Impact Analyzer | Page ${i} of ${pageCount}`, pageWidth / 2, pdf.internal.pageSize.height - 10, { align: 'center' });
  }
}
