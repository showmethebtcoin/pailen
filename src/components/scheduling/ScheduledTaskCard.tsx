
import React from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { Clock, Calendar, X, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ScheduledTask {
  id: string;
  taskType: 'test' | 'lesson_topic';
  scheduledFor: string;
  status: 'pending' | 'completed' | 'failed';
  student?: {
    id: string;
    name: string;
    email: string;
  };
  test?: {
    id: string;
    title: string;
  };
}

interface ScheduledTaskCardProps {
  task: ScheduledTask;
  onCancelTask: (taskId: string) => void;
}

const ScheduledTaskCard: React.FC<ScheduledTaskCardProps> = ({ task, onCancelTask }) => {
  const { t } = useTranslation();

  return (
    <div 
      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg"
    >
      <div className="flex items-start gap-3 mb-3 sm:mb-0">
        <div className="bg-primary/10 p-2 rounded-full">
          <Mail className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h4 className="font-medium">
            {task.taskType === 'test' 
              ? t('scheduling.testDelivery', { title: task.test?.title }) 
              : t('scheduling.lessonTopic')}
          </h4>
          <p className="text-sm text-muted-foreground">
            {t('scheduling.for')} {task.student?.name} ({task.student?.email})
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{format(new Date(task.scheduledFor), 'PP')}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{format(new Date(task.scheduledFor), 'p')}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="outline">
          {t('scheduling.pending')}
        </Badge>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => onCancelTask(task.id)}
          className="h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ScheduledTaskCard;
