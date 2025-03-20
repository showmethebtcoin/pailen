
import React from 'react';
import { Button } from '@/components/ui/button';
import { CloudUpload, Loader2 } from 'lucide-react';

interface DriveButtonProps {
  isUploading: boolean;
  driveLink: string | null;
  onUpload: () => Promise<void>;
}

const DriveButton: React.FC<DriveButtonProps> = ({ isUploading, driveLink, onUpload }) => {
  if (driveLink) {
    return (
      <Button 
        variant="outline" 
        className="flex-1"
        onClick={() => window.open(driveLink, '_blank')}
      >
        <CloudUpload className="mr-2 h-4 w-4" />
        View in Drive
      </Button>
    );
  }
  
  return (
    <Button 
      variant="outline" 
      onClick={onUpload} 
      disabled={isUploading}
      className="flex-1"
    >
      {isUploading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Uploading...
        </>
      ) : (
        <>
          <CloudUpload className="mr-2 h-4 w-4" />
          Save to Drive
        </>
      )}
    </Button>
  );
};

export default DriveButton;
