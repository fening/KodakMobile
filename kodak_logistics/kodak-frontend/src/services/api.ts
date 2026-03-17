import axios from 'axios';
import { getAccessToken } from './AuthService';

const api = axios.create({
  baseURL: 'https://kodaklogisticsapi.up.railway.app/api/',
});

api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;