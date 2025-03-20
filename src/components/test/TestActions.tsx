
import React from 'react';
import { Button } from '@/components/ui/button';
import { Test } from '@/types/student';
import { Loader2, Send, Download, Copy, Sparkles, CloudUpload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { jsPDF } from 'jspdf';

interface TestActionsProps {
  generatedTest: Test | null;
  isGenerating: boolean;
  isSending: boolean;
  isUploading?: boolean;
  driveLink?: string | null;
  onGenerateTest: () => Promise<void>;
  onSendTest: () => Promise<void>;
  onCopyToClipboard: () => void;
  onUploadToDrive?: () => Promise<void>;
}

const TestActions: React.FC<TestActionsProps> = ({
  generatedTest,
  isGenerating,
  isSending,
  isUploading = false,
  driveLink,
  onGenerateTest,
  onSendTest,
  onCopyToClipboard,
  onUploadToDrive
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
  
  const handleUploadToDrive = async () => {
    if (!generatedTest || !onUploadToDrive) return;
    
    try {
      await onUploadToDrive();
    } catch (error) {
      console.error("Error uploading to Drive:", error);
      toast({
        title: "Upload Failed",
        description: "Could not upload the test to Google Drive.",
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
      {onUploadToDrive && (
        driveLink ? (
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => window.open(driveLink, '_blank')}
          >
            <CloudUpload className="mr-2 h-4 w-4" />
            View in Drive
          </Button>
        ) : (
          <Button 
            variant="outline" 
            onClick={handleUploadToDrive} 
            disabled={isUploading}
            className="flex-1"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <CloudUpload className="mr-2 h-4 w-4" />
                Save to Drive
              </>
            )}
          </Button>
        )
      )}
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
