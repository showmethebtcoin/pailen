
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

import DateSelector from './DateSelector';
import TimeSelector from './TimeSelector';

interface ScheduleDialogContentProps {
  taskTitle: string;
  date: Date | undefined;
  hour: number;
  minute: number;
  isSubmitting: boolean;
  onDateChange: (date: Date | undefined) => void;
  onHourChange: (hour: number) => void;
  onMinuteChange: (minute: number) => void;
  onSchedule: () => void;
  onClose: () => void;
}

const ScheduleDialogContent: React.FC<ScheduleDialogContentProps> = ({
  taskTitle,
  date,
  hour,
  minute,
  isSubmitting,
  onDateChange,
  onHourChange,
  onMinuteChange,
  onSchedule,
  onClose,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <DialogHeader>
        <DialogTitle>{t('scheduling.scheduleTask')}</DialogTitle>
        <DialogDescription>
          {t('scheduling.scheduleDescription', { task: taskTitle })}
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-4 py-4">
        <DateSelector date={date} onDateChange={onDateChange} />
        <TimeSelector
          hour={hour}
          minute={minute}
          onHourChange={onHourChange}
          onMinuteChange={onMinuteChange}
        />
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
          {t('common.cancel')}
        </Button>
        <Button onClick={onSchedule} disabled={isSubmitting}>
          {isSubmitting ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            t('scheduling.schedule')
          )}
        </Button>
      </DialogFooter>
    </>
  );
};

export default ScheduleDialogContent;
