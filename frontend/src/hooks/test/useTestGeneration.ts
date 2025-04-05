
import { useState } from 'react';
import { generateTest } from '@/utils/openai';
import { Student, Test, TestGenerationOptions } from '@/types/student';
import { useToast } from '@/hooks/use-toast';
import { testService } from '@/services/api';

export function useTestGeneration(student: Student, onTestCreated?: (test: Test) => void) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTest, setGeneratedTest] = useState<Test | null>(null);
  const [options, setOptions] = useState<TestGenerationOptions>({
    language: student.language,
    level: student.level,
    questionCount: 10,
    includeAnswers: true,
  });
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
      
      return newTest;
    } catch (error) {
      console.error("Error generating test:", error);
      toast({
        title: "Test Generation Failed",
        description: "There was an error generating the test. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    options,
    setOptions,
    generatedTest,
    setGeneratedTest,
    isGenerating,
    handleGenerateTest
  };
}
