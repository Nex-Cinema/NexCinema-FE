import axios, { AxiosError } from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'https://cinema-booking-system-backend-t6z2.onrender.com/api';

export const axiosPublic = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

axiosPublic.interceptors.response.use(
  (response) => response.data,
  (error: AxiosError) => Promise.reject(error)
);

export default axiosPublic;
