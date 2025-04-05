
import { api } from './apiClient';

// Servicio para tareas programadas
const scheduledTaskService = {
  getAll: async () => {
    const response = await api.get('/scheduled-tasks');
    return response.data.tasks;
  },
  
  create: async (taskData: any) => {
    const response = await api.post('/scheduled-tasks', taskData);
    return response.data.task;
  },
  
  cancel: async (taskId: string) => {
    const response = await api.delete(`/scheduled-tasks/${taskId}`);
    return response.data;
  },
};

export { scheduledTaskService };
