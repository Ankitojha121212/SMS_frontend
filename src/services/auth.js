import { fetchData } from './api';
import { jwtDecode } from 'jwt-decode';

const API_BASE_URL = 'http://localhost:5000/api';

export const login = async (email, password) => {
  try {
    const data = await fetchData('auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    return data;
  } catch (error) {
    throw error;
  }
};

export const signup = async (userData) => {
  try {
    const data = await fetchData('auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    return data;
  } catch (error) {
    throw error;
  }
};

export const schoolLogin = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/school-auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.msg || 'School login failed');
    }
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    return data;
  } catch (error) {
    throw error;
  }
};

export const schoolRegister = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/school-auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.msg || 'School registration failed');
    }
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    return data;
  } catch (error) {
    throw error;
  }
};

export const getCurrentUser = () => {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      return jwtDecode(token).user;
    }
    return null;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
};

