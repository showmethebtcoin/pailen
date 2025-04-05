
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles } from 'lucide-react';

interface GenerateButtonProps {
  isGenerating: boolean;
  onGenerate: () => Promise<void>;
}

const GenerateButton: React.FC<GenerateButtonProps> = ({ isGenerating, onGenerate }) => {
  return (
    <Button onClick={onGenerate} disabled={isGenerating} className="w-full sm:w-auto">
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
};

export default GenerateButton;
