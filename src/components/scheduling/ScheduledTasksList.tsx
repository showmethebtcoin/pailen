
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { scheduledTaskService } from '@/services/api';
import TaskListContainer from './TaskListContainer';
import LoadingTasksList from './LoadingTasksList';
import EmptyTasksList from './EmptyTasksList';

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
    return <LoadingTasksList />;
  }

  if (pendingTasks.length === 0) {
    return <EmptyTasksList />;
  }

  return (
    <TaskListContainer 
      tasks={pendingTasks} 
      onCancelTask={handleCancelTask} 
    />
  );
};

export default ScheduledTasksList;
