import api from './axios.js';

export const register = async (userData) => {
  const res = await api.post('/auth-api/register', userData);
  return res.data;
};

export const login = async (credentials) => {
  const res = await api.post('/auth-api/login', credentials);
  return res.data;
};

export const logout = async () => {
  const res = await api.post('/auth-api/logout');
  return res.data;
};

export const getMe = async () => {
  const res = await api.get('/auth-api/me');
  return res.data;
};

export const forgotPassword = async (email) => {
  const res = await api.post('/auth-api/forgot-password', { email });
  return res.data;
};

export const resetPassword = async (token, newPassword) => {
  const res = await api.post('/auth-api/reset-password', { token, newPassword });
  return res.data;
};
