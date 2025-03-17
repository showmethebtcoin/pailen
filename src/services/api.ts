
import axios from 'axios';

// Configuración base de axios
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Crear instancia de axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token a las solicitudes
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

// Interceptor para manejar errores globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si el error es 401 (Unauthorized), redirigir a login
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Servicios de autenticación
export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  register: async (name: string, email: string, password: string) => {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  },
  
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
};

// Servicios de estudiantes
export const studentService = {
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
};

// Servicios de tests
export const testService = {
  getAll: async () => {
    const response = await api.get('/tests');
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
  
  generate: async (options: any) => {
    const response = await api.post('/tests/generate', options);
    return response.data;
  },
  
  send: async (testId: string) => {
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
};

// Servicios de pago
export const paymentService = {
  createCheckoutSession: async (priceId: string, successUrl: string, cancelUrl: string) => {
    const response = await api.post('/stripe/create-checkout-session', {
      priceId,
      successUrl,
      cancelUrl
    });
    return response.data;
  },
  
  getSubscriptionStatus: async () => {
    const response = await api.get('/stripe/subscription-status');
    return response.data;
  },
  
  cancelSubscription: async () => {
    const response = await api.post('/stripe/cancel-subscription');
    return response.data;
  },
};

export default api;
