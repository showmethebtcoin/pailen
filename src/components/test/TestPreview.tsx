
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Test } from '@/types/student';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { FileText } from 'lucide-react';

interface TestPreviewProps {
  test: Test | null;
}

const TestPreview: React.FC<TestPreviewProps> = ({ test }) => {
  if (!test) return null;
  
  return (
    <Card className="border-dashed">
      <CardHeader className="pb-3">
        <div className="flex items-center">
          <FileText className="h-5 w-5 mr-2 text-primary" />
          <CardTitle className="text-base">Test Preview</CardTitle>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="pt-4">
        <div className="space-y-2">
          <Label htmlFor="generatedContent" className="text-sm font-medium">Generated Test Content</Label>
          <Textarea
            id="generatedContent"
            value={test.content}
            readOnly
            className="font-mono text-xs h-60 resize-none bg-muted/50"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default TestPreview;
