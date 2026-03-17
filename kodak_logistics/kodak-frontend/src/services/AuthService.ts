import axios from 'axios';

const API_URL = 'https://kodaklogisticsapi.up.railway.app/api/';

export interface User {
  access: string;
  refresh: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
}

export const login = async (username: string, password: string): Promise<User> => {
  const response = await axios.post<User>(API_URL + 'login/', { username, password });
  if (response.data.access) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

export const register = async (username: string, email: string, password: string, password2: string): Promise<User> => {
  const response = await axios.post<User>(API_URL + 'register/', { username, email, password, password2 });
  if (response.data.access) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

export const logout = (): void => {
  localStorage.removeItem('user');
};

export const getAccessToken = (): string | null => {
  const user = JSON.parse(localStorage.getItem('user') || '{}') as User;
  return user.access || null;
};

export const getRefreshToken = (): string | null => {
  const user = JSON.parse(localStorage.getItem('user') || '{}') as User;
  return user.refresh || null;
};

export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    return JSON.parse(userStr) as User;
  }
  return null;
};

export const isAuthenticated = (): boolean => {
  return !!getAccessToken();
};

export const refreshToken = async (refresh: string): Promise<{ access: string, refresh: string }> => {
  const response = await axios.post<{ access: string, refresh: string }>(API_URL + 'token/refresh/', { refresh });
  const user = getCurrentUser();
  if (user && response.data.access) {
    user.access = response.data.access;
    user.refresh = response.data.refresh || user.refresh;
    localStorage.setItem('user', JSON.stringify(user));
  }
  return response.data;
};