
import { usePortfolioStore } from '@/store/portfolioStore';
import { Button } from './ui/button';
import { FileText, Download } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Asset } from '@/store/types';
import { groupAssetsByProperty } from '@/utils/csvParser';

export const PDFReportGenerator = () => {
  const { holdingsData, portfolioImpact, scenarios, selectedScenarioId } = usePortfolioStore();
  
  if (!holdingsData || !portfolioImpact || !selectedScenarioId) {
    return null;
  }

  const selectedScenario = scenarios.find(s => s.id === selectedScenarioId);
  
  const generatePDF = () => {
    try {
      // Initialize PDF document
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.width;
      
      // Add header
      pdf.setFontSize(22);
      pdf.setTextColor(33, 33, 33);
      pdf.text('Portfolio Scenario Analysis Report', pageWidth / 2, 20, { align: 'center' });
      
      // Add metadata
      pdf.setFontSize(12);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, 28, { align: 'center' });
      
      // Portfolio summary section
      pdf.setFontSize(18);
      pdf.setTextColor(33, 33, 33);
      pdf.text('Portfolio Summary', 14, 40);
      
      pdf.setFontSize(11);
      pdf.setTextColor(60, 60, 60);
      pdf.text(`Portfolio Owner: ${holdingsData.individualName}`, 14, 50);
      pdf.text(`Total Portfolio Value: $${holdingsData.totalValue.toLocaleString()}`, 14, 56);
      pdf.text(`Last Updated: ${holdingsData.lastUpdated.toLocaleDateString()}`, 14, 62);
      pdf.text(`Total Assets: ${holdingsData.assets.length}`, 14, 68);
      
      // Scenario details
      pdf.setFontSize(18);
      pdf.setTextColor(33, 33, 33);
      pdf.text('Scenario Analysis', 14, 82);
      
      pdf.setFontSize(11);
      pdf.setTextColor(60, 60, 60);
      pdf.text(`Scenario: ${selectedScenario?.name}`, 14, 92);
      pdf.text(`Description: ${selectedScenario?.description}`, 14, 98);
      pdf.text(`Duration: ${selectedScenario?.duration}`, 14, 104);
      
      // Impact summary
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
      
      // Asset Class Impact Table
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
      
      // Add a new page for most impacted assets
      pdf.addPage();
      
      pdf.setFontSize(18);
      pdf.setTextColor(33, 33, 33);
      pdf.text('Most Impacted Assets', 14, 20);
      
      // Get top 5 most impacted assets (both positive and negative)
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
      
      // Asset allocation chart data (simplified display in PDF)
      pdf.setFontSize(16);
      pdf.setTextColor(33, 33, 33);
      pdf.text('Portfolio Composition', 14, pdf.lastAutoTable.finalY + 20);
      
      const assetClassData2 = groupAssetsByProperty(holdingsData.assets, 'assetClass');
      const allocationHeaders = [['Asset Class', 'Allocation', 'Percentage']];
      const allocationData = Object.entries(assetClassData2).map(([assetClass, value]) => [
        assetClass,
        `$${value.toLocaleString()}`,
        `${((value / holdingsData.totalValue) * 100).toFixed(2)}%`
      ]);
      
      autoTable(pdf, {
        head: allocationHeaders,
        body: allocationData,
        startY: pdf.lastAutoTable.finalY + 25,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [37, 99, 235], textColor: 255 }
      });
      
      // Add a footer
      const pageCount = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(150, 150, 150);
        pdf.text(`Generated by Portfolio Impact Analyzer | Page ${i} of ${pageCount}`, pageWidth / 2, pdf.internal.pageSize.height - 10, { align: 'center' });
      }
      
      // Save the PDF
      pdf.save(`Portfolio_Analysis_${selectedScenario?.name.replace(/\s+/g, '_')}.pdf`);
      
      // Show success toast
      toast({
        title: "Report Generated",
        description: "Your PDF report has been successfully generated.",
        duration: 3000,
      });
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error Generating Report",
        description: "There was a problem creating your PDF report.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };
  
  return (
    <Button
      variant="outline"
      className="flex gap-2 items-center"
      onClick={generatePDF}
      disabled={!selectedScenarioId || !portfolioImpact}
    >
      <FileText className="w-4 h-4" />
      <span>Generate PDF Report</span>
      <Download className="w-4 h-4" />
    </Button>
  );
};
