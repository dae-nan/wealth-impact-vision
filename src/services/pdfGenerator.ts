
import jsPDF from 'jspdf';
import { HoldingsData, PortfolioImpact, Scenario } from '@/store/types';
import { AutoTableJsPDF } from '@/utils/pdfTypes';
import {
  addHeader,
  addPortfolioSummary,
  addScenarioDetails,
  addImpactSummary,
  addAssetClassTable,
  addMostImpactedAssetsTable,
  addPortfolioComposition,
  addFooter
} from '@/utils/pdfGeneratorUtils';

export function generatePortfolioPDF(
  holdingsData: HoldingsData,
  portfolioImpact: PortfolioImpact,
  selectedScenario: Scenario
): string {
  // Initialize PDF document with type assertion
  const pdf = new jsPDF() as AutoTableJsPDF;
  
  // Add all sections to the PDF
  addHeader(pdf, 'Portfolio Scenario Analysis Report');
  addPortfolioSummary(pdf, holdingsData);
  addScenarioDetails(pdf, selectedScenario);
  addImpactSummary(pdf, portfolioImpact);
  addAssetClassTable(pdf, portfolioImpact);
  addMostImpactedAssetsTable(pdf, portfolioImpact);
  addPortfolioComposition(pdf, holdingsData);
  addFooter(pdf);
  
  // Generate filename based on scenario
  const filename = `Portfolio_Analysis_${selectedScenario?.name.replace(/\s+/g, '_')}.pdf`;
  
  // Save the PDF
  pdf.save(filename);
  
  return filename;
}
