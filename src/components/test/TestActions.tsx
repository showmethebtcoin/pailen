
import React from 'react';
import { Button } from '@/components/ui/button';
import { Test } from '@/types/student';
import { Loader2, Send, Download, Copy, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { jsPDF } from 'jspdf';

interface TestActionsProps {
  generatedTest: Test | null;
  isGenerating: boolean;
  isSending: boolean;
  onGenerateTest: () => Promise<void>;
  onSendTest: () => Promise<void>;
  onCopyToClipboard: () => void;
}

const TestActions: React.FC<TestActionsProps> = ({
  generatedTest,
  isGenerating,
  isSending,
  onGenerateTest,
  onSendTest,
  onCopyToClipboard
}) => {
  const { toast } = useToast();
  
  const handleCopy = () => {
    onCopyToClipboard();
    toast({
      title: "Copied to clipboard",
      description: "Test content has been copied to your clipboard"
    });
  };

  const handleDownloadPDF = () => {
    if (!generatedTest) return;
    
    try {
      const doc = new jsPDF();
      
      // Configurar título
      doc.setFontSize(16);
      doc.text(generatedTest.title, 20, 20);
      
      // Configurar contenido
      doc.setFontSize(12);
      
      // Dividir el contenido en líneas
      const contentLines = generatedTest.content.split('\n');
      let y = 30;
      
      contentLines.forEach(line => {
        // Comprobar si es un título de sección (comenzando con #)
        if (line.startsWith('# ')) {
          y += 5;
          doc.setFontSize(14);
          doc.text(line.substring(2), 20, y);
          doc.setFontSize(12);
          y += 7;
        } 
        // Comprobar si es un subtítulo (comenzando con ##)
        else if (line.startsWith('## ')) {
          y += 3;
          doc.setFontSize(13);
          doc.text(line.substring(3), 20, y);
          doc.setFontSize(12);
          y += 6;
        }
        // Texto normal
        else if (line.trim() !== '') {
          // Añadir salto de página si es necesario
          if (y > 280) {
            doc.addPage();
            y = 20;
          }
          
          doc.text(line, 20, y);
          y += 6;
        }
        else {
          y += 3; // Espacios en blanco
        }
      });
      
      // Generar nombre del archivo
      const fileName = `${generatedTest.language}_Test_${generatedTest.level}_${new Date().toISOString().split('T')[0]}.pdf`;
      
      // Descargar PDF
      doc.save(fileName);
      
      toast({
        title: "PDF Downloaded",
        description: `Test has been downloaded as ${fileName}`
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Download Failed",
        description: "There was an error creating the PDF. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (!generatedTest) {
    return (
      <Button onClick={onGenerateTest} disabled={isGenerating} className="w-full sm:w-auto">
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" />
            Generate Test
          </>
        )}
      </Button>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-2 w-full">
      <Button variant="outline" onClick={handleCopy} className="flex-1">
        <Copy className="mr-2 h-4 w-4" />
        Copy
      </Button>
      <Button variant="outline" onClick={handleDownloadPDF} className="flex-1">
        <Download className="mr-2 h-4 w-4" />
        Download PDF
      </Button>
      <Button onClick={onSendTest} disabled={isSending} className="flex-1">
        {isSending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            Send to Student
          </>
        )}
      </Button>
    </div>
  );
};

export default TestActions;
