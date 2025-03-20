
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ScheduledTaskCard from './ScheduledTaskCard';

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

interface TaskListContainerProps {
  tasks: ScheduledTask[];
  onCancelTask: (taskId: string) => void;
}

const TaskListContainer: React.FC<TaskListContainerProps> = ({ tasks, onCancelTask }) => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('scheduling.scheduledTasks')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tasks.map((task) => (
            <ScheduledTaskCard
              key={task.id}
              task={task}
              onCancelTask={onCancelTask}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskListContainer;
