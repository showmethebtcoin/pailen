
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Send } from 'lucide-react';

interface SendButtonProps {
  isSending: boolean;
  onSend: () => Promise<void>;
}

const SendButton: React.FC<SendButtonProps> = ({ isSending, onSend }) => {
  return (
    <Button onClick={onSend} disabled={isSending} className="flex-1">
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
  );
};

export default SendButton;
