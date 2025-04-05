
import { useState } from 'react';
import { Test } from '@/types/student';
import { useToast } from '@/hooks/use-toast';
import { testService } from '@/services/api';
import { saveTestToDrive } from '@/utils/googleDrive';

export function useDriveOperations() {
  const [isUploading, setIsUploading] = useState(false);
  const [driveLink, setDriveLink] = useState<string | null>(null);
  const { toast } = useToast();

  const handleUploadToDrive = async (testToUpload: Test | null) => {
    if (!testToUpload) return;
    
    setIsUploading(true);
    try {
      // Intenta primero usar la API del backend
      let savedTest;
      
      try {
        console.log('Trying to upload to Drive through backend API');
        if (testToUpload.id) {
          // Convertir el contenido a un Blob para enviar
          const blob = new Blob([testToUpload.content], { type: 'text/plain' });
          const file = new File([blob], `${testToUpload.title}.txt`, { type: 'text/plain' });
          
          const response = await testService.uploadToDrive(testToUpload.id, file);
          savedTest = response;
        }
      } catch (apiError) {
        console.log('Backend API upload failed, falling back to client-side upload', apiError);
        // Si la API falla, usa el método local como respaldo
        savedTest = await saveTestToDrive(testToUpload);
      }
      
      if (savedTest && (savedTest.webViewLink || savedTest.webContentLink)) {
        setDriveLink(savedTest.webViewLink || savedTest.webContentLink);
        
        toast({
          title: "Saved to Drive",
          description: "Test has been successfully saved to Google Drive",
        });
        return savedTest.webViewLink || savedTest.webContentLink;
      } else {
        throw new Error("Failed to upload to Drive");
      }
    } catch (error) {
      console.error("Error uploading to Drive:", error);
      toast({
        title: "Drive Upload Failed",
        description: "There was an error saving the test to Google Drive.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    isUploading,
    driveLink,
    handleUploadToDrive,
    setDriveLink
  };
}
