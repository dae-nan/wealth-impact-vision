
import { usePortfolioStore } from '@/store/portfolioStore';
import { Button } from './ui/button';
import { FileText, Download } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { generatePortfolioPDF } from '@/services/pdfGenerator';

export const PDFReportGenerator = () => {
  const { holdingsData, portfolioImpact, scenarios, selectedScenarioId } = usePortfolioStore();
  
  if (!holdingsData || !portfolioImpact || !selectedScenarioId) {
    return null;
  }

  const selectedScenario = scenarios.find(s => s.id === selectedScenarioId);
  
  const handleGeneratePDF = () => {
    try {
      const filename = generatePortfolioPDF(holdingsData, portfolioImpact, selectedScenario!);
      
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
      onClick={handleGeneratePDF}
      disabled={!selectedScenarioId || !portfolioImpact}
    >
      <FileText className="w-4 h-4" />
      <span>Generate PDF Report</span>
      <Download className="w-4 h-4" />
    </Button>
  );
};
