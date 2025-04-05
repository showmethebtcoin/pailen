
import { api } from './apiClient';

// Servicio para estudiantes
const studentService = {
  getAll: async () => {
    const response = await api.get('/students');
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get(`/students/${id}`);
    return response.data;
  },
  
  create: async (studentData: any) => {
    const response = await api.post('/students', studentData);
    return response.data;
  },
  
  update: async (id: string, studentData: any) => {
    const response = await api.put(`/students/${id}`, studentData);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete(`/students/${id}`);
    return response.data;
  },
  
  // Métodos para gestionar temas de clase
  getStudentTopic: async (id: string) => {
    const response = await api.get(`/students/${id}/topic`);
    return response.data;
  },
  
  updateStudentTopic: async (id: string, topic: string) => {
    const response = await api.post(`/students/${id}/topic`, { topic });
    return response.data;
  }
};

export { studentService };
