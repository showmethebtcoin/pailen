
import { useState } from 'react';
import { generateTest } from '@/utils/openai';
import { Student, Test, TestGenerationOptions } from '@/types/student';
import { sendTestEmail } from '@/utils/email';
import { useToast } from '@/hooks/use-toast';
import { testService } from '@/services/api';

export function useTestGenerator(student: Student, onTestCreated?: (test: Test) => void) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [options, setOptions] = useState<TestGenerationOptions>({
    language: student.language,
    level: student.level,
    questionCount: 10,
    includeAnswers: true,
  });
  const [generatedTest, setGeneratedTest] = useState<Test | null>(null);
  const { toast } = useToast();

  const handleGenerateTest = async () => {
    setIsGenerating(true);
    try {
      // Intenta primero usar la API del backend para generar el test
      let newTest: Test;
      
      try {
        console.log('Trying to generate test through backend API');
        const response = await testService.generateTest(student.id, options);
        newTest = response.test;
      } catch (apiError) {
        console.log('Backend API generation failed, falling back to client-side generation', apiError);
        // Si la API falla, usa el método local como respaldo
        const content = await generateTest(options);
        
        newTest = {
          id: `test-${Date.now()}`,
          studentId: student.id,
          title: `${options.language} Test - Level ${options.level}`,
          language: options.language,
          level: options.level,
          content,
          createdAt: new Date().toISOString(),
          status: 'draft',
        };
        
        // Intenta guardar el test generado localmente en el backend
        try {
          const savedTest = await testService.create(newTest);
          newTest = savedTest;
        } catch (saveError) {
          console.warn('Could not save locally generated test to backend', saveError);
        }
      }
      
      setGeneratedTest(newTest);
      
      if (onTestCreated) {
        onTestCreated(newTest);
      }
      
      toast({
        title: "Test Generated",
        description: "Your test has been successfully generated",
      });
    } catch (error) {
      console.error("Error generating test:", error);
      toast({
        title: "Test Generation Failed",
        description: "There was an error generating the test. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendTest = async () => {
    if (!generatedTest) return;
    
    setIsSending(true);
    try {
      // Intenta primero usar la API del backend para enviar el test
      let success = false;
      let updatedTest: Test = generatedTest;
      
      try {
        console.log('Trying to send test through backend API');
        const response = await testService.sendTest(generatedTest.id);
        success = true;
        updatedTest = response.test;
      } catch (apiError) {
        console.log('Backend API sending failed, falling back to client-side sending', apiError);
        // Si la API falla, usa el método local como respaldo
        success = await sendTestEmail(student, generatedTest);
        
        if (success) {
          updatedTest = {
            ...generatedTest,
            sentAt: new Date().toISOString(),
            status: 'sent',
          };
          
          // Intenta actualizar el estado del test en el backend
          try {
            await testService.update(generatedTest.id, { 
              status: 'sent', 
              sentAt: updatedTest.sentAt 
            });
          } catch (updateError) {
            console.warn('Could not update test status in backend', updateError);
          }
        }
      }
      
      if (success) {
        setGeneratedTest(updatedTest);
        
        if (onTestCreated) {
          onTestCreated(updatedTest);
        }
        
        toast({
          title: "Test Sent",
          description: `Test successfully sent to ${student.email}`,
        });
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
    } finally {
      setIsSending(false);
    }
  };

  const handleCopyToClipboard = () => {
    if (!generatedTest) return;
    
    navigator.clipboard.writeText(generatedTest.content);
    toast({
      title: "Copied to Clipboard",
      description: "Test content has been copied to clipboard",
    });
  };

  return {
    options,
    setOptions,
    generatedTest,
    isGenerating,
    isSending,
    handleGenerateTest,
    handleSendTest,
    handleCopyToClipboard
  };
}
