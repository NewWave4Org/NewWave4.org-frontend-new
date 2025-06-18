import axios from 'axios';
import { prefix } from '../prefix';

export const axiosInstance = axios.create({
  baseURL: prefix,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});
