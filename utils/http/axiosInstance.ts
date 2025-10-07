import axios from 'axios';

export const axiosInstance = axios.create({

  // baseURL: 'http://localhost:8080/api/v1/',
  baseURL: 'https://api.stage.newwave4.org/api/v1/',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export const axiosOpenInstance = axios.create({
  baseURL: 'https://api.stage.newwave4.org/api/v1/',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});