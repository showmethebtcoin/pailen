
import React from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { Clock, Calendar, X, Mail } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { scheduledTaskService } from '@/services/api';

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

const ScheduledTasksList: React.FC = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['scheduledTasks'],
    queryFn: async () => {
      const data = await scheduledTaskService.getAll();
      return data || [];
    },
  });

  const cancelMutation = useMutation({
    mutationFn: (taskId: string) => scheduledTaskService.cancel(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduledTasks'] });
      toast({
        title: t('scheduling.taskCanceled'),
        description: t('scheduling.taskCanceledDescription'),
      });
    },
    onError: (error) => {
      console.error('Error canceling task:', error);
      toast({
        title: t('common.error'),
        description: t('scheduling.errorCanceling'),
        variant: "destructive",
      });
    },
  });

  const handleCancelTask = (taskId: string) => {
    if (confirm(t('scheduling.confirmCancel'))) {
      cancelMutation.mutate(taskId);
    }
  };

  const pendingTasks = tasks.filter(task => task.status === 'pending');

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-10">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (pendingTasks.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">{t('scheduling.noTasks')}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('scheduling.scheduledTasks')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pendingTasks.map((task) => (
            <div 
              key={task.id} 
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
                  onClick={() => handleCancelTask(task.id)}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ScheduledTasksList;
