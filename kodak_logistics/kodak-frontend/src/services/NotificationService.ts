import axios from 'axios';
import { Notification } from '../components/Notification';
import { getAccessToken } from './AuthService';

const API_URL = 'https://kodaklogisticsapi.up.railway.app/api/';

const apiClient = axios.create({
  baseURL: API_URL,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const fetchNotifications = async (showAll = false): Promise<Notification[]> => {
  try {
    const response = await apiClient.get<Notification[]>(`notifications/?show_all=${showAll}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

export const markNotificationAsRead = async (id: string): Promise<void> => {
  try {
    await apiClient.post(`notifications/${id}/read/`, { isRead: true });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};
