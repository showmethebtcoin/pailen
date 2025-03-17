
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Student, Test } from '@/types/student';
import { useTestGenerator } from '@/hooks/useTestGenerator';

import TestOptions from './test/TestOptions';
import TestPreview from './test/TestPreview';
import TestActions from './test/TestActions';

interface TestGeneratorProps {
  student: Student;
  onTestCreated?: (test: Test) => void;
}

const TestGenerator: React.FC<TestGeneratorProps> = ({ student, onTestCreated }) => {
  const {
    options,
    setOptions,
    generatedTest,
    isGenerating,
    isSending,
    handleGenerateTest,
    handleSendTest,
    handleCopyToClipboard
  } = useTestGenerator(student, onTestCreated);

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
