
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Student, Test } from '@/types/student';
import { scheduledTaskService } from '@/services/api';
import ScheduleDialogContent from './ScheduleDialogContent';

interface ScheduleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  taskType: 'test' | 'lesson_topic';
  taskTitle: string;
  student?: Student;
  test?: Test;
  onScheduled?: () => void;
}

const ScheduleDialog: React.FC<ScheduleDialogProps> = ({
  isOpen,
  onClose,
  taskType,
  taskTitle,
  student,
  test,
  onScheduled
}) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [hour, setHour] = useState<number>(
    new Date().getHours() + 1 > 23 ? 0 : new Date().getHours() + 1
  );
  const [minute, setMinute] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSchedule = async () => {
    if (!date) {
      toast({
        title: t('scheduling.dateRequired'),
        description: t('scheduling.selectDate'),
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create a new date object with the selected time
      const scheduledFor = new Date(date);
      scheduledFor.setHours(hour, minute, 0, 0);

      // Check if the scheduled time is in the past
      const currentTime = new Date();
      if (scheduledFor.getTime() <= currentTime.getTime()) {
        toast({
          title: t('scheduling.invalidTime'),
          description: t('scheduling.timeInPast'),
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      const taskData: any = {
        taskType,
        scheduledFor: scheduledFor.toISOString(),
      };

      // Add the appropriate data based on task type
      if (taskType === 'test' && test) {
        taskData.testId = test.id;
        taskData.studentId = student?.id;
      } else if (taskType === 'lesson_topic' && student) {
        taskData.studentId = student.id;
      } else {
        throw new Error('Invalid task type or missing data');
      }

      await scheduledTaskService.create(taskData);

      toast({
        title: t('scheduling.taskScheduled'),
        description: t('scheduling.willBeSentAt', { 
          time: format(scheduledFor, 'PPpp') 
        }),
      });

      if (onScheduled) {
        onScheduled();
      }

      onClose();
    } catch (error) {
      console.error('Error scheduling task:', error);
      toast({
        title: t('common.error'),
        description: t('scheduling.errorScheduling'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <ScheduleDialogContent
          taskTitle={taskTitle}
          date={date}
          hour={hour}
          minute={minute}
          isSubmitting={isSubmitting}
          onDateChange={setDate}
          onHourChange={setHour}
          onMinuteChange={setMinute}
          onSchedule={handleSchedule}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleDialog;
