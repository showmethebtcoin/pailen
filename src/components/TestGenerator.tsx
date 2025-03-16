
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { generateTest } from '@/utils/openai';
import { Student, Test, TestGenerationOptions } from '@/types/student';
import { sendTestEmail } from '@/utils/email';
import { useToast } from '@/hooks/use-toast';

import TestOptions from './test/TestOptions';
import TestPreview from './test/TestPreview';
import TestActions from './test/TestActions';

interface TestGeneratorProps {
  student: Student;
  onTestCreated?: (test: Test) => void;
}

const TestGenerator: React.FC<TestGeneratorProps> = ({ student, onTestCreated }) => {
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
      const content = await generateTest(options);
      
      const newTest: Test = {
        id: `test-${Date.now()}`,
        studentId: student.id,
        title: `${options.language} Test - Level ${options.level}`,
        language: options.language,
        level: options.level,
        content,
        createdAt: new Date().toISOString(),
        status: 'draft',
      };
      
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
      const success = await sendTestEmail(student, generatedTest);
      
      if (success) {
        const updatedTest: Test = {
          ...generatedTest,
          sentAt: new Date().toISOString(),
          status: 'sent',
        };
        
        setGeneratedTest(updatedTest);
        
        if (onTestCreated) {
          onTestCreated(updatedTest);
        }
        
        toast({
          title: "Test Sent",
          description: `Test successfully sent to ${student.email}`,
        });
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

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Generate Test</CardTitle>
        <CardDescription>
          Create a personalized test for {student.name} based on their language ({student.language}) and level ({student.level})
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <TestOptions 
          options={options} 
          setOptions={setOptions} 
          isGenerating={isGenerating} 
        />
        
        <TestPreview test={generatedTest} />
      </CardContent>
      <CardFooter className="flex justify-between">
        <TestActions 
          generatedTest={generatedTest}
          isGenerating={isGenerating}
          isSending={isSending}
          onGenerateTest={handleGenerateTest}
          onSendTest={handleSendTest}
          onCopyToClipboard={handleCopyToClipboard}
        />
      </CardFooter>
    </Card>
  );
};

export default TestGenerator;
