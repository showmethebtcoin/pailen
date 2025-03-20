
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ClockIcon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TimeSelectorProps {
  hour: number;
  minute: number;
  onHourChange: (hour: number) => void;
  onMinuteChange: (minute: number) => void;
}

const TimeSelector: React.FC<TimeSelectorProps> = ({ hour, minute, onHourChange, onMinuteChange }) => {
  const { t } = useTranslation();
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = [0, 15, 30, 45];

  return (
    <div className="grid gap-2">
      <div className="flex items-center gap-2">
        <ClockIcon className="h-4 w-4 opacity-70" />
        <span className="text-sm font-medium">{t('scheduling.selectTime')}</span>
      </div>
      <div className="flex gap-2">
        <Select
          value={hour.toString()}
          onValueChange={(value) => onHourChange(parseInt(value))}
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
          onValueChange={(value) => onMinuteChange(parseInt(value))}
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
  );
};

export default TimeSelector;
