
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface DownloadButtonProps {
  onDownload: () => void;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ onDownload }) => {
  return (
    <Button variant="outline" onClick={onDownload} className="flex-1">
      <Download className="mr-2 h-4 w-4" />
      Download PDF
    </Button>
  );
};

export default DownloadButton;
