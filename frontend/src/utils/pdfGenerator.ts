
import { Test } from '@/types/student';
import { jsPDF } from 'jspdf';

export const generateTestPdf = (test: Test): string => {
  if (!test) return '';
  
  try {
    const doc = new jsPDF();
    
    // Configure title
    doc.setFontSize(16);
    doc.text(test.title, 20, 20);
    
    // Configure content
    doc.setFontSize(12);
    
    // Split content into lines
    const contentLines = test.content.split('\n');
    let y = 30;
    
    contentLines.forEach(line => {
      // Check if it's a section title (starting with #)
      if (line.startsWith('# ')) {
        y += 5;
        doc.setFontSize(14);
        doc.text(line.substring(2), 20, y);
        doc.setFontSize(12);
        y += 7;
      } 
      // Check if it's a subtitle (starting with ##)
      else if (line.startsWith('## ')) {
        y += 3;
        doc.setFontSize(13);
        doc.text(line.substring(3), 20, y);
        doc.setFontSize(12);
        y += 6;
      }
      // Normal text
      else if (line.trim() !== '') {
        // Add page break if needed
        if (y > 280) {
          doc.addPage();
          y = 20;
        }
        
        doc.text(line, 20, y);
        y += 6;
      }
      else {
        y += 3; // White spaces
      }
    });
    
    // Generate filename
    const fileName = `${test.language}_Test_${test.level}_${new Date().toISOString().split('T')[0]}.pdf`;
    
    // Save PDF
    doc.save(fileName);
    
    return fileName;
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
};
