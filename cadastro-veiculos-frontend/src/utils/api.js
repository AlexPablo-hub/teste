import axios from 'axios';
import { useAuthStore } from '@/store/auth';
import { getActivePinia } from 'pinia';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
if (!apiBaseUrl) {
  throw new Error("❌ VITE_API_BASE_URL não definida!");
}

const api = axios.create({
  baseURL: apiBaseUrl,
});

api.interceptors.request.use((config) => {
  const pinia = getActivePinia();
  if (pinia) {
    const auth = useAuthStore(pinia);
    if (auth.token) {
      config.headers.Authorization = `Bearer ${auth.token}`;
    }
  }
  return config;
});

export default api;
