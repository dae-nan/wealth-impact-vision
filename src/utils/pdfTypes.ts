
import jsPDF from 'jspdf';

// Define a type that extends jsPDF with properties added by autotable
export type AutoTableJsPDF = jsPDF & {
  lastAutoTable?: {
    finalY: number;
  };
  internal: {
    getNumberOfPages: () => number;
    pageSize: {
      width: number;
      height: number;
    };
  };
};
