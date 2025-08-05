import axios from 'axios';
import { toast } from 'react-toastify';
import { ApiEndpoint } from './enums/api-endpoint';

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error); // → це обробить .catch
    } else {
      prom.resolve(token); // → це обробить .then
    }
  });
  failedQueue = [];
};

export const axiosInstance = axios.create({
  // baseURL: 'http://localhost:8080/api/v1/',
  baseURL: 'https://api.stage.newwave4.org/api/v1/',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

axiosInstance.interceptors.response.use(
  response => {
    console.log('✅ Відповідь успішна:', response.config.url);
    return response;
  },
  async error => {
    const originalRequest = error.config;

    console.warn(
      '❌ Помилка відповіді:',
      error.response?.status,
      originalRequest?.url,
    );

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes(ApiEndpoint.REFRESHTOKEN)
    ) {
      originalRequest._retry = true;

      console.warn('🔁 Неавторизований — спроба оновити токен...');

      if (isRefreshing) {
        console.log('⏳ Очікуємо завершення поточного оновлення токена...');
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => axiosInstance(originalRequest))
          .catch(err => {
            console.error('⛔ Помилка при повторі запиту:', err);
            return Promise.reject(err);
          });
      }

      isRefreshing = true;

      try {
        console.log('🔐 Відправляємо refresh token запит...');
        await axiosInstance.post(ApiEndpoint.REFRESHTOKEN);

        processQueue(null); // <--- викличе всі resolve(token)

        console.log(
          '📤 Повторно відправляємо оригінальний запит:',
          originalRequest.url,
        );
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error('⛔ Оновлення токена не вдалося:', refreshError);

        processQueue(refreshError); // <--- викличе всі reject(refreshError)

        toast.error('Сесія завершена. Увійдіть повторно.');

        if (typeof window !== 'undefined') {
          console.log('🚪 Редірект на /admin');
          window.location.href = '/admin';
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
