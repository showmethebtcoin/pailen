
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { CalendarIcon, ClockIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Student, Test } from '@/types/student';
import { scheduledTaskService } from '@/services/api';

interface ScheduleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  taskType: 'test' | 'lesson_topic';
  taskTitle: string;
  student?: Student;
  test?: Test;
  onScheduled?: () => void;
}

const hours = Array.from({ length: 24 }, (_, i) => i);
const minutes = [0, 15, 30, 45];

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
      if (scheduledFor <= new Date()) {
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
        <DialogHeader>
          <DialogTitle>{t('scheduling.scheduleTask')}</DialogTitle>
          <DialogDescription>
            {t('scheduling.scheduleDescription', { task: taskTitle })}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 opacity-70" />
              <span className="text-sm font-medium">{t('scheduling.selectDate')}</span>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  {date ? format(date, 'PPP') : <span>{t('scheduling.pickDate')}</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  disabled={(date) => date < new Date() - 86400000}
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid gap-2">
            <div className="flex items-center gap-2">
              <ClockIcon className="h-4 w-4 opacity-70" />
              <span className="text-sm font-medium">{t('scheduling.selectTime')}</span>
            </div>
            <div className="flex gap-2">
              <Select
                value={hour.toString()}
                onValueChange={(value) => setHour(parseInt(value))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t('scheduling.hour')} />
                </SelectTrigger>
                <SelectContent>
                  {hours.map((h) => (
                    <SelectItem key={h} value={h.toString()}>
                      {h.toString().padStart(2, '0')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="flex items-center">:</span>
              <Select
                value={minute.toString()}
                onValueChange={(value) => setMinute(parseInt(value))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t('scheduling.minute')} />
                </SelectTrigger>
                <SelectContent>
                  {minutes.map((m) => (
                    <SelectItem key={m} value={m.toString()}>
                      {m.toString().padStart(2, '0')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleSchedule} disabled={isSubmitting}>
            {isSubmitting ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              t('scheduling.schedule')
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleDialog;
