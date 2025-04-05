
import { api } from './apiClient';

// Servicio para tests
const testService = {
  getAll: async () => {
    const response = await api.get('/tests');
    return response.data;
  },
  
  getByStudent: async (studentId: string) => {
    const response = await api.get(`/tests?studentId=${studentId}`);
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get(`/tests/${id}`);
    return response.data;
  },
  
  create: async (testData: any) => {
    const response = await api.post('/tests', testData);
    return response.data;
  },
  
  generateTest: async (studentId: string, options: any) => {
    const response = await api.post('/tests/generate', { studentId, options });
    return response.data;
  },
  
  sendTest: async (testId: string) => {
    const response = await api.post('/tests/send', { testId });
    return response.data;
  },
  
  update: async (id: string, testData: any) => {
    const response = await api.put(`/tests/${id}`, testData);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete(`/tests/${id}`);
    return response.data;
  },
  
  uploadToDrive: async (testId: string, fileData: File) => {
    const formData = new FormData();
    formData.append('testId', testId);
    formData.append('file', fileData);
    
    const response = await api.post('/tests/upload-to-drive', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  downloadFromDrive: async (fileId: string) => {
    const response = await api.get(`/tests/download-from-drive/${fileId}`, {
      responseType: 'blob'
    });
    return response.data;
  }
};

export { testService };
