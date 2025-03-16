
import React from 'react';
import { Button } from '@/components/ui/button';
import { Test } from '@/types/student';
import { Loader2, Send, Download, Copy } from 'lucide-react';

interface TestActionsProps {
  generatedTest: Test | null;
  isGenerating: boolean;
  isSending: boolean;
  onGenerateTest: () => Promise<void>;
  onSendTest: () => Promise<void>;
  onCopyToClipboard: () => void;
}

const TestActions: React.FC<TestActionsProps> = ({
  generatedTest,
  isGenerating,
  isSending,
  onGenerateTest,
  onSendTest,
  onCopyToClipboard
}) => {
  if (!generatedTest) {
    return (
      <Button onClick={onGenerateTest} disabled={isGenerating}>
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          'Generate Test'
        )}
      </Button>
    );
  }

  return (
    <div className="flex gap-2">
      <Button variant="outline" onClick={onCopyToClipboard}>
        <Copy className="mr-2 h-4 w-4" />
        Copy
      </Button>
      <Button variant="outline">
        <Download className="mr-2 h-4 w-4" />
        Download
      </Button>
      <Button onClick={onSendTest} disabled={isSending}>
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
