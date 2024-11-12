// AuthService.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface TokenResponse {
  access: string;
  refresh: string;
}

// Get the refresh token from storage
export const getRefreshToken = async (): Promise<string | null> => {
  try {
    const userStr = await AsyncStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr) as User;
      return user.refresh || null;
    }
    return null;
  } catch (error) {
    console.error('Error getting refresh token:', error);
    return null;
  }
};

// Update stored tokens
export const updateTokens = async (tokens: TokenResponse): Promise<void> => {
  try {
    const userStr = await AsyncStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr) as User;
      user.access = tokens.access;
      user.refresh = tokens.refresh;
      await AsyncStorage.setItem('user', JSON.stringify(user));
    }
  } catch (error) {
    console.error('Error updating tokens:', error);
    throw new Error('Failed to update tokens in storage');
  }
};

export const register = async (registerData: RegisterData): Promise<User> => {
  try {
    const response = await axios.post<User>(API_URL + 'register/', registerData);
    if (response.data.access) {
      await AsyncStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Registration error details:', error.response?.data);
      throw new Error(`Registration failed: ${error.response?.data?.detail || error.message}`);
    } else {
      console.error('Unexpected registration error:', error);
      throw new Error('An unexpected error occurred during registration');
    }
  }
};

export const login = async (username: string, password: string): Promise<User> => {
  try {
    const response = await axios.post<User>(API_URL + 'login/', { username, password });
    if (response.data.access) {
      await AsyncStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Login error details:', error.response?.data);
      throw new Error(`Login failed: ${error.response?.data?.detail || error.message}`);
    } else {
      console.error('Unexpected login error:', error);
      throw new Error('An unexpected error occurred during login');
    }
  }
};

export const logout = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem('user');
  } catch (error) {
    console.error('Error during logout:', error);
    throw new Error('Failed to logout');
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  try {
    const userStr = await AsyncStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr) as User;
      return user.access || null;
    }
    return null;
  } catch (error) {
    console.error('Error getting access token:', error);
    return null;
  }
};

export const refreshToken = async (refresh: string): Promise<TokenResponse> => {
  try {
    const response = await axios.post<TokenResponse>(
      API_URL + 'token/refresh/',
      { refresh }
    );
    
    if (response.data.access && response.data.refresh) {
      await updateTokens(response.data);
      return response.data;
    }
    
    throw new Error('Invalid token refresh response');
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Token refresh error details:', error.response?.data);
      throw new Error(`Token refresh failed: ${error.response?.data?.detail || error.message}`);
    } else {
      console.error('Unexpected token refresh error:', error);
      throw new Error('An unexpected error occurred during token refresh');
    }
  }
};

export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const token = await getAccessToken();
    const refreshTokenValue = await getRefreshToken();
    
    if (!token && !refreshTokenValue) {
      return false;
    }
    
    if (!token && refreshTokenValue) {
      // Try to refresh the token if we only have a refresh token
      try {
        await refreshToken(refreshTokenValue);
        return true;
      } catch {
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error checking authentication status:', error);
    return false;
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const userStr = await AsyncStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr) as User;
    }
    return null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};