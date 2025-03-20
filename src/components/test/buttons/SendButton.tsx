
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Test, Student } from '@/types/student';
import ScheduleDialog from '@/components/scheduling/ScheduleDialog';

interface SendButtonProps {
  test: Test | null;
  student: Student;
  isSending: boolean;
  onSendTest: () => Promise<void>;
}

const SendButton: React.FC<SendButtonProps> = ({ test, student, isSending, onSendTest }) => {
  const { t } = useTranslation();
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  if (!test) return null;

  const handleOpenSchedule = () => {
    setIsScheduleOpen(true);
  };

  const handleCloseSchedule = () => {
    setIsScheduleOpen(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="default"
            size="sm"
            className="gap-1"
            disabled={isSending || test?.status === 'sent'}
          >
            {isSending ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <Mail className="h-4 w-4" />
            )}
            <span>{t('students.send')}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onSendTest}>
            <Mail className="h-4 w-4 mr-2" />
            {t('scheduling.sendNow')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleOpenSchedule}>
            <Clock className="h-4 w-4 mr-2" />
            {t('scheduling.scheduleDelivery')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ScheduleDialog
        isOpen={isScheduleOpen}
        onClose={handleCloseSchedule}
        taskType="test"
        taskTitle={test.title}
        student={student}
        test={test}
      />
    </>
  );
};

export default SendButton;
