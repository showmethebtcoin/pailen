
import { useState } from 'react';
import { Student, Test } from '@/types/student';
import { sendTestEmail } from '@/utils/email';
import { useToast } from '@/hooks/use-toast';
import { testService } from '@/services/api';

export function useTestSending(student: Student, onTestUpdated?: (test: Test) => void) {
  const [isSending, setIsSending] = useState(false);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleSendTest = async (testToSend: Test | null) => {
    if (!testToSend) return null;
    
    setIsSending(true);
    try {
      // Intenta primero usar la API del backend para enviar el test
      let success = false;
      let updatedTest: Test = testToSend;
      
      try {
        console.log('Trying to send test through backend API');
        const response = await testService.sendTest(testToSend.id);
        success = true;
        updatedTest = response.test;
      } catch (apiError) {
        console.log('Backend API sending failed, falling back to client-side sending', apiError);
        // Si la API falla, usa el método local como respaldo
        success = await sendTestEmail(student, testToSend);
        
        if (success) {
          updatedTest = {
            ...testToSend,
            sentAt: new Date().toISOString(),
            status: 'sent',
          };
          
          // Intenta actualizar el estado del test en el backend
          try {
            await testService.update(testToSend.id, { 
              status: 'sent', 
              sentAt: updatedTest.sentAt 
            });
          } catch (updateError) {
            console.warn('Could not update test status in backend', updateError);
          }
        }
      }
      
      if (success) {
        if (onTestUpdated) {
          onTestUpdated(updatedTest);
        }
        
        toast({
          title: "Test Sent",
          description: `Test successfully sent to ${student.email}`,
        });
        
        return updatedTest;
      } else {
        throw new Error("Failed to send test");
      }
    } catch (error) {
      console.error("Error sending test:", error);
      toast({
        title: "Failed to Send Test",
        description: "There was an error sending the test. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsSending(false);
    }
  };

  return {
    isSending,
    handleSendTest,
    isScheduleDialogOpen,
    setIsScheduleDialogOpen
  };
}
