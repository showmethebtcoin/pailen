
import React from 'react';
import { Button } from '@/components/ui/button';
import { Test } from '@/types/student';
import { Loader2, Send, Download, Copy, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  
  const handleCopy = () => {
    onCopyToClipboard();
    toast({
      title: "Copied to clipboard",
      description: "Test content has been copied to your clipboard"
    });
  };

  if (!generatedTest) {
    return (
      <Button onClick={onGenerateTest} disabled={isGenerating} className="w-full sm:w-auto">
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" />
            Generate Test
          </>
        )}
      </Button>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-2 w-full">
      <Button variant="outline" onClick={handleCopy} className="flex-1">
        <Copy className="mr-2 h-4 w-4" />
        Copy
      </Button>
      <Button variant="outline" className="flex-1">
        <Download className="mr-2 h-4 w-4" />
        Download
      </Button>
      <Button onClick={onSendTest} disabled={isSending} className="flex-1">
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
