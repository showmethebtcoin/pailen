
import React from 'react';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';

interface CopyButtonProps {
  onCopy: () => void;
}

const CopyButton: React.FC<CopyButtonProps> = ({ onCopy }) => {
  return (
    <Button variant="outline" onClick={onCopy} className="flex-1">
      <Copy className="mr-2 h-4 w-4" />
      Copy
    </Button>
  );
};

export default CopyButton;
