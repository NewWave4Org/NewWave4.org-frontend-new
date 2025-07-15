import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: 'https://api.stage.newwave4.org/api/v1/',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});
