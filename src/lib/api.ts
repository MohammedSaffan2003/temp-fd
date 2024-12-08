import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong';
    throw new Error(message);
  }
);

export const apiService = {
  auth: {
    login: async (email: string, password: string) => {
      const response = await api.post('/auth/login', { email, password });
      return response;
    },
    register: async (username: string, email: string, password: string) => {
      const response = await api.post('/auth/register', { username, email, password });
      return response;
    },
  },
  content: {
    upload: (formData: FormData) =>
      api.post('/content/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
    getAll: (params?: any) => api.get('/content', { params }),
    getFeatured: () => api.get('/content/featured'),
    getById: (id: string) => api.get(`/content/${id}`),
    delete: (id: string) => api.delete(`/content/${id}`),
  },
  search: {
    aiSearch: (query: string) => api.get('/search/ai', { params: { q: query } }),
  },
  ratings: {
    submit: (contentId: string, data: { rating: number; review?: string }) =>
      api.post(`/ratings/${contentId}`, data),
    getForContent: (contentId: string) => api.get(`/ratings/${contentId}`),
  },
  rewards: {
    giveReward: (data: { creatorId: string; contentId: string; rewardType: string }) =>
      api.post('/rewards/give', data),
    getStats: () => api.get('/rewards/stats'),
  },
  user: {
    updateProfile: (data: FormData) =>
      api.patch('/users/profile', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
    getProfile: () => api.get('/users/profile'),
  },
  creator: {
    getStats: () => api.get('/creator/stats'),
  },
};

export { api };