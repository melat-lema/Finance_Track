import axios from 'axios';
import { toast } from 'react-toastify';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, 
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          console.error('Bad Request:', data.message);
          break;
        case 401:
          console.error('Unauthorized:', data.message);
          clearSession();
          toast.error('Session expired. Please login again.');
          break;
        case 403:
          console.error('Forbidden:', data.message);
          break;
        case 404:
          console.error('Resource Not Found:', data.message);
          break;
        case 409:
          console.error('Conflict:', data.message);
          break;
        case 500:
          console.error('Server Error:', data.message);
          break;
        default:
          console.error('API Error:', data.message || error.message);
      }
    } else if (error.request) {
     
      console.error('No response received:', error.request);
      if (error.code === 'ECONNREFUSED' || error.message === 'Network Error') {
        toast.error('Cannot connect to server. Please check your connection.');
      }
    } else {
      console.error('Request error:', error.message);
    }
    
    return Promise.reject(error);
  }
);
export const authApi = {
  register: async (data) => {
    const response = await axiosClient.post('/auth/register', {
      username: data.username?.trim(),
      email: data.email?.trim().toLowerCase(),
      password: data.password,
    });
    return response.data;
  },
  login: async (credentials) => {
    const response = await axiosClient.post('/auth/login', {
      username: credentials.username?.trim(),
      password: credentials.password,
    });
    return response.data;
  },

  getMe: async () => {
    const response = await axiosClient.get('/auth/me');
    return response.data;
  },
    updateUsername: async (newUsername) => {
    const response = await axiosClient.put('/auth/profile', {
      username: newUsername.trim(),
    });
    return response.data;
  },
};

export const userApi = {
 
  getById: async (id) => {
    const response = await axiosClient.get(`/users/${id}`);
    return response.data;
  },
};

export const transactionApi = {
  create: async (data) => {
    const response = await axiosClient.post('/transactions', {
      amount: parseFloat(data.amount),
      type: data.type,
      category: data.category,
      description: data.description?.trim() || null,
      date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
    });
    return response.data;
  },

  getAll: async (params = {}) => {
    const response = await axiosClient.get('/transactions', { params });
    return response.data; 
  },
  getById: async (id) => {
    const response = await axiosClient.get(`/transactions/${id}`);
    return response.data;
  },

  update: async (id, updates) => {
    const response = await axiosClient.put(`/transactions/${id}`, {
      ...updates,
      amount: updates.amount !== undefined ? parseFloat(updates.amount) : undefined,
      date: updates.date ? new Date(updates.date).toISOString() : undefined,
    });
    return response.data;
  },

  delete: async (id) => {
    const response = await axiosClient.delete(`/transactions/${id}`);
    return response.data;
  },
};

export const summaryApi = {

  get: async () => {
    
    const response = await axiosClient.get('/summary');
    return response.data;  // Returns { status,  summary }
  },
};

export const setAuth = (token, user) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};


export const clearSession = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};


export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};


export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error('Failed to parse user from localStorage:', error);
    return null;
  }
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const forceLogout = () => {
  clearSession();
  if (window.location.pathname !== '/login' && window.location.pathname !== '/signup') {
    window.location.href = '/login';
  }
};

export default axiosClient;