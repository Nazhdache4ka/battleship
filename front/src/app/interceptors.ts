import { type InternalAxiosRequestConfig } from 'axios';
import { axiosConfig, useAuthStore } from '@/shared';
import { AuthService } from '@/features';

const isAuthUrl = (url = '') => /\/auth\/(login|register|logout|refresh)(\?|$)/.test(url);

let refreshPromise: Promise<string> | null = null;

const doRefresh = async (): Promise<string> => {
  if (refreshPromise) return refreshPromise;

  refreshPromise = AuthService.refresh()
    .then(response => {
      const accessToken = response.accessToken;
      localStorage.setItem('accessToken', accessToken);
      return accessToken;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
};

export function setupAxiosInterceptors() {
  axiosConfig.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    if (typeof config.url === 'string' && !isAuthUrl(config.url)) {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    return config;
  });

  axiosConfig.interceptors.response.use(
    response => response,
    async error => {
      const originalRequest = error.config;

      if (error.response?.status !== 401) {
        return Promise.reject(error);
      }

      if (typeof originalRequest.url === 'string' && originalRequest.url.includes('/auth/refresh')) {
        localStorage.removeItem('accessToken');
        useAuthStore.getState().setIsAuth(false);
        useAuthStore.getState().setUser(null);
        window.location.href = '/login';
        return Promise.reject(error);
      }

      if (originalRequest._retry) {
        return Promise.reject(error);
      }

      try {
        const token = await doRefresh();
        originalRequest._retry = true;
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return axiosConfig(originalRequest);
      } catch {
        localStorage.removeItem('accessToken');
        useAuthStore.getState().setIsAuth(false);
        useAuthStore.getState().setUser(null);
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }
  );
}
