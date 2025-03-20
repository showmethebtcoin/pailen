
import React from 'react';
import { Test } from '@/types/student';
import { useToast } from '@/hooks/use-toast';
import { generateTestPdf } from '@/utils/pdfGenerator';

// Import button components
import GenerateButton from './buttons/GenerateButton';
import CopyButton from './buttons/CopyButton';
import DownloadButton from './buttons/DownloadButton';
import DriveButton from './buttons/DriveButton';
import SendButton from './buttons/SendButton';

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
      const fileName = generateTestPdf(generatedTest);
      
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

  // If no test is generated yet, show only the generate button
  if (!generatedTest) {
    return <GenerateButton isGenerating={isGenerating} onGenerate={onGenerateTest} />;
  }

  // Show all action buttons when a test is available
  return (
    <div className="flex flex-col sm:flex-row gap-2 w-full">
      <CopyButton onCopy={handleCopy} />
      <DownloadButton onDownload={handleDownloadPDF} />
      
      {onUploadToDrive && (
        <DriveButton 
          isUploading={isUploading} 
          driveLink={driveLink || null} 
          onUpload={handleUploadToDrive} 
        />
      )}
      
      <SendButton isSending={isSending} onSend={onSendTest} />
    </div>
  );
};

export default TestActions;
