
import axios from 'axios';

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir token a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación y refrescar token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Si el error es 401 (Unauthorized) y no hemos intentado refrescar el token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Intentar refrescar el token
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (!refreshToken) {
          // Si no hay refresh token, forzar logout
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          return Promise.reject(error);
        }
        
        // Llamar al endpoint de refresh token
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL || '/api'}/auth/refresh-token`,
          { refreshToken }
        );
        
        // Guardar el nuevo token
        const newToken = response.data.token;
        localStorage.setItem('token', newToken);
        
        // Reintentar la petición original con el nuevo token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axios(originalRequest);
        
      } catch (refreshError) {
        // Si falla el refresco, logout
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Servicios de autenticación
const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    
    // Guardar refresh token
    if (response.data.refreshToken) {
      localStorage.setItem('refreshToken', response.data.refreshToken);
    }
    
    return response.data;
  },
  
  register: async (email, password, name) => {
    const response = await api.post('/auth/register', { email, password, name });
    
    // Guardar refresh token
    if (response.data.refreshToken) {
      localStorage.setItem('refreshToken', response.data.refreshToken);
    }
    
    return response.data;
  },
  
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },
  
  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },
  
  resetPassword: async (token, newPassword) => {
    const response = await api.post('/auth/reset-password', { 
      token, 
      password: newPassword 
    });
    return response.data;
  }
};

// Servicio para estudiantes
const studentService = {
  getAll: async () => {
    const response = await api.get('/students');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/students/${id}`);
    return response.data;
  },
  
  create: async (studentData) => {
    const response = await api.post('/students', studentData);
    return response.data;
  },
  
  update: async (id, studentData) => {
    const response = await api.put(`/students/${id}`, studentData);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/students/${id}`);
    return response.data;
  },
  
  // Nuevos métodos para gestionar temas de clase
  getStudentTopic: async (id) => {
    const response = await api.get(`/students/${id}/topic`);
    return response.data;
  },
  
  updateStudentTopic: async (id, topic) => {
    const response = await api.post(`/students/${id}/topic`, { topic });
    return response.data;
  }
};

// Servicio para tests
const testService = {
  getAll: async () => {
    const response = await api.get('/tests');
    return response.data;
  },
  
  getByStudent: async (studentId) => {
    const response = await api.get(`/tests?studentId=${studentId}`);
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/tests/${id}`);
    return response.data;
  },
  
  create: async (testData) => {
    const response = await api.post('/tests', testData);
    return response.data;
  },
  
  generateTest: async (studentId, options) => {
    const response = await api.post('/tests/generate', { studentId, options });
    return response.data;
  },
  
  sendTest: async (testId) => {
    const response = await api.post('/tests/send', { testId });
    return response.data;
  },
  
  update: async (id, testData) => {
    const response = await api.put(`/tests/${id}`, testData);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/tests/${id}`);
    return response.data;
  },
  
  uploadToDrive: async (testId, fileData) => {
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
  
  downloadFromDrive: async (fileId) => {
    const response = await api.get(`/tests/download-from-drive/${fileId}`, {
      responseType: 'blob'
    });
    return response.data;
  }
};

// Exportar los servicios
export { api, authService, studentService, testService };
