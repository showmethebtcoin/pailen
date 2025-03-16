
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Test } from '@/types/student';

interface TestPreviewProps {
  test: Test | null;
}

const TestPreview: React.FC<TestPreviewProps> = ({ test }) => {
  if (!test) return null;
  
  return (
    <div className="space-y-2">
      <Label htmlFor="generatedContent">Generated Test</Label>
      <Textarea
        id="generatedContent"
        value={test.content}
        readOnly
        className="font-mono text-xs h-60"
      />
    </div>
  );
};

export default TestPreview;
