
import { useToast } from '@/hooks/use-toast';
import { Test } from '@/types/student';

export function useClipboard() {
  const { toast } = useToast();

  const handleCopyToClipboard = (test: Test | null) => {
    if (!test) return;
    
    navigator.clipboard.writeText(test.content);
    toast({
      title: "Copied to Clipboard",
      description: "Test content has been copied to clipboard",
    });
  };

  return {
    handleCopyToClipboard
  };
}
