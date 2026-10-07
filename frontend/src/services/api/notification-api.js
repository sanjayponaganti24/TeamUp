import api from './axios.js';

export const getNotifications = async (params = {}) => {
  const res = await api.get('/notification-api', { params });
  return res.data;
};

export const markAsRead = async (notificationId) => {
  const res = await api.patch(`/notification-api/${notificationId}/read`);
  return res.data;
};

export const markAllAsRead = async () => {
  const res = await api.patch('/notification-api/read-all');
  return res.data;
};
